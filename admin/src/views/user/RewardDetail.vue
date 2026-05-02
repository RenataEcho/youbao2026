<template>
  <div class="rd-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">用户资金</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">奖励明细</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">奖励明细</h1>
          <p class="page-desc">管理员奖励发放记录，支持批量审核、打款及微信通知</p>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-default btn-sm" @click="showImportModal">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            批量导入
          </button>
          <button class="btn btn-default btn-sm" @click="showToast('正在导出…','info')">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            导出数据
          </button>
        </div>
      </div>

      <!-- 统计指示器 -->
      <div class="glass-card" style="padding:14px 20px;display:flex;gap:24px;align-items:center">
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:12px;color:var(--text-muted)">已审核待打款</span>
          <span class="badge badge-warning" style="font-size:12px;padding:2px 10px">¥{{ stat.pendingPay.toLocaleString() }}</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:12px;color:var(--text-muted)">已审核已打款</span>
          <span class="badge badge-success" style="font-size:12px;padding:2px 10px">¥{{ stat.paid.toLocaleString() }}</span>
        </div>
      </div>

      <!-- 筛选 -->
      <div class="glass-card bl-filter">
        <div class="ul-filter-grid">
          <div class="ul-form-group">
            <label class="ul-label">业务类型</label>
            <select v-model="f.businessType" class="ul-input ul-select">
              <option value="">全部</option>
              <option value="brand">品牌</option>
              <option value="overseas">海外</option>
            </select>
          </div>
          <div class="ul-form-group"><label class="ul-label">项目名称</label><input v-model="f.projectName" class="ul-input" placeholder="模糊搜索项目名称"></div>
          <div class="ul-form-group"><label class="ul-label">用户ID</label><input v-model="f.userId" class="ul-input" placeholder="请输入用户ID"></div>
          <div class="ul-form-group">
            <label class="ul-label">审核状态</label>
            <select v-model="f.auditStatus" class="ul-input ul-select">
              <option value="">全部</option>
              <option value="pending_review">待审核</option>
              <option value="reviewed">已审核</option>
              <option value="rejected">已驳回</option>
            </select>
          </div>
          <template v-if="filterExpanded">
            <div class="ul-form-group">
              <label class="ul-label">打款状态</label>
              <select v-model="f.paymentStatus" class="ul-input ul-select">
                <option value="">全部</option>
                <option value="pending_payment">待打款</option>
                <option value="paid">已打款</option>
              </select>
            </div>
            <div class="ul-form-group"><label class="ul-label">关键词/口令</label><input v-model="f.keyword" class="ul-input" placeholder="模糊搜索"></div>
            <div class="ul-form-group"><label class="ul-label">导入开始时间</label><input v-model="f.importStart" type="date" class="ul-input"></div>
            <div class="ul-form-group"><label class="ul-label">导入结束时间</label><input v-model="f.importEnd" type="date" class="ul-input"></div>
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

      <!-- 批量操作栏 -->
      <div v-if="selected.length>0" class="glass-card" style="padding:10px 16px;display:flex;align-items:center;gap:12px">
        <span style="font-size:13px">已选 <strong style="color:var(--primary)">{{ selected.length }}</strong> 项</span>
        <button class="btn btn-primary btn-sm" @click="batchAuditPass">批量审核通过</button>
        <button class="btn btn-danger btn-sm" @click="batchRejectVisible=true">批量驳回</button>
        <button class="btn btn-default btn-sm" @click="showToast('批量微信通知','info')">批量发送微信通知</button>
        <button class="btn btn-ghost btn-sm" @click="selected=[]">取消</button>
      </div>

      <!-- 数据表 -->
      <div class="glass-card table-card">
        <div class="table-header">
          <div class="table-title">奖励明细<span class="table-count">共 {{ total.toLocaleString() }} 条</span></div>
        </div>
        <div class="rd-table-wrap">
          <table class="rd-table">
            <colgroup>
              <col style="width:36px">
              <col style="min-width:150px">
              <col style="min-width:120px">
              <col style="min-width:80px">
              <col style="min-width:100px">
              <col style="min-width:90px">
              <col style="min-width:100px">
              <col style="min-width:80px">
              <col style="min-width:80px">
              <col style="min-width:80px">
              <col style="min-width:140px">
              <col style="min-width:100px">
              <col style="width:120px">
            </colgroup>
            <thead>
              <tr>
                <th><input type="checkbox" style="accent-color:var(--primary)" :checked="selected.length===list.length&&list.length>0" @change="toggleAll"></th>
                <th>订单ID</th>
                <th>导入时间</th>
                <th>业务类型</th>
                <th>用户ID</th>
                <th style="text-align:right">奖励金额</th>
                <th>奖励事由</th>
                <th>审核状态</th>
                <th>打款状态</th>
                <th>微信通知</th>
                <th>审核信息</th>
                <th>打款信息</th>
                <th class="col-action" style="text-align:center">操作</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="loading">
                <tr v-for="i in 8" :key="i"><td colspan="13"><div class="ul-skeleton"></div></td></tr>
              </template>
              <template v-else-if="list.length===0">
                <tr><td colspan="13"><div class="ul-empty">暂无奖励明细</div></td></tr>
              </template>
              <template v-else>
                <tr v-for="row in list" :key="row.id" class="ul-row">
                  <td @click.stop><input type="checkbox" style="accent-color:var(--primary)" :checked="selected.includes(row.id)" @change="toggleRow(row.id)"></td>
                  <td><span class="ul-mono" style="font-size:11px;color:var(--text-secondary)">{{ row.orderId }}</span></td>
                  <td class="ul-muted" style="font-size:11px">{{ row.importedAt }}</td>
                  <td>
                    <span class="tag" :class="row.businessType==='brand'?'tag-blue':'tag-purple'" style="font-size:10px">{{ row.businessType==='brand'?'品牌':'海外' }}</span>
                  </td>
                  <td><span class="ul-mono" style="font-size:12px;color:var(--text-secondary)">{{ row.userId }}</span></td>
                  <td style="text-align:right"><span class="ul-mono" style="font-weight:700;color:var(--success)">¥{{ row.amount.toFixed(2) }}</span></td>
                  <td style="font-size:12px;max-width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" :title="row.rewardReason">{{ row.rewardReason }}</td>
                  <td>
                    <span class="badge" :class="{pending_review:'badge-warning',reviewed:'badge-success',rejected:'badge-danger'}[row.auditStatus]" style="font-size:10px;white-space:nowrap">
                      {{ {pending_review:'待审核',reviewed:'已审核',rejected:'已驳回'}[row.auditStatus] }}
                    </span>
                  </td>
                  <td>
                    <span class="badge" :class="row.paymentStatus==='paid'?'badge-success':'badge-warning'" style="font-size:10px;white-space:nowrap">
                      {{ row.paymentStatus==='paid'?'已打款':'待打款' }}
                    </span>
                  </td>
                  <td>
                    <span class="badge" :class="row.wechatNotify==='sent'?'badge-info':'badge-gray'" style="font-size:10px;white-space:nowrap">
                      {{ row.wechatNotify==='sent'?'已发送':'待发送' }}
                    </span>
                  </td>
                  <td>
                    <div v-if="row.reviewer" style="font-size:11px;font-weight:600">{{ row.reviewer }}</div>
                    <div v-if="row.reviewedAt" class="ul-muted" style="font-size:10px">{{ row.reviewedAt }}</div>
                    <span v-if="!row.reviewer" class="ul-muted" style="font-size:11px">—</span>
                  </td>
                  <td>
                    <div v-if="row.payer" style="font-size:11px;font-weight:600">{{ row.payer }}</div>
                    <div v-if="row.paidAt" class="ul-muted" style="font-size:10px">{{ row.paidAt }}</div>
                    <span v-if="!row.payer" class="ul-muted" style="font-size:11px">—</span>
                  </td>
                  <td class="col-action" @click.stop>
                    <div class="action-btns" style="justify-content: center; flex-wrap: wrap">
                      <button
                        v-if="row.auditStatus==='pending_review'"
                        type="button"
                        class="action-btn approve"
                        @click="doAuditPass(row)"
                      >通过</button>
                      <button
                        v-if="row.auditStatus==='pending_review'"
                        type="button"
                        class="action-btn reject"
                        @click="openReject(row)"
                      >驳回</button>
                      <button
                        v-if="row.auditStatus==='reviewed'&&row.paymentStatus==='pending_payment'"
                        type="button"
                        class="action-btn edit"
                        @click="doPay(row)"
                      >打款</button>
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

    <!-- 导入弹窗 -->
    <div class="ul-overlay" :class="{show:importVisible}" @click="importVisible=false"></div>
    <div class="ul-modal" :class="{show:importVisible}" style="width:480px">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid var(--border)">
        <div style="font-size:15px;font-weight:700">批量导入奖励</div>
        <button class="ul-icon-btn" @click="importVisible=false"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <div style="padding:20px">
        <div style="background:var(--surface-hover);border-radius:var(--radius);padding:14px 16px;font-size:12px;color:var(--text-secondary);margin-bottom:14px;line-height:1.7">
          <div style="font-weight:600;margin-bottom:6px">导入说明</div>
          <div>· 支持 .xlsx / .xls 格式</div>
          <div>· 必填字段：业务类型、用户ID、奖励金额、奖励事由</div>
          <div>· 业务类型填写「品牌」或「海外」</div>
          <div>· 导入成功记录默认状态：待审核 + 待打款 + 待发送</div>
        </div>
        <div style="border:2px dashed var(--border);border-radius:var(--radius);padding:32px 20px;text-align:center;cursor:pointer" @click="showToast('请选择 Excel 文件（Mock）','info')">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.2" style="margin-bottom:8px"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          <div style="font-size:13px;color:var(--text-secondary);margin-bottom:4px">点击选择文件</div>
          <div style="font-size:11px;color:var(--text-muted)">.xlsx / .xls，大小不超过 10MB</div>
        </div>
        <div style="margin-top:12px;text-align:right">
          <a href="#" style="font-size:12px;color:var(--primary)" @click.prevent="showToast('下载模板','info')">下载导入模板</a>
        </div>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:10px;padding:14px 20px;border-top:1px solid var(--border)">
        <button class="btn btn-default" @click="importVisible=false">取消</button>
        <button class="btn btn-primary" @click="showToast('导入成功（Mock）','success');importVisible=false">确认导入</button>
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

