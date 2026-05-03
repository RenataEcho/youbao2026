<template>
  <div class="dv-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">用户资金</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">分红明细</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <div ref="prdTipAnchorRef" class="page-header-title-anchor">
            <h1 class="page-title">分红明细</h1>
          </div>
          <p class="page-desc">查看用户分红收益逐条明细，包含来源订单、分红比例及打款状态</p>
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
          <div class="ul-form-group"><label class="ul-label">来源订单用户ID</label><input v-model="f.sourceUserId" class="ul-input" placeholder="来源订单用户ID"></div>
          <div class="ul-form-group"><label class="ul-label">订单ID</label><input v-model="f.orderId" class="ul-input" placeholder="请输入订单ID"></div>
          <div class="ul-form-group">
            <label class="ul-label">打款状态</label>
            <select v-model="f.paymentStatus" class="ul-input ul-select">
              <option value="">全部</option>
              <option value="unpaid">未打款</option>
              <option value="paid">已打款</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">分红订单关系</label>
            <select v-model="f.relation" class="ul-input ul-select">
              <option v-for="opt in relationFilterOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>
          <template v-if="filterExpanded">
            <div class="ul-form-group">
              <label class="ul-label">来源项目类型</label>
              <select v-model="f.projectType" class="ul-input ul-select">
                <option value="">全部</option>
                <option value="推文">推文</option><option value="短剧">短剧</option>
                <option value="网盘">网盘</option><option value="游戏">游戏</option>
                <option value="海外故事">海外故事</option><option value="海外短剧">海外短剧</option>
              </select>
            </div>
            <div class="ul-form-group"><label class="ul-label">订单产生开始</label><input v-model="f.orderStart" type="date" class="ul-input"></div>
            <div class="ul-form-group"><label class="ul-label">订单产生结束</label><input v-model="f.orderEnd" type="date" class="ul-input"></div>
            <div class="ul-form-group"><label class="ul-label">应打款开始</label><input v-model="f.payStart" type="date" class="ul-input"></div>
            <div class="ul-form-group"><label class="ul-label">应打款结束</label><input v-model="f.payEnd" type="date" class="ul-input"></div>
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
          <div class="table-title">
            分红明细
            <span class="table-count">共 {{ total.toLocaleString() }} 条</span>
          </div>
          <div style="display:flex;gap:12px;font-size:12px;align-items:center">
            <span>未打款：<strong style="color:var(--warning)">{{ unpaidCount.toLocaleString() }}</strong> 笔</span>
            <span>已打款：<strong style="color:var(--success)">{{ paidCount.toLocaleString() }}</strong> 笔</span>
          </div>
        </div>
        <div class="dv-table-wrap">
          <table class="dv-table">
            <colgroup>
              <col style="min-width:160px">
              <col style="min-width:90px">
              <col style="min-width:120px">
              <col style="min-width:90px">
              <col style="min-width:70px">
              <col style="min-width:120px">
              <col style="min-width:90px">
              <col style="min-width:110px">
              <col style="min-width:80px">
              <col style="min-width:150px">
              <col style="min-width:90px">
              <col style="min-width:80px">
              <col style="min-width:120px">
              <col style="min-width:80px">
            </colgroup>
            <thead>
              <tr>
                <th>订单ID</th>
                <th>用户ID</th>
                <th>用户等级</th>
                <th style="text-align:right">来源订单金额</th>
                <th style="text-align:right">分红比例</th>
                <th>订单产生时间</th>
                <th style="text-align:right">分红金额</th>
                <th>来源项目</th>
                <th>项目类型</th>
                <th>来源订单明细</th>
                <th>来源用户ID</th>
                <th>打款状态</th>
                <th>应打款时间</th>
                <th>分红订单关系</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="loading">
                <tr v-for="i in 8" :key="i"><td colspan="14"><div class="ul-skeleton"></div></td></tr>
              </template>
              <template v-else-if="list.length===0">
                <tr><td colspan="14"><div class="ul-empty">暂无分红明细数据</div></td></tr>
              </template>
              <template v-else>
                <tr v-for="row in list" :key="row.orderId" class="ul-row">
                  <td><span class="ul-mono" style="font-size:11px">{{ row.orderId }}</span></td>
                  <td><span class="ul-mono" style="font-size:12px;color:var(--text-secondary)">{{ row.userId }}</span></td>
                  <td>
                    <div style="display:flex;flex-wrap:wrap;gap:3px">
                      <span v-for="lv in row.userLevels" :key="lv" class="tag" :class="lvClass(lv)" style="font-size:10px">{{ lv }}</span>
                    </div>
                  </td>
                  <td style="text-align:right"><span class="ul-mono">¥{{ row.sourceAmount.toFixed(2) }}</span></td>
                  <td style="text-align:right"><span class="ul-mono" style="color:var(--primary)">{{ row.ratio }}%</span></td>
                  <td class="ul-muted" style="font-size:11px">{{ row.orderTime }}</td>
                  <td style="text-align:right"><span class="ul-mono" style="font-weight:600;color:var(--success)">¥{{ row.dividendAmount.toFixed(2) }}</span></td>
                  <td style="font-size:12px;max-width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" :title="row.projectName">{{ row.projectName }}</td>
                  <td><span class="tag" :class="ptClass(row.projectType)" style="font-size:10px">{{ row.projectType }}</span></td>
                  <td><span class="ul-mono" style="font-size:11px;color:var(--text-muted)">{{ row.orderDetail }}</span></td>
                  <td><span class="ul-mono" style="font-size:12px;color:var(--text-muted)">{{ row.sourceUserId }}</span></td>
                  <td>
                    <span class="badge" :class="row.paymentStatus==='已打款'?'badge-success':'badge-warning'" style="font-size:11px">{{ row.paymentStatus }}</span>
                  </td>
                  <td class="ul-muted" style="font-size:11px">{{ row.expectedPayAt }}</td>
                  <td>
                    <span class="tag" :class="relationTagClass(row.relation)" style="font-size:10px">{{ row.relation }}</span>
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

