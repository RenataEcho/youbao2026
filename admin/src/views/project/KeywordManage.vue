<template>
  <div class="kw-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">品牌项目</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">关键词管理</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">关键词管理</h1>
          <p class="page-desc">管理品牌项目下的推广关键词库</p>
        </div>
      </div>

      <!-- 子 Tab：正常词库 / 回收站 -->
      <div class="kw-tabs">
        <button
          class="kw-tab"
          :class="{ active: activeTab === 'normal' }"
          @click="switchTab('normal')"
        >
          正常词库
          <span class="kw-tab-count">{{ normalTotal }}</span>
        </button>
        <button
          class="kw-tab"
          :class="{ active: activeTab === 'recycle' }"
          @click="switchTab('recycle')"
        >
          回收站
          <span class="kw-tab-count">{{ recycleTotal }}</span>
        </button>
      </div>

      <!-- 筛选 -->
      <div class="glass-card kw-filter">
        <div class="ul-filter-grid">
          <div class="ul-form-group">
            <label class="ul-label">所属项目</label>
            <input v-model="filters.projectName" type="text" class="ul-input" placeholder="输入项目名称">
          </div>
          <div class="ul-form-group">
            <label class="ul-label">关键词</label>
            <input v-model="filters.keyword" type="text" class="ul-input" placeholder="输入关键词">
          </div>
          <div class="ul-form-group">
            <label class="ul-label">用户ID</label>
            <input v-model="filters.userId" type="text" class="ul-input" placeholder="输入用户ID">
          </div>
          <!-- 正常词库：审核状态筛选 -->
          <div v-if="activeTab === 'normal'" class="ul-form-group">
            <label class="ul-label">审核状态</label>
            <select v-model="filters.auditStatus" class="ul-input ul-select">
              <option value="">全部</option>
              <option value="auditing">审核中</option>
              <option value="approved">已通过待回填</option>
              <option value="filled">已回填发布中</option>
              <option value="invalid">失效可传</option>
            </select>
          </div>
          <!-- 回收站：回收原因筛选 -->
          <div v-if="activeTab === 'recycle'" class="ul-form-group">
            <label class="ul-label">回收原因</label>
            <select v-model="filters.recycleReason" class="ul-input ul-select">
              <option value="">全部</option>
              <option value="invalid_cant_send">关键词失效不可传</option>
              <option value="user_deleted">用户删除</option>
              <option value="offline">关键词已下线</option>
              <option value="expired">关键词过期</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">导出状态</label>
            <select v-model="filters.exportStatus" class="ul-input ul-select">
              <option value="">全部</option>
              <option value="not_exported">未导出</option>
              <option value="exported">已导出</option>
              <option value="imported">已导入</option>
            </select>
          </div>
        </div>
        <div class="ul-filter-footer">
          <span></span>
          <div style="display:flex;gap:8px">
            <button class="btn btn-default btn-sm" @click="resetFilter">重置</button>
            <button class="btn btn-primary btn-sm" @click="fetchList(1)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              查询
            </button>
          </div>
        </div>
      </div>

      <!-- 表格 -->
      <div class="glass-card table-card">
        <div class="table-header">
          <div class="table-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            {{ activeTab === 'normal' ? '正常词库' : '回收站' }}
            <span class="table-count">共 {{ total }} 条</span>
          </div>

          <!-- 批量操作栏 -->
          <div v-if="selectedIds.size > 0" class="bulk-bar show">
            <span class="bulk-count">已选 <span>{{ selectedIds.size }}</span> 条</span>
            <button class="btn btn-danger btn-sm" @click="confirmBulkDelete">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
              批量删除
            </button>
            <button class="btn btn-default btn-sm" @click="selectedIds.clear()">取消选择</button>
          </div>

          <!-- 正常词库操作栏 -->
          <div v-else-if="activeTab === 'normal'" class="table-header-right">
            <button class="btn btn-default btn-sm" @click="openImport('source')">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              源数据导入
            </button>
            <button class="btn btn-default btn-sm" @click="openImport('invalid')">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
              导入失效词
            </button>
            <button class="btn btn-default btn-sm" @click="openImport('offline')">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/></svg>
              导入下线词
            </button>
          </div>
        </div>

        <!-- ===== 正常词库表格 ===== -->
        <div v-if="activeTab === 'normal'" class="ul-table-wrap">
          <table class="ul-table" style="min-width:1200px">
            <thead>
              <tr>
                <th style="width:40px">
                  <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll" style="accent-color:var(--primary)">
                </th>
                <th style="width:56px">序号</th>
                <th style="min-width:140px">所属项目</th>
                <th style="width:90px">用户ID</th>
                <th style="min-width:100px">关键词</th>
                <th style="width:80px">自定义1</th>
                <th style="width:80px">自定义2</th>
                <th style="width:80px">自定义3</th>
                <th style="width:90px">导出状态</th>
                <th style="min-width:130px">导出时间</th>
                <th style="min-width:120px">审核状态</th>
                <th style="min-width:130px">审核时间</th>
                <th style="min-width:130px">创建时间</th>
                <th style="width:88px;text-align:center" class="col-action">操作</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="loading">
                <tr v-for="i in 8" :key="i"><td colspan="14"><div class="ul-skeleton"></div></td></tr>
              </template>
              <template v-else-if="list.length === 0">
                <tr><td colspan="14">
                  <div class="ul-empty">
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="0.9"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <div style="font-size:14px;font-weight:600;color:var(--text-secondary);margin:8px 0 4px">暂无关键词数据</div>
                  </div>
                </td></tr>
              </template>
              <template v-else>
                <tr v-for="(row, idx) in list" :key="row.id" class="ul-row" :class="{selected: selectedIds.has(row.id)}">
                  <td><input type="checkbox" :checked="selectedIds.has(row.id)" @change="toggleSelect(row.id)" style="accent-color:var(--primary)"></td>
                  <td><span class="ul-mono">{{ (page-1)*pageSize + idx + 1 }}</span></td>
                  <td><span class="td-overflow" style="max-width:130px;display:block;font-weight:500">{{ row.projectName }}</span></td>
                  <td><span class="ul-mono">{{ row.userId }}</span></td>
                  <td><span class="tag tag-blue" style="font-size:10.5px;max-width:90px;overflow:hidden;text-overflow:ellipsis">{{ row.keyword }}</span></td>
                  <td><span class="ul-muted">{{ row.custom1 || '—' }}</span></td>
                  <td><span class="ul-muted">{{ row.custom2 || '—' }}</span></td>
                  <td><span class="ul-muted">{{ row.custom3 || '—' }}</span></td>
                  <td><span class="badge" :class="EXPORT_STATUS_CLASS[row.exportStatus]">{{ EXPORT_STATUS_LABEL[row.exportStatus] }}</span></td>
                  <td><span class="ul-muted">{{ row.exportTime || '—' }}</span></td>
                  <td><span class="badge" :class="AUDIT_STATUS_CLASS[row.auditStatus]">{{ AUDIT_STATUS_LABEL[row.auditStatus] }}</span></td>
                  <td><span class="ul-muted">{{ row.auditTime || '—' }}</span></td>
                  <td><span class="ul-muted">{{ row.createTime }}</span></td>
                  <td class="col-action">
                    <div class="action-btns">
                      <button type="button" class="action-btn delete" title="删除" @click="confirmDelete(row)">删除</button>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <!-- ===== 回收站表格 ===== -->
        <div v-else class="ul-table-wrap">
          <table class="ul-table" style="min-width:1100px">
            <thead>
              <tr>
                <th style="width:40px">
                  <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll" style="accent-color:var(--primary)">
                </th>
                <th style="width:56px">序号</th>
                <th style="min-width:140px">所属项目</th>
                <th style="width:90px">用户ID</th>
                <th style="min-width:100px">关键词</th>
                <th style="width:80px">自定义1</th>
                <th style="width:80px">自定义2</th>
                <th style="width:80px">自定义3</th>
                <th style="width:90px">导出状态</th>
                <th style="min-width:130px">导出时间</th>
                <th style="min-width:140px">回收原因</th>
                <th style="min-width:130px">审核时间</th>
                <th style="min-width:130px">创建时间</th>
                <th style="width:88px;text-align:center" class="col-action">操作</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="loading">
                <tr v-for="i in 8" :key="i"><td colspan="14"><div class="ul-skeleton"></div></td></tr>
              </template>
              <template v-else-if="list.length === 0">
                <tr><td colspan="14">
                  <div class="ul-empty">
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="0.9"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                    <div style="font-size:14px;font-weight:600;color:var(--text-secondary);margin:8px 0 4px">回收站暂无数据</div>
                  </div>
                </td></tr>
              </template>
              <template v-else>
                <tr v-for="(row, idx) in list" :key="row.id" class="ul-row" :class="{selected: selectedIds.has(row.id)}">
                  <td><input type="checkbox" :checked="selectedIds.has(row.id)" @change="toggleSelect(row.id)" style="accent-color:var(--primary)"></td>
                  <td><span class="ul-mono">{{ (page-1)*pageSize + idx + 1 }}</span></td>
                  <td><span class="td-overflow" style="max-width:130px;display:block;font-weight:500">{{ row.projectName }}</span></td>
                  <td><span class="ul-mono">{{ row.userId }}</span></td>
                  <td><span class="tag tag-amber" style="font-size:10.5px;max-width:90px;overflow:hidden;text-overflow:ellipsis">{{ row.keyword }}</span></td>
                  <td><span class="ul-muted">{{ row.custom1 || '—' }}</span></td>
                  <td><span class="ul-muted">{{ row.custom2 || '—' }}</span></td>
                  <td><span class="ul-muted">{{ row.custom3 || '—' }}</span></td>
                  <td><span class="badge" :class="EXPORT_STATUS_CLASS[row.exportStatus]">{{ EXPORT_STATUS_LABEL[row.exportStatus] }}</span></td>
                  <td><span class="ul-muted">{{ row.exportTime || '—' }}</span></td>
                  <td><span class="tag" :class="RECYCLE_REASON_CLASS[row.recycleReason || '']">{{ RECYCLE_REASON_LABEL[row.recycleReason || ''] }}</span></td>
                  <td><span class="ul-muted">{{ row.auditTime || '—' }}</span></td>
                  <td><span class="ul-muted">{{ row.createTime }}</span></td>
                  <td class="col-action">
                    <div class="action-btns">
                      <button type="button" class="action-btn delete" title="删除" @click="confirmDelete(row)">删除</button>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <div class="ul-pagination">
          <span class="ul-page-info">共 <strong>{{ total }}</strong> 条，第 <strong>{{ page }}</strong>/<strong>{{ totalPages }}</strong> 页</span>
          <div style="display:flex;align-items:center;gap:4px">
            <button class="ul-pg-btn" :disabled="page<=1" @click="fetchList(1)">«</button>
            <button class="ul-pg-btn" :disabled="page<=1" @click="fetchList(page-1)">‹</button>
            <button v-for="p in paginationPages" :key="p" class="ul-pg-btn" :class="{active:p===page}" @click="fetchList(Number(p))">{{ p }}</button>
            <button class="ul-pg-btn" :disabled="page>=totalPages" @click="fetchList(page+1)">›</button>
            <button class="ul-pg-btn" :disabled="page>=totalPages" @click="fetchList(totalPages)">»</button>
          </div>
          <div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-muted)">
            每页
            <select class="ul-pg-size" @change="(e)=>{pageSize=Number((e.target as HTMLSelectElement).value);fetchList(1)}">
              <option value="10">10</option><option value="20" selected>20</option><option value="50">50</option>
            </select>
            条
          </div>
        </div>
      </div>
    </div>

    <!-- 导入弹窗（仅正常词库使用） -->
    <div class="ul-overlay" :class="{show:importVisible}" @click="importVisible=false"></div>
    <div class="ul-modal kw-import-modal" :class="{show:importVisible}">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--border)">
        <div style="font-size:15px;font-weight:700;color:var(--text-primary);display:flex;align-items:center;gap:7px">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          {{ IMPORT_TITLES[importType] }}
        </div>
        <button class="ul-icon-btn" @click="importVisible=false">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div style="padding:20px">
        <div class="kw-import-area">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          <p style="margin:10px 0 4px;font-size:13px;color:var(--text-secondary);font-weight:500">点击或拖拽上传 Excel 文件</p>
          <p style="font-size:12px;color:var(--text-muted)">.xlsx / .xls，单次最多 5000 条</p>
          <button class="btn btn-default btn-sm" style="margin-top:12px">选择文件</button>
        </div>
        <div class="kw-import-tip">
          <strong>导入字段：</strong>
          <span v-if="importType === 'source'">所属项目ID、用户ID、关键词、自定义字段1~3（选填）</span>
          <span v-else-if="importType === 'invalid'">关键词（批量标记为「失效可传」状态）</span>
          <span v-else>关键词（批量标记为「已回填发布中→下线」，移入回收站）</span>
        </div>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:10px;padding:14px 20px;border-top:1px solid var(--border)">
        <button class="btn btn-default" @click="importVisible=false">取消</button>
        <button class="btn btn-primary" @click="doImport">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          确认导入
        </button>
      </div>
    </div>

    <!-- 删除确认弹窗 -->
    <div class="ul-overlay" :class="{show:deleteVisible}" @click="deleteVisible=false"></div>
    <div class="ul-modal" :class="{show:deleteVisible}">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--border)">
        <div style="font-size:15px;font-weight:700;color:var(--danger)">{{ bulkDeleteMode ? '批量删除确认' : '删除确认' }}</div>
        <button class="ul-icon-btn" @click="deleteVisible=false">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div style="padding:20px">
        <p style="font-size:13px;color:var(--text-secondary);line-height:1.6">
          <template v-if="bulkDeleteMode">即将删除 <strong>{{ selectedIds.size }}</strong> 条关键词记录，此操作不可撤销。</template>
          <template v-else>确认删除关键词「<strong>{{ deleteTarget?.keyword }}</strong>」？此操作不可撤销。</template>
        </p>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:10px;padding:14px 20px;border-top:1px solid var(--border)">
        <button class="btn btn-default" @click="deleteVisible=false">取消</button>
        <button class="btn btn-danger" @click="doDelete">确认删除</button>
      </div>
    </div>

    <!-- Toast -->
    <div class="ul-toast-container">
      <div v-for="t in toasts" :key="t.id" class="ul-toast" :class="t.type">
        <span style="flex:1;color:var(--text-primary);line-height:1.5">{{ t.msg }}</span>
        <button style="background:none;border:none;cursor:pointer;color:var(--text-muted)" @click="removeToast(t.id)">✕</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch } from 'vue'

