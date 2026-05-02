<template>
  <div class="od-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">首页</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">数据</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">海外文娱数据</span>
    </div>

    <div class="page-content dv-board-stagger">
      <div class="page-header">
        <div>
          <h1 class="page-title">海外文娱数据</h1>
          <p class="page-desc">海外文娱业务线：顶部指标、多系列趋势（充值/退款/分佣）、底部可导出明细（Mock，PRD §6.1.2）</p>
        </div>
        <button type="button" class="btn btn-default btn-sm" @click="doExport">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          导出 CSV
        </button>
      </div>

      <div class="od-kpi-grid">
        <DvStatKpi
          :value="fmtThousands(kpi.projects)"
          :value-title="`项目总数 ${fmtThousands(kpi.projects)}`"
          label="项目总数"
          :sub="`小说 ${kpi.novelProj} · 短剧 ${kpi.reelProj}`"
          tint="blue"
        >
          <template #icon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><rect x="7" y="7" width="10" height="10" rx="2"/></svg>
          </template>
        </DvStatKpi>
        <DvStatKpi
          :value="fmtThousands(kpi.tasks)"
          :value-title="`总任务数 ${fmtThousands(kpi.tasks)}`"
          label="总任务数"
          sub="海外文娱任务总量"
          tint="cyan"
        >
          <template #icon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><path d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z"/><path d="M9 12h6"/><path d="M9 16h6"/></svg>
          </template>
        </DvStatKpi>
        <DvStatKpi
          :value="fmtThousands(kpi.orders)"
          :value-title="`总订单数 ${fmtThousands(kpi.orders)}`"
          label="总订单数"
          :sub="`未结算 ${fmtThousands(kpi.ordersUnsettled)} · 已结算 ${fmtThousands(kpi.ordersSettled)}`"
          tint="violet"
        >
          <template #icon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          </template>
        </DvStatKpi>
        <DvStatKpi
          :value="fmtMoneyKpiDisplay(kpi.recharge)"
          :value-title="fmtMoneyYuanFull(kpi.recharge)"
          label="总充值金额"
          sub="累计充值（元）"
          tint="emerald"
        >
          <template #icon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
          </template>
        </DvStatKpi>
        <DvStatKpi
          :value="fmtMoneyKpiDisplay(kpi.refund)"
          :value-title="fmtMoneyYuanFull(kpi.refund)"
          label="总退款金额"
          sub="累计退款（元）"
          tint="amber"
        >
          <template #icon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          </template>
        </DvStatKpi>
        <DvStatKpi
          :value="fmtMoneyKpiDisplay(kpi.commission)"
          :value-title="fmtMoneyYuanFull(kpi.commission)"
          label="总分佣金额"
          tint="rose"
        >
          <template #icon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </template>
          <template #sub>
            未结算 <span :title="fmtMoneyYuanFull(kpi.commUnsettled)">{{ fmtMoneyKpiDisplay(kpi.commUnsettled) }}</span>
            · 已结算 <span :title="fmtMoneyYuanFull(kpi.commSettled)">{{ fmtMoneyKpiDisplay(kpi.commSettled) }}</span>
          </template>
        </DvStatKpi>
        <DvStatKpi
          :value="fmtThousands(kpi.effectiveUsers)"
          :value-title="`有效用户数 ${fmtThousands(kpi.effectiveUsers)}`"
          label="有效用户数"
          sub="累计订单量 ≥ 1 的去重用户"
          tint="slate"
        >
          <template #icon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </template>
        </DvStatKpi>
      </div>

      <div class="glass-card od-line-card">
        <div class="od-line-head od-line-head-row">
          <div class="od-line-head-main">
            <span class="od-line-title">各项目方充值 / 退款 / 分佣趋势</span>
            <p class="od-line-sub">{{ odTrendSubtitle }}</p>
          </div>
          <div class="od-line-head-right">
            <div class="od-trend-tabs" aria-label="趋势粒度">
              <div class="tab-nav od-subtab" role="tablist">
                <button
                  type="button"
                  class="tab-item"
                  role="tab"
                  :class="{ active: odTrendView === 'day' }"
                  :aria-selected="odTrendView === 'day'"
                  @click="odTrendView = 'day'"
                >按天</button>
                <button
                  type="button"
                  class="tab-item"
                  role="tab"
                  :class="{ active: odTrendView === 'month' }"
                  :aria-selected="odTrendView === 'month'"
                  @click="odTrendView = 'month'"
                >按月</button>
              </div>
            </div>
            <select v-model="chartVendor" class="ul-input ul-select od-chart-vendor" aria-label="趋势聚焦项目方">
              <option value="all">全部（演示汇总）</option>
              <option v-for="v in vendors" :key="v" :value="v">{{ v }}</option>
            </select>
          </div>
        </div>
        <div
          ref="chartHostRef"
          class="dv-chart-host od-chart-host"
          @mousemove="onChartMove"
          @mouseleave="onChartLeave"
        >
          <svg
            class="od-svg od-svg--meet"
            :viewBox="`0 0 ${vb.w} ${vb.h}`"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="odFillDep" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="var(--dv-chart-2)" stop-opacity="0.22" />
                <stop offset="100%" stop-color="var(--dv-chart-2)" stop-opacity="0" />
              </linearGradient>
              <linearGradient id="odFillComm" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="var(--dv-chart-3)" stop-opacity="0.18" />
                <stop offset="100%" stop-color="var(--dv-chart-3)" stop-opacity="0" />
              </linearGradient>
            </defs>
            <g class="od-chart-grid">
              <line
                v-for="(gy, gi) in yGridLines"
                :key="'yg'+gi"
                :x1="inner.x0"
                :y1="gy"
                :x2="inner.x1"
                :y2="gy"
              />
            </g>
            <g class="od-y-axis" aria-hidden="true">
              <text
                v-for="(tk, ti) in yTickLabels"
                :key="'yt'+ti"
                :x="inner.x0 - 8"
                :y="tk.y"
                text-anchor="end"
                dominant-baseline="middle"
                class="od-axis-text"
              >{{ tk.t }}</text>
            </g>
            <text :x="inner.x0" :y="16" class="od-y-unit">相对指数（演示）</text>
            <g :key="`lines-${odTrendView}-${chartVendor}`">
              <polygon v-if="areaDep" :points="areaDep" fill="url(#odFillDep)" class="dv-chart-area-enter" />
              <polygon v-if="areaComm" :points="areaComm" fill="url(#odFillComm)" class="dv-chart-area-enter" />
              <polyline
                :points="seriesPoints(depositSeriesActive)"
                fill="none"
                stroke="var(--dv-chart-2)"
                stroke-width="2.25"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="dv-chart-line"
                vector-effect="non-scaling-stroke"
              />
              <polyline
                :points="seriesPoints(refundSeriesActive)"
                fill="none"
                stroke="var(--dv-chart-5)"
                stroke-width="2"
                stroke-dasharray="5 4"
                stroke-linecap="round"
                class="dv-chart-fade"
                vector-effect="non-scaling-stroke"
              />
              <polyline
                :points="seriesPoints(commSeriesActive)"
                fill="none"
                stroke="var(--dv-chart-3)"
                stroke-width="2.25"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="dv-chart-line"
                vector-effect="non-scaling-stroke"
              />
            </g>
            <g v-if="tip.show && tip.idx >= 0" class="od-hover-layer">
              <line
                class="od-hover-line"
                :x1="pointX(tip.idx)"
                :y1="inner.yTop"
                :x2="pointX(tip.idx)"
                :y2="inner.yBase"
              />
              <circle
                v-for="(c, ci) in hoverDots"
                :key="'hd'+ci"
                class="od-hover-dot"
                :cx="c.x"
                :cy="c.y"
                :stroke="c.stroke"
                r="4.5"
              />
            </g>
            <g class="od-x-axis">
              <text
                v-for="lab in xLabelItems"
                :key="lab.i"
                :x="lab.x"
                :y="inner.labelY"
                text-anchor="middle"
                class="od-axis-text od-xlab"
                :transform="lab.deg ? `rotate(${lab.deg} ${lab.x} ${inner.labelY})` : undefined"
              >{{ lab.t }}</text>
            </g>
          </svg>
          <div
            v-show="tip.show"
            class="dv-chart-tip od-chart-tip"
            role="tooltip"
            :style="{ left: tip.px + 'px', top: tip.py + 'px' }"
          >
            <div class="dv-chart-tip__t">{{ tip.title }}</div>
            <div v-for="(row, ri) in tip.rows" :key="ri" class="dv-chart-tip__row">
              <span class="dv-chart-tip__k">{{ row.k }}</span>
              <span class="dv-chart-tip__v">{{ row.v }}</span>
            </div>
          </div>
        </div>
        <div class="od-legend-row">
          <span><i class="od-lg" style="background:var(--dv-chart-2)" />充值</span>
          <span><i class="od-lg od-lg--dash" style="border-color:var(--dv-chart-5)" />退款</span>
          <span><i class="od-lg" style="background:var(--dv-chart-3)" />分佣</span>
        </div>
      </div>

      <div class="glass-card table-card">
        <div class="table-header od-table-head">
          <div class="od-table-head-info">
            <div class="table-title">项目明细<span class="table-count">共 {{ rows.length }} 条</span></div>
            <span class="table-meta">分佣金额仅统计已打款订单；已失效、已扣回不计入</span>
          </div>
          <div class="od-table-head-tools">
            <div class="od-tool-item">
              <label for="od-time-dim">时间维度</label>
              <select id="od-time-dim" v-model="timeDim" class="ul-input ul-select od-tool-select">
                <option value="today">今天</option>
                <option value="d7">近 7 天</option>
                <option value="d30">近 30 天</option>
                <option value="month">按月</option>
                <option value="year">按年</option>
              </select>
            </div>
            <div class="od-tool-item">
              <label for="od-sponsor">项目方</label>
              <select id="od-sponsor" v-model="sponsor" class="ul-input ul-select od-tool-select">
                <option value="">全部</option>
                <option v-for="v in vendors" :key="v" :value="v">{{ v }}</option>
              </select>
            </div>
            <div class="od-tool-actions">
              <button type="button" class="btn btn-default btn-sm" @click="timeDim='d30';sponsor=''">重置</button>
              <button type="button" class="btn btn-primary btn-sm" @click="noopQuery">查询</button>
            </div>
          </div>
        </div>
        <div class="ul-table-wrap">
          <table class="ul-table ul-table--fixed">
            <colgroup>
              <col v-for="n in 7" :key="n" style="width:14.2857%">
            </colgroup>
            <thead>
              <tr>
                <th>项目名称</th>
                <th>项目类型</th>
                <th class="th-num">订单数量</th>
                <th class="th-num">充值金额</th>
                <th class="th-num">退款金额</th>
                <th class="th-num">分佣金额</th>
                <th class="th-num">有效用户数</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(r, i) in rows" :key="i">
                <td>{{ r.name }}</td>
                <td><span class="tag" :class="r.type === '小说' ? 'tag-blue' : 'tag-purple'">{{ r.type }}</span></td>
                <td class="td-num">{{ fmtThousands(r.orders) }}</td>
                <td class="td-num">¥{{ fmtMoney(r.dep) }}</td>
                <td class="td-num">¥{{ fmtMoney(r.ref) }}</td>
                <td class="td-num">¥{{ fmtMoney(r.comm) }}</td>
                <td class="td-num">{{ fmtThousands(r.eff) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import DvStatKpi from './components/DvStatKpi.vue'
import {
  demoTrendTriple,
  downloadCsv,
  fmtAxisMoney,
  fmtMoney,
  fmtMoneyKpiDisplay,
  fmtMoneyYuanFull,
  fmtThousands,
  niceCeilMax,
  trendLabelsNaturalMonthDays,
  trendLabelsNaturalYearMonths,
} from './utils/dataUi'

const timeDim = ref('d30')
const sponsor = ref('')
const chartVendor = ref<string>('all')
const odTrendView = ref<'day' | 'month'>('day')
const vendors = ['reelshort', 'plot novel', 'novelgo', 'dramabox']

const chartHostRef = ref<HTMLElement | null>(null)

const kpi = {
  projects: 47,
  novelProj: 22,
  reelProj: 25,
  tasks: 18640,
  orders: 362100,
  ordersUnsettled: 8420,
  ordersSettled: 353680,
  recharge: 128600000,
  refund: 6200000,
  commission: 18640000,
  commUnsettled: 1200000,
  commSettled: 17440000,
  effectiveUsers: 48200,
}

const vb = { w: 656, h: 248 } as const

const inner = computed(() => ({
  x0: 56,
  x1: vb.w - 20,
  yTop: 38,
  yBase: vb.h - 52,
  labelY: vb.h - 14,
}))

/** 横轴：按天 = 自然月 1 日—今日；按月 = 自然年 12 个月 */
const trendLabels = computed(() =>
  odTrendView.value === 'day' ? trendLabelsNaturalMonthDays() : trendLabelsNaturalYearMonths(),
)

const vendorMult = computed(() => {
  if (chartVendor.value === 'all') return 1
  if (chartVendor.value === 'reelshort') return 1.12
  if (chartVendor.value === 'plot novel') return 0.94
  if (chartVendor.value === 'novelgo') return 0.9
  return 1.06
})

const rawTriple = computed(() => {
  const n = trendLabels.value.length
  const mult = vendorMult.value * (odTrendView.value === 'month' ? 1.15 : 1)
  return demoTrendTriple(n, mult)
})

const depositSeriesActive = computed(() => rawTriple.value.dep)
const refundSeriesActive = computed(() => rawTriple.value.ref)
const commSeriesActive = computed(() => rawTriple.value.comm)

const yMax = computed(() =>
  niceCeilMax(
    Math.max(
      1,
      ...depositSeriesActive.value,
      ...refundSeriesActive.value,
      ...commSeriesActive.value,
    ),
  ),
)

const yTickLabels = computed(() => {
  const ticks = 4
  const mx = yMax.value
  const { yTop, yBase } = inner.value
  const h = yBase - yTop
  const out: { y: number; t: string }[] = []
  for (let i = 0; i <= ticks; i++) {
    const frac = i / ticks
    const v = mx * (1 - frac)
    const y = yTop + frac * h
    const a = Math.abs(v)
    const t = a >= 10_000 ? fmtAxisMoney(v) : fmtThousands(Math.round(v))
    out.push({ y, t })
  }
  return out
})

const yGridLines = computed(() => yTickLabels.value.map((x) => x.y))

function seriesPoints(vals: number[]): string {
  const n = vals.length
  const { x0, x1, yTop, yBase } = inner.value
  const mx = yMax.value
  const h = yBase - yTop
  if (n <= 0) return ''
  return vals
    .map((v, i) => {
      const x = n === 1 ? x0 : x0 + ((x1 - x0) * i) / (n - 1)
      const y = yBase - (v / mx) * h
      return `${x},${y}`
    })
    .join(' ')
}

function areaUnder(vals: number[]): string {
  const n = vals.length
  const { x0, x1, yBase } = inner.value
  if (n <= 0) return ''
  const pts = vals.map((v, i) => {
    const x = n === 1 ? x0 : x0 + ((x1 - x0) * i) / (n - 1)
    const y = pointY(v)
    return `${x},${y}`
  })
  const firstX = n === 1 ? x0 : x0
  const lastX = n === 1 ? x1 : x0 + ((x1 - x0) * (n - 1)) / (n - 1)
  return `${firstX},${yBase} ${pts.join(' ')} ${lastX},${yBase}`
}

function pointY(val: number): number {
  const { yTop, yBase } = inner.value
  const mx = yMax.value
  const h = yBase - yTop
  return yBase - (val / mx) * h
}

function pointX(i: number): number {
  const n = trendLabels.value.length
  const { x0, x1 } = inner.value
  if (n <= 1) return x0
  return x0 + ((x1 - x0) * i) / (n - 1)
}

const areaDep = computed(() => areaUnder(depositSeriesActive.value))
const areaComm = computed(() => areaUnder(commSeriesActive.value))

const xStride = computed(() => {
  const n = trendLabels.value.length
  if (n > 24) return 5
  if (n > 16) return 3
  if (n > 12) return 2
  return 1
})

const xLabelItems = computed(() => {
  const labels = trendLabels.value
  const n = labels.length
  const st = xStride.value
  const deg = n > 14 ? -20 : 0
  return labels
    .map((t, i) => ({
      i,
      t,
      x: pointX(i),
      deg,
      show: i % st === 0 || i === n - 1,
    }))
    .filter((x) => x.show)
})

const tip = ref({
  show: false,
  px: 0,
  py: 0,
  idx: -1,
  title: '',
  rows: [] as { k: string; v: string }[],
})

const hoverDots = computed(() => {
  const i = tip.value.idx
  if (i < 0) return []
  const x = pointX(i)
  const d = depositSeriesActive.value[i] ?? 0
  const r = refundSeriesActive.value[i] ?? 0
  const c = commSeriesActive.value[i] ?? 0
  return [
    { x, y: pointY(d), stroke: 'var(--dv-chart-2)' },
    { x, y: pointY(r), stroke: 'var(--dv-chart-5)' },
    { x, y: pointY(c), stroke: 'var(--dv-chart-3)' },
  ]
})

function onChartMove(e: MouseEvent) {
  const el = chartHostRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const xr = (e.clientX - rect.left) / rect.width
  const vx = xr * vb.w
  const { x0, x1, yTop, yBase } = inner.value
  if (vx < x0 - 4 || vx > x1 + 4) {
    tip.value.show = false
    return
  }
  const n = trendLabels.value.length
  if (n <= 0) return
  const t = (vx - x0) / (x1 - x0)
  let idx = Math.round(t * (n - 1))
  idx = Math.max(0, Math.min(n - 1, idx))
  tip.value.idx = idx
  tip.value.title = trendLabels.value[idx] ?? ''
  tip.value.rows = [
    { k: '充值（演示指数）', v: fmtThousands(depositSeriesActive.value[idx] ?? 0) },
    { k: '退款（演示指数）', v: fmtThousands(refundSeriesActive.value[idx] ?? 0) },
    { k: '分佣（演示指数）', v: fmtThousands(commSeriesActive.value[idx] ?? 0) },
  ]
  tip.value.show = true
  tip.value.px = e.clientX - rect.left
  tip.value.py = e.clientY - rect.top
}

function onChartLeave() {
  tip.value.show = false
  tip.value.idx = -1
}

const odTrendSubtitle = computed(() => {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth() + 1
  const d = now.getDate()
  if (odTrendView.value === 'day') {
    return `Y 轴为统一量纲后的相对指数；${y}年${m}月1日—${m}月${d}日，按天；悬停折线区查看各序列数值。`
  }
  return `Y 轴为统一量纲后的相对指数；${y}年1—12月，按月；悬停查看数值。`
})

const rows = computed(() => {
  const base = [
    { name: 'reelshort · 王牌短剧', type: '短剧' as const, orders: 84200, dep: 28600000, ref: 420000, comm: 4280000, eff: 12400 },
    { name: 'plot novel · 长篇连载', type: '小说' as const, orders: 62400, dep: 18200000, ref: 310000, comm: 2910000, eff: 9800 },
    { name: 'novelgo · 互动小说', type: '小说' as const, orders: 38200, dep: 9600000, ref: 180000, comm: 1620000, eff: 6200 },
    { name: 'dramabox · 出海剧场', type: '短剧' as const, orders: 29600, dep: 12400000, ref: 260000, comm: 1480000, eff: 5100 },
    { name: 'fusion pack · 联运包', type: '短剧' as const, orders: 18200, dep: 6200000, ref: 120000, comm: 820000, eff: 3200 },
  ]
  if (!sponsor.value) return base
  return base.filter((r) => r.name.toLowerCase().includes(sponsor.value.toLowerCase()))
})

/** 明细表筛选已由 sponsor + computed 联动；按钮保留查询语义（接 API 时可触发刷新） */
function noopQuery() {}

function doExport() {
  const headers = ['项目名称', '项目类型', '订单数量', '充值金额', '退款金额', '分佣金额', '有效用户数']
  const data = rows.value.map((r) => [
    r.name,
    r.type,
    String(r.orders),
    fmtMoney(r.dep),
    fmtMoney(r.ref),
    fmtMoney(r.comm),
    String(r.eff),
  ])
  downloadCsv(`海外文娱数据明细_${timeDim.value}`, headers, data)
}
</script>

<style scoped>
.od-wrap { min-height: 100%; width: 100%; min-width: 0; box-sizing: border-box; }
.od-kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(168px, 1fr));
  gap: 14px;
}
@media (min-width: 1100px) {
  .od-kpi-grid { grid-template-columns: repeat(7, minmax(0, 1fr)); }
}

