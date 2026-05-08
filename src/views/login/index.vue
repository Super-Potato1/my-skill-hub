<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useStore } from '@/stores'

interface RuleForm {
  account: string
  password: string
}

const router = useRouter()
const { userInfo, permission } = useStore()

const loading = ref(false)
const form = reactive({ account: 'admin', password: '123456' })
const ruleFormRef = ref<FormInstance>()

const formRules = reactive<FormRules<RuleForm>>({
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})

const onLogin = async (formRef: FormInstance | undefined) => {
  if (!formRef || loading.value) return
  const valid = await formRef.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    await userInfo.login(form.account, form.password)
    const routes = await permission.generateRoutes(userInfo.token)
    ElMessage({ message: '登录成功', type: 'success', plain: true, duration: 1000 })
    const firstPath = routes[0] ? `/home/${routes[0].path}` : '/home'
    router.push(firstPath)
  } catch {
    ElMessage({ message: '登录失败，请重试', type: 'error', plain: true })
  } finally {
    loading.value = false
  }
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') onLogin(ruleFormRef.value)
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="login-page">
    <!-- 背景装饰 -->
    <div class="bg-orb orb-1"></div>
    <div class="bg-orb orb-2"></div>
    <div class="bg-orb orb-3"></div>
    <div class="bg-grid"></div>

    <div class="login-card">
      <div class="card-left">
        <div class="brand">
          <span class="brand-icon">✦</span>
          <span class="brand-name">Skill Hub</span>
        </div>
        <h1 class="card-title">欢迎回来</h1>
        <p class="card-desc">登录以继续访问您的工作台</p>
        <div class="hint-box">
          <p class="hint-title">测试账号</p>
          <p class="hint-item"><span>admin</span> — 全部权限</p>
          <p class="hint-item"><span>editor</span> — 表单 + 个人中心</p>
          <p class="hint-item"><span>其他</span> — 仅图表</p>
        </div>
      </div>

      <div class="card-right">
        <h2 class="form-title">账号登录</h2>

        <el-form
          ref="ruleFormRef"
          :model="form"
          :rules="formRules"
          label-position="top"
          class="login-form"
          @submit.prevent="onLogin(ruleFormRef)"
        >
          <el-form-item label="账号" prop="account">
            <el-input
              v-model="form.account"
              placeholder="请输入账号"
              size="large"
              clearable
            />
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="form.password"
              placeholder="请输入密码"
              size="large"
              show-password
            />
          </el-form-item>

          <el-button
            class="login-btn"
            type="primary"
            native-type="submit"
            size="large"
            :loading="loading"
            @click="onLogin(ruleFormRef)"
          >
            {{ loading ? '登录中...' : '登 录' }}
          </el-button>

          <div class="form-footer">
            <span>还没有账号？</span>
            <a href="javascript:void(0)" class="register-link">立即注册</a>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-page {
  width: 100%;
  height: 100%;
  background: #0f0f1a;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* ── 背景光晕 ── */
.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, transparent 70%);
  top: -120px;
  left: -100px;
  animation: float 8s ease-in-out infinite;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 70%);
  bottom: -80px;
  right: -60px;
  animation: float 10s ease-in-out infinite reverse;
}

.orb-3 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
  top: 50%;
  left: 55%;
  animation: float 12s ease-in-out infinite 2s;
}

@keyframes float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-30px) scale(1.05); }
}

/* ── 网格背景 ── */
.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(99, 102, 241, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99, 102, 241, 0.04) 1px, transparent 1px);
  background-size: 48px 48px;
  pointer-events: none;
}

/* ── 卡片 ── */
.login-card {
  display: flex;
  width: 860px;
  min-height: 500px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.06);
  position: relative;
  z-index: 1;
  animation: card-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes card-in {
  from { opacity: 0; transform: translateY(24px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

/* ── 左侧 ── */
.card-left {
  width: 340px;
  flex-shrink: 0;
  background: linear-gradient(145deg, #1a1a2e 0%, #16213e 60%, #1a1a3e 100%);
  padding: 48px 40px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -60px;
    right: -60px;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%);
  }
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 48px;
}

.brand-icon {
  font-size: 22px;
  color: #6366f1;
}

.brand-name {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.5px;
}

.card-title {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 12px;
  line-height: 1.2;
}

.card-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.45);
  margin: 0 0 40px;
  line-height: 1.6;
}

.hint-box {
  margin-top: auto;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 16px 18px;
}

.hint-title {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.35);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 10px;
}

.hint-item {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 6px;
  line-height: 1.5;

  &:last-child { margin-bottom: 0; }

  span {
    color: #a5b4fc;
    font-weight: 600;
  }
}

/* ── 右侧 ── */
.card-right {
  flex: 1;
  background: #fff;
  padding: 48px 44px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-title {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 32px;
}

.login-form {
  width: 100%;
}

.login-btn {
  width: 100%;
  margin-top: 8px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 2px;
  height: 46px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
  transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;

  &:hover {
    opacity: 0.92;
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
}

.form-footer {
  margin-top: 20px;
  text-align: center;
  font-size: 13px;
  color: #8a8fa8;
}

.register-link {
  color: #6366f1;
  font-weight: 600;
  margin-left: 4px;
  text-decoration: none;
  transition: color 0.2s;

  &:hover { color: #8b5cf6; }
}

:deep(.el-form-item__label) {
  font-size: 13px;
  font-weight: 600;
  color: #5a6080;
  padding-bottom: 6px;
}

:deep(.el-input__wrapper) {
  border-radius: 10px;
  box-shadow: 0 0 0 1px #e4e7f0;
  transition: box-shadow 0.2s;

  &:hover { box-shadow: 0 0 0 1px #a5b4fc; }
  &.is-focus { box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.3); }
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}
</style>

