<template>
  <div class="fd-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">首页</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">数据</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">财务数据</span>
    </div>

    <div class="page-content dv-board-stagger">
      <div class="page-header">
        <div>
          <h1 class="page-title">财务数据</h1>
          <p class="page-desc">打款与财务汇总；分项加总与手续费口径以对账文档为准（PRD §6.1.3）。以下为演示数据。</p>
        </div>
        <button type="button" class="btn btn-default btn-sm" @click="doExport">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          导出 CSV
        </button>
      </div>

      <div class="fd-kpi-grid">
        <DvStatKpi
          :value="fmtMoneyKpiDisplay(186420000)"
          :value-title="fmtMoneyYuanFull(186420000)"
          label="已打款总额"
          sub="所选时间范围内平台已打款合计"
          tint="blue"
        >
          <template #icon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
          </template>
        </DvStatKpi>
        <DvStatKpi
          :value="fmtMoneyKpiDisplay(124800000)"
          :value-title="fmtMoneyYuanFull(124800000)"
          label="品牌已打款"
          sub="品牌业务线"
          tint="cyan"
        >
          <template #icon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2"/><rect x="7" y="7" width="10" height="10" rx="2"/></svg>
          </template>
        </DvStatKpi>
        <DvStatKpi
          :value="fmtMoneyKpiDisplay(38200000)"
          :value-title="fmtMoneyYuanFull(38200000)"
          label="海外文娱打款"
          sub="海外文娱业务线"
          tint="violet"
        >
          <template #icon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          </template>
        </DvStatKpi>
        <DvStatKpi
          :value="fmtMoneyKpiDisplay(14800000)"
          :value-title="fmtMoneyYuanFull(14800000)"
          label="分红打款"
          sub="分红类打款"
          tint="amber"
        >
          <template #icon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </template>
        </DvStatKpi>
        <DvStatKpi
          :value="fmtMoneyKpiDisplay(8620000)"
          :value-title="fmtMoneyYuanFull(8620000)"
          label="奖励打款"
          sub="奖励类打款"
          tint="emerald"
        >
          <template #icon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
          </template>
        </DvStatKpi>
      </div>

      <div class="glass-card fd-chart-card">
        <div class="fd-chart-head fd-trend-head">
          <div class="fd-trend-head-main">
            <span class="fd-chart-title">打款趋势</span>
            <p class="fd-chart-sub">{{ trendSubtitle }}</p>
          </div>
          <div class="fd-trend-tabs" aria-label="打款趋势粒度">
            <div class="tab-nav fd-subtab" role="tablist">
              <button
                type="button"
                class="tab-item"
                role="tab"
                :class="{ active: trendView === 'day' }"
                :aria-selected="trendView === 'day'"
                @click="trendView = 'day'"
              >按天</button>
              <button
                type="button"
                class="tab-item"
                role="tab"
                :class="{ active: trendView === 'month' }"
                :aria-selected="trendView === 'month'"
                @click="trendView = 'month'"
              >按月</button>
            </div>
          </div>
        </div>
        <div
          ref="fdChartHostRef"
          class="dv-chart-host fd-chart-host"
          @mousemove="onFdChartMove"
          @mouseleave="onFdChartLeave"
        >
          <svg
            class="fd-svg fd-svg--meet"
            :viewBox="`0 0 ${fdVb.w} ${fdVb.h}`"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="fdFillBrand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="var(--dv-chart-1)" stop-opacity="0.2" />
                <stop offset="100%" stop-color="var(--dv-chart-1)" stop-opacity="0" />
              </linearGradient>
            </defs>
            <g class="fd-chart-grid">
              <line
                v-for="(gy, gi) in fdYGridLines"
                :key="'yg'+gi"
                :x1="fdInner.x0"
                :y1="gy"
                :x2="fdInner.x1"
                :y2="gy"
              />
            </g>
            <g class="fd-y-axis" aria-hidden="true">
              <text
                v-for="(tk, ti) in fdYTickLabels"
                :key="'yt'+ti"
                :x="fdInner.x0 - 8"
                :y="tk.y"
                text-anchor="end"
                dominant-baseline="middle"
                class="fd-axis-text"
              >{{ tk.t }}</text>
            </g>
            <text :x="fdInner.x0" :y="16" class="fd-y-unit">金额（元，演示）</text>
            <g :key="`fd-lines-${trendView}`">
              <polygon v-if="fdAreaBrand" :points="fdAreaBrand" fill="url(#fdFillBrand)" class="dv-chart-area-enter" />
              <polyline
                :points="fdSeriesPoints(trendBrand)"
                fill="none"
                stroke="var(--dv-chart-1)"
                stroke-width="2.35"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="dv-chart-line"
                vector-effect="non-scaling-stroke"
              />
              <polyline
                :points="fdSeriesPoints(trendOverseas)"
                fill="none"
                stroke="var(--dv-chart-2)"
                stroke-width="2.35"
                stroke-dasharray="6 4"
                stroke-linecap="round"
                class="dv-chart-fade"
                vector-effect="non-scaling-stroke"
              />
            </g>
            <g v-if="fdTip.show && fdTip.idx >= 0" class="fd-hover-layer">
              <line
                class="fd-hover-line"
                :x1="fdPointX(fdTip.idx)"
                :y1="fdInner.yTop"
                :x2="fdPointX(fdTip.idx)"
                :y2="fdInner.yBase"
              />
              <circle
                class="fd-hover-dot"
                :cx="fdPointX(fdTip.idx)"
                :cy="fdPointY(trendBrand[fdTip.idx] ?? 0)"
                r="4.5"
                stroke="var(--dv-chart-1)"
              />
              <circle
                class="fd-hover-dot"
                :cx="fdPointX(fdTip.idx)"
                :cy="fdPointY(trendOverseas[fdTip.idx] ?? 0)"
                r="4.5"
                stroke="var(--dv-chart-2)"
              />
            </g>
            <g class="fd-x-axis">
              <text
                v-for="lab in fdXLabelItems"
                :key="lab.i"
                :x="lab.x"
                :y="fdInner.labelY"
                text-anchor="middle"
                class="fd-axis-text fd-xlab"
                :transform="lab.deg ? `rotate(${lab.deg} ${lab.x} ${fdInner.labelY})` : undefined"
              >{{ lab.t }}</text>
            </g>
          </svg>
          <div
            v-show="fdTip.show"
            class="dv-chart-tip fd-chart-tip"
            role="tooltip"
            :style="{ left: fdTip.px + 'px', top: fdTip.py + 'px' }"
          >
            <div class="dv-chart-tip__t">{{ fdTip.title }}</div>
            <div v-for="(row, ri) in fdTip.rows" :key="ri" class="dv-chart-tip__row">
              <span class="dv-chart-tip__k">{{ row.k }}</span>
              <span class="dv-chart-tip__v">{{ row.v }}</span>
            </div>
          </div>
        </div>
        <div class="fd-line-legend">
          <span><i class="fd-lg" style="background:var(--dv-chart-1)" />品牌打款</span>
          <span><i class="fd-lg fd-lg--dash" style="border-color:var(--dv-chart-2)" />海外文娱打款</span>
        </div>
      </div>

      <div class="fd-dist-row">
        <div class="glass-card fd-chart-card">
          <div class="fd-chart-title" style="margin-bottom:12px">各钱包打款与提现分布</div>
          <div class="fd-bar-stack">
            <div v-for="b in walletPayOut" :key="b.name" class="fd-group-bar">
              <span class="fd-wname">{{ b.name }}</span>
              <div class="fd-split-bars">
                <div class="fd-split-item" :title="`打款 ${fmtMoneyYuanFull(b.pay)}`">
                  <span class="fd-split-lab">打款</span>
                  <div class="dv-bar-track"><div class="dv-bar-fill" :style="{ width: b.pPay + '%', background: 'linear-gradient(90deg,var(--dv-chart-1),var(--dv-chart-3))' }" /></div>
                  <em class="fd-split-val">¥{{ fmtMoney(b.pay) }}</em>
                </div>
                <div class="fd-split-item" :title="`提现 ${fmtMoneyYuanFull(b.wd)}`">
                  <span class="fd-split-lab">提现</span>
                  <div class="dv-bar-track"><div class="dv-bar-fill" :style="{ width: b.pWd + '%', background: 'linear-gradient(90deg,var(--dv-chart-2),var(--dv-chart-4))' }" /></div>
                  <em class="fd-split-val">¥{{ fmtMoney(b.wd) }}</em>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="glass-card fd-chart-card">
          <div class="fd-chart-title" style="margin-bottom:12px">打款状态分布</div>
          <div class="fd-pie-row">
            <div class="fd-pie dv-donut-ambient" :style="{ background: statusConic }" />
            <ul class="fd-leg">
              <li
                v-for="s in statusSlices"
                :key="s.name"
                :title="`${s.name}：${s.pct}%`"
              ><span class="fd-dot" :style="{ background: s.color }" />{{ s.name }} <strong>{{ s.pct }}%</strong></li>
            </ul>
          </div>
        </div>
      </div>

      <div class="glass-card tab-nav-shell">
        <div class="tab-nav" role="tablist" aria-label="财务明细范围">
          <button
            v-for="t in tableTabs"
            :key="t.key"
            type="button"
            class="tab-item"
            role="tab"
            :class="{ active: tableTab === t.key }"
            :aria-selected="tableTab === t.key"
            @click="tableTab = t.key"
          >{{ t.label }}</button>
        </div>
      </div>

      <div class="glass-card table-card">
        <div class="table-header fd-table-head">
          <div class="fd-table-head-info">
            <div class="table-title">
              财务明细 <span class="tag tag-gray">{{ tabLabel }}</span><span class="table-count">共 {{ tableRows.length }} 条</span>
            </div>
          </div>
          <div class="fd-table-head-tools">
            <div class="fd-tool-item">
              <label for="fd-time-preset">汇总时间</label>
              <select id="fd-time-preset" v-model="timePreset" class="ul-input ul-select fd-tool-select">
                <option value="today">今天</option>
                <option value="d7">近 7 天</option>
                <option value="d30">近 30 天</option>
                <option value="custom">自定义范围</option>
              </select>
            </div>
            <template v-if="timePreset === 'custom'">
              <div class="fd-tool-item">
                <label for="fd-range-start">开始</label>
                <input id="fd-range-start" v-model="rangeStart" type="date" class="ul-input fd-tool-date">
              </div>
              <div class="fd-tool-item">
                <label for="fd-range-end">结束</label>
                <input id="fd-range-end" v-model="rangeEnd" type="date" class="ul-input fd-tool-date">
              </div>
            </template>
            <div class="fd-tool-item">
              <label for="fd-granularity">统计粒度</label>
              <select id="fd-granularity" v-model="granularity" class="ul-input ul-select fd-tool-select">
                <option value="day">按天</option>
                <option value="month">按月</option>
                <option value="year">按年</option>
              </select>
            </div>
            <div class="fd-tool-item">
              <label for="fd-table-time">明细时间</label>
              <select id="fd-table-time" v-model="tableTime" class="ul-input ul-select fd-tool-select">
                <option value="d7">近 7 天</option>
                <option value="d30">近 30 天</option>
                <option value="month">按月</option>
                <option value="year">按年</option>
                <option value="custom">自定义</option>
              </select>
            </div>
            <div class="fd-tool-item">
              <label for="fd-table-sponsor">项目方</label>
              <select id="fd-table-sponsor" v-model="tableSponsor" class="ul-input ul-select fd-tool-select">
                <option value="">全部</option>
                <option v-for="s in sponsors" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>
            <div class="fd-tool-actions">
              <button type="button" class="btn btn-primary btn-sm" @click="runFinanceQuery">查询</button>
            </div>
          </div>
        </div>
        <div class="ul-table-wrap">
          <table class="ul-table ul-table--fixed">
            <colgroup>
              <col v-for="n in 5" :key="n" style="width:20%">
            </colgroup>
            <thead>
              <tr>
                <th>统计周期</th>
                <th>项目名称</th>
                <th>项目 ID</th>
                <th class="th-num">已打款总额</th>
                <th class="th-num">已审核未打款总额</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(r, i) in tableRows" :key="i">
                <td>{{ r.period }}</td>
                <td>{{ r.pname }}</td>
                <td class="ul-mono">{{ r.pid }}</td>
                <td class="td-num">¥{{ fmtMoney(r.paid) }}</td>
                <td class="td-num">¥{{ fmtMoney(r.pending) }}</td>
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
  demoTrendPair,
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

