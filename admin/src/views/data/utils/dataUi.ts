import { ElMessage } from 'element-plus'

/** 千分位（PRD：统计卡片数字使用千分位格式化） */
export function fmtThousands(n: number): string {
  return Math.round(n).toLocaleString('zh-CN')
}

export function maskPhone(phone: string): string {
  if (!phone || phone.length < 7) return phone || '—'
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

export function fmtMoney(n: number): string {
  return n.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/** 完整金额（带 ¥），用于 KPI 悬浮 title */
export function fmtMoneyYuanFull(n: number): string {
  return `¥${fmtMoney(n)}`
}

const WAN = 10_000
/** ≥100 万（1_000_000）用「万」展示，否则两位小数原样 */
export const MONEY_WAN_THRESHOLD = 1_000_000

/**
 * 金额展示：小于 100 万保留 ¥ + 千分位两位小数；≥100 万用「万」单位（如 12860 万、1864.2 万）
 */
export function fmtMoneyWanShort(n: number): string {
  const a = Math.abs(n)
  if (a < MONEY_WAN_THRESHOLD) return fmtMoney(n)
  const v = n / WAN
  const frac = Math.abs(v % 1) < 1e-9 ? 0 : 2
  const s = v.toLocaleString('zh-CN', { maximumFractionDigits: frac, minimumFractionDigits: 0 })
  return `${s}万`
}

/** KPI 主数字一行展示（含 ¥；≥100 万用万） */
export function fmtMoneyKpiDisplay(n: number): string {
  return `¥${fmtMoneyWanShort(n)}`
}

/** 折线图 Y 轴等：大数用万或亿简写 */
export function fmtAxisMoney(n: number): string {
  const a = Math.abs(n)
  if (a >= 100_000_000) return `${(n / 100_000_000).toLocaleString('zh-CN', { maximumFractionDigits: 2 })}亿`
  if (a >= 10_000) return `${(n / WAN).toLocaleString('zh-CN', { maximumFractionDigits: 1 })}万`
  return fmtThousands(Math.round(n))
}

/** 折线 / 柱状图坐标 nice 上限 */
export function niceCeilMax(n: number): number {
  if (!Number.isFinite(n) || n <= 0) return 1
  const exp = Math.floor(Math.log10(n))
  const f = n / 10 ** exp
  const nf = f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10
  return nf * 10 ** exp
}

function csvEscapeCell(cell: string): string {
  if (/[",\n\r]/.test(cell)) return `"${cell.replace(/"/g, '""')}"`
  return cell
}

/** 前端导出 UTF-8 CSV（Excel 可直接打开）；列值为字符串，调用方负责格式化数字 */
export function downloadCsv(fileBaseName: string, headers: string[], rows: string[][]): void {
  const BOM = '\uFEFF'
  const name = fileBaseName.endsWith('.csv') ? fileBaseName : `${fileBaseName}.csv`
  const head = headers.map(csvEscapeCell).join(',')
  const body = rows.map((r) => r.map((c) => csvEscapeCell(c ?? '')).join(',')).join('\n')
  const blob = new Blob([BOM + head + '\n' + body], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.rel = 'noopener'
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success('已导出 CSV（可用 Excel 打开）')
}

/** @deprecated 优先使用 downloadCsv；保留兼容旧调用 */
export function mockExportExcel(label: string): void {
  ElMessage.info(`已触发导出：${label}（请改用 downloadCsv 生成文件）`)
}

/** 自然月：从当月 1 日到「今天」的横轴标签（MM-DD），点数与天数一致、横轴均分 */
export function trendLabelsNaturalMonthDays(ref: Date = new Date()): string[] {
  const y = ref.getFullYear()
  const m = ref.getMonth()
  const last = ref.getDate()
  const labels: string[] = []
  for (let d = 1; d <= last; d++) {
    const mm = String(m + 1).padStart(2, '0')
    const dd = String(d).padStart(2, '0')
    labels.push(`${mm}-${dd}`)
  }
  return labels
}

/** 自然年：12 个月横轴标签（1月…12月），均分 */
export function trendLabelsNaturalYearMonths(): string[] {
  return Array.from({ length: 12 }, (_, i) => `${i + 1}月`)
}

/** 生成与横轴点数一致的演示折线数据（确定性，便于 Mock） */
export function demoTrendPair(n: number, seed = 0): { hi: number[]; lo: number[] } {
  if (n <= 0) return { hi: [], lo: [] }
  const hi: number[] = []
  const lo: number[] = []
  for (let i = 0; i < n; i++) {
    const t = n <= 1 ? 0 : i / (n - 1)
    hi.push(
      Math.round(
        42 +
          22 * Math.sin(t * Math.PI * 1.35 + seed * 0.4) +
          6 * Math.sin(t * Math.PI * 3 + 1),
      ),
    )
    lo.push(
      Math.round(
        26 +
          14 * Math.sin(t * Math.PI * 1.1 + seed * 0.6 + 0.8) +
          5 * Math.cos(t * Math.PI * 2.5),
      ),
    )
  }
  return { hi, lo }
}

/** 海外文娱三线演示（充值 / 退款 / 分佣），长度与横轴一致 */
export function demoTrendTriple(n: number, mult = 1): { dep: number[]; ref: number[]; comm: number[] } {
  if (n <= 0) return { dep: [], ref: [], comm: [] }
  const dep: number[] = []
  const ref: number[] = []
  const comm: number[] = []
  for (let i = 0; i < n; i++) {
    const t = n <= 1 ? 0 : i / (n - 1)
    dep.push(Math.round((46 + 22 * Math.sin(t * Math.PI * 1.2 + 0.2) + 5 * Math.sin(t * Math.PI * 4)) * mult))
    ref.push(Math.round((13 + 4 * Math.sin(t * Math.PI * 2 + 0.5) + (i % 3)) * mult))
    comm.push(Math.round((31 + 12 * Math.sin(t * Math.PI * 1.05 + 1.1) + 4 * Math.cos(t * Math.PI * 3)) * mult))
  }
  return { dep, ref, comm }
}
