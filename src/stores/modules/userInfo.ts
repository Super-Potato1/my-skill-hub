import { defineStore } from 'pinia'
export const useUserInfoStore = defineStore('userInfo', {
  state: () => ({
    userName: '',
    loginState: false,
    permissions:['admin'], //权限集合
    allRoutes:[],//所有路由集合
  }),
  getters: {},
  actions: {
    login(state: boolean) {
      // 未来将在这里调用登录接口，获取用户信息及路由权限等数据
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
