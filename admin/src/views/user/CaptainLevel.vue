<template>
  <div class="cl-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">团长体系</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">团长等级配置</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <div ref="prdTipAnchorRef" class="page-header-title-anchor">
            <h1 class="page-title">团长等级配置</h1>
          </div>
          <p class="page-desc">配置团长 LV1–LV5 等级条件与状态；固定 5 个等级，不支持新增/删除。</p>
        </div>
      </div>
    <!-- 筛选区 -->
    <div ref="prdTipFilterRef" class="glass-card filter-card">
      <div class="filter-grid">
        <div class="form-group-filter">
          <label class="form-label-sm">等级</label>
          <select v-model="filter.lv" class="form-input-sm form-select-sm">
            <option value="">全部</option>
            <option v-for="n in 5" :key="n" :value="`LV${n}`">LV{{ n }}</option>
          </select>
        </div>
        <div class="form-group-filter">
          <label class="form-label-sm">状态</label>
          <select v-model="filter.status" class="form-input-sm form-select-sm">
            <option value="">全部</option>
            <option value="启用">启用</option>
            <option value="禁用">禁用</option>
          </select>
        </div>
        <div class="form-group-filter">
          <label class="form-label-sm">操作人</label>
          <input v-model="filter.op" class="form-input-sm" placeholder="请输入操作人" />
        </div>
        <div class="form-group-filter">
          <label class="form-label-sm">创建时间起</label>
          <input v-model="filter.timeStart" type="date" class="form-input-sm" />
        </div>
        <div class="form-group-filter">
          <label class="form-label-sm">创建时间止</label>
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
          团长等级列表
          <span class="table-count">共 {{ filtered.length }} 条</span>
        </div>
        <div class="cl-hint">固定 5 个等级，不支持新增/删除</div>
      </div>
      <div class="cl-table-wrap">
        <table class="cl-table">
          <colgroup>
            <col style="min-width:64px;width:6%">
            <col style="min-width:52px;width:5%">
            <col style="min-width:90px;width:8%">
            <col style="min-width:240px;width:30%">
            <col style="min-width:88px;width:8%">
            <col style="min-width:88px;width:8%">
            <col style="min-width:70px;width:7%">
            <col style="min-width:80px;width:8%">
            <col style="min-width:100px;width:10%">
            <col style="min-width:56px;width:6%">
          </colgroup>
          <thead>
            <tr>
              <th>等级</th>
              <th>图标</th>
              <th>等级昵称</th>
              <th>等级条件</th>
              <th>升级需审核</th>
              <th class="cl-th-num">该等级人数</th>
              <th>状态</th>
              <th>操作人</th>
              <th>创建时间</th>
              <th ref="prdTipOpsRef" class="col-action" style="text-align:center">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in pagedRows" :key="row.lv" class="cl-row">
              <td>
                <span class="cl-lv-tag" :class="`cl-lv-${row.lvNum}`">{{ row.lv }}</span>
              </td>
              <td>
                <div class="cl-icon-box" :class="`cl-icon-bg-${row.lvNum}`">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" :stroke="LV_COLORS[row.lvNum - 1]" stroke-width="1.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
              </td>
              <td style="font-weight:600">{{ row.nick }}</td>
              <td>
                <span v-if="row.lvNum === 1" class="cl-tag-gray">默认等级</span>
                <div v-else class="cl-cond-list">
                  <div v-for="c in row.condTexts" :key="c" class="cl-cond-item">
                    <span class="cl-dot-gold"></span>{{ c }}
                  </div>
                </div>
              </td>
              <td>
                <span class="cl-badge" :class="row.audit === '是' ? 'cl-badge-amber' : 'cl-badge-green'">{{ row.audit }}</span>
              </td>
              <td class="cl-num">{{ row.count.toLocaleString() }}</td>
              <td>
                <span class="cl-badge" :class="row.status === '启用' ? 'cl-badge-green' : 'cl-badge-gray'">{{ row.status }}</span>
              </td>
              <td style="font-size:13px;color:var(--text-secondary)">{{ row.op }}</td>
              <td class="cl-muted">{{ row.time }}</td>
              <td style="text-align:center">
                <button type="button" class="action-btn edit" title="编辑" @click="openEdit(row)">编辑</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="ul-pagination">
        <span class="ul-page-info">第 <strong>{{ page }}</strong>/<strong>{{ totalPages }}</strong> 页</span>
        <div class="cl-pg-center">
          <button type="button" class="ul-pg-btn" :disabled="page <= 1" @click="goPage(1)">«</button>
          <button type="button" class="ul-pg-btn" :disabled="page <= 1" @click="goPage(page - 1)">‹</button>
          <button type="button" class="ul-pg-btn active" @click="goPage(page)">{{ page }}</button>
          <button type="button" class="ul-pg-btn" :disabled="page >= totalPages" @click="goPage(page + 1)">›</button>
          <button type="button" class="ul-pg-btn" :disabled="page >= totalPages" @click="goPage(totalPages)">»</button>
        </div>
        <div class="cl-pg-size-wrap">
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

    <!-- 编辑抽屉 -->
    <div class="cl-overlay" :class="{ show: drawerVisible }" @click="drawerVisible = false"></div>
    <div class="cl-drawer" :class="{ show: drawerVisible }">
      <div class="cl-drawer-header">
        <span class="cl-drawer-title">编辑团长等级 — {{ editRow?.lv }}</span>
        <button class="cl-icon-btn" @click="drawerVisible = false">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <div class="cl-drawer-body" v-if="editRow">
        <!-- 等级（只读） -->
        <div class="cl-form-group">
          <label class="cl-label">等级</label>
          <div class="cl-readonly">
            <span class="cl-lv-tag" :class="`cl-lv-${editRow.lvNum}`">{{ editRow.lv }}</span>
          </div>
        </div>
        <!-- 等级图标 -->
        <div class="cl-form-group">
          <label class="cl-label">等级图标 <span class="req">*</span></label>
          <div class="cl-upload-box" @click="showToast('图片上传功能演示', 'info')">
            ＋ 上传图标
            <div style="font-size:10px;margin-top:2px">建议 64×64，JPG/PNG</div>
          </div>
        </div>
        <!-- 等级昵称 -->
        <div class="cl-form-group">
          <label class="cl-label">等级昵称 <span class="req">*</span></label>
          <input v-model="editForm.nick" class="cl-input" maxlength="20" placeholder="最多 20 字" />
        </div>
        <!-- 等级条件 -->
        <div class="cl-form-group">
          <label class="cl-label">等级条件 <span class="req">*</span></label>
          <!-- LV1 只读 -->
          <div v-if="editRow.lvNum === 1" class="cl-readonly">
            默认等级（注册后自动成为团长时获得，不可更改）
          </div>
          <!-- LV2–LV5 结构化编辑 -->
          <div v-else class="cl-cond-editor">
            <div class="cl-cond-tip">多个条件同时满足方可升级（且关系）</div>
            <label class="cl-cond-row">
              <input type="checkbox" v-model="editForm.condIncome" style="accent-color:var(--primary)" />
              项目收益累计 ≥
              <input type="number" v-model.number="editForm.condIncomeVal"
                class="cl-cond-num" :disabled="!editForm.condIncome" min="0" placeholder="0" />
              元
            </label>
            <label class="cl-cond-row">
              <input type="checkbox" v-model="editForm.condInvite" style="accent-color:var(--primary)" />
              累计直邀 ≥
              <input type="number" v-model.number="editForm.condInviteVal"
                class="cl-cond-num" :disabled="!editForm.condInvite" min="0" placeholder="0" />
              人
            </label>
            <label class="cl-cond-row">
              <input type="checkbox" v-model="editForm.condInviteIncome" style="accent-color:var(--primary)" />
              直邀用户累计收益 ≥
              <input type="number" v-model.number="editForm.condInviteIncomeVal"
                class="cl-cond-num" :disabled="!editForm.condInviteIncome" min="0" placeholder="0" />
              元
            </label>
          </div>
        </div>
        <!-- 升级是否需要审核 -->
        <div class="cl-form-group">
          <label class="cl-label">升级是否需要审核 <span class="req">*</span></label>
          <div class="cl-radio-group">
            <label class="cl-radio"><input type="radio" v-model="editForm.audit" value="是" />是</label>
            <label class="cl-radio"><input type="radio" v-model="editForm.audit" value="否" />否</label>
          </div>
        </div>
        <!-- 状态 -->
        <div class="cl-form-group">
          <label class="cl-label">状态 <span class="req">*</span></label>
          <div class="cl-radio-group">
            <label class="cl-radio"><input type="radio" v-model="editForm.status" value="启用" />启用</label>
            <label class="cl-radio"><input type="radio" v-model="editForm.status" value="禁用" />禁用</label>
          </div>
        </div>
      </div>
      <div class="cl-drawer-footer">
        <button class="btn btn-default" @click="drawerVisible = false">取消</button>
        <button class="btn btn-primary" @click="doSave">保存</button>
      </div>
    </div>

    <!-- Toast -->
    <div class="cl-toast-container">
      <div v-for="t in toasts" :key="t.id" class="cl-toast" :class="t.type">
        <span style="flex:1;line-height:1.5">{{ t.msg }}</span>
        <button class="cl-toast-close" @click="removeToast(t.id)">✕</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PrdTipMarker from '@/components/prd/PrdTipMarker.vue'
