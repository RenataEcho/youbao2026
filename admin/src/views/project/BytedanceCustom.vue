<template>
  <div class="bc-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">品牌项目</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">字节定制</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">字节定制</h1>
          <p class="page-desc">订单合并与关键词源数据导入（PRD §5.2.5）</p>
        </div>
      </div>

      <div class="bc-tabs">
        <button type="button" class="bc-tab" :class="{ active: activeTab === 'merge' }" @click="switchTab('merge')">
          订单合并
        </button>
        <button type="button" class="bc-tab" :class="{ active: activeTab === 'source' }" @click="switchTab('source')">
          关键词源数据
        </button>
      </div>

      <!-- 订单合并 -->
      <template v-if="activeTab === 'merge'">
        <div class="glass-card bc-filter">
          <div class="ul-filter-grid">
            <div class="ul-form-group">
              <label class="ul-label">合并项目名称</label>
              <input v-model="mergeFilters.projectName" type="text" class="ul-input" placeholder="模糊搜索">
            </div>
            <div class="ul-form-group">
              <label class="ul-label">分发状态</label>
              <select v-model="mergeFilters.dispatchStatus" class="ul-input ul-select">
                <option value="">全部</option>
                <option value="dispatching">分发中</option>
                <option value="success">分发成功</option>
                <option value="partial_fail">部分失败</option>
              </select>
            </div>
            <div class="ul-form-group">
              <label class="ul-label">导入人员</label>
              <input v-model="mergeFilters.importUser" type="text" class="ul-input" placeholder="模糊搜索">
            </div>
          </div>
          <div class="ul-filter-footer">
            <span />
            <div style="display:flex;gap:8px">
              <button class="btn btn-default btn-sm" @click="resetMergeFilter">重置</button>
              <button class="btn btn-primary btn-sm" @click="fetchMergeList(1)">查询</button>
            </div>
          </div>
        </div>

        <div class="glass-card table-card">
          <div class="table-header">
            <div class="table-title">订单合并记录</div>
            <button class="btn btn-primary btn-sm" @click="openMergeImport">导入订单</button>
          </div>
          <div class="ul-table-wrap">
            <table class="ul-table" style="min-width:1000px">
              <thead>
                <tr>
                  <th style="width:56px">序号</th>
                  <th>合并项目名称</th>
                  <th style="text-align:right">合并订单数</th>
                  <th style="text-align:right">合并订单金额</th>
                  <th>分发状态</th>
                  <th>分发详情</th>
                  <th>文件操作</th>
                  <th>导入人员</th>
                  <th>导入时间</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="mergeLoading">
                  <tr v-for="i in 4" :key="i"><td colspan="9"><div class="ul-skeleton" /></td></tr>
                </template>
                <template v-else-if="mergeList.length === 0">
                  <tr><td colspan="9"><div class="ul-empty">暂无导入记录</div></td></tr>
                </template>
                <template v-else>
                  <tr v-for="(row, idx) in mergeList" :key="row.id" class="ul-row">
                    <td>{{ idx + 1 }}</td>
                    <td><span class="td-ellipsis" :title="row.mergeProjectNames">{{ row.mergeProjectNames }}</span></td>
                    <td style="text-align:right"><span class="ul-mono">{{ row.mergeOrderCount }}</span></td>
                    <td style="text-align:right"><span class="ul-mono">¥{{ row.mergeOrderAmount.toFixed(2) }}</span></td>
                    <td>
                      <span class="badge" :class="getDispatchBadgeClass(row.dispatchStatus)">
                        <span v-if="row.dispatchStatus === 'dispatching'" class="spin-dot" />
                        {{ getDispatchLabel(row.dispatchStatus) }}
                      </span>
                    </td>
                    <td>
                      <button v-if="row.successDetail?.length" type="button" class="bc-detail-link" @click="openDispatchDetail(row)">查看详情</button>
                      <span v-else class="td-muted">—</span>
                    </td>
                    <td>
                      <button type="button" class="bc-file-link" @click="toast('源文件下载中…')">源文件</button>
                      <button v-if="row.dispatchStatus === 'partial_fail'" type="button" class="bc-file-link bc-file-link--warn" @click="toast('失败订单下载中…')">失败订单</button>
                    </td>
                    <td>{{ row.importUser }}</td>
                    <td class="td-muted" style="font-size:12px">{{ row.importTime }}</td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </template>

      <!-- 关键词源数据 -->
      <template v-if="activeTab === 'source'">
        <div class="glass-card bc-filter">
          <div class="ul-filter-grid">
            <div class="ul-form-group">
              <label class="ul-label">涉及项目名称</label>
              <input v-model="srcFilters.projectName" type="text" class="ul-input" placeholder="模糊匹配聚合字段">
            </div>
            <div class="ul-form-group">
              <label class="ul-label">导入处理状态</label>
              <select v-model="srcFilters.importStatus" class="ul-input ul-select">
                <option value="">全部</option>
                <option value="processing">处理中</option>
                <option value="success">全部成功</option>
                <option value="partial_fail">部分失败</option>
                <option value="failed">全部失败</option>
              </select>
            </div>
            <div class="ul-form-group">
              <label class="ul-label">导入人员</label>
              <input v-model="srcFilters.importUser" type="text" class="ul-input" placeholder="模糊">
            </div>
          </div>
          <div class="ul-filter-footer">
            <span />
            <div style="display:flex;gap:8px">
              <button class="btn btn-default btn-sm" @click="resetSrcFilter">重置</button>
              <button class="btn btn-primary btn-sm" @click="fetchSrcList">查询</button>
            </div>
          </div>
        </div>

        <div class="glass-card table-card">
          <div class="table-header">
            <div class="table-title">关键词源数据导入批次</div>
            <button class="btn btn-primary btn-sm" @click="openSrcImport">导入源数据</button>
          </div>
          <div class="ul-table-wrap">
            <table class="ul-table" style="min-width:1080px">
              <thead>
                <tr>
                  <th style="width:52px">序号</th>
                  <th>涉及项目名称</th>
                  <th style="text-align:right">总行数</th>
                  <th style="text-align:right">成功</th>
                  <th style="text-align:right">失败</th>
                  <th>状态</th>
                  <th>按项目统计</th>
                  <th>文件</th>
                  <th>导入人员</th>
                  <th>导入时间</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="srcLoading">
                  <tr v-for="i in 4" :key="i"><td colspan="10"><div class="ul-skeleton" /></td></tr>
                </template>
                <template v-else-if="srcList.length === 0">
                  <tr><td colspan="10"><div class="ul-empty">暂无批次</div></td></tr>
                </template>
                <template v-else>
                  <tr v-for="(row, idx) in srcList" :key="row.id" class="ul-row">
                    <td>{{ idx + 1 }}</td>
                    <td><span class="td-ellipsis" :title="row.involvedProjectNames">{{ row.involvedProjectNames }}</span></td>
                    <td style="text-align:right">{{ row.totalRowCount }}</td>
                    <td style="text-align:right;color:var(--success)">{{ row.successRowCount }}</td>
                    <td style="text-align:right;color:var(--warning)">{{ row.failRowCount }}</td>
                    <td>
                      <span class="badge" :class="srcStatusBadge(row.importStatus)">
                        <span v-if="row.importStatus === 'processing'" class="spin-dot" />
                        {{ srcStatusLabel(row.importStatus) }}
                      </span>
                    </td>
                    <td>
                      <button type="button" class="bc-detail-link" @click="srcDetailRow = row; srcDetailVisible = true">查看</button>
                    </td>
                    <td>
                      <button type="button" class="bc-file-link" @click="toast('下载源文件…')">源文件</button>
                      <button v-if="row.failRowCount > 0" type="button" class="bc-file-link bc-file-link--warn" @click="toast('下载失败行 Excel…')">失败行</button>
                    </td>
                    <td>{{ row.importUser }}</td>
                    <td class="td-muted" style="font-size:12px">{{ row.importTime }}</td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </div>

    <!-- 订单合并 — 导入 -->
    <div class="ul-overlay" :class="{ show: mergeImportVisible }" @click="mergeImportVisible = false" />
    <div class="ul-modal bc-modal-lg" :class="{ show: mergeImportVisible }">
      <div class="ul-modal-header">
        <div class="ul-modal-title">导入订单</div>
        <button type="button" class="ul-icon-btn" @click="mergeImportVisible = false">×</button>
      </div>
      <div class="bc-modal-body">
        <div class="bc-import-notice">
          <p>多项目订单合并导入：模板需一致；导入后进入分发流程。</p>
          <p style="color:var(--danger);font-weight:700">确定导入后不能终止；有误请到对应项目订单删除。</p>
        </div>
        <div class="ul-form-group">
          <label class="ul-label">选择字节系合并项目 <span class="req">*</span></label>
          <select v-model="importSelectedProjects" class="ul-input ul-select">
            <option value="">请选择</option>
            <option v-for="p in BYTE_PROJECTS" :key="p" :value="p">{{ p }}</option>
          </select>
        </div>
        <div v-if="importSelectedProjects" class="bc-template-tip">
          <button type="button" class="bc-download-link" @click="toast('模板下载中…')">下载模板</button>
        </div>
        <div class="ul-form-group">
          <label class="ul-label">导入文件 <span class="req">*</span></label>
          <div class="bc-upload-area" @click="triggerMergeFile">
            <span v-if="mergeFile">{{ mergeFile.name }}</span>
            <span v-else class="td-muted">点击选择 .xlsx / .xls</span>
            <input ref="mergeFileRef" type="file" accept=".xlsx,.xls" class="vis-hid" @change="onMergeFile">
          </div>
          <div v-if="mergeFile" style="margin-top:8px">
            <button type="button" class="bc-validate-link" :class="{ loading: mergeValidating }" @click="runMergeValidate">
              {{ mergeValidating ? '校验中…' : '数据校验' }}
            </button>
          </div>
        </div>
        <div v-if="mergeValidateResult" class="bc-validate-result">
          总数据：{{ mergeValidateResult.total }} 笔，¥{{ mergeValidateResult.amount }}
        </div>
      </div>
      <div class="ul-modal-footer">
        <button type="button" class="btn btn-default" @click="mergeImportVisible = false">取消</button>
        <button type="button" class="btn btn-primary" :disabled="!mergeValidateResult" @click="submitMergeImport">确定导入</button>
      </div>
    </div>

    <!-- 关键词源数据 — 导入 -->
    <div class="ul-overlay" :class="{ show: srcImportVisible }" @click="srcImportVisible = false" />
    <div class="ul-modal bc-modal-lg" :class="{ show: srcImportVisible }">
      <div class="ul-modal-header">
        <div class="ul-modal-title">导入关键词源数据</div>
        <button type="button" class="ul-icon-btn" @click="srcImportVisible = false">×</button>
      </div>
      <div class="bc-modal-body">
        <div class="bc-import-notice">
          <p>归属以模板「项目名称」列分流；项目组内关键词全局查重。</p>
          <p style="color:var(--danger);font-weight:700">请先校验再导入；失败行将生成 Excel。</p>
        </div>
        <div class="src-group-table glass-card">
          <table class="ul-table">
            <thead><tr><th>项目组</th><th>包含项目</th></tr></thead>
            <tbody>
              <tr><td>番茄系</td><td class="td-muted">番茄小说、番茄短剧、番茄漫剧</td></tr>
              <tr><td>红果系</td><td class="td-muted">红果短剧、红果漫剧</td></tr>
              <tr><td>悟空系</td><td class="td-muted">悟空网文、悟空短剧</td></tr>
              <tr><td>畅听系</td><td class="td-muted">番茄畅听、畅听漫剧</td></tr>
            </tbody>
          </table>
        </div>
        <div class="bc-template-tip" style="margin-top:12px">
          <button type="button" class="bc-download-link" @click="toast('模板下载中…')">下载模板</button>
          <span class="td-muted" style="font-size:11px">列：项目名称、关键词、书名、book_id、邀请码、达人 uid</span>
        </div>
        <div class="ul-form-group">
          <label class="ul-label">导入文件 <span class="req">*</span></label>
          <div class="bc-upload-area" @click="triggerSrcFile">
            <span v-if="srcFile">{{ srcFile.name }}</span>
            <span v-else class="td-muted">点击选择 .xlsx / .xls</span>
            <input ref="srcFileRef" type="file" accept=".xlsx,.xls" class="vis-hid" @change="onSrcFile">
          </div>
          <div v-if="srcFile" style="margin-top:8px">
            <button type="button" class="bc-validate-link" :class="{ loading: srcValidating }" @click="runSrcValidate">
              {{ srcValidating ? '校验中…' : '数据校验' }}
            </button>
          </div>
        </div>
        <div v-if="srcValidatePreview" class="bc-validate-result">校验通过：预估 {{ srcValidatePreview.rows }} 行可解析</div>
      </div>
      <div class="ul-modal-footer">
        <button type="button" class="btn btn-default" @click="srcImportVisible = false">取消</button>
        <button type="button" class="btn btn-primary" :disabled="!srcValidatePreview" @click="submitSrcImport">确定导入</button>
      </div>
    </div>

    <!-- 分发详情 -->
    <div class="ul-overlay" :class="{ show: detailVisible }" @click="detailVisible = false" />
    <div class="ul-modal bc-modal" :class="{ show: detailVisible }">
      <div class="ul-modal-header"><div class="ul-modal-title">分发详情</div></div>
      <div v-if="detailRow" style="padding:16px 20px">
        <div v-for="item in detailRow.successDetail" :key="item.name" class="bc-detail-row success">✓ {{ item.name }}：{{ item.count }} 笔</div>
        <div v-for="item in detailRow.failDetail" :key="item.name" class="bc-detail-row fail">✗ {{ item.name }}：{{ item.count }} 笔</div>
      </div>
      <div class="ul-modal-footer">
        <button type="button" class="btn btn-primary" @click="detailVisible = false">关闭</button>
      </div>
    </div>

    <!-- 源数据 — 按项目统计 -->
    <div class="ul-overlay" :class="{ show: srcDetailVisible }" @click="srcDetailVisible = false" />
    <div class="ul-modal bc-modal" :class="{ show: srcDetailVisible }">
      <div class="ul-modal-header"><div class="ul-modal-title">按项目统计</div></div>
      <div v-if="srcDetailRow" style="padding:16px 20px;font-size:13px">
        <div v-for="s in srcDetailRow.perProjectStats" :key="s.projectId">
          ✓ {{ s.projectName }}：成功 {{ s.successCount }}，失败 {{ s.failCount }}
        </div>
      </div>
      <div class="ul-modal-footer">
        <button type="button" class="btn btn-primary" @click="srcDetailVisible = false">关闭</button>
      </div>
    </div>

    <div class="ul-toast-container">
      <div v-for="t in toasts" :key="t.id" class="ul-toast" :class="t.type">{{ t.msg }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface MergeRow {
  id: number
  mergeProjectNames: string
  mergeOrderCount: number
  mergeOrderAmount: number
  dispatchStatus: string
  successDetail: { name: string; count: number; amount: string }[]
  failDetail: { name: string; count: number; amount: string }[]
  importUser: string
  importTime: string
}

interface SourceBatch {
  id: number
  involvedProjectNames: string
  totalRowCount: number
  successRowCount: number
  failRowCount: number
  importStatus: 'processing' | 'success' | 'partial_fail' | 'failed'
  perProjectStats: { projectName: string; projectId: number; successCount: number; failCount: number }[]
  importUser: string
  importTime: string
}

const activeTab = ref<'merge' | 'source'>('merge')
function switchTab(t: 'merge' | 'source') {
  activeTab.value = t
}

const BYTE_PROJECTS = ['剪映海外推广计划-Q2', '番茄小说达人招募', '西瓜视频达人计划']

const mergeLoading = ref(false)
const mergeList = ref<MergeRow[]>([])
const mergeFilters = ref({ projectName: '', dispatchStatus: '', importUser: '' })
const MERGE_MOCK: MergeRow[] = [
  { id: 1, mergeProjectNames: '番茄小说(ID:12)、剪映海外(ID:15)', mergeOrderCount: 184, mergeOrderAmount: 4600, dispatchStatus: 'success', successDetail: [{ name: '番茄小说', count: 128, amount: '3200' }, { name: '剪映海外', count: 56, amount: '1400' }], failDetail: [], importUser: '张三', importTime: '2026-04-28 14:30:00' },
  { id: 2, mergeProjectNames: '剪映海外(ID:15)、西瓜视频(ID:08)', mergeOrderCount: 96, mergeOrderAmount: 2400, dispatchStatus: 'partial_fail', successDetail: [{ name: '剪映海外', count: 84, amount: '2100' }], failDetail: [{ name: '未匹配', count: 12, amount: '300' }], importUser: '李四', importTime: '2026-04-27 10:15:00' },
]
async function fetchMergeList(_p = 1) {
  mergeLoading.value = true
  await new Promise((r) => setTimeout(r, 120))
  let data = [...MERGE_MOCK]
  if (mergeFilters.value.projectName) data = data.filter((d) => d.mergeProjectNames.includes(mergeFilters.value.projectName))
  if (mergeFilters.value.dispatchStatus) data = data.filter((d) => d.dispatchStatus === mergeFilters.value.dispatchStatus)
  if (mergeFilters.value.importUser) data = data.filter((d) => d.importUser.includes(mergeFilters.value.importUser))
  mergeList.value = data
  mergeLoading.value = false
}
function resetMergeFilter() {
  mergeFilters.value = { projectName: '', dispatchStatus: '', importUser: '' }
  fetchMergeList(1)
}

const mergeImportVisible = ref(false)
const importSelectedProjects = ref('')
const mergeFileRef = ref<HTMLInputElement | null>(null)
const mergeFile = ref<File | null>(null)
const mergeValidating = ref(false)
const mergeValidateResult = ref<{ total: number; amount: string } | null>(null)
function openMergeImport() {
  mergeImportVisible.value = true
  importSelectedProjects.value = ''
  mergeFile.value = null
  mergeValidateResult.value = null
}
function triggerMergeFile() {
  mergeFileRef.value?.click()
}
function onMergeFile(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  mergeFile.value = f ?? null
  mergeValidateResult.value = null
}
async function runMergeValidate() {
  mergeValidating.value = true
  await new Promise((r) => setTimeout(r, 900))
  mergeValidating.value = false
  mergeValidateResult.value = { total: 184, amount: '4,600.00' }
}
function submitMergeImport() {
  mergeImportVisible.value = false
  toast('导入成功，分发中…')
  fetchMergeList(1)
}

const detailVisible = ref(false)
const detailRow = ref<MergeRow | null>(null)
function openDispatchDetail(row: MergeRow) {
  detailRow.value = row
  detailVisible.value = true
}

function getDispatchLabel(s: string) {
  return ({ dispatching: '分发中', success: '分发成功', partial_fail: '部分失败' } as Record<string, string>)[s] || s
}
function getDispatchBadgeClass(s: string) {
  return ({ dispatching: 'badge-info', success: 'badge-success', partial_fail: 'badge-warning' } as Record<string, string>)[s] || ''
}

const srcLoading = ref(false)
const srcList = ref<SourceBatch[]>([])
const srcFilters = ref({ projectName: '', importStatus: '', importUser: '' })
const SRC_MOCK: SourceBatch[] = [
  {
    id: 1,
    involvedProjectNames: '番茄小说(ID:5)、番茄畅听(ID:10)',
    totalRowCount: 120,
    successRowCount: 118,
    failRowCount: 2,
    importStatus: 'partial_fail',
    perProjectStats: [
      { projectName: '番茄小说', projectId: 5, successCount: 60, failCount: 0 },
      { projectName: '番茄畅听', projectId: 10, successCount: 58, failCount: 2 },
    ],
    importUser: '运营 A',
    importTime: '2026-04-29 11:20:00',
  },
  {
    id: 2,
    involvedProjectNames: '番茄小说(ID:5)',
    totalRowCount: 48,
    successRowCount: 0,
    failRowCount: 0,
    importStatus: 'processing',
    perProjectStats: [],
    importUser: '运营 B',
    importTime: '2026-04-29 12:01:30',
  },
]

async function fetchSrcList() {
  srcLoading.value = true
  await new Promise((r) => setTimeout(r, 120))
  let data = [...SRC_MOCK]
  if (srcFilters.value.projectName) data = data.filter((d) => d.involvedProjectNames.includes(srcFilters.value.projectName))
  if (srcFilters.value.importStatus) data = data.filter((d) => d.importStatus === srcFilters.value.importStatus)
  if (srcFilters.value.importUser) data = data.filter((d) => d.importUser.includes(srcFilters.value.importUser))
  srcList.value = data
  srcLoading.value = false
}
function resetSrcFilter() {
  srcFilters.value = { projectName: '', importStatus: '', importUser: '' }
  fetchSrcList()
}

function srcStatusLabel(s: SourceBatch['importStatus']) {
  return ({ processing: '处理中', success: '全部成功', partial_fail: '部分失败', failed: '全部失败' } as const)[s]
}
function srcStatusBadge(s: SourceBatch['importStatus']) {
  return ({ processing: 'badge-info', success: 'badge-success', partial_fail: 'badge-warning', failed: 'badge-danger' } as const)[s]
}

const srcImportVisible = ref(false)
const srcFileRef = ref<HTMLInputElement | null>(null)
const srcFile = ref<File | null>(null)
const srcValidating = ref(false)
const srcValidatePreview = ref<{ rows: number } | null>(null)
function openSrcImport() {
  srcImportVisible.value = true
  srcFile.value = null
  srcValidatePreview.value = null
}
function triggerSrcFile() {
  srcFileRef.value?.click()
}
function onSrcFile(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  srcFile.value = f ?? null
  srcValidatePreview.value = null
}
async function runSrcValidate() {
  srcValidating.value = true
  await new Promise((r) => setTimeout(r, 800))
  srcValidating.value = false
  srcValidatePreview.value = { rows: 120 }
}
function submitSrcImport() {
  srcImportVisible.value = false
  toast('已提交导入任务（演示）')
  fetchSrcList()
}

const srcDetailVisible = ref(false)
const srcDetailRow = ref<SourceBatch | null>(null)

const toasts = ref<{ id: number; msg: string; type: string }[]>([])
let toastId = 0
function toast(msg: string) {
  const id = ++toastId
  toasts.value.push({ id, msg, type: 'info' })
  setTimeout(() => { toasts.value = toasts.value.filter((t) => t.id !== id) }, 2600)
}

onMounted(() => {
  fetchMergeList(1)
  fetchSrcList()
})
</script>

<style scoped>
.bc-wrap { min-height: 100%; }
.bc-tabs { display: flex; gap: 0; margin-bottom: 14px; border-bottom: 1px solid var(--border); }
.bc-tab {
  padding: 8px 20px; font-size: 13.5px; font-weight: 500;
  color: var(--text-secondary); background: none; border: none;
  border-bottom: 2px solid transparent; margin-bottom: -1px; cursor: pointer;
}
.bc-tab.active { color: var(--primary); border-bottom-color: var(--primary); font-weight: 600; }
.bc-filter { padding: 16px 18px; margin-bottom: 14px; }
.table-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-bottom: 12px; }
.table-title { font-weight: 600; font-size: 14px; }
.td-ellipsis { display: block; max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.td-muted { color: var(--text-muted); }
.req { color: var(--danger); }

.badge { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; }
.badge-success { background: var(--success-bg); color: var(--success); }
.badge-warning { background: var(--warning-bg); color: var(--warning); }
.badge-danger { background: var(--danger-bg); color: var(--danger); }
.badge-info { background: var(--info-bg); color: var(--info); }
.spin-dot {
  width: 8px; height: 8px; border-radius: 50%;
  border: 1.5px solid var(--info); border-top-color: transparent;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.bc-detail-link {
  background: none; border: none; color: var(--primary); font-size: 12.5px; cursor: pointer; text-decoration: underline;
}
.bc-file-link {
  display: inline-flex; margin-right: 8px;
  background: none; border: none; color: var(--primary); font-size: 12px; cursor: pointer;
}
.bc-file-link--warn { color: var(--warning); }

.ul-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.35); z-index: 8000;
  opacity: 0; pointer-events: none; transition: opacity 0.2s;
}
.ul-overlay.show { opacity: 1; pointer-events: auto; }
.ul-modal {
  position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%) scale(0.96);
  z-index: 8010; background: var(--bg-card); border-radius: var(--radius-lg);
  border: 1px solid var(--border); box-shadow: var(--shadow-lg);
  max-height: 90vh; overflow: auto; opacity: 0; pointer-events: none;
  transition: opacity 0.2s, transform 0.2s;
}
.ul-modal.show { opacity: 1; pointer-events: auto; transform: translate(-50%, -50%) scale(1); }
.bc-modal { width: 520px; }
.bc-modal-lg { width: 640px; max-width: calc(100vw - 32px); }
.ul-modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 18px; border-bottom: 1px solid var(--border);
}
.ul-modal-title { font-weight: 600; font-size: 15px; }
.ul-icon-btn {
  border: none; background: none; font-size: 20px; line-height: 1; cursor: pointer; color: var(--text-muted);
}
.bc-modal-body { padding: 18px 20px 8px; }
.ul-modal-footer {
  display: flex; justify-content: flex-end; gap: 10px;
  padding: 12px 18px 16px; border-top: 1px solid var(--border);
}

