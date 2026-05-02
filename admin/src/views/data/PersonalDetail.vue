<template>
  <div class="dq-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">首页</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">数据</span>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">查询工具</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">个人明细查询</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">个人明细查询</h1>
          <p class="page-desc">按用户查询各项目结算收益明细（PRD §6.2.1）。演示：用户 ID 为 123456 或 123456789 时返回示例行。</p>
        </div>
      </div>

      <div class="glass-card bl-filter">
        <div class="ul-filter-grid">
          <div class="ul-form-group">
            <label class="ul-label">用户 ID <span style="color:var(--danger)">*</span></label>
            <input v-model="userId" class="ul-input" placeholder="必填">
          </div>
          <div class="ul-form-group">
            <label class="ul-label">订单结算日期</label>
            <input v-model="start" type="date" class="ul-input">
          </div>
          <div class="ul-form-group">
            <label class="ul-label">至</label>
            <input v-model="end" type="date" class="ul-input">
          </div>
        </div>
        <div class="ul-filter-footer">
          <span />
          <button type="button" class="btn btn-primary btn-sm" @click="runQuery">查询</button>
        </div>
      </div>

      <div class="glass-card table-card">
        <div class="table-header">
          <div class="table-title">结算收益明细<span class="table-count">共 {{ rows.length }} 条</span></div>
          <div class="dq-sum">结算收益合计：<strong>¥{{ fmtMoney(totalRev) }}</strong></div>
        </div>
        <div v-if="!queried" class="dq-empty">请输入用户 ID 后点击查询</div>
        <div v-else-if="rows.length === 0" class="dq-empty">暂无数据</div>
        <div v-else class="ul-table-wrap">
          <table class="ul-table ul-table--fixed">
            <colgroup>
              <col v-for="n in 3" :key="n" style="width:33.3333%">
            </colgroup>
            <thead>
              <tr>
                <th>项目 ID</th>
                <th>项目名称</th>
                <th class="th-num">结算收益（元）</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(r, i) in rows" :key="i">
                <td class="ul-mono">{{ r.pid }}</td>
                <td>{{ r.pname }}</td>
                <td class="td-num">¥{{ fmtMoney(r.rev) }}</td>
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
import { ElMessage } from 'element-plus'
import { fmtMoney } from './utils/dataUi'

const userId = ref('')
const start = ref('2026-04-01')
const end = ref('2026-04-30')
const queried = ref(false)
const rows = ref<{ pid: string; pname: string; rev: number }[]>([])

const totalRev = computed(() => rows.value.reduce((s, r) => s + r.rev, 0))

function runQuery() {
  const id = userId.value.trim()
  if (!id) {
    ElMessage.warning('请填写用户 ID')
    queried.value = false
    rows.value = []
    return
  }
  queried.value = true
  if (id === '123456' || id === '123456789') {
    rows.value = [
      { pid: 'P10021', pname: '番茄小说推文', rev: 12860.55 },
      { pid: 'P10088', pname: '红果短剧推广', rev: 8420.0 },
      { pid: 'OS88201', pname: 'reelshort 剧场', rev: 3260.12 },
    ]
  } else {
    rows.value = []
  }
}
</script>

<style scoped>
.dq-wrap { min-height: 100%; }
.dq-sum { font-size: 13px; color: var(--text-secondary); }
.dq-sum strong { color: var(--primary); font-variant-numeric: tabular-nums; }
.dq-empty { padding: 48px; text-align: center; color: var(--text-muted); font-size: 13px; }
</style>