interface KeywordItem {
  id: number
  projectName: string
  userId: string
  keyword: string
  custom1: string
  custom2: string
  custom3: string
  exportStatus: 'not_exported' | 'exported' | 'imported'
  exportTime: string
  wordStatus: 'normal' | 'recycle'
  auditStatus: 'auditing' | 'approved' | 'filled' | 'invalid'
  recycleReason?: 'invalid_cant_send' | 'user_deleted' | 'offline' | 'expired'
  auditTime: string
  auditRemark: string
  createTime: string
}
interface Toast { id: number; msg: string; type: 'success' | 'error' | 'info' }

const EXPORT_STATUS_LABEL: Record<string, string> = {
  not_exported: '未导出', exported: '已导出', imported: '已导入',
}
const EXPORT_STATUS_CLASS: Record<string, string> = {
  not_exported: 'badge-gray', exported: 'badge-info', imported: 'badge-success',
}
const AUDIT_STATUS_LABEL: Record<string, string> = {
  auditing: '审核中', approved: '已通过待回填', filled: '已回填发布中', invalid: '失效可传',
}
const AUDIT_STATUS_CLASS: Record<string, string> = {
  auditing: 'badge-warning', approved: 'badge-info', filled: 'badge-success', invalid: 'badge-gray',
}
const RECYCLE_REASON_LABEL: Record<string, string> = {
  invalid_cant_send: '失效不可传', user_deleted: '用户删除', offline: '关键词已下线', expired: '关键词过期', '': '—',
}
const RECYCLE_REASON_CLASS: Record<string, string> = {
  invalid_cant_send: 'tag-red', user_deleted: 'tag-amber', offline: 'tag-gray', expired: 'tag-orange', '': '',
}
const IMPORT_TITLES: Record<string, string> = {
  source: '源数据导入', invalid: '导入失效词', offline: '导入下线词',
}