const timePreset = ref('d30')
const rangeStart = ref('2026-04-01')
const rangeEnd = ref('2026-04-30')
const granularity = ref('day')
const trendView = ref<'day' | 'month'>('day')

const tableTab = ref<'domestic' | 'foreign' | 'overseas'>('domestic')
const tableTabs = [
  { key: 'domestic' as const, label: '国内品牌' },
  { key: 'foreign' as const, label: '国外品牌' },
  { key: 'overseas' as const, label: '海外文娱' },
]
const tableTime = ref('d30')
const tableSponsor = ref('')
const sponsors = ['番茄系', '磁力引擎', '腾讯广告', 'Meta', 'reelshort']

const fdChartHostRef = ref<HTMLElement | null>(null)

const fdVb = { w: 656, h: 248 } as const

const fdInner = computed(() => ({
  x0: 56,
  x1: fdVb.w - 20,
  yTop: 38,
  yBase: fdVb.h - 52,
  labelY: fdVb.h - 14,
}))

/** 横轴：按天 = 自然月 1 日—今日；按月 = 自然年 12 个月；演示数据长度与横轴点数一致 */
const fdTrendXLabels = computed(() =>
  trendView.value === 'day' ? trendLabelsNaturalMonthDays() : trendLabelsNaturalYearMonths(),
)

