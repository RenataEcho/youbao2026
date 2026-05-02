<template>
  <div class="dq-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">首页</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">数据</span>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">查询工具</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">邀请榜单</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">邀请榜单</h1>
          <p class="page-desc">直接邀请人数榜单；有效人数定义：下级项目收益合计 &gt; 10 元（PRD §6.2.2）</p>
        </div>
      </div>

      <div class="glass-card bl-filter">
        <div class="ul-filter-grid">
          <div class="ul-form-group"><label class="ul-label">用户 ID</label><input v-model="f.userId" class="ul-input" placeholder="筛选或定位"></div>
          <div class="ul-form-group"><label class="ul-label">创建时间起</label><input v-model="f.start" type="date" class="ul-input"></div>
          <div class="ul-form-group"><label class="ul-label">创建时间止</label><input v-model="f.end" type="date" class="ul-input"></div>
        </div>
        <div class="ul-filter-footer"><span /><button type="button" class="btn btn-primary btn-sm" @click="runSearch">查询</button></div>
      </div>

      <div class="glass-card table-card">
        <div class="table-header">
          <div class="table-title">榜单<span class="table-count">共 {{ total }} 条</span></div>
        </div>
        <div class="ul-table-wrap">
          <table class="ul-table ul-table--fixed">
            <colgroup>
              <col v-for="n in 5" :key="n" style="width:20%">
            </colgroup>
            <thead>
              <tr>
                <th>用户 ID</th>
                <th>用户昵称</th>
                <th>用户手机号</th>
                <th class="th-num">直邀人数</th>
                <th class="th-num">间邀人数</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in pageRows" :key="r.uid">
                <td class="ul-mono">{{ r.uid }}</td>
                <td>{{ r.nick }}</td>
                <td>{{ maskPhone(r.phone) }}</td>
                <td class="td-num">
                  <span class="dq-main">{{ r.direct }}</span>
                  <span class="dq-sub">有效 {{ r.directEff }}</span>
                </td>
                <td class="td-num">{{ r.indirect }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="ul-pagination">
          <span class="ul-page-info">第 <strong>{{ page }}</strong>/<strong>{{ totalPages }}</strong> 页</span>
          <div style="display:flex;gap:4px">
            <button class="ul-pg-btn" :disabled="page<=1" @click="fetchList(page-1)">‹</button>
            <button class="ul-pg-btn" :disabled="page>=totalPages" @click="fetchList(page+1)">›</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { maskPhone } from './utils/dataUi'

const f = ref({ userId: '', start: '2026-04-01', end: '2026-04-30' })
const page = ref(1)
const pageSize = 10
const all = ref([
  { uid: '8829101', nick: '达人小马', phone: '13812345678', direct: 286, directEff: 142, indirect: 920, created: '2026-04-12' },
  { uid: '8829102', nick: '剪辑阿伟', phone: '13987654321', direct: 242, directEff: 118, indirect: 804, created: '2026-04-18' },
  { uid: '8829103', nick: '运营Lisa', phone: '13600001111', direct: 198, directEff: 96, indirect: 612, created: '2026-04-22' },
  { uid: '8829104', nick: '短剧老王', phone: '13522223333', direct: 164, directEff: 82, indirect: 510, created: '2026-04-26' },
  { uid: '8829105', nick: '小说小张', phone: '13733334444', direct: 128, directEff: 60, indirect: 402, created: '2026-04-28' },
])

const filtered = computed(() => {
  let list = all.value
  if (f.value.userId.trim()) list = list.filter((x) => x.uid.includes(f.value.userId.trim()))
  const s = f.value.start
  const e = f.value.end
  if (s) list = list.filter((x) => x.created >= s)
  if (e) list = list.filter((x) => x.created <= e)
  return list
})

const total = computed(() => filtered.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize)))

watch(
  () => [f.value.userId, f.value.start, f.value.end],
  () => {
    page.value = 1
  },
)

watch(totalPages, (tp) => {
  if (page.value > tp) page.value = tp
})

const pageRows = computed(() => {
  const start = (page.value - 1) * pageSize
  return filtered.value.slice(start, start + pageSize)
})

function fetchList(p: number) {
  page.value = Math.min(Math.max(1, p), totalPages.value)
}

function runSearch() {
  fetchList(1)
}
</script>

<style scoped>
.dq-wrap { min-height: 100%; }
.dq-main { font-weight: 700; font-variant-numeric: tabular-nums; }
.dq-sub { display: block; font-size: 11px; color: var(--text-muted); margin-top: 2px; font-weight: 400; }
</style>
