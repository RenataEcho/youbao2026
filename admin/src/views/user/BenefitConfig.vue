<template>
  <div class="bfc-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">用户体系</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">权益配置</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">权益配置</h1>
          <p class="page-desc">配置各身份对应的权益内容。</p>
        </div>
      </div>

      <div class="glass-card bl-filter">
        <div class="ul-filter-grid" style="grid-template-columns: repeat(4, 1fr)">
          <div class="ul-form-group">
            <label class="ul-label">身份</label>
            <select v-model="filters.identity" class="ul-input ul-select">
              <option value="">全部</option>
              <option v-for="opt in identityOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">状态</label>
            <select v-model="filters.status" class="ul-input ul-select">
              <option value="">全部</option>
              <option value="enabled">启用</option>
              <option value="disabled">禁用</option>
            </select>
          </div>
        </div>
        <div class="ul-filter-footer">
          <span></span>
          <div style="display: flex; gap: 8px">
            <button class="btn btn-default btn-sm" @click="resetFilter">重置</button>
            <button class="btn btn-primary btn-sm" @click="showToast('已按条件筛选', 'info')">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              查询
            </button>
          </div>
        </div>
      </div>

      <div class="glass-card table-card">
        <div class="table-header">
          <div class="table-title">权益列表<span class="table-count">共 {{ filteredRows.length }} 条</span></div>
          <button class="btn btn-primary btn-sm" @click="openCreate">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            新增
          </button>
        </div>
        <div class="bfc-table-wrap">
          <table class="bfc-table">
            <thead>
              <tr>
                <th>身份</th>
                <th>权益内容</th>
                <th>状态</th>
                <th>操作人</th>
                <th>操作时间</th>
                <th class="col-action" style="text-align: center">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in filteredRows" :key="row.id" class="ul-row">
                <td>
                  <span class="tag tag-blue" style="font-size: 12px">{{ row.identityLabel }}</span>
                </td>
                <td>
                  <div class="bfc-content-cell">{{ row.content }}</div>
                </td>
                <td>
                  <span class="badge" :class="row.enabled ? 'badge-success' : 'badge-gray'">{{ row.enabled ? '启用' : '禁用' }}</span>
                </td>
                <td><span class="ul-mono" style="font-size: 11px; color: var(--text-muted)">{{ row.operator }}</span></td>
                <td class="ul-muted" style="font-size: 12px">{{ row.operateTime }}</td>
                <td class="col-action">
                  <div class="action-btns" style="justify-content: center">
                    <button type="button" class="action-btn edit" title="编辑" @click="openEdit(row)">编辑</button>
                    <button type="button" class="action-btn delete" title="删除" @click="confirmDelete(row)">删除</button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredRows.length === 0">
                <td colspan="6"><div class="ul-empty" style="padding: 32px; text-align: center">暂无数据</div></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="ul-overlay" :class="{ show: editVisible }" @click.self="editVisible = false" />
    <div class="ul-modal" :class="{ show: editVisible }" style="width: 520px">
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-bottom: 1px solid var(--border)">
        <div style="font-size: 15px; font-weight: 700">{{ editTarget ? '编辑权益' : '新增权益' }}</div>
        <button class="ul-icon-btn" @click="editVisible = false"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <div style="padding: 20px; display: flex; flex-direction: column; gap: 14px">
        <div class="ul-form-group">
          <label class="ul-label">身份 <span style="color: var(--danger)">*</span></label>
          <select v-model="editForm.identityKey" class="ul-input ul-select" :disabled="!!editTarget">
            <option v-for="opt in identityOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
        </div>
        <div class="ul-form-group">
          <label class="ul-label">权益内容 <span style="color: var(--danger)">*</span></label>
          <textarea v-model="editForm.content" class="bfc-textarea" rows="4" placeholder="说明该身份下的权益项、使用规则等"></textarea>
        </div>
        <div class="ul-form-group">
          <label class="ul-label">状态</label>
          <div style="display: flex; gap: 16px; align-items: center; margin-top: 4px">
            <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 13px"><input v-model="editForm.enabled" type="radio" :value="true" style="accent-color: var(--primary)"> 启用</label>
            <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 13px"><input v-model="editForm.enabled" type="radio" :value="false" style="accent-color: var(--primary)"> 禁用</label>
          </div>
        </div>
      </div>
      <div style="display: flex; justify-content: flex-end; gap: 10px; padding: 14px 20px; border-top: 1px solid var(--border)">
        <button class="btn btn-default" @click="editVisible = false">取消</button>
        <button class="btn btn-primary" :disabled="!canSave" @click="doSave">{{ editTarget ? '保存' : '新增' }}</button>
      </div>
    </div>

    <div v-if="deleteTarget" class="ul-overlay show" @click.self="deleteTarget = null" />
    <div v-if="deleteTarget" class="ul-modal show" style="width: 400px">
      <div style="padding: 20px">
        <p style="font-size: 14px; line-height: 1.5; color: var(--text-primary)">确认删除该条「{{ deleteTarget.identityLabel }}」权益配置？此操作不可撤销。</p>
        <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 20px">
          <button class="btn btn-default" @click="deleteTarget = null">取消</button>
          <button class="btn btn-danger" @click="doDelete">确认删除</button>
        </div>
      </div>
    </div>

    <div class="ul-toast-container">
      <div v-for="t in toasts" :key="t.id" class="ul-toast" :class="t.type">
        <span style="flex: 1; color: var(--text-primary); line-height: 1.5">{{ t.msg }}</span>
        <button style="background: none; border: none; cursor: pointer; color: var(--text-muted)" @click="removeToast(t.id)">✕</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

