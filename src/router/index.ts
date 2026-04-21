import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/login/index.vue'
import Home from '@/views/home/index.vue'
import { useStore } from '@/stores/index'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
    },
  ],
})
// 路由前置守卫，判断用户是否登录
router.beforeEach((to, from, next) => {
  const store = useStore()
  if (to.path === '/login') {
    return next()
  }
  if (!store.userInfo.loginState) {
    return next('/login')
  } else {
    return next()
  }
})

export default router
