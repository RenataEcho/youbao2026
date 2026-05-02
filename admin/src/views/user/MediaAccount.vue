<template>
  <div class="ma-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">用户管理</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">媒体账号</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">媒体账号</h1>
          <p class="page-desc">维护用户各媒体平台账号的信息记录，支持批量导入与管理</p>
        </div>
      </div>

      <!-- 筛选 -->
      <div class="glass-card bl-filter">
        <div class="ul-filter-grid">
          <div class="ul-form-group">
            <label class="ul-label">用户ID</label>
            <input v-model="filters.userId" type="text" class="ul-input" placeholder="请输入用户ID">
          </div>
          <div class="ul-form-group">
            <label class="ul-label">媒体平台</label>
            <select v-model="filters.platform" class="ul-input ul-select">
              <option value="">全部平台</option>
              <option>抖音</option><option>快手</option><option>哔哩哔哩</option>
              <option>小红书</option><option>TikTok</option><option>YouTube</option><option>其他</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">账号类型</label>
            <select v-model="filters.type" class="ul-input ul-select">
              <option value="">全部类型</option>
              <option>混剪</option><option>真人出镜</option><option>图文</option><option>其他</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">状态</label>
            <select v-model="filters.status" class="ul-input ul-select">
              <option value="">全部状态</option>
              <option>正常</option><option>禁用</option><option>用户删除</option><option>后台删除</option>
            </select>
          </div>
          <template v-if="filterExpanded">
            <div class="ul-form-group">
              <label class="ul-label">账号昵称</label>
              <input v-model="filters.name" type="text" class="ul-input" placeholder="模糊搜索昵称">
            </div>
            <div class="ul-form-group">
              <label class="ul-label">账号ID</label>
              <input v-model="filters.accountId" type="text" class="ul-input" placeholder="请输入账号ID">
            </div>
            <div class="ul-form-group">
              <label class="ul-label">创建时间起</label>
              <input v-model="filters.startDate" type="date" class="ul-input">
            </div>
            <div class="ul-form-group">
              <label class="ul-label">创建时间止</label>
              <input v-model="filters.endDate" type="date" class="ul-input">
            </div>
          </template>
        </div>
        <div class="ul-filter-footer">
          <button class="ul-expand-btn" :class="{expanded:filterExpanded}" @click="filterExpanded=!filterExpanded">
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

      <!-- 表格 -->
      <div class="glass-card table-card">
        <div class="table-header">
          <div class="table-title">
            媒体账号列表
            <span class="table-count">共 {{ total }} 条</span>
          </div>
          <div v-if="selectedIds.length===0" class="table-header-right">
            <button class="btn btn-default btn-sm" @click="showToast('请选择批量导入文件','info')">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              批量导入
            </button>
          </div>
          <div v-else class="ul-bulk-bar">
            <span style="font-size:13px;color:var(--text-primary)">已选 <strong style="color:var(--primary)">{{ selectedIds.length }}</strong> 项</span>
            <button class="btn btn-danger btn-sm" @click="showToast('批量删除功能','info')">批量删除</button>
            <button class="btn btn-default btn-sm" @click="selectedIds=[]">取消</button>
          </div>
        </div>
        <div class="ul-table-wrap">
          <table class="ul-table">
            <colgroup>
              <col style="width:36px"><col style="width:50px"><col style="width:9%">
              <col style="width:9%"><col style="width:9%"><col style="min-width:120px">
              <col style="width:12%"><col style="width:13%"><col style="width:8%">
              <col style="width:11%"><col style="width:10%"><col style="width:80px">
            </colgroup>
            <thead>
              <tr>
                <th><input type="checkbox" :checked="allSelected" style="accent-color:var(--primary)" @change="toggleAll"></th>
                <th>序号</th>
                <th>用户ID</th>
                <th>媒体平台</th>
                <th>账号类型</th>
                <th>账号昵称</th>
                <th>账号ID</th>
                <th>主页链接</th>
                <th>状态</th>
                <th>创建时间</th>
                <th>删除时间</th>
                <th class="col-action" style="text-align:center">操作</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="loading">
                <tr v-for="i in 8" :key="i"><td colspan="12"><div class="ul-skeleton"></div></td></tr>
              </template>
              <template v-else-if="list.length===0">
                <tr><td colspan="12">
                  <div class="ul-empty">
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="0.9"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
                    <div style="font-size:14px;font-weight:600;color:var(--text-secondary);margin:8px 0 4px">暂无媒体账号数据</div>
                  </div>
                </td></tr>
              </template>
              <template v-else>
                <tr v-for="(row,idx) in list" :key="row.id" class="ul-row" :class="{'ul-row-selected':selectedIds.includes(row.id)}">
                  <td @click.stop><input type="checkbox" :checked="selectedIds.includes(row.id)" style="accent-color:var(--primary)" @change="toggleRow(row.id)"></td>
                  <td class="ul-muted">{{ (page-1)*pageSize+idx+1 }}</td>
                  <td><span class="ul-mono">{{ row.userId }}</span></td>
                  <td>
                    <span class="tag" :class="getPlatformTagClass(row.platform)">{{ row.platform }}</span>
                  </td>
                  <td><span class="tag tag-gray">{{ row.accountType }}</span></td>
                  <td style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:160px" :title="row.name">{{ row.name }}</td>
                  <td><span class="ul-mono" style="font-size:11.5px">{{ row.accountId }}</span></td>
                  <td>
                    <a v-if="row.homeUrl" :href="row.homeUrl" target="_blank" style="color:var(--primary);font-size:12px;text-decoration:none" title="打开主页">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:3px;vertical-align:middle"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      查看
                    </a>
                    <span v-else class="ul-muted">—</span>
                  </td>
                  <td>
                    <span class="badge" :class="getStatusClass(row.status)">{{ row.status }}</span>
                  </td>
                  <td><span class="ul-muted" style="font-size:11.5px">{{ row.createdAt }}</span></td>
                  <td><span class="ul-muted" style="font-size:11.5px">{{ row.deletedAt || '—' }}</span></td>
                  <td class="col-action" @click.stop>
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
    </div>

    <!-- 编辑弹窗 -->
    <div class="ul-overlay" :class="{show:editVisible}" @click="editVisible=false"></div>
    <div class="ul-modal bl-modal" :class="{show:editVisible}">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--border)">
        <div style="font-size:15px;font-weight:700;color:var(--text-primary)">编辑媒体账号</div>
        <button class="ul-icon-btn" @click="editVisible=false"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <div style="padding:20px;display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div class="ul-form-group">
          <label class="ul-label">媒体平台</label>
          <select v-model="editForm.platform" class="ul-input ul-select">
            <option>抖音</option><option>快手</option><option>哔哩哔哩</option>
            <option>小红书</option><option>TikTok</option><option>YouTube</option><option>其他</option>
          </select>
        </div>
        <div class="ul-form-group">
          <label class="ul-label">账号类型</label>
          <select v-model="editForm.accountType" class="ul-input ul-select">
            <option>混剪</option><option>真人出镜</option><option>图文</option><option>其他</option>
          </select>
        </div>
        <div class="ul-form-group">
          <label class="ul-label">账号昵称</label>
          <input v-model="editForm.name" type="text" class="ul-input" placeholder="账号昵称">
        </div>
        <div class="ul-form-group">
          <label class="ul-label">账号ID</label>
          <input v-model="editForm.accountId" type="text" class="ul-input" placeholder="媒体平台账号ID">
        </div>
        <div style="grid-column:1/-1" class="ul-form-group">
          <label class="ul-label">主页链接</label>
          <input v-model="editForm.homeUrl" type="url" class="ul-input" placeholder="https://...">
        </div>
        <div class="ul-form-group">
          <label class="ul-label">状态</label>
          <select v-model="editForm.status" class="ul-input ul-select">
            <option>正常</option><option>禁用</option><option>用户删除</option><option>后台删除</option>
          </select>
        </div>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:10px;padding:14px 20px;border-top:1px solid var(--border)">
        <button class="btn btn-default" @click="editVisible=false">取消</button>
        <button class="btn btn-primary" @click="saveEdit">保存</button>
      </div>
    </div>

    <!-- 删除确认 -->
    <div class="ul-overlay" :class="{show:deleteVisible}" @click="deleteVisible=false"></div>
    <div class="ul-modal" :class="{show:deleteVisible}">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--border)">
        <div style="font-size:15px;font-weight:700;color:var(--danger)">确认删除</div>
        <button class="ul-icon-btn" @click="deleteVisible=false"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <div style="padding:20px"><p style="font-size:13px;color:var(--text-secondary);line-height:1.6">确认删除该媒体账号？此操作不可撤销。</p></div>
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

