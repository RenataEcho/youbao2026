<template>
  <div class="in-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">用户通知</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">站内信通知</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">站内信通知</h1>
          <p class="page-desc">管理平台向用户发送的站内消息，支持全量/身份组/指定用户推送</p>
        </div>
        <button class="btn btn-primary btn-sm" @click="openEdit(null)">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          新增
        </button>
      </div>

      <!-- 筛选 -->
      <div class="glass-card bl-filter">
        <div class="ul-filter-grid">
          <div class="ul-form-group"><label class="ul-label">标题</label><input v-model="f.title" class="ul-input" placeholder="模糊搜索标题"></div>
          <div class="ul-form-group">
            <label class="ul-label">消息类型</label>
            <select v-model="f.msgType" class="ul-input ul-select" @change="f.notifyType=''">
              <option value="">全部</option>
              <option value="重要信息">重要信息</option>
              <option value="任务信息">任务信息</option>
              <option value="财务信息">财务信息</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">通知类型</label>
            <select v-model="f.notifyType" class="ul-input ul-select">
              <option value="">全部</option>
              <template v-if="f.msgType==='重要信息'">
                <option>重要通知</option><option>站内信</option><option>封号通知</option>
              </template>
              <template v-else-if="f.msgType==='任务信息'">
                <option>任务通知</option>
              </template>
              <template v-else-if="f.msgType==='财务信息'">
                <option>结算通知</option><option>到账通知</option>
              </template>
              <template v-else>
                <option>重要通知</option><option>站内信</option><option>封号通知</option>
                <option>任务通知</option><option>结算通知</option><option>到账通知</option>
              </template>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">阅读状态</label>
            <select v-model="f.readStatus" class="ul-input ul-select">
              <option value="">全部</option><option value="已读">已读</option><option value="未读">未读</option>
            </select>
          </div>
          <template v-if="filterExpanded">
            <div class="ul-form-group">
              <label class="ul-label">消息状态</label>
              <select v-model="f.msgStatus" class="ul-input ul-select">
                <option value="">全部</option><option value="显示">显示</option><option value="隐藏">隐藏</option><option value="已删除">已删除</option>
              </select>
            </div>
            <div class="ul-form-group">
              <label class="ul-label">用户范围</label>
              <select v-model="f.userScope" class="ul-input ul-select">
                <option value="">全部</option><option value="全量用户">全量用户</option><option value="指定身份组">指定身份组</option><option value="指定用户">指定用户</option>
              </select>
            </div>
            <div class="ul-form-group"><label class="ul-label">操作人</label><input v-model="f.operator" class="ul-input" placeholder="管理员ID"></div>
            <div class="ul-form-group"><label class="ul-label">创建开始时间</label><input v-model="f.startTime" type="date" class="ul-input"></div>
            <div class="ul-form-group"><label class="ul-label">创建结束时间</label><input v-model="f.endTime" type="date" class="ul-input"></div>
          </template>
        </div>
        <div class="ul-filter-footer">
          <button class="ul-expand-btn" :class="{ expanded: filterExpanded }" @click="filterExpanded = !filterExpanded">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            {{ filterExpanded ? '收起筛选' : '展开更多筛选' }}
          </button>
          <div style="display:flex;gap:8px">
            <button class="btn btn-default btn-sm" @click="resetFilter">重置</button>
            <button class="btn btn-primary btn-sm" @click="fetchList(1)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              查询
            </button>
          </div>
        </div>
      </div>

      <!-- 数据表 -->
      <div class="glass-card table-card">
        <div class="table-header">
          <div class="table-title">站内信通知<span class="table-count">共 {{ total.toLocaleString() }} 条</span></div>
        </div>
        <div class="in-table-wrap">
          <table class="in-table">
            <colgroup>
              <col style="width:60px">
              <col style="min-width:180px">
              <col style="min-width:90px">
              <col style="min-width:90px">
              <col style="min-width:70px">
              <col style="min-width:70px">
              <col style="min-width:150px">
              <col style="min-width:80px">
              <col style="min-width:120px">
              <col style="width:90px">
            </colgroup>
            <thead>
              <tr>
                <th>序号</th>
                <th>标题</th>
                <th>消息类型</th>
                <th>通知类型</th>
                <th>阅读状态</th>
                <th>消息状态</th>
                <th>用户范围</th>
                <th>操作人</th>
                <th>创建时间</th>
                <th class="col-action" style="text-align:center">操作</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="loading">
                <tr v-for="i in 10" :key="i"><td colspan="10"><div class="ul-skeleton"></div></td></tr>
              </template>
              <template v-else-if="list.length===0">
                <tr><td colspan="10"><div class="ul-empty">暂无站内信记录</div></td></tr>
              </template>
              <template v-else>
                <tr v-for="row in list" :key="row.id" class="ul-row">
                  <td class="ul-muted" style="font-size:12px;text-align:center">{{ row.id }}</td>
                  <td style="font-size:13px;font-weight:500;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" :title="row.title">{{ row.title }}</td>
                  <td><span class="tag" :class="msgTypeClass(row.msgType)" style="font-size:10px">{{ row.msgType }}</span></td>
                  <td><span class="tag tag-gray" style="font-size:10px">{{ row.notifyType }}</span></td>
                  <td><span class="badge" :class="row.readStatus==='已读'?'badge-success':'badge-warning'" style="font-size:10px">{{ row.readStatus }}</span></td>
                  <td><span class="badge" :class="{显示:'badge-success',隐藏:'badge-gray',已删除:'badge-danger'}[row.msgStatus]||'badge-gray'" style="font-size:10px">{{ row.msgStatus }}</span></td>
                  <td style="font-size:12px">
                    <span v-if="row.userScope==='全量用户'" class="tag tag-blue" style="font-size:10px">全量</span>
                    <span v-else-if="row.userScope==='指定身份组'" class="tag tag-purple" style="font-size:10px">{{ row.scopeValue }}</span>
                    <span v-else class="ul-mono" style="font-size:11px;color:var(--text-secondary)">{{ row.scopeValue }}</span>
                  </td>
                  <td><span class="ul-mono" style="font-size:11px;color:var(--text-muted)">{{ row.operator }}</span></td>
                  <td class="ul-muted" style="font-size:11px">{{ row.createTime }}</td>
                  <td class="col-action">
                    <div class="action-btns">
                      <button type="button" class="action-btn edit" title="编辑" @click="openEdit(row)">编辑</button>
                      <button type="button" class="action-btn delete" title="删除" @click="confirmDelete(row)">删除</button>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <div class="ul-pagination">
          <span class="ul-page-info">共 <strong>{{ total.toLocaleString() }}</strong> 条，第 <strong>{{ page }}</strong>/<strong>{{ totalPages }}</strong> 页</span>
          <div style="display:flex;align-items:center;gap:4px">
            <button class="ul-pg-btn" :disabled="page<=1" @click="fetchList(1)">«</button>
            <button class="ul-pg-btn" :disabled="page<=1" @click="fetchList(page-1)">‹</button>
            <template v-for="p in paginationPages" :key="p">
              <button v-if="p!=='...'" class="ul-pg-btn" :class="{active:p===page}" @click="fetchList(Number(p))">{{ p }}</button>
              <span v-else style="padding:0 4px;color:var(--text-muted)">...</span>
            </template>
            <button class="ul-pg-btn" :disabled="page>=totalPages" @click="fetchList(page+1)">›</button>
            <button class="ul-pg-btn" :disabled="page>=totalPages" @click="fetchList(totalPages)">»</button>
          </div>
          <div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-muted)">
            每页 <select class="ul-pg-size" @change="(e)=>{pageSize=Number((e.target as HTMLSelectElement).value);fetchList(1)}"><option value="10">10</option><option value="20" selected>20</option><option value="50">50</option></select> 条
          </div>
        </div>
      </div>
    </div>

    <!-- 新增/编辑弹窗 -->
    <div class="ul-overlay" :class="{show:editVisible}" @click.self="()=>{}"></div>
    <div class="ul-modal" :class="{show:editVisible}" style="width:580px">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid var(--border)">
        <div style="font-size:15px;font-weight:700">{{ editTarget?'编辑站内信':'新增站内信' }}</div>
        <button class="ul-icon-btn" @click="editVisible=false"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <div style="padding:20px;display:flex;flex-direction:column;gap:14px">
        <div class="ul-form-group"><label class="ul-label">标题 <span style="color:var(--danger)">*</span></label><input v-model="editForm.title" class="ul-input" placeholder="请输入标题（最多100字）" maxlength="100"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="ul-form-group">
            <label class="ul-label">消息类型 <span style="color:var(--danger)">*</span></label>
            <select v-model="editForm.msgType" class="ul-input ul-select" :disabled="!!editTarget" @change="editForm.notifyType=''" :style="editTarget?{opacity:.6,cursor:'not-allowed'}:{}">
              <option value="">请选择</option>
              <option>重要信息</option><option>任务信息</option><option>财务信息</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">通知类型 <span style="color:var(--danger)">*</span></label>
            <select v-model="editForm.notifyType" class="ul-input ul-select" :disabled="!!editTarget" :style="editTarget?{opacity:.6,cursor:'not-allowed'}:{}">
              <option value="">请选择</option>
              <template v-if="editForm.msgType==='重要信息'"><option>重要通知</option><option>站内信</option><option>封号通知</option></template>
              <template v-else-if="editForm.msgType==='任务信息'"><option>任务通知</option></template>
              <template v-else-if="editForm.msgType==='财务信息'"><option>结算通知</option><option>到账通知</option></template>
            </select>
          </div>
        </div>
        <div class="ul-form-group">
          <label class="ul-label">用户范围 <span style="color:var(--danger)">*</span></label>
          <select v-model="editForm.userScope" class="ul-input ul-select" :disabled="!!editTarget" :style="editTarget?{opacity:.6,cursor:'not-allowed'}:{}" style="max-width:200px">
            <option value="">请选择</option>
            <option>全量用户</option><option>指定身份组</option><option>指定用户</option>
          </select>
        </div>
        <div v-if="editForm.userScope==='指定身份组'&&!editTarget" class="ul-form-group">
          <label class="ul-label">身份组 <span style="color:var(--danger)">*</span></label>
          <select v-model="editForm.scopeValue" class="ul-input ul-select" style="max-width:200px">
            <option value="">请选择</option><option>普通会员</option><option>高级会员</option><option>核心高级会员</option>
          </select>
        </div>
        <div v-if="editForm.userScope==='指定用户'&&!editTarget" class="ul-form-group">
          <label class="ul-label">用户ID <span style="color:var(--danger)">*</span></label>
          <textarea v-model="editForm.scopeValue" class="ul-input" rows="3" style="height:auto;resize:vertical" placeholder="每行一个用户ID，系统会拆分为多条独立记录"></textarea>
        </div>
        <div class="ul-form-group">
          <label class="ul-label">消息状态 <span style="color:var(--danger)">*</span></label>
          <select v-model="editForm.msgStatus" class="ul-input ul-select" style="max-width:160px">
            <option>显示</option><option>隐藏</option>
          </select>
        </div>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:10px;padding:14px 20px;border-top:1px solid var(--border)">
        <button class="btn btn-default" @click="editVisible=false">取消</button>
        <button class="btn btn-primary" :disabled="!editForm.title||!editForm.msgType||!editForm.notifyType||!editForm.userScope" @click="doSave">{{ editTarget?'保存':'确认新增' }}</button>
      </div>
    </div>

    <!-- 删除确认弹窗 -->
    <div class="ul-overlay" :class="{show:deleteVisible}" @click.self="()=>{}"></div>
    <div class="ul-modal" :class="{show:deleteVisible}" style="width:420px">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid var(--border)">
        <div style="font-size:15px;font-weight:700;color:var(--danger)">确认删除</div>
        <button class="ul-icon-btn" @click="deleteVisible=false"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <div style="padding:20px;font-size:13px;color:var(--text-secondary);line-height:1.6">确认删除该条站内信通知？此操作不可撤销。</div>
      <div style="display:flex;justify-content:flex-end;gap:10px;padding:14px 20px;border-top:1px solid var(--border)">
        <button class="btn btn-default" @click="deleteVisible=false">取消</button>
        <button class="btn btn-danger" @click="doDelete">确认删除</button>
      </div>
    </div>

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

