<template>
  <div class="uw-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">用户资金</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">用户钱包</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <div ref="prdTipAnchorRef" class="page-header-title-anchor">
            <h1 class="page-title">用户钱包</h1>
          </div>
          <p class="page-desc">查看用户各钱包余额汇总，支持管理员增减余额操作</p>
        </div>
      </div>

      <!-- 筛选 -->
      <div ref="prdTipFilterRef" class="glass-card bl-filter">
        <div class="ul-filter-grid">
          <div class="ul-form-group"><label class="ul-label">用户ID</label><input v-model="f.userId" class="ul-input" placeholder="请输入用户ID"></div>
          <div class="ul-form-group"><label class="ul-label">用户手机号</label><input v-model="f.mobile" class="ul-input" placeholder="请输入手机号"></div>
          <div class="ul-form-group"><label class="ul-label">用户昵称</label><input v-model="f.nickname" class="ul-input" placeholder="模糊搜索昵称"></div>
          <template v-if="filterExpanded">
            <div class="ul-form-group"><label class="ul-label">更新开始时间</label><input v-model="f.updStart" type="date" class="ul-input"></div>
            <div class="ul-form-group"><label class="ul-label">更新结束时间</label><input v-model="f.updEnd" type="date" class="ul-input"></div>
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
          <div class="table-title">用户钱包<span class="table-count">共 {{ total.toLocaleString() }} 条</span></div>
        </div>
        <div class="uw-table-wrap">
          <table class="uw-table">
            <colgroup>
              <col style="min-width:140px">
              <col style="min-width:110px">
              <col style="min-width:100px">
              <col style="min-width:100px">
              <col style="min-width:220px">
              <col style="min-width:220px">
              <col style="min-width:220px">
              <col style="min-width:140px">
              <col style="width:100px">
            </colgroup>
            <thead>
              <tr>
                <th>用户信息</th>
                <th>用户手机号</th>
                <th style="text-align:right">累计提现金额</th>
                <th style="text-align:right">可提现余额</th>
                <th>项目钱包</th>
                <th>分红钱包</th>
                <th>奖励钱包</th>
                <th>更新时间</th>
                <th ref="prdTipOpsRef" class="col-action" style="text-align:center">操作</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="loading">
                <tr v-for="i in 8" :key="i"><td colspan="9"><div class="ul-skeleton"></div></td></tr>
              </template>
              <template v-else-if="list.length === 0">
                <tr><td colspan="9"><div class="ul-empty">暂无数据</div></td></tr>
              </template>
              <template v-else>
                <tr v-for="row in list" :key="row.userId" class="ul-row">
                  <td>
                    <div class="ul-mono" style="font-size:12px;color:var(--text-secondary)">{{ row.userId }}</div>
                    <div style="font-size:12px;font-weight:500;margin-top:2px">{{ row.nickname }}</div>
                  </td>
                  <td><span class="ul-mono" style="font-size:12px">{{ row.mobile }}</span></td>
                  <td style="text-align:right"><span class="ul-mono">¥{{ row.totalWithdraw.toFixed(2) }}</span></td>
                  <td style="text-align:right"><span class="ul-mono" style="color:var(--success);font-weight:600">¥{{ row.availableBalance.toFixed(2) }}</span></td>
                  <td><div class="uw-wallet-cell"><div class="uw-wallet-total">项目总收益 <strong>¥{{ row.projectTotal.toFixed(2) }}</strong></div><div class="uw-wallet-sub">已结算 ¥{{ row.projectSettled.toFixed(2) }}　待结算 ¥{{ row.projectPending.toFixed(2) }}</div><div class="uw-wallet-sub">累计提现 ¥{{ row.projectWithdraw.toFixed(2) }}　<span class="uw-balance">余额 ¥{{ row.projectBalance.toFixed(2) }}</span></div></div></td>
                  <td><div class="uw-wallet-cell"><div class="uw-wallet-total">分红总收益 <strong>¥{{ row.dividendTotal.toFixed(2) }}</strong></div><div class="uw-wallet-sub">已结算 ¥{{ row.dividendSettled.toFixed(2) }}　待结算 ¥{{ row.dividendPending.toFixed(2) }}</div><div class="uw-wallet-sub">累计提现 ¥{{ row.dividendWithdraw.toFixed(2) }}　<span class="uw-balance">余额 ¥{{ row.dividendBalance.toFixed(2) }}</span></div></div></td>
                  <td><div class="uw-wallet-cell"><div class="uw-wallet-total">奖励总收益 <strong>¥{{ row.rewardTotal.toFixed(2) }}</strong></div><div class="uw-wallet-sub">已结算 ¥{{ row.rewardSettled.toFixed(2) }}　待结算 ¥{{ row.rewardPending.toFixed(2) }}</div><div class="uw-wallet-sub">累计提现 ¥{{ row.rewardWithdraw.toFixed(2) }}　<span class="uw-balance">余额 ¥{{ row.rewardBalance.toFixed(2) }}</span></div></div></td>
                  <td class="ul-muted" style="font-size:11px">{{ row.updatedAt }}</td>
                  <td class="col-action">
                    <div class="action-btns action-btns--stack">
                      <button type="button" class="action-btn edit" @click.stop="openAdjust(row)">增减余额</button>
                      <button type="button" class="action-btn view" @click.stop="openLog(row)">操作日志</button>
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

    <!-- 增减余额弹窗 -->
    <div class="ul-overlay" :class="{show:adjustVisible}" @click="adjustVisible=false"></div>
    <div class="ul-modal" :class="{show:adjustVisible}" style="width:560px">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid var(--border)">
        <div style="font-size:15px;font-weight:700">增减余额</div>
        <button class="ul-icon-btn" @click="adjustVisible=false"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <div v-if="adjustTarget" style="padding:20px">
        <div style="background:var(--surface-hover);border-radius:var(--radius);padding:12px 16px;margin-bottom:16px;font-size:13px">
          <span class="ul-mono" style="color:var(--text-secondary)">{{ adjustTarget.userId }}</span>
          <span style="margin:0 8px;color:var(--text-muted)">·</span>
          <span style="font-weight:600">{{ adjustTarget.nickname }}</span>
          <span style="margin:0 8px;color:var(--text-muted)">·</span>
          <span class="ul-mono" style="color:var(--text-muted)">{{ adjustTarget.mobile }}</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px">
          <div class="uw-wallet-badge">
            <div style="font-size:11px;color:var(--text-muted)">项目钱包余额</div>
            <div style="font-size:16px;font-weight:700;color:var(--success);margin-top:4px">¥{{ adjustTarget.projectBalance.toFixed(2) }}</div>
          </div>
          <div class="uw-wallet-badge">
            <div style="font-size:11px;color:var(--text-muted)">分红钱包余额</div>
            <div style="font-size:16px;font-weight:700;color:var(--success);margin-top:4px">¥{{ adjustTarget.dividendBalance.toFixed(2) }}</div>
          </div>
          <div class="uw-wallet-badge">
            <div style="font-size:11px;color:var(--text-muted)">奖励钱包余额</div>
            <div style="font-size:16px;font-weight:700;color:var(--success);margin-top:4px">¥{{ adjustTarget.rewardBalance.toFixed(2) }}</div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
          <div class="ul-form-group"><label class="ul-label">操作钱包</label>
            <select v-model="adjustForm.wallet" class="ul-input ul-select">
              <option value="project">项目钱包</option>
              <option value="dividend">分红钱包</option>
              <option value="reward">奖励钱包</option>
            </select>
          </div>
          <div class="ul-form-group"><label class="ul-label">操作类型</label>
            <select v-model="adjustForm.type" class="ul-input ul-select">
              <option value="add">增加</option>
              <option value="sub">扣减</option>
            </select>
          </div>
        </div>
        <div class="ul-form-group" style="margin-bottom:12px"><label class="ul-label">操作金额（元）</label><input v-model="adjustForm.amount" type="number" min="0.01" step="0.01" class="ul-input" placeholder="请输入正数金额"></div>
        <div class="ul-form-group"><label class="ul-label">操作原因 <span style="color:var(--danger)">*</span></label><textarea v-model="adjustForm.reason" class="ul-input" rows="3" style="height:auto;resize:vertical" placeholder="请填写操作原因（必填，最多200字）" maxlength="200"></textarea></div>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:10px;padding:14px 20px;border-top:1px solid var(--border)">
        <button class="btn btn-default" @click="adjustVisible=false">取消</button>
        <button class="btn btn-primary" :disabled="!adjustForm.reason||!adjustForm.amount" @click="doAdjust">确认操作</button>
      </div>
    </div>

    <!-- 操作日志抽屉 -->
    <div class="ul-overlay" :class="{show:logVisible}" @click="logVisible=false"></div>
    <div class="ul-drawer" :class="{show:logVisible}" style="width:560px">
      <div class="ul-drawer-header">
        <div style="font-size:15px;font-weight:700">操作日志</div>
        <button class="ul-icon-btn" @click="logVisible=false"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <div style="flex:1;overflow-y:auto;padding:16px">
        <table class="uw-log-table">
          <thead><tr><th>操作时间</th><th>操作人</th><th>操作类型</th><th>钱包</th><th>金额</th><th>操作前余额</th><th>操作后余额</th><th>原因</th></tr></thead>
          <tbody>
            <tr v-for="log in mockLogs" :key="log.id">
              <td style="white-space:nowrap;font-size:11px;color:var(--text-muted)">{{ log.time }}</td>
              <td><span class="ul-mono" style="font-size:11px">{{ log.operator }}</span></td>
              <td><span class="badge" :class="log.type==='增加'?'badge-success':'badge-warning'" style="font-size:10px">{{ log.type }}</span></td>
              <td><span class="tag tag-blue" style="font-size:10px">{{ log.wallet }}</span></td>
              <td class="ul-mono" style="font-size:12px;font-weight:600;color:var(--success)">¥{{ log.amount }}</td>
              <td class="ul-mono" style="font-size:11px;color:var(--text-muted)">¥{{ log.before }}</td>
              <td class="ul-mono" style="font-size:11px;color:var(--text-muted)">¥{{ log.after }}</td>
              <td style="font-size:11px;max-width:100px;word-break:break-all">{{ log.reason }}</td>
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
import PrdTipMarker from '@/components/prd/PrdTipMarker.vue'
import { useAdminPrdTips } from '@/composables/useAdminPrdTips'
import { ref, computed, onMounted } from 'vue'

