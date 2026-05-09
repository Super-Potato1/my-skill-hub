<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

interface SimpleForm {
  name: string
  email: string
  phone: string
  gender: string
  birthday: string
  bio: string
}

const formRef = ref<FormInstance>()
const form = reactive<SimpleForm>({
  name: '',
  email: '',
  phone: '',
  gender: '',
  birthday: '',
  bio: '',
})

const rules = reactive<FormRules<SimpleForm>>({
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
    if (valid) ElMessage({ type: 'success', message: '提交成功', plain: true })
  })
}
</script>

<template>
  <div class="form-page">
    <div class="page-header">
      <h2 class="page-title">简单表单</h2>
      <p class="page-desc">基础表单控件展示，包含输入、选择、日期等常用组件</p>
    </div>
    <div class="form-card">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
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
          <el-col :span="24">
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
          </el-col>
        </el-row>
        <div class="form-actions">
          <el-button @click="formRef?.resetFields()">重置</el-button>
          <el-button type="primary" @click="onSubmit(formRef)">提交</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use './form-shared';
</style>