interface InboxItem {
  id:number; title:string; msgType:string; notifyType:string
  readStatus:string; msgStatus:string; userScope:string; scopeValue:string
  operator:string; createTime:string
}
interface Toast { id:number; msg:string; type:string }

const loading = ref(false)
const list = ref<InboxItem[]>([])
const total = ref(0); const page = ref(1); const pageSize = ref(20)
const filterExpanded = ref(false)
const editVisible = ref(false); const editTarget = ref<InboxItem|null>(null)
const deleteVisible = ref(false); const deleteTarget = ref<InboxItem|null>(null)
const toasts = ref<Toast[]>([]); let toastId = 0
const f = ref({ title:'', msgType:'', notifyType:'', readStatus:'', msgStatus:'', userScope:'', operator:'', startTime:'', endTime:'' })
const editForm = ref({ title:'', msgType:'', notifyType:'', userScope:'', scopeValue:'', msgStatus:'显示' })

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
const paginationPages = computed(() => {
  const t=totalPages.value,c=page.value; const p:(number|string)[]=[]
  if(t<=7){for(let i=1;i<=t;i++)p.push(i);return p}
  p.push(1);if(c>3)p.push('...')
  for(let i=Math.max(2,c-1);i<=Math.min(t-1,c+1);i++)p.push(i)
  if(c<t-2)p.push('...');p.push(t);return p
})

