<template>
  <div class="user-list-wrap">
    <!-- 面包屑 -->
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">用户管理</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">用户列表</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">用户管理</h1>
          <p class="page-desc">管理平台所有注册用户信息</p>
        </div>
      </div>

      <!-- 筛选区 -->
      <div class="glass-card ul-filter-card">
        <div class="ul-filter-grid">
          <div class="ul-form-group">
            <label class="ul-label">用户ID</label>
            <input v-model="filters.userId" type="text" class="ul-input" placeholder="精确匹配用户ID">
          </div>
          <div class="ul-form-group">
            <label class="ul-label">手机号</label>
            <input v-model="filters.phone" type="text" class="ul-input" placeholder="请输入手机号">
          </div>
          <div class="ul-form-group">
            <label class="ul-label">昵称</label>
            <input v-model="filters.nickname" type="text" class="ul-input" placeholder="请输入昵称关键词">
          </div>
          <div class="ul-form-group">
            <label class="ul-label">账号状态</label>
            <select v-model="filters.status" class="ul-input ul-select">
              <option value="">全部</option>
              <option value="normal">正常</option>
              <option value="blacklist">黑名单</option>
              <option value="disabled">已禁用</option>
              <option value="cancelled">已注销</option>
              <option value="deleted">后台删除</option>
            </select>
          </div>
          <!-- 展开字段 -->
          <template v-if="filterExpanded">
            <div class="ul-form-group">
              <label class="ul-label">实名状态</label>
              <select v-model="filters.realnameStatus" class="ul-input ul-select">
                <option value="">全部</option><option value="0">未实名</option><option value="1">已实名</option>
              </select>
            </div>
            <div class="ul-form-group">
              <label class="ul-label">注册渠道</label>
              <select v-model="filters.channel" class="ul-input ul-select">
                <option value="">全部渠道</option>
                <option value="miniapp">小程序</option><option value="h5">H5</option>
                <option value="pc">PC</option><option value="android">安卓</option><option value="ios">iOS</option>
              </select>
            </div>
            <div class="ul-form-group">
              <label class="ul-label">虚拟用户</label>
              <select v-model="filters.isVirtual" class="ul-input ul-select">
                <option value="">全部</option><option value="1">是</option><option value="0">否</option>
              </select>
            </div>
            <div class="ul-form-group">
              <label class="ul-label">是否禁用</label>
              <select v-model="filters.isDisabled" class="ul-input ul-select">
                <option value="">全部</option><option value="1">是</option><option value="0">否</option>
              </select>
            </div>
            <div class="ul-form-group">
              <label class="ul-label">邀请码</label>
              <input v-model="filters.inviteCode" type="text" class="ul-input" placeholder="请输入邀请码">
            </div>
            <div class="ul-form-group">
              <label class="ul-label">邀请人ID</label>
              <input v-model="filters.inviterId" type="text" class="ul-input" placeholder="请输入邀请人用户ID">
            </div>
            <div class="ul-form-group">
              <label class="ul-label">注册开始时间</label>
              <input v-model="filters.regTimeStart" type="date" class="ul-input">
            </div>
            <div class="ul-form-group">
              <label class="ul-label">注册结束时间</label>
              <input v-model="filters.regTimeEnd" type="date" class="ul-input">
            </div>
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

      <!-- 表格区 -->
      <div class="glass-card table-card">
        <div class="table-header">
          <div class="table-title">
            用户列表
            <span class="table-count">共 {{ total.toLocaleString() }} 条</span>
          </div>
          <div v-if="selectedIds.length === 0" class="table-header-right">
            <button class="btn btn-default btn-sm" @click="handleImport">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              导入虚拟用户
            </button>
            <button class="btn btn-default btn-sm" @click="handleExport">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              导出 Excel
            </button>
          </div>
          <div v-else class="ul-bulk-bar">
            <span style="font-size:13px;color:var(--text-primary)">已选 <strong style="color:var(--primary)">{{ selectedIds.length }}</strong> 项</span>
            <button class="btn btn-default btn-sm" @click="handleExport">导出选中</button>
            <button class="btn btn-ghost btn-sm" @click="selectedIds = []">取消</button>
          </div>
        </div>
        <div class="ul-table-wrap">
          <table class="ul-table ul-table--clickable" style="table-layout:auto">
            <colgroup>
              <col style="width:36px">
              <col style="min-width:160px"><!-- 用户信息 -->
              <col style="min-width:110px"><!-- 手机号 -->
              <col style="min-width:140px"><!-- 当前身份 -->
              <col style="min-width:90px"> <!-- 累计提现 -->
              <col style="min-width:90px"> <!-- 当前余额 -->
              <col style="min-width:80px"> <!-- 实名状态 -->
              <col style="min-width:80px"> <!-- 账号状态 -->
              <col style="min-width:70px"> <!-- 注册渠道 -->
              <col style="min-width:100px"><!-- 邀请码 -->
              <col style="min-width:90px"> <!-- 邀请人ID -->
              <col style="min-width:50px"> <!-- 虚拟用户 -->
              <col style="min-width:100px"><!-- 注册时间 -->
              <col style="min-width:100px"><!-- 操作 -->
            </colgroup>
            <thead>
              <tr>
                <th>
                  <input type="checkbox" :checked="allSelected" style="accent-color:var(--primary)" @change="toggleAll">
                </th>
                <th>用户信息</th>
                <th>手机号</th>
                <th>当前身份</th>
                <th class="ul-sortable" @click="toggleSort('totalWithdraw')">
                  累计提现
                  <span class="ul-sort-icon">
                    <svg width="7" height="4" viewBox="0 0 8 5"><path d="M4 0L8 5H0z" :fill="sortField==='totalWithdraw'&&sortOrder==='asc'?'#2563eb':'currentColor'"/></svg>
                    <svg width="7" height="4" viewBox="0 0 8 5" style="transform:rotate(180deg)"><path d="M4 0L8 5H0z" :fill="sortField==='totalWithdraw'&&sortOrder==='desc'?'#2563eb':'currentColor'"/></svg>
                  </span>
                </th>
                <th>当前余额</th>
                <th>实名状态</th>
                <th>账号状态</th>
                <th>注册渠道</th>
                <th>邀请码</th>
                <th>邀请人ID</th>
                <th>虚拟</th>
                <th class="ul-sortable" @click="toggleSort('regTime')">
                  注册时间
                  <span class="ul-sort-icon">
                    <svg width="7" height="4" viewBox="0 0 8 5"><path d="M4 0L8 5H0z" :fill="sortField==='regTime'&&sortOrder==='asc'?'#2563eb':'currentColor'"/></svg>
                    <svg width="7" height="4" viewBox="0 0 8 5" style="transform:rotate(180deg)"><path d="M4 0L8 5H0z" :fill="sortField==='regTime'&&sortOrder==='desc'?'#2563eb':'currentColor'"/></svg>
                  </span>
                </th>
                <th class="col-action" style="text-align:center">操作</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="loading">
                <tr v-for="i in pageSize" :key="i">
                  <td colspan="14"><div class="ul-skeleton"></div></td>
                </tr>
              </template>
              <template v-else-if="list.length === 0">
                <tr><td colspan="14">
                  <div class="ul-empty">
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                    <div style="font-size:14px;font-weight:600;color:var(--text-secondary);margin:8px 0 4px">暂无用户数据</div>
                    <div style="font-size:12px;color:var(--text-muted)">尝试调整筛选条件</div>
                  </div>
                </td></tr>
              </template>
              <template v-else>
                <tr
                  v-for="row in list" :key="row.userId"
                  :class="{ 'ul-row-selected': selectedIds.includes(row.userId) }"
                  class="ul-row"
                  @click="openDetail(row)"
                >
                  <td @click.stop>
                    <input type="checkbox" :checked="selectedIds.includes(row.userId)" style="accent-color:var(--primary)" @change="toggleRow(row.userId)">
                  </td>
                  <td>
                    <div class="ul-user-cell">
                      <div class="ul-avatar">{{ row.nickname.slice(0,1) }}</div>
                      <div>
                        <div class="ul-uname">{{ row.nickname }}</div>
                        <div class="ul-uid">{{ row.userId }}</div>
                      </div>
                    </div>
                  </td>
                  <td><span class="ul-mono">{{ maskPhone(row.phone) }}</span></td>
                  <td>
                    <div style="display:flex;flex-wrap:wrap;gap:3px">
                      <span v-for="id in row.identities" :key="id" class="tag" :class="getIdentityTagClass(id)">{{ id }}</span>
                    </div>
                  </td>
                  <td><span class="ul-mono">¥{{ row.totalWithdraw.toFixed(2) }}</span></td>
                  <td><span class="ul-mono">¥{{ row.balance.toFixed(2) }}</span></td>
                  <td>
                    <span class="badge" :class="row.realnameStatus === 1 ? 'badge-success' : 'badge-gray'">
                      {{ row.realnameStatus === 1 ? '已实名' : '未实名' }}
                    </span>
                  </td>
                  <td>
                    <span class="badge" :class="getStatusClass(row.status)">{{ getStatusLabel(row.status) }}</span>
                  </td>
                  <td><span class="tag tag-gray">{{ row.channel }}</span></td>
                  <td>
                    <div style="display:flex;align-items:center;gap:3px">
                      <span class="ul-mono" style="font-size:11.5px">{{ row.inviteCode }}</span>
                      <button class="ul-copy-btn" title="复制" @click.stop="copyText(row.inviteCode)">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                      </button>
                    </div>
                  </td>
                  <td><span class="ul-mono ul-muted">{{ row.inviterId || '—' }}</span></td>
                  <td>
                    <span v-if="row.isVirtual" class="badge badge-info">是</span>
                    <span v-else class="ul-muted">否</span>
                  </td>
                  <td><span class="ul-muted">{{ row.regTime }}</span></td>
                  <td class="col-action" @click.stop>
                    <div class="action-btns">
                      <button type="button" class="action-btn view" title="查看详情" @click="openDetail(row)">查看</button>
                      <button type="button" class="action-btn edit" title="编辑" @click="openEdit(row)">编辑</button>
                      <button
                        type="button"
                        :class="row.status === 'disabled' ? 'action-btn edit' : 'action-btn disable'"
                        :title="row.status === 'disabled' ? '启用' : '禁用'"
                        @click="toggleDisable(row)"
                      >
                        {{ row.status === 'disabled' ? '启用' : '禁用' }}
                      </button>
                      <button type="button" class="action-btn delete" title="删除" @click="confirmDelete(row)">删除</button>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <!-- 分页 -->
        <div class="ul-pagination">
          <span class="ul-page-info">共 <strong>{{ total.toLocaleString() }}</strong> 条，第 <strong>{{ page }}</strong>/<strong>{{ totalPages }}</strong> 页</span>
          <div style="display:flex;align-items:center;gap:4px">
            <button class="ul-pg-btn" :disabled="page <= 1" @click="fetchList(1)">«</button>
            <button class="ul-pg-btn" :disabled="page <= 1" @click="fetchList(page - 1)">‹</button>
            <template v-for="p in paginationPages" :key="p">
              <button v-if="p !== '...'" class="ul-pg-btn" :class="{ active: p === page }" @click="fetchList(Number(p))">{{ p }}</button>
              <span v-else style="padding:0 4px;color:var(--text-muted);font-size:13px">...</span>
            </template>
            <button class="ul-pg-btn" :disabled="page >= totalPages" @click="fetchList(page + 1)">›</button>
            <button class="ul-pg-btn" :disabled="page >= totalPages" @click="fetchList(totalPages)">»</button>
          </div>
          <div style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text-muted)">
            每页
            <select class="ul-pg-size" @change="changePageSize($event)">
              <option value="10">10</option>
              <option value="20" selected>20</option>
              <option value="50">50</option>
            </select>
            条
          </div>
        </div>
      </div>
    </div>

    <!-- 用户详情抽屉 -->
    <div class="ul-overlay" :class="{ show: drawerVisible }" @click="drawerVisible = false"></div>
    <div class="ul-drawer" :class="{ show: drawerVisible }">
      <div class="ul-drawer-header">
        <div>
          <div style="font-size:15px;font-weight:700;color:var(--text-primary)">用户详情</div>
          <div style="font-size:12px;color:var(--text-muted)">{{ drawerUser?.userId }}</div>
        </div>
        <button class="ul-icon-btn" @click="drawerVisible = false">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div v-if="drawerUser" class="ul-drawer-body">
        <!-- 基本信息 -->
        <div class="ul-drawer-section">
          <div class="ul-section-title"><span class="ul-section-dot"></span>基本信息</div>
          <div class="ul-detail-grid">
            <div class="ul-detail-item"><div class="ul-detail-label">用户ID</div><div class="ul-detail-val ul-mono">{{ drawerUser.userId }}</div></div>
            <div class="ul-detail-item"><div class="ul-detail-label">昵称</div><div class="ul-detail-val">{{ drawerUser.nickname }}</div></div>
            <div class="ul-detail-item"><div class="ul-detail-label">手机号</div><div class="ul-detail-val ul-mono">{{ drawerUser.phone }}</div></div>
            <div class="ul-detail-item"><div class="ul-detail-label">邀请码</div><div class="ul-detail-val ul-mono">{{ drawerUser.inviteCode }}</div></div>
            <div class="ul-detail-item"><div class="ul-detail-label">注册渠道</div><div class="ul-detail-val">{{ drawerUser.channel }}</div></div>
            <div class="ul-detail-item"><div class="ul-detail-label">邀请人ID</div><div class="ul-detail-val ul-mono">{{ drawerUser.inviterId || '—' }}</div></div>
            <div class="ul-detail-item"><div class="ul-detail-label">注册时间</div><div class="ul-detail-val">{{ drawerUser.regTime }}</div></div>
            <div class="ul-detail-item"><div class="ul-detail-label">虚拟用户</div><div class="ul-detail-val">{{ drawerUser.isVirtual ? '是' : '否' }}</div></div>
          </div>
        </div>
        <!-- 身份与状态 -->
        <div class="ul-drawer-section">
          <div class="ul-section-title"><span class="ul-section-dot"></span>身份与状态</div>
          <div class="ul-detail-grid">
            <div class="ul-detail-item">
              <div class="ul-detail-label">当前身份</div>
              <div class="ul-detail-val" style="display:flex;flex-wrap:wrap;gap:4px">
                <span v-for="id in drawerUser.identities" :key="id" class="tag" :class="getIdentityTagClass(id)">{{ id }}</span>
              </div>
            </div>
            <div class="ul-detail-item">
              <div class="ul-detail-label">账号状态</div>
              <div class="ul-detail-val"><span class="badge" :class="getStatusClass(drawerUser.status)">{{ getStatusLabel(drawerUser.status) }}</span></div>
            </div>
            <div class="ul-detail-item">
              <div class="ul-detail-label">实名状态</div>
              <div class="ul-detail-val"><span class="badge" :class="drawerUser.realnameStatus === 1 ? 'badge-success' : 'badge-gray'">{{ drawerUser.realnameStatus === 1 ? '已实名' : '未实名' }}</span></div>
            </div>
          </div>
        </div>
        <!-- 资金信息 -->
        <div class="ul-drawer-section">
          <div class="ul-section-title"><span class="ul-section-dot"></span>资金信息</div>
          <div class="ul-detail-grid">
            <div class="ul-detail-item"><div class="ul-detail-label">当前余额</div><div class="ul-detail-val ul-mono" style="color:var(--success);font-size:14px;font-weight:700">¥{{ drawerUser.balance.toFixed(2) }}</div></div>
            <div class="ul-detail-item"><div class="ul-detail-label">累计提现</div><div class="ul-detail-val ul-mono">¥{{ drawerUser.totalWithdraw.toFixed(2) }}</div></div>
          </div>
        </div>
      </div>
      <div class="ul-drawer-footer">
        <button class="btn btn-default" @click="drawerVisible = false">关闭</button>
        <button class="btn btn-primary" @click="openEdit(drawerUser!)">编辑用户</button>
      </div>
    </div>

    <!-- 删除确认弹窗 -->
    <div class="ul-overlay" :class="{ show: deleteVisible }" @click="deleteVisible = false"></div>
    <div class="ul-modal" :class="{ show: deleteVisible }">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--border)">
        <div style="font-size:15px;font-weight:700;color:var(--danger)">确认删除</div>
        <button class="ul-icon-btn" @click="deleteVisible = false">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div style="padding:20px">
        <p style="font-size:13px;color:var(--text-secondary);line-height:1.6">
          确认删除用户 <strong style="color:var(--text-primary)">{{ deleteTarget?.nickname }}</strong>（{{ deleteTarget?.userId }}）？<br>此操作不可撤销。
        </p>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:10px;padding:14px 20px;border-top:1px solid var(--border)">
        <button class="btn btn-default" @click="deleteVisible = false">取消</button>
        <button class="btn btn-danger" @click="doDelete">确认删除</button>
      </div>
    </div>

    <!-- Toast -->
    <div class="ul-toast-container">
      <div v-for="t in toasts" :key="t.id" class="ul-toast" :class="t.type">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" :stroke="t.type==='success'?'var(--success)':t.type==='error'?'var(--danger)':'var(--info)'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:1px">
          <polyline v-if="t.type==='success'" points="20 6 9 17 4 12"/>
          <circle v-else cx="12" cy="12" r="10"/>
        </svg>
        <span style="flex:1;color:var(--text-primary);line-height:1.5">{{ t.msg }}</span>
        <button style="background:none;border:none;cursor:pointer;color:var(--text-muted);font-size:14px" @click="removeToast(t.id)">✕</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

