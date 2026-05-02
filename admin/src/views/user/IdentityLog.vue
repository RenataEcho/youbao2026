<template>
  <div class="il-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">用户体系</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">用户等级日志</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div style="display:flex;align-items:center;gap:12px">
          <div>
            <h1 class="page-title" style="display:flex;align-items:center;gap:10px">
              用户等级日志
              <span v-if="pendingCount>0" class="badge badge-warning" style="font-size:12px;padding:2px 10px">待审核 {{ pendingCount }} 条</span>
            </h1>
            <p class="page-desc">记录用户等级 LV1–LV10 的全部变更历史，支持审核操作</p>
          </div>
        </div>
        <button class="btn btn-primary btn-sm" @click="openCreate">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          新增
        </button>
      </div>

      <!-- 筛选 -->
      <div class="glass-card bl-filter">
        <div class="ul-filter-grid">
          <div class="ul-form-group"><label class="ul-label">用户ID</label><input v-model="f.userId" class="ul-input" placeholder="请输入用户ID"></div>
          <div class="ul-form-group">
            <label class="ul-label">变更前等级</label>
            <select v-model="f.fromLevel" class="ul-input ul-select">
              <option value="">全部</option>
              <option v-for="n in 10" :key="n" :value="`LV${n}`">LV{{ n }}</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">变更后等级</label>
            <select v-model="f.toLevel" class="ul-input ul-select">
              <option value="">全部</option>
              <option v-for="n in 10" :key="n" :value="`LV${n}`">LV{{ n }}</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">变更类型</label>
            <select v-model="f.changeType" class="ul-input ul-select">
              <option value="">全部</option>
              <option value="系统升级">系统升级</option>
              <option value="后台调整">后台调整</option>
            </select>
          </div>
          <template v-if="filterExpanded">
            <div class="ul-form-group">
              <label class="ul-label">审核状态</label>
              <select v-model="f.auditStatus" class="ul-input ul-select">
                <option value="">全部</option>
                <option value="系统通过">系统通过</option>
                <option value="待审核">待审核</option>
                <option value="审核通过">审核通过</option>
                <option value="审核驳回">审核驳回</option>
              </select>
            </div>
            <div class="ul-form-group"><label class="ul-label">操作人</label><input v-model="f.operator" class="ul-input" placeholder="管理员ID"></div>
            <div class="ul-form-group"><label class="ul-label">操作开始时间</label><input v-model="f.startTime" type="date" class="ul-input"></div>
            <div class="ul-form-group"><label class="ul-label">操作结束时间</label><input v-model="f.endTime" type="date" class="ul-input"></div>
          </template>
        </div>
        <div class="ul-filter-footer">
          <button class="ul-expand-btn" :class="{expanded:filterExpanded}" @click="filterExpanded=!filterExpanded">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            {{ filterExpanded?'收起筛选':'展开更多筛选' }}
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

      <!-- 批量操作栏 -->
      <div v-if="selected.length>0" class="glass-card" style="padding:10px 16px;display:flex;align-items:center;gap:12px">
        <span style="font-size:13px">已选 <strong style="color:var(--primary)">{{ selected.length }}</strong> 项</span>
        <button class="btn btn-primary btn-sm" @click="doBatchPass">批量通过</button>
        <button class="btn btn-danger btn-sm" @click="batchRejectVisible=true;batchRejectReason=''">批量驳回</button>
        <button class="btn btn-ghost btn-sm" @click="selected=[]">取消</button>
      </div>

      <!-- 数据表 -->
      <div class="glass-card table-card">
        <div class="table-header">
          <div class="table-title">等级变更日志<span class="table-count">共 {{ total.toLocaleString() }} 条</span></div>
        </div>
        <div class="il-table-wrap">
          <table class="il-table">
            <colgroup>
              <col style="width:36px"><col style="min-width:100px"><col style="min-width:200px">
              <col style="min-width:90px"><col style="min-width:90px"><col style="min-width:110px">
              <col style="width:130px">
            </colgroup>
            <thead>
              <tr>
                <th><input type="checkbox" style="accent-color:var(--primary)" :checked="selected.length===list.length&&list.length>0" @change="toggleAll"></th>
                <th>用户ID</th>
                <th>等级变更</th>
                <th>变更类型</th>
                <th>审核状态</th>
                <th>审核信息</th>
                <th class="col-action" style="text-align:center">操作</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="loading">
                <tr v-for="i in 10" :key="i"><td colspan="7"><div class="ul-skeleton"></div></td></tr>
              </template>
              <template v-else-if="list.length===0">
                <tr><td colspan="7"><div class="ul-empty">暂无等级变更记录</div></td></tr>
              </template>
              <template v-else>
                <tr v-for="row in list" :key="row.id" class="ul-row">
                  <td @click.stop><input type="checkbox" style="accent-color:var(--primary)" :checked="selected.includes(row.id)" @change="toggleRow(row.id)" :disabled="row.auditStatus!=='待审核'"></td>
                  <td><span class="ul-mono" style="font-size:12px;color:var(--text-secondary)">{{ row.userId }}</span></td>
                  <td>
                    <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
                      <span class="tag" :style="lvStyle(row.fromLevel)" style="font-size:11px;font-weight:700">{{ row.fromLevel }}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5"><polyline points="9 18 15 12 9 6"/></svg>
                      <span class="tag" :style="lvStyle(row.toLevel)" style="font-size:11px;font-weight:700">{{ row.toLevel }}</span>
                    </div>
                    <div class="ul-muted" style="font-size:10px;margin-top:4px">{{ row.createdAt }}</div>
                  </td>
                  <td>
                    <span class="tag" :class="row.changeType==='系统升级'?'tag-blue':'tag-amber'" style="font-size:11px">{{ row.changeType }}</span>
                  </td>
                  <td>
                    <span class="badge" :class="{系统通过:'badge-success',待审核:'badge-warning',审核通过:'badge-success',审核驳回:'badge-danger'}[row.auditStatus]" style="font-size:11px;white-space:nowrap">{{ row.auditStatus }}</span>
                  </td>
                  <td>
                    <div v-if="row.auditor" style="font-size:11px;font-weight:600;color:var(--text-primary)">{{ row.auditor }}</div>
                    <div v-if="row.auditTime" class="ul-muted" style="font-size:10px">{{ row.auditTime }}</div>
                    <span v-if="!row.auditor" class="ul-muted">—</span>
                  </td>
                  <td class="col-action" @click.stop>
                    <div class="action-btns action-btns--stack">
                      <button
                        type="button"
                        class="action-btn approve"
                        :disabled="row.auditStatus!=='待审核'"
                        @click="doPass(row)"
                      >审核通过</button>
                      <button
                        type="button"
                        class="action-btn reject"
                        :disabled="row.auditStatus!=='待审核'"
                        @click="openReject(row)"
                      >审核驳回</button>
                      <button
                        type="button"
                        class="action-btn edit"
                        :disabled="row.auditStatus==='系统通过'||row.auditStatus==='审核通过'"
                        @click="openEdit(row)"
                      >编辑</button>
                      <button type="button" class="action-btn view" @click="openLog(row)">操作日志</button>
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

    <!-- 新增弹窗 -->
    <div class="ul-overlay" :class="{show:createVisible}" @click.self="()=>{}"></div>
    <div class="ul-modal" :class="{show:createVisible}" style="width:640px">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid var(--border)">
        <div style="font-size:15px;font-weight:700">新增等级调整记录</div>
        <button class="ul-icon-btn" @click="createVisible=false"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <div style="padding:20px;display:flex;flex-direction:column;gap:14px">
        <div class="ul-form-group">
          <label class="ul-label">用户ID <span style="color:var(--danger)">*</span></label>
          <div style="display:flex;gap:8px">
            <input v-model="createForm.userId" class="ul-input" placeholder="请输入用户ID" @blur="autoFillLevel">
            <button class="btn btn-default btn-sm" @click="autoFillLevel">校验</button>
          </div>
        </div>
        <div class="ul-form-group">
          <label class="ul-label">变更前等级（只读，自动带出）</label>
          <input :value="createForm.fromLevel||'—'" readonly class="ul-input" style="background:var(--surface-hover);color:var(--text-muted);cursor:not-allowed">
        </div>
        <div class="ul-form-group">
          <label class="ul-label">变更后等级 <span style="color:var(--danger)">*</span></label>
          <select v-model="createForm.toLevel" class="ul-input ul-select" style="max-width:160px">
            <option value="">请选择</option>
            <option v-for="n in 10" :key="n" :value="`LV${n}`" :disabled="`LV${n}`===createForm.fromLevel">LV{{ n }}</option>
          </select>
        </div>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:10px;padding:14px 20px;border-top:1px solid var(--border)">
        <button class="btn btn-default" @click="createVisible=false">取消</button>
        <button class="btn btn-primary" :disabled="!createForm.userId||!createForm.toLevel" @click="doCreate">确认新增</button>
      </div>
    </div>

    <!-- 编辑弹窗 -->
    <div class="ul-overlay" :class="{show:editVisible}" @click.self="()=>{}"></div>
    <div class="ul-modal" :class="{show:editVisible}" style="width:520px">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid var(--border)">
        <div style="font-size:15px;font-weight:700">编辑等级变更</div>
        <button class="ul-icon-btn" @click="editVisible=false"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <div v-if="editTarget" style="padding:20px;display:flex;flex-direction:column;gap:14px">
        <div class="ul-form-group"><label class="ul-label">用户ID</label><input :value="editTarget.userId" readonly class="ul-input" style="background:var(--surface-hover);color:var(--text-muted);cursor:not-allowed"></div>
        <div class="ul-form-group"><label class="ul-label">变更前等级</label><input :value="editTarget.fromLevel" readonly class="ul-input" style="background:var(--surface-hover);color:var(--text-muted);cursor:not-allowed"></div>
        <div class="ul-form-group">
          <label class="ul-label">变更后等级 <span style="color:var(--danger)">*</span></label>
          <select v-model="editNewLevel" class="ul-input ul-select" style="max-width:160px">
            <option v-for="n in 10" :key="n" :value="`LV${n}`" :disabled="`LV${n}`===editTarget.fromLevel">LV{{ n }}</option>
          </select>
        </div>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:10px;padding:14px 20px;border-top:1px solid var(--border)">
        <button class="btn btn-default" @click="editVisible=false">取消</button>
        <button class="btn btn-primary" @click="doEdit">保存</button>
      </div>
    </div>

    <!-- 驳回弹窗 -->
    <div class="ul-overlay" :class="{show:rejectVisible||batchRejectVisible}" @click.self="()=>{}"></div>
    <div class="ul-modal" :class="{show:rejectVisible||batchRejectVisible}" style="width:520px">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid var(--border)">
        <div style="font-size:15px;font-weight:700;color:var(--danger)">{{ batchRejectVisible?`批量驳回 ${selected.length} 条`:'审核驳回' }}</div>
        <button class="ul-icon-btn" @click="rejectVisible=false;batchRejectVisible=false"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <div style="padding:20px">
        <div class="ul-form-group"><label class="ul-label">驳回原因 <span style="color:var(--danger)">*</span></label><textarea v-model="rejectReason" class="ul-input" rows="4" style="height:auto;resize:vertical" placeholder="请填写驳回原因（必填，最多200字）" maxlength="200"></textarea></div>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:10px;padding:14px 20px;border-top:1px solid var(--border)">
        <button class="btn btn-default" @click="rejectVisible=false;batchRejectVisible=false">取消</button>
        <button class="btn btn-danger" :disabled="!rejectReason.trim()" @click="doReject">确认驳回</button>
      </div>
    </div>

    <!-- 操作日志抽屉 -->
    <div class="ul-overlay" :class="{show:logVisible}" @click="logVisible=false"></div>
    <div class="ul-drawer" :class="{show:logVisible}" style="width:520px">
      <div class="ul-drawer-header">
        <div style="font-size:15px;font-weight:700">操作日志</div>
        <button class="ul-icon-btn" @click="logVisible=false"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <div style="flex:1;overflow-y:auto;padding:16px">
        <table class="il-log-table">
          <thead><tr><th>操作时间</th><th>操作人</th><th>操作类型</th><th>操作前</th><th>操作后</th><th>备注</th></tr></thead>
          <tbody>
            <tr v-for="log in mockLogs" :key="log.time">
              <td style="white-space:nowrap;font-size:11px;color:var(--text-muted)">{{ log.time }}</td>
              <td><span class="ul-mono" style="font-size:11px">{{ log.operator }}</span></td>
              <td><span class="tag tag-blue" style="font-size:10px">{{ log.type }}</span></td>
              <td><span class="tag" :style="lvStyle(log.before)" style="font-size:10px">{{ log.before }}</span></td>
              <td><span class="tag" :style="lvStyle(log.after)" style="font-size:10px">{{ log.after }}</span></td>
              <td style="font-size:11px;color:var(--text-muted)">{{ log.remark }}</td>
            </tr>
          </tbody>
        </table>
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

