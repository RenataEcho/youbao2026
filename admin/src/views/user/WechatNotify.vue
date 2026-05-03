<template>
  <div class="wn-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">用户通知</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">微信通知</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <div ref="prdTipAnchorRef" class="page-header-title-anchor">
            <h1 class="page-title">微信通知</h1>
          </div>
          <p class="page-desc">记录向用户发送微信通知的日志</p>
        </div>
        <button class="btn btn-primary btn-sm" @click="openCreate">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          新增
        </button>
      </div>

      <!-- 筛选 -->
      <div ref="prdTipFilterRef" class="glass-card bl-filter">
        <div class="ul-filter-grid">
          <div class="ul-form-group"><label class="ul-label">标题</label><input v-model="f.title" class="ul-input" placeholder="模糊搜索标题"></div>
          <div class="ul-form-group">
            <label class="ul-label">通知类型</label>
            <select v-model="f.notifyType" class="ul-input ul-select">
              <option value="">全部</option>
              <option value="关键词预警">关键词预警</option>
              <option value="项目上线">项目上线</option>
              <option value="账号绑定">账号绑定</option>
              <option value="提现到账">提现到账</option>
              <option value="工单处理">工单处理</option>
            </select>
          </div>
          <div class="ul-form-group"><label class="ul-label">操作人</label><input v-model="f.operator" class="ul-input" placeholder="管理员ID"></div>
          <template v-if="filterExpanded">
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
          <div class="table-title">微信通知<span class="table-count">共 {{ total.toLocaleString() }} 条</span></div>
        </div>
        <div class="wn-table-wrap">
          <table class="wn-table">
            <colgroup>
              <col style="width:70px">
              <col style="min-width:200px">
              <col style="min-width:110px">
              <col style="min-width:160px">
              <col style="min-width:90px">
              <col style="min-width:130px">
              <col style="width:90px">
            </colgroup>
            <thead>
              <tr>
                <th>序号</th>
                <th>标题</th>
                <th>通知类型</th>
                <th>通知用户</th>
                <th>操作人</th>
                <th>创建时间</th>
                <th ref="prdTipOpsRef" class="col-action" style="text-align:center">操作</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="loading">
                <tr v-for="i in 10" :key="i"><td colspan="7"><div class="ul-skeleton"></div></td></tr>
              </template>
              <template v-else-if="list.length===0">
                <tr><td colspan="7"><div class="ul-empty">暂无通知记录</div></td></tr>
              </template>
              <template v-else>
                <tr v-for="row in list" :key="row.id" class="ul-row">
                  <td class="ul-muted" style="font-size:12px;text-align:center">{{ row.id }}</td>
                  <td style="font-size:13px;font-weight:500">{{ row.title }}</td>
                  <td>
                    <span class="tag" :class="ntClass(row.notifyType)" style="font-size:11px">{{ row.notifyType }}</span>
                  </td>
                  <td style="font-size:12px">
                    <span v-if="row.ownerType==='all'" class="tag tag-blue" style="font-size:11px">全量用户</span>
                    <span v-else-if="row.ownerType==='group'" class="tag tag-purple" style="font-size:11px">{{ row.ownerValue }}</span>
                    <span v-else class="ul-mono" style="font-size:11px;color:var(--text-secondary)">{{ row.ownerValue }}</span>
                  </td>
                  <td><span class="ul-mono" style="font-size:12px;color:var(--text-muted)">{{ row.operator }}</span></td>
                  <td class="ul-muted" style="font-size:11px">{{ row.createTime }}</td>
                  <td class="col-action">
                    <div class="action-btns">
                      <button type="button" class="action-btn view" title="查看" @click="openView(row)">查看</button>
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

    <!-- 查看弹窗 -->
    <div class="ul-overlay" :class="{show:viewVisible}" @click="viewVisible=false"></div>
    <div class="ul-modal" :class="{show:viewVisible}" style="width:560px">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid var(--border)">
        <div style="font-size:15px;font-weight:700">通知详情</div>
        <button class="ul-icon-btn" @click="viewVisible=false"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <div v-if="viewTarget" style="padding:20px;display:flex;flex-direction:column;gap:12px">
        <div class="wn-detail-row"><span class="wn-detail-label">序号</span><span class="wn-detail-val">{{ viewTarget.id }}</span></div>
        <div class="wn-detail-row"><span class="wn-detail-label">标题</span><span class="wn-detail-val" style="font-weight:600">{{ viewTarget.title }}</span></div>
        <div class="wn-detail-row"><span class="wn-detail-label">通知类型</span><span class="wn-detail-val"><span class="tag" :class="ntClass(viewTarget.notifyType)">{{ viewTarget.notifyType }}</span></span></div>
        <div class="wn-detail-row">
          <span class="wn-detail-label">通知用户</span>
          <span class="wn-detail-val">
            <span v-if="viewTarget.ownerType==='all'" class="tag tag-blue">全量用户</span>
            <span v-else-if="viewTarget.ownerType==='group'" class="tag tag-purple">{{ viewTarget.ownerValue }}</span>
            <span v-else class="ul-mono">{{ viewTarget.ownerValue }}</span>
          </span>
        </div>
        <div class="wn-detail-row"><span class="wn-detail-label">操作人</span><span class="wn-detail-val ul-mono">{{ viewTarget.operator }}</span></div>
        <div class="wn-detail-row"><span class="wn-detail-label">创建时间</span><span class="wn-detail-val ul-muted">{{ viewTarget.createTime }}</span></div>
      </div>
      <div style="display:flex;justify-content:flex-end;padding:14px 20px;border-top:1px solid var(--border)">
        <button class="btn btn-default" @click="viewVisible=false">关闭</button>
      </div>
    </div>

    <!-- 删除确认弹窗 -->
    <div class="ul-overlay" :class="{show:deleteVisible}" @click.self="()=>{}"></div>
    <div class="ul-modal" :class="{show:deleteVisible}" style="width:420px">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid var(--border)">
        <div style="font-size:15px;font-weight:700;color:var(--danger)">确认删除</div>
        <button class="ul-icon-btn" @click="deleteVisible=false"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <div style="padding:20px;font-size:13px;color:var(--text-secondary);line-height:1.6">确认删除该条微信通知记录？此操作不可撤销。</div>
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
import PrdTipMarker from '@/components/prd/PrdTipMarker.vue'
import { useAdminPrdTips } from '@/composables/useAdminPrdTips'
import { ref, computed, onMounted } from 'vue'

