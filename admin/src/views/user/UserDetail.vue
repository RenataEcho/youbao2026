<template>
  <div class="ud-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <router-link to="/user/list" style="color:var(--text-secondary);text-decoration:none">用户列表</router-link>
      <span class="bc-sep">/</span>
      <span class="bc-cur">用户详情</span>
    </div>

    <div class="page-content">
      <!-- Page Header -->
      <div class="page-header">
        <div style="display:flex;align-items:center;gap:14px">
          <button class="btn btn-default btn-sm" @click="$router.back()">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            返回列表
          </button>
          <div class="ud-hero">
            <div class="ud-avatar-lg">{{ user.nickname.slice(0,1) }}</div>
            <div>
              <div class="ud-hero-name">{{ user.nickname }}</div>
              <div class="ud-hero-sub">UID: {{ user.userId }} · 注册于 {{ user.regTime }}</div>
            </div>
          </div>
        </div>
        <div style="display:flex;gap:8px">
          <button v-if="!editMode" class="btn btn-default" @click="editMode=true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            编辑
          </button>
          <button v-if="editMode" class="btn btn-default" @click="editMode=false">取消</button>
          <button v-if="editMode" class="btn btn-primary" @click="saveEdit">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            保存
          </button>
          <button v-if="!editMode" class="btn btn-default" @click="showToast('跳转至提现记录','info')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            提现记录
          </button>
          <button v-if="!editMode" class="btn btn-default" @click="showToast('跳转至收益统计','info')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            收益统计
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="ud-tabs">
        <button class="ud-tab" :class="{active:activeTab==='basic'}" @click="activeTab='basic'">基础信息</button>
        <button class="ud-tab" :class="{active:activeTab==='finance'}" @click="activeTab='finance'">资金信息</button>
        <button class="ud-tab" :class="{active:activeTab==='log'}" @click="activeTab='log'">操作日志</button>
      </div>

      <!-- ===== Tab: 基础信息 ===== -->
      <div v-show="activeTab==='basic'">
        <!-- 用户信息 -->
        <div class="glass-card ud-section">
          <div class="ud-section-title"><div class="ud-dot"></div>用户信息</div>
          <div class="ud-field-grid">
            <div class="ud-field"><div class="ud-label">用户ID</div>
              <div class="ud-val ud-mono">{{ user.userId }}</div>
            </div>
            <div class="ud-field"><div class="ud-label">昵称 <span v-if="editMode" style="color:var(--danger)">*</span></div>
              <div v-if="!editMode" class="ud-val">{{ user.nickname }}</div>
              <input v-else v-model="editForm.nickname" class="ud-input" placeholder="昵称">
            </div>
            <div class="ud-field"><div class="ud-label">手机号 <span v-if="editMode" style="color:var(--danger)">*</span></div>
              <div v-if="!editMode" class="ud-val ud-mono">{{ maskPhone(user.phone) }}</div>
              <input v-else v-model="editForm.phone" class="ud-input" placeholder="手机号">
            </div>
            <div class="ud-field"><div class="ud-label">性别</div>
              <div v-if="!editMode" class="ud-val">{{ user.gender }}</div>
              <select v-else v-model="editForm.gender" class="ud-input ud-select"><option>女</option><option>男</option><option>未知</option></select>
            </div>
            <div class="ud-field"><div class="ud-label">地址</div>
              <div v-if="!editMode" class="ud-val">{{ user.address }}</div>
              <input v-else v-model="editForm.address" class="ud-input" placeholder="省.市.区">
            </div>
            <div class="ud-field"><div class="ud-label">是否禁用</div>
              <div v-if="!editMode" class="ud-val"><span class="badge" :class="user.disabled?'badge-danger':'badge-gray'">{{ user.disabled?'是':'否' }}</span></div>
              <select v-else v-model="editForm.disabled" class="ud-input ud-select"><option :value="false">否</option><option :value="true">是</option></select>
            </div>
          </div>
        </div>

        <!-- 当前身份 -->
        <div class="glass-card ud-section">
          <div class="ud-section-title"><div class="ud-dot"></div>当前身份</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;padding:4px 0">
            <span v-for="id in user.identities" :key="id" class="tag" :class="getIdTagClass(id)">{{ id }}</span>
          </div>
        </div>

        <!-- 账号状态 -->
        <div class="glass-card ud-section">
          <div class="ud-section-title"><div class="ud-dot"></div>账号状态</div>
          <div class="ud-field-grid">
            <div class="ud-field"><div class="ud-label">账号状态</div>
              <div class="ud-val"><span class="badge badge-success">正常</span></div>
            </div>
            <div class="ud-field"><div class="ud-label">实名状态</div>
              <div class="ud-val">
                <span class="badge" :class="user.realnameStatus===1?'badge-success':'badge-gray'">{{ user.realnameStatus===1?'已实名':'未实名' }}</span>
                <span v-if="user.realnameStatus===1" class="tag tag-green" style="font-size:10px;margin-left:4px">个人</span>
              </div>
            </div>
            <div class="ud-field"><div class="ud-label">注册渠道</div>
              <div class="ud-val"><span class="tag tag-gray">{{ user.channel }}</span></div>
            </div>
            <div class="ud-field"><div class="ud-label">虚拟用户</div>
              <div class="ud-val">{{ user.isVirtual?'是':'否' }}</div>
            </div>
            <div class="ud-field"><div class="ud-label">注册时间</div>
              <div class="ud-val ud-mono">{{ user.regTime }}</div>
            </div>
            <div class="ud-field"><div class="ud-label">最近登录时间</div>
              <div class="ud-val ud-mono">{{ user.lastLoginTime }}</div>
            </div>
            <div class="ud-field"><div class="ud-label">最近登录IP</div>
              <div class="ud-val ud-mono">{{ user.lastLoginIp }}</div>
            </div>
            <div class="ud-field"><div class="ud-label">注销/删除时间</div>
              <div class="ud-val" style="color:var(--text-muted)">{{ user.deleteTime || '—' }}</div>
            </div>
          </div>
        </div>

        <!-- 邀请信息 -->
        <div class="glass-card ud-section">
          <div class="ud-section-title"><div class="ud-dot"></div>邀请信息</div>
          <div class="ud-field-grid">
            <div class="ud-field"><div class="ud-label">邀请码</div>
              <div v-if="!editMode" class="ud-val">
                <span class="ud-mono">{{ user.inviteCode }}</span>
                <span v-if="user.inviteCodeNum" style="color:var(--text-muted);margin-left:4px">（{{ user.inviteCodeNum }}）</span>
              </div>
              <input v-else v-model="editForm.inviteCode" class="ud-input" placeholder="后台配置邀请码（可为空）">
            </div>
            <div class="ud-field"><div class="ud-label">邀请人ID</div>
              <div v-if="!editMode" class="ud-val ud-mono">{{ user.inviterId || '—' }}</div>
              <input v-else v-model="editForm.inviterId" class="ud-input" placeholder="邀请人ID">
            </div>
          </div>
        </div>

        <!-- 联系方式 -->
        <div class="glass-card ud-section">
          <div class="ud-section-title"><div class="ud-dot"></div>联系方式</div>
          <!-- 只读态 -->
          <div v-if="!editMode">
            <button class="btn btn-default btn-sm" @click="contactModalVisible=true">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              查看联系方式（{{ user.contacts.length }} 组）
            </button>
          </div>
          <!-- 编辑态 -->
          <div v-else>
            <div style="font-size:12px;color:var(--text-muted);margin-bottom:10px">最多 5 组，每组：微信号 + 微信二维码</div>
            <div style="display:flex;flex-direction:column;gap:8px">
              <div v-for="(c,ci) in editForm.contacts" :key="ci" style="display:flex;align-items:center;gap:8px">
                <input v-model="c.wechatId" class="ud-input" style="flex:1" :placeholder="`微信号 ${ci+1}`">
                <div style="width:46px;height:46px;background:var(--surface-hover);border:1px solid var(--border);border-radius:6px;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0" @click="showToast('点击上传二维码','info')">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                </div>
                <button class="btn btn-ghost btn-sm" @click="editForm.contacts.splice(ci,1)">删除</button>
              </div>
            </div>
            <button v-if="editForm.contacts.length<5" class="btn btn-ghost btn-sm" style="margin-top:10px" @click="editForm.contacts.push({wechatId:''})">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              添加一组
            </button>
          </div>
        </div>
      </div>

      <!-- ===== Tab: 资金信息 ===== -->
      <div v-show="activeTab==='finance'">
        <div class="ud-stat-row">
          <div class="glass-card ud-stat-card">
            <div class="ud-stat-label">当前余额</div>
            <div class="ud-stat-value" style="color:var(--primary)">¥ 4,280.00</div>
            <div class="ud-stat-sub">可提现金额</div>
          </div>
          <div class="glass-card ud-stat-card">
            <div class="ud-stat-label">累计提现</div>
            <div class="ud-stat-value" style="color:var(--success)">¥ 12,480.50</div>
            <div class="ud-stat-sub">历史累计</div>
          </div>
          <div class="glass-card ud-stat-card">
            <div class="ud-stat-label">冻结金额</div>
            <div class="ud-stat-value" style="color:var(--warning)">¥ 0.00</div>
            <div class="ud-stat-sub">审核中</div>
          </div>
        </div>
        <div class="glass-card ud-section">
          <div class="ud-section-title"><div class="ud-dot"></div>提现记录</div>
          <div style="overflow-x:auto">
            <table class="ud-table">
              <thead>
                <tr>
                  <th>提现单号</th><th>提现金额</th><th>提现账户</th><th>状态</th><th>申请时间</th><th>到账时间</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="w in withdrawRecords" :key="w.no">
                  <td class="ud-mono">{{ w.no }}</td>
                  <td style="font-weight:600;color:var(--success)">¥ {{ w.amount }}</td>
                  <td style="color:var(--text-muted)">{{ w.account }}</td>
                  <td><span class="badge" :class="w.status==='已到账'?'badge-success':'badge-warning'">{{ w.status }}</span></td>
                  <td style="color:var(--text-muted)">{{ w.applyTime }}</td>
                  <td style="color:var(--text-muted)">{{ w.arriveTime }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ===== Tab: 操作日志 ===== -->
      <div v-show="activeTab==='log'">
        <div class="glass-card ud-section">
          <div class="ud-section-title"><div class="ud-dot"></div>操作日志</div>
          <div style="overflow-x:auto">
            <table class="ud-table">
              <thead>
                <tr>
                  <th>操作时间</th><th>操作人</th><th>操作类型</th><th>操作内容</th><th>操作IP</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="log in opLogs" :key="log.time">
                  <td style="color:var(--text-muted)">{{ log.time }}</td>
                  <td>{{ log.operator }}</td>
                  <td><span class="tag" :class="log.typeClass">{{ log.type }}</span></td>
                  <td style="color:var(--text-secondary)">{{ log.content }}</td>
                  <td class="ud-mono" style="color:var(--text-muted)">{{ log.ip }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- 联系方式弹窗 -->
    <div class="ul-overlay" :class="{show:contactModalVisible}" @click="contactModalVisible=false"></div>
    <div class="ul-modal" :class="{show:contactModalVisible}" style="width:440px">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid var(--border)">
        <div style="font-size:14px;font-weight:600;display:flex;align-items:center;gap:6px">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          联系方式
        </div>
        <button class="ul-icon-btn" @click="contactModalVisible=false"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <div style="padding:16px 18px;display:flex;flex-direction:column;gap:10px">
        <div v-for="(c,ci) in user.contacts" :key="ci" style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-radius:8px;background:var(--surface-hover);border:1px solid var(--border)">
          <div>
            <div style="font-size:11px;color:var(--text-muted);margin-bottom:3px">第 {{ ci+1 }} 组</div>
            <div style="font-size:13px;font-weight:600">{{ c.wechatId }}</div>
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <div style="width:52px;height:52px;background:var(--surface);border:1px solid var(--border);border-radius:6px;display:flex;align-items:center;justify-content:center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
            </div>
            <button class="btn btn-default btn-sm" @click="showToast('查看二维码大图','info')">查看</button>
          </div>
        </div>
      </div>
      <div style="padding:8px 18px 14px;display:flex;justify-content:flex-end">
        <button class="btn btn-ghost btn-sm" @click="contactModalVisible=false">关闭</button>
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
import { ref, reactive } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeTab = ref('basic')
const editMode = ref(false)
const contactModalVisible = ref(false)
const toasts = ref<{id:number;msg:string;type:string}[]>([])
let toastId = 0

const user = reactive({
  userId: String(route.params.id || 'U10024'),
  nickname: '创意视觉工作室',
  phone: '13812348888',
  gender: '女',
  address: '中国.广东.深圳',
  disabled: false,
  identities: ['创作者.V2', '团长.V2', '导师'],
  realnameStatus: 1,
  channel: '小程序',
  isVirtual: false,
  regTime: '2026-01-05 09:22:10',
  lastLoginTime: '2026-04-27 18:30:22',
  lastLoginIp: '120.234.56.78',
  deleteTime: '',
  inviteCode: 'A1B2C3',
  inviteCodeNum: '8888',
  inviterId: 'U10005',
  contacts: [
    { wechatId: 'wx_user123' },
    { wechatId: 'wx_biz_456' },
  ],
})

const editForm = reactive({
  ...user,
  contacts: user.contacts.map(c => ({...c})),
})

const withdrawRecords = [
  { no:'WD20260427001234', amount:'2,800.00', account:'招商银行 **** 5678', status:'已到账', applyTime:'2026-04-20 10:12', arriveTime:'2026-04-20 18:30' },
  { no:'WD20260410008876', amount:'1,500.00', account:'招商银行 **** 5678', status:'已到账', applyTime:'2026-04-10 09:05', arriveTime:'2026-04-10 17:00' },
  { no:'WD20260328003321', amount:'5,000.00', account:'支付宝 138****8888', status:'已到账', applyTime:'2026-03-28 14:22', arriveTime:'2026-03-28 16:45' },
  { no:'WD20260310001122', amount:'3,180.50', account:'招商银行 **** 5678', status:'审核中', applyTime:'2026-03-10 11:40', arriveTime:'—' },
]

const opLogs = [
  { time:'2026-04-27 09:05:22', operator:'Admin', type:'修改信息', typeClass:'tag-blue', content:'修改用户昵称', ip:'192.168.1.100' },
  { time:'2026-04-15 14:30:10', operator:'ops001', type:'状态变更', typeClass:'tag-amber', content:'从正常 → 正常（重新核验）', ip:'10.0.0.5' },
  { time:'2026-04-01 10:00:00', operator:'system', type:'系统操作', typeClass:'tag-gray', content:'用户注册，自动创建账号', ip:'127.0.0.1' },
]

function maskPhone(s:string) { return s.replace(/(\d{3})\d{4}(\d{4})/,'$1****$2') }
function getIdTagClass(id:string) {
  if (id.includes('团长')) return 'tag-purple'
  if (id.includes('导师')) return 'tag-amber'
  if (id.includes('创作者')) return 'tag-blue'
  return 'tag-gray'
}
function saveEdit() {
  Object.assign(user, { ...editForm, contacts: editForm.contacts.map(c=>({...c})) })
  editMode.value=false; showToast('保存成功','success')
}
function showToast(msg:string, type='info') {
  const id=++toastId; toasts.value.push({id,msg,type}); setTimeout(()=>removeToast(id),3000)
}
function removeToast(id:number) { toasts.value=toasts.value.filter(t=>t.id!==id) }
</script>

<style>
.ud-wrap { min-height: 100%; }

.ud-hero { display:flex; align-items:center; gap:12px; }
.ud-avatar-lg { width:48px; height:48px; border-radius:50%; background:linear-gradient(135deg,#2563eb,#7c3aed); display:flex; align-items:center; justify-content:center; font-size:18px; font-weight:700; color:#fff; flex-shrink:0; }
.ud-hero-name { font-size:18px; font-weight:700; color:var(--text-primary); }
.ud-hero-sub { font-size:12px; color:var(--text-muted); margin-top:2px; }

/* ud-tabs 定义已移入 theme.css 全局 */
.ud-val { font-size:13px; color:var(--text-primary); word-break:break-all; }
.ud-mono { font-family:'SFMono-Regular','Consolas',monospace; font-size:12px; }
.ud-input { height:32px; padding:0 9px; font-size:13px; font-family:inherit; color:var(--text-primary); background:var(--surface); border:1px solid var(--border); border-radius:6px; outline:none; transition:var(--transition); width:100%; }
.ud-input:focus { border-color:var(--primary); box-shadow:0 0 0 3px rgba(37,99,235,.1); }
.ud-select { appearance:none; -webkit-appearance:none; cursor:pointer; padding-right:26px; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%239aa5b4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 8px center; }

.ud-stat-row { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:14px; }
.ud-stat-card { padding:18px 20px; }
.ud-stat-label { font-size:12px; color:var(--text-muted); margin-bottom:6px; }
.ud-stat-value { font-size:24px; font-weight:700; line-height:1.2; }
.ud-stat-sub { font-size:11px; color:var(--text-muted); margin-top:4px; }

.ud-table { width:100%; border-collapse:collapse; font-size:13px; }
.ud-table th { padding:10px 12px; text-align:left; font-size:11.5px; font-weight:600; color:var(--text-muted); background:var(--surface-hover); border-bottom:1px solid var(--border); white-space:nowrap; }
.ud-table td { padding:10px 12px; border-bottom:1px solid var(--border); color:var(--text-primary); vertical-align:middle; }
.ud-table tr:last-child td { border-bottom:none; }
.ud-table tr:hover td { background:rgba(37,99,235,.03); }
</style>
