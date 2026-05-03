<template>
  <div class="gw-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">用户管理</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">赠词记录</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <div ref="prdTipAnchorRef" class="page-header-title-anchor">
            <h1 class="page-title">赠词记录</h1>
          </div>
          <p class="page-desc">用户关键词赠送流水</p>
        </div>
        <button class="btn btn-default btn-sm" @click="showToast('正在导出 Excel…','info')">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          导出
        </button>
      </div>

      <!-- 筛选 -->
      <div ref="prdTipFilterRef" class="glass-card bl-filter">
        <div class="ul-filter-grid">
          <div class="ul-form-group"><label class="ul-label">赠送用户ID</label><input v-model="f.fromUserId" class="ul-input" placeholder="请输入赠送方用户ID"></div>
          <div class="ul-form-group"><label class="ul-label">接收用户ID</label><input v-model="f.toUserId" class="ul-input" placeholder="请输入接收方用户ID"></div>
          <div class="ul-form-group"><label class="ul-label">项目ID</label><input v-model="f.projectId" class="ul-input" placeholder="请输入项目ID"></div>
          <div class="ul-form-group"><label class="ul-label">关键词</label><input v-model="f.keyword" class="ul-input" placeholder="请输入关键词"></div>
          <div class="ul-form-group"><label class="ul-label">赠送状态</label>
            <select v-model="f.status" class="ul-input ul-select">
              <option value="">全部</option><option>未接收</option><option>已接收</option><option>已失效</option>
            </select>
          </div>
          <div class="ul-form-group"><label class="ul-label">赠送开始时间</label><input v-model="f.startDate" type="date" class="ul-input"></div>
          <div class="ul-form-group"><label class="ul-label">赠送结束时间</label><input v-model="f.endDate" type="date" class="ul-input"></div>
        </div>
        <div class="ul-filter-footer">
          <span></span>
          <div style="display:flex;gap:8px">
            <button class="btn btn-default btn-sm" @click="resetFilter">重置</button>
            <button class="btn btn-primary btn-sm" @click="fetchList()">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              查询
            </button>
          </div>
        </div>
      </div>

      <!-- 数据表 -->
      <div class="glass-card table-card">
        <div class="table-header">
          <div class="table-title">赠词记录<span class="table-count">共 {{ total }} 条</span></div>
        </div>
        <div class="gw-table-wrap">
          <table class="gw-table">
            <colgroup>
              <col style="width:70px">
              <col style="width:200px">
              <col style="width:140px">
              <col style="width:110px">
              <col style="width:110px">
              <col style="width:100px">
              <col style="width:160px">
            </colgroup>
            <thead>
              <tr>
                <th>序号</th>
                <th>项目信息</th>
                <th>赠送关键词</th>
                <th>赠送用户ID</th>
                <th>接收用户ID</th>
                <th>状态</th>
                <th>赠送时间</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="loading">
                <tr v-for="i in 8" :key="i"><td colspan="7"><div class="ul-skeleton"></div></td></tr>
              </template>
              <template v-else>
                <tr v-for="row in list" :key="row.id" class="ul-row">
                  <td class="ul-muted">{{ row.no }}</td>
                  <td>
                    <div class="ul-mono" style="font-size:12px">{{ row.projectId }}</div>
                    <div style="font-size:12px;color:var(--text-secondary);margin-top:1px">{{ row.projectName }}</div>
                  </td>
                  <td>
                    <span class="tag" :class="row.kwTagClass">{{ row.keyword }}</span>
                  </td>
                  <td><span class="ul-mono">{{ row.fromUserId }}</span></td>
                  <td><span class="ul-mono">{{ row.toUserId }}</span></td>
                  <td>
                    <span class="badge" :class="{已接收:'badge-success',未接收:'badge-warning',已失效:'badge-gray'}[row.status]||'badge-gray'">
                      {{ row.status }}
                    </span>
                  </td>
                  <td class="ul-muted">{{ row.sendTime }}</td>
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

interface GiftItem { id:string; no:number; projectId:string; projectName:string; keyword:string; kwTagClass:string; fromUserId:string; toUserId:string; status:string; sendTime:string }
interface Toast { id:number; msg:string; type:string }

const loading = ref(false)
const list = ref<GiftItem[]>([])
const total = ref(0); const page = ref(1); const pageSize = ref(20)
const toasts = ref<Toast[]>([]); let toastId = 0
const f = ref({ fromUserId:'', toUserId:'', projectId:'', keyword:'', status:'', startDate:'', endDate:'' })

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
const paginationPages = computed(() => {
  const arr: number[] = []; const s = Math.max(1, page.value-2); const e = Math.min(totalPages.value, page.value+2)
  for (let i=s; i<=e; i++) arr.push(i); return arr
})

const PROJECTS = [
  { id:'P2024001', name:'剪映海外推广项目' },
  { id:'P2024002', name:'番茄小说推广项目' },
  { id:'P2024003', name:'抖音创作者计划' },
  { id:'P2024004', name:'爱奇艺VIP推广' },
  { id:'P2024005', name:'西瓜视频推广项目' },
]
const KEYWORDS = [
  { kw:'剪映专业版', cls:'tag-blue' }, { kw:'番茄免费小说', cls:'tag-amber' }, { kw:'CapCut Pro', cls:'tag-purple' },
  { kw:'抖音创作者', cls:'tag-green' }, { kw:'爱奇艺VIP', cls:'tag-red' },
]
const STATUSES = ['已接收','已接收','已接收','未接收','已失效']

function mockList(n=20): GiftItem[] {
  return Array.from({length:n}, (_,i) => {
    const proj = PROJECTS[i%5]; const kw = KEYWORDS[i%5]
    return {
      id: `GW${1000+i}`, no: 1001+i, projectId: proj.id, projectName: proj.name,
      keyword: kw.kw, kwTagClass: kw.cls,
      fromUserId: `U${10024 + (i*13)%200}`, toUserId: `U${10085 + (i*17)%200}`,
      status: STATUSES[i%5],
      sendTime: `2026-04-${String(20-(i%15)).padStart(2,'0')} ${String(8+i%12).padStart(2,'0')}:${String(i%60).padStart(2,'0')}`
    }
  })
}

async function fetchList(p=1) {
  loading.value=true; page.value=p
  await new Promise(r=>setTimeout(r,180))
  list.value = mockList(); total.value = 2480
  loading.value=false
}
function resetFilter() { f.value={fromUserId:'',toUserId:'',projectId:'',keyword:'',status:'',startDate:'',endDate:''}; fetchList() }
function showToast(msg:string, type='info') { const id=++toastId; toasts.value.push({id,msg,type}); setTimeout(()=>removeToast(id),3000) }
function removeToast(id:number) { toasts.value=toasts.value.filter(t=>t.id!==id) }
onMounted(()=>fetchList())
</script>

<style>
.gw-wrap { min-height:100%; }
.gw-table-wrap { overflow-x:auto; }
.gw-table { width:100%; border-collapse:collapse; table-layout:fixed; font-size:13px; }
.gw-table th { padding:10px 12px; text-align:left; font-size:11px; font-weight:600; color:var(--text-muted); background:var(--surface-hover); border-bottom:1px solid var(--border); white-space:nowrap; }
.gw-table td { padding:10px 12px; border-bottom:1px solid var(--border); color:var(--text-primary); vertical-align:middle; }
.gw-table tr:last-child td { border-bottom:none; }
.gw-table .ul-row:hover td { background:rgba(37,99,235,.03); }
</style>
