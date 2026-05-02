<template>
  <div class="bs-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">首页</router-link>
      <span class="bc-sep">/</span>
      <span style="color: var(--text-secondary)">数据</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">大数据屏</span>
    </div>

    <div class="page-content dv-board-stagger">
      <div class="page-header">
        <div>
          <h1 class="page-title">运营数据大屏</h1>
          <p class="page-desc">
            跨域运营摘要 + TOP 排行 + 投屏动效（Mock）；口径见
            <code>prd-operation-bigscreen.md</code>，对接接口后替换数据源。
          </p>
        </div>
      </div>

      <div
        ref="obsBoardRef"
        class="obs-board"
        :class="{ 'obs-board--pulse': pulse }"
      >
        <div class="obs-fx-bg" aria-hidden="true" />

        <div class="obs-head-sticky">
          <div class="obs-ticker" aria-label="运营动态">
            <div class="obs-ticker-inner">
              <span
                v-for="(it, i) in tickerTwice"
                :key="i"
                :class="{ hot: 'hot' in it && it.hot }"
                v-html="it.html"
              />
            </div>
          </div>
          <div class="obs-toolbar">
            <div class="obs-toolbar-title">运营数据大屏</div>
            <div class="obs-toolbar-right">
              <span class="obs-meta">数据更新 · 延迟约 2min（示意）</span>
              <span class="obs-time">{{ clockText }}</span>
              <div class="obs-pills" role="group" aria-label="时间范围">
                <button
                  v-for="r in rangeOptions"
                  :key="r"
                  type="button"
                  class="obs-pill"
                  :class="{ 'is-active': range === r }"
                  @click="range = r"
                >
                  {{ r }}
                </button>
              </div>
              <div class="obs-pills" role="group" aria-label="业务线">
                <button
                  v-for="b in bizOptions"
                  :key="b"
                  type="button"
                  class="obs-pill"
                  :class="{ 'is-active': biz === b }"
                  @click="biz = b"
                >
                  {{ b }}
                </button>
              </div>
              <button type="button" class="obs-btn obs-btn--ghost" @click="onManualRefresh">手动刷新</button>
              <button type="button" class="obs-btn" @click="toggleFullscreen">{{ fsLabel }}</button>
            </div>
          </div>
        </div>

        <div class="obs-main">
          <!-- 左：用户与增长 -->
          <section class="obs-panel">
            <div class="obs-panel-hd">
              <div class="obs-panel-title">用户与增长</div>
              <span class="obs-tag obs-tag--green">自然日</span>
            </div>
            <div class="obs-kpi-grid">
              <div class="obs-kpi">
                <div class="obs-kpi-l">新增用户</div>
                <div class="obs-kpi-v">
                  <ObsCount
                    :end="OBS_USER_KPIS.newUsers"
                    format="intComma"
                    :replay="replayKey"
                    :stagger-index="0"
                  />
                </div>
                <div class="obs-kpi-s">↑ 8.2% 较上一周期</div>
              </div>
              <div class="obs-kpi">
                <div class="obs-kpi-l">活跃用户（示意）</div>
                <div class="obs-kpi-v">
                  <ObsCount
                    :end="OBS_USER_KPIS.activeUsers"
                    format="k1"
                    :replay="replayKey"
                    :stagger-index="1"
                  />
                </div>
                <div class="obs-kpi-s obs-kpi-s--down">↓ 1.1%</div>
              </div>
            </div>
            <div style="margin-top: 12px">
              <div class="obs-chart-cap">新增趋势 · 与用户数据看板同源（示意）</div>
              <div class="obs-spark">
                <svg viewBox="0 0 400 88" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="obsG1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="rgba(56,189,248,0.35)" />
                      <stop offset="100%" stop-color="rgba(56,189,248,0)" />
                    </linearGradient>
                  </defs>
                  <path
                    class="dv-chart-fade"
                    d="M0,60 L50,45 L100,55 L150,30 L200,40 L250,25 L300,35 L350,20 L400,28 L400,88 L0,88 Z"
                    fill="url(#obsG1)"
                  />
                  <path
                    class="dv-chart-line"
                    d="M0,60 L50,45 L100,55 L150,30 L200,40 L250,25 L300,35 L350,20 L400,28"
                    fill="none"
                    stroke="#38bdf8"
                    stroke-width="2"
                  />
                  <path
                    class="dv-chart-line"
                    style="animation-delay: 0.35s"
                    d="M0,70 L60,65 L120,68 L180,62 L240,58 L300,52 L360,48 L400,50"
                    fill="none"
                    stroke="#a78bfa"
                    stroke-width="1.5"
                    opacity="0.85"
                  />
                </svg>
              </div>
            </div>
            <div class="obs-rows">
              <div class="obs-chart-cap" style="margin-top: 4px">渠道 Top（示意）</div>
              <div v-for="ch in OBS_CHANNELS" :key="ch.name" class="obs-row">
                <span class="obs-row-n">{{ ch.name }}</span>
                <div class="obs-bar-bg">
                  <div class="obs-bar-fill" :style="{ width: ch.widthPct + '%' }" />
                </div>
                <span class="obs-row-pct">{{ ch.pct }}%</span>
              </div>
            </div>
            <p style="margin-top: 12px">
              <RouterLink class="obs-link" to="/data/user-data">进入用户数据 →</RouterLink>
            </p>
          </section>

          <!-- 中：业务线 -->
          <section class="obs-panel">
            <div class="obs-panel-hd">
              <div class="obs-panel-title">业务线经营</div>
              <span class="obs-tag">财务日切</span>
            </div>
            <div class="obs-split">
              <div class="obs-sub obs-sub--brand">
                <h4>品牌项目</h4>
                <div class="obs-mini">
                  <div>
                    上线项目
                    <strong><ObsCount :end="OBS_BRAND_KPIS.projects" format="intComma" :replay="replayKey" :stagger-index="2" /></strong>
                  </div>
                  <div>
                    订单量
                    <strong><ObsCount :end="OBS_BRAND_KPIS.orders" format="k1" :replay="replayKey" :stagger-index="3" /></strong>
                  </div>
                  <div>
                    收益（元）
                    <strong><ObsCount :end="OBS_BRAND_KPIS.revenue" format="m2" :replay="replayKey" :stagger-index="4" /></strong>
                  </div>
                  <div>
                    有效用户
                    <strong><ObsCount :end="OBS_BRAND_KPIS.effectiveUsers" format="k1" :replay="replayKey" :stagger-index="5" /></strong>
                  </div>
                </div>
              </div>
              <div class="obs-sub">
                <h4>海外文娱</h4>
                <div class="obs-mini">
                  <div>
                    项目数
                    <strong><ObsCount :end="OBS_OVERSEAS_KPIS.projects" format="intComma" :replay="replayKey" :stagger-index="6" /></strong>
                  </div>
                  <div>
                    订单量
                    <strong><ObsCount :end="OBS_OVERSEAS_KPIS.orders" format="k1" :replay="replayKey" :stagger-index="7" /></strong>
                  </div>
                  <div>
                    分佣（元）
                    <strong><ObsCount :end="OBS_OVERSEAS_KPIS.commission" format="k0" :replay="replayKey" :stagger-index="8" /></strong>
                  </div>
                  <div>
                    有效用户
                    <strong><ObsCount :end="OBS_OVERSEAS_KPIS.effectiveUsers" format="k1" :replay="replayKey" :stagger-index="9" /></strong>
                  </div>
                </div>
              </div>
            </div>
            <div class="obs-chart-cap">订单金额趋势 · 品牌 vs 海外（示意）</div>
            <div class="obs-spark" style="height: 100px">
              <svg viewBox="0 0 400 100" preserveAspectRatio="none">
                <path
                  class="dv-chart-fade"
                  d="M0,75 L57,70 L114,55 L171,62 L228,40 L285,48 L342,35 L400,30 L400,100 L0,100 Z"
                  fill="rgba(56,189,248,0.12)"
                />
                <path
                  class="dv-chart-line"
                  d="M0,75 L57,70 L114,55 L171,62 L228,40 L285,48 L342,35 L400,30"
                  fill="none"
                  stroke="#38bdf8"
                  stroke-width="2.2"
                />
                <path
                  class="dv-chart-line"
                  style="animation-delay: 0.35s"
                  d="M0,85 L57,82 L114,78 L171,80 L228,72 L285,68 L342,65 L400,58"
                  fill="none"
                  stroke="#a78bfa"
                  stroke-width="2"
                />
              </svg>
            </div>
            <div class="obs-donut-wrap">
              <div class="obs-donut" aria-hidden="true" />
              <div class="obs-legend">
                <div><i class="b" />品牌 订单金额 58%</div>
                <div><i class="v" />海外文娱 42%</div>
              </div>
            </div>
            <p style="margin-top: 8px; font-size: 11px">
              <RouterLink class="obs-link" to="/data/brand-data">品牌项目数据</RouterLink>
              ·
              <RouterLink class="obs-link" to="/data/overseas-data">海外文娱数据</RouterLink>
            </p>
          </section>

          <!-- 右：资金 -->
          <section class="obs-panel">
            <div class="obs-panel-hd">
              <div class="obs-panel-title">资金与打款</div>
              <span class="obs-tag">财务日切</span>
            </div>
            <div class="obs-finance-big">
              <div class="lbl">已打款总额（所选周期）</div>
              <div class="num">
                <ObsCount
                  :end="OBS_FINANCE.totalPaid"
                  format="moneyFull"
                  :replay="replayKey"
                  :stagger-index="10"
                />
              </div>
            </div>
            <div class="obs-finance-row">
              <div>
                <span>品牌已打款</span>
                <strong><ObsCount :end="OBS_FINANCE.brandPaid" format="moneyCompact" :replay="replayKey" :stagger-index="11" /></strong>
              </div>
              <div>
                <span>海外文娱打款</span>
                <strong><ObsCount :end="OBS_FINANCE.overseasPaid" format="moneyCompact" :replay="replayKey" :stagger-index="12" /></strong>
              </div>
              <div>
                <span>分红打款</span>
                <strong><ObsCount :end="OBS_FINANCE.dividendPaid" format="moneyCompact" :replay="replayKey" :stagger-index="13" /></strong>
              </div>
              <div>
                <span>奖励打款</span>
                <strong><ObsCount :end="OBS_FINANCE.rewardPaid" format="moneyCompact" :replay="replayKey" :stagger-index="14" /></strong>
              </div>
            </div>
            <div style="margin-top: 12px">
              <div class="obs-chart-cap">打款趋势（示意）</div>
              <div class="obs-spark" style="height: 72px">
                <svg viewBox="0 0 400 72" preserveAspectRatio="none">
                  <path
                    class="dv-chart-fade"
                    d="M0,50 L100,45 L200,55 L300,30 L400,38 L400,72 L0,72 Z"
                    fill="rgba(167,139,250,0.12)"
                  />
                  <path
                    class="dv-chart-line"
                    d="M0,50 L100,45 L200,55 L300,30 L400,38"
                    fill="none"
                    stroke="#a78bfa"
                    stroke-width="2"
                  />
                </svg>
              </div>
            </div>
            <div class="obs-alerts">
              <div class="obs-alert">
                <span>待审核订单（示意）</span>
                <em><ObsCount :end="OBS_FINANCE.pendingReviewOrders" format="intComma" :replay="replayKey" :stagger-index="15" /></em>
              </div>
              <div class="obs-alert obs-alert--danger">
                <span>已审核未打款 · 超 48h（示意）</span>
                <em><ObsCount :end="OBS_FINANCE.pendingPayoutOver48h" format="intComma" :replay="replayKey" :stagger-index="16" /></em>
              </div>
            </div>
            <p style="margin-top: 12px">
              <RouterLink class="obs-link" to="/data/finance-data">进入财务数据 →</RouterLink>
            </p>
          </section>

          <!-- 底：TOP -->
          <div
            id="obsBottom"
            class="obs-bottom"
            @mouseenter="onBottomEnter"
            @mouseleave="onBottomLeave"
          >
            <section class="obs-panel">
              <div class="obs-panel-hd">
                <div class="obs-panel-title">TOP 项目</div>
                <span class="obs-tag">财务日切 · Top 10</span>
              </div>
              <div class="obs-tabs" role="tablist" aria-label="TOP 项目维度">
                <button
                  type="button"
                  role="tab"
                  class="obs-tab"
                  :class="{ 'is-active': projDim === 'qty' }"
                  :aria-selected="projDim === 'qty'"
                  @click="setProjDim('qty')"
                >
                  按订单量
                </button>
                <button
                  type="button"
                  role="tab"
                  class="obs-tab"
                  :class="{ 'is-active': projDim === 'amt' }"
                  :aria-selected="projDim === 'amt'"
                  @click="setProjDim('amt')"
                >
                  按订单金额
                </button>
              </div>
              <div v-show="projDim === 'qty'" :key="'pq' + tabAnimKey" class="obs-table-wrap">
                <table class="obs-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>项目名称</th>
                      <th>业务线</th>
                      <th class="num">订单量</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, idx) in OBS_TOP_PROJECTS_QTY" :key="row.rank">
                      <td>{{ row.rank }}</td>
                      <td>{{ row.name }}</td>
                      <td>{{ row.line }}</td>
                      <td class="num">
                        <ObsCount
                          :end="row.orders"
                          format="intComma"
                          :active="projDim === 'qty'"
                          :replay="replayKey"
                          :stagger-index="17 + idx"
                          :duration="900"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-show="projDim === 'amt'" :key="'pa' + tabAnimKey" class="obs-table-wrap">
                <table class="obs-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>项目名称</th>
                      <th>业务线</th>
                      <th class="num">订单金额</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, idx) in OBS_TOP_PROJECTS_AMT" :key="row.rank">
                      <td>{{ row.rank }}</td>
                      <td>{{ row.name }}</td>
                      <td>{{ row.line }}</td>
                      <td class="num">
                        <ObsCount
                          :end="row.amount"
                          format="moneyCompact"
                          :active="projDim === 'amt'"
                          :replay="replayKey"
                          :stagger-index="17 + idx"
                          :duration="900"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="obs-panel">
              <div class="obs-panel-hd">
                <div class="obs-panel-title">TOP 用户</div>
                <span class="obs-tag">财务日切 · Top 10</span>
              </div>
              <div class="obs-tabs" role="tablist" aria-label="TOP 用户维度">
                <button
                  type="button"
                  role="tab"
                  class="obs-tab"
                  :class="{ 'is-active': userDim === 'qty' }"
                  :aria-selected="userDim === 'qty'"
                  @click="setUserDim('qty')"
                >
                  按订单量
                </button>
                <button
                  type="button"
                  role="tab"
                  class="obs-tab"
                  :class="{ 'is-active': userDim === 'amt' }"
                  :aria-selected="userDim === 'amt'"
                  @click="setUserDim('amt')"
                >
                  按订单金额
                </button>
              </div>
              <div v-show="userDim === 'qty'" :key="'uq' + tabAnimKey" class="obs-table-wrap">
                <table class="obs-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>用户</th>
                      <th class="num">订单量</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, idx) in OBS_TOP_USERS_QTY" :key="row.rank">
                      <td>{{ row.rank }}</td>
                      <td>{{ row.user }}</td>
                      <td class="num">
                        <ObsCount
                          :end="row.orders"
                          format="intComma"
                          :active="userDim === 'qty'"
                          :replay="replayKey"
                          :stagger-index="22 + idx"
                          :duration="900"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-show="userDim === 'amt'" :key="'ua' + tabAnimKey" class="obs-table-wrap">
                <table class="obs-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>用户</th>
                      <th class="num">订单金额</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, idx) in OBS_TOP_USERS_AMT" :key="row.rank">
                      <td>{{ row.rank }}</td>
                      <td>{{ row.user }}</td>
                      <td class="num">
                        <ObsCount
                          :end="row.amount"
                          format="moneyFull"
                          :active="userDim === 'amt'"
                          :replay="replayKey"
                          :stagger-index="22 + idx"
                          :duration="900"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>

        <footer class="obs-footnote">
          <strong>说明：</strong>左列「用户与增长」为<strong>自然日</strong>；中与右列及 TOP 为<strong>财务日切</strong>。TOP Tab
          自动轮播约 8s（用户区首切 4s），悬停底部区域暂停；数字为 count-up（系统「减少动态效果」下直达终值）。样式类名前缀
          <code>obs-</code> 在 <code>theme.css</code> 维护。
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import ObsCount from './components/ObsCount.vue'
import {
  OBS_BRAND_KPIS,
  OBS_CHANNELS,
  OBS_FINANCE,
  OBS_OVERSEAS_KPIS,
  OBS_TICKER_ITEMS,
  OBS_TOP_PROJECTS_AMT,
  OBS_TOP_PROJECTS_QTY,
  OBS_TOP_USERS_AMT,
  OBS_TOP_USERS_QTY,
  OBS_USER_KPIS,
} from './bigScreenMock'

