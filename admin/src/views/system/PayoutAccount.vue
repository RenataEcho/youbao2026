<template>
  <div class="ul-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color: var(--text-secondary)">系统</span>
      <span class="bc-sep">/</span>
      <span style="color: var(--text-secondary)">财务管理</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">出金账户</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">出金账户</h1>
          <p class="page-desc">
            云账户出金台账只读对照表；口径见 prd-admin §8.1.4。<strong>说明：</strong>PRD 规定本页仅展示<strong>固定 3 条</strong>台账，故 Mock 不满 20 条；其它列表页 Mock 均为 ≥20 条并默认每页 10 条。
          </p>
        </div>
      </div>

      <div class="glass-card table-card">
        <div class="table-header">
          <div class="table-title">云账户出金配置<span class="table-count">共 3 条</span></div>
          <div class="ul-hint">钱包类型 + 云帐户业务 ID 在三条内唯一</div>
        </div>
        <div class="ul-table-wrap">
          <table class="ul-table ul-table--fixed">
            <colgroup>
              <col style="width: 18%" />
              <col style="width: 16%" />
              <col style="width: 22%" />
              <col style="width: 10%" />
              <col style="width: 22%" />
              <col style="width: 12%" />
            </colgroup>
            <thead>
              <tr>
                <th>钱包类型</th>
                <th>云帐户业务 ID</th>
                <th>云帐户业务名称</th>
                <th>状态</th>
                <th>备注</th>
                <th>创建时间</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in rows" :key="row.bizId" class="ul-row">
                <td>{{ row.walletType }}</td>
                <td class="ul-mono">{{ row.bizId }}</td>
                <td>{{ row.bizName }}</td>
                <td>
                  <span class="badge" :class="row.enabled ? 'badge-success' : 'badge-gray'">{{
                    row.enabled ? '启用' : '禁用'
                  }}</span>
                </td>
                <td class="ul-muted">{{ row.remark || '—' }}</td>
                <td class="ul-muted">{{ row.createdAt }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/** 固定三条，与 PRD §8.1.2 一致，前端 Mock */
const rows = [
  {
    walletType: '项目收益钱包',
    bizId: 'YB-PRJ-OUT-01',
    bizName: '右豹品牌项目佣金出金',
    enabled: true,
    remark: '对照云账户「项目收益」业务线',
    createdAt: '2026-01-10 09:00:00',
  },
  {
    walletType: '团队分红钱包',
    bizId: 'YB-DIV-OUT-01',
    bizName: '右豹团队分红出金',
    enabled: true,
    remark: '',
    createdAt: '2026-01-10 09:00:00',
  },
  {
    walletType: '平台奖励钱包',
    bizId: 'YB-RWD-OUT-01',
    bizName: '右豹平台奖励出金',
    enabled: true,
    remark: '与活动奖励打款侧配置一致',
    createdAt: '2026-01-10 09:05:12',
  },
]
</script>