import { useAdminPrdTips } from '@/composables/useAdminPrdTips'
import { ref, computed, watch } from 'vue'

const { bundle, opsTipId, prdTipAnchorRef, prdTipFilterRef, prdTipOpsRef } = useAdminPrdTips()

interface CaptainRow {
  lv: string; lvNum: number; nick: string; audit: string; status: string
  count: number; op: string; time: string; condTexts: string[]
  condIncome: boolean; condIncomeVal: number
  condInvite: boolean; condInviteVal: number
  condInviteIncome: boolean; condInviteIncomeVal: number
}

const LV_COLORS = ['#a16207', '#92400e', '#78350f', '#b45309', '#d97706']

function buildCondTexts(f: {
  condIncome: boolean; condIncomeVal: number
  condInvite: boolean; condInviteVal: number
  condInviteIncome: boolean; condInviteIncomeVal: number
}): string[] {
  const t: string[] = []
  if (f.condIncome && f.condIncomeVal) t.push(`项目收益累计 ≥ ${f.condIncomeVal.toLocaleString()} 元`)
  if (f.condInvite && f.condInviteVal) t.push(`累计直邀 ≥ ${f.condInviteVal} 人`)
  if (f.condInviteIncome && f.condInviteIncomeVal) t.push(`直邀用户累计收益 ≥ ${f.condInviteIncomeVal.toLocaleString()} 元`)
  return t
}

