import type { CommissionItem, CommissionTarget, LeaderLevel } from '../types'

function sumUserLayers(u: CommissionTarget['user']): number {
  return u.direct + (u.indirect ?? 0) + (u.infinite ?? 0)
}

function sumTeamLayers(t: CommissionTarget['team']): number {
  if (!t) return 0
  return t.direct + t.indirect + (t.infinite ?? 0)
}

function targetOf(row: Pick<CommissionItem, 'targets'>, level: LeaderLevel): CommissionTarget | undefined {
  return row.targets.find((t) => t.targetLevel === level)
}

/**
 * 底下 V1 出单：用户邀请链取「针对 V1」配置；团队侧依次叠加「针对 V2」「针对 V3」的团长链比例。
 * 最短：各段仅第 1 跳（直邀 / 直属团）相加；最长：各段满层相加。
 */
function rangeBottomV1(row: Pick<CommissionItem, 'targets'>): { shortest: number; longest: number } | null {
  const v1 = targetOf(row, 'V1')
  if (!v1) return null
  let shortest = v1.user.direct
  let longest = sumUserLayers(v1.user)
  const v2 = targetOf(row, 'V2')
  if (v2?.team) {
    shortest += v2.team.direct
    longest += sumTeamLayers(v2.team)
  }
  const v3 = targetOf(row, 'V3')
  if (v3?.team) {
    shortest += v3.team.direct
    longest += sumTeamLayers(v3.team)
  }
  return { shortest, longest }
}

/** 底下 V2 出单：用户链取针对 V2；团队链为针对 V2 的本级团 + 针对 V3 的上游团。 */
function rangeBottomV2(row: Pick<CommissionItem, 'targets'>): { shortest: number; longest: number } | null {
  const v2 = targetOf(row, 'V2')
  if (!v2) return null
  let shortest = v2.user.direct
  let longest = sumUserLayers(v2.user)
  if (v2.team) {
    shortest += v2.team.direct
    longest += sumTeamLayers(v2.team)
  }
  const v3 = targetOf(row, 'V3')
  if (v3?.team) {
    shortest += v3.team.direct
    longest += sumTeamLayers(v3.team)
  }
  return { shortest, longest }
}

/** 底下 V3 出单：用户链 + 本级团队链（针对 V3）。 */
function rangeBottomV3(row: Pick<CommissionItem, 'targets'>): { shortest: number; longest: number } | null {
  const v3 = targetOf(row, 'V3')
  if (!v3) return null
  let shortest = v3.user.direct
  let longest = sumUserLayers(v3.user)
  if (v3.team) {
    shortest += v3.team.direct
    longest += sumTeamLayers(v3.team)
  }
  return { shortest, longest }
}

/**
 * 出单分出总比例区间：按「出单用户为 V1 / V2 / V3」分别构造一条组合链路后，
 * 最短取各场景最短中的最小值，最长取各场景最长中的最大值。
 */
export function computeOrderShareRange(row: Pick<CommissionItem, 'targets'>): { min: number; max: number } {
  const parts: { shortest: number; longest: number }[] = []
  const a = rangeBottomV1(row)
  const b = rangeBottomV2(row)
  const c = rangeBottomV3(row)
  if (a) parts.push(a)
  if (b) parts.push(b)
  if (c) parts.push(c)
  if (!parts.length) return { min: 0, max: 0 }
  return {
    min: Math.min(...parts.map((p) => p.shortest)),
    max: Math.max(...parts.map((p) => p.longest)),
  }
}

export interface OrderShareScenarioBreakdown {
  /** 出单用户等级视角 */
  scenario: 'V1出单' | 'V2出单' | 'V3出单'
  shortest: number
  longest: number
}

export function computeOrderShareBreakdown(row: Pick<CommissionItem, 'targets'>): {
  min: number
  max: number
  perScenario: OrderShareScenarioBreakdown[]
} {
  const perScenario: OrderShareScenarioBreakdown[] = []
  const r1 = rangeBottomV1(row)
  if (r1) perScenario.push({ scenario: 'V1出单', ...r1 })
  const r2 = rangeBottomV2(row)
  if (r2) perScenario.push({ scenario: 'V2出单', ...r2 })
  const r3 = rangeBottomV3(row)
  if (r3) perScenario.push({ scenario: 'V3出单', ...r3 })
  const { min, max } = computeOrderShareRange(row)
  return { min, max, perScenario }
}
