const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export interface UserProfile {
  id: number
  userName: string
  account: string
  role: string
  permissions: string[]
  email: string
  phone: string
  position: string
  department: string
  joinDate: string
  bio: string
  skills: string[]
  stats: { label: string; value: number | string }[]
  activities: { time: string; action: string; type: string }[]
}

const mockUsers: Record<string, UserProfile & { password: string }> = {
  admin: {
    id: 1,
    userName: '管理员',
    account: 'admin',
    role: 'admin',
    permissions: ['form', 'chart', 'profile'],
    password: '123456',
    email: 'admin@skillhub.com',
    phone: '138****0001',
    position: '系统管理员',
    department: '技术部',
    joinDate: '2022-03-15',
    bio: '负责系统整体架构与权限管理，热爱技术，专注于平台稳定性与用户体验提升。',
    skills: ['Vue3', 'TypeScript', 'Node.js', 'Docker', 'MySQL'],
    stats: [
      { label: '提交表单', value: 128 },
      { label: '查看图表', value: 342 },
      { label: '在线天数', value: 186 },
      { label: '操作日志', value: 1024 },
    ],
    activities: [
      { time: '2026-05-08 10:23', action: '提交了表单数据', type: 'primary' },
      { time: '2026-05-07 16:45', action: '更新了系统配置', type: 'success' },
      { time: '2026-05-06 09:12', action: '查看了数据图表', type: 'info' },
      { time: '2026-05-05 14:30', action: '添加了新用户', type: 'warning' },
      { time: '2026-05-04 11:00', action: '修改了权限设置', type: 'danger' },
    ],
  },
  editor: {
    id: 2,
    userName: '编辑员',
    account: 'editor',
    role: 'editor',
    permissions: ['form', 'profile'],
    password: '123456',
    email: 'editor@skillhub.com',
    phone: '139****0002',
    position: '内容编辑',
    department: '运营部',
    joinDate: '2023-07-01',
    bio: '专注于内容创作与表单数据管理，擅长数据整理与分析，追求高效的工作流程。',
    skills: ['内容策划', 'Excel', 'Markdown', 'SEO', 'Figma'],
    stats: [
      { label: '提交表单', value: 86 },
      { label: '编辑内容', value: 214 },
      { label: '在线天数', value: 103 },
      { label: '操作日志', value: 432 },
    ],
    activities: [
      { time: '2026-05-08 09:10', action: '提交了月度报表', type: 'primary' },
      { time: '2026-05-07 14:22', action: '更新了个人信息', type: 'success' },
      { time: '2026-05-06 11:05', action: '编辑了内容草稿', type: 'info' },
      { time: '2026-05-04 16:30', action: '登录系统', type: 'warning' },
      { time: '2026-05-03 10:00', action: '提交了周报数据', type: 'primary' },
    ],
  },
  viewer: {
    id: 3,
    userName: '访客',
    account: 'viewer',
    role: 'viewer',
    permissions: ['chart'],
    password: '123456',
    email: 'viewer@skillhub.com',
    phone: '136****0003',
    position: '数据分析师',
    department: '数据部',
    joinDate: '2024-01-10',
    bio: '专注于数据可视化与趋势分析，通过图表洞察业务规律，为决策提供数据支撑。',
    skills: ['数据分析', 'ECharts', 'Python', 'SQL', 'Tableau'],
    stats: [
      { label: '查看图表', value: 521 },
      { label: '导出报告', value: 47 },
      { label: '在线天数', value: 68 },
      { label: '操作日志', value: 198 },
    ],
    activities: [
      { time: '2026-05-08 15:40', action: '查看了销售趋势图', type: 'info' },
      { time: '2026-05-07 10:15', action: '导出了月度报告', type: 'success' },
      { time: '2026-05-06 14:00', action: '查看了用户分布图', type: 'info' },
      { time: '2026-05-05 09:30', action: '登录系统', type: 'warning' },
      { time: '2026-05-03 16:20', action: '查看了转化率图表', type: 'info' },
    ],
  },
}

export const mockLogin = async (account: string, password: string): Promise<string> => {
  await delay(400)
  const user = mockUsers[account]
  if (!user || user.password !== password) throw new Error('账号或密码错误')
  return `mock-token-${user.account}`
}

export const mockGetUserInfo = async (token: string): Promise<UserProfile> => {
  await delay(200)
  const account = token.replace('mock-token-', '') as keyof typeof mockUsers
  const user = mockUsers[account] ?? mockUsers['viewer']!
  const { password: _, ...profile } = user
  return { ...profile }
}
