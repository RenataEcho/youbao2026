<template>
  <div class="uca dv-board-stagger">
    <div class="glass-card uca-top">
      <div class="uca-filter-row">
        <div class="uca-field uca-time">
          <label class="uca-lbl">时间范围（必选）</label>
          <div class="uca-preset-row">
            <div class="uca-preset-btns" role="group" aria-label="时间快捷选项">
              <button
                v-for="p in presets"
                :key="p.key"
                type="button"
                class="uca-preset-btn"
                :class="{ active: timePreset === p.key }"
                @click="setPreset(p.key)"
              >{{ p.label }}</button>
            </div>
            <div v-show="timePreset === 'custom'" class="uca-custom-wrap" role="group" aria-label="自定义日期">
              <span class="uca-range-sep">开始</span>
              <input v-model="customStart" type="date" class="ul-input uca-date-inp" @change="onCustomChange">
              <span class="uca-range-sep">结束</span>
              <input v-model="customEnd" type="date" class="ul-input uca-date-inp" @change="onCustomChange">
            </div>
          </div>
        </div>
        <div class="uca-field">
          <label class="uca-lbl">渠道</label>
          <select v-model="fChannel" class="ul-input ul-select uca-select">
            <option value="">全部</option>
            <option v-for="c in channelOpts" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
        <div class="uca-field">
          <label class="uca-lbl">子渠道</label>
          <select v-model="fSub" class="ul-input ul-select uca-select">
            <option value="">全部</option>
            <option value="自然">自然</option>
            <option value="巨量">巨量</option>
            <option value="广点通">广点通</option>
          </select>
        </div>
        <div class="uca-field">
          <label class="uca-lbl">平台</label>
          <select v-model="fPlatform" class="ul-input ul-select uca-select">
            <option value="">全部</option>
            <option value="iOS">iOS</option>
            <option value="Android">Android</option>
            <option value="PC">PC</option>
          </select>
        </div>
        <div class="uca-field">
          <label class="uca-lbl">用户类型</label>
          <select v-model="fUserType" class="ul-input ul-select uca-select">
            <option value="">全部</option>
            <option value="新用户">新用户</option>
            <option value="老用户">老用户</option>
          </select>
        </div>
        <button type="button" class="btn btn-primary btn-sm uca-actions" @click="onQuery">查询</button>
        <button type="button" class="btn btn-default btn-sm uca-actions" @click="onExport">导出 CSV</button>
        <button type="button" class="btn btn-default btn-sm uca-actions" title="与顶栏主题联动" @click="themeStore.toggle()">主题</button>
      </div>
      <p class="uca-time-hint" aria-live="polite">{{ timeHint }}</p>
    </div>

    <div class="glass-card uca-kpi-strip">
      <div class="uca-strip-h">核心指标一览（随顶部筛选变化 · 示例数据）</div>
      <div class="uca-kpi-grid">
        <div v-for="(k, i) in KPI_ITEMS" :key="i" class="glass-card uca-kpi dv-kpi-interactive">
          <div class="uca-kpi-lab">{{ k.label }}</div>
          <div class="uca-kpi-val">{{ k.valueStr ?? fmtThousands(k.value ?? 0) }}</div>
          <div class="uca-kpi-sub" :class="{ down: k.subDown }">{{ k.sub }}</div>
        </div>
      </div>
    </div>

    <section id="sec-core-value" class="uca-section uca-section--noborder">
      <h2 class="uca-sec-title">核心价值用户</h2>
      <p class="uca-sec-desc">按业务行为拆分用户规模；扇形图为占比示意（与顶部筛选联动需对接数据）。</p>
      <div class="uca-chart-grid">
        <div class="glass-card uca-chart-half">
          <h3 class="uca-card-h">题词 / 回填 / 出单 构成</h3>
            <div class="uca-pie-wrap">
            <div class="uca-donut dv-donut-ambient" :style="{ background: coreConic }" aria-hidden="true" />
            <div class="uca-donut-hole" />
          </div>
          <ul class="uca-mini-legend">
            <li v-for="s in CORE_VALUE_PIE" :key="s.key">
              <span class="uca-dot" :style="{ background: s.color }" />{{ s.label }}
            </li>
          </ul>
        </div>
        <div class="glass-card uca-chart-half">
          <h3 class="uca-card-h">指标统计</h3>
          <div class="ul-table-wrap uca-twrap">
            <table class="ul-table">
              <thead><tr><th>指标</th><th class="th-num">用户数</th><th>说明</th></tr></thead>
              <tbody>
                <tr v-for="r in CORE_VALUE_ROWS" :key="r.metric">
                  <td>{{ r.metric }}</td>
                  <td class="td-num">{{ fmtThousands(r.users) }}</td>
                  <td class="td-muted">{{ r.note }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="uca-foot-hint">注：同一用户可同时具备多类行为，扇形图按主行为或去重口径以实际埋点为准。</p>
        </div>
      </div>
    </section>

    <section id="sec-overview" class="uca-section">
      <h2 class="uca-sec-title">渠道总览（Acquisition）</h2>
      <p class="uca-sec-desc">快速判断各渠道用户规模与趋势；指标默认按注册渠道归因。</p>
      <div class="uca-chart-grid">
        <div class="glass-card uca-chart-half">
          <h3 class="uca-card-h">新增用户趋势（按渠道）</h3>
          <div class="uca-svg-wrap" role="img" aria-label="折线图：新增用户趋势">
            <svg class="uca-svg" viewBox="0 0 520 232" preserveAspectRatio="xMidYMid meet">
              <g class="uca-chart-gridlines">
                <line v-for="i in 4" :key="i" x1="48" :y1="36 + (i - 1) * 44" x2="500" :y2="36 + (i - 1) * 44" />
              </g>
              <g :key="acqChartEpoch">
              <polyline
                v-for="(s, si) in ACQ_LINE_SERIES"
                :key="si"
                :points="linePoints(norm(s.data as unknown as number[]))"
                fill="none"
                :stroke="s.color"
                stroke-width="2"
                class="dv-chart-line"
              />
              </g>
              <text x="48" y="28" font-size="11" fill="var(--text-muted)">相对刻度（演示）</text>
              <text
                v-for="(d, i) in TREND_LABELS"
                :key="'xl'+i"
                :x="labelX(i, TREND_LABELS.length)"
                y="222"
                text-anchor="middle"
                font-size="11"
                fill="var(--text-muted)"
              >{{ d }}</text>
            </svg>
          </div>
          <div class="uca-line-legend">
            <span v-for="(s, i) in ACQ_LINE_SERIES" :key="i"><i class="uca-lg" :style="{ background: s.color }" />{{ s.label }}</span>
          </div>
        </div>
        <div class="glass-card uca-chart-half">
          <h3 class="uca-card-h">渠道占比</h3>
          <div class="uca-pie-wrap uca-pie-wrap--sm">
            <div class="uca-donut uca-donut--sm dv-donut-ambient" :style="{ background: shareConic }" />
            <div class="uca-donut-hole uca-donut-hole--sm" />
          </div>
          <ul class="uca-mini-legend">
            <li v-for="(lab, i) in CHANNEL_LABELS" :key="lab">
              <span class="uca-dot" :style="{ background: shareColors[i] }" />{{ lab }} {{ CHANNEL_SHARE[i] }}%
            </li>
          </ul>
        </div>
        <div class="glass-card uca-chart-wide">
          <h3 class="uca-card-h">渠道明细（可下钻）</h3>
          <div class="ul-table-wrap uca-scroll-t">
            <table class="ul-table">
              <thead><tr><th>渠道</th><th class="th-num">新增</th><th class="th-num">占比</th><th>趋势</th></tr></thead>
              <tbody>
                <tr v-for="r in CHANNEL_DETAIL" :key="r.ch">
                  <td>{{ r.ch }}</td>
                  <td class="td-num">{{ fmtThousands(r.newU) }}</td>
                  <td class="td-num">{{ r.share }}</td>
                  <td>{{ r.trend }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <section id="sec-funnel" class="uca-section">
      <h2 class="uca-sec-title">转化漏斗（Conversion）</h2>
      <p class="uca-sec-desc">注册 → 激活 → 核心行为 → 价值用户；对比各渠道转化与流失。</p>
      <div class="uca-funnel-def glass-card">
        <ul>
          <li><strong>激活</strong>：用户完成「首次关键行为」——提过关键词<strong>或</strong>生成过口令<strong>或</strong>获取过任务二维码。</li>
          <li><strong>核心行为</strong>：产生过订单的用户。</li>
          <li><strong>价值用户</strong>：在平台产生过项目收益，且<strong>累计项目收益 &gt; 100 元</strong>的用户。</li>
        </ul>
      </div>
      <div class="uca-chart-grid">
        <div class="glass-card uca-chart-half">
          <h3 class="uca-card-h">整体漏斗</h3>
          <div class="uca-funnel">
            <div
              v-for="(st, i) in FUNNEL_STEPS"
              :key="st.name"
              class="uca-funnel-step"
              :style="{ width: st.widthPct + '%', background: funnelGrad(i) }"
            >
              {{ st.name }} {{ fmtThousands(st.count) }}<span>{{ st.pctLabel }}</span>
            </div>
          </div>
        </div>
        <div class="glass-card uca-chart-half">
          <h3 class="uca-card-h">分渠道漏斗（到达价值用户人数）</h3>
          <div class="uca-bar-list">
            <div v-for="(v, i) in FUNNEL_VALUE_USERS" :key="i" class="dv-bar-row">
              <span class="dv-bar-lab">{{ CHANNEL_LABELS[i] }}</span>
              <div class="dv-bar-track"><div class="dv-bar-fill" :style="{ width: funnelBarPct(i) + '%', background: barColors[i % barColors.length] }" /></div>
              <span class="dv-bar-num">{{ fmtThousands(v) }}</span>
            </div>
          </div>
        </div>
        <div class="glass-card uca-chart-wide">
          <h3 class="uca-card-h">转化率与流失率</h3>
          <div class="ul-table-wrap">
            <table class="ul-table ul-table--fixed">
              <colgroup>
                <col style="width:12%"><col style="width:12%"><col style="width:12%"><col style="width:14%"><col style="width:14%"><col style="width:36%">
              </colgroup>
              <thead>
                <tr>
                  <th>渠道</th><th class="th-num">注册→激活</th><th class="th-num">激活→核心</th><th class="th-num">核心→价值用户</th><th class="th-num">整体价值用户率</th><th>流失提示</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="r in FUNNEL_TABLE" :key="r.ch">
                  <td>{{ r.ch }}</td>
                  <td class="td-num">{{ r.r1 }}</td>
                  <td class="td-num">{{ r.r2 }}</td>
                  <td class="td-num">{{ r.r3 }}</td>
                  <td class="td-num">{{ r.r4 }}</td>
                  <td>{{ r.hint }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <section id="sec-profile" class="uca-section uca-section--last">
      <h2 class="uca-sec-title">用户画像（User Profile）</h2>
      <p class="uca-sec-desc">注册渠道仅统计应用商店、小程序、PC、H5；应用商店端内平台分布见下图。</p>
      <div class="uca-chart-grid uca-chart-grid--stack">
        <div class="glass-card uca-chart-wide">
          <h3 class="uca-card-h">渠道 × 终端结构（示意）</h3>
          <div class="uca-stack-list">
            <div v-for="row in PROFILE_STACK" :key="row.ch" class="uca-stack-row">
              <span class="uca-stack-lab">{{ row.ch }}</span>
              <div class="uca-stack-track">
                <div class="uca-seg" :style="segStyle(row.ios, row)" :title="'iOS ' + row.ios + '%'" />
                <div class="uca-seg uca-seg--2" :style="segStyle(row.and, row)" :title="'Android 及其他 ' + row.and + '%'" />
                <div class="uca-seg uca-seg--3" :style="segStyle(row.pc, row)" :title="'PC/其他 ' + row.pc + '%'" />
              </div>
            </div>
          </div>
          <div class="uca-line-legend uca-line-legend--tight">
            <span><i class="uca-lg" style="background:var(--dv-chart-1)" />iOS</span>
            <span><i class="uca-lg" style="background:var(--dv-chart-4)" />Android 及其他移动</span>
            <span><i class="uca-lg" style="background:var(--dv-chart-muted)" />PC / 其他</span>
          </div>
        </div>
        <div class="uca-half-row">
          <div class="glass-card uca-chart-half">
            <h3 class="uca-card-h">应用商店 · 平台分布（注册口径示例）</h3>
            <div class="uca-pie-wrap uca-pie-wrap--sm">
              <div class="uca-donut uca-donut--sm dv-donut-ambient" :style="{ background: storeConic }" />
              <div class="uca-donut-hole uca-donut-hole--sm" />
            </div>
            <ul class="uca-mini-legend uca-mini-legend--cols">
              <li v-for="s in PROFILE_STORE_PIE" :key="s.label">
                <span class="uca-dot" :style="{ background: s.color }" />{{ s.label }} {{ s.v }}%
              </li>
            </ul>
          </div>
          <div class="glass-card uca-chart-half">
            <h3 class="uca-card-h">使用时段热力（0–23 时 × 周一至周日）</h3>
            <div class="uca-heat">
              <div />
              <div v-for="d in weekHead" :key="d" class="uca-heat-head">{{ d }}</div>
              <template v-for="row in HEATMAP_ROWS" :key="row.label">
                <div class="uca-heat-side">{{ row.label }}</div>
                <div
                  v-for="(cell, ci) in row.cells"
                  :key="ci"
                  class="uca-heat-cell"
                  :style="{ background: heatBg(cell), color: cell >= 35 ? '#fff' : 'var(--text-primary)' }"
                >{{ cell }}</div>
              </template>
            </div>
            <p class="uca-foot-hint">色块为相对活跃度（示意数据）</p>
          </div>
        </div>
      </div>
    </section>

    <div class="uca-note-footer">{{ FOOTER_NOTE }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useThemeStore } from '@/stores/theme'
import { fmtThousands } from './utils/dataUi'
import {
  ACQ_LINE_SERIES,
  CHANNEL_DETAIL,
  CHANNEL_LABELS,
  CHANNEL_SHARE,
  CORE_VALUE_PIE,
  CORE_VALUE_ROWS,
  FOOTER_NOTE,
  FUNNEL_STEPS,
  FUNNEL_TABLE,
  FUNNEL_VALUE_USERS,
  HEATMAP_ROWS,
  KPI_ITEMS,
  PROFILE_STACK,
  PROFILE_STORE_PIE,
  TREND_LABELS,
} from './mock/channelAnalyticsDemo'

const themeStore = useThemeStore()

const presets = [
  { key: 'today' as const, label: '今日' },
  { key: 'week' as const, label: '本周' },
  { key: 'month' as const, label: '本月' },
  { key: 'custom' as const, label: '自定义' },
]
type TimePreset = (typeof presets)[number]['key']

const timePreset = ref<TimePreset>('month')
const customStart = ref('')
const customEnd = ref('')
const timeHint = ref('')
const fChannel = ref('')
const fSub = ref('')
const fPlatform = ref('')
const fUserType = ref('')

/** 折线图描边动画：查询后递增以重挂载 <g> */
const acqChartEpoch = ref(0)

const channelOpts = [...CHANNEL_LABELS]

const weekHead = ['一', '二', '三', '四', '五', '六', '日']
const heatMax = 52

const shareColors = [
  'var(--dv-chart-1)',
  'var(--dv-chart-4)',
  'var(--dv-chart-5)',
  'var(--dv-chart-muted)',
] as const

const barColors = [...shareColors]

function pad2(n: number) {
  return String(n).padStart(2, '0')
}
function fmtDate(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}
function fmtSlash(iso: string) {
  return iso ? iso.replace(/-/g, '/') : ''
}

function rangeToday() {
  const d = new Date()
  const s = fmtDate(d)
  return { start: s, end: s, label: `当前为「今日」：${fmtSlash(s)}` }
}
function rangeThisWeek() {
  const d = new Date()
  const day = d.getDay()
  const toMon = day === 0 ? -6 : 1 - day
  const mon = new Date(d.getFullYear(), d.getMonth(), d.getDate() + toMon)
  const sun = new Date(mon.getFullYear(), mon.getMonth(), mon.getDate() + 6)
  return {
    start: fmtDate(mon),
    end: fmtDate(sun),
    label: `当前为「本周」（周一至周日）：${fmtSlash(fmtDate(mon))} — ${fmtSlash(fmtDate(sun))}`,
  }
}
function rangeThisMonth() {
  const d = new Date()
  const first = new Date(d.getFullYear(), d.getMonth(), 1)
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0)
  return {
    start: fmtDate(first),
    end: fmtDate(last),
    label: `当前为「本月」：${fmtSlash(fmtDate(first))} — ${fmtSlash(fmtDate(last))}`,
  }
}

function normalizeRange() {
  if (customStart.value && customEnd.value && customStart.value > customEnd.value) {
    const t = customStart.value
    customStart.value = customEnd.value
    customEnd.value = t
  }
}

function setPreset(p: TimePreset) {
  timePreset.value = p
  if (p === 'custom') {
    if (!customStart.value || !customEnd.value) {
      const m = rangeThisMonth()
      customStart.value = m.start
      customEnd.value = m.end
    }
    timeHint.value =
      customStart.value && customEnd.value
        ? `自定义范围：${fmtSlash(customStart.value)} — ${fmtSlash(customEnd.value)}`
        : '自定义：请选择开始、结束日期。'
    return
  }
  const r = p === 'today' ? rangeToday() : p === 'week' ? rangeThisWeek() : rangeThisMonth()
  customStart.value = r.start
  customEnd.value = r.end
  timeHint.value = r.label
}

function onCustomChange() {
  normalizeRange()
  if (timePreset.value === 'custom') {
    timeHint.value = `自定义范围：${fmtSlash(customStart.value)} — ${fmtSlash(customEnd.value)}`
  }
}

onMounted(() => {
  setPreset('month')
})

function norm(arr: number[]): number[] {
  const mx = Math.max(...arr, 1)
  return arr.map((x) => x / mx)
}
function linePoints(vals: number[]): string {
  const n = vals.length
  const x0 = 48
  const x1 = 500
  const yBase = 188
  const yTop = 44
  const h = yBase - yTop
  return vals
    .map((v, i) => {
      const x = n === 1 ? x0 : x0 + ((x1 - x0) * i) / (n - 1)
      const y = yBase - v * h
      return `${x},${y}`
    })
    .join(' ')
}
function labelX(i: number, n: number): number {
  const x0 = 48
  const x1 = 500
  return n <= 1 ? x0 : x0 + ((x1 - x0) * i) / (n - 1)
}

const coreTotal = computed(() => CORE_VALUE_PIE.reduce((s, x) => s + x.value, 0))
const coreConic = computed(() => {
  let acc = 0
  const parts = CORE_VALUE_PIE.map((s) => {
    const pct = (s.value / coreTotal.value) * 100
    const start = acc
    acc += pct
    return `${s.color} ${start}% ${acc}%`
  })
  return `conic-gradient(${parts.join(', ')})`
})

const shareConic = computed(() => {
  const sum = CHANNEL_SHARE.reduce((a, b) => a + b, 0)
  let acc = 0
  const parts = CHANNEL_SHARE.map((v, i) => {
    const pct = (v / sum) * 100
    const start = acc
    acc += pct
    return `${shareColors[i]} ${start}% ${acc}%`
  })
  return `conic-gradient(${parts.join(', ')})`
})

const storePieTotal = computed(() => PROFILE_STORE_PIE.reduce((s, x) => s + x.v, 0))
const storeConic = computed(() => {
  let acc = 0
  const parts = PROFILE_STORE_PIE.map((s) => {
    const pct = (s.v / storePieTotal.value) * 100
    const start = acc
    acc += pct
    return `${s.color} ${start}% ${acc}%`
  })
  return `conic-gradient(${parts.join(', ')})`
})

const funnelMax = computed(() => Math.max(...FUNNEL_VALUE_USERS, 1))
function funnelBarPct(i: number) {
  return Math.round((FUNNEL_VALUE_USERS[i] / funnelMax.value) * 100)
}

function funnelGrad(i: number): string {
  const g = [
    'linear-gradient(90deg,var(--dv-chart-1),#3b82f6)',
    'linear-gradient(90deg,#1d4ed8,#60a5fa)',
    'linear-gradient(90deg,#1e40af,#38bdf8)',
    'linear-gradient(90deg,#172554,#0ea5e9)',
  ]
  return g[i] ?? g[0]
}

function segStyle(pct: number, row: { ios: number; and: number; pc: number }) {
  const sum = row.ios + row.and + row.pc
  const w = sum ? (pct / sum) * 100 : 0
  return { width: `${w}%` }
}

function heatBg(v: number) {
  const a = Math.min(0.15 + (v / heatMax) * 0.72, 0.88)
  return `rgba(37, 99, 235, ${a.toFixed(2)})`
}

function onQuery() {
  acqChartEpoch.value += 1
  normalizeRange()
  const modeMap: Record<string, string> = { today: '今日', week: '本周', month: '本月', custom: '自定义' }
  const mode = modeMap[timePreset.value] ?? timePreset.value
  ElMessage.info(
    `演示：时间=${mode}（${customStart.value} ~ ${customEnd.value}），渠道=${fChannel.value || '全部'}，子渠道=${fSub.value || '全部'}；接 API 后刷新图表。`,
  )
}

function onExport() {
  ElMessage.success('演示：将按当前筛选导出 CSV / Excel（需对接导出接口）。')
}
</script>

<style scoped>
.uca { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.uca-top { padding: 14px 16px 12px; }
.uca-filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 12px;
  align-items: flex-end;
}
.uca-field { min-width: 0; }
.uca-lbl {
  display: block;
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 4px;
}
.uca-time { flex: 1 1 280px; max-width: 640px; min-width: 200px; }
.uca-preset-row { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 10px; }
.uca-preset-btns { display: flex; flex-wrap: wrap; gap: 6px; }
.uca-preset-btn {
  height: 32px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}
.uca-preset-btn:hover { border-color: var(--primary); color: var(--primary); }
.uca-preset-btn.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
}
.uca-custom-wrap {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  min-height: 32px;
  padding: 0 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
}
.uca-range-sep { font-size: 12px; color: var(--text-muted); user-select: none; }
.uca-date-inp { width: 132px; font-size: 13px; border: none; background: transparent; }
.uca-select { min-width: 120px; font-size: 13px; padding: 6px 10px; }
.uca-actions { align-self: flex-end; }
.uca-time-hint {
  font-size: 11px;
  color: var(--text-muted);
  margin: 8px 0 0;
  line-height: 1.45;
  min-height: 1.35em;
}

.uca-kpi-strip { padding: 14px 16px 16px; }
.uca-strip-h {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 12px;
}
.uca-kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(168px, 100%), 1fr));
  gap: 12px;
}
.uca-kpi { padding: 12px 14px; }
.uca-kpi-lab { font-size: 12px; color: var(--text-muted); }
.uca-kpi-val { font-size: 18px; font-weight: 700; margin-top: 4px; color: var(--text-primary); font-variant-numeric: tabular-nums; }
.uca-kpi-sub { font-size: 12px; margin-top: 4px; color: var(--success); font-weight: 600; }
.uca-kpi-sub.down { color: var(--danger); }

