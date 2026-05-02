import type { LeaderLevel } from '@/types'

export {
  computeOrderShareRange,
  computeOrderShareBreakdown,
  type OrderShareScenarioBreakdown,
} from '@/utils/commissionOrderShare'

/** 当前业务仅维护 V1–V3 分佣等级 */
export const COMMISSION_LEVELS: LeaderLevel[] = ['V1', 'V2', 'V3']

/**
 * 用户关系分佣 — 间邀是否可配置
 * V2、V3 对下级 V1/V2/V3 均可配置直邀 + 间邀；无限见 userInfiniteApplicable（仅 V2/V3→V1）
 */
export function userIndirectApplicable(configLevel: LeaderLevel, targetLevel: LeaderLevel): boolean {
  if (configLevel === 'V1') return targetLevel === 'V1'
  if (configLevel === 'V2' || configLevel === 'V3')
    return targetLevel === 'V1' || targetLevel === 'V2' || targetLevel === 'V3'
  return false
}

/**
 * 用户关系分佣 — 无限比例：仅 V2/V3 针对下级 V1 时配置
 */
export function userInfiniteApplicable(configLevel: LeaderLevel, targetLevel: LeaderLevel): boolean {
  return (configLevel === 'V2' || configLevel === 'V3') && targetLevel === 'V1'
}

/**
 * 团队关系分佣 — 无限团：高等级对低等级团长（与既有说明一致）
 */
export function teamInfiniteApplicable(configLevel: LeaderLevel, targetLevel: LeaderLevel): boolean {
  if (targetLevel === 'V1') return false
  const rank: Record<LeaderLevel, number> = { V1: 1, V2: 2, V3: 3, V4: 4, V5: 5 }
  return rank[configLevel] > rank[targetLevel]
}
