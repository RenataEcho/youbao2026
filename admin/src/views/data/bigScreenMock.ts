/** 运营数据大屏 Mock（对齐 admin-ui/operation-bigscreen-prototype 示意数据） */
export const OBS_TICKER_ITEMS = [
  { hot: true, html: '<strong>财务日切</strong> 今日业务日已切换 · 聚合任务 02:12 完成' },
  { hot: true, html: '品牌线 昨日订单量环比 <strong>+12.4%</strong>' },
  { html: '海外文娱 分佣未打款批次 <strong>3</strong> 笔待处理' },
  { html: 'TOP 项目「短剧达人 · 春季档」贡献订单 <strong>8,420</strong> 单（示意）' },
  { html: '数据大屏自动刷新间隔 <strong>60s</strong>（PRD 建议）' },
] as const

export const OBS_USER_KPIS = {
  newUsers: 12580,
  activeUsers: 86400,
} as const

export const OBS_CHANNELS = [
  { name: '应用商店 A', pct: 32, widthPct: 92 },
  { name: '社交分享', pct: 24, widthPct: 68 },
  { name: '搜索 / SEM', pct: 18, widthPct: 52 },
] as const

export const OBS_BRAND_KPIS = {
  projects: 128,
  orders: 42600,
  revenue: 1280000,
  effectiveUsers: 9200,
} as const

export const OBS_OVERSEAS_KPIS = {
  projects: 36,
  orders: 8100,
  commission: 402000,
  effectiveUsers: 2100,
} as const

export const OBS_FINANCE = {
  totalPaid: 3842600,
  brandPaid: 2100000,
  overseasPaid: 980000,
  dividendPaid: 412000,
  rewardPaid: 356000,
  pendingReviewOrders: 186,
  pendingPayoutOver48h: 23,
} as const

export const OBS_TOP_PROJECTS_QTY = [
  { rank: 1, name: '短剧达人 · 春季档', line: '品牌', orders: 8420 },
  { rank: 2, name: '网盘运营 S 级', line: '品牌', orders: 6102 },
  { rank: 3, name: '海外小说 · 拉美线', line: '海外', orders: 4881 },
  { rank: 4, name: '推文达人 · 旗舰', line: '品牌', orders: 3905 },
  { rank: 5, name: '短剧 · 东南亚', line: '海外', orders: 3210 },
] as const

export const OBS_TOP_PROJECTS_AMT = [
  { rank: 1, name: '短剧达人 · 春季档', line: '品牌', amount: 1020000 },
  { rank: 2, name: '海外短剧 · 北美', line: '海外', amount: 886000 },
  { rank: 3, name: '网盘运营 S 级', line: '品牌', amount: 612000 },
  { rank: 4, name: '漫剧达人 · 暑期', line: '品牌', amount: 540000 },
  { rank: 5, name: '海外小说 · 拉美线', line: '海外', amount: 421000 },
] as const

export const OBS_TOP_USERS_QTY = [
  { rank: 1, user: '用户 U_928**41', orders: 612 },
  { rank: 2, user: '用户 U_103**77', orders: 508 },
  { rank: 3, user: '用户 U_441**02', orders: 421 },
  { rank: 4, user: '用户 U_772**19', orders: 390 },
  { rank: 5, user: '用户 U_201**56', orders: 355 },
] as const

export const OBS_TOP_USERS_AMT = [
  { rank: 1, user: '用户 U_103**77', amount: 182400 },
  { rank: 2, user: '用户 U_928**41', amount: 156200 },
  { rank: 3, user: '用户 U_556**88', amount: 128900 },
  { rank: 4, user: '用户 U_441**02', amount: 112000 },
  { rank: 5, user: '用户 U_772**19', amount: 98600 },
] as const