.uca-section {
  scroll-margin-top: 88px;
  padding-bottom: 20px;
  margin-bottom: 8px;
  border-bottom: 1px solid var(--border);
}
.uca-section--noborder { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
.uca-section--last { border-bottom: none; }
.uca-sec-title { font-size: 18px; font-weight: 700; margin-bottom: 6px; color: var(--text-primary); }
.uca-sec-desc { font-size: 13px; color: var(--text-muted); margin-bottom: 16px; line-height: 1.5; }

.uca-chart-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;
}
.uca-chart-grid--stack > .uca-chart-wide { grid-column: span 12; }
.uca-half-row {
  grid-column: span 12;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
@media (max-width: 900px) {
  .uca-half-row { grid-template-columns: 1fr; }
}
.uca-chart-wide { grid-column: span 12; padding: 16px 18px; min-height: 0; }
.uca-chart-half { grid-column: span 6; padding: 16px 18px; min-height: 0; }
@media (max-width: 900px) {
  .uca-chart-half { grid-column: span 12; }
}
.uca-card-h { font-size: 14px; font-weight: 600; margin-bottom: 12px; color: var(--text-secondary); }
.uca-svg-wrap { width: 100%; min-width: 0; overflow: hidden; }
.uca-svg { width: 100%; height: auto; display: block; aspect-ratio: 520 / 232; }
.uca-chart-gridlines {
  stroke: var(--dv-chart-grid);
  stroke-width: 1;
  fill: none;
}
.uca-line-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 10px;
  font-size: 12px;
  color: var(--text-secondary);
}
.uca-line-legend--tight { margin-top: 8px; }
.uca-lg {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  margin-right: 6px;
  vertical-align: middle;
}

