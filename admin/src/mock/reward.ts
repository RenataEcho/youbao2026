import type { MockMethod } from 'vite-plugin-mock'
import type { RewardItem } from '@/types'

const REWARDS: RewardItem[] = [
  {
    id: 'RW20001', orderId: 'ORD-2025-00001', importedAt: '2025-04-01 10:00:00',
    businessType: 'brand', projectId: 'P001', projectName: '推文达人-春季活动',
    keyword: '春日出游', userId: 'U10001', amount: 500,
    rewardTitle: '爆款奖励', rewardReason: '作品播放量达到100万',
    importOperator: '财务-小张',
    reviewer: '财务主管', reviewedAt: '2025-04-02 14:00:00', rejectReason: '',
    payer: '财务-小王', paidAt: '2025-04-03 09:00:00',
    auditStatus: 'reviewed', paymentStatus: 'paid', wechatNotify: 'sent',
  },
  {
    id: 'RW20002', orderId: 'ORD-2025-00002', importedAt: '2025-04-05 11:00:00',
    businessType: 'brand', projectId: 'P001', projectName: '推文达人-春季活动',
    keyword: '美食探店', userId: 'U10002', amount: 300,
    rewardTitle: '爆款奖励', rewardReason: '作品点赞数达到5万',
    importOperator: '财务-小张',
    reviewer: '', reviewedAt: null, rejectReason: '',
    payer: '', paidAt: null,
    auditStatus: 'pending_review', paymentStatus: 'pending_payment', wechatNotify: 'pending',
  },
  {
    id: 'RW20003', orderId: 'ORD-2025-00003', importedAt: '2025-04-06 09:30:00',
    businessType: 'overseas', projectId: 'OP001', projectName: '海外版权-TikTok推广',
    keyword: '', userId: 'U10003', amount: 1200,
    rewardTitle: '海外达人奖励', rewardReason: '海外项目完成奖励',
    importOperator: '财务-小李',
    reviewer: '财务主管', reviewedAt: '2025-04-07 10:00:00', rejectReason: '金额核算有误',
    payer: '', paidAt: null,
    auditStatus: 'rejected', paymentStatus: 'pending_payment', wechatNotify: 'pending',
  },
  {
    id: 'RW20004', orderId: 'ORD-2025-00004', importedAt: '2025-04-10 14:00:00',
    businessType: 'brand', projectId: 'P002', projectName: '短剧达人-五一专场',
    keyword: '五一快乐', userId: 'U10001', amount: 800,
    rewardTitle: '月度TOP奖励', rewardReason: '月度播放量TOP10',
    importOperator: '财务-小张',
    reviewer: '', reviewedAt: null, rejectReason: '',
    payer: '', paidAt: null,
    auditStatus: 'pending_review', paymentStatus: 'pending_payment', wechatNotify: 'pending',
  },
]

export default [
  {
    url: '/api/reward/list',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      const page = Number(query.page) || 1
      const pageSize = Number(query.pageSize) || 20
      let result = [...REWARDS]
      if (query.userId) result = result.filter((r) => r.userId.includes(query.userId))
      if (query.businessType) result = result.filter((r) => r.businessType === query.businessType)
      if (query.auditStatus) result = result.filter((r) => r.auditStatus === query.auditStatus)
      if (query.paymentStatus) result = result.filter((r) => r.paymentStatus === query.paymentStatus)
      if (query.projectId) result = result.filter((r) => r.projectId.includes(query.projectId))
      const total = result.length
      const start = (page - 1) * pageSize
      return { code: 0, data: { list: result.slice(start, start + pageSize), total, page, pageSize } }
    },
  },
  {
    url: '/api/reward/stats',
    method: 'get',
    response: () => ({
      code: 0,
      data: {
        pendingReview: 2,
        reviewed: 1,
        rejected: 1,
        pendingPayment: 3,
        paid: 1,
        pendingNotify: 3,
        totalAmount: 2800,
      },
    }),
  },
] as MockMethod[]
