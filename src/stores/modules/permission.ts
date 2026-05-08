import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import router from '@/router'
import { allAsyncRoutes, type MenuRoute } from '@/router/routes'
import { mockGetUserInfo } from '@/api/user'

export const usePermissionStore = defineStore('permission', () => {
  const permissions = ref<string[]>([])
  const accessedRoutes = ref<MenuRoute[]>([])
  const routesAdded = ref(false)

  const menuList = computed(() => accessedRoutes.value)

  const filterRoutes = (perms: string[]): MenuRoute[] => {
    return allAsyncRoutes.filter((route) => perms.includes(route.meta.permission))
  }

  const generateRoutes = async (token: string) => {
    const userInfo = await mockGetUserInfo(token)
    permissions.value = userInfo.permissions

    const filtered = filterRoutes(userInfo.permissions)
    accessedRoutes.value = filtered

    // 动态添加路由到 /home 下
    filtered.forEach((route) => {
      if (!router.hasRoute(route.name as string)) {
        router.addRoute('home', route)
      }
    })

    // 默认重定向到第一个有权限的菜单
    if (filtered.length > 0) {
      router.addRoute('home', {
        path: '',
        redirect: `/home/${filtered[0]!.path}`,
      })
    }

    routesAdded.value = true
    return filtered
  }

  const resetRoutes = () => {
    permissions.value = []
    accessedRoutes.value = []
    routesAdded.value = false
  }

  return { permissions, accessedRoutes, menuList, routesAdded, generateRoutes, resetRoutes }
})