const { bundle, opsTipId, prdTipAnchorRef, prdTipFilterRef, prdTipOpsRef } = useAdminPrdTips()

interface WalletItem {
  userId:string; nickname:string; mobile:string
  totalWithdraw:number; availableBalance:number
  projectTotal:number; projectSettled:number; projectPending:number; projectWithdraw:number; projectBalance:number
  dividendTotal:number; dividendSettled:number; dividendPending:number; dividendWithdraw:number; dividendBalance:number
  rewardTotal:number; rewardSettled:number; rewardPending:number; rewardWithdraw:number; rewardBalance:number
  updatedAt:string
}
interface Toast { id:number; msg:string; type:string }

const loading = ref(false)
const list = ref<WalletItem[]>([])
const total = ref(0); const page = ref(1); const pageSize = ref(20)
const filterExpanded = ref(false)
const adjustVisible = ref(false); const adjustTarget = ref<WalletItem|null>(null)
const logVisible = ref(false)
const toasts = ref<Toast[]>([]); let toastId = 0
const f = ref({ userId:'', mobile:'', nickname:'', updStart:'', updEnd:'' })
const adjustForm = ref({ wallet:'project', type:'add', amount:'', reason:'' })

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
const paginationPages = computed(() => {
  const t = totalPages.value, c = page.value; const pages:(number|string)[] = []
  if (t <= 7) { for (let i=1;i<=t;i++) pages.push(i); return pages }
  pages.push(1); if (c > 3) pages.push('...')
  for (let i=Math.max(2,c-1);i<=Math.min(t-1,c+1);i++) pages.push(i)
  if (c < t-2) pages.push('...'); pages.push(t); return pages
})