type AuditStatus = 'pending_review' | 'reviewed' | 'rejected'
type PaymentStatus = 'pending_payment' | 'paid'
type WechatNotify = 'pending' | 'sent'

interface RewardItem {
  id:string; orderId:string; importedAt:string
  businessType:'brand'|'overseas'; projectId:string; projectName:string; keyword:string
  userId:string; amount:number; rewardTitle:string; rewardReason:string; importOperator:string
  reviewer:string; reviewedAt:string; rejectReason:string
  payer:string; paidAt:string
  auditStatus:AuditStatus; paymentStatus:PaymentStatus; wechatNotify:WechatNotify
}
interface Toast { id:number; msg:string; type:string }

const loading = ref(false)
const list = ref<RewardItem[]>([])
const selected = ref<string[]>([])
const total = ref(0); const page = ref(1); const pageSize = ref(20)
const filterExpanded = ref(false)
const rejectVisible = ref(false); const batchRejectVisible = ref(false)
const rejectTarget = ref<RewardItem|null>(null); const rejectReason = ref('')
const importVisible = ref(false)
const stat = ref({ pendingPay:0, paid:0 })
const toasts = ref<Toast[]>([]); let toastId = 0
const f = ref({ businessType:'', projectName:'', userId:'', keyword:'', auditStatus:'', paymentStatus:'', importStart:'', importEnd:'' })

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
const paginationPages = computed(() => {
  const t=totalPages.value,c=page.value; const p:(number|string)[]=[]
  if(t<=7){for(let i=1;i<=t;i++)p.push(i);return p}
  p.push(1);if(c>3)p.push('...')
  for(let i=Math.max(2,c-1);i<=Math.min(t-1,c+1);i++)p.push(i)
  if(c<t-2)p.push('...');p.push(t);return p
})