interface MediaItem {
  id: number; userId: string; platform: string; accountType: string
  name: string; accountId: string; homeUrl: string; status: string
  createdAt: string; deletedAt: string
}
interface Toast { id:number; msg:string; type:'success'|'error'|'info' }

const PLATFORMS = ['抖音','快手','哔哩哔哩','小红书','TikTok','YouTube','其他']
const TYPES = ['混剪','真人出镜','图文','其他']
const STATUSES = ['正常','禁用','用户删除','后台删除']

const loading = ref(false)
const list = ref<MediaItem[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)
const selectedIds = ref<number[]>([])
const filterExpanded = ref(false)
const filters = ref({ userId:'', platform:'', type:'', status:'', name:'', accountId:'', startDate:'', endDate:'' })
const editVisible = ref(false)
const editForm = ref({ id:0, platform:'', accountType:'', name:'', accountId:'', homeUrl:'', status:'' })
const deleteVisible = ref(false)
const deleteTarget = ref<MediaItem|null>(null)
const toasts = ref<Toast[]>([])
let toastId = 0

const totalPages = computed(() => Math.max(1, Math.ceil(total.value/pageSize.value)))
const allSelected = computed(() => list.value.length>0 && list.value.every(r => selectedIds.value.includes(r.id)))
const paginationPages = computed(() => {
  const arr:number[] = []; const t=totalPages.value; const c=page.value
  const s=Math.max(1,c-2); const e=Math.min(t,c+2)
  for (let i=s; i<=e; i++) arr.push(i); return arr
})

