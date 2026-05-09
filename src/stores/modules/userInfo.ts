import { defineStore } from 'pinia'
import { ref } from 'vue'
import { mockLogin, mockGetUserInfo, type UserProfile } from '@/api/user'

export const useUserInfoStore = defineStore('userInfo', () => {
  const userName = ref('')
  const loginState = ref(false)
  const token = ref(localStorage.getItem('token') ?? '')
  const profile = ref<UserProfile | null>(null)

  const login = async (account: string, password: string) => {
    const t = await mockLogin(account, password)
    const info = await mockGetUserInfo(t)
    token.value = t
    userName.value = info.userName
    profile.value = info
    loginState.value = true
    localStorage.setItem('token', t)
  }

  const logout = () => {
    token.value = ''
    loginState.value = false
    userName.value = ''
    profile.value = null
    localStorage.removeItem('token')
  }

  return { userName, loginState, token, profile, login, logout }
})
