// 模拟后端接口：根据 token 返回用户信息和权限列表
export interface UserProfile {
  id: number
  userName: string
  account: string
  role: string
  permissions: string[]
}

const mockUsers: Record<string, UserProfile & { password: string }> = {
  admin: {
    id: 1,
    userName: '管理员',
    account: 'admin',
    role: 'admin',
    permissions: ['form', 'chart', 'profile'],
    password: '123456',
  },
  editor: {
    id: 2,
    userName: '编辑员',
    account: 'editor',
    role: 'editor',
    permissions: ['form', 'profile'],
    password: '123456',
  },
  viewer: {
    id: 3,
    userName: '访客',
    account: 'viewer',
    role: 'viewer',
    permissions: ['chart'],
    password: '123456',
  },
}

// 模拟网络延迟
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockLogin = async (account: string, password: string): Promise<string> => {
  await delay(400)
  const user = mockUsers[account]
  if (!user || user.password !== password) throw new Error('账号或密码错误')
  return `mock-token-${user.account}`
}

export const mockGetUserInfo = async (token: string): Promise<UserProfile> => {
  await delay(200)
  const role = token.replace('mock-token-', '') as keyof typeof mockUsers
  const user = mockUsers[role] ?? mockUsers['viewer']!
  return { ...user }
}
