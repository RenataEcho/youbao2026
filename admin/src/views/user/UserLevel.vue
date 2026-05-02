<template>
  <div class="ul-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">用户体系</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">用户等级</span>
    </div>

    <div class="page-content">
    <!-- 筛选区 -->
    <div class="glass-card filter-card">
      <div class="filter-grid">
        <div class="form-group-filter">
          <label class="form-label-sm">等级</label>
          <select v-model="filter.level" class="form-input-sm">
            <option value="">全部</option>
            <option v-for="l in 10" :key="l" :value="`LV${l}`">LV{{ l }}</option>
          </select>
        </div>
        <div class="form-group-filter">
          <label class="form-label-sm">状态</label>
          <select v-model="filter.status" class="form-input-sm">
            <option value="">全部</option>
            <option value="启用">启用</option>
            <option value="禁用">禁用</option>
          </select>
        </div>
        <div class="form-group-filter">
          <label class="form-label-sm">操作人</label>
          <input v-model="filter.op" class="form-input-sm" placeholder="请输入操作人" />
        </div>
        <div class="form-group-filter">
          <label class="form-label-sm">创建时间起</label>
          <input v-model="filter.timeStart" type="date" class="form-input-sm" />
        </div>
        <div class="form-group-filter">
          <label class="form-label-sm">创建时间止</label>
          <input v-model="filter.timeEnd" type="date" class="form-input-sm" />
        </div>
      </div>
      <div class="filter-footer">
        <span></span>
        <div class="filter-actions">
          <button class="btn btn-default btn-sm" @click="resetFilter">重置</button>
          <button class="btn btn-primary btn-sm" @click="doQuery">查询</button>
        </div>
      </div>
    </div>

    <!-- 数据表 -->
    <div class="glass-card table-card">
      <div class="table-header">
        <div class="table-title">用户等级列表<span class="table-count">共 {{ filtered.length }} 条</span></div>
        <div class="ul-hint">固定 10 个等级，不支持新增/删除</div>
      </div>
      <div class="ul-table-wrap">
        <table class="ul-table">
          <colgroup>
            <col style="min-width:64px;width:6%">
            <col style="min-width:56px;width:5%">
            <col style="min-width:90px;width:8%">
            <col style="min-width:220px;width:26%">
            <col style="min-width:80px;width:7%">
            <col style="min-width:180px;width:18%">
            <col style="min-width:80px;width:7%">
            <col style="min-width:80px;width:7%">
            <col style="min-width:100px;width:10%">
            <col style="min-width:56px;width:6%">
          </colgroup>
          <thead>
            <tr>
              <th>等级</th>
              <th>图标</th>
              <th>等级昵称</th>
              <th>等级条件</th>
              <th>需审核</th>
              <th>等级权益</th>
              <th>该等级人数</th>
              <th>状态</th>
              <th>操作人/创建时间</th>
              <th class="col-action" style="text-align:center">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in filtered" :key="row.lv" class="ul-row">
              <td>
                <span class="ul-lv-tag" :class="`ul-lv-${row.lvNum}`">{{ row.lv }}</span>
              </td>
              <td>
                <div class="ul-icon-box" :class="`ul-lv-icon-${row.lvNum}`">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" :stroke="LV_COLORS[row.lvNum-1]" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </div>
              </td>
              <td style="font-weight:600">{{ row.nick }}</td>
              <td>
                <span v-if="row.lvNum === 1" class="ul-tag-gray">默认等级</span>
                <div v-else class="ul-cond-list">
                  <div v-for="c in row.condTexts" :key="c" class="ul-cond-item">
                    <span class="ul-dot-blue"></span>{{ c }}
                  </div>
                </div>
              </td>
              <td>
                <span class="ul-badge" :class="row.audit === '是' ? 'ul-badge-amber' : 'ul-badge-green'">{{ row.audit }}</span>
              </td>
              <td>
                <div class="ul-benefit-list">
                  <span v-for="b in row.benefits" :key="b" class="ul-benefit-item">· {{ b }}</span>
                </div>
              </td>
              <td class="ul-num">{{ row.count.toLocaleString() }}</td>
              <td>
                <span class="ul-badge" :class="row.status === '启用' ? 'ul-badge-green' : 'ul-badge-gray'">{{ row.status }}</span>
              </td>
              <td>
                <div style="font-size:13px;font-weight:500">{{ row.op }}</div>
                <div class="ul-time">{{ row.time }}</div>
              </td>
              <td style="text-align:center">
                <button type="button" class="action-btn edit" title="编辑" @click="openEdit(row)">编辑</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </div>
    <!-- /page-content -->

    <!-- 编辑抽屉 -->
    <div class="ul-overlay" :class="{ show: drawerVisible }" @click="drawerVisible = false"></div>
    <div class="ul-drawer" :class="{ show: drawerVisible }" style="width: 520px">
      <div class="ul-drawer-header">
        <span class="ul-drawer-title">编辑用户等级 — {{ editRow?.lv }}</span>
        <button class="ul-icon-btn" @click="drawerVisible = false">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="ul-drawer-body" v-if="editRow">
        <div class="ul-form-group">
          <label class="ul-label">等级</label>
          <div class="ul-readonly">{{ editRow.lv }}</div>
        </div>
        <div class="ul-form-group">
          <label class="ul-label">等级图标 <span class="req">*</span></label>
          <div class="ul-upload-box" @click="showToast('图片上传功能演示', 'info')">＋ 上传图标<div class="ul-upload-hint">建议 64×64，JPG/PNG</div></div>
        </div>
        <div class="ul-form-group">
          <label class="ul-label">等级昵称 <span class="req">*</span></label>
          <input v-model="editForm.nick" class="ul-input" maxlength="20" placeholder="最多 20 字" />
        </div>
        <div class="ul-form-group">
          <label class="ul-label">等级条件 <span class="req">*</span></label>
          <div v-if="editRow.lvNum === 1" class="ul-readonly">默认等级（所有新注册用户自动获得）</div>
          <div v-else class="ul-cond-editor">
            <div class="ul-cond-editor-tip">多个条件同时满足方可升级（且关系）</div>
            <label class="ul-cond-row">
              <input type="checkbox" v-model="editForm.condIncome" style="accent-color:var(--primary)" />
              项目收益累计 ≥
              <input type="number" v-model.number="editForm.condIncomeVal" class="ul-cond-num" :disabled="!editForm.condIncome" min="0" placeholder="0" />
              元
            </label>
            <label class="ul-cond-row">
              <input type="checkbox" v-model="editForm.condInvite" style="accent-color:var(--primary)" />
              累计直邀 ≥
              <input type="number" v-model.number="editForm.condInviteVal" class="ul-cond-num" :disabled="!editForm.condInvite" min="0" placeholder="0" />
              人
            </label>
            <label class="ul-cond-row" style="flex-wrap:wrap;gap:6px">
              <input type="checkbox" v-model="editForm.condInviteLv" style="accent-color:var(--primary)" />
              直邀
              <input type="number" v-model.number="editForm.condInviteLvNum" class="ul-cond-num" :disabled="!editForm.condInviteLv" min="0" placeholder="0" />
              名
              <select v-model="editForm.condInviteLvTarget" class="ul-cond-sel" :disabled="!editForm.condInviteLv">
                <option v-for="n in 10" :key="n" :value="`LV${n}`">LV{{ n }}</option>
              </select>
              用户
            </label>
          </div>
        </div>
        <div class="ul-form-group">
          <label class="ul-label">升级是否需要审核 <span class="req">*</span></label>
          <div class="ul-radio-group">
            <label class="ul-radio"><input type="radio" v-model="editForm.audit" value="是" />是</label>
            <label class="ul-radio"><input type="radio" v-model="editForm.audit" value="否" />否</label>
          </div>
        </div>
        <div class="ul-form-group">
          <label class="ul-label">等级权益</label>
          <div v-for="(b, i) in editForm.benefits" :key="i" style="display:flex;gap:8px;margin-bottom:6px">
            <input :value="b" class="ul-input" style="flex:1" @input="(e) => editForm.benefits[i] = (e.target as HTMLInputElement).value" placeholder="权益描述" />
            <button class="btn btn-danger btn-sm" style="width:32px;padding:0;flex-shrink:0" @click="editForm.benefits.splice(i, 1)">×</button>
          </div>
          <button class="btn btn-default btn-sm" @click="editForm.benefits.push('')">+ 添加权益</button>
        </div>
        <div class="ul-form-group">
          <label class="ul-label">状态 <span class="req">*</span></label>
          <div class="ul-radio-group">
            <label class="ul-radio"><input type="radio" v-model="editForm.status" value="启用" />启用</label>
            <label class="ul-radio"><input type="radio" v-model="editForm.status" value="禁用" />禁用</label>
          </div>
        </div>
      </div>
      <div class="ul-drawer-footer">
        <button class="btn btn-default" @click="drawerVisible = false">取消</button>
        <button class="btn btn-primary" @click="doSave">保存</button>
      </div>
    </div>

    <!-- Toast -->
    <div class="ul-toast-container">
      <div v-for="t in toasts" :key="t.id" class="ul-toast" :class="t.type">
        <span style="flex:1;line-height:1.5">{{ t.msg }}</span>
        <button class="ul-toast-close" @click="removeToast(t.id)">✕</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface LevelRow {
  lv: string; lvNum: number; nick: string; audit: string; status: string
  count: number; op: string; time: string; benefits: string[]
  condIncome: boolean; condIncomeVal: number
  condInvite: boolean; condInviteVal: number
  condInviteLv: boolean; condInviteLvNum: number; condInviteLvTarget: string
  condTexts: string[]
}