const AUDIT_STATUSES: AuditStatus[] = ['pending_review','reviewed','rejected','reviewed','pending_review']
const PAY_STATUSES: PaymentStatus[] = ['pending_payment','paid','pending_payment','paid','pending_payment']
const WECHAT: WechatNotify[] = ['pending','sent','pending','sent','sent']
const REASONS = ['优质内容创作奖励','活动爆单激励奖励','月度TOP达人奖励','海外项目特别激励','新用户首单奖励']
const PROJECTS = ['番茄小说推文','红果短剧推广','快看漫画推广','剪映海外版权','百度网盘推广']
const ADMINS = ['admin01','admin02','admin03']

function fmt(d:Date) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}` }

function mockList(n=20): RewardItem[] {
  return Array.from({length:n},(_,i)=>{
    const idx = (page.value-1)*pageSize.value+i+1
    const ts = 1681000000000+idx*3600000*12
    const d = new Date(ts)
    const as = AUDIT_STATUSES[idx%5]
    const ps = as==='rejected'?'pending_payment':PAY_STATUSES[idx%5]
    const reviewer = as!=='pending_review'?ADMINS[idx%3]:''
    const reviewedAt = as!=='pending_review'?fmt(new Date(ts+86400000)):''
    const payer = ps==='paid'?ADMINS[idx%3]:''
    const paidAt = ps==='paid'?fmt(new Date(ts+172800000)):''
    return {
      id:`RW${String(10000+idx)}`,
      orderId:`${ts}${String(idx%1000).padStart(3,'0')}`,
      importedAt:fmt(d),
      businessType:idx%3===0?'overseas':'brand',
      projectId:`YB_P_${String(idx%10).padStart(3,'0')}`,
      projectName:PROJECTS[idx%5], keyword:`kw${idx%20}`,
      userId:`U${10024+(idx*7)%500}`,
      amount:parseFloat((50+idx*12.5).toFixed(2)),
      rewardTitle:`第${idx}期奖励`, rewardReason:REASONS[idx%5],
      importOperator:ADMINS[idx%3], reviewer, reviewedAt,
      rejectReason:as==='rejected'?'数据异常，暂缓打款':'',
      payer, paidAt, auditStatus:as, paymentStatus:ps, wechatNotify:WECHAT[idx%5]
    }
  })
}

async function fetchList(p=1) {
  loading.value=true; page.value=p; selected.value=[]
  await new Promise(r=>setTimeout(r,200))
  list.value=mockList(pageSize.value); total.value=6892
  stat.value={ pendingPay:128640, paid:386920 }; loading.value=false
}
function resetFilter() { f.value={businessType:'',projectName:'',userId:'',keyword:'',auditStatus:'',paymentStatus:'',importStart:'',importEnd:''}; fetchList(1) }
function toggleAll(e:Event) { const chk=(e.target as HTMLInputElement).checked; selected.value=chk?list.value.map(r=>r.id):[] }
function toggleRow(id:string) { const idx=selected.value.indexOf(id); if(idx>=0)selected.value.splice(idx,1);else selected.value.push(id) }
function doAuditPass(row:RewardItem) { row.auditStatus='reviewed';row.reviewer='admin01';row.reviewedAt=fmt(new Date()); showToast('审核通过','success') }
function openReject(row:RewardItem) { rejectTarget.value=row;rejectReason.value='';rejectVisible.value=true }
function doReject() {
  if(rejectTarget.value) { rejectTarget.value.auditStatus='rejected';rejectTarget.value.rejectReason=rejectReason.value;rejectTarget.value.paymentStatus='pending_payment' }
  rejectVisible.value=false;batchRejectVisible.value=false;rejectReason.value='';showToast('驳回成功','info')
}
function batchAuditPass() { list.value.filter(r=>selected.value.includes(r.id)&&r.auditStatus==='pending_review').forEach(r=>{r.auditStatus='reviewed';r.reviewer='admin01';r.reviewedAt=fmt(new Date())}); showToast(`批量审核通过 ${selected.value.length} 条`,'success');selected.value=[] }
function doPay(row:RewardItem) { row.paymentStatus='paid';row.payer='admin01';row.paidAt=fmt(new Date()); showToast('打款成功','success') }
function showImportModal() { importVisible.value=true }
function showToast(msg:string,type='info') { const id=++toastId;toasts.value.push({id,msg,type});setTimeout(()=>removeToast(id),3000) }
function removeToast(id:number) { toasts.value=toasts.value.filter(t=>t.id!==id) }
onMounted(()=>fetchList())
</script>

<style>
.rd-wrap { min-height:100%; }
.rd-table-wrap { overflow-x:auto; }
.rd-table { width:100%; border-collapse:collapse; font-size:13px; white-space:nowrap; }
.rd-table th { padding:10px 10px; text-align:left; font-size:11px; font-weight:600; color:var(--text-muted); background:var(--surface-hover); border-bottom:1px solid var(--border); }
.rd-table td { padding:9px 10px; border-bottom:1px solid var(--border); color:var(--text-primary); vertical-align:middle; }
.rd-table tr:last-child td { border-bottom:none; }
.rd-table .ul-row:hover td { background:rgba(37,99,235,.03); }
.badge-info { background:rgba(59,130,246,.12); color:#2563eb; }
</style>
