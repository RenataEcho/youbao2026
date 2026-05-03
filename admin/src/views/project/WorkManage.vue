<template>
  <div class="wm-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">品牌项目</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">作品管理</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <div ref="prdTipAnchorRef" class="page-header-title-anchor">
            <h1 class="page-title">作品管理</h1>
          </div>
          <p class="page-desc">管理用户在平台提交的推广作品内容</p>
        </div>
      </div>

      <!-- 筛选 -->
      <div ref="prdTipFilterRef" class="glass-card wm-filter">
        <div class="ul-filter-grid">
          <div class="ul-form-group">
            <label class="ul-label">用户ID</label>
            <input v-model="filters.userId" type="text" class="ul-input" placeholder="精确输入用户ID">
          </div>
          <div class="ul-form-group">
            <label class="ul-label">所属项目</label>
            <input v-model="filters.projectName" type="text" class="ul-input" placeholder="模糊搜索项目名称">
          </div>
          <div class="ul-form-group">
            <label class="ul-label">平台类型</label>
            <select v-model="filters.platform" class="ul-input ul-select">
              <option value="">全部平台</option>
              <option v-for="p in PLATFORMS" :key="p.value" :value="p.value">{{ p.label }}</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">审核状态</label>
            <select v-model="filters.auditStatus" class="ul-input ul-select">
              <option value="">全部状态</option>
              <option value="pending">待审核</option>
              <option value="approved">已通过</option>
              <option value="rejected">已驳回</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">提交时间起</label>
            <input v-model="filters.timeStart" type="date" class="ul-input">
          </div>
          <div class="ul-form-group">
            <label class="ul-label">提交时间止</label>
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 10l4.553-2.069A1 1 0 0 1 21 8.82v6.36a1 1 0 0 1-1.447.89L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z"/></svg>
            作品列表
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
          <table class="ul-table" style="min-width:1100px">
            <thead>
              <tr>
                <th style="width:40px">
                  <input type="checkbox" class="ul-checkbox" :checked="allChecked" :indeterminate="someChecked" @change="toggleAll">
                </th>
                <th style="width:60px">序号</th>
                <th style="width:90px">用户ID</th>
                <th style="min-width:100px">用户昵称</th>
                <th style="min-width:130px">所属项目</th>
                <th style="width:80px">平台类型</th>
                <th style="min-width:150px">作品标题</th>
                <th style="min-width:100px">关键词</th>
                <th style="width:80px">播放量</th>
                <th style="width:80px">点赞量</th>
                <th style="width:90px">审核状态</th>
                <th style="min-width:120px">提交时间</th>
                <th ref="prdTipOpsRef" class="col-action" style="width:120px;text-align:center">操作</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="loading">
                <tr v-for="i in 8" :key="i"><td colspan="13"><div class="ul-skeleton"></div></td></tr>
              </template>
              <template v-else-if="list.length === 0">
                <tr><td colspan="13">
                  <div class="ul-empty">
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="0.9"><path d="M15 10l4.553-2.069A1 1 0 0 1 21 8.82v6.36a1 1 0 0 1-1.447.89L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z"/></svg>
                    <div style="font-size:14px;font-weight:600;color:var(--text-secondary);margin:8px 0 4px">暂无作品数据</div>
                  </div>
                </td></tr>
              </template>
              <template v-else>
                <tr v-for="(row, idx) in list" :key="row.id" class="ul-row">
                  <td>
                    <input type="checkbox" class="ul-checkbox" :checked="selectedIds.has(row.id)" @change="toggleRow(row.id)">
                  </td>
                  <td><span class="ul-mono">{{ (page-1)*pageSize + idx + 1 }}</span></td>
                  <td><span class="ul-mono">{{ row.userId }}</span></td>
                  <td>{{ row.userNick }}</td>
                  <td><span style="font-weight:600;color:var(--text-primary)">{{ row.projectName }}</span></td>
                  <td>
                    <span class="tag" :class="getPlatformTagClass(row.platform)" style="font-size:10.5px">{{ row.platform }}</span>
                  </td>
                  <td>
                    <a v-if="row.workUrl" :href="row.workUrl" target="_blank" class="work-link" :title="row.workTitle">
                      {{ row.workTitle.length > 16 ? row.workTitle.slice(0, 16) + '…' : row.workTitle }}
                    </a>
                    <span v-else>{{ row.workTitle }}</span>
                  </td>
                  <td>
                    <span v-if="row.keyword" class="tag tag-gray" style="font-size:10.5px">{{ row.keyword }}</span>
                    <span v-else class="ul-none">—</span>
                  </td>
                  <td><span class="ul-mono">{{ formatCount(row.playCount) }}</span></td>
                  <td><span class="ul-mono">{{ formatCount(row.likeCount) }}</span></td>
                  <td>
                    <span class="badge" :class="getAuditBadgeClass(row.auditStatus)">{{ getAuditLabel(row.auditStatus) }}</span>
                  </td>
                  <td><span class="ul-mono" style="font-size:12px">{{ row.submitTime }}</span></td>
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

    <!-- 单条驳回弹窗 -->
    <div class="ul-overlay" :class="{show:rejectVisible}" @click="rejectVisible=false"></div>
    <div class="ul-modal wm-modal-sm" :class="{show:rejectVisible}">
      <div class="ul-modal-header">
        <div class="ul-modal-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          驳回作品
        </div>
        <button class="ul-icon-btn" @click="rejectVisible=false">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div style="padding:20px">
        <p style="font-size:13px;color:var(--text-secondary);margin-bottom:12px">请填写驳回原因，将反馈给运营人员：</p>
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
    <div class="ul-modal wm-modal-sm" :class="{show:bulkRejectVisible}">
      <div class="ul-modal-header">
        <div class="ul-modal-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          批量驳回
        </div>
        <button class="ul-icon-btn" @click="bulkRejectVisible=false">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div style="padding:20px">
        <p style="font-size:13px;color:var(--text-secondary);margin-bottom:12px">确认批量驳回已选 <strong style="color:var(--danger)">{{ selectedIds.size }}</strong> 条作品？请填写统一驳回原因：</p>
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

    <!-- 审核通过确认弹窗 -->
    <div class="ul-overlay" :class="{show:approveVisible}" @click="approveVisible=false"></div>
    <div class="ul-modal wm-modal-sm" :class="{show:approveVisible}">
      <div class="ul-modal-header">
        <div class="ul-modal-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          审核通过确认
        </div>
        <button class="ul-icon-btn" @click="approveVisible=false">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div style="padding:20px">
        <p style="font-size:13px;color:var(--text-secondary)">
          {{ bulkApproveMode
            ? `确认批量审核通过已选 ${selectedIds.size} 条作品？`
            : `确认审核通过该作品「${currentRow?.workTitle}」？` }}
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
        <div class="ul-drawer-title">作品详情</div>
        <button class="ul-icon-btn" @click="detailVisible=false">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="ul-drawer-body" v-if="currentRow">
        <div class="detail-section">
          <div class="detail-section-title">基础信息</div>
          <div class="detail-grid">
            <div class="detail-item"><span class="detail-label">用户ID</span><span class="ul-mono">{{ currentRow.userId }}</span></div>
            <div class="detail-item"><span class="detail-label">用户昵称</span><span>{{ currentRow.userNick }}</span></div>
            <div class="detail-item"><span class="detail-label">所属项目</span><span>{{ currentRow.projectName }}</span></div>
            <div class="detail-item"><span class="detail-label">平台类型</span><span class="tag" :class="getPlatformTagClass(currentRow.platform)" style="font-size:11px">{{ currentRow.platform }}</span></div>
            <div class="detail-item" style="grid-column:1/-1"><span class="detail-label">作品标题</span><span>{{ currentRow.workTitle }}</span></div>
            <div class="detail-item" style="grid-column:1/-1">
              <span class="detail-label">作品链接</span>
              <a :href="currentRow.workUrl" target="_blank" class="work-link">{{ currentRow.workUrl }}</a>
            </div>
            <div class="detail-item"><span class="detail-label">关键词</span><span class="tag tag-gray" style="font-size:11px">{{ currentRow.keyword || '—' }}</span></div>
          </div>
        </div>
        <div class="detail-section">
          <div class="detail-section-title">数据统计</div>
          <div class="detail-grid">
            <div class="detail-item"><span class="detail-label">播放量</span><span class="ul-mono">{{ formatCount(currentRow.playCount) }}</span></div>
            <div class="detail-item"><span class="detail-label">点赞量</span><span class="ul-mono">{{ formatCount(currentRow.likeCount) }}</span></div>
          </div>
        </div>
        <div class="detail-section">
          <div class="detail-section-title">审核信息</div>
          <div class="detail-grid">
            <div class="detail-item"><span class="detail-label">审核状态</span><span class="badge" :class="getAuditBadgeClass(currentRow.auditStatus)">{{ getAuditLabel(currentRow.auditStatus) }}</span></div>
            <div class="detail-item"><span class="detail-label">审核人</span><span>{{ currentRow.auditor || '—' }}</span></div>
            <div class="detail-item"><span class="detail-label">审核时间</span><span class="ul-mono" style="font-size:12px">{{ currentRow.auditTime || '—' }}</span></div>
            <div class="detail-item" style="grid-column:1/-1"><span class="detail-label">驳回原因</span><span style="color:var(--danger)">{{ currentRow.rejectReason || '—' }}</span></div>
            <div class="detail-item"><span class="detail-label">提交时间</span><span class="ul-mono" style="font-size:12px">{{ currentRow.submitTime }}</span></div>
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
import PrdTipMarker from '@/components/prd/PrdTipMarker.vue'
import { useAdminPrdTips } from '@/composables/useAdminPrdTips'
import { ref, computed, onMounted, reactive } from 'vue'