// 当前激活 tab
const activeTab = ref<'normal' | 'recycle'>('normal')

const loading = ref(false)
const list = ref<KeywordItem[]>([])
const total = ref(0)
const normalTotal = ref(0)
const recycleTotal = ref(0)
const page = ref(1)
const pageSize = ref(20)
const filters = ref({
  projectName: '',
  keyword: '',
  userId: '',
  auditStatus: '',
  recycleReason: '',
  exportStatus: '',
})
const selectedIds = reactive(new Set<number>())
const importVisible = ref(false)
const importType = ref<'source' | 'invalid' | 'offline'>('source')
const deleteVisible = ref(false)
const bulkDeleteMode = ref(false)
const deleteTarget = ref<KeywordItem | null>(null)
const toasts = ref<Toast[]>([])
let toastId = 0

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
const paginationPages = computed(() => {
  const arr: number[] = []
  const t = totalPages.value; const c = page.value
  const s = Math.max(1, c - 2); const e = Math.min(t, c + 2)
  for (let i = s; i <= e; i++) arr.push(i)
  return arr
})
const isAllSelected = computed(() => list.value.length > 0 && list.value.every(r => selectedIds.has(r.id)))

function toggleSelectAll(e: Event) {
  const checked = (e.target as HTMLInputElement).checked
  list.value.forEach(r => checked ? selectedIds.add(r.id) : selectedIds.delete(r.id))
}
function toggleSelect(id: number) {
  selectedIds.has(id) ? selectedIds.delete(id) : selectedIds.add(id)
}

