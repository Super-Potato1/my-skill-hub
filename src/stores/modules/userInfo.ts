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
  persist: {
    key: 'userInfo',
    storage: localStorage,
    serializer: {
      serialize: (state) => JSON.stringify({
        userName: state.userName,
        loginState: state.loginState,
      }),
      deserialize: (serializedState) => JSON.parse(serializedState),
    },
  },
})