const LV_COLORS = [
  '#94a3b8','#60a5fa','#3b82f6','#2563eb','#1d4ed8',
  '#1e40af','#1e3a8a','#312e81','#4c1d95','#7c3aed',
]

function makeCond(row: Partial<LevelRow>): string[] {
  const c: string[] = []
  if (row.condIncome && row.condIncomeVal) c.push(`项目收益累计 ≥ ${row.condIncomeVal.toLocaleString()} 元`)
  if (row.condInvite && row.condInviteVal) c.push(`累计直邀 ≥ ${row.condInviteVal} 人`)
  if (row.condInviteLv && row.condInviteLvNum) c.push(`直邀 ${row.condInviteLvNum} 名 ${row.condInviteLvTarget ?? 'LV1'} 用户`)
  return c
}

const levels = ref<LevelRow[]>([
  { lv:'LV1', lvNum:1, nick:'初学者', audit:'否', status:'启用', count:12486, op:'系统初始化', time:'2024-01-01', benefits:['基础内容浏览','参与普通任务'], condIncome:false, condIncomeVal:0, condInvite:false, condInviteVal:0, condInviteLv:false, condInviteLvNum:0, condInviteLvTarget:'LV1', condTexts:[] },
  { lv:'LV2', lvNum:2, nick:'进阶者', audit:'否', status:'启用', count:5832, op:'张管理', time:'2024-01-01', benefits:['解锁进阶任务','LV2专属优惠'], condIncome:true, condIncomeVal:500, condInvite:false, condInviteVal:0, condInviteLv:false, condInviteLvNum:0, condInviteLvTarget:'LV1', condTexts:['项目收益累计 ≥ 500 元'] },
  { lv:'LV3', lvNum:3, nick:'熟练者', audit:'否', status:'启用', count:3241, op:'张管理', time:'2024-01-01', benefits:['优先任务通知','专属客服通道'], condIncome:true, condIncomeVal:2000, condInvite:true, condInviteVal:5, condInviteLv:false, condInviteLvNum:0, condInviteLvTarget:'LV1', condTexts:['项目收益累计 ≥ 2,000 元','累计直邀 ≥ 5 人'] },
  { lv:'LV4', lvNum:4, nick:'专家', audit:'否', status:'启用', count:1856, op:'李运营', time:'2024-01-01', benefits:['高佣金任务权限','专属标签'], condIncome:true, condIncomeVal:5000, condInvite:false, condInviteVal:0, condInviteLv:true, condInviteLvNum:3, condInviteLvTarget:'LV2', condTexts:['项目收益累计 ≥ 5,000 元','直邀 3 名 LV2 用户'] },
  { lv:'LV5', lvNum:5, nick:'精英', audit:'是', status:'启用', count:892, op:'李运营', time:'2024-01-01', benefits:['精英任务资格','每月专属活动','独家合作资格'], condIncome:true, condIncomeVal:10000, condInvite:true, condInviteVal:10, condInviteLv:false, condInviteLvNum:0, condInviteLvTarget:'LV1', condTexts:['项目收益累计 ≥ 10,000 元','累计直邀 ≥ 10 人'] },
  { lv:'LV6', lvNum:6, nick:'大师', audit:'是', status:'启用', count:423, op:'王审核', time:'2024-01-01', benefits:['大师专属任务','品牌直接合作','VIP客服'], condIncome:true, condIncomeVal:20000, condInvite:false, condInviteVal:0, condInviteLv:true, condInviteLvNum:5, condInviteLvTarget:'LV3', condTexts:['项目收益累计 ≥ 20,000 元','直邀 5 名 LV3 用户'] },
  { lv:'LV7', lvNum:7, nick:'宗师', audit:'是', status:'启用', count:186, op:'王审核', time:'2024-01-01', benefits:['宗师专属频道','线下活动邀请'], condIncome:true, condIncomeVal:50000, condInvite:true, condInviteVal:30, condInviteLv:false, condInviteLvNum:0, condInviteLvTarget:'LV1', condTexts:['项目收益累计 ≥ 50,000 元','累计直邀 ≥ 30 人'] },
  { lv:'LV8', lvNum:8, nick:'传说', audit:'是', status:'启用', count:67, op:'陈审核', time:'2024-01-01', benefits:['传说专属任务','顶级品牌合作','年度峰会邀请'], condIncome:true, condIncomeVal:100000, condInvite:false, condInviteVal:0, condInviteLv:true, condInviteLvNum:10, condInviteLvTarget:'LV5', condTexts:['项目收益累计 ≥ 100,000 元','直邀 10 名 LV5 用户'] },
  { lv:'LV9', lvNum:9, nick:'神话', audit:'是', status:'启用', count:18, op:'陈审核', time:'2024-01-01', benefits:['神话专属权益包','平台共创权限'], condIncome:true, condIncomeVal:200000, condInvite:true, condInviteVal:80, condInviteLv:false, condInviteLvNum:0, condInviteLvTarget:'LV1', condTexts:['项目收益累计 ≥ 200,000 元','累计直邀 ≥ 80 人'] },
  { lv:'LV10', lvNum:10, nick:'无双', audit:'是', status:'启用', count:3, op:'系统管理员', time:'2024-01-01', benefits:['无双至尊礼遇','平台战略合作伙伴'], condIncome:true, condIncomeVal:500000, condInvite:true, condInviteVal:200, condInviteLv:true, condInviteLvNum:20, condInviteLvTarget:'LV8', condTexts:['项目收益累计 ≥ 500,000 元','累计直邀 ≥ 200 人','直邀 20 名 LV8 用户'] },
])

