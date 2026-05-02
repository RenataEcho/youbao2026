<template>
  <div class="cc-wrap">
    <!-- 面包屑 -->
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">团长体系</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">分销比例配置</span>
    </div>

    <div class="page-content">
      <!-- 页面标题 -->
      <div class="page-header">
        <div>
          <h1 class="page-title">分销比例配置</h1>
          <p class="page-desc">配置各团长等级的分销分佣比例，支持按等级差异化设置收益分成规则。</p>
        </div>
        <div class="page-actions">
          <el-button type="info" size="small" plain @click="ruleModalVisible = true">
            <el-icon><InfoFilled /></el-icon>
            分销比例规则说明
          </el-button>
        </div>
      </div>

      <!-- 筛选区 -->
      <FilterCard v-model="filters" :default-value="defaultFilters" @search="fetchList" @reset="fetchList">
        <el-form-item label="分佣等级">
          <el-select v-model="filters.level" placeholder="全部等级" clearable style="width:120px">
            <el-option v-for="lv in LEVELS" :key="lv" :label="lv" :value="lv" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.enabled" placeholder="全部状态" clearable style="width:120px">
            <el-option label="启用" value="true" />
            <el-option label="禁用" value="false" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作人">
          <el-input v-model="filters.operator" placeholder="操作人姓名" clearable style="width:140px" />
        </el-form-item>
        <el-form-item label="更新时间">
          <el-date-picker v-model="filters.updatedAt" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" style="width:140px" />
        </el-form-item>
      </FilterCard>

      <!-- 数据表 -->
      <div class="glass-card table-card">
        <!-- 表格标题栏 -->
        <div class="table-header">
          <div class="table-title">
            分销比例配置
            <span class="table-count">共 {{ list.length }} 条</span>
          </div>
        </div>

        <div class="cc-table-wrap">
          <table class="cc-table">
            <colgroup>
              <col class="cc-col-lv" />
              <col class="cc-col-user" />
              <col class="cc-col-team" />
              <col class="cc-col-st" />
              <col class="cc-col-opr" />
              <col class="cc-col-c" />
              <col class="cc-col-u" />
              <col class="cc-col-act" />
            </colgroup>
            <thead>
              <tr>
                <th>分佣等级</th>
                <th>用户关系分佣详情</th>
                <th>团队关系分佣详情</th>
                <th>状态</th>
                <th>操作人</th>
                <th>创建时间</th>
                <th>更新时间</th>
                <th class="col-action cc-th-act">操作</th>
              </tr>
            </thead>
            <tbody>
              <!-- 骨架屏 -->
              <template v-if="loading">
                <tr v-for="i in 5" :key="i" class="cc-skeleton-row">
                  <td colspan="8"><div class="cc-skeleton"></div></td>
                </tr>
              </template>
              <!-- 空状态 -->
              <template v-else-if="list.length === 0">
                <tr>
                  <td colspan="8">
                    <div class="cc-empty">
                      <el-icon :size="40" style="opacity:.22"><Setting /></el-icon>
                      <div class="cc-empty-title">暂无配置数据</div>
                      <div class="cc-empty-desc">尝试调整筛选条件</div>
                    </div>
                  </td>
                </tr>
              </template>
              <!-- 数据行 -->
              <template v-else>
                <tr v-for="row in list" :key="row.id" class="cc-row">
                  <!-- 分佣等级 -->
                  <td class="cc-td-left">
                    <span class="lv-tag" :class="`lv-${row.level.toLowerCase()}`">{{ row.level }}</span>
                  </td>
                  <!-- 用户关系分佣详情 -->
                  <td class="cc-td-detail cc-td-left">
                    <div class="cd-list">
                      <div v-for="t in row.targets" :key="t.targetLevel" class="cd-row">
                        <span class="lv-tag lv-sm" :class="`lv-${t.targetLevel.toLowerCase()}`">{{ t.targetLevel }}</span>
                        <div class="cd-items">
                          <span class="ci ci-u"><b>直</b>{{ t.user.direct.toFixed(2) }}%</span>
                          <span v-if="t.user.indirect !== null" class="ci ci-u"><b>间</b>{{ t.user.indirect.toFixed(2) }}%</span>
                          <span v-else class="ci ci-na">无间邀</span>
                          <span v-if="t.user.infinite !== null" class="ci ci-u"><b>∞</b>{{ t.user.infinite.toFixed(2) }}%</span>
                          <span v-else class="ci ci-na">无∞</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <!-- 团队关系分佣详情 -->
                  <td class="cc-td-detail cc-td-left">
                    <div class="cd-list">
                      <div v-for="t in row.targets" :key="t.targetLevel" class="cd-row">
                        <span class="lv-tag lv-sm" :class="`lv-${t.targetLevel.toLowerCase()}`">{{ t.targetLevel }}</span>
                        <template v-if="!t.team">
                          <span class="ci ci-na">V1 不适用</span>
                        </template>
                        <div v-else class="cd-items">
                          <span class="ci ci-t"><b>直</b>{{ t.team.direct.toFixed(2) }}%</span>
                          <span class="ci ci-t"><b>间</b>{{ t.team.indirect.toFixed(2) }}%</span>
                          <span v-if="t.team.infinite !== null" class="ci ci-t"><b>∞</b>{{ t.team.infinite.toFixed(2) }}%</span>
                          <span v-else class="ci ci-na">无∞</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <!-- 状态 -->
                  <td class="cc-td-left">
                    <StatusBadge :label="row.enabled ? '启用' : '禁用'" :variant="row.enabled ? 'success' : 'gray'" />
                  </td>
                  <!-- 操作人 -->
                  <td class="cc-muted cc-td-left">{{ row.operator }}</td>
                  <!-- 创建时间 -->
                  <td class="cc-muted cc-mono cc-td-left">{{ row.createdAt.slice(0, 10) }}</td>
                  <!-- 更新时间 -->
                  <td class="cc-muted cc-mono cc-td-left">{{ row.updatedAt }}</td>
                  <!-- 操作 -->
                  <td class="col-action cc-td-act">
                    <div class="action-btns action-btns--end">
                      <button type="button" class="action-btn edit" title="编辑配置" @click="openEdit(row)">编辑</button>
                      <button type="button" class="action-btn view" title="操作日志" @click="openLog(row)">日志</button>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 操作日志（全量） -->
      <div class="glass-card table-card cc-log-card">
        <div class="table-header">
          <div class="table-title">
            操作日志
            <span class="table-count">共 {{ allLogs.length }} 条</span>
          </div>
        </div>
        <div class="cc-log-table-wrap">
          <el-table
            v-loading="logsLoading"
            :data="allLogs"
            border
            size="small"
            stripe
            empty-text="暂无操作记录"
            class="cc-el-log-table"
          >
            <el-table-column prop="time" label="时间" min-width="110" align="center" show-overflow-tooltip />
            <el-table-column label="分佣等级" min-width="88" align="center">
              <template #default="{ row }">
                <span v-if="row.level" class="lv-tag lv-sm" :class="`lv-${row.level.toLowerCase()}`">{{ row.level }}</span>
                <span v-else class="cc-muted">—</span>
              </template>
            </el-table-column>
            <el-table-column prop="op" label="操作类型" min-width="110" align="center" show-overflow-tooltip />
            <el-table-column prop="detail" label="详情" min-width="140" show-overflow-tooltip />
            <el-table-column prop="operator" label="操作人" min-width="96" align="center" show-overflow-tooltip />
          </el-table>
        </div>
      </div>
    </div>

    <!-- 规则说明弹窗 -->
    <CommissionRuleModal v-model:visible="ruleModalVisible" />

    <!-- 编辑弹窗 -->
    <CommissionEditModal
      v-model:visible="editModalVisible"
      :row="editRow"
      @saved="onSaved"
    />

    <!-- 单条配置操作日志弹窗 -->
    <CommissionLogDialog
      v-model:visible="logDialogVisible"
      :level="logLevel"
      :logs="logDialogLogs"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { InfoFilled, Setting } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { CommissionItem, CommissionLog } from '@/types'