interface DividendItem {
  orderId:string; userId:string; userLevels:string[]; sourceAmount:number; ratio:number
  orderTime:string; dividendAmount:number; projectName:string; projectType:string
  orderDetail:string; sourceUserId:string; paymentStatus:string; expectedPayAt:string; relation:string
}
interface Toast { id:number; msg:string; type:string }

const loading = ref(false)
/** 与后端 dividend_relation 枚举一致；筛选用 v-for 渲染避免遗漏 */
const relationFilterOptions = [
  { value: '', label: '全部' },
  { value: '直邀', label: '直邀' },
  { value: '间邀', label: '间邀' },
  { value: '其他', label: '其他' },
  { value: '直邀团', label: '直邀团' },
  { value: '间邀团', label: '间邀团' },
  { value: '无限团', label: '无限团' },
] as const
const list = ref<DividendItem[]>([])
const total = ref(0); const page = ref(1); const pageSize = ref(20)
const filterExpanded = ref(false)
const unpaidCount = ref(0); const paidCount = ref(0)
const toasts = ref<Toast[]>([]); let toastId = 0
const f = ref({ userId:'', sourceUserId:'', orderId:'', paymentStatus:'', projectType:'', relation:'', orderStart:'', orderEnd:'', payStart:'', payEnd:'' })

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
const paginationPages = computed(() => {
  const t=totalPages.value,c=page.value; const p:(number|string)[]=[]
  if(t<=7){for(let i=1;i<=t;i++)p.push(i);return p}
  p.push(1);if(c>3)p.push('...')
  for(let i=Math.max(2,c-1);i<=Math.min(t-1,c+1);i++)p.push(i)
  if(c<t-2)p.push('...');p.push(t);return p
})

const PROJECTS = ['番茄小说推文项目','红果短剧推广','快看漫画推广','迅雷网盘推广','剪映海外版权','百度网盘推广']
const PTYPES = ['推文','短剧','网盘','游戏','海外故事','海外短剧']
const LVGROUPS = [['个人V1'],['个人V2'],['个人V1','团长V1'],['团长V2'],['个人V3','团长V1'],['个人V2']]
const RELATIONS = ['直邀','间邀','其他','直邀团','间邀团','无限团'] as const