interface LogItem { id:string; userId:string; fromLevel:string; toLevel:string; changeType:string; auditStatus:string; auditor:string; auditTime:string; createdAt:string }
interface Toast { id:number; msg:string; type:string }

const loading = ref(false)
const list = ref<LogItem[]>([])
const selected = ref<string[]>([])
const total = ref(0); const page = ref(1); const pageSize = ref(20)
const filterExpanded = ref(false); const pendingCount = ref(0)
const createVisible = ref(false); const editVisible = ref(false)
const rejectVisible = ref(false); const batchRejectVisible = ref(false); const logVisible = ref(false)
const editTarget = ref<LogItem|null>(null); const editNewLevel = ref('')
const rejectTarget = ref<LogItem|null>(null); const rejectReason = ref(''); const batchRejectReason = ref('')
const createForm = ref({ userId:'', fromLevel:'', toLevel:'' })
const toasts = ref<Toast[]>([]); let toastId = 0
const f = ref({ userId:'', fromLevel:'', toLevel:'', changeType:'', auditStatus:'', operator:'', startTime:'', endTime:'' })

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
const paginationPages = computed(() => {
  const t=totalPages.value,c=page.value; const p:(number|string)[]=[]
  if(t<=7){for(let i=1;i<=t;i++)p.push(i);return p}
  p.push(1);if(c>3)p.push('...')
  for(let i=Math.max(2,c-1);i<=Math.min(t-1,c+1);i++)p.push(i)
  if(c<t-2)p.push('...');p.push(t);return p
})

