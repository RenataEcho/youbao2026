<template>
  <div class="ull-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">用户体系</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">用户等级日志</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <div ref="prdTipAnchorRef" class="page-header-title-anchor">
            <h1 class="page-title">用户等级日志</h1>
          </div>
          <p class="page-desc">用户等级变更、审核与后台调整记录。</p>
        </div>
      </div>

    <!-- 筛选区 -->
    <div ref="prdTipFilterRef" class="glass-card filter-card">
      <div class="filter-grid">
        <div class="form-group-filter">
          <label class="form-label-sm">用户ID</label>
          <input v-model="filter.userId" class="form-input-sm" placeholder="请输入用户ID" />
        </div>
        <div class="form-group-filter">
          <label class="form-label-sm">变更前等级</label>
          <select v-model="filter.fromLv" class="form-input-sm form-select-sm">
            <option value="">全部</option>
            <option v-for="n in 10" :key="n" :value="`LV${n}`">LV{{ n }}</option>
          </select>
        </div>
        <div class="form-group-filter">
          <label class="form-label-sm">变更后等级</label>
          <select v-model="filter.toLv" class="form-input-sm form-select-sm">
            <option value="">全部</option>
            <option v-for="n in 10" :key="n" :value="`LV${n}`">LV{{ n }}</option>
          </select>
        </div>
        <div class="form-group-filter">
          <label class="form-label-sm">变更类型</label>
          <select v-model="filter.type" class="form-input-sm form-select-sm">
            <option value="">全部</option>
            <option value="系统升级">系统升级</option>
            <option value="后台调整">后台调整</option>
          </select>
        </div>
        <div class="form-group-filter">
          <label class="form-label-sm">审核状态</label>
          <select v-model="filter.auditStatus" class="form-input-sm form-select-sm">
            <option value="">全部</option>
            <option value="系统通过">系统通过</option>
            <option value="待审核">待审核</option>
            <option value="审核通过">审核通过</option>
            <option value="审核驳回">审核驳回</option>
          </select>
        </div>
        <div class="form-group-filter">
          <label class="form-label-sm">操作人</label>
          <input v-model="filter.op" class="form-input-sm" placeholder="请输入操作人" />
        </div>
        <div class="form-group-filter">
          <label class="form-label-sm">操作时间起</label>
          <input v-model="filter.timeStart" type="date" class="form-input-sm" />
        </div>
        <div class="form-group-filter">
          <label class="form-label-sm">操作时间止</label>
          <input v-model="filter.timeEnd" type="date" class="form-input-sm" />
        </div>
      </div>
      <div class="filter-footer">
        <span></span>
        <div class="filter-actions">
          <button class="btn btn-default btn-sm" @click="resetFilter">重置</button>
          <button class="btn btn-primary btn-sm" @click="doQuery">查询</button>
        </div>
      </div>
    </div>

    <!-- 数据表 -->
    <div class="glass-card table-card">
      <div class="table-header">
        <div class="table-title">
          用户等级日志
          <span class="table-count">共 {{ filtered.length }} 条</span>
          <span v-if="pendingCount > 0" class="ull-pending-badge">待审核 {{ pendingCount }} 条</span>
        </div>
        <div class="table-header-right" style="display:flex;align-items:center;gap:8px">
          <template v-if="selection.length > 0">
            <span class="ull-select-count">已选 {{ selection.length }} 项</span>
            <button class="btn btn-primary btn-sm" @click="batchApprove">批量通过</button>
            <button class="btn btn-danger btn-sm" @click="openBatchReject">批量驳回</button>
          </template>
          <button class="btn btn-primary btn-sm" @click="openAdd">+ 新增</button>
        </div>
      </div>
      <div class="ull-table-wrap">
        <table class="ull-table">
          <colgroup>
            <col style="width:40px">
            <col style="min-width:90px;width:8%">
            <col style="min-width:160px;width:16%">
            <col style="min-width:80px;width:8%">
            <col style="min-width:100px;width:10%">
            <col style="min-width:160px;width:18%">
            <col style="min-width:120px;width:14%">
            <col style="min-width:120px;width:14%">
          </colgroup>
          <thead>
            <tr>
              <th><input type="checkbox" v-model="allChecked" @change="toggleAll" style="accent-color:var(--primary)" /></th>
              <th>用户ID</th>
              <th>等级变更</th>
              <th>变更类型</th>
              <th>审核状态</th>
              <th>审核信息</th>
              <th>操作时间</th>
              <th ref="prdTipOpsRef" class="col-action">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in pagedRows" :key="row.id" class="ull-row">
              <td><input type="checkbox" :value="row.id" v-model="selection" style="accent-color:var(--primary)" /></td>
              <td class="ull-mono">{{ row.userId }}</td>
              <td>
                <div style="display:flex;align-items:center;gap:6px">
                  <span class="ull-lv-tag" :class="`ull-lv-${row.fromLvNum}`">{{ row.fromLv }}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                  <span class="ull-lv-tag" :class="`ull-lv-${row.toLvNum}`">{{ row.toLv }}</span>
                </div>
              </td>
              <td>
                <span class="ull-type-tag" :class="row.changeType === '系统升级' ? 'ull-type-blue' : 'ull-type-amber'">{{ row.changeType }}</span>
              </td>
              <td>
                <span class="ull-audit-badge" :class="auditBadgeClass(row.auditStatus)">{{ row.auditStatus }}</span>
              </td>
              <td>
                <template v-if="row.auditor">
                  <div style="font-size:13px;font-weight:500">{{ row.auditor }}</div>
                  <div class="ull-muted">{{ row.auditTime }}</div>
                </template>
                <span v-else class="ull-muted">-</span>
              </td>
              <td class="ull-muted">{{ row.time }}</td>
              <td class="col-action">
                <div class="action-btns">
                  <button v-if="row.auditStatus === '待审核'" type="button" class="action-btn approve" @click="approveSingle(row)">通过</button>
                  <button v-if="row.auditStatus === '待审核'" type="button" class="action-btn reject" @click="openReject(row)">驳回</button>
                  <button
                    v-if="row.auditStatus === '待审核' || row.auditStatus === '审核驳回'"
                    type="button"
                    class="action-btn edit"
                    title="编辑"
                    @click="openEdit(row)"
                  >编辑</button>
                  <button type="button" class="action-btn view" title="操作日志" @click="openLog(row)">日志</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="ul-pagination">
        <span class="ul-page-info">第 <strong>{{ page }}</strong>/<strong>{{ totalPages }}</strong> 页</span>
        <div class="ull-pg-center">
          <button type="button" class="ul-pg-btn" :disabled="page <= 1" @click="goPage(1)">«</button>
          <button type="button" class="ul-pg-btn" :disabled="page <= 1" @click="goPage(page - 1)">‹</button>
          <button type="button" class="ul-pg-btn active" @click="goPage(page)">{{ page }}</button>
          <button type="button" class="ul-pg-btn" :disabled="page >= totalPages" @click="goPage(page + 1)">›</button>
          <button type="button" class="ul-pg-btn" :disabled="page >= totalPages" @click="goPage(totalPages)">»</button>
        </div>
        <div class="ull-pg-size-wrap">
          每页
          <select class="ul-pg-size" :value="pageSize" @change="onPageSizeChange($event)">
            <option v-for="s in [10, 20, 50]" :key="s" :value="s">{{ s }}</option>
          </select>
          条
        </div>
      </div>
    </div>

      <PrdTipMarker
        :anchor-el="prdTipAnchorRef"
        :tip-id="1"
        :module-name="bundle.page.moduleName"
        :markdown="bundle.page.md"
      />
      <PrdTipMarker
        v-if="bundle.filter"
        variant="filterCard"
        :anchor-el="prdTipFilterRef"
        :tip-id="2"
        :module-name="bundle.filter.moduleName"
        :markdown="bundle.filter.md"
      />
      <PrdTipMarker
        v-if="bundle.ops"
        variant="opsHeader"
        :anchor-el="prdTipOpsRef"
        :tip-id="opsTipId"
        :module-name="bundle.ops.moduleName"
        :markdown="bundle.ops.md"
      />

    </div>
    <!-- /page-content -->

    <!-- 新增弹窗 -->
    <div class="ull-overlay" :class="{ show: addVisible }" @click.self="addVisible = false"></div>
    <div class="ull-modal" :class="{ show: addVisible }" style="width:560px">
      <div class="ull-modal-header">
        <span class="ull-modal-title">新增后台调整记录</span>
        <button class="ull-icon-btn" @click="addVisible = false"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <div class="ull-modal-body">
        <div class="ull-form-group">
          <label class="ull-label">用户ID <span class="req">*</span></label>
          <div style="display:flex;gap:8px">
            <input v-model="addForm.userId" class="ull-input" placeholder="输入用户ID后失焦自动带出当前等级" @blur="fetchUserLevel" />
          </div>
        </div>
        <div class="ull-form-group">
          <label class="ull-label">变更前等级（自动带出）</label>
          <div class="ull-readonly">{{ addForm.fromLv || '-' }}</div>
        </div>
        <div class="ull-form-group">
          <label class="ull-label">变更后等级 <span class="req">*</span></label>
          <select v-model="addForm.toLv" class="ull-input">
            <option value="">请选择</option>
            <option v-for="n in 10" :key="n" :value="`LV${n}`" :disabled="`LV${n}` === addForm.fromLv">LV{{ n }}</option>
          </select>
        </div>
      </div>
      <div class="ull-modal-footer">
        <button class="btn btn-default" @click="addVisible = false">取消</button>
        <button class="btn btn-primary" @click="doAdd">确认新增</button>
      </div>
    </div>

    <!-- 编辑弹窗 -->
    <div class="ull-overlay" :class="{ show: editVisible }" @click.self="editVisible = false"></div>
    <div class="ull-modal" :class="{ show: editVisible }" style="width:480px">
      <div class="ull-modal-header">
        <span class="ull-modal-title">编辑等级变更记录</span>
        <button class="ull-icon-btn" @click="editVisible = false"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <div class="ull-modal-body">
        <div class="ull-form-group">
          <label class="ull-label">变更后等级 <span class="req">*</span></label>
          <select v-model="editForm.toLv" class="ull-input">
            <option v-for="n in 10" :key="n" :value="`LV${n}`">LV{{ n }}</option>
          </select>
        </div>
      </div>
      <div class="ull-modal-footer">
        <button class="btn btn-default" @click="editVisible = false">取消</button>
        <button class="btn btn-primary" @click="doEdit">保存</button>
      </div>
    </div>

    <!-- 驳回弹窗 -->
    <div class="ull-overlay" :class="{ show: rejectVisible }" @click.stop></div>
    <div class="ull-modal" :class="{ show: rejectVisible }" style="width:520px">
      <div class="ull-modal-header">
        <span class="ull-modal-title">{{ batchRejectMode ? '批量驳回' : '审核驳回' }}</span>
        <button class="ull-icon-btn" @click="rejectVisible = false"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <div class="ull-modal-body">
        <div class="ull-form-group">
          <label class="ull-label">驳回原因 <span class="req">*</span></label>
          <textarea v-model="rejectReason" class="ull-input" rows="4" style="height:auto;resize:vertical" maxlength="200" placeholder="请输入驳回原因（最多 200 字）"></textarea>
          <div style="font-size:11px;color:var(--text-muted);text-align:right">{{ rejectReason.length }}/200</div>
        </div>
      </div>
      <div class="ull-modal-footer">
        <button class="btn btn-default" @click="rejectVisible = false">取消</button>
        <button class="btn btn-danger" @click="doReject">确认驳回</button>
      </div>
    </div>

    <!-- 操作日志抽屉 -->
    <div class="ul-overlay" :class="{ show: logVisible }" @click="logVisible = false"></div>
    <div class="ul-drawer" :class="{ show: logVisible }">
      <div class="ul-drawer-header">
        <span class="ul-drawer-title">操作日志 — 用户 {{ logRow?.userId }}</span>
        <button class="ul-icon-btn" type="button" aria-label="关闭" @click="logVisible = false"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <div class="ul-drawer-body" style="padding:16px">
        <table class="ull-table" style="font-size:12px">
          <thead><tr><th>操作时间</th><th>操作人</th><th>操作类型</th><th>操作前状态</th><th>操作后状态</th></tr></thead>
          <tbody>
            <tr v-for="l in mockLog" :key="l.id">
              <td class="ull-muted">{{ l.time }}</td>
              <td>{{ l.op }}</td>
              <td><span class="ull-type-tag ull-type-blue">{{ l.type }}</span></td>
              <td>{{ l.before }}</td>
              <td>{{ l.after }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Toast -->
    <div class="ull-toast-container">
      <div v-for="t in toasts" :key="t.id" class="ull-toast" :class="t.type">
        <span style="flex:1;line-height:1.5">{{ t.msg }}</span>
        <button class="ull-toast-close" @click="removeToast(t.id)">✕</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PrdTipMarker from '@/components/prd/PrdTipMarker.vue'
import { useAdminPrdTips } from '@/composables/useAdminPrdTips'
import { ref, computed, watch } from 'vue'

const { bundle, opsTipId, prdTipAnchorRef, prdTipFilterRef, prdTipOpsRef } = useAdminPrdTips()

interface LogRow { id: number; userId: string; fromLv: string; fromLvNum: number; toLv: string; toLvNum: number; changeType: string; auditStatus: string; auditor: string; auditTime: string; time: string }

const filter = ref({ userId:'', fromLv:'', toLv:'', type:'', auditStatus:'', op:'', timeStart:'', timeEnd:'' })

const logs = ref<LogRow[]>([
  { id:1, userId:'U10001', fromLv:'LV1', fromLvNum:1, toLv:'LV2', toLvNum:2, changeType:'系统升级', auditStatus:'系统通过', auditor:'系统', auditTime:'2026-04-01 10:00', time:'2026-04-01' },
  { id:2, userId:'U10002', fromLv:'LV2', fromLvNum:2, toLv:'LV3', toLvNum:3, changeType:'系统升级', auditStatus:'待审核',   auditor:'',     auditTime:'',               time:'2026-04-02' },
  { id:3, userId:'U10003', fromLv:'LV3', fromLvNum:3, toLv:'LV5', toLvNum:5, changeType:'后台调整', auditStatus:'审核通过', auditor:'张管理', auditTime:'2026-04-03 14:20', time:'2026-04-03' },
  { id:4, userId:'U10004', fromLv:'LV2', fromLvNum:2, toLv:'LV3', toLvNum:3, changeType:'后台调整', auditStatus:'审核驳回', auditor:'李运营', auditTime:'2026-04-04 09:30', time:'2026-04-04' },
  { id:5, userId:'U10005', fromLv:'LV4', fromLvNum:4, toLv:'LV5', toLvNum:5, changeType:'系统升级', auditStatus:'待审核',   auditor:'',     auditTime:'',               time:'2026-04-05' },
])

const filtered = computed(() => logs.value.filter(r => {
  if (filter.value.userId && !r.userId.includes(filter.value.userId)) return false
  if (filter.value.fromLv && r.fromLv !== filter.value.fromLv) return false
  if (filter.value.toLv && r.toLv !== filter.value.toLv) return false
  if (filter.value.type && r.changeType !== filter.value.type) return false
  if (filter.value.auditStatus && r.auditStatus !== filter.value.auditStatus) return false
  return true
}))

const page = ref(1)
const pageSize = ref(20)
const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize.value)))
const pagedRows = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})
watch([filtered, pageSize], () => {
  if (page.value > totalPages.value) page.value = totalPages.value
})
function goPage(p: number) {
  if (p < 1 || p > totalPages.value) return
  page.value = p
}
function onPageSizeChange(e: Event) {
  pageSize.value = Number((e.target as HTMLSelectElement).value)
  page.value = 1
}

