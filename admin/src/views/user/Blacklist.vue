<template>
  <div class="bl-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">用户管理</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">黑名单</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <div ref="prdTipAnchorRef" class="page-header-title-anchor">
            <h1 class="page-title">黑名单管理</h1>
          </div>
          <p class="page-desc">管理平台封禁用户，支持多维度禁止类型配置与站内信通知</p>
        </div>
        <button class="btn btn-primary" @click="openAdd">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          新增黑名单
        </button>
      </div>

      <!-- 筛选 -->
      <div ref="prdTipFilterRef" class="glass-card bl-filter">
        <div class="ul-filter-grid">
          <div class="ul-form-group">
            <label class="ul-label">用户ID</label>
            <input v-model="filters.userId" type="text" class="ul-input" placeholder="输入用户ID">
          </div>
          <div class="ul-form-group">
            <label class="ul-label">禁止类型</label>
            <select v-model="filters.type" class="ul-input ul-select">
              <option value="">全部类型</option>
              <option value="login">禁止登录</option>
              <option value="keyword">禁止题词</option>
              <option value="project_withdraw">禁止项目钱包提现</option>
              <option value="dividend_withdraw">禁止分红钱包提现</option>
              <option value="reward_withdraw">禁止奖励钱包提现</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">是否通知</label>
            <select v-model="filters.notify" class="ul-input ul-select">
              <option value="">全部</option>
              <option value="yes">是</option>
              <option value="no">否</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">操作人</label>
            <input v-model="filters.operator" type="text" class="ul-input" placeholder="输入操作人ID">
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
            黑名单列表
            <span class="table-count">共 {{ total }} 条</span>
          </div>
        </div>
        <div class="ul-table-wrap">
          <table class="ul-table" style="table-layout:auto">
            <thead>
              <tr>
                <th style="width:52px">序号</th>
                <th style="min-width:100px">用户ID</th>
                <th style="min-width:260px">禁止类型</th>
                <th style="width:80px">是否通知</th>
                <th style="min-width:180px">通知内容</th>
                <th style="min-width:120px">备注</th>
                <th style="width:90px">操作人</th>
                <th style="min-width:140px">创建时间</th>
                <th ref="prdTipOpsRef" class="col-action" style="width:88px;text-align:center">操作</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="loading">
                <tr v-for="i in 6" :key="i"><td colspan="9"><div class="ul-skeleton"></div></td></tr>
              </template>
              <template v-else-if="list.length === 0">
                <tr><td colspan="9">
                  <div class="ul-empty">
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                    <div style="font-size:14px;font-weight:600;color:var(--text-secondary);margin:8px 0 4px">暂无黑名单记录</div>
                  </div>
                </td></tr>
              </template>
              <template v-else>
                <tr v-for="(row, idx) in list" :key="row.id" class="ul-row">
                  <td>{{ (page-1)*pageSize + idx + 1 }}</td>
                  <td><span class="ul-mono">{{ row.userId }}</span></td>
                  <td>
                    <div style="display:flex;flex-wrap:wrap;gap:3px">
                      <span v-for="t in row.types" :key="t" class="tag tag-red" style="font-size:10.5px">{{ BAN_LABELS[t] }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="badge" :class="row.notify ? 'badge-info' : 'badge-gray'">{{ row.notify ? '是' : '否' }}</span>
                  </td>
                  <td><span class="ul-muted">{{ row.notifyContent || '—' }}</span></td>
                  <td><span class="ul-muted">{{ row.remark || '—' }}</span></td>
                  <td><span class="ul-muted">{{ row.operator }}</span></td>
                  <td><span class="ul-muted">{{ row.createdAt }}</span></td>
                  <td class="col-action">
                    <div class="action-btns">
                      <button type="button" class="action-btn edit" title="编辑" @click="openEdit(row)">编辑</button>
                      <button type="button" class="action-btn delete" title="移除" @click="confirmRemove(row)">移除</button>
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
            每页 <select class="ul-pg-size" @change="(e)=>{pageSize=Number((e.target as HTMLSelectElement).value);fetchList(1)}">
              <option value="10">10</option><option value="20" selected>20</option><option value="50">50</option>
            </select> 条
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

    <!-- 新增/编辑弹窗 -->
    <div class="ul-overlay" :class="{show:formVisible}" @click="formVisible=false"></div>
    <div class="ul-modal bl-modal" :class="{show:formVisible}">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--border)">
        <div style="font-size:15px;font-weight:700;color:var(--text-primary);display:flex;align-items:center;gap:7px">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
          {{ formMode === 'add' ? '新增黑名单' : '编辑黑名单' }}
        </div>
        <button class="ul-icon-btn" @click="formVisible=false">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div style="padding:20px;display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div class="ul-form-group">
          <label class="ul-label">用户ID <span style="color:var(--danger)">*</span></label>
          <input v-model="form.userId" type="text" class="ul-input" :disabled="formMode==='edit'" placeholder="输入被封禁的用户ID">
        </div>
        <div class="ul-form-group">
          <label class="ul-label">是否加入站内信通知</label>
          <div style="display:flex;gap:16px;align-items:center;padding:6px 0">
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:13px"><input type="radio" v-model="form.notify" :value="true"> 是</label>
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:13px"><input type="radio" v-model="form.notify" :value="false"> 否</label>
          </div>
        </div>
        <div style="grid-column:1/-1" class="ul-form-group">
          <label class="ul-label">禁止类型 <span style="color:var(--danger)">*</span></label>
          <div style="display:flex;flex-wrap:wrap;gap:10px;padding:4px 0">
            <label v-for="(label, val) in BAN_LABELS" :key="val" style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:13px">
              <input type="checkbox" :value="val" v-model="form.types" style="accent-color:var(--primary)"> {{ label }}
            </label>
          </div>
        </div>
        <template v-if="form.notify">
          <div class="ul-form-group">
            <label class="ul-label">通知类型</label>
            <select v-model="form.notifyType" class="ul-input ul-select">
              <option value="">请选择通知类型</option>
              <option value="important">重要通知</option>
              <option value="inbox">站内信</option>
              <option value="ban">封号通知</option>
            </select>
          </div>
          <div style="grid-column:1/-1" class="ul-form-group">
            <label class="ul-label">通知内容</label>
            <textarea v-model="form.notifyContent" class="ul-textarea" rows="3" placeholder="请输入通知内容"></textarea>
          </div>
        </template>
        <div style="grid-column:1/-1" class="ul-form-group">
          <label class="ul-label">备注</label>
          <textarea v-model="form.remark" class="ul-textarea" rows="3" placeholder="请输入备注信息（选填）"></textarea>
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

    <!-- 移除确认 -->
    <div class="ul-overlay" :class="{show:removeVisible}" @click="removeVisible=false"></div>
    <div class="ul-modal" :class="{show:removeVisible}">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--border)">
        <div style="font-size:15px;font-weight:700;color:var(--danger)">确认移除</div>
        <button class="ul-icon-btn" @click="removeVisible=false">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div style="padding:20px">
        <p style="font-size:13px;color:var(--text-secondary);line-height:1.6">确认将用户 <strong>{{ removeTarget?.userId }}</strong> 从黑名单中移除？</p>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:10px;padding:14px 20px;border-top:1px solid var(--border)">
        <button class="btn btn-default" @click="removeVisible=false">取消</button>
        <button class="btn btn-danger" @click="doRemove">确认移除</button>
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
import PrdTipMarker from '@/components/prd/PrdTipMarker.vue'
import { useAdminPrdTips } from '@/composables/useAdminPrdTips'
import { ref, computed, onMounted } from 'vue'

