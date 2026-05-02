<template>
  <div class="psc-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">首页</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">品牌项目</span>
      <span class="bc-sep">/</span>
      <router-link to="/project/config" class="bc-a">项目配置</router-link>
      <span class="bc-sep">/</span>
      <span class="bc-cur">结算配置</span>
    </div>

    <div class="page-content psc-page">
      <header class="psc-topbar">
        <div class="psc-topbar-inner">
          <div class="psc-topbar-left">
            <button type="button" class="btn btn-default btn-sm" @click="goTableHome">返回项目列表</button>
            <span class="psc-topbar-title">结算配置</span>
          </div>
          <div class="psc-topbar-right">
            <button type="button" class="psc-icon-btn" title="切换主题" aria-label="切换主题" @click="themeStore.toggle()">◐</button>
            <button type="button" class="btn btn-default btn-sm" @click="onCancel">取消</button>
            <button type="button" class="btn btn-primary btn-sm" :disabled="!dirty" @click="save">保存</button>
          </div>
        </div>
      </header>

      <main class="psc-main">
        <p class="psc-project-hint">项目 <strong>{{ projectLabel }}</strong></p>

        <section class="psc-card">
          <div class="psc-card-hd">
            全部结算字段
            <small>多选字段后，下方自动增加对应数据列；取消勾选将移除该列。</small>
          </div>
          <div class="psc-card-bd">
            <div class="psc-field-pool">
              <label v-for="f in ALL_FIELDS" :key="f.key" class="psc-chk-label">
                <input v-model="selectedKeys" type="checkbox" :value="f.key" @change="markDirty">
                <span>{{ f.title }}</span>
                <span class="psc-key-mono">{{ f.key }}</span>
              </label>
            </div>
          </div>
        </section>

        <section class="psc-card">
          <div class="psc-card-hd">数据列配置</div>
          <div class="psc-card-bd">
            <div v-if="rows.length === 0" class="psc-empty-hint">请在上方勾选至少一个结算字段，将在此处生成数据列。</div>
            <div v-else class="psc-table-wrap">
              <table class="psc-data-table">
                <thead>
                  <tr>
                    <th>字典字段</th>
                    <th>字段标题</th>
                    <th>前端标题</th>
                    <th>计量单位</th>
                    <th>设置单价 / 比例</th>
                    <th>前端显示</th>
                    <th>显示在订单数据表</th>
                    <th class="psc-th-action col-action">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in rows" :key="row.dictKey">
                    <td class="psc-td-readonly">{{ row.dictKey }}</td>
                    <td class="psc-td-readonly psc-title-cell">{{ row.fieldTitle }}</td>
                    <td>
                      <input v-model="row.frontTitle" type="text" class="psc-inp" @input="markDirty">
                    </td>
                    <td>
                      <div class="psc-seg" role="group" aria-label="计量单位">
                        <button type="button" class="psc-seg-btn" :class="{ on: row.unit === 'qty' }" @click="setUnit(row, 'qty')">数量</button>
                        <button type="button" class="psc-seg-btn" :class="{ on: row.unit === 'amount' }" @click="setUnit(row, 'amount')">金额</button>
                      </div>
                    </td>
                    <td>
                      <div class="psc-price-label">{{ row.unit === 'qty' ? '单价（元）' : '比例（%）' }}</div>
                      <input
                        v-model="row.unitPriceOrRatio"
                        type="text"
                        class="psc-inp psc-inp-num"
                        inputmode="decimal"
                        :placeholder="row.unit === 'qty' ? '如 12.5' : '如 3'"
                        @input="markDirty"
                      >
                    </td>
                    <td class="psc-td-sw">
                      <label class="psc-sw">
                        <input v-model="row.showOnFront" type="checkbox" @change="markDirty">
                        <span class="psc-sw-track"><span class="psc-sw-thumb" /></span>
                      </label>
                    </td>
                    <td class="psc-td-sw">
                      <label class="psc-sw">
                        <input v-model="row.showInOrderTable" type="checkbox" @change="markDirty">
                        <span class="psc-sw-track"><span class="psc-sw-thumb" /></span>
                      </label>
                    </td>
                    <td class="psc-td-action col-action">
                      <button type="button" class="action-btn delete" @click="removeRow(row.dictKey)">删除</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProjectConfigStore } from '@/stores/projectConfig'