const pendingCount = computed(() => filtered.value.filter(r => r.auditStatus === '待审核').length)

const selection = ref<number[]>([])
const allChecked = ref(false)
function toggleAll() { selection.value = allChecked.value ? filtered.value.map(r => r.id) : [] }

function auditBadgeClass(s: string) {
  if (s === '系统通过' || s === '审核通过') return 'ull-audit-green'
  if (s === '待审核') return 'ull-audit-amber'
  if (s === '审核驳回') return 'ull-audit-red'
  return ''
}

// 新增
const addVisible = ref(false)
const addForm = ref({ userId:'', fromLv:'', toLv:'' })
let nextId = 6
function openAdd() { addForm.value = { userId:'', fromLv:'', toLv:'' }; addVisible.value = true }
function fetchUserLevel() {
  if (!addForm.value.userId) return
  const map: Record<string, string> = { U10001:'LV2', U10002:'LV3', U10003:'LV5', U10004:'LV3', U10005:'LV5' }
  addForm.value.fromLv = map[addForm.value.userId] || 'LV1'
}
function doAdd() {
  if (!addForm.value.userId || !addForm.value.toLv) { showToast('请填写必填项', 'warning'); return }
  const fromNum = parseInt(addForm.value.fromLv.replace('LV','')) || 1
  const toNum = parseInt(addForm.value.toLv.replace('LV',''))
  logs.value.unshift({ id: nextId++, userId: addForm.value.userId, fromLv: addForm.value.fromLv, fromLvNum: fromNum, toLv: addForm.value.toLv, toLvNum: toNum, changeType:'后台调整', auditStatus:'待审核', auditor:'', auditTime:'', time: new Date().toISOString().slice(0,10) })
  addVisible.value = false; showToast('新增成功，等待审核', 'success')
}