.bc-import-notice {
  background: var(--info-bg); border: 1px solid var(--info-border);
  border-radius: var(--radius-sm); padding: 12px 14px; font-size: 12.5px; margin-bottom: 14px;
}
.bc-template-tip { margin-bottom: 8px; }
.bc-download-link { background: none; border: none; color: var(--primary); cursor: pointer; text-decoration: underline; font-size: 13px; }
.bc-upload-area {
  border: 1.5px dashed var(--border-hover); border-radius: var(--radius-sm);
  padding: 18px; text-align: center; cursor: pointer; font-size: 13px;
}
.vis-hid { display: none; }
.bc-validate-link {
  background: none; border: none; color: var(--primary); cursor: pointer; font-size: 12.5px; text-decoration: underline;
}
.bc-validate-link.loading { color: var(--text-muted); cursor: wait; text-decoration: none; }
.bc-validate-result {
  margin-top: 10px; padding: 12px; border-radius: var(--radius-sm);
  background: var(--success-bg); border: 1px solid var(--success-border); font-size: 13px;
}
.bc-detail-row { padding: 4px 0; font-size: 13px; }
.bc-detail-row.success { color: var(--success); }
.bc-detail-row.fail { color: var(--danger); }

.src-group-table { padding: 10px 12px; margin-top: 8px; }
.src-group-table .ul-table { font-size: 12px; }

.ul-toast-container {
  position: fixed; bottom: 24px; right: 24px; z-index: 9000;
  display: flex; flex-direction: column; gap: 8px;
}
.ul-toast {
  padding: 10px 14px; border-radius: var(--radius-sm); font-size: 13px;
  background: var(--bg-card); border: 1px solid var(--border); box-shadow: var(--shadow-lg);
}
</style>