const { bundle, opsTipId, prdTipAnchorRef, prdTipFilterRef, prdTipOpsRef } = useAdminPrdTips()

interface BlackItem {
  id: number; userId: string; types: string[]; notify: boolean
  notifyContent: string; remark: string; operator: string; createdAt: string
  notifyType?: string
}
interface Toast { id: number; msg: string; type: 'success'|'error'|'info' }

const BAN_LABELS: Record<string,string> = {
  login: '禁止登录', keyword: '禁止题词',
  project_withdraw: '禁止项目钱包提现',
  dividend_withdraw: '禁止分红钱包提现',
  reward_withdraw: '禁止奖励钱包提现',
}

const loading = ref(false)
const list = ref<BlackItem[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)
const filters = ref({ userId: '', type: '', notify: '', operator: '' })
const formVisible = ref(false)
const formMode = ref<'add'|'edit'>('add')
const form = ref({ id: 0, userId: '', types: [] as string[], notify: false, notifyType: '', notifyContent: '', remark: '' })
const removeVisible = ref(false)
const removeTarget = ref<BlackItem|null>(null)
const toasts = ref<Toast[]>([])
let toastId = 0

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
const paginationPages = computed(() => {
  const arr: number[] = []; const t = totalPages.value; const c = page.value
  const s = Math.max(1, c-2); const e = Math.min(t, c+2)
  for (let i=s; i<=e; i++) arr.push(i)
  return arr
})