// 编辑
const editVisible = ref(false)
const editTarget = ref<LogRow | null>(null)
const editForm = ref({ toLv:'' })
function openEdit(row: LogRow) { editTarget.value = row; editForm.value = { toLv: row.toLv }; editVisible.value = true }
function doEdit() {
  if (!editTarget.value) return
  editTarget.value.toLv = editForm.value.toLv
  editTarget.value.toLvNum = parseInt(editForm.value.toLv.replace('LV',''))
  editVisible.value = false; showToast('保存成功', 'success')
}

// 通过
function approveSingle(row: LogRow) {
  row.auditStatus = '审核通过'; row.auditor = '当前管理员'; row.auditTime = new Date().toLocaleString('zh-CN')
  showToast('审核通过，等级变更已生效', 'success')
}
function batchApprove() {
  logs.value.filter(r => selection.value.includes(r.id) && r.auditStatus === '待审核').forEach(r => {
    r.auditStatus = '审核通过'; r.auditor = '当前管理员'; r.auditTime = new Date().toLocaleString('zh-CN')
  })
  selection.value = []; showToast('批量审核通过', 'success')
}

// 驳回
const rejectVisible = ref(false)
const rejectTarget = ref<LogRow | null>(null)
const rejectReason = ref('')
const batchRejectMode = ref(false)
function openReject(row: LogRow) { rejectTarget.value = row; rejectReason.value = ''; batchRejectMode.value = false; rejectVisible.value = true }
function openBatchReject() { rejectTarget.value = null; rejectReason.value = ''; batchRejectMode.value = true; rejectVisible.value = true }
function doReject() {
  if (!rejectReason.value.trim()) { showToast('驳回原因不能为空', 'warning'); return }
  if (batchRejectMode.value) {
    logs.value.filter(r => selection.value.includes(r.id) && r.auditStatus === '待审核').forEach(r => {
      r.auditStatus = '审核驳回'; r.auditor = '当前管理员'; r.auditTime = new Date().toLocaleString('zh-CN')
    })
    selection.value = []; showToast('批量驳回成功', 'success')
  } else if (rejectTarget.value) {
    rejectTarget.value.auditStatus = '审核驳回'; rejectTarget.value.auditor = '当前管理员'; rejectTarget.value.auditTime = new Date().toLocaleString('zh-CN')
    showToast('审核驳回', 'success')
  }
  rejectVisible.value = false
}