const MOCK_DATA: KeywordItem[] = [
  { id:1, projectName:'剪映海外推广计划-Q2', userId:'U10001', keyword:'剪映专业版', custom1:'视频', custom2:'', custom3:'', exportStatus:'imported', exportTime:'2026-04-10 14:00:00', wordStatus:'normal', auditStatus:'filled', recycleReason:undefined, auditTime:'2026-04-08 10:00:00', auditRemark:'', createTime:'2026-04-01 09:00:00' },
  { id:2, projectName:'剪映海外推广计划-Q2', userId:'U10001', keyword:'CapCut剪辑', custom1:'', custom2:'', custom3:'', exportStatus:'exported', exportTime:'2026-04-12 09:30:00', wordStatus:'normal', auditStatus:'approved', recycleReason:undefined, auditTime:'2026-04-11 16:00:00', auditRemark:'', createTime:'2026-04-02 10:00:00' },
  { id:3, projectName:'番茄小说达人招募', userId:'U10002', keyword:'番茄小说免费', custom1:'阅读', custom2:'短剧', custom3:'', exportStatus:'not_exported', exportTime:'', wordStatus:'normal', auditStatus:'auditing', recycleReason:undefined, auditTime:'', auditRemark:'', createTime:'2026-04-05 11:00:00' },
  { id:4, projectName:'番茄小说达人招募', userId:'U10002', keyword:'免费追剧APP', custom1:'', custom2:'', custom3:'', exportStatus:'not_exported', exportTime:'', wordStatus:'normal', auditStatus:'invalid', recycleReason:undefined, auditTime:'2026-04-15 14:00:00', auditRemark:'词频过低', createTime:'2026-04-05 11:30:00' },
  { id:5, projectName:'115网盘春季推广', userId:'U10003', keyword:'115网盘会员', custom1:'存储', custom2:'', custom3:'', exportStatus:'imported', exportTime:'2026-04-08 10:00:00', wordStatus:'recycle', auditStatus:'filled', recycleReason:'offline', auditTime:'2026-04-06 09:00:00', auditRemark:'', createTime:'2026-03-20 14:00:00' },
  { id:6, projectName:'115网盘春季推广', userId:'U10003', keyword:'云盘永久会员', custom1:'', custom2:'', custom3:'', exportStatus:'exported', exportTime:'2026-04-09 11:00:00', wordStatus:'recycle', auditStatus:'filled', recycleReason:'expired', auditTime:'2026-04-07 10:30:00', auditRemark:'', createTime:'2026-03-21 09:00:00' },
  { id:7, projectName:'WPS高级会员推广', userId:'U10004', keyword:'WPS年度会员', custom1:'办公', custom2:'效率', custom3:'', exportStatus:'not_exported', exportTime:'', wordStatus:'normal', auditStatus:'auditing', recycleReason:undefined, auditTime:'', auditRemark:'', createTime:'2026-04-10 08:00:00' },
  { id:8, projectName:'AI绘画工具推广', userId:'U10005', keyword:'AI绘画免费', custom1:'', custom2:'', custom3:'', exportStatus:'not_exported', exportTime:'', wordStatus:'recycle', auditStatus:'filled', recycleReason:'user_deleted', auditTime:'2026-04-16 09:00:00', auditRemark:'', createTime:'2026-04-12 10:00:00' },
  { id:9, projectName:'剪映海外推广计划-Q2', userId:'U10001', keyword:'手机剪辑神器', custom1:'', custom2:'', custom3:'', exportStatus:'not_exported', exportTime:'', wordStatus:'normal', auditStatus:'auditing', recycleReason:undefined, auditTime:'', auditRemark:'', createTime:'2026-04-18 13:00:00' },
  { id:10, projectName:'出海视频内容计划', userId:'U10007', keyword:'TikTok创作者', custom1:'', custom2:'', custom3:'', exportStatus:'not_exported', exportTime:'', wordStatus:'normal', auditStatus:'invalid', recycleReason:undefined, auditTime:'2026-04-20 10:00:00', auditRemark:'竞争过高', createTime:'2026-04-15 14:00:00' },
  { id:11, projectName:'AI绘画工具推广', userId:'U10005', keyword:'Midjourney教程', custom1:'', custom2:'', custom3:'', exportStatus:'not_exported', exportTime:'', wordStatus:'recycle', auditStatus:'filled', recycleReason:'invalid_cant_send', auditTime:'2026-04-17 10:00:00', auditRemark:'', createTime:'2026-04-13 11:00:00' },
]