const filter = ref({ level: '', status: '', op: '', timeStart: '', timeEnd: '' })
const filtered = computed(() => levels.value.filter(r => {
  if (filter.value.level && r.lv !== filter.value.level) return false
  if (filter.value.status && r.status !== filter.value.status) return false
  if (filter.value.op && !r.op.includes(filter.value.op)) return false
  return true
}))

const drawerVisible = ref(false)
const editRow = ref<LevelRow | null>(null)
const editForm = ref({
  nick: '', audit: '否', status: '启用', benefits: [] as string[],
  condIncome: false, condIncomeVal: 0,
  condInvite: false, condInviteVal: 0,
  condInviteLv: false, condInviteLvNum: 0, condInviteLvTarget: 'LV1',
})

function openEdit(row: LevelRow) {
  editRow.value = row
  editForm.value = {
    nick: row.nick, audit: row.audit, status: row.status, benefits: [...row.benefits],
    condIncome: row.condIncome, condIncomeVal: row.condIncomeVal,
    condInvite: row.condInvite, condInviteVal: row.condInviteVal,
    condInviteLv: row.condInviteLv, condInviteLvNum: row.condInviteLvNum, condInviteLvTarget: row.condInviteLvTarget,
  }
  drawerVisible.value = true
}

function doSave() {
  if (!editRow.value) return
  const r = editRow.value
  r.nick = editForm.value.nick
  r.audit = editForm.value.audit
  r.status = editForm.value.status
  r.benefits = editForm.value.benefits.filter(b => b.trim())
  r.condIncome = editForm.value.condIncome; r.condIncomeVal = editForm.value.condIncomeVal
  r.condInvite = editForm.value.condInvite; r.condInviteVal = editForm.value.condInviteVal
  r.condInviteLv = editForm.value.condInviteLv; r.condInviteLvNum = editForm.value.condInviteLvNum; r.condInviteLvTarget = editForm.value.condInviteLvTarget
  r.condTexts = makeCond(editForm.value)
  drawerVisible.value = false
  showToast('保存成功', 'success')
}

