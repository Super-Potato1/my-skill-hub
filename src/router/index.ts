import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/login/index.vue'
import Home from '@/views/home/index.vue'
import Layout from '@/layout/index.vue'
import { useStore } from '@/stores/index'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
  ],
})
export const asyncRoutes = [
  {
    path: '/',
    name: 'layout',
    component: Layout,
    // redirect: '/home',
    meta: {
      permission: ['admin'],
    },
    children: [
      {
        path: 'home',
        name: 'home',
        component: Home,
        meta: {
          permission: ['admin'],
          title: '首页',
          icon: '',
        },
      },
    ],
  },
]
// 路由前置守卫，判断用户是否登录
router.beforeEach((to, from) => {
  const store = useStore()
  if (to.path === '/login') {
    return true
  }
  if (!store.userInfo.loginState) {
    return '/login'
  } else {
    if (!router.hasRoute('layout')) {
      asyncRoutes.forEach((item) => {
        router.addRoute(item)
      })
      return { ...to, replace: true }
    } else {
      return true
    }
  }
})

export default router