async function fetchList(p = 1) {
  loading.value = true; page.value = p
  await new Promise(r => setTimeout(r, 200))
  // 先统计两个 tab 的总数
  normalTotal.value = MOCK_DATA.filter(d => d.wordStatus === 'normal').length
  recycleTotal.value = MOCK_DATA.filter(d => d.wordStatus === 'recycle').length
  // 按当前 tab 过滤
  let data = MOCK_DATA.filter(d => d.wordStatus === activeTab.value)
  if (filters.value.projectName) data = data.filter(d => d.projectName.includes(filters.value.projectName))
  if (filters.value.keyword) data = data.filter(d => d.keyword.includes(filters.value.keyword))
  if (filters.value.userId) data = data.filter(d => d.userId.includes(filters.value.userId))
  if (filters.value.exportStatus) data = data.filter(d => d.exportStatus === filters.value.exportStatus)
  if (activeTab.value === 'normal' && filters.value.auditStatus) {
    data = data.filter(d => d.auditStatus === filters.value.auditStatus)
  }
  if (activeTab.value === 'recycle' && filters.value.recycleReason) {
    data = data.filter(d => d.recycleReason === filters.value.recycleReason)
  }
  total.value = data.length
  const start = (p - 1) * pageSize.value
  list.value = data.slice(start, start + pageSize.value)
  selectedIds.clear()
  loading.value = false
}