.od-line-card { padding: 18px 20px; margin-top: 16px; width: 100%; min-width: 0; box-sizing: border-box; }
.od-line-head-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}
.od-line-head-main { flex: 1; min-width: 0; }
.od-line-title { font-size: 14px; font-weight: 600; color: var(--text-primary); display: block; }
.od-line-sub { margin: 6px 0 0; font-size: 12px; color: var(--text-muted); line-height: 1.45; }
.od-line-head-right {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 12px;
  flex-shrink: 0;
}
.od-trend-tabs .tab-nav { min-height: 40px; padding: 0 4px 0 8px; }
.od-subtab { gap: 2px; }
.od-chart-vendor { width: min(200px, 100%); font-size: 13px; }
.od-chart-host { margin-top: 4px; }
.od-svg {
  width: 100%;
  height: auto;
  display: block;
  aspect-ratio: 656 / 248;
  max-height: 320px;
}
.od-svg--meet {
  overflow: visible;
}
.od-chart-grid {
  stroke: var(--dv-chart-grid);
  stroke-width: 1;
  fill: none;
}
.od-axis-text {
  font-size: 11px;
  fill: var(--text-muted);
  font-family: var(--font-sans, system-ui, -apple-system, sans-serif);
}
.od-xlab {
  font-size: 11px;
}
.od-y-unit {
  font-size: 11px;
  fill: var(--text-muted);
  font-weight: 500;
}
.od-hover-line {
  stroke: color-mix(in srgb, var(--primary) 45%, var(--text-muted));
  stroke-width: 1;
  stroke-dasharray: 4 3;
  pointer-events: none;
}
.od-hover-dot {
  fill: var(--surface);
  stroke-width: 2;
  pointer-events: none;
}
.od-chart-tip {
  z-index: 6;
}
.od-table-head { align-items: flex-start; }
.od-table-head-info { display: flex; flex-direction: column; gap: 4px; min-width: 0; flex: 1 1 200px; }
.od-table-head-tools {
  display: flex; flex-wrap: wrap; align-items: flex-end; gap: 10px 12px;
  justify-content: flex-end; flex: 1 1 280px;
}
.od-tool-item { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.od-tool-item label { font-size: 11px; font-weight: 500; color: var(--text-muted); }
.od-tool-select { min-width: 120px; max-width: 200px; font-size: 13px; padding: 6px 10px; }
.od-tool-actions { display: flex; gap: 8px; padding-bottom: 1px; }

.od-legend-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 10px;
  font-size: 12px;
  color: var(--text-secondary);
}
.od-lg {
  display: inline-block;
  width: 14px;
  height: 3px;
  margin-right: 6px;
  vertical-align: middle;
  border-radius: 2px;
}
.od-lg--dash {
  height: 0;
  border-bottom: 3px dashed;
  background: none !important;
}
</style>
