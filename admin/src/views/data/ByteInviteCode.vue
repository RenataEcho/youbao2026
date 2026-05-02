<template>
  <div class="dq-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">首页</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">数据</span>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">查询工具</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">字节邀请码</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">字节邀请码</h1>
          <p class="page-desc">字节邀请码与字节 UID 对照关系查询（PRD §6.2.5）</p>
        </div>
      </div>

      <div class="glass-card bl-filter">
        <div class="ul-filter-grid">
          <div class="ul-form-group"><label class="ul-label">用户 ID</label><input v-model="f.uid" class="ul-input"></div>
          <div class="ul-form-group"><label class="ul-label">邀请码</label><input v-model="f.code" class="ul-input" placeholder="用户侧邀请码"></div>
          <div class="ul-form-group"><label class="ul-label">字节 UID</label><input v-model="f.byteUid" class="ul-input"></div>
        </div>
        <div class="ul-filter-footer"><span /><button type="button" class="btn btn-primary btn-sm" @click="apply">查询</button></div>
      </div>

      <div class="glass-card table-card">
        <div class="table-header">
          <div class="table-title">对照表<span class="table-count">共 {{ filtered.length }} 条</span></div>
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
                <th>字节邀请码</th>
                <th>字节 UID</th>
                <th>字节手机号</th>
                <th>创建时间</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in filtered" :key="r.uid">
                <td class="ul-mono">{{ r.uid }}</td>
                <td>{{ r.nick }}</td>
                <td class="ul-mono">{{ r.byteCode }}</td>
                <td class="ul-mono">{{ r.byteUid }}</td>
                <td>{{ maskPhone(r.bytePhone) }}</td>
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

const f = ref({ uid: '', code: '', byteUid: '' })

const rows = ref([
  { uid: '6600234', nick: '创作者小林', byteCode: 'BY889921', byteUid: '112998776655', bytePhone: '13112349876', created: '2026-04-12 14:20' },
  { uid: '6600235', nick: '剪辑橙子', byteCode: 'BY889922', byteUid: '112998776656', bytePhone: '13298765432', created: '2026-04-18 09:05' },
  { uid: '6600236', nick: '短视频多多', byteCode: 'BY889933', byteUid: '112998776699', bytePhone: '13356781234', created: '2026-04-26 16:48' },
])

const filtered = computed(() =>
  rows.value.filter((r) => {
    if (f.value.uid && !r.uid.includes(f.value.uid.trim())) return false
    if (f.value.code && !r.byteCode.includes(f.value.code.trim())) return false
    if (f.value.byteUid && !r.byteUid.includes(f.value.byteUid.trim())) return false
    return true
  }),
)

function apply() {}
</script>

<style scoped>
.dq-wrap { min-height: 100%; }
.td-muted { font-size: 12px; color: var(--text-muted); white-space: nowrap; }
</style>
