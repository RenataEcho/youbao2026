<template>
  <div class="bd-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">首页</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">数据</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">品牌项目数据</span>
    </div>

    <div class="page-content dv-board-stagger">
      <div class="page-header">
        <div>
          <h1 class="page-title">品牌项目数据</h1>
          <p class="page-desc">品牌业务线统计看板：顶部指标、中部图表、底部可导出明细（Mock，对齐 PRD §6.1.1）</p>
        </div>
        <button type="button" class="btn btn-default btn-sm" @click="doExport">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          导出 CSV
        </button>
      </div>

      <div class="bd-kpi-grid">
        <DvStatKpi
          :value="fmtThousands(kpi.projectTotal)"
          :value-title="`项目总数 ${fmtThousands(kpi.projectTotal)}`"
          label="项目总数"
          :sub="`上线 ${kpi.online} · 下线 ${kpi.offline}`"
          tint="blue"
        >
          <template #icon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><rect x="7" y="7" width="10" height="10" rx="2"/></svg>
          </template>
        </DvStatKpi>
        <DvStatKpi
          :value="fmtThousands(kpi.keywordTotal)"
          :value-title="`总题词数 ${fmtThousands(kpi.keywordTotal)}`"
          label="总题词数"
          :sub="`审核通过 ${fmtThousands(kpi.keywordApproved)}`"
          tint="cyan"
        >
          <template #icon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>
          </template>
        </DvStatKpi>
        <DvStatKpi
          :value="fmtThousands(kpi.workTotal)"
          :value-title="`总作品数 ${fmtThousands(kpi.workTotal)}`"
          label="总作品数"
          :sub="`审核通过 ${fmtThousands(kpi.workApproved)}`"
          tint="violet"
        >
          <template #icon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="2" width="20" height="20" rx="2.18"/><path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 7h5M17 17h5"/></svg>
          </template>
        </DvStatKpi>
        <DvStatKpi
          :value="fmtThousands(kpi.orderTotal)"
          :value-title="`总订单数 ${fmtThousands(kpi.orderTotal)}`"
          label="总订单数"
          :sub="`未结算 ${fmtThousands(kpi.orderUnsettled)} · 已结算 ${fmtThousands(kpi.orderSettled)}`"
          tint="amber"
        >
          <template #icon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          </template>
        </DvStatKpi>
        <DvStatKpi
          :value="fmtMoneyKpiDisplay(kpi.revenueTotal)"
          :value-title="fmtMoneyYuanFull(kpi.revenueTotal)"
          label="总收益金额"
          tint="emerald"
        >
          <template #icon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </template>
          <template #sub>
            未结算 <span :title="fmtMoneyYuanFull(kpi.revenueUnsettled)">{{ fmtMoneyKpiDisplay(kpi.revenueUnsettled) }}</span>
            · 已结算 <span :title="fmtMoneyYuanFull(kpi.revenueSettled)">{{ fmtMoneyKpiDisplay(kpi.revenueSettled) }}</span>
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

      <div class="bd-charts">
        <div class="glass-card bd-chart">
          <div class="bd-chart-hd">各业务类型的项目数量分布</div>
          <div class="bd-pie-layout">
            <div class="bd-pie-stage" @mouseleave="pieTip = null">
              <svg class="bd-pie-svg" viewBox="0 0 220 220" role="img" aria-label="各业务类型项目数量分布">
                <g
                  v-for="s in pieSlicesSvg"
                  :key="s.name"
                  class="bd-pie-slice-g"
                  @mouseenter="pieTip = { name: s.name, n: s.n, fill: s.fill }"
                >
                  <path
                    :d="s.d"
                    :fill="s.fill"
                    stroke="var(--surface)"
                    stroke-width="1.25"
                    class="bd-pie-slice"
                    :class="{ 'bd-pie-slice--hl': pieTip?.name === s.name }"
                  />
                </g>
                <circle cx="110" cy="110" :r="pieInnerR" fill="var(--surface)" stroke="var(--border)" stroke-width="1" />
                <text x="110" y="104" text-anchor="middle" class="bd-pie-mid-n">{{ pieTotal }}</text>
                <text x="110" y="128" text-anchor="middle" class="bd-pie-mid-l">项目数</text>
              </svg>
              <div v-if="pieTip" class="bd-pie-tip" role="tooltip">
                <div class="bd-pie-tip-t">{{ pieTip.name }}</div>
                <div class="bd-pie-tip-r"><span>数量</span><strong>{{ pieTip.n }}</strong></div>
                <div class="bd-pie-tip-r"><span>占比</span><strong>{{ piePct(pieTip.n) }}%</strong></div>
              </div>
            </div>
            <ul class="bd-leg">
              <li
                v-for="s in pieSlices"
                :key="s.name"
                class="bd-leg-li"
                @mouseenter="pieTip = { name: s.name, n: s.n, fill: s.fill }"
              >
                <span class="bd-dot" :style="{ background: s.fill }" />{{ s.name }} <strong>{{ s.n }}</strong>
              </li>
            </ul>
          </div>
        </div>
        <div class="glass-card bd-chart">
          <div class="bd-chart-hd">各业务类型的有效用户数量分布</div>
          <p class="bd-chart-tip">横轴为人数，纵轴为业务类型（与类目配置一致）</p>
          <div class="bd-bars">
            <div
              v-for="b in effBars"
              :key="b.name"
              class="dv-bar-row bd-bar-row"
              :title="`${b.name}：${fmtThousands(b.n)} 人（条形相对最大渠道 ${b.pct}%）`"
            >
              <span class="dv-bar-lab">{{ b.name }}</span>
              <div class="dv-bar-track"><div class="dv-bar-fill" :style="{ width: b.pct + '%', background: b.grad }" /></div>
              <span class="dv-bar-num">{{ fmtThousands(b.n) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="glass-card table-card">
        <div class="table-header bd-table-head">
          <div class="bd-table-head-info">
            <div class="table-title">项目明细<span class="table-count">共 {{ tableRows.length }} 条</span></div>
            <span class="table-meta">字段：项目名称、业务类型、题词/作品/订单、收益、有效用户</span>
          </div>
          <div class="bd-table-head-tools">
            <div class="bd-tool-item">
              <label for="bd-time-dim">时间维度</label>
              <select id="bd-time-dim" v-model="timeDim" class="ul-input ul-select bd-tool-select">
                <option value="today">今天</option>
                <option value="d7">近 7 天</option>
                <option value="d30">近 30 天</option>
                <option value="month">按月</option>
                <option value="year">按年</option>
              </select>
            </div>
            <div class="bd-tool-item">
              <label for="bd-sponsor">项目方</label>
              <select id="bd-sponsor" v-model="sponsor" class="ul-input ul-select bd-tool-select">
                <option value="">全部项目方</option>
                <option v-for="sp in sponsors" :key="sp" :value="sp">{{ sp }}</option>
              </select>
            </div>
            <div class="bd-tool-actions">
              <button type="button" class="btn btn-default btn-sm" @click="resetF">重置</button>
              <button type="button" class="btn btn-primary btn-sm" @click="noopRefresh">查询</button>
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
                <th>业务类型</th>
                <th class="th-num">题词数量</th>
                <th class="th-num">作品数量</th>
                <th class="th-num">订单数量</th>
                <th class="th-num">收益金额</th>
                <th class="th-num">有效用户数</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(r, i) in tableRows" :key="i">
                <td>{{ r.name }}</td>
                <td>{{ r.biz }}</td>
                <td class="td-num">{{ fmtThousands(r.kw) }}</td>
                <td class="td-num">{{ fmtThousands(r.works) }}</td>
                <td class="td-num">{{ fmtThousands(r.orders) }}</td>
                <td class="td-num">¥{{ fmtMoney(r.rev) }}</td>
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
import { downloadCsv, fmtMoney, fmtMoneyKpiDisplay, fmtMoneyYuanFull, fmtThousands } from './utils/dataUi'

const timeDim = ref('d30')
const sponsor = ref('')
const sponsors = ['番茄系', '字节跳动', '快手磁力', '百度营销', '腾讯广告']

const kpi = computed(() => ({
  projectTotal: 128,
  online: 102,
  offline: 26,
  keywordTotal: 48620,
  keywordApproved: 45210,
  workTotal: 192400,
  workApproved: 178920,
  orderTotal: 842600,
  orderUnsettled: 12400,
  orderSettled: 830200,
  revenueTotal: 286400000,
  revenueUnsettled: 6200000,
  revenueSettled: 280200000,
  effectiveUsers: 284120,
}))

/** 饼图扇区色：固定 hex，保证对比度与悬浮态一致 */
const PIE_HEX = ['#2563eb', '#0d9488', '#7c3aed', '#16a34a', '#ea580c', '#64748b'] as const

const bizDist = [
  { name: '推文达人', n: 38, fill: PIE_HEX[0] },
  { name: '短剧达人', n: 28, fill: PIE_HEX[1] },
  { name: '网盘运营', n: 22, fill: PIE_HEX[2] },
  { name: '漫剧达人', n: 18, fill: PIE_HEX[3] },
  { name: '创意工具', n: 14, fill: PIE_HEX[4] },
  { name: '其他', n: 8, fill: PIE_HEX[5] },
]

const pieCx = 110
const pieCy = 110
const pieRO = 88
const pieRI = 54
const pieInnerR = pieRI - 1

const pieTip = ref<{ name: string; n: number; fill: string } | null>(null)

const pieTotal = computed(() => bizDist.reduce((s, x) => s + x.n, 0))
const pieSlices = computed(() => bizDist.filter((x) => x.n > 0))

function ringSectorPath(cx: number, cy: number, rO: number, rI: number, a0: number, a1: number): string {
  const large = a1 - a0 > Math.PI ? 1 : 0
  const xo0 = cx + rO * Math.cos(a0)
  const yo0 = cy + rO * Math.sin(a0)
  const xo1 = cx + rO * Math.cos(a1)
  const yo1 = cy + rO * Math.sin(a1)
  const xi0 = cx + rI * Math.cos(a1)
  const yi0 = cy + rI * Math.sin(a1)
  const xi1 = cx + rI * Math.cos(a0)
  const yi1 = cy + rI * Math.sin(a0)
  return `M ${xo0} ${yo0} A ${rO} ${rO} 0 ${large} 1 ${xo1} ${yo1} L ${xi0} ${yi0} A ${rI} ${rI} 0 ${large} 0 ${xi1} ${yi1} Z`
}

const pieSlicesSvg = computed(() => {
  const list = pieSlices.value
  const total = pieTotal.value
  let angle = -Math.PI / 2
  return list.map((s) => {
    const sweep = total ? (s.n / total) * Math.PI * 2 : 0
    const a0 = angle
    const a1 = angle + sweep
    angle = a1
    return {
      name: s.name,
      n: s.n,
      fill: s.fill,
      d: ringSectorPath(pieCx, pieCy, pieRO, pieRI, a0, a1),
    }
  })
})

function piePct(n: number): string {
  const t = pieTotal.value
  if (!t) return '0'
  return ((n / t) * 100).toFixed(1)
}

const effByBiz = [
  { name: '推文达人', n: 98200 },
  { name: '短剧达人', n: 76400 },
  { name: '网盘运营', n: 52100 },
  { name: '漫剧达人', n: 31800 },
  { name: '创意工具', n: 18600 },
  { name: '其他', n: 7020 },
]
const effMax = Math.max(...effByBiz.map((x) => x.n), 1)
const effGradPairs = [
  ['var(--dv-chart-1)', 'var(--dv-chart-2)'],
  ['var(--dv-chart-2)', 'var(--dv-chart-3)'],
  ['var(--dv-chart-3)', 'var(--dv-chart-4)'],
  ['var(--dv-chart-4)', 'var(--dv-chart-5)'],
  ['var(--dv-chart-5)', 'var(--dv-chart-1)'],
  ['var(--dv-chart-muted)', 'var(--dv-chart-3)'],
]
const effBars = effByBiz.map((b, i) => ({
  ...b,
  pct: Math.round((b.n / effMax) * 100),
  grad: `linear-gradient(90deg,${effGradPairs[i % effGradPairs.length][0]},${effGradPairs[i % effGradPairs.length][1]})`,
}))

const tableRows = computed(() => {
  const base = [
    { name: '番茄小说推文', biz: '推文达人', kw: 4200, works: 18200, orders: 62000, rev: 18600000, eff: 12400 },
    { name: '红果短剧推广', biz: '短剧达人', kw: 3100, works: 14200, orders: 48200, rev: 14200000, eff: 9800 },
    { name: '百度网盘拉新', biz: '网盘运营', kw: 890, works: 6200, orders: 28400, rev: 8200000, eff: 6200 },
    { name: '快看漫剧', biz: '漫剧达人', kw: 1200, works: 9800, orders: 19200, rev: 5600000, eff: 4100 },
    { name: '剪映模板激励', biz: '创意工具', kw: 620, works: 12400, orders: 8400, rev: 3200000, eff: 2800 },
    { name: '知乎好物联营', biz: '推文达人', kw: 2100, works: 7600, orders: 15200, rev: 4800000, eff: 3600 },
    { name: 'UC 小说推文', biz: '推文达人', kw: 1800, works: 5400, orders: 12100, rev: 3900000, eff: 2900 },
    { name: '综合任务池', biz: '其他', kw: 400, works: 2100, orders: 4200, rev: 980000, eff: 1100 },
  ]
  if (!sponsor.value) return base
  return base.slice(0, 5)
})

function resetF() {
  timeDim.value = 'd30'
  sponsor.value = ''
}
function noopRefresh() {}

function doExport() {
  const headers = ['项目名称', '业务类型', '题词数量', '作品数量', '订单数量', '收益金额', '有效用户数']
  const rows = tableRows.value.map((r) => [
    r.name,
    r.biz,
    String(r.kw),
    String(r.works),
    String(r.orders),
    fmtMoney(r.rev),
    String(r.eff),
  ])
  downloadCsv(`品牌项目数据明细_${timeDim.value}`, headers, rows)
}
</script>

<style scoped>
.bd-wrap { min-height: 100%; width: 100%; min-width: 0; box-sizing: border-box; }
.bd-kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(168px, 1fr));
  gap: 14px;
}
@media (min-width: 1280px) {
  .bd-kpi-grid { grid-template-columns: repeat(6, minmax(0, 1fr)); }
}

