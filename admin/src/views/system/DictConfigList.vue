<template>
  <div class="dict-config-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">系统管理</span>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">字典管理</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">{{ pageMeta.title }}</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">{{ pageMeta.title }}</h1>
          <p class="page-desc">{{ pageMeta.desc }}</p>
        </div>
      </div>

      <div class="glass-card ul-filter-card">
        <div class="ul-filter-grid">
          <div class="ul-form-group">
            <label class="ul-label">字段名称</label>
            <input v-model="filters.fieldName" type="text" class="ul-input" placeholder="模糊匹配英文 key">
          </div>
          <div class="ul-form-group">
            <label class="ul-label">字段注释</label>
            <input v-model="filters.fieldComment" type="text" class="ul-input" placeholder="模糊匹配中文说明">
          </div>
          <template v-if="variant === 'dataTable'">
            <div class="ul-form-group">
              <label class="ul-label">类型</label>
              <select v-model="filters.categoryType" class="ul-input ul-select">
                <option value="">全部</option>
                <option value="keyword">关键词</option>
                <option value="work">作品</option>
                <option value="order">订单</option>
              </select>
            </div>
          </template>
        </div>
        <div class="ul-filter-footer">
          <span />
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
            字段列表
            <span class="table-count">共 {{ total.toLocaleString() }} 条</span>
          </div>
          <div class="table-header-right">
            <button class="btn btn-primary btn-sm" type="button" @click="openAdd">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              新增
            </button>
          </div>
        </div>
        <div class="ul-table-wrap">
          <table class="ul-table ul-table--fixed">
            <colgroup>
              <col style="width:56px">
              <col style="min-width:140px">
              <col style="min-width:120px">
              <col v-if="variant === 'dataTable'" style="min-width:88px">
              <col style="min-width:72px">
              <col style="min-width:100px">
              <col style="min-width:140px">
            </colgroup>
            <thead>
              <tr>
                <th class="th-num">ID</th>
                <th>字段注释</th>
                <th>字段名称</th>
                <th v-if="variant === 'dataTable'">类型</th>
                <th>状态</th>
                <th>备注</th>
                <th>创建时间</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="loading">
                <tr v-for="i in 8" :key="i"><td :colspan="colSpanAll"><div class="ul-skeleton" /></td></tr>
              </template>
              <template v-else-if="list.length === 0">
                <tr><td :colspan="colSpanAll"><div class="ul-empty">暂无数据</div></td></tr>
              </template>
              <template v-else>
                <tr v-for="row in list" :key="row.id">
                  <td class="td-num">{{ row.id }}</td>
                  <td>{{ row.fieldComment }}</td>
                  <td><span class="ul-mono" style="font-size:12px">{{ row.fieldName }}</span></td>
                  <td v-if="variant === 'dataTable'">
                    <span class="tag tag-blue" style="font-size:10px">{{ categoryTypeLabel(row.categoryType) }}</span>
                  </td>
                  <td>
                    <span class="badge" :class="row.status === 'enabled' ? 'badge-success' : 'badge-gray'" style="font-size:10px">
                      {{ row.status === 'enabled' ? '启用' : '停用' }}
                    </span>
                  </td>
                  <td style="font-size:12px;color:var(--text-secondary)">{{ row.remark || '—' }}</td>
                  <td class="ul-muted" style="font-size:11px;white-space:nowrap">{{ row.createdAt }}</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <div class="ul-pagination">
          <span class="ul-page-info">共 <strong>{{ total }}</strong> 条，第 <strong>{{ page }}</strong>/<strong>{{ totalPages }}</strong> 页</span>
          <div style="display:flex;align-items:center;gap:4px">
            <button class="ul-pg-btn" type="button" :disabled="page <= 1" @click="fetchList(1)">«</button>
            <button class="ul-pg-btn" type="button" :disabled="page <= 1" @click="fetchList(page - 1)">‹</button>
            <button v-for="pn in paginationPages" :key="pn" type="button" class="ul-pg-btn" :class="{ active: pn === page }" @click="fetchList(Number(pn))">{{ pn }}</button>
            <button class="ul-pg-btn" type="button" :disabled="page >= totalPages" @click="fetchList(page + 1)">›</button>
            <button class="ul-pg-btn" type="button" :disabled="page >= totalPages" @click="fetchList(totalPages)">»</button>
          </div>
          <div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-muted)">
            每页
            <select class="ul-pg-size" @change="onPageSizeChange">
              <option :value="10">10</option>
              <option :value="20" :selected="pageSize === 20">20</option>
              <option :value="50">50</option>
            </select>
            条
          </div>
        </div>
      </div>
    </div>

    <!-- 新增 -->
    <div class="ul-overlay" :class="{ show: addOpen }" @click="addOpen = false" />
    <div class="ul-modal" :class="{ show: addOpen }" style="width:520px">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid var(--border)">
        <div style="font-size:15px;font-weight:700">新增字段</div>
        <button type="button" class="ul-icon-btn" aria-label="关闭" @click="addOpen = false">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div style="padding:20px;display:flex;flex-direction:column;gap:14px">
        <div class="ul-form-group">
          <label class="ul-label">字段注释</label>
          <input v-model="addForm.fieldComment" type="text" class="ul-input" placeholder="中文说明" autocomplete="off">
        </div>
        <div class="ul-form-group">
          <label class="ul-label">字段名称</label>
          <input v-model="addForm.fieldTitle" type="text" class="ul-input" placeholder="列表展示名（可与英文 key 一致）" autocomplete="off">
        </div>
        <div class="ul-form-group">
          <label class="ul-label">状态</label>
          <select v-model="addForm.status" class="ul-input ul-select">
            <option value="enabled">启用</option>
            <option value="disabled">停用</option>
          </select>
        </div>
        <div class="ul-form-group">
          <label class="ul-label">字段</label>
          <input v-model="addForm.fieldKey" type="text" class="ul-input" placeholder="英文 key，写入「字段名称」列" autocomplete="off">
        </div>
        <div v-if="variant === 'dataTable'" class="ul-form-group">
          <label class="ul-label">类型</label>
          <select v-model="addForm.categoryType" class="ul-input ul-select">
            <option value="keyword">关键词</option>
            <option value="work">作品</option>
            <option value="order">订单</option>
          </select>
        </div>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:10px;padding:14px 20px;border-top:1px solid var(--border)">
        <button type="button" class="btn btn-default" @click="addOpen = false">取消</button>
        <button type="button" class="btn btn-primary" @click="submitAdd">保存</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { DictConfigRow, DictCategory } from '@/mock/dictConfigMock'
