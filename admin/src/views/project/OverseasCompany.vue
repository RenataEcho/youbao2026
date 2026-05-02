<template>
  <div class="oc-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">海外文娱</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">公司管理</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">公司管理</h1>
          <p class="page-desc">维护海外文娱合作公司基础信息；项目数为系统统计，不可手填</p>
        </div>
        <button class="btn btn-primary" type="button" @click="openAdd">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          新增公司
        </button>
      </div>

      <div class="glass-card oc-filter">
        <div class="ul-filter-grid">
          <div class="ul-form-group">
            <label class="ul-label">公司名称</label>
            <input v-model="filters.companyName" type="text" class="ul-input" placeholder="模糊搜索">
          </div>
          <div class="ul-form-group">
            <label class="ul-label">合作状态</label>
            <select v-model="filters.cooperationStatus" class="ul-input ul-select">
              <option value="">全部</option>
              <option value="active">合作中</option>
              <option value="terminated">已终止</option>
            </select>
          </div>
        </div>
        <div class="ul-filter-footer">
          <span></span>
          <div style="display:flex;gap:8px">
            <button class="btn btn-default btn-sm" type="button" @click="resetFilter">重置</button>
            <button class="btn btn-primary btn-sm" type="button" @click="fetchList(1)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              查询
            </button>
          </div>
        </div>
      </div>

      <div class="glass-card table-card">
        <div class="table-header">
          <div class="table-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            公司列表
            <span class="table-count">共 {{ total }} 条</span>
          </div>
        </div>
        <div class="ul-table-wrap">
          <table class="ul-table" style="min-width:880px">
            <thead>
              <tr>
                <th style="width:56px">序号</th>
                <th style="min-width:160px">公司名称</th>
                <th style="min-width:100px">联系人</th>
                <th style="min-width:200px">联系方式</th>
                <th style="width:88px;text-align:right">项目数</th>
                <th style="width:96px">合作状态</th>
                <th class="col-action" style="width:88px;text-align:center">操作</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="loading">
                <tr v-for="i in 5" :key="i"><td colspan="7"><div class="ul-skeleton"></div></td></tr>
              </template>
              <template v-else-if="list.length === 0">
                <tr><td colspan="7"><div class="ul-empty"><div style="font-size:14px;color:var(--text-secondary)">暂无公司数据</div></div></td></tr>
              </template>
              <template v-else>
                <tr v-for="(row, idx) in list" :key="row.id" class="ul-row">
                  <td><span class="ul-mono">{{ (page - 1) * pageSize + idx + 1 }}</span></td>
                  <td><strong>{{ row.companyName }}</strong></td>
                  <td>{{ row.contactName }}</td>
                  <td><span style="font-size:12.5px;color:var(--text-secondary)">{{ row.contactInfo }}</span></td>
                  <td style="text-align:right"><span class="ul-mono" style="color:var(--primary);font-weight:600">{{ row.projectCount }}</span></td>
                  <td><span class="badge" :class="row.cooperationStatus === 'active' ? 'badge-success' : 'badge-gray'">{{ row.cooperationStatus === 'active' ? '合作中' : '已终止' }}</span></td>
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
          <div class="oc-pg">
            <button type="button" class="ul-pg-btn" :disabled="page <= 1" @click="goPage(1)">«</button>
            <button type="button" class="ul-pg-btn" :disabled="page <= 1" @click="goPage(page - 1)">‹</button>
            <button v-for="p in pageButtons" :key="p" type="button" class="ul-pg-btn" :class="{ active: p === page }" @click="goPage(p)">{{ p }}</button>
            <button type="button" class="ul-pg-btn" :disabled="page >= totalPages" @click="goPage(page + 1)">›</button>
            <button type="button" class="ul-pg-btn" :disabled="page >= totalPages" @click="goPage(totalPages)">»</button>
          </div>
          <div class="oc-pg-size">
            每页
            <select class="ul-pg-size" @change="onPageSizeChange">
              <option :value="10">10</option>
              <option :value="20" selected>20</option>
              <option :value="50">50</option>
            </select>
            条
          </div>
        </div>
      </div>
    </div>

    <div class="ul-overlay" :class="{ show: formVisible }" @click="formVisible = false"></div>
    <div class="ul-modal flex-col ul-modal--glass oc-modal" :class="{ show: formVisible }" role="dialog" aria-modal="true">
      <div class="ul-modal-header">
        <div class="ul-modal-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          {{ formMode === 'add' ? '新增公司' : '编辑公司' }}
        </div>
        <button class="ul-icon-btn" type="button" @click="formVisible = false">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="ul-modal-body">
        <div class="ul-form-group">
          <label class="ul-label">公司名称 <span class="req">*</span></label>
          <input v-model="form.companyName" type="text" class="ul-input" placeholder="合作公司名称">
        </div>
        <div class="ul-form-group">
          <label class="ul-label">联系人</label>
          <input v-model="form.contactName" type="text" class="ul-input" placeholder="对接联系人姓名">
        </div>
        <div class="ul-form-group">
          <label class="ul-label">联系方式</label>
          <input v-model="form.contactInfo" type="text" class="ul-input" placeholder="电话 / 邮箱等（单字段，格式由运营填写）">
        </div>
        <div class="ul-form-group">
          <label class="ul-label">合作状态</label>
          <select v-model="form.cooperationStatus" class="ul-input ul-select">
            <option value="active">合作中</option>
            <option value="terminated">已终止</option>
          </select>
        </div>
      </div>
      <div class="ul-modal-footer">
        <button class="btn btn-default" type="button" @click="formVisible = false">取消</button>
        <button class="btn btn-primary" type="button" @click="submitForm">确认保存</button>
      </div>
    </div>

    <div class="ul-toast-container">
      <div v-for="t in toasts" :key="t.id" class="ul-toast" :class="t.type">
        <span style="flex:1;color:var(--text-primary);line-height:1.5">{{ t.msg }}</span>
        <button type="button" style="background:none;border:none;cursor:pointer;color:var(--text-muted)" @click="removeToast(t.id)">✕</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