interface UserItem {
  userId: string; nickname: string; phone: string; identities: string[]
  totalWithdraw: number; balance: number; realnameStatus: number
  status: string; channel: string; inviteCode: string; inviterId: string
  isVirtual: boolean; regTime: string
}
interface Toast { id: number; msg: string; type: 'success' | 'error' | 'info' }

const router = useRouter()
const loading = ref(false)
const list = ref<UserItem[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)
const selectedIds = ref<string[]>([])
const sortField = ref('')
const sortOrder = ref<'asc' | 'desc'>('desc')
const filterExpanded = ref(false)
const drawerVisible = ref(false)
const drawerUser = ref<UserItem | null>(null)
const deleteVisible = ref(false)
const deleteTarget = ref<UserItem | null>(null)
const toasts = ref<Toast[]>([])
let toastId = 0

const filters = ref({
  userId: '', phone: '', nickname: '', status: '',
  realnameStatus: '', channel: '', isVirtual: '', isDisabled: '',
  inviteCode: '', inviterId: '', regTimeStart: '', regTimeEnd: '',
})

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
const allSelected = computed(() => list.value.length > 0 && list.value.every((r) => selectedIds.value.includes(r.userId)))
const paginationPages = computed(() => {
  const t = totalPages.value
  const c = page.value
  const pages: (number | string)[] = []
  if (t <= 7) { for (let i = 1; i <= t; i++) pages.push(i); return pages }
  pages.push(1)
  if (c > 4) pages.push('...')
  const s = Math.max(2, c - 2)
  const e = Math.min(t - 1, c + 2)
  for (let i = s; i <= e; i++) pages.push(i)
  if (c < t - 3) pages.push('...')
  pages.push(t)
  return pages
})

