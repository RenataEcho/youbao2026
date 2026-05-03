<template>
  <div class="wr-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">用户资金</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">提现记录</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <div ref="prdTipAnchorRef" class="page-header-title-anchor">
            <h1 class="page-title">提现记录</h1>
          </div>
          <p class="page-desc">查看用户提现申请完整记录，包含提现金额、税额及到账情况</p>
        </div>
        <button class="btn btn-default btn-sm" @click="showToast('正在导出 Excel…','info')">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          导出 Excel
        </button>
      </div>

      <!-- 筛选 -->
      <div ref="prdTipFilterRef" class="glass-card bl-filter">
        <div class="ul-filter-grid">
          <div class="ul-form-group"><label class="ul-label">用户ID</label><input v-model="f.userId" class="ul-input" placeholder="请输入用户ID"></div>
          <div class="ul-form-group">
            <label class="ul-label">提现钱包</label>
            <select v-model="f.walletType" class="ul-input ul-select">
              <option value="">全部</option>
              <option value="project">项目钱包</option>
              <option value="dividend">分红钱包</option>
              <option value="reward">奖励钱包</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">状态</label>
            <select v-model="f.status" class="ul-input ul-select">
              <option value="">全部</option>
              <option value="processing">处理中</option>
              <option value="success">已到账</option>
              <option value="failed">提现失败</option>
            </select>
          </div>
          <div class="ul-form-group"><label class="ul-label">申请开始时间</label><input v-model="f.applyStart" type="date" class="ul-input"></div>
          <template v-if="filterExpanded">
            <div class="ul-form-group"><label class="ul-label">申请结束时间</label><input v-model="f.applyEnd" type="date" class="ul-input"></div>
            <div class="ul-form-group"><label class="ul-label">变更开始时间</label><input v-model="f.changeStart" type="date" class="ul-input"></div>
            <div class="ul-form-group"><label class="ul-label">变更结束时间</label><input v-model="f.changeEnd" type="date" class="ul-input"></div>
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
          <div class="table-title">提现记录<span class="table-count">共 {{ total.toLocaleString() }} 条</span></div>
          <div style="display:flex;gap:16px;font-size:12px;align-items:center">
            <span>累计提现：<strong style="color:var(--text-primary)">¥{{ totalWithdraw.toLocaleString() }}</strong></span>
            <span>累计税额：<strong style="color:var(--warning)">¥{{ totalTax.toLocaleString() }}</strong></span>
          </div>
        </div>
        <div class="wr-table-wrap">
          <table class="wr-table">
            <colgroup>
              <col style="width:60px">
              <col style="min-width:100px">
              <col style="min-width:90px">
              <col style="min-width:80px">
              <col style="min-width:90px">
              <col style="min-width:90px">
              <col style="min-width:90px">
              <col style="min-width:160px">
              <col style="min-width:110px">
              <col style="min-width:130px">
              <col style="min-width:120px">
            </colgroup>
            <thead>
              <tr>
                <th>序号</th>
                <th>用户ID</th>
                <th style="text-align:right">提现金额</th>
                <th style="text-align:right">税额</th>
                <th style="text-align:right">实际到账</th>
                <th>提现钱包</th>
                <th style="text-align:right">提现后余额</th>
                <th>提现账户</th>
                <th>状态</th>
                <th>申请时间</th>
                <th>状态变更时间</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="loading">
                <tr v-for="i in 10" :key="i"><td colspan="11"><div class="ul-skeleton"></div></td></tr>
              </template>
              <template v-else-if="list.length===0">
                <tr><td colspan="11"><div class="ul-empty">暂无提现记录</div></td></tr>
              </template>
              <template v-else>
                <tr v-for="row in list" :key="row.id" class="ul-row">
                  <td class="ul-muted" style="font-size:12px;text-align:center">{{ row.id }}</td>
                  <td><span class="ul-mono" style="font-size:12px;color:var(--text-secondary)">{{ row.userId }}</span></td>
                  <td style="text-align:right"><span class="ul-mono">¥{{ row.withdrawAmount.toFixed(2) }}</span></td>
                  <td style="text-align:right"><span class="ul-mono" style="color:var(--warning)">¥{{ row.taxAmount.toFixed(2) }}</span></td>
                  <td style="text-align:right"><span class="ul-mono" style="font-weight:600;color:var(--success)">¥{{ row.actualAmount.toFixed(2) }}</span></td>
                  <td>
                    <span class="tag" :class="{project:'tag-blue',dividend:'tag-green',reward:'tag-amber'}[row.walletType]||'tag-gray'" style="font-size:11px">
                      {{ {project:'项目钱包',dividend:'分红钱包',reward:'奖励钱包'}[row.walletType] }}
                    </span>
                  </td>
                  <td style="text-align:right"><span class="ul-mono" style="font-size:12px;color:var(--text-muted)">¥{{ row.balanceAfter.toFixed(2) }}</span></td>
                  <td style="font-size:12px">{{ row.withdrawAccount }}</td>
                  <td>
                    <span class="badge" :class="{processing:'badge-warning',success:'badge-success',failed:'badge-danger'}[row.status]" style="font-size:11px">
                      {{ {processing:'处理中',success:'已到账',failed:'提现失败'}[row.status] }}
                    </span>
                    <div v-if="row.status==='failed'" style="font-size:10px;color:var(--text-muted);margin-top:2px;cursor:help" :title="row.failReason">↑ 悬浮查看原因</div>
                  </td>
                  <td class="ul-muted" style="font-size:11px">{{ row.createdAt }}</td>
                  <td>
                    <span v-if="row.status!=='processing'" class="ul-muted" style="font-size:11px">{{ row.statusChangedAt }}</span>
                    <span v-else class="ul-muted" style="font-size:11px">—</span>
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

