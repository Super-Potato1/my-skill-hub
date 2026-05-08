import { useUserInfoStore } from '@/stores/modules/userInfo'
import { usePermissionStore } from '@/stores/modules/permission'

export function useStore() {
  return {
    userInfo: useUserInfoStore(),
    permission: usePermissionStore(),
  }
}
