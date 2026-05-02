<template>
  <div class="po-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">品牌项目</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">订单管理</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">订单管理</h1>
          <p class="page-desc">管理品牌项目的推广订单（结算、审核、打款）</p>
        </div>
      </div>

      <!-- 子 Tab -->
      <div class="po-tabs">
        <button class="po-tab" :class="{ active: activeTab === 'all' }" @click="switchTab('all')">
          全部订单
          <span class="po-tab-count">{{ tabTotals.all }}</span>
        </button>
        <button class="po-tab" :class="{ active: activeTab === 'pending' }" @click="switchTab('pending')">
          待审核
          <span class="po-tab-count po-tab-count--warn">{{ tabTotals.pending }}</span>
        </button>
      </div>

      <!-- 统计条（与海外文娱订单管理 oo-stat-strip 同款结构/样式） -->
      <div class="glass-card oo-stat-strip">
        <div v-for="s in headerStats" :key="s.key" class="oo-stat-slot">
          <span class="oo-stat-dot" :class="s.dotClass"></span>
          <span class="oo-stat-lab">{{ s.label }}</span>
          <span class="badge oo-stat-money" :class="s.badgeClass">¥{{ s.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
          <span class="oo-stat-count">{{ s.count }} 笔</span>
        </div>
      </div>

      <!-- 筛选 -->
      <div class="glass-card po-filter">
        <div class="ul-filter-grid">
          <div class="ul-form-group">
            <label class="ul-label">订单ID</label>
            <input v-model="filters.orderId" type="text" class="ul-input" placeholder="精确输入订单ID">
          </div>
          <div class="ul-form-group">
            <label class="ul-label">用户ID</label>
            <input v-model="filters.userId" type="text" class="ul-input" placeholder="精确输入用户ID">
          </div>
          <div class="ul-form-group">
            <label class="ul-label">所属项目</label>
            <input v-model="filters.projectName" type="text" class="ul-input" placeholder="模糊搜索项目名称">
          </div>
          <div class="ul-form-group" v-if="activeTab === 'all'">
            <label class="ul-label">审核状态</label>
            <select v-model="filters.auditStatus" class="ul-input ul-select">
              <option value="">全部状态</option>
              <option value="pending">待审核</option>
              <option value="approved">已通过</option>
              <option value="rejected">已驳回</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">结算状态</label>
            <select v-model="filters.settleStatus" class="ul-input ul-select">
              <option value="">全部状态</option>
              <option value="unsettled">未结算</option>
              <option value="settling">待结算</option>
              <option value="settled">已结算</option>
              <option value="error">结算异常</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">订单来源</label>
            <select v-model="filters.orderSource" class="ul-input ul-select">
              <option value="">全部来源</option>
              <option value="official">官方回填</option>
              <option value="manual">手动录入</option>
              <option value="import">批量导入</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">订单时间起</label>
            <input v-model="filters.timeStart" type="date" class="ul-input">
          </div>
          <div class="ul-form-group">
            <label class="ul-label">订单时间止</label>
            <input v-model="filters.timeEnd" type="date" class="ul-input">
          </div>
        </div>
        <div class="ul-filter-footer">
          <span></span>
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            {{ activeTab === 'pending' ? '待审核订单' : '全部订单' }}
            <span class="table-count">共 {{ total }} 条</span>
          </div>

          <!-- 批量操作栏 -->
          <div v-if="selectedIds.size > 0" class="bulk-bar show">
            <span class="bulk-count">已选 <span>{{ selectedIds.size }}</span> 条</span>
            <button class="btn btn-success btn-sm" @click="confirmBulkApprove">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              批量通过
            </button>
            <button class="btn btn-danger btn-sm" @click="openBulkReject">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              批量驳回
            </button>
            <button class="btn btn-default btn-sm" @click="selectedIds.clear()">取消选择</button>
          </div>

          <!-- 右侧按钮 -->
          <div v-else class="table-header-right">
            <button class="btn btn-default btn-sm" @click="handleExport">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              导出
            </button>
          </div>
        </div>

        <div class="ul-table-wrap">
          <table class="ul-table" style="min-width:1300px">
            <thead>
              <tr>
                <th style="width:40px">
                  <input type="checkbox" class="ul-checkbox" :checked="allChecked" :indeterminate="someChecked" @change="toggleAll">
                </th>
                <th style="width:60px">序号</th>
                <th style="min-width:130px">订单ID</th>
                <th style="width:90px">用户ID</th>
                <th style="min-width:90px">用户昵称</th>
                <th style="min-width:130px">所属项目</th>
                <th style="min-width:90px">关键词</th>
                <th style="width:90px;text-align:right">订单金额</th>
                <th style="width:90px;text-align:right">结算金额</th>
                <th style="width:90px">结算状态</th>
                <th style="width:90px">审核状态</th>
                <th style="width:90px">打款状态</th>
                <th style="width:80px">订单来源</th>
                <th style="min-width:120px">订单时间</th>
                <th class="col-action" style="width:120px;text-align:center">操作</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="loading">
                <tr v-for="i in 8" :key="i"><td colspan="15"><div class="ul-skeleton"></div></td></tr>
              </template>
              <template v-else-if="list.length === 0">
                <tr><td colspan="15">
                  <div class="ul-empty">
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="0.9"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <div style="font-size:14px;font-weight:600;color:var(--text-secondary);margin:8px 0 4px">暂无订单数据</div>
                  </div>
                </td></tr>
              </template>
              <template v-else>
                <tr v-for="(row, idx) in list" :key="row.id" class="ul-row">
                  <td>
                    <input type="checkbox" class="ul-checkbox" :checked="selectedIds.has(row.id)" @change="toggleRow(row.id)">
                  </td>
                  <td><span class="ul-mono">{{ (page-1)*pageSize + idx + 1 }}</span></td>
                  <td><span class="ul-mono" style="font-size:11.5px">{{ row.orderId }}</span></td>
                  <td><span class="ul-mono">{{ row.userId }}</span></td>
                  <td>{{ row.userNick }}</td>
                  <td><span style="font-weight:600;color:var(--text-primary)">{{ row.projectName }}</span></td>
                  <td>
                    <span v-if="row.keyword" class="tag tag-gray" style="font-size:10.5px">{{ row.keyword }}</span>
                    <span v-else class="ul-none">—</span>
                  </td>
                  <td style="text-align:right"><span class="ul-mono amount">¥{{ row.orderAmount.toFixed(2) }}</span></td>
                  <td style="text-align:right"><span class="ul-mono amount amount-settle">¥{{ row.settleAmount.toFixed(2) }}</span></td>
                  <td><span class="badge" :class="getSettleBadgeClass(row.settleStatus)">{{ getSettleLabel(row.settleStatus) }}</span></td>
                  <td><span class="badge" :class="getAuditBadgeClass(row.auditStatus)">{{ getAuditLabel(row.auditStatus) }}</span></td>
                  <td><span class="badge" :class="getPaymentBadgeClass(row.paymentStatus)">{{ getPaymentLabel(row.paymentStatus) }}</span></td>
                  <td><span class="tag" :class="getSourceTagClass(row.orderSource)" style="font-size:10.5px">{{ getSourceLabel(row.orderSource) }}</span></td>
                  <td><span class="ul-mono" style="font-size:12px">{{ row.orderTime }}</span></td>
                  <td class="col-action">
                    <div class="action-btns">
                      <button v-if="row.auditStatus === 'pending'" type="button" class="action-btn approve" title="审核通过" @click="confirmApprove(row)">通过</button>
                      <button v-if="row.auditStatus === 'pending'" type="button" class="action-btn reject" title="审核驳回" @click="openReject(row)">驳回</button>
                      <button type="button" class="action-btn view" title="查看详情" @click="openDetail(row)">详情</button>
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
            每页
            <select class="ul-pg-size" @change="(e)=>{pageSize=Number((e.target as HTMLSelectElement).value);fetchList(1)}">
              <option value="10">10</option><option value="20" selected>20</option><option value="50">50</option>
            </select>
            条
          </div>
        </div>
      </div>
    </div>

    <!-- 驳回弹窗 -->
    <div class="ul-overlay" :class="{show:rejectVisible}" @click="rejectVisible=false"></div>
    <div class="ul-modal po-modal-sm" :class="{show:rejectVisible}">
      <div class="ul-modal-header">
        <div class="ul-modal-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          驳回订单
        </div>
        <button class="ul-icon-btn" @click="rejectVisible=false">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div style="padding:20px">
        <p style="font-size:13px;color:var(--text-secondary);margin-bottom:12px">请填写驳回原因：</p>
        <div class="ul-form-group">
          <label class="ul-label">驳回原因 <span style="color:var(--danger)">*</span></label>
          <textarea v-model="rejectReason" class="ul-input ul-textarea" rows="3" placeholder="请填写驳回原因，最多100字" maxlength="100"></textarea>
        </div>
      </div>
      <div class="ul-modal-footer">
        <button class="btn btn-default" @click="rejectVisible=false">取消</button>
        <button class="btn btn-danger" @click="submitReject">确认驳回</button>
      </div>
    </div>

    <!-- 批量驳回弹窗 -->
    <div class="ul-overlay" :class="{show:bulkRejectVisible}" @click="bulkRejectVisible=false"></div>
    <div class="ul-modal po-modal-sm" :class="{show:bulkRejectVisible}">
      <div class="ul-modal-header">
        <div class="ul-modal-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          批量驳回
        </div>
        <button class="ul-icon-btn" @click="bulkRejectVisible=false">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div style="padding:20px">
        <p style="font-size:13px;color:var(--text-secondary);margin-bottom:12px">确认批量驳回已选 <strong style="color:var(--danger)">{{ selectedIds.size }}</strong> 条订单？请填写统一驳回原因：</p>
        <div class="ul-form-group">
          <label class="ul-label">驳回原因 <span style="color:var(--danger)">*</span></label>
          <textarea v-model="bulkRejectReason" class="ul-input ul-textarea" rows="3" placeholder="请填写统一驳回原因，最多100字" maxlength="100"></textarea>
        </div>
      </div>
      <div class="ul-modal-footer">
        <button class="btn btn-default" @click="bulkRejectVisible=false">取消</button>
        <button class="btn btn-danger" @click="submitBulkReject">确认驳回</button>
      </div>
    </div>

    <!-- 审核通过确认 -->
    <div class="ul-overlay" :class="{show:approveVisible}" @click="approveVisible=false"></div>
    <div class="ul-modal po-modal-sm" :class="{show:approveVisible}">
      <div class="ul-modal-header">
        <div class="ul-modal-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          审核通过确认
        </div>
        <button class="ul-icon-btn" @click="approveVisible=false">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div style="padding:20px">
        <p style="font-size:13px;color:var(--text-secondary)">
          {{ bulkApproveMode ? `确认批量审核通过已选 ${selectedIds.size} 条订单？` : `确认审核通过订单「${currentRow?.orderId}」？` }}
        </p>
      </div>
      <div class="ul-modal-footer">
        <button class="btn btn-default" @click="approveVisible=false">取消</button>
        <button class="btn btn-success" @click="submitApprove">确认通过</button>
      </div>
    </div>

    <!-- 详情抽屉 -->
    <div class="ul-drawer-overlay" :class="{show:detailVisible}" @click="detailVisible=false"></div>
    <div class="ul-drawer" :class="{show:detailVisible}" style="width:640px">
      <div class="ul-drawer-header">
        <div class="ul-drawer-title">订单详情</div>
        <button class="ul-icon-btn" @click="detailVisible=false">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="ul-drawer-body" v-if="currentRow">
        <div class="detail-section">
          <div class="detail-section-title">订单信息</div>
          <div class="detail-grid">
            <div class="detail-item" style="grid-column:1/-1"><span class="detail-label">订单ID</span><span class="ul-mono">{{ currentRow.orderId }}</span></div>
            <div class="detail-item"><span class="detail-label">用户ID</span><span class="ul-mono">{{ currentRow.userId }}</span></div>
            <div class="detail-item"><span class="detail-label">用户昵称</span><span>{{ currentRow.userNick }}</span></div>
            <div class="detail-item" style="grid-column:1/-1"><span class="detail-label">所属项目</span><span style="font-weight:600">{{ currentRow.projectName }}</span></div>
            <div class="detail-item"><span class="detail-label">关键词</span><span>{{ currentRow.keyword || '—' }}</span></div>
            <div class="detail-item"><span class="detail-label">订单来源</span><span class="tag" :class="getSourceTagClass(currentRow.orderSource)" style="font-size:11px">{{ getSourceLabel(currentRow.orderSource) }}</span></div>
          </div>
        </div>
        <div class="detail-section">
          <div class="detail-section-title">金额信息</div>
          <div class="detail-grid">
            <div class="detail-item"><span class="detail-label">订单金额</span><span class="ul-mono amount">¥{{ currentRow.orderAmount.toFixed(2) }}</span></div>
            <div class="detail-item"><span class="detail-label">结算金额</span><span class="ul-mono amount amount-settle">¥{{ currentRow.settleAmount.toFixed(2) }}</span></div>
            <div class="detail-item"><span class="detail-label">结算状态</span><span class="badge" :class="getSettleBadgeClass(currentRow.settleStatus)">{{ getSettleLabel(currentRow.settleStatus) }}</span></div>
            <div class="detail-item"><span class="detail-label">打款状态</span><span class="badge" :class="getPaymentBadgeClass(currentRow.paymentStatus)">{{ getPaymentLabel(currentRow.paymentStatus) }}</span></div>
            <div class="detail-item"><span class="detail-label">打款时间</span><span class="ul-mono" style="font-size:12px">{{ currentRow.paymentTime || '—' }}</span></div>
          </div>
        </div>
        <div class="detail-section">
          <div class="detail-section-title">审核信息</div>
          <div class="detail-grid">
            <div class="detail-item"><span class="detail-label">审核状态</span><span class="badge" :class="getAuditBadgeClass(currentRow.auditStatus)">{{ getAuditLabel(currentRow.auditStatus) }}</span></div>
            <div class="detail-item"><span class="detail-label">审核人</span><span>{{ currentRow.auditor || '—' }}</span></div>
            <div class="detail-item"><span class="detail-label">审核时间</span><span class="ul-mono" style="font-size:12px">{{ currentRow.auditTime || '—' }}</span></div>
            <div class="detail-item" style="grid-column:1/-1"><span class="detail-label">驳回原因</span><span style="color:var(--danger)">{{ currentRow.rejectReason || '—' }}</span></div>
            <div class="detail-item"><span class="detail-label">订单时间</span><span class="ul-mono" style="font-size:12px">{{ currentRow.orderTime }}</span></div>
            <div class="detail-item"><span class="detail-label">创建时间</span><span class="ul-mono" style="font-size:12px">{{ currentRow.createTime }}</span></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div class="ul-toast-container">
      <div v-for="t in toasts" :key="t.id" class="ul-toast" :class="t.type">
        <span style="flex:1;color:var(--text-primary);line-height:1.5">{{ t.msg }}</span>
        <button style="background:none;border:none;cursor:pointer;color:var(--text-muted)" @click="removeToast(t.id)">✕</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'

interface OrderItem {
  id: number
  orderId: string
  userId: string
  userNick: string
  projectName: string
  keyword: string
  orderAmount: number
  settleAmount: number
  settleStatus: 'unsettled' | 'settling' | 'settled' | 'error'
  auditStatus: 'pending' | 'approved' | 'rejected'
  rejectReason: string
  auditor: string
  auditTime: string
  paymentStatus: 'unpaid' | 'paying' | 'paid' | 'failed'
  paymentTime: string
  orderSource: 'official' | 'manual' | 'import'
  orderTime: string
  createTime: string
}
interface Toast { id: number; msg: string; type: 'success' | 'error' | 'info' }

const loading = ref(false)
const list = ref<OrderItem[]>([])
const page = ref(1)
const pageSize = ref(20)
const activeTab = ref<'all' | 'pending'>('all')
const selectedIds = reactive(new Set<number>())
const tabTotals = ref({ all: 12, pending: 4 })

const filters = ref({
  orderId: '', userId: '', projectName: '',
  auditStatus: '', settleStatus: '', orderSource: '',
  timeStart: '', timeEnd: '',
})

const rejectVisible = ref(false)
const bulkRejectVisible = ref(false)
const approveVisible = ref(false)
const detailVisible = ref(false)
const bulkApproveMode = ref(false)
const rejectReason = ref('')
const bulkRejectReason = ref('')
const currentRow = ref<OrderItem | null>(null)
const toasts = ref<Toast[]>([])
let toastId = 0

const MOCK_DATA: OrderItem[] = [
  { id: 1, orderId: 'ORD20260428001', userId: 'U10001', userNick: '创作达人小李', projectName: '剪映海外推广计划-Q2', keyword: '剪映', orderAmount: 25.00, settleAmount: 30.00, settleStatus: 'settled', auditStatus: 'pending', rejectReason: '', auditor: '', auditTime: '', paymentStatus: 'unpaid', paymentTime: '', orderSource: 'official', orderTime: '2026-04-28 09:30:00', createTime: '2026-04-28 09:30:00' },
  { id: 2, orderId: 'ORD20260428002', userId: 'U10002', userNick: '短剧推广王', projectName: '番茄小说达人招募', keyword: '番茄小说', orderAmount: 18.50, settleAmount: 18.50, settleStatus: 'settled', auditStatus: 'approved', rejectReason: '', auditor: '管理员张三', auditTime: '2026-04-27 16:00:00', paymentStatus: 'paid', paymentTime: '2026-04-27 18:00:00', orderSource: 'official', orderTime: '2026-04-27 14:20:00', createTime: '2026-04-27 14:20:00' },
  { id: 3, orderId: 'ORD20260428003', userId: 'U10003', userNick: '网盘分享小能手', projectName: '115网盘春季推广', keyword: '115网盘', orderAmount: 12.00, settleAmount: 12.00, settleStatus: 'settling', auditStatus: 'rejected', rejectReason: '订单数据与官方数据不符，请核实', auditor: '管理员李四', auditTime: '2026-04-26 17:30:00', paymentStatus: 'unpaid', paymentTime: '', orderSource: 'import', orderTime: '2026-04-26 13:00:00', createTime: '2026-04-26 13:00:00' },
  { id: 4, orderId: 'ORD20260428004', userId: 'U10004', userNick: 'WPS达人张明', projectName: 'WPS高级会员推广', keyword: 'WPS', orderAmount: 8.00, settleAmount: 9.60, settleStatus: 'unsettled', auditStatus: 'pending', rejectReason: '', auditor: '', auditTime: '', paymentStatus: 'unpaid', paymentTime: '', orderSource: 'manual', orderTime: '2026-04-28 08:00:00', createTime: '2026-04-28 08:00:00' },
  { id: 5, orderId: 'ORD20260428005', userId: 'U10005', userNick: 'AI艺术家小美', projectName: 'AI绘画工具推广', keyword: 'AI绘画', orderAmount: 45.00, settleAmount: 45.00, settleStatus: 'settled', auditStatus: 'approved', rejectReason: '', auditor: '管理员王五', auditTime: '2026-04-25 15:00:00', paymentStatus: 'paying', paymentTime: '', orderSource: 'official', orderTime: '2026-04-25 09:00:00', createTime: '2026-04-25 09:00:00' },
  { id: 6, orderId: 'ORD20260428006', userId: 'U10006', userNick: '漫画推广博主', projectName: '漫剧资源推广', keyword: '漫剧', orderAmount: 32.00, settleAmount: 32.00, settleStatus: 'error', auditStatus: 'pending', rejectReason: '', auditor: '', auditTime: '', paymentStatus: 'failed', paymentTime: '', orderSource: 'import', orderTime: '2026-04-28 10:15:00', createTime: '2026-04-28 10:15:00' },
]

function applyOrderFilters(data: OrderItem[]) {
  let out = [...data]
  if (activeTab.value === 'pending') out = out.filter((d) => d.auditStatus === 'pending')
  if (filters.value.orderId) out = out.filter((d) => d.orderId.includes(filters.value.orderId))
  if (filters.value.userId) out = out.filter((d) => d.userId.includes(filters.value.userId))
  if (filters.value.projectName) out = out.filter((d) => d.projectName.includes(filters.value.projectName))
  if (filters.value.auditStatus && activeTab.value === 'all') out = out.filter((d) => d.auditStatus === filters.value.auditStatus)
  if (filters.value.settleStatus) out = out.filter((d) => d.settleStatus === filters.value.settleStatus)
  if (filters.value.orderSource) out = out.filter((d) => d.orderSource === filters.value.orderSource)
  return out
}

const filteredAll = computed(() => applyOrderFilters(MOCK_DATA))

const total = computed(() => filteredAll.value.length)

const headerStats = computed(() => {
  const rows = filteredAll.value
  const sum = (pred: (r: OrderItem) => boolean) => {
    let count = 0
    let amount = 0
    for (const r of rows) {
      if (!pred(r)) continue
      count += 1
      amount += r.settleAmount
    }
    return { count, amount }
  }
  const unpaid = (r: OrderItem) => r.paymentStatus !== 'paid'
  const m1 = sum((r) => r.auditStatus === 'pending' && unpaid(r))
  const m2 = sum((r) => r.auditStatus === 'approved' && unpaid(r))
  const m3 = sum((r) => r.auditStatus === 'approved' && r.paymentStatus === 'paid')
  return [
    { key: 'm1', label: '未审核未打款', ...m1, dotClass: 'is-warn', badgeClass: 'badge-warning' },
    { key: 'm2', label: '已审核未打款', ...m2, dotClass: 'is-warn', badgeClass: 'badge-warning' },
    { key: 'm3', label: '已审核已打款', ...m3, dotClass: 'is-ok', badgeClass: 'badge-success' },
  ]
})

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
const paginationPages = computed(() => {
  const arr: number[] = []
  const t = totalPages.value; const c = page.value
  const s = Math.max(1, c - 2); const e = Math.min(t, c + 2)
  for (let i = s; i <= e; i++) arr.push(i)
  return arr
})
const allChecked = computed(() => list.value.length > 0 && list.value.every(r => selectedIds.has(r.id)))
const someChecked = computed(() => list.value.some(r => selectedIds.has(r.id)) && !allChecked.value)

function getSettleLabel(s: string) { return { unsettled: '未结算', settling: '待结算', settled: '已结算', error: '结算异常' }[s] || s }
function getSettleBadgeClass(s: string) { return { unsettled: 'badge-gray', settling: 'badge-warning', settled: 'badge-success', error: 'badge-danger' }[s] || '' }
function getAuditLabel(s: string) { return { pending: '待审核', approved: '已通过', rejected: '已驳回' }[s] || s }
function getAuditBadgeClass(s: string) { return { pending: 'badge-warning', approved: 'badge-success', rejected: 'badge-danger' }[s] || '' }
function getPaymentLabel(s: string) { return { unpaid: '未打款', paying: '打款中', paid: '已打款', failed: '打款失败' }[s] || s }
function getPaymentBadgeClass(s: string) { return { unpaid: 'badge-gray', paying: 'badge-info', paid: 'badge-success', failed: 'badge-danger' }[s] || '' }
function getSourceLabel(s: string) { return { official: '官方回填', manual: '手动录入', import: '批量导入' }[s] || s }
function getSourceTagClass(s: string) { return { official: 'tag-blue', manual: 'tag-purple', import: 'tag-gray' }[s] || 'tag-gray' }

function switchTab(tab: 'all' | 'pending') {
  activeTab.value = tab
  filters.value.auditStatus = tab === 'pending' ? 'pending' : ''
  fetchList(1)
}

async function fetchList(p = 1) {
  loading.value = true
  page.value = p
  selectedIds.clear()
  await new Promise((r) => setTimeout(r, 200))
  const data = filteredAll.value
  tabTotals.value.all = MOCK_DATA.length
  tabTotals.value.pending = MOCK_DATA.filter((d) => d.auditStatus === 'pending').length
  list.value = data.slice((p - 1) * pageSize.value, p * pageSize.value)
  loading.value = false
}

function resetFilter() {
  filters.value = { orderId: '', userId: '', projectName: '', auditStatus: '', settleStatus: '', orderSource: '', timeStart: '', timeEnd: '' }
  if (activeTab.value === 'pending') filters.value.auditStatus = 'pending'
  fetchList(1)
}

function toggleAll(e: Event) {
  if ((e.target as HTMLInputElement).checked) list.value.forEach(r => selectedIds.add(r.id))
  else selectedIds.clear()
}
function toggleRow(id: number) {
  if (selectedIds.has(id)) selectedIds.delete(id)
  else selectedIds.add(id)
}

function confirmApprove(row: OrderItem) { currentRow.value = row; bulkApproveMode.value = false; approveVisible.value = true }
function confirmBulkApprove() { bulkApproveMode.value = true; approveVisible.value = true }
function submitApprove() {
  approveVisible.value = false
  showToast(bulkApproveMode.value ? `已批量通过 ${selectedIds.size} 条订单` : '审核通过成功', 'success')
  if (bulkApproveMode.value) selectedIds.clear()
  fetchList(page.value)
}

function openReject(row: OrderItem) { currentRow.value = row; rejectReason.value = ''; rejectVisible.value = true }
function openBulkReject() { bulkRejectReason.value = ''; bulkRejectVisible.value = true }
function submitReject() {
  if (!rejectReason.value.trim()) { showToast('请填写驳回原因', 'error'); return }
  rejectVisible.value = false; showToast('驳回成功', 'success'); fetchList(page.value)
}
function submitBulkReject() {
  if (!bulkRejectReason.value.trim()) { showToast('请填写驳回原因', 'error'); return }
  bulkRejectVisible.value = false
  showToast(`已批量驳回 ${selectedIds.size} 条订单`, 'success')
  selectedIds.clear(); fetchList(page.value)
}

function openDetail(row: OrderItem) { currentRow.value = row; detailVisible.value = true }
function handleExport() { showToast('导出文件已生成，即将下载', 'success') }

function showToast(msg: string, type: Toast['type'] = 'info') {
  const id = ++toastId; toasts.value.push({ id, msg, type })
  setTimeout(() => removeToast(id), 3000)
}
function removeToast(id: number) { toasts.value = toasts.value.filter(t => t.id !== id) }

onMounted(() => fetchList(1))
</script>

<style scoped>
.po-wrap { min-height: 100%; }
/* 与 OverseasOrder.vue 统计条一致 */
.oo-stat-strip {
  padding: 14px 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 18px 28px;
  align-items: center;
  margin-bottom: 14px;
}
.oo-stat-slot {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.oo-stat-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.oo-stat-dot.is-warn { background: var(--warning); }
.oo-stat-dot.is-ok { background: var(--success); }
.oo-stat-dot.is-danger { background: var(--danger); }
.oo-stat-lab { font-size: 12px; color: var(--text-muted); }
.oo-stat-money { font-size: 12px; font-weight: 700; padding: 2px 10px; }
.oo-stat-count { font-size: 11px; color: var(--text-muted); }
.po-filter { padding: 16px 18px 14px; margin-bottom: 14px; }
.po-modal-sm { width: 480px !important; }

/* 子 Tab */
.po-tabs { display: flex; gap: 0; margin-bottom: 14px; border-bottom: 1px solid var(--border); }
.po-tab {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 18px; font-size: 13.5px; font-weight: 500;
  color: var(--text-secondary); background: none; border: none;
  border-bottom: 2px solid transparent; margin-bottom: -1px;
  cursor: pointer; transition: var(--transition);
}
.po-tab:hover { color: var(--primary); }
.po-tab.active { color: var(--primary); border-bottom-color: var(--primary); font-weight: 600; }
.po-tab-count {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 18px; height: 18px; padding: 0 5px;
  background: var(--border); border-radius: 999px;
  font-size: 11px; font-weight: 600; color: var(--text-secondary);
}
.po-tab-count--warn { background: var(--warning-bg); color: var(--warning); }

.amount { font-size: 13px; }
.amount-settle { color: var(--success); }

/* 详情抽屉 */
.detail-section { margin-bottom: 24px; }
.detail-section-title {
  font-size: 13px; font-weight: 600; color: var(--text-primary);
  padding-bottom: 8px; border-bottom: 1px solid var(--border); margin-bottom: 14px;
}
.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 16px; }
.detail-item { display: flex; flex-direction: column; gap: 4px; }
.detail-label { font-size: 11.5px; color: var(--text-muted); font-weight: 500; }

/* badge */
.badge { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; }
.badge-warning { background: var(--warning-bg); color: var(--warning); }
.badge-success { background: var(--success-bg); color: var(--success); }
.badge-danger { background: var(--danger-bg); color: var(--danger); }
.badge-gray { background: var(--border); color: var(--text-muted); }
.badge-info { background: var(--info-bg); color: var(--info); }

.btn-success {
  background: var(--success); color: #fff; border: none;
  padding: 6px 14px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 500; cursor: pointer;
  transition: var(--transition);
}
.btn-success:hover { background: #15803d; }
.btn-success.btn-sm { padding: 4px 10px; font-size: 12px; }
</style>
