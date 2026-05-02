import type { MockMethod } from 'vite-plugin-mock'
import type { UserListItem } from '@/types'

const USERS: UserListItem[] = [
  {
    id: 'U10001', name: '张三', avatar: '', mobile: '138****5001',
    identities: ['达人', '团长'], withdrawn: 12800, balance: 3200,
    realnameStatus: 'verified', realnameTypes: ['个人'],
    accountStatus: 'normal', channel: '小程序',
    inviteCode: 'ZS001', inviteCodeAdmin: '', inviterId: '',
    isVirtual: false, isDisabled: false, registeredAt: '2024-03-12 10:22:00',
  },
  {
    id: 'U10002', name: '李四', avatar: '', mobile: '139****5002',
    identities: ['达人'], withdrawn: 5600, balance: 800,
    realnameStatus: 'verified', realnameTypes: ['企业'],
    accountStatus: 'normal', channel: 'H5',
    inviteCode: 'LS002', inviteCodeAdmin: '', inviterId: 'U10001',
    isVirtual: false, isDisabled: false, registeredAt: '2024-04-01 08:15:00',
  },
  {
    id: 'U10003', name: '王五', avatar: '', mobile: '137****5003',
    identities: ['普通用户'], withdrawn: 0, balance: 0,
    realnameStatus: 'unverified', realnameTypes: [],
    accountStatus: 'normal', channel: '安卓',
    inviteCode: 'WW003', inviteCodeAdmin: '', inviterId: 'U10002',
    isVirtual: false, isDisabled: false, registeredAt: '2024-05-20 14:30:00',
  },
  {
    id: 'U10004', name: '赵六', avatar: '', mobile: '135****5004',
    identities: ['达人'], withdrawn: 980, balance: 100,
    realnameStatus: 'verified', realnameTypes: ['个体户'],
    accountStatus: 'blacklist', channel: 'iOS',
    inviteCode: 'ZL004', inviteCodeAdmin: '', inviterId: '',
    isVirtual: false, isDisabled: true, registeredAt: '2023-11-05 09:00:00',
  },
  {
    id: 'U10005', name: '测试虚拟', avatar: '', mobile: '000****0001',
    identities: ['达人'], withdrawn: 0, balance: 999,
    realnameStatus: 'unverified', realnameTypes: [],
    accountStatus: 'normal', channel: '小程序',
    inviteCode: '', inviteCodeAdmin: 'ADMIN001', inviterId: '',
    isVirtual: true, isDisabled: false, registeredAt: '2024-01-01 00:00:00',
  },
  {
    id: 'U10006', name: '孙七', avatar: '', mobile: '136****5006',
    identities: ['普通用户'], withdrawn: 0, balance: 0,
    realnameStatus: 'unverified', realnameTypes: [],
    accountStatus: 'cancelled', channel: 'H5',
    inviteCode: 'SQ006', inviteCodeAdmin: '', inviterId: 'U10001',
    isVirtual: false, isDisabled: false, registeredAt: '2024-06-10 11:00:00',
  },
]

function buildPageResult<T>(list: T[], page: number, pageSize: number) {
  const total = list.length
  const start = (page - 1) * pageSize
  return {
    code: 0,
    data: {
      list: list.slice(start, start + pageSize),
      total,
      page,
      pageSize,
    },
  }
}

export default [
  {
    url: '/api/user/list',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      const page = Number(query.page) || 1
      const pageSize = Number(query.pageSize) || 20

      let result = [...USERS]

      if (query.mobile) result = result.filter((u) => u.mobile.includes(query.mobile))
      if (query.name) result = result.filter((u) => u.name.includes(query.name))
      if (query.accountStatus) result = result.filter((u) => u.accountStatus === query.accountStatus)
      if (query.realnameStatus) result = result.filter((u) => u.realnameStatus === query.realnameStatus)
      if (query.channel) result = result.filter((u) => u.channel === query.channel)
      if (query.isVirtual !== undefined && query.isVirtual !== '')
        result = result.filter((u) => String(u.isVirtual) === query.isVirtual)

      return buildPageResult(result, page, pageSize)
    },
  },
  {
    url: '/api/user/:id',
    method: 'get',
    response: ({ params }: { params: Record<string, string> }) => {
      const user = USERS.find((u) => u.id === params.id)
      return user
        ? { code: 0, data: user }
        : { code: 404, message: '用户不存在' }
    },
  },
] as MockMethod[]
