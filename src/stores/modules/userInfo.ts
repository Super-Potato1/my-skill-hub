import { defineStore } from 'pinia'
export const useUserInfoStore = defineStore('userInfo', {
  state: () => ({
    userName: '',
    loginState: false,
  }),
  getters: {},
  actions: {
    login(state: boolean) {
      this.loginState = state
    },
  },
})
