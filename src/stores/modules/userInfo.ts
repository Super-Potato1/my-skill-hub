import { defineStore } from 'pinia'
import { ref } from 'vue'
import { mockLogin, mockGetUserInfo } from '@/api/user'

export const useUserInfoStore = defineStore('userInfo', () => {
  const userName = ref('')
  const loginState = ref(false)
  const token = ref(localStorage.getItem('token') ?? '')

  const login = async (account: string, password: string) => {
    const t = await mockLogin(account, password)
    const userInfo = await mockGetUserInfo(t)
    token.value = t
    userName.value = userInfo.userName
    loginState.value = true
    localStorage.setItem('token', t)
  }

  const logout = () => {
    token.value = ''
    loginState.value = false
    userName.value = ''
    localStorage.removeItem('token')
  }

  return { userName, loginState, token, login, logout }
})
