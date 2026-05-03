<template>
  <div class="wa-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">用户管理</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">提现账户</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <div ref="prdTipAnchorRef" class="page-header-title-anchor">
            <h1 class="page-title">提现账户</h1>
          </div>
          <p class="page-desc">管理用户个人实名绑定的提现账户（银行卡 / 支付宝）</p>
        </div>
      </div>

      <!-- 筛选 -->
      <div ref="prdTipFilterRef" class="glass-card bl-filter">
        <div class="ul-filter-grid">
          <div class="ul-form-group">
            <label class="ul-label">用户ID</label>
            <input v-model="filters.userId" type="text" class="ul-input" placeholder="请输入用户ID">
          </div>
          <div class="ul-form-group">
            <label class="ul-label">账户类型</label>
            <select v-model="filters.type" class="ul-input ul-select">
              <option value="">全部</option>
              <option value="bank">银行卡</option>
              <option value="alipay">支付宝</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">持卡人姓名</label>
            <input v-model="filters.holderName" type="text" class="ul-input" placeholder="请输入持卡人姓名">
          </div>
          <div class="ul-form-group">
            <label class="ul-label">银行卡号</label>
            <input v-model="filters.cardNo" type="text" class="ul-input" placeholder="请输入卡号">
          </div>
          <template v-if="filterExpanded">
            <div class="ul-form-group">
              <label class="ul-label">手机号</label>
              <input v-model="filters.phone" type="text" class="ul-input" placeholder="请输入手机号">
            </div>
            <div class="ul-form-group">
              <label class="ul-label">是否本人</label>
              <select v-model="filters.isSelf" class="ul-input ul-select">
                <option value="">全部</option><option value="1">是</option><option value="0">否</option>
              </select>
            </div>
            <div class="ul-form-group">
              <label class="ul-label">状态</label>
              <select v-model="filters.status" class="ul-input ul-select">
                <option value="">全部</option>
                <option value="normal">正常</option>
                <option value="user_del">用户删除</option>
                <option value="admin_del">后台删除</option>
              </select>
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
            账户列表
            <span class="table-count">共 {{ total }} 条</span>
          </div>
          <div v-if="selectedIds.length===0" class="table-header-right">
            <div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-muted)">
              每页 <select class="ul-pg-size" @change="(e)=>{pageSize=Number((e.target as HTMLSelectElement).value);fetchList(1)}">
                <option value="10">10 条</option><option value="20" selected>20 条</option><option value="50">50 条</option>
              </select>
            </div>
          </div>
          <div v-else class="ul-bulk-bar">
            <span style="font-size:13px">已选 <strong style="color:var(--primary)">{{ selectedIds.length }}</strong> 项</span>
            <button class="btn btn-danger btn-sm" @click="showToast('批量删除','info')">批量删除</button>
            <button class="btn btn-default btn-sm" @click="selectedIds=[]">取消</button>
          </div>
        </div>
        <div class="ul-table-wrap">
          <table class="ul-table">
            <colgroup>
              <col style="width:36px"><col style="width:50px"><col style="width:9%">
              <col style="width:8%"><col style="width:14%"><col style="width:12%">
              <col style="width:9%"><col style="width:12%"><col style="width:10%">
              <col style="width:6%"><col style="width:7%"><col style="width:8%"><col style="width:7%">
            </colgroup>
            <thead>
              <tr>
                <th><input type="checkbox" :checked="allSelected" style="accent-color:var(--primary)" @change="toggleAll"></th>
                <th>序号</th>
                <th>用户ID</th>
                <th>账户类型</th>
                <th>银行卡号</th>
                <th>开户银行</th>
                <th>持卡人姓名</th>
                <th>身份证号</th>
                <th>手机号</th>
                <th>排序</th>
                <th>是否本人</th>
                <th>状态</th>
                <th ref="prdTipOpsRef" class="col-action" style="text-align:center">操作</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="loading">
                <tr v-for="i in 8" :key="i"><td colspan="13"><div class="ul-skeleton"></div></td></tr>
              </template>
              <template v-else-if="list.length===0">
                <tr><td colspan="13">
                  <div class="ul-empty">
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="0.9"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                    <div style="font-size:14px;font-weight:600;color:var(--text-secondary);margin:8px 0 4px">暂无数据</div>
                  </div>
                </td></tr>
              </template>
              <template v-else>
                <tr v-for="(row,idx) in list" :key="row.id" class="ul-row" :class="{'ul-row-selected':selectedIds.includes(row.id)}">
                  <td @click.stop><input type="checkbox" :checked="selectedIds.includes(row.id)" style="accent-color:var(--primary)" @change="toggleRow(row.id)"></td>
                  <td class="ul-muted">{{ (page-1)*pageSize+idx+1 }}</td>
                  <td><span class="ul-mono">{{ row.userId }}</span></td>
                  <td>
                    <span class="tag" :class="row.type==='bank'?'tag-blue':'tag-green'">{{ row.type==='bank'?'银行卡':'支付宝' }}</span>
                  </td>
                  <td><span class="ul-mono" style="font-size:11.5px">{{ maskCardNo(row.cardNo) }}</span></td>
                  <td><span style="font-size:12px">{{ row.bankName }}</span></td>
                  <td><span style="font-size:13px;font-weight:500">{{ row.holderName }}</span></td>
                  <td><span class="ul-mono" style="font-size:11.5px">{{ maskIdCard(row.idCard) }}</span></td>
                  <td><span class="ul-mono" style="font-size:11.5px">{{ maskPhone(row.phone) }}</span></td>
                  <td class="ul-muted">{{ row.sortOrder }}</td>
                  <td>
                    <span class="badge" :class="row.isSelf?'badge-success':'badge-gray'">{{ row.isSelf?'是':'否' }}</span>
                  </td>
                  <td>
                    <span class="badge" :class="getStatusClass(row.status)">{{ STATUS_LABELS[row.status] }}</span>
                  </td>
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

    <!-- 编辑弹窗 -->
    <div class="ul-overlay" :class="{show:editVisible}" @click="editVisible=false"></div>
    <div class="ul-modal bl-modal" :class="{show:editVisible}">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--border)">
        <div style="font-size:15px;font-weight:700;color:var(--text-primary)">编辑提现账户</div>
        <button class="ul-icon-btn" @click="editVisible=false"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <div style="padding:20px;display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div class="ul-form-group">
          <label class="ul-label">账户类型 <span style="color:var(--danger)">*</span></label>
          <select v-model="editForm.type" class="ul-input ul-select">
            <option value="bank">银行卡</option><option value="alipay">支付宝</option>
          </select>
        </div>
        <div class="ul-form-group">
          <label class="ul-label">{{ editForm.type==='bank'?'银行卡号':'支付宝账号' }} <span style="color:var(--danger)">*</span></label>
          <input v-model="editForm.cardNo" type="text" class="ul-input" placeholder="请输入账号">
        </div>
        <div v-if="editForm.type==='bank'" class="ul-form-group">
          <label class="ul-label">开户银行</label>
          <input v-model="editForm.bankName" type="text" class="ul-input" placeholder="如：招商银行">
        </div>
        <div class="ul-form-group">
          <label class="ul-label">持卡人姓名 <span style="color:var(--danger)">*</span></label>
          <input v-model="editForm.holderName" type="text" class="ul-input" placeholder="请输入姓名">
        </div>
        <div class="ul-form-group">
          <label class="ul-label">手机号 <span style="color:var(--danger)">*</span></label>
          <input v-model="editForm.phone" type="text" class="ul-input" placeholder="请输入手机号" maxlength="11">
        </div>
        <div class="ul-form-group">
          <label class="ul-label">是否本人</label>
          <select v-model="editForm.isSelf" class="ul-input ul-select">
            <option :value="true">是</option><option :value="false">否</option>
          </select>
        </div>
        <div class="ul-form-group" style="grid-column:1/-1;max-width:260px">
          <label class="ul-label">状态 <span style="color:var(--danger)">*</span></label>
          <select v-model="editForm.status" class="ul-input ul-select">
            <option value="normal">正常</option>
            <option value="user_del">用户删除</option>
            <option value="admin_del">后台删除</option>
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
      <div style="padding:20px"><p style="font-size:13px;color:var(--text-secondary);line-height:1.6">确认删除该提现账户？此操作不可撤销。</p></div>
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

