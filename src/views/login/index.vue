<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useStore } from '@/stores'
interface RuleForm {
  account: string
  password: string
}
const router = useRouter()
const { userInfo } = useStore()
const form = reactive({
  account: 'admin',
  password: '123456',
})
const ruleFormRef = ref<FormInstance>()
const formRules = reactive<FormRules<RuleForm>>({
  account: [
    {
      required: true,
      message: '请输入账号',
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur',
    },
  ],
})
const onLogin = async (formRef: FormInstance | undefined) => {
  if (!formRef) return
  await formRef.validate((valid, fields) => {
    if (valid) {
      ElMessage({
        message: '登录成功',
        type: 'success',
        plain: true,
        placement: 'top',
        offset: 80,
        duration: 1000,
      })
      userInfo.login(true)
      router.push('/')
    } else {
      console.log(valid, fields)
    }
  })
}
</script>

<template>
  <div class="login-background">
    <div class="login-form">
      <p>登录</p>
      <el-form
        class="form-container"
        ref="ruleFormRef"
        :model="form"
        :rules="formRules"
        label-width="auto"
      >
        <el-form-item label="账号" prop="account">
          <el-input v-model="form.account" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="请输入密码" show-password />
        </el-form-item>
        <div class="btn-group">
          <el-button type="primary" @click="onLogin(ruleFormRef)">登录</el-button>
          <el-button>注册</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-background {
  width: 100%;
  height: 100%;
  background-color: black;
  background:
    linear-gradient(
      to right,
      #050508 0%,
      rgba(5, 5, 8) 10%,
      rgba(7, 7, 9) 20%,
      transparent 28%,
      transparent 72%,
      rgba(7, 7, 9) 80%,
      rgba(5, 5, 8) 90%,
      #050508 100%
    ),
    url('../../assets/images/loginBackground.jpg') no-repeat center center / contain;
  position: relative;
}

.login-form {
  width: 700px;
  height: 400px;
  background-color: rgba(255, 255, 255, 0.3);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;

  p {
    line-height: 100px;
    text-align: center;
    font-size: 30px;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
  }
}

.form-container {
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  box-sizing: border-box;
  padding: 10px 0px;

  .el-form-item {
    margin-bottom: 0;

    .el-input {
      width: 300px;
      height: 45px;
    }
  }

  .btn-group {
    margin-top: 20px;
    display: flex;
    gap: 15px;
  }

  :deep(.el-form-item__label-wrap) {
    display: flex;
    flex-flow: column;
    justify-content: center;
  }

  :deep(.el-form-item__label) {
    color: rgba(255, 255, 255, 0.7);
    font-size: 16px;
    font-weight: 500;
    padding-right: 12px;
  }
}
</style>