function switchTab(tab: 'normal' | 'recycle') {
  activeTab.value = tab
  resetFilter()
}

function resetFilter() {
  filters.value = { projectName: '', keyword: '', userId: '', auditStatus: '', recycleReason: '', exportStatus: '' }
  fetchList(1)
}

function openImport(type: 'source' | 'invalid' | 'offline') {
  importType.value = type
  importVisible.value = true
}
function doImport() {
  importVisible.value = false
  showToast('导入任务已提交，请稍后刷新查看结果', 'success')
}

function confirmDelete(row: KeywordItem) {
  bulkDeleteMode.value = false
  deleteTarget.value = row
  deleteVisible.value = true
}
function confirmBulkDelete() {
  bulkDeleteMode.value = true
  deleteVisible.value = true
}
function doDelete() {
  if (bulkDeleteMode.value) {
    list.value = list.value.filter(r => !selectedIds.has(r.id))
    total.value -= selectedIds.size
    selectedIds.clear()
    showToast('批量删除成功', 'success')
  } else {
    list.value = list.value.filter(r => r.id !== deleteTarget.value!.id)
    total.value--
    showToast('删除成功', 'success')
  }
  deleteVisible.value = false
}

function showToast(msg: string, type: Toast['type'] = 'info') {
  const id = ++toastId; toasts.value.push({ id, msg, type })
  setTimeout(() => removeToast(id), 3000)
}
function removeToast(id: number) { toasts.value = toasts.value.filter(t => t.id !== id) }