interface WAccount {
  id:number; userId:string; type:string; cardNo:string; bankName:string
  holderName:string; idCard:string; phone:string; sortOrder:number; isSelf:boolean; status:string
}
interface Toast { id:number; msg:string; type:'success'|'error'|'info' }

const STATUS_LABELS:Record<string,string> = { normal:'正常', user_del:'用户删除', admin_del:'后台删除' }
const BANKS = ['招商银行','工商银行','建设银行','农业银行','中国银行','交通银行','邮政储蓄银行','浦发银行','民生银行','光大银行','中信银行','华夏银行']

const loading=ref(false); const list=ref<WAccount[]>([]); const total=ref(0)
const page=ref(1); const pageSize=ref(20); const selectedIds=ref<number[]>([])
const filterExpanded=ref(false)
const filters=ref({ userId:'', type:'', holderName:'', cardNo:'', phone:'', isSelf:'', status:'' })
const editVisible=ref(false)
const editForm=ref({ id:0, type:'bank', cardNo:'', bankName:'', holderName:'', phone:'', isSelf:true, status:'normal' })
const deleteVisible=ref(false); const deleteTarget=ref<WAccount|null>(null)
const toasts=ref<Toast[]>([]); let toastId=0

const totalPages=computed(()=>Math.max(1,Math.ceil(total.value/pageSize.value)))
const allSelected=computed(()=>list.value.length>0&&list.value.every(r=>selectedIds.value.includes(r.id)))
const paginationPages=computed(()=>{
  const arr:number[]=[]; const t=totalPages.value; const c=page.value
  const s=Math.max(1,c-2); const e=Math.min(t,c+2)
  for (let i=s;i<=e;i++) arr.push(i); return arr
})