interface WithdrawItem {
  id:number; userId:string; withdrawAmount:number; taxAmount:number; actualAmount:number
  walletType:string; balanceAfter:number; withdrawAccount:string
  status:string; failReason:string; createdAt:string; statusChangedAt:string
}
interface Toast { id:number; msg:string; type:string }

const loading = ref(false)
const list = ref<WithdrawItem[]>([])
const total = ref(0); const page = ref(1); const pageSize = ref(20)
const filterExpanded = ref(false)
const totalWithdraw = ref(0); const totalTax = ref(0)
const toasts = ref<Toast[]>([]); let toastId = 0
const f = ref({ userId:'', walletType:'', status:'', applyStart:'', applyEnd:'', changeStart:'', changeEnd:'' })

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
const paginationPages = computed(() => {
  const t=totalPages.value,c=page.value; const p:(number|string)[]=[]
  if(t<=7){for(let i=1;i<=t;i++)p.push(i);return p}
  p.push(1);if(c>3)p.push('...')
  for(let i=Math.max(2,c-1);i<=Math.min(t-1,c+1);i++)p.push(i)
  if(c<t-2)p.push('...');p.push(t);return p
})

const WALLET_TYPES = ['project','dividend','reward']
const STATUSES = ['success','success','success','processing','failed'] as const
const BANKS = ['招商银行 尾号6789','工商银行 尾号1234','建设银行 尾号5678','alipay: zha****@163.com','邮政储蓄银行 尾号4321']
const FAIL_REASONS = ['银行卡信息不匹配，请核实后重试','账户异常，已冻结','提现金额超过单笔限额','']

function mockList(n=20): WithdrawItem[] {
  return Array.from({length:n},(_,i)=>{
    const idx = (page.value-1)*pageSize.value+i+1
    const wAmt = parseFloat((50+idx*8.5).toFixed(2))
    const tax = parseFloat((wAmt*0.03).toFixed(2))
    const actual = parseFloat((wAmt-tax).toFixed(2))
    const bal = parseFloat((wAmt*0.3+20).toFixed(2))
    const st = STATUSES[idx%5]
    const d = new Date(1681000000000+idx*3600000*8)
    const fmt = (d:Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
    const d2 = new Date(d.getTime()+86400000)
    return {
      id:idx, userId:`U${10024+(idx*11)%500}`,
      withdrawAmount:wAmt, taxAmount:tax, actualAmount:actual,
      walletType:WALLET_TYPES[idx%3], balanceAfter:bal,
      withdrawAccount:BANKS[idx%5], status:st,
      failReason:st==='failed'?FAIL_REASONS[idx%3]:'',
      createdAt:fmt(d), statusChangedAt:st!=='processing'?fmt(d2):'',
    }
  })
}

async function fetchList(p=1) {
  loading.value=true; page.value=p
  await new Promise(r=>setTimeout(r,200))
  list.value=mockList(pageSize.value); total.value=15864
  totalWithdraw.value=2486320; totalTax.value=74589; loading.value=false
}
function resetFilter() { f.value={userId:'',walletType:'',status:'',applyStart:'',applyEnd:'',changeStart:'',changeEnd:''}; fetchList(1) }
function showToast(msg:string,type='info') { const id=++toastId;toasts.value.push({id,msg,type});setTimeout(()=>removeToast(id),3000) }
function removeToast(id:number) { toasts.value=toasts.value.filter(t=>t.id!==id) }
onMounted(()=>fetchList())
</script>

<style>
.wr-wrap { min-height:100%; }
.wr-table-wrap { overflow-x:auto; }
.wr-table { width:100%; border-collapse:collapse; font-size:13px; white-space:nowrap; }
.wr-table th { padding:10px 12px; text-align:left; font-size:11px; font-weight:600; color:var(--text-muted); background:var(--surface-hover); border-bottom:1px solid var(--border); }
.wr-table td { padding:10px 12px; border-bottom:1px solid var(--border); color:var(--text-primary); vertical-align:middle; }
.wr-table tr:last-child td { border-bottom:none; }
.wr-table .ul-row:hover td { background:rgba(37,99,235,.03); }
</style>
