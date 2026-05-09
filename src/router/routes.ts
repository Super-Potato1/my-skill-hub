import type { RouteComponent } from 'vue-router'

export interface MenuRoute {
  path: string
  name: string
  component?: RouteComponent | (() => Promise<RouteComponent>)
  redirect?: string
  meta: {
    title: string
    icon: string
    permission: string
  }
  children?: MenuRoute[]
}

export const allAsyncRoutes: MenuRoute[] = [
  {
    path: 'form',
    name: 'form',
    redirect: '/home/form/simple',
    meta: { title: '表单', icon: '📋', permission: 'form' },
    children: [
      {
        path: 'simple',
        name: 'form-simple',
        component: () => import('@/views/form/simple.vue'),
        meta: { title: '简单表单', icon: '📄', permission: 'form' },
      },
      {
        path: 'complex',
        name: 'form-complex',
        component: () => import('@/views/form/complex.vue'),
        meta: { title: '复杂表单', icon: '📑', permission: 'form' },
      },
      {
        path: 'components',
        name: 'form-components',
        component: () => import('@/views/form/components.vue'),
        meta: { title: '组件展示', icon: '🧩', permission: 'form' },
      },
    ],
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
