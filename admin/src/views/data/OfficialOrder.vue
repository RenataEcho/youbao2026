<template>
  <div class="dq-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">首页</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">数据</span>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">查询工具</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">官方订单源数据</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">官方订单源数据</h1>
          <p class="page-desc">品牌官方接口拉取的原始订单落表；字段可按项目扩展（PRD §6.2.6）</p>
        </div>
      </div>

      <div class="glass-card bl-filter">
        <div class="ul-filter-grid">
          <div class="ul-form-group"><label class="ul-label">视频 ID</label><input v-model="f.vid" class="ul-input"></div>
          <div class="ul-form-group"><label class="ul-label">订单日期起</label><input v-model="f.start" type="date" class="ul-input"></div>
          <div class="ul-form-group"><label class="ul-label">订单日期止</label><input v-model="f.end" type="date" class="ul-input"></div>
        </div>
        <div class="ul-filter-footer"><span /><button type="button" class="btn btn-primary btn-sm" @click="refreshQuery">查询</button></div>
      </div>

      <div class="glass-card table-card">
        <div class="table-header">
          <div class="table-title">原始订单<span class="table-count">共 {{ rows.length }} 条</span></div>
        </div>
        <div class="ul-table-wrap">
          <table class="ul-table ul-table--fixed">
            <colgroup>
              <col v-for="n in 7" :key="n" style="width:14.2857%">
            </colgroup>
            <thead>
              <tr>
                <th>项目名称</th>
                <th>视频 ID</th>
                <th class="th-num">订单量</th>
                <th>订单类型</th>
                <th>订单日期</th>
                <th>订单号</th>
                <th>创建时间</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(r, i) in rows" :key="i">
                <td>{{ r.proj }}</td>
                <td class="ul-mono">{{ r.vid }}</td>
                <td class="td-num">{{ r.qty }}</td>
                <td><span class="tag" :class="r.type === '拉新' ? 'tag-blue' : 'tag-amber'">{{ r.type }}</span></td>
                <td>{{ r.bizDate }}</td>
                <td class="ul-mono">{{ r.oid }}</td>
                <td class="td-muted">{{ r.created }}</td>
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

const f = ref({ vid: '', start: '2026-04-01', end: '2026-04-30' })

const source = ref([
  { proj: '番茄小说推文', vid: 'vid_998821', qty: 12, type: '拉新', bizDate: '2026-04-28', oid: 'OFF-202604281028-a91', created: '2026-04-28 18:02:11' },
  { proj: '番茄小说推文', vid: 'vid_887712', qty: 6, type: '拉失活', bizDate: '2026-04-29', oid: 'OFF-202604291132-b02', created: '2026-04-29 11:35:44' },
  { proj: '红果短剧推广', vid: 'vid_772601', qty: 22, type: '拉新', bizDate: '2026-04-29', oid: 'OFF-202604291645-c77', created: '2026-04-29 16:48:02' },
  { proj: '红果短剧推广', vid: 'vid_661540', qty: 8, type: '拉失活', bizDate: '2026-04-30', oid: 'OFF-202604300902-d31', created: '2026-04-30 09:05:18' },
])

const rows = computed(() => {
  let list = source.value
  const vid = f.value.vid.trim()
  if (vid) list = list.filter((r) => r.vid.includes(vid))
  const s = f.value.start
  const e = f.value.end
  if (s) list = list.filter((r) => r.bizDate >= s)
  if (e) list = list.filter((r) => r.bizDate <= e)
  return list
})

function refreshQuery() {
  /* 筛选由 computed 响应 */
}
</script>

<style scoped>
.dq-wrap { min-height: 100%; }
.td-muted { font-size: 12px; color: var(--text-muted); white-space: nowrap; }
</style>