function rnd(base:number, range:number) { return parseFloat((base + Math.random()*range).toFixed(2)) }
function mockList(n=20): WalletItem[] {
  const nicks = ['张三','李创作','王大力','赵小花','孙胖胖','钱多多','周小美','吴峰','郑达人','林清华']
  return Array.from({length:n},(_,i)=>{
    const idx = (page.value-1)*pageSize.value + i + 1
    const pT=rnd(500,9500), pS=rnd(pT*0.7,pT*0.2), pW=rnd(pS*0.5,pS*0.3), pB=parseFloat((pS-pW).toFixed(2))
    const dT=rnd(100,3000), dS=rnd(dT*0.6,dT*0.3), dW=rnd(dS*0.4,dS*0.4), dB=parseFloat((dS-dW).toFixed(2))
    const rT=rnd(50,2000), rS=rnd(rT*0.5,rT*0.4), rW=rnd(rS*0.3,rS*0.5), rB=parseFloat((rS-rW).toFixed(2))
    return {
      userId:`U${10024+idx}`, nickname:nicks[idx%10], mobile:`138${String(10000000+idx*7777).slice(0,8)}`,
      totalWithdraw:parseFloat((pW+dW+rW).toFixed(2)), availableBalance:parseFloat((pB+dB+rB).toFixed(2)),
      projectTotal:pT, projectSettled:pS, projectPending:parseFloat((pT-pS).toFixed(2)), projectWithdraw:pW, projectBalance:pB,
      dividendTotal:dT, dividendSettled:dS, dividendPending:parseFloat((dT-dS).toFixed(2)), dividendWithdraw:dW, dividendBalance:dB,
      rewardTotal:rT, rewardSettled:rS, rewardPending:parseFloat((rT-rS).toFixed(2)), rewardWithdraw:rW, rewardBalance:rB,
      updatedAt:`2026-0${(idx%3)+1}-${String((idx%28)+1).padStart(2,'0')} ${String(8+(idx%12)).padStart(2,'0')}:${String(idx%60).padStart(2,'0')}`,
    }
  })
}

