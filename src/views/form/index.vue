<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

interface UserForm {
  name: string
  email: string
  phone: string
  gender: string
  birthday: string
  bio: string
}

const formRef = ref<FormInstance>()
const form = reactive<UserForm>({
  name: '',
  email: '',
  phone: '',
  gender: '',
  birthday: '',
  bio: '',
})

const rules = reactive<FormRules<UserForm>>({
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' },
  ],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
})

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      ElMessage({ type: 'success', message: '提交成功', plain: true })
    }
  })
}

const onReset = (formEl: FormInstance | undefined) => {
  formEl?.resetFields()
}
</script>

<template>
  <div class="form-page">
    <div class="page-header">
      <h2 class="page-title">表单示例</h2>
      <p class="page-desc">基础表单组件展示，包含常用的输入、选择等控件</p>
    </div>

    <div class="form-card">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" class="main-form">
        <div class="form-section">
          <div class="section-title">基本信息</div>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="form.name" placeholder="请输入姓名" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性别" prop="gender">
                <el-select v-model="form.gender" placeholder="请选择性别" style="width: 100%">
                  <el-option label="男" value="male" />
                  <el-option label="女" value="female" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="form.email" placeholder="请输入邮箱" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号" prop="phone">
                <el-input v-model="form.phone" placeholder="请输入手机号" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="生日" prop="birthday">
                <el-date-picker
                  v-model="form.birthday"
                  type="date"
                  placeholder="请选择生日"
                  style="width: 100%"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="form-section">
          <div class="section-title">其他信息</div>
          <el-form-item label="个人简介" prop="bio">
            <el-input
              v-model="form.bio"
              type="textarea"
              :rows="4"
              placeholder="请输入个人简介"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </div>

        <div class="form-actions">
          <el-button @click="onReset(formRef)">重置</el-button>
          <el-button type="primary" @click="onSubmit(formRef)">提交</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.form-page {
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

.form-card {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.06);
  max-width: 800px;
}

.form-section {
  margin-bottom: 28px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #5a6080;
  margin-bottom: 20px;
  padding-left: 10px;
  border-left: 3px solid #6366f1;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 8px;
  border-top: 1px solid #f0f0f5;
}

:deep(.el-input__wrapper),
:deep(.el-textarea__inner) {
  border-radius: 8px;
  transition: box-shadow 0.2s;
}

:deep(.el-button) {
  border-radius: 8px;
  padding: 10px 24px;
}
</style>