// 操作日志
const logVisible = ref(false)
const logRow = ref<LogRow | null>(null)
const mockLog = [
  { id:1, time:'2026-04-01 10:00', op:'系统',    type:'自动升级', before:'待升级', after:'系统通过' },
  { id:2, time:'2026-04-01 09:50', op:'系统',    type:'触发升级', before:'-',     after:'待升级'   },
]
function openLog(row: LogRow) { logRow.value = row; logVisible.value = true }

function resetFilter() { filter.value = { userId:'', fromLv:'', toLv:'', type:'', auditStatus:'', op:'', timeStart:'', timeEnd:'' }; page.value = 1 }
function doQuery() { page.value = 1; showToast(`查询完成，共 ${filtered.value.length} 条`, 'info') }

interface Toast { id: number; msg: string; type: string }
const toasts = ref<Toast[]>([]); let tid = 0
function showToast(msg: string, type = 'info') { const id = ++tid; toasts.value.push({ id, msg, type }); setTimeout(() => removeToast(id), 3000) }
function removeToast(id: number) { toasts.value = toasts.value.filter(t => t.id !== id) }
</script>

<style scoped>
.ull-wrap { min-height: 100%; }
.ull-pending-badge { display: inline-flex; align-items: center; padding: 2px 10px; border-radius: 4px; font-size: 12px; font-weight: 700; background: #fffbeb; color: #d97706; border: 1px solid #fde68a; margin-left: 8px; }
.ull-select-count { font-size: 12px; color: var(--text-secondary); }
.ull-table-wrap { overflow-x: auto; }
.ull-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.ull-table th { padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 600; color: var(--text-muted); background: var(--surface-hover); border-bottom: 1px solid var(--border); white-space: nowrap; }
.ull-table td { padding: 12px 14px; border-bottom: 1px solid var(--border); vertical-align: middle; }
.ull-pg-center { display: flex; align-items: center; gap: 4px; }
.ull-pg-size-wrap { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-muted); }
.ull-pg-size-wrap .ul-pg-size { min-width: 4.5em; }
.ull-row:hover td { background: var(--surface-hover); }
.ull-mono { font-family: monospace; font-size: 12px; color: var(--text-secondary); }
.ull-muted { font-size: 11px; color: var(--text-muted); }
/* LV Tag - 同 UserLevel.vue 蓝色系 */
.ull-lv-tag { display: inline-flex; padding: 2px 7px; border-radius: 4px; font-size: 11px; font-weight: 700; }
.ull-lv-1  { background:#f0f9ff;color:#94a3b8;border:1px solid #e2e8f0; } .ull-lv-2  { background:#eff6ff;color:#60a5fa;border:1px solid #bfdbfe; }
.ull-lv-3  { background:#eff6ff;color:#3b82f6;border:1px solid #93c5fd; } .ull-lv-4  { background:#dbeafe;color:#2563eb;border:1px solid #93c5fd; }
.ull-lv-5  { background:#dbeafe;color:#1d4ed8;border:1px solid #60a5fa; } .ull-lv-6  { background:#bfdbfe;color:#1e40af;border:1px solid #3b82f6; }
.ull-lv-7  { background:#bfdbfe;color:#1e3a8a;border:1px solid #2563eb; } .ull-lv-8  { background:#e0e7ff;color:#312e81;border:1px solid #6366f1; }
.ull-lv-9  { background:#ede9fe;color:#4c1d95;border:1px solid #8b5cf6; } .ull-lv-10 { background:#ddd6fe;color:#7c3aed;border:1px solid #7c3aed; }
/* 类型/审核 Tag */
.ull-type-tag { display: inline-flex; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 500; }
.ull-type-blue  { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }
.ull-type-amber { background: #fffbeb; color: #d97706; border: 1px solid #fde68a; }
.ull-audit-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
.ull-audit-badge::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
.ull-audit-green { background: #f0fdf4; color: #16a34a; }
.ull-audit-amber { background: #fffbeb; color: #d97706; font-weight: 700; }
.ull-audit-red   { background: #fef2f2; color: #dc2626; }
[data-theme="dark"] .ull-audit-green { background: rgba(22,163,74,0.15); }
[data-theme="dark"] .ull-audit-amber { background: rgba(217,119,6,0.15); }
[data-theme="dark"] .ull-audit-red   { background: rgba(220,38,38,0.15); }
/* 弹窗/抽屉 */
.ull-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 699; opacity: 0; pointer-events: none; transition: opacity 0.22s; }
.ull-overlay.show { opacity: 1; pointer-events: all; }
.ull-modal { position: fixed; top: 50%; left: 50%; z-index: 700; background: var(--surface); border-radius: var(--radius-lg); box-shadow: var(--shadow-xl); display: flex; flex-direction: column; max-height: 90vh; transform: translate(-50%, -50%) scale(0.95); opacity: 0; pointer-events: none; transition: transform 0.22s, opacity 0.22s; }
.ull-modal.show { transform: translate(-50%, -50%) scale(1); opacity: 1; pointer-events: all; }
.ull-drawer { position: fixed; top: 0; right: 0; height: 100vh; z-index: 700; width: 520px; background: var(--surface); box-shadow: var(--shadow-xl); display: flex; flex-direction: column; transform: translateX(100%); transition: transform 0.28s cubic-bezier(0.4,0,0.2,1); }
.ull-drawer.show { transform: translateX(0); }
.ull-modal-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border); flex-shrink: 0; }
.ull-modal-title { font-size: 15px; font-weight: 700; color: var(--text-primary); }
.ull-modal-body { padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; }
.ull-modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 14px 20px; border-top: 1px solid var(--border); flex-shrink: 0; }
.ull-form-group { display: flex; flex-direction: column; gap: 6px; }
.ull-label { font-size: 13px; color: var(--text-secondary); font-weight: 500; }
.req { color: var(--danger); }
.ull-input { width: 100%; height: 36px; padding: 0 10px; font-size: 13px; font-family: inherit; color: var(--text-primary); background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); outline: none; transition: var(--transition); }
.ull-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(37,99,235,0.10); }
.ull-readonly { padding: 8px 10px; background: var(--surface-hover); border-radius: var(--radius-sm); font-size: 13px; color: var(--text-muted); border: 1px solid var(--border); }
.ull-icon-btn { width: 28px; height: 28px; border-radius: 6px; background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-muted); transition: var(--transition); }
.ull-icon-btn:hover { background: var(--surface-hover); }
/* Toast */
.ull-toast-container { position: fixed; top: 66px; right: 22px; z-index: 9999; display: flex; flex-direction: column; gap: 8px; pointer-events: none; }
.ull-toast { min-width: 200px; max-width: 360px; padding: 12px 14px 12px 16px; background: var(--surface); border-radius: var(--radius); box-shadow: var(--shadow-lg); border-left: 3px solid; display: flex; align-items: flex-start; gap: 8px; font-size: 13px; pointer-events: all; animation: ullIn 0.28s ease; }
.ull-toast.success { border-left-color: var(--success); } .ull-toast.info { border-left-color: var(--primary); }
.ull-toast.warning { border-left-color: var(--warning); } .ull-toast.error  { border-left-color: var(--danger);  }
.ull-toast-close { background: none; border: none; cursor: pointer; color: var(--text-muted); font-size: 14px; }
@keyframes ullIn { from { opacity: 0; transform: translateX(80px); } to { opacity: 1; transform: translateX(0); } }
</style>
