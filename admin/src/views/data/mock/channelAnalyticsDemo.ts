/** 用户渠道分析看板 — 静态演示数据（与 channel-analytics-dashboard.html / user- dashboard.md 对齐，未接 API） */

export const TREND_LABELS = ['4/1', '4/5', '4/9', '4/13', '4/17', '4/21', '4/25', '4/30']

export interface ChannelKpiItem {
  label: string
  value?: number
  valueStr?: string
  sub: string
  subDown: boolean
}

export const KPI_ITEMS: ChannelKpiItem[] = [
  { label: '新增用户', value: 12_480, sub: '环比 +8.2%', subDown: false },
  { label: '总用户数', value: 286_400, sub: '平台累计注册', subDown: false },
  { label: '活跃用户数', value: 52_960, sub: '登录且停留 >30s', subDown: false },
  { label: 'Top 渠道占比', valueStr: '38%', sub: '应用商店', subDown: false },
  { label: '次日留存 D1', valueStr: '41.2%', sub: '+1.2pp', subDown: false },
  { label: '7日留存 D7', valueStr: '22.8%', sub: '-0.4pp', subDown: true },
  { label: '活跃率', valueStr: '18.5%', sub: 'DAU/注册', subDown: false },
  { label: '人均停留时长', valueStr: '24.6 分', sub: '单次会话示意', subDown: false },
  { label: '平均活跃天数', valueStr: '9.6', sub: '生命周期', subDown: false },
  { label: '30日回流率', valueStr: '12.3%', sub: '粘性', subDown: false },
]

export const CORE_VALUE_PIE = [
  { key: 'kw', label: '题词用户', value: 12_400, color: 'var(--dv-chart-1)' },
  { key: 'bf', label: '回填用户', value: 8_200, color: 'var(--dv-chart-2)' },
  { key: 'od', label: '出单用户', value: 3_100, color: 'var(--dv-chart-4)' },
] as const

export const CORE_VALUE_ROWS = [
  { metric: '题词用户数', users: 12_400, note: '产生过题词行为' },
  { metric: '回填用户数', users: 8_200, note: '产生过回填行为' },
  { metric: '出单用户数', users: 3_100, note: '产生过出单行为' },
] as const

export const CHANNEL_LABELS = ['应用商店', '小程序', 'H5', 'PC'] as const

export const ACQ_LINE_SERIES = [
  { label: '应用商店', color: 'var(--dv-chart-1)', data: [420, 510, 480, 620, 590, 640, 700, 680] },
  { label: '小程序', color: 'var(--dv-chart-4)', data: [200, 215, 220, 235, 228, 245, 252, 248] },
  { label: 'H5', color: 'var(--dv-chart-5)', data: [200, 220, 210, 260, 250, 270, 290, 280] },
  { label: 'PC', color: 'var(--dv-chart-muted)', data: [120, 128, 125, 140, 135, 148, 152, 150] },
] as const

export const CHANNEL_SHARE = [38, 26, 20, 16] as const

export const CHANNEL_DETAIL = [
  { ch: '应用商店', newU: 4_742, share: '38.0%', trend: '↑' },
  { ch: '小程序', newU: 3_246, share: '26.0%', trend: '↑' },
  { ch: 'H5', newU: 2_496, share: '20.0%', trend: '→' },
  { ch: 'PC', newU: 1_996, share: '16.0%', trend: '↑' },
] as const

export const QUALITY_LINE_SERIES = [
  { label: '应用商店 D7%', color: 'var(--dv-chart-1)', data: [24, 25, 25.5, 26, 25.8, 26.2, 26, 26.1] },
  { label: '小程序 D7%', color: 'var(--dv-chart-4)', data: [22, 22.5, 23, 23.2, 23.5, 23.8, 24, 24.1] },
] as const

export const QUALITY_D7 = [
  { ch: '应用商店', v: 26 },
  { ch: '小程序', v: 24 },
  { ch: 'H5', v: 20 },
  { ch: 'PC', v: 22 },
] as const

export const QUALITY_MATRIX = [
  { ch: '应用商店', d1: '44%', d7: '26%', ar: '21%' },
  { ch: '小程序', d1: '42%', d7: '24%', ar: '19%' },
  { ch: 'H5', d1: '38%', d7: '20%', ar: '16%' },
  { ch: 'PC', d1: '40%', d7: '22%', ar: '18%' },
] as const

export const FUNNEL_STEPS = [
  { name: '注册', count: 100_000, pctLabel: '100%', widthPct: 100 },
  { name: '激活', count: 78_000, pctLabel: '78% 注册→激活', widthPct: 78 },
  { name: '核心行为', count: 52_000, pctLabel: '66.7% 激活→核心', widthPct: 52 },
  { name: '价值用户', count: 12_000, pctLabel: '23.1% 核心→价值用户', widthPct: 12 },
] as const

export const FUNNEL_VALUE_USERS = [5200, 4100, 2800, 1650] as const

export const FUNNEL_TABLE = [
  { ch: '应用商店', r1: '82%', r2: '71%', r3: '38%', r4: '22.1%', hint: '—' },
  { ch: '小程序', r1: '80%', r2: '68%', r3: '35%', r4: '19.0%', hint: '—' },
  { ch: 'H5', r1: '75%', r2: '62%', r3: '30%', r4: '14.0%', hint: '—' },
  { ch: 'PC', r1: '68%', r2: '54%', r3: '22%', r4: '8.1%', hint: '核心→价值用户偏低' },
] as const

export const PROFILE_STACK = [
  { ch: '应用商店', ios: 42, and: 38, pc: 20 },
  { ch: '小程序', ios: 28, and: 62, pc: 10 },
  { ch: 'H5', ios: 12, and: 78, pc: 10 },
  { ch: 'PC', ios: 8, and: 12, pc: 80 },
] as const

export const PROFILE_STORE_PIE = [
  { label: 'iOS', v: 22, color: 'var(--dv-chart-1)' },
  { label: '小米', v: 18, color: '#ea580c' },
  { label: 'vivo', v: 12, color: 'var(--dv-chart-2)' },
  { label: '鸿蒙', v: 14, color: 'var(--dv-chart-3)' },
  { label: '华为', v: 14, color: '#dc2626' },
  { label: 'OPPO', v: 10, color: 'var(--dv-chart-4)' },
  { label: '其他', v: 10, color: '#94a3b8' },
] as const

export const HEATMAP_ROWS = [
  { label: '早', cells: [12, 18, 22, 28, 35, 20, 14] },
  { label: '午', cells: [8, 15, 24, 30, 32, 26, 16] },
  { label: '晚', cells: [20, 28, 40, 45, 52, 38, 25] },
] as const

export const FOOTER_NOTE =
  '备注：核心指标中「总用户数」为平台累计注册；「活跃用户数」为登录且单次停留超过 30 秒；「人均停留时长」为会话维度示意。核心价值用户区含题词 / 回填 / 出单三类统计（可重叠，以实际埋点为准）。渠道为应用商店、小程序、PC、H5；价值用户为项目累计收益 >100 元。本页为演示数据。'