const rangeOptions = ['今天', '昨天', '近 7 天', '近 30 天'] as const
const bizOptions = ['全部', '品牌', '海外文娱'] as const

const range = ref<(typeof rangeOptions)[number]>('近 7 天')
const biz = ref<(typeof bizOptions)[number]>('全部')

const clockText = ref('—')
const obsBoardRef = ref<HTMLElement | null>(null)
const pulse = ref(false)
const replayKey = ref(0)
const tabAnimKey = ref(0)

const projDim = ref<'qty' | 'amt'>('qty')
const userDim = ref<'qty' | 'amt'>('qty')
const pauseDepth = ref(0)

function onBottomEnter() {
  pauseDepth.value++
}
function onBottomLeave() {
  pauseDepth.value = Math.max(0, pauseDepth.value - 1)
}

let projTimer: ReturnType<typeof setTimeout> | null = null
let userTimer: ReturnType<typeof setTimeout> | null = null
let clockTimer: ReturnType<typeof setInterval> | null = null

const tickerTwice = computed(() => [...OBS_TICKER_ITEMS, ...OBS_TICKER_ITEMS])

const fsLabel = ref('全屏预览')

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n)
}

function tickClock() {
  const d = new Date()
  clockText.value = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

function clearCarousel() {
  if (projTimer) clearTimeout(projTimer)
  if (userTimer) clearTimeout(userTimer)
  projTimer = null
  userTimer = null
}

function scheduleProjCarousel() {
  if (reduceMotion) return
  if (projTimer) clearTimeout(projTimer)
  const loop = () => {
    if (pauseDepth.value === 0) {
      projDim.value = projDim.value === 'qty' ? 'amt' : 'qty'
      tabAnimKey.value++
    }
    projTimer = setTimeout(loop, 8000)
  }
  projTimer = setTimeout(loop, 8000)
}

function scheduleUserCarousel() {
  if (reduceMotion) return
  if (userTimer) clearTimeout(userTimer)
  const loop = () => {
    if (pauseDepth.value === 0) {
      userDim.value = userDim.value === 'qty' ? 'amt' : 'qty'
      tabAnimKey.value++
    }
    userTimer = setTimeout(loop, 8000)
  }
  userTimer = setTimeout(loop, 4000)
}

function setProjDim(d: 'qty' | 'amt') {
  projDim.value = d
  tabAnimKey.value++
  scheduleProjCarousel()
}

function setUserDim(d: 'qty' | 'amt') {
  userDim.value = d
  tabAnimKey.value++
  scheduleUserCarousel()
}

function onManualRefresh() {
  pulse.value = false
  requestAnimationFrame(() => {
    pulse.value = true
    replayKey.value++
    setTimeout(() => {
      pulse.value = false
    }, 720)
  })
}

function toggleFullscreen() {
  const el = obsBoardRef.value
  if (!el) return
  if (!document.fullscreenElement) {
    void el.requestFullscreen().then(() => {
      fsLabel.value = '退出全屏'
    })
  } else {
    void document.exitFullscreen()
    fsLabel.value = '全屏预览'
  }
}

function onFsChange() {
  if (!document.fullscreenElement) fsLabel.value = '全屏预览'
}

const reduceMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

onMounted(() => {
  tickClock()
  clockTimer = setInterval(tickClock, 1000)
  document.addEventListener('fullscreenchange', onFsChange)
  if (!reduceMotion) {
    scheduleProjCarousel()
    scheduleUserCarousel()
  }
})

onBeforeUnmount(() => {
  if (clockTimer) clearInterval(clockTimer)
  clearCarousel()
  document.removeEventListener('fullscreenchange', onFsChange)
})
</script>

<style scoped>
.bs-wrap {
  min-height: 100%;
}
</style>