import FilterCard from '@/components/common/FilterCard.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import CommissionRuleModal from './commission/CommissionRuleModal.vue'
import CommissionEditModal from './commission/CommissionEditModal.vue'
import CommissionLogDialog from './commission/CommissionLogDialog.vue'
import { COMMISSION_LEVELS } from './commission/commissionUtils'

const LEVELS = COMMISSION_LEVELS

// ===== 筛选 =====
const defaultFilters = { level: '', enabled: '', operator: '', updatedAt: '' }
const filters = reactive({ ...defaultFilters })

// ===== 列表数据 =====
const loading = ref(false)
const list = ref<CommissionItem[]>([])

async function fetchList() {
  loading.value = true
  try {
    const params = new URLSearchParams()
    if (filters.level) params.set('level', filters.level)
    if (filters.enabled !== '') params.set('enabled', filters.enabled)
    if (filters.operator) params.set('operator', filters.operator)
    if (filters.updatedAt) params.set('updatedAt', filters.updatedAt)

    const res = await fetch(`/api/commission/list?${params}`)
    const json = await res.json()
    if (json.code === 0) {
      list.value = json.data.list
    }
  } catch {
    ElMessage.error('加载失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// ===== 规则弹窗 =====
const ruleModalVisible = ref(false)

// ===== 编辑弹窗 =====
const editModalVisible = ref(false)
const editRow = ref<CommissionItem | null>(null)

function openEdit(row: CommissionItem) {
  editRow.value = row
  editModalVisible.value = true
}

function onSaved(updated: CommissionItem) {
  const idx = list.value.findIndex((r) => r.id === updated.id)
  if (idx !== -1) list.value[idx] = { ...updated }
  fetchAllLogs()
}

// ===== 操作日志 =====
const logsLoading = ref(false)
const allLogs = ref<CommissionLog[]>([])
const logDialogVisible = ref(false)
const logLevel = ref('')
const logDialogLogs = ref<CommissionLog[]>([])

async function fetchAllLogs() {
  logsLoading.value = true
  try {
    const res = await fetch('/api/commission/logs')
    const json = await res.json()
    if (json.code === 0) allLogs.value = json.data as CommissionLog[]
  } catch {
    ElMessage.error('操作日志加载失败')
  } finally {
    logsLoading.value = false
  }
}

function openLog(row: CommissionItem) {
  logLevel.value = row.level
  logDialogLogs.value = allLogs.value
    .filter((l) => l.commissionId === row.id)
    .slice()
    .sort((a, b) => b.time.localeCompare(a.time))
  logDialogVisible.value = true
}

onMounted(() => {
  fetchList()
  fetchAllLogs()
})
</script>

<style>
/* cc- 前缀，非 scoped 保持与全局变量兼容 */
.cc-wrap { min-height: 100%; }

.cc-log-card { margin-top: 16px; }
.cc-log-table-wrap { padding: 0 16px 16px; }
.cc-el-log-table { width: 100% !important; }
.cc-log-table-wrap .el-table__cell {
  padding-left: 10px !important;
  padding-right: 10px !important;
}

/* 表格：8 列；详情列放宽，其余按比例自适应（table-layout: fixed） */
.cc-table-wrap { overflow-x: auto; }
.cc-table {
  width: 100%; border-collapse: collapse;
  table-layout: fixed; font-size: 13px;
}
.cc-table col.cc-col-lv { width: 7%; }
.cc-table col.cc-col-user { width: 27%; }
.cc-table col.cc-col-team { width: 27%; }
.cc-table col.cc-col-st { width: 8%; }
.cc-table col.cc-col-opr { width: 10%; }
.cc-table col.cc-col-c { width: 9%; }
.cc-table col.cc-col-u { width: 9%; }
.cc-table col.cc-col-act { width: 3%; min-width: 76px; }
.cc-table thead th {
  background: var(--surface-hover);
  padding: 10px 10px;
  font-size: 11.5px; font-weight: 600;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border);
  white-space: normal;
  line-height: 1.35;
  text-align: left;
  vertical-align: middle;
}
.cc-table thead th.cc-th-act { text-align: right; }
[data-theme="dark"] .cc-table thead th { background: rgba(39,51,72,.8); }
.cc-row { border-bottom: 1px solid var(--border); transition: var(--transition); }
.cc-row:last-child { border-bottom: none; }
.cc-row:hover td { background: rgba(37,99,235,.04); }
.cc-row:hover { box-shadow: inset 3px 0 0 var(--primary); }
.cc-table td {
  padding: 10px 10px;
  color: var(--text-primary);
  vertical-align: top;
}
.cc-td-left { text-align: left; }
.cc-table tbody td:not(.cc-td-detail) { vertical-align: middle; }
.cc-td-detail { min-width: 0; }
.cc-td-act { text-align: right; vertical-align: middle; }
.cc-muted { font-size: 12px; color: var(--text-muted) !important; white-space: nowrap; }
.cc-mono { font-family: 'SFMono-Regular','Consolas','Monaco',monospace; }

/* 等级 Tag */
.lv-tag {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 2px 9px; border-radius: 4px;
  font-size: 11px; font-weight: 700; white-space: nowrap; width: fit-content;
  border: 1px solid transparent;
}
.lv-tag.lv-sm { padding: 1px 6px; font-size: 10px; }
.lv-v1 { background: linear-gradient(135deg,#fef3c7,#fde68a); color: #92400e; border-color: #fcd34d; }
.lv-v2 { background: linear-gradient(135deg,#d1fae5,#a7f3d0); color: #065f46; border-color: #6ee7b7; }
.lv-v3 { background: linear-gradient(135deg,#dbeafe,#bfdbfe); color: #1e40af; border-color: #93c5fd; }
.lv-v4 { background: linear-gradient(135deg,#ede9fe,#ddd6fe); color: #5b21b6; border-color: #c4b5fd; }
.lv-v5 { background: linear-gradient(135deg,#fce7f3,#fbcfe8); color: #9d174d; border-color: #f9a8d4; }
[data-theme="dark"] .lv-v1 { background: rgba(217,119,6,.18); color: #fcd34d; border-color: rgba(217,119,6,.3); }
[data-theme="dark"] .lv-v2 { background: rgba(22,163,74,.18); color: #86efac; border-color: rgba(22,163,74,.3); }
[data-theme="dark"] .lv-v3 { background: rgba(37,99,235,.18); color: #93c5fd; border-color: rgba(37,99,235,.3); }
[data-theme="dark"] .lv-v4 { background: rgba(124,58,237,.18); color: #c4b5fd; border-color: rgba(124,58,237,.3); }
[data-theme="dark"] .lv-v5 { background: rgba(157,23,77,.18); color: #f9a8d4; border-color: rgba(157,23,77,.3); }

/* 分佣详情列 */
.cd-list { display: flex; flex-direction: column; gap: 6px; }
.cd-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex-wrap: wrap;
}
.cd-items {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  min-width: 0;
  flex: 1;
}
.ci {
  display: inline-flex; align-items: center; gap: 2px;
  padding: 1px 5px; border-radius: 4px;
  font-size: 11px; white-space: nowrap;
}
.ci b { font-weight: 700; margin-right: 1px; }
.ci-u { background: rgba(37,99,235,.08); color: #2563eb; }
.ci-t { background: rgba(8,145,178,.08); color: #0891b2; }
.ci-na { background: var(--surface-hover); color: var(--text-muted); font-style: italic; }
[data-theme="dark"] .ci-u { background: rgba(37,99,235,.15); color: #93c5fd; }
[data-theme="dark"] .ci-t { background: rgba(8,145,178,.15); color: #67e8f9; }

/* 骨架 */
.cc-skeleton-row td { padding: 10px 12px; }
.cc-skeleton {
  height: 20px; border-radius: 4px;
  background: linear-gradient(90deg, var(--border) 25%, var(--surface-hover) 50%, var(--border) 75%);
  background-size: 200% 100%;
  animation: ccSkeleton 1.5s ease-in-out infinite;
}
@keyframes ccSkeleton { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

/* 空状态 */
.cc-empty { padding: 56px 20px; text-align: center; }
.cc-empty-title { font-size: 14px; font-weight: 600; color: var(--text-secondary); margin: 10px 0 4px; }
.cc-empty-desc { font-size: 12px; color: var(--text-muted); }
</style>
