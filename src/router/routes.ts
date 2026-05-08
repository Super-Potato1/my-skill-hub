import type { RouteComponent } from 'vue-router'

export interface MenuRoute {
  path: string
  name: string
  component: RouteComponent | (() => Promise<RouteComponent>)
  meta: {
    title: string
    icon: string
    permission: string
  }
}

// 所有可用的动态路由（需要权限控制）
export const allAsyncRoutes: MenuRoute[] = [
  {
    path: 'form',
    name: 'form',
    component: () => import('@/views/form/index.vue'),
    meta: { title: '表单', icon: '📋', permission: 'form' },
  },
  {
    path: 'chart',
    name: 'chart',
    component: () => import('@/views/chart/index.vue'),
    meta: { title: '图表', icon: '📊', permission: 'chart' },
  },
  {
    path: 'profile',
    name: 'profile',
    component: () => import('@/views/profile/index.vue'),
    meta: { title: '个人中心', icon: '👤', permission: 'profile' },
  },
]