onMounted(() => fetchList(1))
</script>

<style scoped>
.kw-wrap { min-height: 100%; }

/* ===== 子 Tab ===== */
.kw-tabs {
  display: flex;
  gap: 0;
  border-bottom: 2px solid var(--border);
  margin-bottom: 16px;
}
.kw-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 20px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-muted);
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: color 0.16s, border-color 0.16s;
  font-family: inherit;
}
.kw-tab.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
  font-weight: 600;
}
.kw-tab:hover:not(.active) { color: var(--text-secondary); }
.kw-tab-count {
  background: var(--border);
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 600;
  border-radius: 10px;
  padding: 1px 7px;
  line-height: 1.4;
  transition: background 0.16s, color 0.16s;
}
.kw-tab.active .kw-tab-count {
  background: var(--primary-light);
  color: var(--primary);
}

.kw-filter { padding: 16px 18px 14px; margin-bottom: 14px; }
.kw-import-modal { width: 520px !important; }
.kw-import-area {
  border: 2px dashed var(--border); border-radius: 10px;
  padding: 32px 20px; text-align: center; cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  background: var(--surface-hover);
}
.kw-import-area:hover { border-color: var(--primary); background: var(--primary-light); }
.kw-import-tip {
  margin-top: 14px; padding: 10px 14px;
  background: var(--primary-light); border: 1px solid var(--primary-border);
  border-radius: 7px; font-size: 12px; color: var(--text-secondary);
  line-height: 1.6;
}
</style>
