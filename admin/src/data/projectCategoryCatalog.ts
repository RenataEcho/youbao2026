/**
 * 类目配置数据源 — 与「赛道类型」「业务类型」菜单页同源，供海外文娱项目管理等下拉与展示使用。
 * 菜单页请从本文件 import，勿再各自维护一份 MOCK。
 */

export interface ProjectTrackTypeRow {
  id: number
  trackName: string
  tag: string
  projectNumber: number
  userCount: number
  sort: number
  status: 'show' | 'hide'
  createTime: string
  updateTime: string
}

export interface ProjectBizTypeRow {
  id: number
  bizName: string
  status: 'show' | 'hide'
  createTime: string
  updateTime: string
}

/** 与 TrackType 页列表一致 */
export const TRACK_TYPE_MOCK_SEED: ProjectTrackTypeRow[] = [
  { id: 1, trackName: '推文达人', tag: '热门', projectNumber: 12, userCount: 38420, sort: 100, status: 'show', createTime: '2025-01-10 10:00:00', updateTime: '2026-04-20 14:22:00' },
  { id: 2, trackName: '短剧达人', tag: '新热', projectNumber: 8, userCount: 29103, sort: 90, status: 'show', createTime: '2025-01-15 11:00:00', updateTime: '2026-04-18 09:11:00' },
  { id: 3, trackName: '漫剧达人', tag: '', projectNumber: 5, userCount: 11250, sort: 80, status: 'show', createTime: '2025-02-01 09:00:00', updateTime: '2026-03-30 16:45:00' },
  { id: 4, trackName: '网盘运营', tag: '稳定', projectNumber: 6, userCount: 22887, sort: 70, status: 'show', createTime: '2025-02-10 10:30:00', updateTime: '2026-04-10 11:30:00' },
  { id: 5, trackName: '创意工具', tag: '', projectNumber: 4, userCount: 8932, sort: 60, status: 'show', createTime: '2025-03-01 14:00:00', updateTime: '2026-04-05 17:00:00' },
  { id: 6, trackName: '其他任务', tag: '', projectNumber: 9, userCount: 15601, sort: 50, status: 'show', createTime: '2025-03-15 16:00:00', updateTime: '2026-04-22 10:08:00' },
  { id: 7, trackName: '蓝海内测', tag: '内测', projectNumber: 2, userCount: 3120, sort: 10, status: 'hide', createTime: '2025-06-01 09:00:00', updateTime: '2026-04-25 08:30:00' },
]

/** 与 BizType 页列表一致 */
export const BIZ_TYPE_MOCK_SEED: ProjectBizTypeRow[] = [
  { id: 1, bizName: '推文', status: 'show', createTime: '2025-01-10 10:00:00', updateTime: '2026-04-20 14:22:00' },
  { id: 2, bizName: '短剧', status: 'show', createTime: '2025-01-15 11:00:00', updateTime: '2026-04-18 09:11:00' },
  { id: 3, bizName: '网盘', status: 'show', createTime: '2025-02-01 09:00:00', updateTime: '2026-03-30 16:45:00' },
  { id: 4, bizName: '工具', status: 'show', createTime: '2025-02-10 10:30:00', updateTime: '2026-04-10 11:30:00' },
  { id: 5, bizName: 'AI', status: 'show', createTime: '2025-03-01 14:00:00', updateTime: '2026-04-05 17:00:00' },
  { id: 6, bizName: '版权', status: 'show', createTime: '2025-04-01 09:00:00', updateTime: '2026-04-12 10:00:00' },
  { id: 7, bizName: '出海', status: 'hide', createTime: '2025-06-01 09:00:00', updateTime: '2026-04-25 08:30:00' },
]

export function trackLabelById(id: number): string {
  return TRACK_TYPE_MOCK_SEED.find((t) => t.id === id)?.trackName ?? '—'
}

export function bizLabelById(id: number): string {
  return BIZ_TYPE_MOCK_SEED.find((b) => b.id === id)?.bizName ?? '—'
}

/** Mock：校验「用户ID」是否存在（对接真实接口时可替换为请求） */
export const MOCK_USER_ID_PHONE: Record<string, string> = {
  U10001: '138****0001',
  U10002: '139****0022',
  U10003: '136****3303',
  U10004: '137****8840',
  U10005: '135****1122',
  U10006: '158****6677',
  U10007: '159****9900',
}

export function mockUserIdExists(userId: string): boolean {
  return Object.prototype.hasOwnProperty.call(MOCK_USER_ID_PHONE, userId.trim())
}

export function mockPhoneForUserId(userId: string): string | undefined {
  return MOCK_USER_ID_PHONE[userId.trim()]
}
