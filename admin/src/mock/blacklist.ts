import type { MockMethod } from 'vite-plugin-mock'
import type { BlacklistItem } from '@/types'

const LIST: BlacklistItem[] = [
  {
    id: 1,
    userId: 'U10004',
    banTypes: ['禁止登录', '禁止题词'],
    isNotify: true,
    notifyType: '封号通知',
    message: '您的账号因违规操作已被封禁，如有疑问请联系客服。',
    remarks: '多次刷量行为',
    operator: '运营-小李',
    createdAt: '2025-02-15 14:22:00',
  },
  {
    id: 2,
    userId: 'U10088',
    banTypes: ['禁止项目钱包提现'],
    isNotify: false,
    message: '',
    remarks: '疑似套现',
    operator: '运营-小王',
    createdAt: '2025-03-10 09:00:00',
  },
]

export default [
  {
    url: '/api/blacklist',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      const page = Number(query.page) || 1
      const pageSize = Number(query.pageSize) || 20
      let result = [...LIST]
      if (query.userId) result = result.filter((r) => r.userId.includes(query.userId))
      const total = result.length
      const start = (page - 1) * pageSize
      return { code: 0, data: { list: result.slice(start, start + pageSize), total, page, pageSize } }
    },
  },
] as MockMethod[]
