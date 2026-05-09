<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useUserInfoStore } from '@/stores/modules/userInfo'
import { mockGetUserInfo } from '@/api/user'

const userInfoStore = useUserInfoStore()
const editing = ref(false)
const formRef = ref<FormInstance>()

// 刷新时 profile 可能为空（store 未持久化），重新拉取
onMounted(async () => {
  if (!userInfoStore.profile && userInfoStore.token) {
    const info = await mockGetUserInfo(userInfoStore.token)
    userInfoStore.profile = info
    userInfoStore.userName = info.userName
  }
})

const p = computed(() => userInfoStore.profile)

const editForm = reactive({ name: '', email: '', phone: '', position: '', department: '', bio: '' })

const startEdit = () => {
  if (!p.value) return
  Object.assign(editForm, {
    name: p.value.userName,
    email: p.value.email,
    phone: p.value.phone,
    position: p.value.position,
    department: p.value.department,
    bio: p.value.bio,
  })
  editing.value = true
}

const cancelEdit = () => { editing.value = false }

const saveEdit = async (formEl: FormInstance | undefined) => {
  if (!formEl || !p.value) return
  await formEl.validate((valid) => {
    if (valid) {
      userInfoStore.profile = {
        ...p.value!,
        userName: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        position: editForm.position,
        department: editForm.department,
        bio: editForm.bio,
      }
      userInfoStore.userName = editForm.name
      editing.value = false
      ElMessage({ type: 'success', message: '保存成功', plain: true })
    }
  })
}

const roleLabel: Record<string, string> = { admin: '管理员', editor: '编辑员', viewer: '访客' }
</script>