const mockLogs = [
  {id:1,time:'2026-04-20 14:30:00',operator:'admin01',type:'增加',wallet:'项目钱包',amount:'500.00',before:'1200.00',after:'1700.00',reason:'后台调整补偿'},
  {id:2,time:'2026-04-18 09:15:00',operator:'admin02',type:'扣减',wallet:'分红钱包',amount:'200.00',before:'800.00',after:'600.00',reason:'错误数据修正'},
  {id:3,time:'2026-04-15 16:45:00',operator:'admin01',type:'增加',wallet:'奖励钱包',amount:'300.00',before:'0.00',after:'300.00',reason:'活动奖励发放'},
]

async function fetchList(p=1) {
  loading.value=true; page.value=p
  await new Promise(r=>setTimeout(r,200))
  list.value=mockList(pageSize.value); total.value=8432; loading.value=false
}
function resetFilter() { f.value={userId:'',mobile:'',nickname:'',updStart:'',updEnd:''}; fetchList(1) }
function openAdjust(row:WalletItem) { adjustTarget.value=row; adjustForm.value={wallet:'project',type:'add',amount:'',reason:''}; adjustVisible.value=true }
function openLog(row:WalletItem) { adjustTarget.value=row; logVisible.value=true }
function doAdjust() { adjustVisible.value=false; showToast('余额调整成功','success') }
function showToast(msg:string,type='info') { const id=++toastId; toasts.value.push({id,msg,type}); setTimeout(()=>removeToast(id),3000) }
function removeToast(id:number) { toasts.value=toasts.value.filter(t=>t.id!==id) }
onMounted(()=>fetchList())
</script>

<style>
.uw-wrap { min-height:100%; }
.uw-table-wrap { overflow-x:auto; }
.uw-table { width:100%; border-collapse:collapse; font-size:12.5px; }
.uw-table th { padding:10px 12px; text-align:left; font-size:11px; font-weight:600; color:var(--text-muted); background:var(--surface-hover); border-bottom:1px solid var(--border); white-space:nowrap; }
.uw-table td { padding:10px 12px; border-bottom:1px solid var(--border); color:var(--text-primary); vertical-align:top; }
.uw-table tr:last-child td { border-bottom:none; }
.uw-table .ul-row:hover td { background:rgba(37,99,235,.03); }
.uw-wallet-cell { display:flex; flex-direction:column; gap:2px; }
.uw-wallet-total { font-size:12px; color:var(--text-secondary); }
.uw-wallet-total strong { color:var(--text-primary); }
.uw-wallet-sub { font-size:10px; color:var(--text-muted); }
.uw-balance { color:var(--success); font-weight:600; }
.uw-wallet-badge { background:var(--surface-hover); border-radius:var(--radius); padding:10px 12px; border:1px solid var(--border); }
.uw-log-table { width:100%; border-collapse:collapse; font-size:12px; }
.uw-log-table th { padding:8px 10px; text-align:left; font-size:11px; font-weight:600; color:var(--text-muted); background:var(--surface-hover); border-bottom:1px solid var(--border); white-space:nowrap; }
.uw-log-table td { padding:8px 10px; border-bottom:1px solid var(--border); vertical-align:middle; }
.uw-log-table tr:last-child td { border-bottom:none; }
</style>