function mockData(n=20): WAccount[] {
  return Array.from({length:n},(_,i)=>({
    id:i+1, userId:`U${10001+i}`,
    type: i%3===2?'alipay':'bank',
    cardNo: i%3===2 ? `138${String(10000000+i*9973)}` : `622${String(200000000+i*13579)}${String(i).padStart(4,'0')}`,
    bankName: i%3===2?'支付宝':BANKS[i%BANKS.length],
    holderName:['张三','李四','王五','赵六','钱七','孙八','周九','吴十','郑一','王二'][i%10],
    idCard:`11010119${String(80+Math.floor(i/10))}0${String(i%10+1).padStart(2,'0')}08${String(1000+i).padStart(4,'0')}X`,
    phone:`138${String(10000000+i*7777)}`,
    sortOrder:i+1, isSelf:i%5!==0,
    status:['normal','normal','normal','user_del','admin_del'][i%5],
  }))
}

async function fetchList(p=1) {
  loading.value=true; page.value=p; selectedIds.value=[]
  await new Promise(r=>setTimeout(r,220))
  const data=mockData(); total.value=data.length; list.value=data; loading.value=false
}
function resetFilter() {
  filters.value={userId:'',type:'',holderName:'',cardNo:'',phone:'',isSelf:'',status:''}; fetchList(1)
}
function toggleAll(e:Event) {
  selectedIds.value=(e.target as HTMLInputElement).checked?list.value.map(r=>r.id):[]
}
function toggleRow(id:number) {
  if (selectedIds.value.includes(id)) selectedIds.value=selectedIds.value.filter(x=>x!==id)
  else selectedIds.value=[...selectedIds.value,id]
}
function openEdit(row:WAccount) {
  editForm.value={id:row.id,type:row.type,cardNo:row.cardNo,bankName:row.bankName,holderName:row.holderName,phone:row.phone,isSelf:row.isSelf,status:row.status}
  editVisible.value=true
}
function saveEdit() { editVisible.value=false; showToast('保存成功','success'); fetchList(page.value) }
function confirmDelete(row:WAccount) { deleteTarget.value=row; deleteVisible.value=true }
function doDelete() { list.value=list.value.filter(r=>r.id!==deleteTarget.value!.id); total.value--; deleteVisible.value=false; showToast('已删除','success') }

function maskCardNo(s:string) { return s.length>8 ? s.slice(0,4)+'****'+s.slice(-4) : s }
function maskIdCard(s:string) { return s.length>8 ? s.slice(0,6)+'****'+s.slice(-4) : s }
function maskPhone(s:string) { return s.replace(/(\d{3})\d{4}(\d{4})/,'$1****$2') }
function getStatusClass(s:string) { return {normal:'badge-success',user_del:'badge-gray',admin_del:'badge-gray'}[s]||'badge-gray' }
function showToast(msg:string, type:Toast['type']='info') {
  const id=++toastId; toasts.value.push({id,msg,type}); setTimeout(()=>removeToast(id),3000)
}
function removeToast(id:number) { toasts.value=toasts.value.filter(t=>t.id!==id) }

onMounted(()=>fetchList(1))
</script>

<style>
.wa-wrap { min-height: 100%; }
</style>