type IdentityKey = 'normal' | 'vip' | 'leader'

interface BenefitRow {
  id: number
  identityKey: IdentityKey
  identityLabel: string
  content: string
  enabled: boolean
  operator: string
  operateTime: string
}

interface ToastItem { id: number; msg: string; type: string }

const identityOptions: { value: IdentityKey; label: string }[] = [
  { value: 'normal', label: '普通会员' },
  { value: 'vip', label: '高级会员' },
  { value: 'leader', label: '团长' },
]

const filters = ref({ identity: '' as '' | IdentityKey, status: '' as '' | 'enabled' | 'disabled' })

const rows = ref<BenefitRow[]>([
  { id: 1, identityKey: 'normal', identityLabel: '普通会员', content: '基础任务参与、标准收益结算、活动通知推送。', enabled: true, operator: 'admin_01', operateTime: '2026-01-10 12:00' },
  { id: 2, identityKey: 'vip', identityLabel: '高级会员', content: '高级项目接入、更高收益分成、专属运营通道。', enabled: true, operator: 'admin_01', operateTime: '2026-01-12 15:20' },
  { id: 3, identityKey: 'leader', identityLabel: '团长', content: '团队分润配置、下游数据看板、团长活动激励。', enabled: true, operator: 'admin_02', operateTime: '2026-01-15 09:30' },
])

const filteredRows = computed(() => {
  return rows.value.filter((r) => {
    if (filters.value.identity && r.identityKey !== filters.value.identity) return false
    if (filters.value.status === 'enabled' && !r.enabled) return false
    if (filters.value.status === 'disabled' && r.enabled) return false
    return true
  })
})

const editVisible = ref(false)
const editTarget = ref<BenefitRow | null>(null)
const editForm = ref({ identityKey: 'normal' as IdentityKey, content: '', enabled: true })
const deleteTarget = ref<BenefitRow | null>(null)

const toasts = ref<ToastItem[]>([])
let toastId = 0
let rowUid = 100

const canSave = computed(() => {
  const t = editForm.value.content.trim()
  return t.length > 0
})

function labelForKey(k: IdentityKey) {
  return identityOptions.find((o) => o.value === k)?.label ?? k
}

function resetFilter() {
  filters.value = { identity: '', status: '' }
}

function openCreate() {
  editTarget.value = null
  editForm.value = { identityKey: 'normal', content: '', enabled: true }
  editVisible.value = true
}

function openEdit(row: BenefitRow) {
  editTarget.value = row
  editForm.value = { identityKey: row.identityKey, content: row.content, enabled: row.enabled }
  editVisible.value = true
}

function doSave() {
  const content = editForm.value.content.trim()
  if (!content) return
  if (editTarget.value) {
    const row = editTarget.value
    row.identityKey = editForm.value.identityKey
    row.identityLabel = labelForKey(editForm.value.identityKey)
    row.content = content
    row.enabled = editForm.value.enabled
    row.operateTime = new Date().toISOString().slice(0, 16).replace('T', ' ')
    showToast('保存成功', 'success')
  } else {
    const k = editForm.value.identityKey
    rows.value.push({
      id: ++rowUid,
      identityKey: k,
      identityLabel: labelForKey(k),
      content,
      enabled: editForm.value.enabled,
      operator: 'current_admin',
      operateTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
    })
    showToast('新增成功', 'success')
  }
  editVisible.value = false
}

function confirmDelete(row: BenefitRow) {
  deleteTarget.value = row
}

function doDelete() {
  if (!deleteTarget.value) return
  const id = deleteTarget.value.id
  rows.value = rows.value.filter((r) => r.id !== id)
  deleteTarget.value = null
  showToast('删除成功', 'success')
}

function showToast(msg: string, type: 'success' | 'info' | 'error' = 'info') {
  const id = ++toastId
  toasts.value.push({ id, msg, type })
  setTimeout(() => removeToast(id), 3000)
}

function removeToast(id: number) {
  toasts.value = toasts.value.filter((t) => t.id !== id)
}
</script>

<style>
.bfc-wrap { min-height: 100%; }
.bfc-table-wrap { overflow-x: auto; }
.bfc-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.bfc-table th {
  padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 600; color: var(--text-muted);
  background: var(--surface-hover); border-bottom: 1px solid var(--border); white-space: nowrap;
}
.bfc-table td { padding: 12px 14px; border-bottom: 1px solid var(--border); color: var(--text-primary); vertical-align: top; }
.bfc-table tr:last-child td { border-bottom: none; }
.bfc-table .ul-row:hover td { background: rgba(37, 99, 235, 0.03); }
.bfc-content-cell { font-size: 13px; line-height: 1.5; color: var(--text-secondary); max-width: 420px; }
.bfc-textarea {
  width: 100%; min-height: 96px; padding: 8px 10px; font-size: 13px; font-family: inherit;
  color: var(--text-primary); background: var(--surface); border: 1px solid var(--border); border-radius: 6px; outline: none; resize: vertical; transition: var(--transition);
}
.bfc-textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
</style>