import { useThemeStore } from '@/stores/theme'

const route = useRoute()
const router = useRouter()
const themeStore = useThemeStore()

const projectId = computed(() => Number(route.params.projectId))

const store = useProjectConfigStore()
const { rows: projects } = storeToRefs(store)

const projectLabel = computed(() => {
  const p = projects.value.find((x) => x.id === projectId.value)
  return p ? p.frontTitle : `id=${projectId.value}`
})

const ALL_FIELDS = [
  { key: 'renew_num', title: '拉活量' },
  { key: 'reg_old_num', title: '拉旧量' },
  { key: 'register_member', title: '移动拉新量' },
  { key: 'member_num', title: '会员量' },
  { key: 'activity_unit_price', title: '活动价格' },
  { key: 'reward_money', title: '奖励金' },
  { key: 'week_card_num', title: '周卡订单' },
  { key: 'month_card_num', title: '月卡订单' },
  { key: 'season_card_num', title: '季卡订单' },
  { key: 'year_card_num', title: '年卡订单' },
  { key: 'community_activity_profit', title: '订单分成收益' },
  { key: 'flow_profit', title: '活跃用户收益分成' },
  { key: 'search_num', title: '搜索量' },
  { key: 'recharge_amount', title: '充值分佣' },
  { key: 'mid_long_form_activity_profit', title: '中长篇活动收益' },
] as const

interface Row {
  dictKey: string
  fieldTitle: string
  frontTitle: string
  unit: 'qty' | 'amount'
  unitPriceOrRatio: string
  showOnFront: boolean
  showInOrderTable: boolean
}

const selectedKeys = ref<string[]>([])
const rows = ref<Row[]>([])
const dirty = ref(false)

watch(
  selectedKeys,
  (keys, prevKeys) => {
    const map = new Map(rows.value.map((r) => [r.dictKey, r]))
    const next: Row[] = []
    for (const k of keys) {
      const meta = ALL_FIELDS.find((f) => f.key === k)!
      const prev = map.get(k)
      if (prev) next.push(prev)
      else {
        next.push({
          dictKey: k,
          fieldTitle: meta.title,
          frontTitle: meta.title,
          unit: 'qty',
          unitPriceOrRatio: '',
          showOnFront: true,
          showInOrderTable: true,
        })
      }
    }
    rows.value = next
    if (prevKeys !== undefined) dirty.value = true
  },
  { deep: true },
)

function setUnit(row: Row, unit: 'qty' | 'amount') {
  if (row.unit === unit) return
  row.unit = unit
  row.unitPriceOrRatio = ''
  markDirty()
}

function removeRow(dictKey: string) {
  selectedKeys.value = selectedKeys.value.filter((k) => k !== dictKey)
}

function markDirty() {
  dirty.value = true
}

function onCancel() {
  goTableHome()
}

function goTableHome() {
  router.push({ name: 'ProjectConfig' })
}

function save() {
  dirty.value = false
  // eslint-disable-next-line no-alert
  alert('结算配置已保存（演示，后续对接接口）')
}
</script>

<style scoped>
.psc-wrap { min-height: 100%; }
.bc-a { color: var(--text-secondary); text-decoration: none; }
.bc-a:hover { color: var(--primary); }

.psc-page {
  padding-top: 0 !important;
  gap: 0 !important;
}

.psc-topbar {
  position: sticky;
  top: 0;
  z-index: 40;
  height: 52px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  margin: 0 -4px 16px;
}
.psc-topbar-inner {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 clamp(12px, 3vw, 32px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.psc-topbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.psc-topbar-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}
.psc-topbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
.psc-icon-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}
.psc-icon-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.psc-main {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 clamp(12px, 3vw, 32px) 48px;
}
.psc-project-hint {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 14px;
}