const { bundle, opsTipId, prdTipAnchorRef, prdTipFilterRef, prdTipOpsRef } = useAdminPrdTips()

interface WorkItem {
  id: number
  userId: string
  userNick: string
  projectName: string
  platform: string
  workUrl: string
  workTitle: string
  keyword: string
  playCount: number
  likeCount: number
  auditStatus: 'pending' | 'approved' | 'rejected'
  rejectReason: string
  auditor: string
  auditTime: string
  submitTime: string
  createTime: string
}

interface Toast { id: number; msg: string; type: 'success' | 'error' | 'info' }

const PLATFORMS = [
  { value: '抖音', label: '抖音' },
  { value: '快手', label: '快手' },
  { value: '小红书', label: '小红书' },
  { value: '微博', label: '微博' },
  { value: 'B站', label: 'B站' },
  { value: '其他', label: '其他' },
]

const PLATFORM_TAG_MAP: Record<string, string> = {
  '抖音': 'tag-red',
  '快手': 'tag-amber',
  '小红书': 'tag-pink',
  '微博': 'tag-red',
  'B站': 'tag-blue',
  '其他': 'tag-gray',
}

const loading = ref(false)
const list = ref<WorkItem[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)
const selectedIds = reactive(new Set<number>())

const filters = ref({
  userId: '', projectName: '', platform: '',
  auditStatus: '', timeStart: '', timeEnd: '',
})

