<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'

const editing = ref(false)
const formRef = ref<FormInstance>()

const userInfo = reactive({
  name: '李明',
  email: 'liming@example.com',
  phone: '138****8888',
  role: '前端开发工程师',
  department: '技术部',
  joinDate: '2023-06-01',
  bio: '热爱技术，专注于前端开发，擅长 Vue、React 等框架。',
  avatar: '',
})

const editForm = reactive({ ...userInfo })

const startEdit = () => {
  Object.assign(editForm, userInfo)
  editing.value = true
}

const cancelEdit = () => {
  editing.value = false
}

const saveEdit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      Object.assign(userInfo, editForm)
      editing.value = false
      ElMessage({ type: 'success', message: '保存成功', plain: true })
    }
  })
}

const activities = ref([
  { time: '2026-05-08 10:23', action: '提交了表单数据', type: 'primary' },
  { time: '2026-05-07 16:45', action: '更新了个人信息', type: 'success' },
  { time: '2026-05-06 09:12', action: '查看了数据图表', type: 'info' },
  { time: '2026-05-05 14:30', action: '登录系统', type: 'warning' },
  { time: '2026-05-04 11:00', action: '修改了密码', type: 'danger' },
])

const initials = userInfo.name.slice(-2)
</script>

<template>
  <div class="profile-page">
    <div class="page-header">
      <h2 class="page-title">个人中心</h2>
      <p class="page-desc">查看和管理您的个人信息</p>
    </div>

    <div class="profile-layout">
      <div class="profile-left">
        <div class="avatar-card">
          <div class="avatar-circle">{{ initials }}</div>
          <div class="user-name">{{ userInfo.name }}</div>
          <div class="user-role">{{ userInfo.role }}</div>
          <div class="user-dept">{{ userInfo.department }}</div>
          <div class="user-meta">
            <div class="meta-item">
              <span class="meta-icon">📅</span>
              <span>{{ userInfo.joinDate }} 入职</span>
            </div>
            <div class="meta-item">
              <span class="meta-icon">📧</span>
              <span>{{ userInfo.email }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-icon">📱</span>
              <span>{{ userInfo.phone }}</span>
            </div>
          </div>
        </div>

        <div class="activity-card">
          <div class="card-title">最近动态</div>
          <div class="activity-list">
            <div v-for="(act, i) in activities" :key="i" class="activity-item">
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
                <div class="info-value">{{ userInfo.name }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">邮箱</div>
                <div class="info-value">{{ userInfo.email }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">手机号</div>
                <div class="info-value">{{ userInfo.phone }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">职位</div>
                <div class="info-value">{{ userInfo.role }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">部门</div>
                <div class="info-value">{{ userInfo.department }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">入职日期</div>
                <div class="info-value">{{ userInfo.joinDate }}</div>
              </div>
              <div class="info-item full">
                <div class="info-label">个人简介</div>
                <div class="info-value">{{ userInfo.bio }}</div>
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
                  <el-form-item label="职位" prop="role">
                    <el-input v-model="editForm.role" />
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
  </div>
</template>

<style scoped lang="scss">
.profile-page {
  padding: 32px;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
}

.page-header {
  margin-bottom: 28px;
}

.page-title {
  font-size: 22px;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0 0 8px;
}

.page-desc {
  font-size: 14px;
  color: #8a8fa8;
  margin: 0;
}

.profile-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 20px;
  align-items: start;
}

.avatar-card,
.activity-card,
.info-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.05);
}

.avatar-card {
  text-align: center;
  margin-bottom: 16px;
}

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
  margin-bottom: 4px;
}

.user-dept {
  font-size: 13px;
  color: #8a8fa8;
  margin-bottom: 20px;
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

.meta-icon {
  font-size: 15px;
}

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

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

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

.activity-action {
  font-size: 13px;
  color: #1a1a2e;
  margin-bottom: 2px;
}

.activity-time {
  font-size: 12px;
  color: #8a8fa8;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.info-item {
  &.full { grid-column: 1 / -1; }
}

.info-label {
  font-size: 12px;
  color: #8a8fa8;
  margin-bottom: 4px;
}

.info-value {
  font-size: 14px;
  color: #1a1a2e;
  font-weight: 500;
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 8px;
  border-top: 1px solid #f0f0f5;
  margin-top: 8px;
}

:deep(.el-button) {
  border-radius: 8px;
}
</style>
