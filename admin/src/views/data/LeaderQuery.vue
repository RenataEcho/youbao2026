<template>
  <div class="dq-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">首页</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">数据</span>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">查询工具</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">团长数据查询</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">团长数据查询</h1>
          <p class="page-desc">仅统计 LV2 / LV3 团长；默认按团队成员数（直推+间推）降序（PRD §6.2.4）</p>
        </div>
      </div>

      <div class="glass-card bl-filter">
        <div class="ul-filter-grid">
          <div class="ul-form-group"><label class="ul-label">团长 ID</label><input v-model="f.id" class="ul-input"></div>
          <div class="ul-form-group"><label class="ul-label">团长手机号</label><input v-model="f.phone" class="ul-input" placeholder="模糊匹配"></div>
        </div>
        <div class="ul-filter-footer"><span /><button type="button" class="btn btn-primary btn-sm" @click="applySearch">查询</button></div>
      </div>

      <div class="glass-card table-card">
        <div class="table-header">
          <div class="table-title">团长列表<span class="table-count">共 {{ sorted.length }} 条</span></div>
        </div>
        <div class="ul-table-wrap">
          <table class="ul-table ul-table--fixed ul-table--auto-row-h">
            <colgroup>
              <col style="width:9%" />
              <col style="width:11%" />
              <col style="width:8%" />
              <col style="width:9%" />
              <col style="width:9%" />
              <col style="width:22%" />
              <col style="width:22%" />
              <col style="width:10%" />
            </colgroup>
            <thead>
              <tr>
                <th>团长 ID</th>
                <th>团长昵称</th>
                <th>当前等级</th>
                <th class="th-num th-sortable" @click="toggleSort('direct')">直推团员 {{ sortMark('direct') }}</th>
                <th class="th-num th-sortable" @click="toggleSort('indirect')">间推团员 {{ sortMark('indirect') }}</th>
                <th class="th-num th-sortable" @click="toggleSort('rev')">团队总收益 {{ sortMark('rev') }}</th>
                <th class="th-num th-sortable" @click="toggleSort('rw')">团队奖励 {{ sortMark('rw') }}</th>
                <th>更新时间</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in sorted" :key="r.id">
                <td class="ul-mono">{{ r.id }}</td>
                <td>{{ r.nick }}</td>
                <td><span class="tag tag-purple">{{ r.level }}</span></td>
                <td class="td-num">{{ r.direct }}</td>
                <td class="td-num">{{ r.indirect }}</td>
                <td class="td-num td-stack">
                  <div class="dq-cell-main">¥{{ fmtMoney(r.revTotal) }}</div>
                  <div class="dq-cell-sub">邀请 ¥{{ fmtMoney(r.revInv) }} · 团队 ¥{{ fmtMoney(r.revTeam) }}</div>
                </td>
                <td class="td-num td-stack">
                  <div class="dq-cell-main">¥{{ fmtMoney(r.rwTotal) }}</div>
                  <div class="dq-cell-sub">邀请 ¥{{ fmtMoney(r.rwInv) }} · 团队 ¥{{ fmtMoney(r.rwTeam) }}</div>
                </td>
                <td class="td-muted">{{ r.updated }}</td>
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
import { fmtMoney } from './utils/dataUi'

const f = ref({ id: '', phone: '' })

type Row = {
  id: string
  nick: string
  phone: string
  level: 'LV2' | 'LV3'
  direct: number
  indirect: number
  revTotal: number
  revInv: number
  revTeam: number
  rwTotal: number
  rwInv: number
  rwTeam: number
  updated: string
}

const raw = ref<Row[]>([
  { id: 'L20001', nick: '团长老赵', phone: '13812340001', level: 'LV3', direct: 420, indirect: 1800, revTotal: 286000, revInv: 102000, revTeam: 184000, rwTotal: 18600, rwInv: 6200, rwTeam: 12400, updated: '2026-04-30 08:12' },
  { id: 'L20002', nick: '团长阿紫', phone: '13912340002', level: 'LV3', direct: 380, indirect: 1520, revTotal: 242000, revInv: 88000, revTeam: 154000, rwTotal: 16200, rwInv: 5200, rwTeam: 11000, updated: '2026-04-30 07:55' },
  { id: 'L20003', nick: '团长凯哥', phone: '13612340003', level: 'LV2', direct: 210, indirect: 640, revTotal: 128000, revInv: 48000, revTeam: 80000, rwTotal: 9800, rwInv: 3600, rwTeam: 6200, updated: '2026-04-29 22:10' },
  { id: 'L20004', nick: '团长笑笑', phone: '13712340004', level: 'LV2', direct: 186, indirect: 520, revTotal: 112000, revInv: 42000, revTeam: 70000, rwTotal: 8200, rwInv: 3000, rwTeam: 5200, updated: '2026-04-29 19:40' },
])

const sortKey = ref<'team' | 'direct' | 'indirect' | 'rev' | 'rw'>('team')
const sortDir = ref<'asc' | 'desc'>('desc')

function teamSize(r: Row) {
  return r.direct + r.indirect
}

function valFor(r: Row, k: typeof sortKey.value): number {
  if (k === 'team') return teamSize(r)
  if (k === 'direct') return r.direct
  if (k === 'indirect') return r.indirect
  if (k === 'rev') return r.revTotal
  return r.rwTotal
}

function toggleSort(k: typeof sortKey.value) {
  if (sortKey.value === k) sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  else {
    sortKey.value = k
    sortDir.value = 'desc'
  }
}

function sortMark(k: typeof sortKey.value) {
  if (sortKey.value !== k) return ''
  return sortDir.value === 'desc' ? '↓' : '↑'
}

const filtered = computed(() => {
  let list = raw.value
  const id = f.value.id.trim()
  const ph = f.value.phone.trim()
  if (id) list = list.filter((r) => r.id.toLowerCase().includes(id.toLowerCase()))
  if (ph) list = list.filter((r) => r.phone.includes(ph))
  return list
})

const sorted = computed(() => {
  const list = [...filtered.value]
  const k = sortKey.value
  list.sort((a, b) => {
    const va = valFor(a, k)
    const vb = valFor(b, k)
    return sortDir.value === 'desc' ? vb - va : va - vb
  })
  return list
})

function applySearch() {
  /* computed 已联动筛选 */
}
</script>

<style scoped>
.dq-wrap { min-height: 100%; }
.td-stack { vertical-align: middle; }
.dq-cell-main { font-weight: 600; font-variant-numeric: tabular-nums; }
.dq-cell-sub { font-size: 11px; color: var(--text-muted); margin-top: 4px; line-height: 1.35; }
.td-muted { font-size: 12px; color: var(--text-muted); white-space: nowrap; }
</style>