export interface CompanyItem {
  id: number
  companyName: string
  contactName: string
  contactInfo: string
  projectCount: number
  cooperationStatus: 'active' | 'terminated'
}

interface Toast { id: number; msg: string; type: 'success' | 'error' | 'info' }

function buildCompanies(n: number): CompanyItem[] {
  return Array.from({ length: n }, (_, i) => {
    const id = i + 1
    return {
      id,
      companyName: `海外合作公司-${String(id).padStart(2, '0')}`,
      contactName: `联系人${id}`,
      contactInfo: `+86-138000${String(10000 + id).slice(-4)} / corp${id}@partner.example.com`,
      projectCount: (id % 7) + 1,
      cooperationStatus: id % 11 === 0 ? 'terminated' : 'active',
    }
  })
}

const loading = ref(false)
const allRows = ref<CompanyItem[]>(buildCompanies(28))
const page = ref(1)
const pageSize = ref(20)
const filters = ref({ companyName: '', cooperationStatus: '' })
const formVisible = ref(false)
const formMode = ref<'add' | 'edit'>('add')
const form = ref<Partial<CompanyItem>>({ cooperationStatus: 'active' })
const toasts = ref<Toast[]>([])
let toastId = 0
let nextCompanyId = 29

const filteredAll = computed(() => {
  let data = [...allRows.value]
  if (filters.value.companyName.trim()) {
    const q = filters.value.companyName.trim()
    data = data.filter((d) => d.companyName.includes(q))
  }
  if (filters.value.cooperationStatus) {
    data = data.filter((d) => d.cooperationStatus === filters.value.cooperationStatus)
  }
  return data
})

const total = computed(() => filteredAll.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))

const list = computed(() => {
  const s = (page.value - 1) * pageSize.value
  return filteredAll.value.slice(s, s + pageSize.value)
})

const pageButtons = computed(() => {
  const t = totalPages.value
  const c = page.value
  const arr: number[] = []
  for (let i = Math.max(1, c - 2); i <= Math.min(t, c + 2); i++) arr.push(i)
  return arr
})

async function fetchList(p = 1) {
  loading.value = true
  page.value = Math.min(Math.max(1, p), totalPages.value)
  await new Promise((r) => setTimeout(r, 80))
  loading.value = false
}

function goPage(p: number) {
  fetchList(p)
}

function onPageSizeChange(e: Event) {
  pageSize.value = Number((e.target as HTMLSelectElement).value)
  fetchList(1)
}

function resetFilter() {
  filters.value = { companyName: '', cooperationStatus: '' }
  fetchList(1)
}

function openAdd() {
  formMode.value = 'add'
  form.value = { cooperationStatus: 'active', companyName: '', contactName: '', contactInfo: '' }
  formVisible.value = true
}

function openEdit(row: CompanyItem) {
  formMode.value = 'edit'
  form.value = { ...row }
  formVisible.value = true
}

function submitForm() {
  if (!form.value.companyName?.trim()) {
    showToast('请输入公司名称', 'error')
    return
  }
  if (formMode.value === 'add') {
    allRows.value.unshift({
      id: nextCompanyId++,
      companyName: form.value.companyName!,
      contactName: form.value.contactName || '',
      contactInfo: form.value.contactInfo || '',
      projectCount: 0,
      cooperationStatus: form.value.cooperationStatus || 'active',
    })
  } else if (form.value.id != null) {
    const idx = allRows.value.findIndex((r) => r.id === form.value.id)
    if (idx >= 0) {
      allRows.value[idx] = {
        ...allRows.value[idx],
        ...form.value,
      } as CompanyItem
    }
  }
  formVisible.value = false
  showToast(formMode.value === 'add' ? '新增成功' : '保存成功', 'success')
  fetchList(1)
}

function showToast(msg: string, type: Toast['type'] = 'info') {
  const id = ++toastId
  toasts.value.push({ id, msg, type })
  setTimeout(() => removeToast(id), 2800)
}

function removeToast(id: number) {
  toasts.value = toasts.value.filter((t) => t.id !== id)
}

onMounted(() => fetchList(1))
</script>

<style scoped>
.oc-wrap { min-height: 100%; }
.oc-filter { padding: 16px 18px 14px; margin-bottom: 14px; }
.oc-modal { width: 480px !important; max-width: calc(100vw - 32px) !important; }
.oc-pg { display: flex; align-items: center; gap: 4px; }
.oc-pg-size { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-muted); }
.req { color: var(--danger); }
.badge { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; }
.badge-success { background: var(--success-bg); color: var(--success); }
.badge-gray { background: var(--border); color: var(--text-muted); }
</style>