const trendSeriesFinance = computed(() => {
  const n = fdTrendXLabels.value.length
  const { hi, lo } = demoTrendPair(n, trendView.value === 'month' ? 2 : 0)
  if (trendView.value === 'month') {
    return {
      brand: hi.map((x) => x * 18),
      overseas: lo.map((x) => x * 14),
    }
  }
  return { brand: hi, overseas: lo }
})

const trendBrand = computed(() => trendSeriesFinance.value.brand)
const trendOverseas = computed(() => trendSeriesFinance.value.overseas)

const fdYMax = computed(() =>
  niceCeilMax(Math.max(1, ...trendBrand.value, ...trendOverseas.value)),
)

const fdYTickLabels = computed(() => {
  const ticks = 4
  const mx = fdYMax.value
  const { yTop, yBase } = fdInner.value
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

const fdYGridLines = computed(() => fdYTickLabels.value.map((x) => x.y))

function fdPointY(val: number): number {
  const { yTop, yBase } = fdInner.value
  const mx = fdYMax.value
  const h = yBase - yTop
  return yBase - (val / mx) * h
}

function fdPointX(i: number): number {
  const n = fdTrendXLabels.value.length
  const { x0, x1 } = fdInner.value
  if (n <= 1) return x0
  return x0 + ((x1 - x0) * i) / (n - 1)
}

function fdSeriesPoints(vals: number[]): string {
  const n = vals.length
  const { x0, x1, yBase } = fdInner.value
  const mx = fdYMax.value
  if (n <= 0) return ''
  return vals
    .map((v, i) => {
      const x = n === 1 ? x0 : x0 + ((x1 - x0) * i) / (n - 1)
      const y = fdPointY(v)
      return `${x},${y}`
    })
    .join(' ')
}

function fdAreaUnder(vals: number[]): string {
  const n = vals.length
  const { x0, x1, yBase } = fdInner.value
  if (n <= 0) return ''
  const pts = vals.map((v, i) => {
    const x = n === 1 ? x0 : x0 + ((x1 - x0) * i) / (n - 1)
    const y = fdPointY(v)
    return `${x},${y}`
  })
  const firstX = n === 1 ? x0 : x0
  const lastX = n === 1 ? x1 : x0 + ((x1 - x0) * (n - 1)) / (n - 1)
  return `${firstX},${yBase} ${pts.join(' ')} ${lastX},${yBase}`
}

const fdAreaBrand = computed(() => fdAreaUnder(trendBrand.value))

const fdXStride = computed(() => {
  const n = fdTrendXLabels.value.length
  if (n > 24) return 5
  if (n > 16) return 3
  if (n > 12) return 2
  return 1
})

const fdXLabelItems = computed(() => {
  const labels = fdTrendXLabels.value
  const n = labels.length
  const st = fdXStride.value
  const deg = n > 14 ? -20 : 0
  return labels
    .map((t, i) => ({
      i,
      t,
      x: fdPointX(i),
      deg,
      show: i % st === 0 || i === n - 1,
    }))
    .filter((x) => x.show)
})

const fdTip = ref({
  show: false,
  px: 0,
  py: 0,
  idx: -1,
  title: '',
  rows: [] as { k: string; v: string }[],
})

function onFdChartMove(e: MouseEvent) {
  const el = fdChartHostRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const xr = (e.clientX - rect.left) / rect.width
  const vx = xr * fdVb.w
  const { x0, x1 } = fdInner.value
  if (vx < x0 - 4 || vx > x1 + 4) {
    fdTip.value.show = false
    return
  }
  const n = fdTrendXLabels.value.length
  if (n <= 0) return
  const t = (vx - x0) / (x1 - x0)
  let idx = Math.round(t * (n - 1))
  idx = Math.max(0, Math.min(n - 1, idx))
  const b = trendBrand.value[idx] ?? 0
  const o = trendOverseas.value[idx] ?? 0
  fdTip.value.idx = idx
  fdTip.value.title = fdTrendXLabels.value[idx] ?? ''
  fdTip.value.rows = [
    { k: '品牌打款', v: fmtMoneyKpiDisplay(Math.round(b)) },
    { k: '海外文娱打款', v: fmtMoneyKpiDisplay(Math.round(o)) },
  ]
  fdTip.value.show = true
  fdTip.value.px = e.clientX - rect.left
  fdTip.value.py = e.clientY - rect.top
}

function onFdChartLeave() {
  fdTip.value.show = false
  fdTip.value.idx = -1
}

const trendSubtitle = computed(() => {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth() + 1
  const d = now.getDate()
  if (trendView.value === 'day') {
    return `品牌打款 vs 海外文娱打款（${y}年${m}月1日—${m}月${d}日，按天）；悬停查看各点金额。`
  }
  return `品牌 vs 海外文娱（${y}年1—12月，按月）；悬停查看各点金额。`
})

const walletPayOut = computed(() => {
  const raw = [
    { name: '项目钱包', pay: 124800000, wd: 6200000 },
    { name: '分红钱包', pay: 14800000, wd: 2100000 },
    { name: '奖励钱包', pay: 8620000, wd: 980000 },
  ]
  const maxP = Math.max(...raw.map((r) => r.pay), 1)
  const maxW = Math.max(...raw.map((r) => r.wd), 1)
  return raw.map((r) => ({
    ...r,
    pPay: Math.round((r.pay / maxP) * 100),
    pWd: Math.round((r.wd / maxW) * 100),
  }))
})

const statusSlices = [
  { name: '已打款', pct: 72, color: 'var(--success)' },
  { name: '已审核未打款', pct: 18, color: 'var(--warning)' },
  { name: '未审核未打款', pct: 10, color: 'var(--dv-chart-muted)' },
]
const statusConic = computed(() => {
  let acc = 0
  const parts = statusSlices.map((s) => {
    const a = acc
    acc += s.pct
    return `${s.color} ${a}% ${acc}%`
  })
  return `conic-gradient(${parts.join(', ')})`
})

const tabLabel = computed(() => tableTabs.find((t) => t.key === tableTab.value)?.label ?? '')

const tableRows = computed(() => {
  const prefix =
    tableTab.value === 'domestic' ? 'CN' : tableTab.value === 'foreign' ? 'INTL' : 'OS'
  return [
    { period: '2026-04-28', pname: `${prefix}-番茄推文旗舰`, pid: `${prefix}-10021`, paid: 420000, pending: 62000 },
    { period: '2026-04-28', pname: `${prefix}-短剧联运 A`, pid: `${prefix}-10088`, paid: 286000, pending: 48000 },
    { period: '2026-04-29', pname: `${prefix}-网盘拉新包`, pid: `${prefix}-10102`, paid: 198000, pending: 32000 },
    { period: '2026-04-29', pname: `${prefix}-奖励清算批次`, pid: `${prefix}-91002`, paid: 96000, pending: 12000 },
    { period: '2026-04-30', pname: `${prefix}-海外剧场结算`, pid: `${prefix}-88201`, paid: 512000, pending: 88000 },
  ]
})

function applyTopFilter() {
  /* 趋势/KPI 为演示静态数据；接入 API 时在此提交 timePreset / range / granularity */
}

function queryTableDetail() {
  /* 明细表由 tableTab + computed 联动；接 API 时可在此请求分页数据 */
}

function runFinanceQuery() {
  applyTopFilter()
  queryTableDetail()
}

function doExport() {
  const headers = ['统计周期', '项目名称', '项目 ID', '已打款总额', '已审核未打款总额']
  const rows = tableRows.value.map((r) => [
    r.period,
    r.pname,
    r.pid,
    fmtMoney(r.paid),
    fmtMoney(r.pending),
  ])
  downloadCsv(`财务数据明细_${tableTab.value}_${tableTime.value}`, headers, rows)
}
</script>

<style scoped>
.fd-wrap { min-height: 100%; width: 100%; min-width: 0; box-sizing: border-box; }
.fd-kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 14px;
}
@media (min-width: 1200px) {
  .fd-kpi-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); }
}