.uca-pie-wrap { position: relative; width: 200px; height: 200px; margin: 8px auto 12px; }
.uca-pie-wrap--sm { width: 160px; height: 160px; }
.uca-donut {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px var(--border);
}
.uca-donut--sm { box-shadow: inset 0 0 0 1px var(--border); }
.uca-donut-hole {
  position: absolute;
  inset: 18%;
  border-radius: 50%;
  background: var(--surface);
  box-shadow: inset 0 0 0 1px var(--border);
  pointer-events: none;
}
.uca-donut-hole--sm { inset: 20%; }
.uca-mini-legend {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 12px;
  color: var(--text-secondary);
}
.uca-mini-legend--cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 12px;
}
@media (max-width: 600px) {
  .uca-mini-legend--cols { grid-template-columns: 1fr; }
}
.uca-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
  vertical-align: middle;
}

.uca-twrap { margin-top: 4px; }
.uca-scroll-t { max-height: 260px; overflow: auto; }
.uca-foot-hint { font-size: 12px; color: var(--text-muted); margin-top: 10px; line-height: 1.45; }

.uca-bar-list { display: flex; flex-direction: column; gap: 12px; padding-top: 4px; }

.uca-funnel-def {
  padding: 12px 14px;
  margin-bottom: 16px;
  border-left: 3px solid var(--primary);
  background: color-mix(in srgb, var(--dv-chart-1) 8%, transparent);
}
.uca-funnel-def ul { margin: 0; padding-left: 18px; font-size: 13px; color: var(--text-secondary); line-height: 1.6; }
.uca-funnel-def li { margin-bottom: 8px; }
.uca-funnel-def li:last-child { margin-bottom: 0; }