const levels = ref<CaptainRow[]>([
  {
    lv: 'LV1', lvNum: 1, nick: '新手团长', audit: '否', status: '启用', count: 3420,
    op: '系统初始化', time: '2024-01-01', condTexts: [],
    condIncome: false, condIncomeVal: 0, condInvite: false, condInviteVal: 0, condInviteIncome: false, condInviteIncomeVal: 0,
  },
  {
    lv: 'LV2', lvNum: 2, nick: '成长团长', audit: '否', status: '启用', count: 1280,
    op: '张管理', time: '2024-01-15', condTexts: ['项目收益累计 ≥ 5,000 元'],
    condIncome: true, condIncomeVal: 5000, condInvite: false, condInviteVal: 0, condInviteIncome: false, condInviteIncomeVal: 0,
  },
  {
    lv: 'LV3', lvNum: 3, nick: '资深团长', audit: '是', status: '启用', count: 456,
    op: '张管理', time: '2024-02-01', condTexts: ['项目收益累计 ≥ 20,000 元', '累计直邀 ≥ 10 人'],
    condIncome: true, condIncomeVal: 20000, condInvite: true, condInviteVal: 10, condInviteIncome: false, condInviteIncomeVal: 0,
  },
  {
    lv: 'LV4', lvNum: 4, nick: '金牌团长', audit: '是', status: '启用', count: 89,
    op: '李运营', time: '2024-02-15', condTexts: ['项目收益累计 ≥ 100,000 元', '直邀用户累计收益 ≥ 50,000 元'],
    condIncome: true, condIncomeVal: 100000, condInvite: false, condInviteVal: 0, condInviteIncome: true, condInviteIncomeVal: 50000,
  },
  {
    lv: 'LV5', lvNum: 5, nick: '超级团长', audit: '是', status: '启用', count: 12,
    op: '王审核', time: '2024-03-01', condTexts: ['项目收益累计 ≥ 500,000 元', '累计直邀 ≥ 50 人', '直邀用户累计收益 ≥ 200,000 元'],
    condIncome: true, condIncomeVal: 500000, condInvite: true, condInviteVal: 50, condInviteIncome: true, condInviteIncomeVal: 200000,
  },
])