const rejectVisible = ref(false)
const bulkRejectVisible = ref(false)
const approveVisible = ref(false)
const detailVisible = ref(false)
const bulkApproveMode = ref(false)
const rejectReason = ref('')
const bulkRejectReason = ref('')
const currentRow = ref<WorkItem | null>(null)
const toasts = ref<Toast[]>([])
let toastId = 0

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

const MOCK_DATA: WorkItem[] = [
  { id: 1, userId: 'U10001', userNick: '创作达人小李', projectName: '剪映海外推广计划-Q2', platform: '抖音', workUrl: 'https://example.com/work/1', workTitle: '剪映AI剪辑功能真的太强了，完全替代专业剪辑软件', keyword: '剪映', playCount: 125000, likeCount: 3200, auditStatus: 'pending', rejectReason: '', auditor: '', auditTime: '', submitTime: '2026-04-28 10:23:15', createTime: '2026-04-28 10:23:15' },
  { id: 2, userId: 'U10002', userNick: '短剧推广王', projectName: '番茄小说达人招募', platform: '快手', workUrl: 'https://example.com/work/2', workTitle: '推荐一部超好看的短剧，番茄小说独家', keyword: '番茄小说', playCount: 89000, likeCount: 2100, auditStatus: 'approved', rejectReason: '', auditor: '管理员张三', auditTime: '2026-04-27 15:40:00', submitTime: '2026-04-27 09:15:00', createTime: '2026-04-27 09:15:00' },
  { id: 3, userId: 'U10003', userNick: '网盘分享小能手', projectName: '115网盘春季推广', platform: '小红书', workUrl: 'https://example.com/work/3', workTitle: '云存储哪家强？115网盘测评报告', keyword: '115网盘', playCount: 45000, likeCount: 890, auditStatus: 'rejected', rejectReason: '作品内容与推广关键词不符，请重新提交', auditor: '管理员李四', auditTime: '2026-04-26 18:00:00', submitTime: '2026-04-26 14:30:00', createTime: '2026-04-26 14:30:00' },
  { id: 4, userId: 'U10004', userNick: 'WPS达人张明', projectName: 'WPS高级会员推广', platform: '微博', workUrl: 'https://example.com/work/4', workTitle: 'WPS这些隐藏功能你知道吗？效率提升10倍', keyword: 'WPS', playCount: 32000, likeCount: 560, auditStatus: 'pending', rejectReason: '', auditor: '', auditTime: '', submitTime: '2026-04-28 08:45:00', createTime: '2026-04-28 08:45:00' },
  { id: 5, userId: 'U10005', userNick: 'AI艺术家小美', projectName: 'AI绘画工具推广', platform: 'B站', workUrl: 'https://example.com/work/5', workTitle: 'Midjourney v6完整教程，AI绘画从入门到精通', keyword: 'AI绘画', playCount: 256000, likeCount: 8900, auditStatus: 'approved', rejectReason: '', auditor: '管理员王五', auditTime: '2026-04-25 16:20:00', submitTime: '2026-04-25 10:00:00', createTime: '2026-04-25 10:00:00' },
  { id: 6, userId: 'U10006', userNick: '漫画推广博主', projectName: '漫剧资源推广', platform: '抖音', workUrl: 'https://example.com/work/6', workTitle: '这部漫剧太上头了，一口气看了20集', keyword: '漫剧', playCount: 178000, likeCount: 5600, auditStatus: 'pending', rejectReason: '', auditor: '', auditTime: '', submitTime: '2026-04-28 11:30:00', createTime: '2026-04-28 11:30:00' },
]