.uca-funnel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 0;
}
.uca-funnel-step {
  text-align: center;
  color: #fff;
  font-weight: 600;
  font-size: 13px;
  padding: 12px 8px;
  border-radius: 6px;
  box-sizing: border-box;
  min-width: 0;
  animation: uca-funnel-enter 0.58s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.uca-funnel-step:nth-child(1) { animation-delay: 0.04s; }
.uca-funnel-step:nth-child(2) { animation-delay: 0.1s; }
.uca-funnel-step:nth-child(3) { animation-delay: 0.16s; }
.uca-funnel-step:nth-child(4) { animation-delay: 0.22s; }
.uca-funnel-step span { display: block; font-size: 11px; font-weight: 400; opacity: 0.95; margin-top: 4px; }

@keyframes uca-funnel-enter {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .uca-funnel-step {
    animation: none !important;
  }
}

.uca-stack-list { display: flex; flex-direction: column; gap: 12px; padding: 8px 0; }
.uca-stack-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.uca-stack-lab { width: 72px; flex-shrink: 0; font-size: 13px; color: var(--text-secondary); }
.uca-stack-track {
  flex: 1;
  min-width: 120px;
  height: 22px;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
}
.uca-seg { height: 100%; background: var(--dv-chart-1); transition: width 0.5s cubic-bezier(0.22, 1, 0.36, 1); }
.uca-seg--2 { background: var(--dv-chart-4); }
.uca-seg--3 { background: var(--dv-chart-muted); }

.uca-heat {
  display: grid;
  grid-template-columns: 44px repeat(7, 1fr);
  gap: 4px;
  font-size: 11px;
  margin-top: 8px;
  align-items: center;
}
.uca-heat-head {
  text-align: center;
  color: var(--text-muted);
  font-size: 10px;
}
.uca-heat-side { color: var(--text-muted); text-align: right; padding-right: 4px; }
.uca-heat-cell {
  aspect-ratio: 1.2;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 11px;
}

.uca-note-footer {
  font-size: 12px;
  color: var(--text-muted);
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px dashed var(--border);
  line-height: 1.55;
}
</style>