function mockData(count=18): MediaItem[] {
  return Array.from({length:count},(_,i)=>({
    id: i+1, userId:`U${10001+i}`,
    platform: PLATFORMS[i%PLATFORMS.length],
    accountType: TYPES[i%TYPES.length],
    name: ['创意视觉工作室','旅行者小明','短剧达人','美食博主','科技号','生活vlog','学习分享','电影解说','游戏频道','财经分析','健身达人','美妆博主','母婴育儿','职场干货','情感生活','宠物频道','汽车测评','二次元'][i%18],
    accountId: `acc_${100000+i*1337}`,
    homeUrl: i%3===0 ? '' : `https://www.example.com/user/${i+1}`,
    status: STATUSES[i%4===3 ? 3 : i%5===4 ? 1 : 0],
    createdAt: `2026-0${Math.floor(i/5)+1}-${String(i%28+1).padStart(2,'0')} 10:${String(i%60).padStart(2,'0')}:00`,
    deletedAt: STATUSES[i%4===3 ? 3 : i%5===4 ? 1 : 0] === '正常' ? '' : `2026-04-${String(10+i%18).padStart(2,'0')} 09:00:00`,
  }))
}

async function fetchList(p=1) {
  loading.value=true; page.value=p; selectedIds.value=[]
  await new Promise(r=>setTimeout(r,220))
  const data = mockData()
  total.value=data.length; list.value=data; loading.value=false
}

function resetFilter() {
  filters.value = { userId:'', platform:'', type:'', status:'', name:'', accountId:'', startDate:'', endDate:'' }
  fetchList(1)
}
function toggleAll(e:Event) {
  selectedIds.value = (e.target as HTMLInputElement).checked ? list.value.map(r=>r.id) : []
}
function toggleRow(id:number) {
  if (selectedIds.value.includes(id)) selectedIds.value=selectedIds.value.filter(x=>x!==id)
  else selectedIds.value=[...selectedIds.value,id]
}
function openEdit(row:MediaItem) {
  editForm.value={id:row.id, platform:row.platform, accountType:row.accountType, name:row.name, accountId:row.accountId, homeUrl:row.homeUrl, status:row.status}
  editVisible.value=true
}
function saveEdit() { editVisible.value=false; showToast('保存成功','success'); fetchList(page.value) }
function confirmDelete(row:MediaItem) { deleteTarget.value=row; deleteVisible.value=true }
function doDelete() {
  list.value=list.value.filter(r=>r.id!==deleteTarget.value!.id)
  total.value--; deleteVisible.value=false; showToast('已删除','success')
}
function getPlatformTagClass(p:string) {
  const m:Record<string,string>={抖音:'tag-red',快手:'tag-amber',哔哩哔哩:'tag-blue',小红书:'tag-red',TikTok:'tag-purple',YouTube:'tag-red',其他:'tag-gray'}
  return m[p]||'tag-gray'
}
function getStatusClass(s:string) {
  return {正常:'badge-success',禁用:'badge-warning',用户删除:'badge-gray',后台删除:'badge-gray'}[s]||'badge-gray'
}
function showToast(msg:string, type:Toast['type']='info') {
  const id=++toastId; toasts.value.push({id,msg,type}); setTimeout(()=>removeToast(id),3000)
}
function removeToast(id:number) { toasts.value=toasts.value.filter(t=>t.id!==id) }

onMounted(()=>fetchList(1))
</script>

<style>
.ma-wrap { min-height: 100%; }
</style>