const filter = ref({ lv: '', status: '', op: '', timeStart: '', timeEnd: '' })
const filtered = computed(() => levels.value.filter(r => {
  if (filter.value.lv && r.lv !== filter.value.lv) return false
  if (filter.value.status && r.status !== filter.value.status) return false
  if (filter.value.op && !r.op.includes(filter.value.op)) return false
  return true
}))

const page = ref(1)
const pageSize = ref(10)
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

const drawerVisible = ref(false)
const editRow = ref<CaptainRow | null>(null)
const editForm = ref({
  nick: '', audit: '否', status: '启用',
  condIncome: false, condIncomeVal: 0,
  condInvite: false, condInviteVal: 0,
  condInviteIncome: false, condInviteIncomeVal: 0,
})

function openEdit(row: CaptainRow) {
  editRow.value = row
  editForm.value = {
    nick: row.nick, audit: row.audit, status: row.status,
    condIncome: row.condIncome, condIncomeVal: row.condIncomeVal,
    condInvite: row.condInvite, condInviteVal: row.condInviteVal,
    condInviteIncome: row.condInviteIncome, condInviteIncomeVal: row.condInviteIncomeVal,
  }
  drawerVisible.value = true
}

function doSave() {
  if (!editRow.value) return
  if (!editForm.value.nick.trim()) { showToast('等级昵称不能为空', 'warning'); return }
  if (editRow.value.lvNum > 1 && !editForm.value.condIncome && !editForm.value.condInvite && !editForm.value.condInviteIncome) {
    showToast('LV2–LV5 至少需要配置一个升级条件', 'warning'); return
  }
  const r = editRow.value
  r.nick = editForm.value.nick
  r.audit = editForm.value.audit
  r.status = editForm.value.status
  r.condIncome = editForm.value.condIncome; r.condIncomeVal = editForm.value.condIncomeVal
  r.condInvite = editForm.value.condInvite; r.condInviteVal = editForm.value.condInviteVal
  r.condInviteIncome = editForm.value.condInviteIncome; r.condInviteIncomeVal = editForm.value.condInviteIncomeVal
  r.condTexts = buildCondTexts(editForm.value)
  r.op = '当前管理员'
  drawerVisible.value = false
  showToast('保存成功', 'success')
}

function resetFilter() { filter.value = { lv: '', status: '', op: '', timeStart: '', timeEnd: '' }; page.value = 1 }
function doQuery() { page.value = 1; showToast(`查询完成，共 ${filtered.value.length} 条`, 'info') }