<template>
  <div class="profile-page">
    <div class="page-header">
      <h2 class="page-title">个人中心</h2>
      <p class="page-desc">查看和管理您的个人信息</p>
    </div>

    <template v-if="p">
      <div class="stats-row">
        <div v-for="stat in p.stats" :key="stat.label" class="stat-card">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>

      <div class="profile-layout">
        <div class="profile-left">
          <div class="avatar-card">
            <div class="avatar-circle">{{ p.userName.slice(-2) }}</div>
            <div class="user-name">{{ p.userName }}</div>
            <div class="user-role">{{ p.position }}</div>
            <div class="user-dept">
              <span class="role-badge" :class="p.role">{{ roleLabel[p.role] ?? p.role }}</span>
              {{ p.department }}
            </div>
            <div class="user-meta">
              <div class="meta-item">
                <span class="meta-icon">📅</span>
                <span>{{ p.joinDate }} 入职</span>
              </div>
              <div class="meta-item">
                <span class="meta-icon">📧</span>
                <span>{{ p.email }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-icon">📱</span>
                <span>{{ p.phone }}</span>
              </div>
            </div>
          </div>

          <div class="skills-card">
            <div class="card-title">技能标签</div>
            <div class="skills-list">
              <span v-for="skill in p.skills" :key="skill" class="skill-tag">{{ skill }}</span>
            </div>
          </div>

          <div class="activity-card">
            <div class="card-title">最近动态</div>
            <div class="activity-list">
              <div v-for="(act, i) in p.activities" :key="i" class="activity-item">
                <div class="activity-dot" :class="act.type"></div>
                <div class="activity-content">
                  <div class="activity-action">{{ act.action }}</div>
                  <div class="activity-time">{{ act.time }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="profile-right">
          <div class="info-card">
            <div class="card-header">
              <div class="card-title">基本信息</div>
              <el-button v-if="!editing" size="small" @click="startEdit">编辑</el-button>
            </div>

            <template v-if="!editing">
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">姓名</div>
                  <div class="info-value">{{ p.userName }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">邮箱</div>
                  <div class="info-value">{{ p.email }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">手机号</div>
                  <div class="info-value">{{ p.phone }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">职位</div>
                  <div class="info-value">{{ p.position }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">部门</div>
                  <div class="info-value">{{ p.department }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">入职日期</div>
                  <div class="info-value">{{ p.joinDate }}</div>
                </div>
                <div class="info-item full">
                  <div class="info-label">个人简介</div>
                  <div class="info-value">{{ p.bio }}</div>
                </div>
              </div>
            </template>

            <template v-else>
              <el-form ref="formRef" :model="editForm" label-width="80px" class="edit-form">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="姓名" prop="name" :rules="[{ required: true, message: '请输入姓名' }]">
                      <el-input v-model="editForm.name" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="邮箱" prop="email">
                      <el-input v-model="editForm.email" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="手机号" prop="phone">
                      <el-input v-model="editForm.phone" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="职位" prop="position">
                      <el-input v-model="editForm.position" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="部门" prop="department">
                      <el-input v-model="editForm.department" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="个人简介" prop="bio">
                      <el-input v-model="editForm.bio" type="textarea" :rows="3" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <div class="edit-actions">
                  <el-button @click="cancelEdit">取消</el-button>
                  <el-button type="primary" @click="saveEdit(formRef)">保存</el-button>
                </div>
              </el-form>
            </template>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.profile-page {
  padding: 32px;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
}

.page-header { margin-bottom: 24px; }

.page-title {
  font-size: 22px;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0 0 8px;
}

.page-desc { font-size: 14px; color: #8a8fa8; margin: 0; }

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  background: #fff;
  border-radius: 14px;
  padding: 20px 24px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.05);
  text-align: center;
  border-top: 3px solid #6366f1;
  transition: transform 0.2s, box-shadow 0.2s;

  &:nth-child(2) { border-top-color: #8b5cf6; }
  &:nth-child(3) { border-top-color: #10b981; }
  &:nth-child(4) { border-top-color: #f59e0b; }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(99, 102, 241, 0.12);
  }
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a2e;
  letter-spacing: -0.5px;
}

.stat-label { font-size: 13px; color: #8a8fa8; margin-top: 4px; }

.profile-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 20px;
  align-items: start;
}

.avatar-card,
.skills-card,
.activity-card,
.info-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;

  &:last-child { margin-bottom: 0; }
}

.avatar-card { text-align: center; }

.avatar-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.35);
}

.user-name {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 4px;
}

.user-role {
  font-size: 13px;
  color: #6366f1;
  font-weight: 500;
  margin-bottom: 8px;
}

.user-dept {
  font-size: 13px;
  color: #8a8fa8;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.role-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;

  &.admin { background: rgba(99, 102, 241, 0.1); color: #6366f1; }
  &.editor { background: rgba(16, 185, 129, 0.1); color: #10b981; }
  &.viewer { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
}

.user-meta {
  text-align: left;
  border-top: 1px solid #f0f0f5;
  padding-top: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #5a6080;
  margin-bottom: 10px;

  &:last-child { margin-bottom: 0; }
}

.meta-icon { font-size: 15px; }

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .card-title { margin-bottom: 0; }
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  padding: 4px 12px;
  background: rgba(99, 102, 241, 0.08);
  color: #6366f1;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.activity-list { display: flex; flex-direction: column; }

.activity-item {
  display: flex;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5fa;

  &:last-child { border-bottom: none; }
}

.activity-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 5px;
  flex-shrink: 0;

  &.primary { background: #6366f1; }
  &.success { background: #10b981; }
  &.info { background: #60a5fa; }
  &.warning { background: #f59e0b; }
  &.danger { background: #ef4444; }
}

.activity-action { font-size: 13px; color: #1a1a2e; margin-bottom: 2px; }
.activity-time { font-size: 12px; color: #8a8fa8; }

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.info-item { &.full { grid-column: 1 / -1; } }
.info-label { font-size: 12px; color: #8a8fa8; margin-bottom: 4px; }
.info-value { font-size: 14px; color: #1a1a2e; font-weight: 500; }

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 8px;
  border-top: 1px solid #f0f0f5;
  margin-top: 8px;
}

:deep(.el-button) { border-radius: 8px; }
</style>