const MSG_TYPES = ['重要信息','任务信息','财务信息']
const NOTIFY_MAP: Record<string,string[]> = {
  '重要信息':['重要通知','站内信','封号通知'],
  '任务信息':['任务通知'],
  '财务信息':['结算通知','到账通知']
}
const READ_STATUSES = ['已读','未读']
const MSG_STATUSES = ['显示','隐藏','已删除']
const SCOPES: Array<'全量用户'|'指定身份组'|'指定用户'> = ['全量用户','指定身份组','指定用户','全量用户','全量用户']
const SCOPE_VALS = ['','核心高级会员','U10024','','']
const TITLES = ['重要安全通知：请及时完成实名认证','您有新的任务待完成，请查收','本月收益已结算，请查看钱包余额','账号封禁通知：违规行为处理结果','项目奖励已到账，请查收']

function mockList(n=20): InboxItem[] {
  return Array.from({length:n},(_,i)=>{
    const idx = (page.value-1)*pageSize.value+i+1
    const mt = MSG_TYPES[idx%3]
    const nts = NOTIFY_MAP[mt]
    const d = new Date(1681000000000+idx*3600000*6)
    const fmt = (d:Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
    return {
      id:idx, title:TITLES[idx%5], msgType:mt, notifyType:nts[idx%nts.length],
      readStatus:READ_STATUSES[idx%2], msgStatus:MSG_STATUSES[idx%3],
      userScope:SCOPES[idx%5], scopeValue:SCOPE_VALS[idx%5],
      operator:`admin0${(idx%3)+1}`, createTime:fmt(d)
    }
  })
}
function msgTypeClass(t:string) {
  return {重要信息:'tag-danger',任务信息:'tag-blue',财务信息:'tag-green'}[t]||'tag-gray'
}

async function fetchList(p=1) {
  loading.value=true; page.value=p
  await new Promise(r=>setTimeout(r,200))
  list.value=mockList(pageSize.value); total.value=3560; loading.value=false
}
function resetFilter() { f.value={title:'',msgType:'',notifyType:'',readStatus:'',msgStatus:'',userScope:'',operator:'',startTime:'',endTime:''}; fetchList(1) }
function openEdit(row:InboxItem|null) {
  editTarget.value=row
  if(row) editForm.value={title:row.title,msgType:row.msgType,notifyType:row.notifyType,userScope:row.userScope,scopeValue:row.scopeValue,msgStatus:row.msgStatus}
  else editForm.value={title:'',msgType:'',notifyType:'',userScope:'',scopeValue:'',msgStatus:'显示'}
  editVisible.value=true
}
function doSave() { editVisible.value=false; showToast(editTarget.value?'编辑成功':'新增成功','success'); fetchList(page.value) }
function confirmDelete(row:InboxItem) { deleteTarget.value=row; deleteVisible.value=true }
function doDelete() { list.value=list.value.filter(r=>r.id!==deleteTarget.value?.id); deleteVisible.value=false; showToast('删除成功','success') }
function showToast(msg:string,type='info') { const id=++toastId;toasts.value.push({id,msg,type});setTimeout(()=>removeToast(id),3000) }
function removeToast(id:number) { toasts.value=toasts.value.filter(t=>t.id!==id) }
onMounted(()=>fetchList())
</script>

<style>
.in-wrap { min-height:100%; }
.in-table-wrap { overflow-x:auto; }
.in-table { width:100%; border-collapse:collapse; font-size:13px; white-space:nowrap; }
.in-table th { padding:10px 12px; text-align:left; font-size:11px; font-weight:600; color:var(--text-muted); background:var(--surface-hover); border-bottom:1px solid var(--border); }
.in-table td { padding:10px 12px; border-bottom:1px solid var(--border); color:var(--text-primary); vertical-align:middle; }
.in-table tr:last-child td { border-bottom:none; }
.in-table .ul-row:hover td { background:rgba(37,99,235,.03); }
</style>