interface Toast { id: number; msg: string; type: string }
const toasts = ref<Toast[]>([]); let tid = 0
function showToast(msg: string, type = 'info') {
  const id = ++tid; toasts.value.push({ id, msg, type }); setTimeout(() => removeToast(id), 3000)
}
function removeToast(id: number) { toasts.value = toasts.value.filter(t => t.id !== id) }
</script>

<style scoped>
.cl-wrap { min-height: 100%; }
.cl-hint { font-size: 12px; color: var(--text-muted); }
.cl-table-wrap { overflow-x: auto; }
.cl-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.cl-table th { padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 600; color: var(--text-muted); background: var(--surface-hover); border-bottom: 1px solid var(--border); white-space: nowrap; }
.cl-table td { padding: 12px 14px; border-bottom: 1px solid var(--border); color: var(--text-primary); vertical-align: middle; }
.cl-row:hover td { background: var(--surface-hover); }
.cl-th-num { text-align: right; }
.cl-num { text-align: right; font-variant-numeric: tabular-nums; font-weight: 700; font-family: monospace; }
.cl-pg-center { display: flex; align-items: center; gap: 4px; }
.cl-pg-size-wrap { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-muted); }
.cl-pg-size-wrap .ul-pg-size { min-width: 4.5em; }
.cl-muted { font-size: 11px; color: var(--text-muted); }