function mockData(): BlackItem[] {
  return [
    { id:1, userId:'U10001', types:['login','keyword'], notify:true, notifyContent:'您因违规操作已被封禁，请联系客服。', remark:'多次违规', operator:'Admin', createdAt:'2026-04-01 10:00:00', notifyType:'ban' },
    { id:2, userId:'U10025', types:['project_withdraw'], notify:false, notifyContent:'', remark:'涉嫌欺诈', operator:'Admin', createdAt:'2026-04-03 14:22:00' },
    { id:3, userId:'U10088', types:['dividend_withdraw','reward_withdraw'], notify:true, notifyContent:'您的提现权限已被暂停。', remark:'', operator:'ops001', createdAt:'2026-04-10 09:11:00', notifyType:'inbox' },
    { id:4, userId:'U10120', types:['login'], notify:false, notifyContent:'', remark:'测试封禁', operator:'Admin', createdAt:'2026-04-15 17:45:00' },
    { id:5, userId:'U10199', types:['keyword','project_withdraw','dividend_withdraw'], notify:true, notifyContent:'您的账号因违规已被限制操作。', remark:'大额异常', operator:'Admin', createdAt:'2026-04-20 11:30:00', notifyType:'important' },
    { id:6, userId:'U10234', types:['reward_withdraw'], notify:false, notifyContent:'', remark:'', operator:'ops002', createdAt:'2026-04-24 16:08:00' },
  ]
}

async function fetchList(p=1) {
  loading.value = true; page.value = p
  await new Promise(r => setTimeout(r, 220))
  const data = mockData()
  list.value = data; total.value = data.length; loading.value = false
}

function resetFilter() {
  filters.value = { userId:'', type:'', notify:'', operator:'' }; fetchList(1)
}
function openAdd() {
  formMode.value = 'add'
  form.value = { id:0, userId:'', types:[], notify:false, notifyType:'', notifyContent:'', remark:'' }
  formVisible.value = true
}
function openEdit(row: BlackItem) {
  formMode.value = 'edit'
  form.value = { id:row.id, userId:row.userId, types:[...row.types], notify:row.notify, notifyType:row.notifyType||'', notifyContent:row.notifyContent, remark:row.remark }
  formVisible.value = true
}
function submitForm() {
  if (!form.value.userId) { showToast('用户ID不能为空', 'error'); return }
  if (!form.value.types.length) { showToast('请至少选择一种禁止类型', 'error'); return }
  formVisible.value = false; showToast(formMode.value==='add' ? '新增成功' : '修改成功', 'success')
  fetchList(1)
}
function confirmRemove(row: BlackItem) { removeTarget.value = row; removeVisible.value = true }
function doRemove() {
  list.value = list.value.filter(r => r.id !== removeTarget.value!.id)
  total.value--; removeVisible.value = false; showToast('已移除', 'success')
}
function showToast(msg: string, type: Toast['type']='info') {
  const id = ++toastId; toasts.value.push({ id, msg, type })
  setTimeout(() => removeToast(id), 3000)
}
function removeToast(id: number) { toasts.value = toasts.value.filter(t => t.id !== id) }

onMounted(() => fetchList(1))
</script>

<style>
.bl-wrap { min-height: 100%; }
.bl-filter { padding: 16px 18px 14px; margin-bottom: 14px; }
.bl-modal { width: 640px !important; }
.ul-textarea {
  width: 100%; padding: 8px 9px; font-size: 12px; font-family: inherit;
  color: var(--text-primary); background: var(--surface);
  border: 1px solid var(--border); border-radius: 6px; outline: none;
  resize: vertical; transition: var(--transition);
}
.ul-textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(37,99,235,.1); }
</style>