.psc-card {
  background: var(--bg-card);
  border: 1px solid rgba(54, 110, 244, 0.18);
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 6px 18px rgba(15, 23, 42, 0.07);
  margin-bottom: 16px;
  overflow: hidden;
}
.psc-card-hd {
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  background: linear-gradient(180deg, rgba(54,110,244,0.06), transparent);
}
.psc-card-hd small {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  font-weight: 400;
  color: var(--text-muted);
}
.psc-card-bd { padding: 16px 18px; }

.psc-field-pool {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 14px;
}
.psc-chk-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg-hover);
  cursor: pointer;
  font-size: 13px;
  color: var(--text-secondary);
  transition: border-color 0.14s, background 0.14s;
  user-select: none;
}
.psc-chk-label:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: rgba(54,110,244,0.08);
}
.psc-chk-label:has(input:checked) {
  border-color: var(--primary);
  background: rgba(54,110,244,0.08);
  color: var(--text-primary);
  font-weight: 500;
}
.psc-chk-label input {
  width: 14px;
  height: 14px;
  accent-color: var(--primary);
  cursor: pointer;
}
.psc-key-mono {
  font-size: 11px;
  color: var(--text-muted);
  font-family: ui-monospace, monospace;
}

.psc-empty-hint {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-muted);
  font-size: 13px;
}
.psc-table-wrap {
  overflow-x: auto;
  margin: 0 -4px;
  padding: 0 4px;
}
.psc-data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  min-width: 1080px;
}
.psc-data-table th,
.psc-data-table td {
  border: 1px solid var(--border);
  padding: 10px 12px;
  text-align: left;
  vertical-align: middle;
}
.psc-data-table th {
  background: var(--bg-hover);
  color: var(--text-secondary);
  font-weight: 600;
  white-space: nowrap;
}
.psc-td-readonly {
  background: var(--bg-hover);
  color: var(--text-secondary);
  font-family: ui-monospace, 'SF Mono', monospace;
  font-size: 12px;
}
.psc-td-readonly.psc-title-cell {
  font-family: inherit;
  color: var(--text-primary);
}
.psc-inp {
  width: 100%;
  min-width: 120px;
  max-width: 200px;
  height: 30px;
  padding: 0 8px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-family: inherit;
  background: var(--bg-card);
  color: var(--text-primary);
  outline: none;
}
.psc-inp:focus { border-color: var(--primary); }
.psc-inp-num { max-width: 120px; }
.psc-price-label {
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 4px;
}
.psc-seg {
  display: inline-flex;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  overflow: hidden;
}
.psc-seg-btn {
  border: none;
  background: var(--bg-card);
  color: var(--text-secondary);
  padding: 6px 12px;
  font-size: 12px;
  font-family: inherit;
  cursor: pointer;
}
.psc-seg-btn:hover { background: var(--bg-hover); }
.psc-seg-btn.on {
  background: var(--primary);
  color: #fff;
}
.psc-th-action { width: 72px; text-align: center !important; }
.psc-td-sw,
.psc-td-action { text-align: center; white-space: nowrap; }

.psc-sw {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  vertical-align: middle;
}
.psc-sw input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  margin: 0;
}
.psc-sw-track {
  width: 40px;
  height: 22px;
  border-radius: 11px;
  background: var(--border);
  transition: background 0.18s;
  position: relative;
  flex-shrink: 0;
}
.psc-sw-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  z-index: 1;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  /* 与数据表配置开关一致：滑块用实色白圆，避免未定义 --bg-card 时透明成「纯蓝条」 */
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.18);
  transition: transform 0.18s;
}
html[data-theme='dark'] .psc-sw-thumb {
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
}
.psc-sw input:checked + .psc-sw-track { background: var(--primary); }
.psc-sw input:checked + .psc-sw-track .psc-sw-thumb { transform: translateX(18px); }
.psc-sw input:focus-visible + .psc-sw-track {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

</style>
