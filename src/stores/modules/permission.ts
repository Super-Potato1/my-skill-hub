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

  const addRouteRecursive = (route: MenuRoute, parentName: string) => {
    if (!router.hasRoute(route.name)) {
      router.addRoute(parentName, {
        path: route.path,
        name: route.name,
        component: route.component,
        redirect: route.redirect,
        meta: route.meta,
      })
    }
    route.children?.forEach((child) => addRouteRecursive(child, route.name))
  }

  const generateRoutes = async (token: string) => {
    const userInfo = await mockGetUserInfo(token)
    permissions.value = userInfo.permissions

    const filtered = filterRoutes(userInfo.permissions)
    accessedRoutes.value = filtered

    filtered.forEach((route) => addRouteRecursive(route, 'home'))

    if (filtered.length > 0) {
      const first = filtered[0]!
      const firstPath = first.children ? `/home/${first.path}/${first.children[0]!.path}` : `/home/${first.path}`
      router.addRoute('home', { path: '', redirect: firstPath })
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
