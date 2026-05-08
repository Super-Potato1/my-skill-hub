import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/login/index.vue'
import Home from '@/views/home/index.vue'
import { usePermissionStore } from '@/stores/modules/permission'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login,
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      // 子路由由 permission store 动态注入，此处为空
      children: [],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

// 路由守卫：未登录跳回登录页，已登录但未加载路由则先生成动态路由
router.beforeEach(async (to, _from, next) => {
  const token = localStorage.getItem('token')

  if (!token) {
    if (to.path === '/') return next()
    return next('/')
  }

  // 已有 token，访问登录页直接跳首页
  if (to.path === '/') return next('/home')

  // 动态路由尚未注入
  const permissionStore = usePermissionStore()

  if (!permissionStore.routesAdded) {
    const routes = await permissionStore.generateRoutes(token)
    // 访问 /home 根路径时跳到第一个有权限的菜单
    if (to.path === '/home' && routes[0]) {
      return next({ path: `/home/${routes[0].path}`, replace: true })
    }
    return next({ ...to, replace: true })
  }

  next()
})

export default router