const CHANNELS = ['小程序', 'H5', 'PC', '安卓', 'iOS']
const IDENTITIES_POOL = ['普通用户', '团长', '达人', 'VIP']

function mockUsers(count: number, startIdx: number): UserItem[] {
  return Array.from({ length: count }, (_, i) => {
    const idx = startIdx + i + 1
    const idList: string[] = [IDENTITIES_POOL[Math.floor(Math.random() * 2)]]
    if (Math.random() > 0.7) idList.push(IDENTITIES_POOL[2 + Math.floor(Math.random() * 2)])
    return {
      userId: `U${String(10000 + idx).padStart(5, '0')}`,
      nickname: ['张三', '李四', '王五', '赵六', '测试用户', '孙七'][i % 6],
      phone: `138${String(Math.floor(10000000 + Math.random() * 89999999))}`,
      identities: idList,
      totalWithdraw: parseFloat((Math.random() * 5000).toFixed(2)),
      balance: parseFloat((Math.random() * 2000).toFixed(2)),
      realnameStatus: Math.random() > 0.4 ? 1 : 0,
      status: ['normal', 'normal', 'normal', 'blacklist', 'disabled', 'cancelled'][Math.floor(Math.random() * 6)],
      channel: CHANNELS[Math.floor(Math.random() * CHANNELS.length)],
      inviteCode: `INV${String(Math.floor(10000 + Math.random() * 89999))}`,
      inviterId: Math.random() > 0.6 ? `U${String(10001 + Math.floor(Math.random() * 500))}` : '',
      isVirtual: Math.random() > 0.9,
      regTime: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    }
  })
}