.fd-chart-card { padding: 18px 20px; width: 100%; min-width: 0; box-sizing: border-box; }
.fd-chart-head { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 8px; }
.fd-trend-head { align-items: flex-start; margin-bottom: 12px; }
.fd-trend-head-main { flex: 1; min-width: 0; }
.fd-chart-title { font-size: 14px; font-weight: 600; color: var(--text-primary); display: block; }
.fd-chart-sub { margin: 6px 0 0; font-size: 12px; color: var(--text-muted); line-height: 1.45; }
.fd-trend-tabs { flex-shrink: 0; align-self: flex-start; }
.fd-trend-tabs .tab-nav { min-height: 40px; padding: 0 4px 0 8px; border-bottom-color: var(--border); }
.fd-subtab { gap: 4px; }
.fd-chart-host { margin-top: 4px; }
.fd-svg {
  width: 100%;
  height: auto;
  display: block;
  aspect-ratio: 656 / 248;
  max-height: 320px;
}
.fd-svg--meet { overflow: visible; }
.fd-axis-text {
  font-size: 11px;
  fill: var(--text-muted);
  font-family: var(--font-sans, system-ui, -apple-system, sans-serif);
}
.fd-xlab { font-size: 11px; }
.fd-y-unit {
  font-size: 11px;
  fill: var(--text-muted);
  font-weight: 500;
}
.fd-hover-line {
  stroke: color-mix(in srgb, var(--primary) 45%, var(--text-muted));
  stroke-width: 1;
  stroke-dasharray: 4 3;
  pointer-events: none;
}
.fd-hover-dot {
  fill: var(--surface);
  stroke-width: 2;
  pointer-events: none;
}
.fd-chart-tip { z-index: 6; }
.fd-chart-grid {
  stroke: var(--dv-chart-grid);
  stroke-width: 1;
  fill: none;
}
.fd-line-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 8px;
  font-size: 12px;
  color: var(--text-secondary);
}
.fd-lg {
  display: inline-block;
  width: 14px;
  height: 3px;
  margin-right: 6px;
  vertical-align: middle;
  border-radius: 2px;
}
.fd-lg--dash {
  height: 0;
  border-bottom: 3px dashed;
  background: none !important;
}