function resetFilter() { filter.value = { level: '', status: '', op: '', timeStart: '', timeEnd: '' } }
function doQuery() { showToast(`查询完成，共 ${filtered.value.length} 条`, 'info') }

interface Toast { id: number; msg: string; type: string }
const toasts = ref<Toast[]>([]); let tid = 0
function showToast(msg: string, type = 'info') { const id = ++tid; toasts.value.push({ id, msg, type }); setTimeout(() => removeToast(id), 3000) }
function removeToast(id: number) { toasts.value = toasts.value.filter(t => t.id !== id) }
</script>

<style scoped>
.ul-wrap { min-height: 100%; }
.ul-hint { font-size: 12px; color: var(--text-muted); }
.ul-table-wrap { overflow-x: auto; }
.ul-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.ul-table th { padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 600; color: var(--text-muted); background: var(--surface-hover); border-bottom: 1px solid var(--border); white-space: nowrap; }
.ul-table td { padding: 12px 14px; border-bottom: 1px solid var(--border); color: var(--text-primary); vertical-align: top; }
.ul-row:hover td { background: var(--surface-hover); }
.ul-num { text-align: right; font-variant-numeric: tabular-nums; font-weight: 700; font-family: monospace; }
.ul-time { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
.ul-benefit-list { display: flex; flex-direction: column; gap: 2px; }
.ul-benefit-item { font-size: 12px; color: var(--text-secondary); }
.ul-cond-list { display: flex; flex-direction: column; gap: 4px; }
.ul-cond-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-secondary); }
.ul-dot-blue { width: 6px; height: 6px; border-radius: 50%; background: var(--primary); flex-shrink: 0; }
.ul-icon-box { width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; }
/* LV 色阶 Tag */
.ul-lv-tag { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; }
.ul-lv-1  { background: #f0f9ff; color: #94a3b8; border: 1px solid #e2e8f0; }
.ul-lv-2  { background: #eff6ff; color: #60a5fa; border: 1px solid #bfdbfe; }
.ul-lv-3  { background: #eff6ff; color: #3b82f6; border: 1px solid #93c5fd; }
.ul-lv-4  { background: #dbeafe; color: #2563eb; border: 1px solid #93c5fd; }
.ul-lv-5  { background: #dbeafe; color: #1d4ed8; border: 1px solid #60a5fa; }
.ul-lv-6  { background: #bfdbfe; color: #1e40af; border: 1px solid #3b82f6; }
.ul-lv-7  { background: #bfdbfe; color: #1e3a8a; border: 1px solid #2563eb; }
.ul-lv-8  { background: #e0e7ff; color: #312e81; border: 1px solid #6366f1; }
.ul-lv-9  { background: #ede9fe; color: #4c1d95; border: 1px solid #8b5cf6; }
.ul-lv-10 { background: #ddd6fe; color: #7c3aed; border: 1px solid #7c3aed; }
.ul-lv-icon-1  { background: #f8fafc; } .ul-lv-icon-2  { background: #eff6ff; }
.ul-lv-icon-3  { background: #dbeafe; } .ul-lv-icon-4  { background: #bfdbfe; }
.ul-lv-icon-5  { background: #bfdbfe; } .ul-lv-icon-6  { background: #a5b4fc22; }
.ul-lv-icon-7  { background: #818cf822; } .ul-lv-icon-8  { background: #e0e7ff; }
.ul-lv-icon-9  { background: #ede9fe; } .ul-lv-icon-10 { background: #ddd6fe; }
.ul-tag-gray { display: inline-flex; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 500; background: var(--surface-hover); color: var(--text-muted); border: 1px solid var(--border); }
/* Badge */
.ul-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
.ul-badge::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
.ul-badge-green { background: #f0fdf4; color: #16a34a; }
.ul-badge-amber { background: #fffbeb; color: #d97706; }
.ul-badge-gray  { background: #f1f5f9; color: #64748b; }
[data-theme="dark"] .ul-badge-green { background: rgba(22,163,74,0.15); }
[data-theme="dark"] .ul-badge-amber { background: rgba(217,119,6,0.15); }
[data-theme="dark"] .ul-badge-gray  { background: rgba(100,116,139,0.15); }
.ul-form-group { display: flex; flex-direction: column; gap: 6px; }
.ul-label { font-size: 13px; color: var(--text-secondary); font-weight: 500; }
.ul-label .req { color: var(--danger); }
.req { color: var(--danger); }
.ul-input { width: 100%; height: 36px; padding: 0 10px; font-size: 13px; font-family: inherit; color: var(--text-primary); background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); outline: none; transition: var(--transition); }
.ul-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(37,99,235,0.10); }
.ul-readonly { padding: 8px 10px; background: var(--surface-hover); border-radius: var(--radius-sm); font-size: 13px; color: var(--text-muted); border: 1px solid var(--border); }
.ul-upload-box { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 80px; height: 80px; border: 2px dashed var(--border); border-radius: 8px; cursor: pointer; font-size: 13px; color: var(--text-muted); transition: var(--transition); gap: 4px; }
.ul-upload-box:hover { border-color: var(--primary); color: var(--primary); }
.ul-upload-hint { font-size: 10px; }
.ul-radio-group { display: flex; gap: 16px; }
.ul-radio { display: flex; align-items: center; gap: 6px; font-size: 13px; cursor: pointer; }
.ul-cond-editor { border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 12px; background: var(--surface-hover); display: flex; flex-direction: column; gap: 10px; }
.ul-cond-editor-tip { font-size: 12px; color: var(--text-muted); }
.ul-cond-row { display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer; }
.ul-cond-num { width: 90px; height: 30px; padding: 0 8px; font-size: 13px; font-family: inherit; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--surface); color: var(--text-primary); outline: none; }
.ul-cond-num:disabled { background: var(--surface-hover); color: var(--text-muted); cursor: not-allowed; }
.ul-cond-sel { height: 30px; padding: 0 4px; font-size: 13px; font-family: inherit; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--surface); color: var(--text-primary); outline: none; }
.ul-cond-sel:disabled { background: var(--surface-hover); color: var(--text-muted); cursor: not-allowed; }
.ul-icon-btn { width: 28px; height: 28px; border-radius: 6px; background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-muted); transition: var(--transition); }
.ul-icon-btn:hover { background: var(--surface-hover); }
/* Toast */
.ul-toast-container { position: fixed; top: 66px; right: 22px; z-index: 9999; display: flex; flex-direction: column; gap: 8px; pointer-events: none; }
.ul-toast { min-width: 200px; max-width: 360px; padding: 12px 14px 12px 16px; background: var(--surface); border-radius: var(--radius); box-shadow: var(--shadow-lg); border-left: 3px solid; display: flex; align-items: flex-start; gap: 8px; font-size: 13px; pointer-events: all; animation: toastIn 0.28s ease; }
.ul-toast.success { border-left-color: var(--success); }
.ul-toast.info    { border-left-color: var(--primary); }
.ul-toast.warning { border-left-color: var(--warning); }
.ul-toast.error   { border-left-color: var(--danger); }
.ul-toast-close { background: none; border: none; cursor: pointer; color: var(--text-muted); font-size: 14px; }
@keyframes toastIn { from { opacity: 0; transform: translateX(80px); } to { opacity: 1; transform: translateX(0); } }
</style>