const { bundle, opsTipId, prdTipAnchorRef, prdTipFilterRef, prdTipOpsRef } = useAdminPrdTips()

interface NotifyItem { id:number; title:string; notifyType:string; ownerType:string; ownerValue:string; operator:string; createTime:string }
interface Toast { id:number; msg:string; type:string }

const loading = ref(false)
const list = ref<NotifyItem[]>([])
const total = ref(0); const page = ref(1); const pageSize = ref(20)
const filterExpanded = ref(false)
const viewVisible = ref(false); const viewTarget = ref<NotifyItem|null>(null)
const deleteVisible = ref(false); const deleteTarget = ref<NotifyItem|null>(null)
const toasts = ref<Toast[]>([]); let toastId = 0
const f = ref({ title:'', notifyType:'', operator:'', startTime:'', endTime:'' })

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
const paginationPages = computed(() => {
  const t=totalPages.value,c=page.value; const p:(number|string)[]=[]
  if(t<=7){for(let i=1;i<=t;i++)p.push(i);return p}
  p.push(1);if(c>3)p.push('...')
  for(let i=Math.max(2,c-1);i<=Math.min(t-1,c+1);i++)p.push(i)
  if(c<t-2)p.push('...');p.push(t);return p
})

const NOTIFY_TYPES = ['关键词预警','项目上线','账号绑定','提现到账','工单处理']
const TITLES = ['关键词「番茄」出现异常，请及时处理','项目「红果短剧2.0」已成功上线','用户媒体账号绑定成功通知','您的提现申请已到账，请查收','您的工单已处理完成']
const OWNER_TYPES: Array<'all'|'group'|'user'> = ['all','group','user','user','all']
const OWNER_VALS = ['','核心高级会员','U10024','U10025,U10026','']
const OPS = ['admin01','admin02','admin03','admin01','admin02']

function mockList(n=20): NotifyItem[] {
  return Array.from({length:n},(_,i)=>{
    const idx = (page.value-1)*pageSize.value+i+1
    const d = new Date(1681000000000+idx*3600000*4)
    const fmt = (d:Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
    return {
      id:idx, title:TITLES[idx%5], notifyType:NOTIFY_TYPES[idx%5],
      ownerType:OWNER_TYPES[idx%5], ownerValue:OWNER_VALS[idx%5],
      operator:OPS[idx%5], createTime:fmt(d)
    }
  })
}
function ntClass(t:string) {
  return {关键词预警:'tag-danger',项目上线:'tag-green',账号绑定:'tag-blue',提现到账:'tag-amber',工单处理:'tag-purple'}[t]||'tag-gray'
}

async function fetchList(p=1) {
  loading.value=true; page.value=p
  await new Promise(r=>setTimeout(r,200))
  list.value=mockList(pageSize.value); total.value=5280; loading.value=false
}
function resetFilter() { f.value={title:'',notifyType:'',operator:'',startTime:'',endTime:''}; fetchList(1) }
function openCreate() { showToast('新增微信通知（Mock）','info') }
function openView(row:NotifyItem) { viewTarget.value=row; viewVisible.value=true }
function confirmDelete(row:NotifyItem) { deleteTarget.value=row; deleteVisible.value=true }
function doDelete() { list.value=list.value.filter(r=>r.id!==deleteTarget.value?.id); deleteVisible.value=false; showToast('删除成功','success') }
function showToast(msg:string,type='info') { const id=++toastId;toasts.value.push({id,msg,type});setTimeout(()=>removeToast(id),3000) }
function removeToast(id:number) { toasts.value=toasts.value.filter(t=>t.id!==id) }
onMounted(()=>fetchList())
</script>

<style>
.wn-wrap { min-height:100%; }
.wn-table-wrap { overflow-x:auto; }
.wn-table { width:100%; border-collapse:collapse; font-size:13px; }
.wn-table th { padding:10px 12px; text-align:left; font-size:11px; font-weight:600; color:var(--text-muted); background:var(--surface-hover); border-bottom:1px solid var(--border); white-space:nowrap; }
.wn-table td { padding:10px 12px; border-bottom:1px solid var(--border); color:var(--text-primary); vertical-align:middle; }
.wn-table tr:last-child td { border-bottom:none; }
.wn-table .ul-row:hover td { background:rgba(37,99,235,.03); }
.wn-detail-row { display:flex; gap:12px; font-size:13px; }
.wn-detail-label { width:72px; flex-shrink:0; color:var(--text-muted); font-size:12px; padding-top:2px; }
.wn-detail-val { flex:1; color:var(--text-primary); }
</style>