.bd-charts { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 14px; margin-top: 16px; width: 100%; }
@media (max-width: 900px) { .bd-charts { grid-template-columns: 1fr; } }
.bd-chart { padding: 18px 20px; min-width: 0; }

.bd-table-head { align-items: flex-start; }
.bd-table-head-info { display: flex; flex-direction: column; gap: 4px; min-width: 0; flex: 1 1 200px; }
.bd-table-head-tools {
  display: flex; flex-wrap: wrap; align-items: flex-end; gap: 10px 12px;
  justify-content: flex-end; flex: 1 1 280px;
}
.bd-tool-item { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.bd-tool-item label { font-size: 11px; font-weight: 500; color: var(--text-muted); }
.bd-tool-select { min-width: 120px; max-width: 200px; font-size: 13px; padding: 6px 10px; }
.bd-tool-actions { display: flex; gap: 8px; padding-bottom: 1px; }
.bd-chart-hd { font-size: 14px; font-weight: 600; margin-bottom: 10px; color: var(--text-primary); }
.bd-chart-tip { font-size: 12px; color: var(--text-muted); margin: 0 0 14px; line-height: 1.5; }

.bd-pie-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  margin-top: 8px;
}
.bd-pie-stage {
  position: relative;
  width: 220px;
  height: 220px;
  flex-shrink: 0;
}
.bd-pie-svg {
  width: 100%;
  height: auto;
  display: block;
  animation: bd-pie-enter 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.bd-pie-slice {
  cursor: pointer;
  transition: opacity 0.2s ease, filter 0.2s ease;
  opacity: 0.96;
}
.bd-pie-slice-g:hover .bd-pie-slice,
.bd-pie-slice--hl {
  opacity: 1;
  filter: brightness(1.06) saturate(1.08);
}
.bd-pie-mid-n {
  font-size: 22px;
  font-weight: 700;
  fill: var(--text-primary);
  font-variant-numeric: tabular-nums;
  pointer-events: none;
}
.bd-pie-mid-l {
  font-size: 12px;
  fill: var(--text-muted);
  pointer-events: none;
}
.bd-pie-tip {
  position: absolute;
  left: 50%;
  bottom: 8px;
  transform: translateX(-50%);
  min-width: 132px;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 12px;
  line-height: 1.45;
  color: #f8fafc;
  background: rgba(15, 23, 42, 0.94);
  border: 1px solid rgba(148, 163, 184, 0.25);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.18);
  pointer-events: none;
  z-index: 2;
}
.bd-pie-tip-t { font-weight: 600; margin-bottom: 4px; }
.bd-pie-tip-r {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 2px;
  color: rgba(226, 232, 240, 0.78);
}
.bd-pie-tip-r strong {
  color: #fff;
  font-variant-numeric: tabular-nums;
}
.bd-leg-li {
  cursor: default;
  border-radius: 6px;
  margin: 0 -6px;
  padding: 4px 6px;
  transition: background 0.15s ease;
}
.bd-leg-li:hover {
  background: color-mix(in srgb, var(--primary) 6%, transparent);
}
.bd-leg {
  list-style: none;
  padding: 0;
  margin: 0;
  align-self: flex-start;
  width: 100%;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
  color: var(--text-secondary);
}
.bd-leg strong { margin-left: auto; color: var(--text-primary); }
.bd-dot { width: 9px; height: 9px; border-radius: 50%; display: inline-block; margin-right: 8px; vertical-align: middle; }

.bd-bars { display: flex; flex-direction: column; gap: 12px; }
.bd-bar-row { cursor: default; }

@keyframes bd-pie-enter {
  from {
    opacity: 0;
    transform: scale(0.94);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@media (prefers-reduced-motion: reduce) {
  .bd-pie-svg {
    animation: none !important;
  }
}
</style>