const AUDIT_STATUSES = ['系统通过','待审核','审核通过','审核驳回','待审核']
const CHANGE_TYPES = ['系统升级','后台调整','系统升级','后台调整','系统升级']
const AUDITORS = ['admin01','','admin02','admin03','']

const LV_COLORS = ['#9ca3af','#3b82f6','#10b981','#8b5cf6','#f59e0b','#ef4444','#06b6d4','#ec4899','#f97316','#a855f7']
function lvStyle(lv:string) {
  const n = parseInt(lv.replace('LV',''))-1
  const c = LV_COLORS[Math.max(0,Math.min(9,n))]
  return `background:${c}22;color:${c};border:1px solid ${c}44`
}

function fmt(d:Date) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}` }

function mockList(n=20): LogItem[] {
  return Array.from({length:n},(_,i)=>{
    const idx = (page.value-1)*pageSize.value+i+1
    const from = `LV${(idx%9)+1}`; const to = `LV${Math.min(10,(idx%9)+2)}`
    const as = AUDIT_STATUSES[idx%5]
    const d = new Date(1681000000000+idx*3600000*10)
    const auditor = AUDITORS[idx%5]
    const auditTime = auditor?fmt(new Date(d.getTime()+86400000)):''
    return { id:`IL${String(10000+idx)}`, userId:`U${10024+(idx*7)%500}`, fromLevel:from, toLevel:to, changeType:CHANGE_TYPES[idx%5], auditStatus:as, auditor, auditTime, createdAt:fmt(d) }
  })
}

const mockLogs = [
  { time:'2026-04-20 14:30', operator:'admin01', type:'手动调整', before:'LV2', after:'LV3', remark:'用户达标升级手动确认' },
  { time:'2026-04-19 09:15', operator:'system', type:'系统升级', before:'LV1', after:'LV2', remark:'系统自动触发' },
  { time:'2026-04-15 16:45', operator:'admin02', type:'驳回', before:'LV3', after:'LV3', remark:'数据异常暂缓' },
]

async function fetchList(p=1) {
  loading.value=true; page.value=p; selected.value=[]
  await new Promise(r=>setTimeout(r,200))
  list.value=mockList(pageSize.value); total.value=3680
  pendingCount.value=list.value.filter(r=>r.auditStatus==='待审核').length; loading.value=false
}
function resetFilter() { f.value={userId:'',fromLevel:'',toLevel:'',changeType:'',auditStatus:'',operator:'',startTime:'',endTime:''}; fetchList(1) }
function toggleAll(e:Event) { const chk=(e.target as HTMLInputElement).checked; selected.value=chk?list.value.filter(r=>r.auditStatus==='待审核').map(r=>r.id):[] }
function toggleRow(id:string) { const idx=selected.value.indexOf(id);if(idx>=0)selected.value.splice(idx,1);else selected.value.push(id) }
function openCreate() { createForm.value={userId:'',fromLevel:'',toLevel:''}; createVisible.value=true }
function autoFillLevel() { if(createForm.value.userId) createForm.value.fromLevel=`LV${(Math.floor(Math.random()*5)+1)}` }
function doCreate() { list.value.unshift({id:`IL_NEW_${Date.now()}`,userId:createForm.value.userId,fromLevel:createForm.value.fromLevel,toLevel:createForm.value.toLevel,changeType:'后台调整',auditStatus:'待审核',auditor:'',auditTime:'',createdAt:fmt(new Date())}); createVisible.value=false; showToast('新增成功','success') }
function doPass(row:LogItem) { row.auditStatus='审核通过';row.auditor='admin01';row.auditTime=fmt(new Date()); pendingCount.value=Math.max(0,pendingCount.value-1); showToast('审核通过','success') }
function openReject(row:LogItem) { rejectTarget.value=row;rejectReason.value='';rejectVisible.value=true }
function doReject() {
  if(rejectTarget.value){rejectTarget.value.auditStatus='审核驳回';rejectTarget.value.auditor='admin01';rejectTarget.value.auditTime=fmt(new Date());pendingCount.value=Math.max(0,pendingCount.value-1)}
  if(batchRejectVisible.value){list.value.filter(r=>selected.value.includes(r.id)).forEach(r=>{r.auditStatus='审核驳回';r.auditor='admin01';r.auditTime=fmt(new Date())});pendingCount.value=Math.max(0,pendingCount.value-selected.value.length);selected.value=[]}
  rejectVisible.value=false;batchRejectVisible.value=false;showToast('已驳回','info')
}
function doBatchPass() { const rows=list.value.filter(r=>selected.value.includes(r.id));rows.forEach(r=>{r.auditStatus='审核通过';r.auditor='admin01';r.auditTime=fmt(new Date())});pendingCount.value=Math.max(0,pendingCount.value-rows.length);showToast(`批量通过 ${rows.length} 条`,'success');selected.value=[] }
function openEdit(row:LogItem) { editTarget.value=row;editNewLevel.value=row.toLevel;editVisible.value=true }
function doEdit() { if(editTarget.value)editTarget.value.toLevel=editNewLevel.value;editVisible.value=false;showToast('保存成功','success') }
function openLog(_row:LogItem) { logVisible.value=true }
function showToast(msg:string,type='info') { const id=++toastId;toasts.value.push({id,msg,type});setTimeout(()=>removeToast(id),3000) }
function removeToast(id:number) { toasts.value=toasts.value.filter(t=>t.id!==id) }
onMounted(()=>fetchList())
</script>

<style>
.il-wrap { min-height:100%; }
.il-table-wrap { overflow-x:auto; }
.il-table { width:100%; border-collapse:collapse; font-size:13px; }
.il-table th { padding:10px 12px; text-align:left; font-size:11px; font-weight:600; color:var(--text-muted); background:var(--surface-hover); border-bottom:1px solid var(--border); white-space:nowrap; }
.il-table td { padding:10px 12px; border-bottom:1px solid var(--border); color:var(--text-primary); vertical-align:middle; }
.il-table tr:last-child td { border-bottom:none; }
.il-table .ul-row:hover td { background:rgba(37,99,235,.03); }
.il-log-table { width:100%; border-collapse:collapse; font-size:12px; }
.il-log-table th { padding:8px 10px; text-align:left; font-size:11px; font-weight:600; color:var(--text-muted); background:var(--surface-hover); border-bottom:1px solid var(--border); white-space:nowrap; }
.il-log-table td { padding:8px 10px; border-bottom:1px solid var(--border); vertical-align:middle; }
.il-log-table tr:last-child td { border-bottom:none; }
</style>