import {
  MOCK_DICT_KEYWORD,
  MOCK_DICT_POST_VIDEO,
  MOCK_DICT_DATA_TABLE,
  MOCK_DICT_OTHER,
  categoryTypeLabel,
  cloneRows,
} from '@/mock/dictConfigMock'

const props = defineProps<{
  variant: 'keyword' | 'work' | 'dataTable' | 'other'
}>()

const colSpanAll = computed(() => (props.variant === 'dataTable' ? 7 : 6))

const pageMeta = computed(() => {
  const m = {
    keyword: {
      title: '关键词配置字典',
      desc: '维护关键词类数据的字段注释与英文 key 对照，来源与列表 mock 与仓库 keyword-mock 对齐。',
    },
    work: {
      title: '作品配置字典',
      desc: '维护作品/视频类字段配置，mock 与 post-video-mock 对齐。',
    },
    dataTable: {
      title: '数据表配置字典',
      desc: '按类型（关键词 / 作品 / 订单）维护数据表字段，mock 与 order-mock 对齐。',
    },
    other: {
      title: '其他字段',
      desc: '维护其他扩展字段，可在列表中新增与检索。',
    },
  }
  return m[props.variant]
})

function pickInitial(): DictConfigRow[] {
  switch (props.variant) {
    case 'keyword':
      return cloneRows(MOCK_DICT_KEYWORD)
    case 'work':
      return cloneRows(MOCK_DICT_POST_VIDEO)
    case 'dataTable':
      return cloneRows(MOCK_DICT_DATA_TABLE)
    case 'other':
      return cloneRows(MOCK_DICT_OTHER)
  }
}

const allRows = ref<DictConfigRow[]>(pickInitial())
const loading = ref(false)
const list = ref<DictConfigRow[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)

const filters = ref({
  fieldName: '',
  fieldComment: '',
  categoryType: '' as '' | DictCategory,
})

const addOpen = ref(false)
const addForm = ref({
  fieldComment: '',
  fieldTitle: '',
  fieldKey: '',
  status: 'enabled' as 'enabled' | 'disabled',
  categoryType: 'order' as DictCategory,
})

function maxId() {
  return allRows.value.reduce((m, r) => Math.max(m, r.id), 0)
}

function filteredRows(): DictConfigRow[] {
  const nameQ = filters.value.fieldName.trim().toLowerCase()
  const commentQ = filters.value.fieldComment.trim().toLowerCase()
  const cat = filters.value.categoryType
  return allRows.value.filter((r) => {
    if (nameQ && !r.fieldName.toLowerCase().includes(nameQ)) return false
    if (commentQ && !r.fieldComment.toLowerCase().includes(commentQ)) return false
    if (props.variant === 'dataTable' && cat && r.categoryType !== cat) return false
    return true
  })
}

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
const paginationPages = computed(() => {
  const arr: number[] = []
  const t = totalPages.value
  const c = page.value
  const s = Math.max(1, c - 2)
  const e = Math.min(t, c + 2)
  for (let i = s; i <= e; i++) arr.push(i)
  return arr
})

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function nowStamp() {
  const d = new Date()
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:00`
}

async function fetchList(p = 1) {
  loading.value = true
  page.value = p
  await new Promise((r) => setTimeout(r, 120))
  const data = filteredRows()
  total.value = data.length
  const start = (p - 1) * pageSize.value
  list.value = data.slice(start, start + pageSize.value)
  loading.value = false
}

function resetFilter() {
  filters.value = { fieldName: '', fieldComment: '', categoryType: '' }
  fetchList(1)
}

function onPageSizeChange(e: Event) {
  pageSize.value = Number((e.target as HTMLSelectElement).value)
  fetchList(1)
}

function openAdd() {
  addForm.value = {
    fieldComment: '',
    fieldTitle: '',
    fieldKey: '',
    status: 'enabled',
    categoryType: props.variant === 'dataTable' ? 'order' : 'keyword',
  }
  addOpen.value = true
}

function submitAdd() {
  const key = (addForm.value.fieldKey || addForm.value.fieldTitle).trim()
  const comment = addForm.value.fieldComment.trim()
  if (!comment || !key) {
    window.alert('请填写字段注释与字段（英文 key）')
    return
  }
  const next = maxId() + 1
  const row: DictConfigRow = {
    id: next,
    fieldComment: comment,
    fieldName: key,
    status: addForm.value.status,
    remark: addForm.value.fieldTitle.trim() && addForm.value.fieldTitle.trim() !== key ? addForm.value.fieldTitle.trim() : '',
    createdAt: nowStamp(),
  }
  if (props.variant === 'dataTable') {
    row.categoryType = addForm.value.categoryType
  }
  allRows.value = [...allRows.value, row]
  addOpen.value = false
  fetchList(1)
}

onMounted(() => fetchList(1))
</script>

<style scoped>
.dict-config-wrap {
  min-height: 100%;
}
</style>
