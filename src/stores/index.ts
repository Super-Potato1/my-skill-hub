import { useUserInfoStore } from '@/stores/modules/userInfo'
export function useStore() {
  return {
    userInfo: useUserInfoStore(),
  }
}