/* 金色系 LV Tag */
.cl-lv-tag { display: inline-flex; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; }
.cl-lv-1 { background: #fefce8; color: #a16207; border: 1px solid #fde68a; }
.cl-lv-2 { background: #fef9c3; color: #92400e; border: 1px solid #fde68a; }
.cl-lv-3 { background: #fde68a; color: #78350f; border: 1px solid #fcd34d; }
.cl-lv-4 { background: #fcd34d; color: #451a03; border: 1px solid #f59e0b; }
.cl-lv-5 { background: #fbbf24; color: #451a03; border: 1px solid #f59e0b; }
[data-theme="dark"] .cl-lv-1 { background: rgba(161,98,7,0.18);  color: #fde68a; border-color: rgba(161,98,7,0.4); }
[data-theme="dark"] .cl-lv-2 { background: rgba(146,64,14,0.22); color: #fcd34d; border-color: rgba(146,64,14,0.4); }
[data-theme="dark"] .cl-lv-3 { background: rgba(120,53,15,0.28); color: #fbbf24; border-color: rgba(120,53,15,0.5); }
[data-theme="dark"] .cl-lv-4 { background: rgba(245,158,11,0.30);color: #fef08a; border-color: rgba(245,158,11,0.5); }
[data-theme="dark"] .cl-lv-5 { background: rgba(245,158,11,0.36); color: #fef3c7; border-color: rgba(245,158,11,0.55); }

/* 图标背景 */
.cl-icon-box { width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; }
.cl-icon-bg-1 { background: #fefce8; border: 1px solid #fde68a; }
.cl-icon-bg-2 { background: #fef9c3; border: 1px solid #fde68a; }
.cl-icon-bg-3 { background: #fef08a; border: 1px solid #fcd34d; }
.cl-icon-bg-4 { background: #fde68a; border: 1px solid #fbbf24; }
.cl-icon-bg-5 { background: #fde68a; border: 1px solid #f59e0b; }

.cl-tag-gray { display: inline-flex; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 500; background: var(--surface-hover); color: var(--text-muted); border: 1px solid var(--border); }
.cl-cond-list { display: flex; flex-direction: column; gap: 4px; }
.cl-cond-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-secondary); }
.cl-dot-gold { width: 6px; height: 6px; border-radius: 50%; background: #d97706; flex-shrink: 0; }

/* Badge */
.cl-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
.cl-badge::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
.cl-badge-green { background: #f0fdf4; color: #16a34a; }
.cl-badge-amber { background: #fffbeb; color: #d97706; }
.cl-badge-gray  { background: #f1f5f9; color: #64748b; }
[data-theme="dark"] .cl-badge-green { background: rgba(22,163,74,0.15); }
[data-theme="dark"] .cl-badge-amber { background: rgba(217,119,6,0.15); }
[data-theme="dark"] .cl-badge-gray  { background: rgba(100,116,139,0.15); }

/* 抽屉 */
.cl-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 699; opacity: 0; pointer-events: none; transition: opacity 0.22s; }
.cl-overlay.show { opacity: 1; pointer-events: all; }
.cl-drawer { position: fixed; top: 0; right: 0; height: 100vh; z-index: 700; width: 520px; background: var(--surface); box-shadow: var(--shadow-xl); display: flex; flex-direction: column; transform: translateX(100%); transition: transform 0.28s cubic-bezier(0.4,0,0.2,1); }
.cl-drawer.show { transform: translateX(0); }
.cl-drawer-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border); flex-shrink: 0; }
.cl-drawer-title { font-size: 15px; font-weight: 700; color: var(--text-primary); }
.cl-drawer-body { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 16px; }
.cl-drawer-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 14px 20px; border-top: 1px solid var(--border); flex-shrink: 0; }
.cl-form-group { display: flex; flex-direction: column; gap: 6px; }
.cl-label { font-size: 13px; color: var(--text-secondary); font-weight: 500; }
.req { color: var(--danger); }
.cl-input { width: 100%; height: 36px; padding: 0 10px; font-size: 13px; font-family: inherit; color: var(--text-primary); background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); outline: none; transition: var(--transition); }
.cl-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(37,99,235,0.10); }
.cl-readonly { padding: 8px 10px; background: var(--surface-hover); border-radius: var(--radius-sm); font-size: 13px; color: var(--text-muted); border: 1px solid var(--border); }
.cl-upload-box { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 80px; height: 80px; border: 2px dashed var(--border); border-radius: 8px; cursor: pointer; font-size: 13px; color: var(--text-muted); transition: var(--transition); gap: 2px; }
.cl-upload-box:hover { border-color: var(--primary); color: var(--primary); }
.cl-radio-group { display: flex; gap: 16px; }
.cl-radio { display: flex; align-items: center; gap: 6px; font-size: 13px; cursor: pointer; }
.cl-cond-editor { border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 12px; background: var(--surface-hover); display: flex; flex-direction: column; gap: 10px; }
.cl-cond-tip { font-size: 12px; color: var(--text-muted); }
.cl-cond-row { display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer; }
.cl-cond-num { width: 100px; height: 30px; padding: 0 8px; font-size: 13px; font-family: inherit; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--surface); color: var(--text-primary); outline: none; }
.cl-cond-num:disabled { background: var(--surface-hover); color: var(--text-muted); cursor: not-allowed; }
.cl-icon-btn { width: 28px; height: 28px; border-radius: 6px; background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-muted); transition: var(--transition); }
.cl-icon-btn:hover { background: var(--surface-hover); }

/* Toast */
.cl-toast-container { position: fixed; top: 66px; right: 22px; z-index: 9999; display: flex; flex-direction: column; gap: 8px; pointer-events: none; }
.cl-toast { min-width: 200px; max-width: 360px; padding: 12px 14px 12px 16px; background: var(--surface); border-radius: var(--radius); box-shadow: var(--shadow-lg); border-left: 3px solid; display: flex; align-items: flex-start; gap: 8px; font-size: 13px; pointer-events: all; animation: clIn 0.28s ease; }
.cl-toast.success { border-left-color: var(--success); }
.cl-toast.info    { border-left-color: var(--primary); }
.cl-toast.warning { border-left-color: var(--warning); }
.cl-toast.error   { border-left-color: var(--danger);  }
.cl-toast-close { background: none; border: none; cursor: pointer; color: var(--text-muted); font-size: 14px; }
@keyframes clIn { from { opacity: 0; transform: translateX(80px); } to { opacity: 1; transform: translateX(0); } }
</style>
