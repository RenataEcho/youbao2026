<template>
  <div class="dq-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">首页</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">数据</span>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">查询工具</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">查询下级</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">查询下级</h1>
          <p class="page-desc">直接邀请下级列表；默认按直邀人数降序（PRD §6.2.3）</p>
        </div>
      </div>

      <div class="glass-card bl-filter">
        <div class="ul-filter-grid">
          <div class="ul-form-group"><label class="ul-label">邀请人用户 ID</label><input v-model="f.inviter" class="ul-input" placeholder="上级用户 ID"></div>
          <div class="ul-form-group"><label class="ul-label">邀请码</label><input v-model="f.code" class="ul-input" placeholder="与邀请链路匹配"></div>
        </div>
        <div class="ul-filter-footer"><span /><button type="button" class="btn btn-primary btn-sm" @click="search">查询</button></div>
      </div>

      <div class="glass-card table-card">
        <div class="table-header">
          <div class="table-title">下级列表<span class="table-count">共 {{ filtered.length }} 条</span></div>
          <span class="table-meta">排序：直邀人数降序</span>
        </div>
        <div class="ul-table-wrap">
          <table class="ul-table ul-table--fixed">
            <colgroup>
              <col v-for="n in 6" :key="n" style="width:16.6667%">
            </colgroup>
            <thead>
              <tr>
                <th>用户 ID</th>
                <th>用户昵称</th>
                <th>用户手机号</th>
                <th>账号状态</th>
                <th class="th-num">直邀人数</th>
                <th>创建时间</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in sorted" :key="r.uid">
                <td class="ul-mono">{{ r.uid }}</td>
                <td>{{ r.nick }}</td>
                <td>{{ maskPhone(r.phone) }}</td>
                <td><span class="tag" :class="statusTag(r.status)">{{ r.status }}</span></td>
                <td class="td-num">{{ r.subCount }}</td>
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
import { maskPhone } from './utils/dataUi'

const f = ref({ inviter: '', code: '' })

const allRows = ref([
  { uid: '990012', inviterUid: '8800101', nick: '下级A', phone: '13811112222', status: '正常', subCount: 42, created: '2026-03-12 10:22', inviteCode: 'INV88201' },
  { uid: '990013', inviterUid: '8800101', nick: '下级B', phone: '13933334444', status: '正常', subCount: 36, created: '2026-03-18 15:01', inviteCode: 'INV88202' },
  { uid: '990014', inviterUid: '8800102', nick: '下级C', phone: '13655556666', status: '黑名单', subCount: 28, created: '2026-04-02 09:40', inviteCode: 'INV77001' },
  { uid: '990015', inviterUid: '8800102', nick: '下级D', phone: '13777778888', status: '已禁用', subCount: 12, created: '2026-04-15 11:18', inviteCode: 'INV77002' },
])

const filtered = computed(() => {
  let list = allRows.value
  const inv = f.value.inviter.trim()
  const code = f.value.code.trim()
  if (inv) list = list.filter((r) => r.inviterUid.includes(inv))
  if (code) list = list.filter((r) => r.inviteCode.toLowerCase().includes(code.toLowerCase()))
  return list
})

const sorted = computed(() => [...filtered.value].sort((a, b) => b.subCount - a.subCount))

function statusTag(s: string) {
  if (s === '正常') return 'tag-green'
  if (s === '黑名单') return 'tag-gray'
  return 'tag-amber'
}

function search() {
  /* 筛选由 computed 响应；此处保留按钮语义便于接接口 */
}
</script>

<style scoped>
.dq-wrap { min-height: 100%; }
.td-muted { font-size: 12px; color: var(--text-muted); white-space: nowrap; }
</style>