function mockList(n=20): DividendItem[] {
  const relFilter = f.value.relation
  const out: DividendItem[] = []
  let seq = (page.value - 1) * pageSize.value
  while (out.length < n && seq < (page.value - 1) * pageSize.value + n * 200) {
    seq++
    const rel = RELATIONS[seq % RELATIONS.length] as string
    if (relFilter && rel !== relFilter) continue
    const idx = seq
    const ts = 1681000000000+idx*3600000*24
    const expectedTs = ts + 30*24*3600000
    const d = new Date(ts), ed = new Date(expectedTs)
    const fmt = (d:Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
    const src = parseFloat((10+idx*3.7).toFixed(2))
    const ratio = [3,5,8,10,12,15][idx%6]
    const amt = parseFloat((src*ratio/100).toFixed(2))
    const paid = idx%3!==0
    out.push({
      orderId: `${ts}${String(idx%1000).padStart(3,'0')}`,
      userId: `U${10024+(idx*11)%500}`, userLevels: LVGROUPS[idx%6],
      sourceAmount: src, ratio, orderTime: fmt(d),
      dividendAmount: amt, projectName: PROJECTS[idx%6], projectType: PTYPES[idx%6],
      orderDetail: `KW${String(idx*7).padStart(6,'0')}`,
      sourceUserId: `U${10100+(idx*7)%300}`,
      paymentStatus: paid?'已打款':'未打款',
      expectedPayAt: paid?fmt(ed):`预计 ${String(ed.getMonth()+1).padStart(2,'0')}-${String(ed.getDate()).padStart(2,'0')}`,
      relation: rel
    })
  }
  return out
}

function lvClass(lv:string) {
  if(lv.startsWith('个人V1'))return 'tag-blue'
  if(lv.startsWith('个人V2'))return 'tag-indigo'
  if(lv.startsWith('个人V3'))return 'tag-purple'
  if(lv.startsWith('团长V1'))return 'tag-green'
  if(lv.startsWith('团长V2'))return 'tag-teal'
  return 'tag-gray'
}
function ptClass(t:string) {
  return {推文:'tag-blue',短剧:'tag-purple',网盘:'tag-amber',游戏:'tag-green',海外故事:'tag-teal',海外短剧:'tag-pink'}[t]||'tag-gray'
}
/** 分红订单关系：个人直邀/间邀/其他 + 团队直邀团/间邀团/无限团 */
function relationTagClass(r: string) {
  const m: Record<string, string> = {
    直邀: 'tag-blue',
    间邀: 'tag-gray',
    其他: 'tag-gray',
    直邀团: 'tag-green',
    间邀团: 'tag-gray',
    无限团: 'tag-purple',
  }
  return m[r] || 'tag-gray'
}

async function fetchList(p=1) {
  loading.value=true; page.value=p
  await new Promise(r=>setTimeout(r,200))
  list.value=mockList(pageSize.value); total.value=24680
  unpaidCount.value=8234; paidCount.value=16446; loading.value=false
}
function resetFilter() { f.value={userId:'',sourceUserId:'',orderId:'',paymentStatus:'',projectType:'',relation:'',orderStart:'',orderEnd:'',payStart:'',payEnd:''}; fetchList(1) }
function showToast(msg:string,type='info') { const id=++toastId;toasts.value.push({id,msg,type});setTimeout(()=>removeToast(id),3000) }
function removeToast(id:number) { toasts.value=toasts.value.filter(t=>t.id!==id) }
onMounted(()=>fetchList())
</script>

<style>
.dv-wrap { min-height:100%; }
.dv-table-wrap { overflow-x:auto; }
.dv-table { width:100%; border-collapse:collapse; font-size:12.5px; white-space:nowrap; }
.dv-table th { padding:10px 10px; text-align:left; font-size:11px; font-weight:600; color:var(--text-muted); background:var(--surface-hover); border-bottom:1px solid var(--border); }
.dv-table td { padding:9px 10px; border-bottom:1px solid var(--border); color:var(--text-primary); vertical-align:middle; }
.dv-table tr:last-child td { border-bottom:none; }
.dv-table .ul-row:hover td { background:rgba(37,99,235,.03); }
</style>
