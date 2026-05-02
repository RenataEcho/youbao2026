<template>
  <div class="bt-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">类目配置</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">业务类型</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">业务类型</h1>
          <p class="page-desc">管理平台业务类型分类配置，用于项目归类</p>
        </div>
        <button class="btn btn-primary" @click="openAdd">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          新增业务类型
        </button>
      </div>

      <!-- 筛选 -->
      <div class="glass-card bt-filter">
        <div class="ul-filter-grid">
          <div class="ul-form-group">
            <label class="ul-label">业务名称</label>
            <input v-model="filters.name" type="text" class="ul-input" placeholder="输入业务名称">
          </div>
          <div class="ul-form-group">
            <label class="ul-label">状态</label>
            <select v-model="filters.status" class="ul-input ul-select">
              <option value="">全部状态</option>
              <option value="show">显示</option>
              <option value="hide">隐藏</option>
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            业务类型列表
            <span class="table-count">共 {{ total }} 条</span>
          </div>
        </div>
        <div class="ul-table-wrap">
          <table class="ul-table">
            <thead>
              <tr>
                <th style="width:60px">序号</th>
                <th style="min-width:140px">业务名称</th>
                <th style="width:80px">状态</th>
                <th style="min-width:140px">创建时间</th>
                <th style="min-width:140px">更新时间</th>
                <th class="col-action" style="width:88px;text-align:center">操作</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="loading">
                <tr v-for="i in 5" :key="i"><td colspan="6"><div class="ul-skeleton"></div></td></tr>
              </template>
              <template v-else-if="list.length === 0">
                <tr><td colspan="6">
                  <div class="ul-empty">
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                    <div style="font-size:14px;font-weight:600;color:var(--text-secondary);margin:8px 0 4px">暂无业务类型数据</div>
                  </div>
                </td></tr>
              </template>
              <template v-else>
                <tr v-for="(row, idx) in list" :key="row.id" class="ul-row">
                  <td><span class="ul-mono">{{ (page-1)*pageSize + idx + 1 }}</span></td>
                  <td>
                    <div style="display:flex;align-items:center;gap:8px">
                      <span :class="['biz-dot', `biz-dot-${row.id % 7}`]"></span>
                      <span style="font-weight:600;color:var(--text-primary)">{{ row.bizName }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="badge" :class="row.status === 'show' ? 'badge-success' : 'badge-gray'">
                      {{ row.status === 'show' ? '显示' : '隐藏' }}
                    </span>
                  </td>
                  <td><span class="ul-muted">{{ row.createTime }}</span></td>
                  <td><span class="ul-muted">{{ row.updateTime }}</span></td>
                  <td class="col-action">
                    <div class="action-btns">
                      <button type="button" class="action-btn edit" title="编辑" @click="openEdit(row)">编辑</button>
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

    <!-- 新增/编辑弹窗 -->
    <div class="ul-overlay" :class="{show:formVisible}" @click="formVisible=false"></div>
    <div class="ul-modal" :class="{show:formVisible}" style="width:440px">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--border)">
        <div style="font-size:15px;font-weight:700;color:var(--text-primary);display:flex;align-items:center;gap:7px">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          {{ formMode === 'add' ? '新增业务类型' : '编辑业务类型' }}
        </div>
        <button class="ul-icon-btn" @click="formVisible=false">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div style="padding:20px;display:flex;flex-direction:column;gap:16px">
        <div class="ul-form-group">
          <label class="ul-label">业务名称 <span style="color:var(--danger)">*</span></label>
          <input v-model="form.bizName" type="text" class="ul-input" placeholder="如：推文、短剧、网盘">
        </div>
        <div class="ul-form-group">
          <label class="ul-label">状态 <span style="color:var(--danger)">*</span></label>
          <select v-model="form.status" class="ul-input ul-select">
            <option value="show">显示</option>
            <option value="hide">隐藏</option>
          </select>
        </div>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:10px;padding:14px 20px;border-top:1px solid var(--border)">
        <button class="btn btn-default" @click="formVisible=false">取消</button>
        <button class="btn btn-primary" @click="submitForm">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          确认保存
        </button>
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
import { ref, computed, onMounted } from 'vue'
import { BIZ_TYPE_MOCK_SEED, type ProjectBizTypeRow } from '@/data/projectCategoryCatalog'

type BizItem = ProjectBizTypeRow
interface Toast { id: number; msg: string; type: 'success' | 'error' | 'info' }

const loading = ref(false)
const list = ref<BizItem[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)
const filters = ref({ name: '', status: '' })
const formVisible = ref(false)
const formMode = ref<'add' | 'edit'>('add')
const form = ref<Partial<BizItem> & { bizName: string; status: 'show' | 'hide' }>({
  id: 0, bizName: '', status: 'show',
})
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

async function fetchList(p = 1) {
  loading.value = true; page.value = p
  await new Promise(r => setTimeout(r, 200))
  let data = [...BIZ_TYPE_MOCK_SEED]
  if (filters.value.name) data = data.filter(d => d.bizName.includes(filters.value.name))
  if (filters.value.status) data = data.filter(d => d.status === filters.value.status)
  total.value = data.length
  const start = (p - 1) * pageSize.value
  list.value = data.slice(start, start + pageSize.value)
  loading.value = false
}

function resetFilter() { filters.value = { name: '', status: '' }; fetchList(1) }

function openAdd() {
  formMode.value = 'add'
  form.value = { id: 0, bizName: '', status: 'show' }
  formVisible.value = true
}
function openEdit(row: BizItem) {
  formMode.value = 'edit'
  form.value = { ...row }
  formVisible.value = true
}
function submitForm() {
  if (!form.value.bizName?.trim()) { showToast('业务名称不能为空', 'error'); return }
  formVisible.value = false
  showToast(formMode.value === 'add' ? '新增成功' : '修改成功', 'success')
  fetchList(page.value)
}

function showToast(msg: string, type: Toast['type'] = 'info') {
  const id = ++toastId; toasts.value.push({ id, msg, type })
  setTimeout(() => removeToast(id), 3000)
}
function removeToast(id: number) { toasts.value = toasts.value.filter(t => t.id !== id) }

onMounted(() => fetchList(1))
</script>

<style scoped>
.bt-wrap { min-height: 100%; }
.bt-filter { padding: 16px 18px 14px; margin-bottom: 14px; }
.biz-dot {
  width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
}
.biz-dot-0 { background: #2563eb; }
.biz-dot-1 { background: #7c3aed; }
.biz-dot-2 { background: #0891b2; }
.biz-dot-3 { background: #16a34a; }
.biz-dot-4 { background: #d97706; }
.biz-dot-5 { background: #dc2626; }
.biz-dot-6 { background: #db2777; }
</style>