async function fetchList(p = 1) {
  loading.value = true
  selectedIds.value = []
  page.value = p
  await new Promise((r) => setTimeout(r, 280))
  total.value = 1248
  const startIdx = (p - 1) * pageSize.value
  const count = Math.min(pageSize.value, total.value - startIdx)
  list.value = mockUsers(count, startIdx)
  loading.value = false
}

function maskPhone(phone: string) {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

function resetFilter() {
  filters.value = { userId: '', phone: '', nickname: '', status: '', realnameStatus: '', channel: '', isVirtual: '', isDisabled: '', inviteCode: '', inviterId: '', regTimeStart: '', regTimeEnd: '' }
  fetchList(1)
}
function toggleAll(e: Event) {
  selectedIds.value = (e.target as HTMLInputElement).checked ? list.value.map((r) => r.userId) : []
}
function toggleRow(id: string) {
  if (selectedIds.value.includes(id)) selectedIds.value = selectedIds.value.filter((x) => x !== id)
  else selectedIds.value = [...selectedIds.value, id]
}
function toggleSort(f: string) {
  sortField.value === f ? (sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc') : (sortField.value = f, sortOrder.value = 'desc')
  fetchList(1)
}
function changePageSize(e: Event) {
  pageSize.value = Number((e.target as HTMLSelectElement).value)
  fetchList(1)
}
function openDetail(row: UserItem) { router.push(`/user/list/${row.userId}`) }
function openEdit(row: UserItem) { showToast(`编辑用户 ${row.userId}`, 'info') }
function toggleDisable(row: UserItem) {
  const a = row.status === 'disabled' ? '启用' : '禁用'
  row.status = row.status === 'disabled' ? 'normal' : 'disabled'
  showToast(`已${a}用户 ${row.userId}`, 'success')
}
function confirmDelete(row: UserItem) { deleteTarget.value = row; deleteVisible.value = true }
function doDelete() {
  if (!deleteTarget.value) return
  list.value = list.value.filter((r) => r.userId !== deleteTarget.value!.userId)
  total.value--; deleteVisible.value = false
  showToast('用户已删除', 'success')
}
async function copyText(text: string) {
  await navigator.clipboard.writeText(text).catch(() => {})
  showToast('已复制：' + text, 'success')
}
function handleImport() { showToast('请选择虚拟用户导入文件', 'info') }
function handleExport() { showToast('正在导出 Excel，请稍候…', 'info') }
function showToast(msg: string, type: Toast['type'] = 'info') {
  const id = ++toastId; toasts.value.push({ id, msg, type })
  setTimeout(() => removeToast(id), 3000)
}
function removeToast(id: number) { toasts.value = toasts.value.filter((t) => t.id !== id) }

function getStatusClass(s: string) {
  return { normal: 'badge-success', blacklist: 'badge-danger', disabled: 'badge-warning', cancelled: 'badge-gray', deleted: 'badge-gray' }[s] ?? 'badge-gray'
}
function getStatusLabel(s: string) {
  return { normal: '正常', blacklist: '黑名单', disabled: '已禁用', cancelled: '已注销', deleted: '后台删除' }[s] ?? s
}
function getIdentityTagClass(id: string) {
  if (id.includes('团长')) return 'tag-purple'
  if (id.includes('达人')) return 'tag-blue'
  if (id.includes('VIP')) return 'tag-amber'
  return 'tag-gray'
}

onMounted(() => fetchList(1))
</script>

<style>
/* 非 scoped — 使用 ul- 前缀避免全局冲突 */
.user-list-wrap { min-height: 100%; }

/* 筛选 */
.ul-filter-card { padding: 16px 18px 14px; margin-bottom: 14px; }
@media (max-width:1200px) { .ul-filter-grid { grid-template-columns: repeat(3,1fr); } }
@media (max-width:900px)  { .ul-filter-grid { grid-template-columns: repeat(2,1fr); } }

/* 表格 */
.ul-table-wrap { overflow-x: auto; }
.ul-table {
  width: 100%; border-collapse: collapse; font-size: 13px;
  table-layout: auto;
}
.ul-table thead th {
  background: var(--surface-hover); padding: 10px 10px;
  font-size: 11.5px; font-weight: 600; color: var(--text-muted);
  border-bottom: 1px solid var(--border); white-space: nowrap;
  text-align: left;
}
[data-theme="dark"] .ul-table thead th { background: rgba(39,51,72,.8); }
.ul-table tbody .ul-row { border-bottom: 1px solid var(--border); transition: var(--transition); cursor: pointer; }
.ul-table tbody .ul-row:last-child { border-bottom: none; }
.ul-table tbody .ul-row:hover td { background: rgba(37,99,235,.04); }
.ul-table tbody .ul-row:hover { box-shadow: inset 3px 0 0 var(--primary); }
.ul-table tbody .ul-row.ul-row-selected td { background: rgba(37,99,235,.06); }
.ul-table tbody .ul-row.ul-row-selected { box-shadow: inset 3px 0 0 var(--primary); }
.ul-table td { padding: 10px 10px; color: var(--text-primary); vertical-align: middle; white-space: nowrap; }
.ul-sortable { cursor: pointer; }
.ul-sortable:hover { color: var(--primary); }
.ul-sort-icon { display: inline-flex; flex-direction: column; gap: 1px; margin-left: 3px; vertical-align: middle; opacity: .5; }

/* 用户单元格 */
.ul-user-cell { display: flex; align-items: center; gap: 8px; }
.ul-avatar { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #fff; flex-shrink: 0; background: linear-gradient(135deg,#2563eb,#7c3aed); }
.ul-uname { font-size: 13px; font-weight: 600; color: var(--text-primary); max-width: 120px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.ul-uid { font-size: 11px; color: var(--text-muted); font-family: monospace; }
.ul-copy-btn { background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 2px 3px; border-radius: 3px; transition: var(--transition); display: inline-flex; align-items: center; }
.ul-copy-btn:hover { color: var(--primary); background: var(--primary-light); }

/* 批量栏 */
.ul-bulk-bar { display: flex; align-items: center; gap: 10px; }
.ul-page-info strong { color: var(--text-primary); }

/* 骨架/空状态 */
.ul-empty { padding: 56px 20px; text-align: center; }

.ul-drawer-section { margin-bottom: 22px; }
.ul-section-title { font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 6px; }
.ul-section-dot { width: 4px; height: 14px; border-radius: 2px; background: var(--primary); flex-shrink: 0; }
.ul-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.ul-detail-item { display: flex; flex-direction: column; gap: 4px; }
.ul-detail-label { font-size: 11px; color: var(--text-muted); font-weight: 500; }
.ul-detail-val { font-size: 13px; color: var(--text-primary); word-break: break-all; }

.btn-ghost { background: transparent; color: var(--text-secondary); border: 1px solid transparent; }
.btn-ghost:hover { background: var(--surface-hover); }
</style>
