<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'

const step = ref(0)
const formRef = ref<FormInstance>()

const form = reactive({
  // step 1
  company: '', industry: '', scale: '',
  // step 2
  contact: '', position: '', email: '', phone: '',
  // step 3
  budget: '', deadline: '', desc: '', priority: 'medium',
})

const rules = {
  company: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
  industry: [{ required: true, message: '请选择行业', trigger: 'change' }],
  contact: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
  email: [{ required: true, type: 'email' as const, message: '邮箱格式不正确', trigger: 'blur' }],
  phone: [{ required: true, pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }],
  desc: [{ required: true, message: '请填写需求描述', trigger: 'blur' }],
}

const stepFields: (keyof typeof form)[][] = [
  ['company', 'industry', 'scale'],
  ['contact', 'position', 'email', 'phone'],
  ['budget', 'deadline', 'desc', 'priority'],
]

const next = async () => {
  if (!formRef.value) return
  const fields = stepFields[step.value]
  await formRef.value.validateField(fields, (valid) => {
    if (valid) step.value++
  })
}

const submit = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (valid) {
      ElMessage({ type: 'success', message: '提交成功', plain: true })
      step.value = 0
      formRef.value?.resetFields()
    }
  })
}

const steps = ['企业信息', '联系方式', '需求详情']
</script>

<template>
  <div class="form-page">
    <div class="page-header">
      <h2 class="page-title">复杂表单</h2>
      <p class="page-desc">多步骤分组表单，适用于复杂业务场景的数据收集</p>
    </div>
    <div class="form-card">
      <div class="steps-bar">
        <div v-for="(s, i) in steps" :key="i" class="step-item" :class="{ active: i === step, done: i < step }">
          <div class="step-circle">{{ i < step ? '✓' : i + 1 }}</div>
          <div class="step-label">{{ s }}</div>
          <div v-if="i < steps.length - 1" class="step-line" :class="{ done: i < step }"></div>
        </div>
      </div>

      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px" class="step-form">
        <template v-if="step === 0">
          <div class="section-title">企业基本信息</div>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="公司名称" prop="company">
                <el-input v-model="form.company" placeholder="请输入公司名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属行业" prop="industry">
                <el-select v-model="form.industry" placeholder="请选择行业" style="width:100%">
                  <el-option label="互联网" value="internet" />
                  <el-option label="金融" value="finance" />
                  <el-option label="教育" value="education" />
                  <el-option label="医疗" value="medical" />
                  <el-option label="制造业" value="manufacturing" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公司规模" prop="scale">
                <el-radio-group v-model="form.scale">
                  <el-radio value="small">50人以下</el-radio>
                  <el-radio value="medium">50-500人</el-radio>
                  <el-radio value="large">500人以上</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <template v-if="step === 1">
          <div class="section-title">联系人信息</div>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="联系人" prop="contact">
                <el-input v-model="form.contact" placeholder="请输入联系人姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="职位" prop="position">
                <el-input v-model="form.position" placeholder="请输入职位" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="form.email" placeholder="请输入邮箱" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号" prop="phone">
                <el-input v-model="form.phone" placeholder="请输入手机号" />
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <template v-if="step === 2">
          <div class="section-title">需求详情</div>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="预算范围" prop="budget">
                <el-select v-model="form.budget" placeholder="请选择预算" style="width:100%">
                  <el-option label="10万以下" value="lt10" />
                  <el-option label="10-50万" value="10-50" />
                  <el-option label="50-100万" value="50-100" />
                  <el-option label="100万以上" value="gt100" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="期望交付" prop="deadline">
                <el-date-picker v-model="form.deadline" type="date" placeholder="请选择日期" style="width:100%" value-format="YYYY-MM-DD" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="优先级" prop="priority">
                <el-radio-group v-model="form.priority">
                  <el-radio value="low">低</el-radio>
                  <el-radio value="medium">中</el-radio>
                  <el-radio value="high">高</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="需求描述" prop="desc">
                <el-input v-model="form.desc" type="textarea" :rows="4" placeholder="请详细描述您的需求" maxlength="500" show-word-limit />
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </el-form>

      <div class="form-actions">
        <el-button v-if="step > 0" @click="step--">上一步</el-button>
        <el-button v-if="step < 2" type="primary" @click="next">下一步</el-button>
        <el-button v-if="step === 2" type="primary" @click="submit">提交</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import './form-shared';

.steps-bar {
  display: flex;
  align-items: center;
  margin-bottom: 36px;
  padding: 0 20px;
}

.step-item {
  display: flex;
  align-items: center;
  flex: 1;
  position: relative;
}

.step-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #e4e7f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  color: #8a8fa8;
  background: #fff;
  flex-shrink: 0;
  transition: all 0.3s;
  z-index: 1;

  .step-item.active & {
    border-color: #6366f1;
    color: #6366f1;
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.12);
  }

  .step-item.done & {
    border-color: #6366f1;
    background: #6366f1;
    color: #fff;
  }
}

.step-label {
  font-size: 13px;
  color: #8a8fa8;
  margin-left: 8px;
  white-space: nowrap;

  .step-item.active & { color: #6366f1; font-weight: 600; }
  .step-item.done & { color: #1a1a2e; }
}

.step-line {
  flex: 1;
  height: 2px;
  background: #e4e7f0;
  margin: 0 12px;
  transition: background 0.3s;

  &.done { background: #6366f1; }
}

.step-form { min-height: 200px; }
</style>