async function fetchList(p = 1) {
  loading.value = true; page.value = p; selectedIds.clear()
  await new Promise(r => setTimeout(r, 200))
  let data = [...MOCK_DATA]
  if (filters.value.userId) data = data.filter(d => d.userId.includes(filters.value.userId))
  if (filters.value.projectName) data = data.filter(d => d.projectName.includes(filters.value.projectName))
  if (filters.value.platform) data = data.filter(d => d.platform === filters.value.platform)
  if (filters.value.auditStatus) data = data.filter(d => d.auditStatus === filters.value.auditStatus)
  total.value = data.length
  list.value = data.slice((p - 1) * pageSize.value, p * pageSize.value)
  loading.value = false
}

function resetFilter() {
  filters.value = { userId: '', projectName: '', platform: '', auditStatus: '', timeStart: '', timeEnd: '' }
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

function getPlatformTagClass(p: string) { return PLATFORM_TAG_MAP[p] || 'tag-gray' }
function getAuditLabel(s: string) { return { pending: '待审核', approved: '已通过', rejected: '已驳回' }[s] || s }
function getAuditBadgeClass(s: string) { return { pending: 'badge-warning', approved: 'badge-success', rejected: 'badge-danger' }[s] || '' }
function formatCount(n: number) { return n >= 10000 ? (n / 10000).toFixed(1) + '万' : String(n) }

function confirmApprove(row: WorkItem) {
  currentRow.value = row; bulkApproveMode.value = false; approveVisible.value = true
}
function confirmBulkApprove() {
  bulkApproveMode.value = true; approveVisible.value = true
}
function submitApprove() {
  approveVisible.value = false
  showToast(bulkApproveMode.value ? `已批量通过 ${selectedIds.size} 条作品` : '审核通过成功', 'success')
  if (bulkApproveMode.value) selectedIds.clear()
  fetchList(page.value)
}

function openReject(row: WorkItem) {
  currentRow.value = row; rejectReason.value = ''; rejectVisible.value = true
}
function openBulkReject() {
  bulkRejectReason.value = ''; bulkRejectVisible.value = true
}
function submitReject() {
  if (!rejectReason.value.trim()) { showToast('请填写驳回原因', 'error'); return }
  rejectVisible.value = false
  showToast('驳回成功', 'success')
  fetchList(page.value)
}
function submitBulkReject() {
  if (!bulkRejectReason.value.trim()) { showToast('请填写驳回原因', 'error'); return }
  bulkRejectVisible.value = false
  showToast(`已批量驳回 ${selectedIds.size} 条作品`, 'success')
  selectedIds.clear()
  fetchList(page.value)
}

function openDetail(row: WorkItem) { currentRow.value = row; detailVisible.value = true }
function handleExport() { showToast('导出文件已生成，即将下载', 'success') }

function showToast(msg: string, type: Toast['type'] = 'info') {
  const id = ++toastId; toasts.value.push({ id, msg, type })
  setTimeout(() => removeToast(id), 3000)
}
function removeToast(id: number) { toasts.value = toasts.value.filter(t => t.id !== id) }

onMounted(() => fetchList(1))
</script>

<style scoped>
.wm-wrap { min-height: 100%; }
.wm-filter { padding: 16px 18px 14px; margin-bottom: 14px; }
.wm-modal-sm { width: 480px !important; }

.work-link {
  color: var(--primary);
  text-decoration: none;
  font-size: 13px;
}
.work-link:hover { text-decoration: underline; }

/* 详情抽屉 */
.detail-section { margin-bottom: 24px; }
.detail-section-title {
  font-size: 13px; font-weight: 600; color: var(--text-primary);
  padding-bottom: 8px; border-bottom: 1px solid var(--border); margin-bottom: 14px;
}
.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 16px; }
.detail-item { display: flex; flex-direction: column; gap: 4px; }
.detail-label { font-size: 11.5px; color: var(--text-muted); font-weight: 500; }

/* pink tag */
.tag-pink { background: #fdf2f8; color: #be185d; }
.tag-red { background: #fef2f2; color: #dc2626; }
[data-theme="dark"] .tag-pink { background: rgba(190,24,93,0.15); color: #f472b6; }
[data-theme="dark"] .tag-red { background: rgba(220,38,38,0.15); color: #f87171; }

/* badge */
.badge { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; }
.badge-warning { background: var(--warning-bg); color: var(--warning); }
.badge-success { background: var(--success-bg); color: var(--success); }
.badge-danger { background: var(--danger-bg); color: var(--danger); }

.btn-success {
  background: var(--success); color: #fff; border: none;
  padding: 6px 14px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 500; cursor: pointer;
  transition: var(--transition);
}
.btn-success:hover { background: #15803d; }
.btn-success.btn-sm { padding: 4px 10px; font-size: 12px; }
</style>