.fd-table-head { align-items: flex-start; }
.fd-table-head-info { min-width: 0; flex: 1 1 180px; }
.fd-table-head-tools {
  display: flex; flex-wrap: wrap; align-items: flex-end; gap: 10px 12px;
  justify-content: flex-end; flex: 2 1 360px;
}
.fd-tool-item { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.fd-tool-item label { font-size: 11px; font-weight: 500; color: var(--text-muted); }
.fd-tool-select { min-width: 104px; max-width: 160px; font-size: 13px; padding: 6px 10px; }
.fd-tool-date { min-width: 132px; font-size: 13px; padding: 6px 10px; }
.fd-tool-actions { display: flex; gap: 8px; padding-bottom: 1px; }

.fd-dist-row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 14px; margin-top: 14px; width: 100%; }
@media (max-width: 900px) { .fd-dist-row { grid-template-columns: 1fr; } }

.fd-bar-stack { display: flex; flex-direction: column; gap: 16px; }
.fd-group-bar { display: grid; grid-template-columns: 88px 1fr; gap: 12px; align-items: start; font-size: 12px; }
.fd-wname { font-weight: 600; color: var(--text-secondary); padding-top: 6px; }
.fd-split-bars {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.fd-split-item {
  display: grid;
  grid-template-columns: 38px 1fr auto;
  gap: 8px;
  align-items: center;
  color: var(--text-muted);
  min-width: 0;
}
.fd-split-lab { font-size: 11px; }
.fd-split-val {
  font-style: normal;
  font-weight: 600;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
  font-size: 11px;
}

.fd-pie-row { display: flex; flex-wrap: wrap; align-items: center; gap: 20px; }
.fd-pie {
  width: 176px;
  height: 176px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: inset 0 0 0 1px var(--border);
}
.fd-leg { list-style: none; padding: 0; margin: 0; font-size: 13px; color: var(--text-secondary); }
.fd-leg li { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.fd-leg strong { margin-left: auto; color: var(--text-primary); }
.fd-dot { width: 10px; height: 10px; border-radius: 50%; }
</style>
