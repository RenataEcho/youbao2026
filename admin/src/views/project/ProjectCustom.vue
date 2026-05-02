<template>
  <div class="pcu-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">品牌项目</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">项目定制</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">项目定制</h1>
          <p class="page-desc">特定用户差异化结算比例；定制单价 = 普通单价 × (1 + 比例%)</p>
        </div>
        <div class="pcu-head-actions">
          <button type="button" class="btn btn-default btn-sm" @click="openLogDrawer(null)">操作日志</button>
          <button type="button" class="btn btn-default btn-sm" @click="importVisible = true">批量导入</button>
          <button type="button" class="btn btn-primary btn-sm" @click="openAddUser">新增定制用户</button>
        </div>
      </div>

      <div class="glass-card bl-filter">
        <div class="ul-filter-grid">
          <div class="ul-form-group">
            <label class="ul-label">用户 ID</label>
            <input v-model="filters.userId" type="text" class="ul-input" placeholder="精确匹配">
          </div>
          <div class="ul-form-group">
            <label class="ul-label">当前身份</label>
            <select v-model="filters.userRole" class="ul-input ul-select">
              <option value="">全部</option>
              <option v-for="r in USER_ROLES" :key="r" :value="r">{{ r }}</option>
            </select>
          </div>
        </div>
        <div class="ul-filter-footer">
          <span />
          <div style="display:flex;gap:8px">
            <button type="button" class="btn btn-default btn-sm" @click="resetFilter">重置</button>
            <button type="button" class="btn btn-primary btn-sm" @click="applyFilter">查询</button>
          </div>
        </div>
      </div>

      <div class="glass-card table-card">
        <div class="table-header">
          <div class="table-title">
            定制用户列表
            <span class="table-count">共 {{ filteredUsers.length }} 条</span>
          </div>
        </div>
        <div class="ul-table-wrap">
          <table class="ul-table" style="min-width:1080px">
            <thead>
              <tr>
                <th>用户 ID</th>
                <th>用户昵称</th>
                <th>当前身份</th>
                <th>定制项目数</th>
                <th style="text-align:right">累计结算差额</th>
                <th>状态</th>
                <th>备注</th>
                <th>创建人</th>
                <th>创建时间</th>
                <th class="col-action" style="text-align:center;width:200px">操作</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="filteredUsers.length === 0">
                <tr>
                  <td colspan="10"><div class="ul-empty">暂无数据</div></td>
                </tr>
              </template>
              <tr v-for="row in filteredUsers" v-else :key="row.userId" class="ul-row">
                <td><span class="ul-mono">{{ row.userId }}</span></td>
                <td>{{ row.userNick }}</td>
                <td><span class="tag tag-gray">{{ row.userRole }}</span></td>
                <td>
                  <button type="button" class="pcu-link-num" @click="openProjects(row)">{{ row.customProjectCount }}</button>
                </td>
                <td style="text-align:right"><span class="ul-mono">¥{{ row.totalSettlementDiff.toFixed(2) }}</span></td>
                <td>
                  <span class="badge" :class="row.status === 'enable' ? 'badge-success' : 'badge-gray'">
                    {{ row.status === 'enable' ? '启用' : '禁用' }}
                  </span>
                </td>
                <td class="td-muted ellip" :title="row.remark">{{ row.remark || '—' }}</td>
                <td>{{ row.creator }}</td>
                <td class="td-muted" style="font-size:12px">{{ row.createdAt }}</td>
                <td class="col-action">
                  <div class="action-btns" style="justify-content: center">
                    <button type="button" class="action-btn edit" @click="openEditUser(row)">编辑</button>
                    <button type="button" class="action-btn view" @click="openAssign(row)">定制项目</button>
                    <button type="button" class="action-btn view" @click="openLogDrawer(row)">日志</button>
                    <button type="button" class="action-btn delete" @click="confirmDeleteUser(row)">删除</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 新增用户 -->
    <div class="ul-overlay" :class="{ show: addVisible }" @click="addVisible = false" />
    <div class="ul-modal pcu-modal pcu-modal--form" :class="{ show: addVisible }">
      <div class="ul-modal-header">
        <div class="ul-modal-title">新增定制用户</div>
        <button type="button" class="ul-icon-btn" @click="addVisible = false">×</button>
      </div>
      <div class="pcu-modal-body">
        <div class="ul-form-group">
          <label class="pcu-label-row"><span class="pcu-help" title="填写平台已存在的用户 ID" aria-hidden="true">?</span>用户 ID <span class="req">*</span></label>
          <input v-model="addForm.userId" type="text" class="ul-input" placeholder="纯数字">
        </div>
        <div class="ul-form-group">
          <label class="pcu-label-row"><span class="pcu-help" title="禁用后该用户全部项目走普通结算" aria-hidden="true">?</span>状态</label>
          <div class="pcu-seg">
            <button type="button" class="pcu-seg-item" :class="{ active: addForm.status === 'enable' }" @click="addForm.status = 'enable'">启用</button>
            <button type="button" class="pcu-seg-item" :class="{ active: addForm.status === 'disable' }" @click="addForm.status = 'disable'">禁用</button>
          </div>
        </div>
        <div class="ul-form-group">
          <label class="pcu-label-row"><span class="pcu-help" title="内部备注，不对用户展示" aria-hidden="true">?</span>备注</label>
          <textarea v-model="addForm.remark" class="ul-input pcu-textarea" rows="3" maxlength="100" placeholder="最多 100 字" />
        </div>
      </div>
      <div class="ul-modal-footer">
        <button type="button" class="btn btn-default" @click="addVisible = false">取消</button>
        <button type="button" class="btn btn-primary" @click="submitAdd">保存</button>
      </div>
    </div>

    <!-- 编辑用户 -->
    <div class="ul-overlay" :class="{ show: editVisible }" @click="editVisible = false" />
    <div class="ul-modal pcu-modal pcu-modal--form" :class="{ show: editVisible }">
      <div class="ul-modal-header">
        <div class="ul-modal-title">编辑定制用户</div>
        <button type="button" class="ul-icon-btn" @click="editVisible = false">×</button>
      </div>
      <div v-if="editForm" class="pcu-modal-body">
        <div class="ul-form-group">
          <label class="pcu-label-row"><span class="pcu-help" title="新增后不可修改" aria-hidden="true">?</span>用户 ID <span class="req">*</span></label>
          <input :value="editForm.userId" type="text" class="ul-input" disabled>
        </div>
        <div class="ul-form-group">
          <label class="pcu-label-row"><span class="pcu-help" title="禁用后该用户全部项目走普通结算" aria-hidden="true">?</span>状态</label>
          <div class="pcu-seg">
            <button type="button" class="pcu-seg-item" :class="{ active: editForm.status === 'enable' }" @click="editForm.status = 'enable'">启用</button>
            <button type="button" class="pcu-seg-item" :class="{ active: editForm.status === 'disable' }" @click="editForm.status = 'disable'">禁用</button>
          </div>
        </div>
        <div class="ul-form-group">
          <label class="pcu-label-row"><span class="pcu-help" title="内部备注" aria-hidden="true">?</span>备注</label>
          <textarea v-model="editForm.remark" class="ul-input pcu-textarea" rows="3" maxlength="100" placeholder="头部推文用户，定制优惠" />
        </div>
      </div>
      <div class="ul-modal-footer">
        <button type="button" class="btn btn-default" @click="editVisible = false">取消</button>
        <button type="button" class="btn btn-primary" @click="submitEdit">保存</button>
      </div>
    </div>

    <!-- 分配项目 -->
    <div class="ul-overlay" :class="{ show: assignVisible }" @click="assignVisible = false" />
    <div class="ul-modal pcu-modal-assign flex-col" :class="{ show: assignVisible }">
      <div class="ul-modal-header">
        <div>
          <div class="ul-modal-title">分配项目</div>
          <p v-if="assignCtx" class="pcu-modal-sub">用户：{{ assignCtx.userNick }}（ID: {{ assignCtx.userId }}）</p>
        </div>
        <button type="button" class="ul-icon-btn" @click="assignVisible = false">×</button>
      </div>
      <div v-if="assignCtx" class="ul-modal-body pcu-assign-body">
        <div class="ul-form-group">
          <label class="pcu-label-row"><span class="pcu-help" title="国内/国外品牌项目" aria-hidden="true">?</span>品牌类型 <span class="req">*</span></label>
          <div class="pcu-seg pcu-seg--grow">
            <button type="button" class="pcu-seg-item" :class="{ active: assignForm.brandType === '国内' }" @click="setAssignBrand('国内')">国内</button>
            <button type="button" class="pcu-seg-item" :class="{ active: assignForm.brandType === '国外' }" @click="setAssignBrand('国外')">国外</button>
          </div>
        </div>
        <div class="ul-form-group">
          <label class="pcu-label-row"><span class="pcu-help" title="数据来自类目配置-业务类型" aria-hidden="true">?</span>业务类型 <span class="req">*</span></label>
          <div class="pcu-seg pcu-seg--wrap">
            <button
              v-for="b in bizTypesFromCatalog"
              :key="b"
              type="button"
              class="pcu-seg-item"
              :class="{ active: assignForm.bizTypes.includes(b) }"
              @click="toggleAssignBiz(b)"
            >
              {{ b }}
            </button>
          </div>
        </div>
        <div class="ul-form-group">
          <label class="pcu-label-row"><span class="pcu-help" title="不选则对该业务下全部项目生效" aria-hidden="true">?</span>选择项目</label>
          <div class="pcu-pick-box">
            <input v-model="assignProjSearch" type="text" class="ul-input pcu-pick-search" placeholder="搜索项目名称…">
            <div class="pcu-pick-inner">
              <template v-if="filteredAssignProjectsForUi.length === 0">
                <p class="pcu-pick-empty">当前品牌与业务组合下无可用项目（Mock）</p>
              </template>
              <template v-else>
                <label v-for="p in filteredAssignProjectsForUi" :key="p.id" class="pcu-pick-row">
                  <input v-model="assignForm.selectedProjectIds" type="checkbox" :value="p.id">
                  <span class="pcu-pick-name">{{ p.name }}</span>
                  <span class="pcu-pick-tag">{{ p.bizType }}</span>
                </label>
              </template>
              <p class="pcu-pick-hint-inner">未选择项目，将对该业务类型全部项目生效</p>
            </div>
          </div>
          <p class="pcu-pick-help">若不选择项目，则该业务类型下的所有项目均走定制结算</p>
        </div>
        <div class="ul-form-group">
          <label class="pcu-label-row"><span class="pcu-help" title="相对普通单价的加成百分比" aria-hidden="true">?</span>结算比例 <span class="req">*</span></label>
          <div class="pcu-suffix-inp">
            <input v-model.number="assignForm.ratio" type="number" min="0.01" step="0.1" class="ul-input" placeholder="如：20">
            <span class="pcu-suffix">%</span>
          </div>
        </div>
        <div class="ul-form-group">
          <label class="pcu-label-row"><span class="pcu-help" title="项目级启用/禁用" aria-hidden="true">?</span>状态</label>
          <div class="pcu-seg">
            <button type="button" class="pcu-seg-item" :class="{ active: assignForm.status === 'enable' }" @click="assignForm.status = 'enable'">启用</button>
            <button type="button" class="pcu-seg-item" :class="{ active: assignForm.status === 'disable' }" @click="assignForm.status = 'disable'">禁用</button>
          </div>
        </div>
      </div>
      <div class="ul-modal-footer">
        <button type="button" class="btn btn-default" @click="assignVisible = false">取消</button>
        <button type="button" class="btn btn-primary" @click="submitAssign">保存分配</button>
      </div>
    </div>

    <!-- 编辑明细行 -->
    <div class="ul-overlay" :class="{ show: lineEditVisible }" @click="lineEditVisible = false" />
    <div class="ul-modal pcu-modal" :class="{ show: lineEditVisible }">
      <div class="ul-modal-header">
        <div class="ul-modal-title">编辑项目结算规则</div>
        <button type="button" class="ul-icon-btn" @click="lineEditVisible = false">×</button>
      </div>
      <div v-if="lineEditForm" class="pcu-modal-body">
        <p class="td-muted" style="margin-bottom:10px">
          {{ lineEditForm.projectName }}（ID {{ lineEditForm.projectId }}）
        </p>
        <div class="ul-form-group">
          <label class="ul-label">结算比例（%）<span class="req">*</span></label>
          <input v-model.number="lineEditDraft.ratio" type="number" min="0.01" step="0.1" class="ul-input">
        </div>
        <div class="ul-form-group">
          <label class="ul-label">状态</label>
          <select v-model="lineEditDraft.status" class="ul-input ul-select">
            <option value="enable">启用</option>
            <option value="disable">禁用</option>
          </select>
        </div>
      </div>
      <div class="ul-modal-footer">
        <button type="button" class="btn btn-default" @click="lineEditVisible = false">取消</button>
        <button type="button" class="btn btn-primary" @click="submitLineEdit">保存</button>
      </div>
    </div>

    <!-- 导入 -->
    <div class="ul-overlay" :class="{ show: importVisible }" @click="importVisible = false" />
    <div class="ul-modal pcu-modal" :class="{ show: importVisible }">
      <div class="ul-modal-header">
        <div class="ul-modal-title">Excel 批量导入</div>
        <button type="button" class="ul-icon-btn" @click="importVisible = false">×</button>
      </div>
      <div class="pcu-modal-body">
        <p class="td-muted" style="font-size:12px;margin-bottom:10px">必填列：用户 ID、项目 ID、结算比例；导入默认启用。以下为 Mock 模拟校验与统计。</p>
        <div class="bc-upload-area" @click="triggerImport">
          <span v-if="importFile">{{ importFile.name }}</span>
          <span v-else class="td-muted">选择 .xlsx / .xls</span>
          <input ref="importRef" type="file" accept=".xlsx,.xls" class="vis-hid" @change="onImportFile">
        </div>
      </div>
      <div class="ul-modal-footer">
        <button type="button" class="btn btn-default" @click="importVisible = false">取消</button>
        <button type="button" class="btn btn-primary" :disabled="!importFile" @click="runImport">开始导入</button>
      </div>
    </div>

    <!-- 导入结果 -->
    <div class="ul-overlay" :class="{ show: importResultVisible }" @click="importResultVisible = false" />
    <div class="ul-modal pcu-modal" :class="{ show: importResultVisible }">
      <div class="ul-modal-header">
        <div class="ul-modal-title">导入结果</div>
        <button type="button" class="ul-icon-btn" @click="importResultVisible = false">×</button>
      </div>
      <div class="pcu-modal-body">
        <p>成功 <strong style="color:var(--success)">{{ lastImportResult.ok }}</strong> 条，
          失败 <strong style="color:var(--warning)">{{ lastImportResult.fail }}</strong> 条（Mock）。</p>
        <p v-if="lastImportResult.fail > 0" class="td-muted" style="font-size:12px;margin-top:8px">
          可下载失败行 Excel（CSV）核对。
        </p>
      </div>
      <div class="ul-modal-footer">
        <button v-if="lastImportResult.failRows.length" type="button" class="btn btn-default" @click="downloadImportFailures">
          下载失败行
        </button>
        <button type="button" class="btn btn-primary" @click="importResultVisible = false">知道了</button>
      </div>
    </div>

    <!-- 删除确认 -->
    <div class="ul-overlay" :class="{ show: delVisible }" @click="delVisible = false" />
    <div class="ul-modal pcu-modal-sm" :class="{ show: delVisible }">
      <div class="ul-modal-header">
        <div class="ul-modal-title" style="color:var(--danger)">确认删除</div>
        <button type="button" class="ul-icon-btn" @click="delVisible = false">×</button>
      </div>
      <div style="padding:16px 20px;font-size:13px;color:var(--text-secondary)">
        将删除该用户及全部定制规则，不可撤销。
      </div>
      <div class="ul-modal-footer">
        <button type="button" class="btn btn-default" @click="delVisible = false">取消</button>
        <button type="button" class="btn btn-danger" @click="doDeleteUser">删除</button>
      </div>
    </div>

    <!-- 操作日志（抽屉） -->
    <div class="ul-overlay pcu-overlay--high" :class="{ show: logVisible }" @click="logVisible = false" />
    <aside class="ul-drawer pcu-log-drawer" :class="{ show: logVisible }" @click.stop>
      <div class="ul-drawer-header">
        <div class="pcu-log-drawer-titles">
          <div class="ul-drawer-title">操作日志</div>
          <p v-if="logDrawerUser" class="pcu-log-user-line">用户：{{ logDrawerUser.userNick }}（ID: {{ logDrawerUser.userId }}）</p>
          <p v-else class="pcu-log-user-line pcu-log-user-line--muted">全部定制用户的操作记录（Mock）</p>
        </div>
        <button type="button" class="ul-icon-btn" aria-label="关闭" @click="logVisible = false">×</button>
      </div>
      <div class="ul-drawer-body">
        <div class="ul-table-wrap pcu-log-table-wrap">
          <table class="ul-table pcu-log-table">
            <thead>
              <tr>
                <th>操作时间</th>
                <th>操作人</th>
                <th>操作类型</th>
                <th>操作详情</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(lg, i) in displayLogs" :key="i">
                <td class="td-muted">{{ lg.time }}</td>
                <td>{{ lg.operator }}</td>
                <td><span class="pcu-op-tag">{{ logTagLabel(lg.actionType) }}</span></td>
                <td>{{ lg.detail || '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="ul-drawer-footer">
        <button type="button" class="btn btn-default" @click="logVisible = false">关闭</button>
      </div>
    </aside>

    <!-- 定制项目抽屉（全局 ul-drawer） -->
    <div class="ul-overlay" :class="{ show: drawerVisible }" @click="drawerVisible = false" />
    <aside class="ul-drawer" :class="{ show: drawerVisible }" @click.stop>
      <div class="ul-drawer-header">
        <div class="ul-drawer-title">定制项目明细</div>
        <button type="button" class="ul-icon-btn" aria-label="关闭" @click="drawerVisible = false">×</button>
      </div>
      <div v-if="drawerUser" class="ul-drawer-body">
        <p class="td-muted">用户 <span class="ul-mono">{{ drawerUser.userId }}</span></p>
        <div class="pcu-sub-filter">
          <select v-model="drawerBrand" class="ul-input ul-select">
            <option value="">品牌（全部）</option>
            <option value="国内">国内</option>
            <option value="国外">国外</option>
          </select>
          <select v-model="drawerBiz" class="ul-input ul-select">
            <option value="">业务类型（全部）</option>
            <option v-for="b in bizTypesFromCatalog" :key="b" :value="b">{{ b }}</option>
          </select>
          <input v-model="drawerProjName" type="text" class="ul-input" placeholder="项目名称（模糊）">
        </div>
        <div class="ul-table-wrap">
          <table class="ul-table" style="font-size:12.5px">
            <thead>
              <tr>
                <th>项目</th>
                <th>品牌</th>
                <th>业务</th>
                <th style="text-align:right">比例%</th>
                <th style="text-align:right">
                  <button type="button" class="pcu-sort-th" @click="toggleDrawerSort">
                    累计差额
                    <span class="pcu-sort-ind">{{ drawerSortLabel }}</span>
                  </button>
                </th>
                <th>状态</th>
                <th class="td-muted">创建时间</th>
                <th class="col-action" style="text-align:center">操作</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="sortedDrawerLines.length === 0">
                <tr><td colspan="8"><div class="ul-empty">暂无明细</div></td></tr>
              </template>
              <tr v-for="line in sortedDrawerLines" v-else :key="line.projectId">
                <td>{{ line.projectName }}</td>
                <td>{{ line.brandType }}</td>
                <td>{{ line.bizType }}</td>
                <td style="text-align:right">{{ line.ratio }}</td>
                <td style="text-align:right" class="ul-mono">¥{{ line.totalDiff.toFixed(2) }}</td>
                <td>{{ line.status === 'enable' ? '启用' : '禁用' }}</td>
                <td class="td-muted" style="font-size:11px">{{ line.createdAt }}</td>
                <td style="text-align:center">
                  <button type="button" class="action-btn edit" @click="openLineEdit(line)">编辑</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </aside>

    <div class="ul-toast-container">
      <div v-for="t in toasts" :key="t.id" class="ul-toast success">{{ t.msg }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { BIZ_TYPE_MOCK_SEED } from '@/data/projectCategoryCatalog'

const USER_ROLES = ['普通会员', '高级会员', '核心高级会员', '核心导师', '商学院导师', '合伙人', '机构']

/** 类目配置-业务类型（与 BizType 页同源，仅展示上架） */
const bizTypesFromCatalog = computed(() =>
  BIZ_TYPE_MOCK_SEED.filter((r) => r.status === 'show').map((r) => r.bizName),
)

/** Mock：平台存在的用户（新增定制用户时校验） */
const MOCK_PLATFORM_USERS: Record<string, { nick: string; role: string }> = {
  '10086001': { nick: '达人小明', role: '高级会员' },
  '10086002': { nick: '测试用户', role: '普通会员' },
  '20001001': { nick: 'Mock 达人', role: '合伙人' },
}

/** Mock：可分配项目池（bizType 须与类目配置-业务类型名称一致） */
const MOCK_PROJECT_POOL: { id: number; name: string; brandType: string; bizType: string }[] = [
  { id: 1, name: '剪映海外推广 Q2', brandType: '国内', bizType: '推文' },
  { id: 2, name: '番茄小说达人招募', brandType: '国内', bizType: '短剧' },
  { id: 3, name: '网盘拉新计划', brandType: '国外', bizType: '网盘' },
  { id: 4, name: '海外工具联运', brandType: '国外', bizType: '工具' },
  { id: 5, name: '国内工具联运 B', brandType: '国内', bizType: '工具' },
  { id: 6, name: '短剧激励计划', brandType: '国内', bizType: '短剧' },
]

interface CustomUser {
  userId: string
  userNick: string
  userRole: string
  customProjectCount: number
  totalSettlementDiff: number
  status: 'enable' | 'disable'
  remark: string
  creator: string
  createdAt: string
}

interface ProjLine {
  projectId: number
  projectName: string
  brandType: string
  bizType: string
  ratio: number
  status: 'enable' | 'disable'
  totalDiff: number
  createdAt: string
}

interface OpLog {
  time: string
  operator: string
  actionType: string
  detail: string
  /** 有值时，在「单用户」日志抽屉中展示 */
  relatedUserId?: string
}

const OP_USER = '当前账号'

function nowStr() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ')
}

function logTagLabel(actionType: string) {
  const map: Record<string, string> = {
    新增定制用户: '新增定制用户',
    分配定制项目: '分配项目',
    修改状态: '修改状态',
    修改备注: '修改备注',
    编辑项目结算规则: '编辑项目',
    删除定制用户: '删除用户',
    'Excel 导入': '导入',
    编辑定制用户: '编辑用户',
  }
  return map[actionType] ?? actionType
}

function pushLog(actionType: string, detail: string, relatedUserId?: string) {
  operationLogs.value.unshift({
    time: nowStr(),
    operator: OP_USER,
    actionType,
    detail,
    relatedUserId,
  })
}

const users = ref<CustomUser[]>([
  { userId: '10086001', userNick: '达人小明', userRole: '高级会员', customProjectCount: 2, totalSettlementDiff: 320.5, status: 'enable', remark: '重点扶持', creator: '管理员', createdAt: '2026-04-01 10:00:00' },
  { userId: '10086002', userNick: '测试用户', userRole: '普通会员', customProjectCount: 1, totalSettlementDiff: 0, status: 'disable', remark: '', creator: '管理员', createdAt: '2026-04-15 14:22:00' },
])

const projectsByUser = ref<Record<string, ProjLine[]>>({
  '10086001': [
    { projectId: 1, projectName: '剪映海外推广 Q2', brandType: '国内', bizType: '推文', ratio: 20, status: 'enable', totalDiff: 200, createdAt: '2026-04-01 10:05:00' },
    { projectId: 2, projectName: '番茄小说达人招募', brandType: '国内', bizType: '短剧', ratio: 15, status: 'enable', totalDiff: 120.5, createdAt: '2026-04-02 11:00:00' },
  ],
  '10086002': [{ projectId: 3, projectName: '网盘拉新计划', brandType: '国外', bizType: '网盘', ratio: 10, status: 'disable', totalDiff: 0, createdAt: '2026-04-10 09:00:00' }],
})

const operationLogs = ref<OpLog[]>([
  { time: '2026-04-20 14:30:00', operator: '管理员A', actionType: '分配定制项目', detail: '番茄小说 结算比例 +20%', relatedUserId: '10086001' },
  { time: '2026-04-20 15:10:00', operator: '管理员B', actionType: '修改状态', detail: '启用 -> 禁用', relatedUserId: '10086001' },
  { time: '2026-04-21 09:00:00', operator: '管理员A', actionType: '分配定制项目', detail: '知乎故事 结算比例 +15%', relatedUserId: '10086001' },
  { time: '2026-04-18 11:20:00', operator: '管理员A', actionType: '修改备注', detail: '备注内容已更新', relatedUserId: '10086001' },
  { time: '2026-04-15 14:22:10', operator: '管理员', actionType: '编辑定制用户', detail: '用户 10086002 状态与备注', relatedUserId: '10086002' },
])

const filters = ref({ userId: '', userRole: '' })

const filteredUsers = computed(() => {
  let list = [...users.value]
  if (filters.value.userId.trim()) list = list.filter((u) => u.userId === filters.value.userId.trim())
  if (filters.value.userRole) list = list.filter((u) => u.userRole === filters.value.userRole)
  return list
})

function applyFilter() { /* computed */ }
function resetFilter() {
  filters.value = { userId: '', userRole: '' }
}

const addVisible = ref(false)
const addForm = ref({ userId: '', status: 'enable' as 'enable' | 'disable', remark: '' })
function openAddUser() {
  addForm.value = { userId: '', status: 'enable', remark: '' }
  addVisible.value = true
}
function submitAdd() {
  const id = addForm.value.userId.trim()
  if (!/^\d+$/.test(id)) {
    toast('请输入有效用户 ID（纯数字）')
    return
  }
  if (!MOCK_PLATFORM_USERS[id]) {
    toast('用户不存在，请核对用户 ID（Mock：仅 10086001、10086002、20001001 等）')
    return
  }
  if (users.value.some((u) => u.userId === id)) {
    toast('该用户已在定制列表中')
    return
  }
  const pu = MOCK_PLATFORM_USERS[id]
  users.value.unshift({
    userId: id,
    userNick: pu.nick,
    userRole: pu.role,
    customProjectCount: 0,
    totalSettlementDiff: 0,
    status: addForm.value.status,
    remark: addForm.value.remark,
    creator: OP_USER,
    createdAt: nowStr(),
  })
  projectsByUser.value[id] = []
  addVisible.value = false
  pushLog(
    '新增定制用户',
    `用户 ${id}，状态 ${addForm.value.status}${addForm.value.remark ? `，备注 ${addForm.value.remark}` : ''}`,
    id,
  )
  toast('新增成功')
}

const editVisible = ref(false)
const editForm = ref<CustomUser | null>(null)
function openEditUser(row: CustomUser) {
  editForm.value = { ...row }
  editVisible.value = true
}
function submitEdit() {
  if (!editForm.value) return
  const idx = users.value.findIndex((u) => u.userId === editForm.value!.userId)
  if (idx >= 0) {
    const prev = users.value[idx]
    users.value[idx] = { ...editForm.value }
    const uid = editForm.value.userId
    if (prev.status !== editForm.value.status) {
      pushLog(
        '修改状态',
        `${prev.status === 'enable' ? '启用' : '禁用'} -> ${editForm.value.status === 'enable' ? '启用' : '禁用'}`,
        uid,
      )
    }
    if (prev.remark !== editForm.value.remark) {
      pushLog('修改备注', '备注内容已更新', uid)
    }
  }
  editVisible.value = false
  toast('已保存')
}

const assignVisible = ref(false)
const assignCtx = ref<CustomUser | null>(null)
const assignProjSearch = ref('')
const assignForm = ref({
  brandType: '国内' as string,
  bizTypes: [] as string[],
  selectedProjectIds: [] as number[],
  ratio: 15,
  status: 'enable' as 'enable' | 'disable',
})

const filteredAssignProjects = computed(() => {
  return MOCK_PROJECT_POOL.filter(
    (p) => p.brandType === assignForm.value.brandType && assignForm.value.bizTypes.includes(p.bizType),
  )
})

const filteredAssignProjectsForUi = computed(() => {
  const pool = filteredAssignProjects.value
  const q = assignProjSearch.value.trim()
  if (!q) return pool
  return pool.filter((p) => p.name.includes(q))
})

async function setAssignBrand(b: '国内' | '国外') {
  assignForm.value.brandType = b
  await nextTick()
  const allowed = new Set(filteredAssignProjects.value.map((p) => p.id))
  assignForm.value.selectedProjectIds = assignForm.value.selectedProjectIds.filter((id) => allowed.has(id))
}

async function toggleAssignBiz(b: string) {
  const arr = assignForm.value.bizTypes
  const i = arr.indexOf(b)
  if (i >= 0) arr.splice(i, 1)
  else arr.push(b)
  await nextTick()
  const allowed = new Set(filteredAssignProjects.value.map((p) => p.id))
  assignForm.value.selectedProjectIds = assignForm.value.selectedProjectIds.filter((id) => allowed.has(id))
}

function openAssign(row: CustomUser) {
  assignCtx.value = row
  const first = bizTypesFromCatalog.value[0]
  assignForm.value = {
    brandType: '国内',
    bizTypes: first ? [first] : [],
    selectedProjectIds: [],
    ratio: 15,
    status: 'enable',
  }
  assignProjSearch.value = ''
  assignVisible.value = true
}

function submitAssign() {
  if (!assignCtx.value) return
  if (!assignForm.value.bizTypes.length) {
    toast('请至少选择一种业务类型')
    return
  }
  const r = assignForm.value.ratio
  if (typeof r !== 'number' || Number.isNaN(r) || r <= 0) {
    toast('结算比例须为正数')
    return
  }
  const pool = filteredAssignProjects.value
  if (pool.length === 0) {
    toast('当前筛选下没有可选项目')
    return
  }
  const uid = assignCtx.value.userId
  const list = projectsByUser.value[uid] ?? []
  const picked =
    assignForm.value.selectedProjectIds.length > 0
      ? pool.filter((p) => assignForm.value.selectedProjectIds.includes(p.id))
      : [...pool]

  let added = 0
  const skipped: number[] = []
  for (const p of picked) {
    if (list.some((l) => l.projectId === p.id)) {
      skipped.push(p.id)
      continue
    }
    list.push({
      projectId: p.id,
      projectName: p.name,
      brandType: p.brandType,
      bizType: p.bizType,
      ratio: assignForm.value.ratio,
      status: assignForm.value.status,
      totalDiff: 0,
      createdAt: nowStr(),
    })
    added++
  }
  projectsByUser.value[uid] = list
  const u = users.value.find((x) => x.userId === uid)
  if (u) {
    u.customProjectCount = list.length
    u.totalSettlementDiff = list.reduce((s, x) => s + x.totalDiff, 0)
  }
  assignVisible.value = false
  const skipHint = skipped.length ? `，已跳过已分配 ${skipped.length} 项` : ''
  pushLog(
    '分配定制项目',
    `用户 ${uid}：品牌 ${assignForm.value.brandType}，业务 ${assignForm.value.bizTypes.join('、')}，新增 ${added} 条，比例 ${assignForm.value.ratio}%${skipHint}`,
    uid,
  )
  toast(added ? `已分配 ${added} 个项目${skipHint}` : `未新增项目（均已在列表中）${skipHint}`)
}

const lineEditVisible = ref(false)
const lineEditForm = ref<ProjLine | null>(null)
const lineEditDraft = ref({ ratio: 15, status: 'enable' as 'enable' | 'disable' })
const lineEditUserId = ref('')

function openLineEdit(line: ProjLine) {
  lineEditForm.value = { ...line }
  lineEditDraft.value = { ratio: line.ratio, status: line.status }
  lineEditUserId.value = drawerUser.value?.userId ?? ''
  lineEditVisible.value = true
}

function submitLineEdit() {
  if (!lineEditForm.value || !lineEditUserId.value) return
  const r = lineEditDraft.value.ratio
  if (typeof r !== 'number' || Number.isNaN(r) || r <= 0) {
    toast('结算比例须为正数')
    return
  }
  const pid = lineEditForm.value.projectId
  const lines = projectsByUser.value[lineEditUserId.value] ?? []
  const idx = lines.findIndex((l) => l.projectId === pid)
  if (idx < 0) return
  const prev = lines[idx]
  const next = {
    ...prev,
    ratio: lineEditDraft.value.ratio,
    status: lineEditDraft.value.status,
  }
  lines[idx] = next
  projectsByUser.value[lineEditUserId.value] = [...lines]
  pushLog(
    '编辑项目结算规则',
    `用户 ${lineEditUserId.value} 项目 ${pid}：比例 ${prev.ratio}% → ${next.ratio}%，状态 ${prev.status} → ${next.status}`,
    lineEditUserId.value,
  )
  lineEditVisible.value = false
  toast('已保存')
}

const importVisible = ref(false)
const importRef = ref<HTMLInputElement | null>(null)
const importFile = ref<File | null>(null)
const importResultVisible = ref(false)
const lastImportResult = ref({ ok: 0, fail: 0, failRows: [] as { userId: string; projectId: string; ratio: string; reason: string }[] })

function triggerImport() {
  importRef.value?.click()
}
function onImportFile(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  importFile.value = f ?? null
}

type MockImportLine =
  | { kind: 'ok'; userId: string; projectId: number; ratio: number }
  | { kind: 'fail'; userId: string; projectId: string; ratio: string; reason: string }

/** Mock：不解析真实 Excel，按固定规则模拟成功/失败行 */
function runImport() {
  if (!importFile.value) return
  const lines: MockImportLine[] = [
    { kind: 'ok', userId: '10086001', projectId: 5, ratio: 18 },
    { kind: 'fail', userId: '99999999', projectId: '1', ratio: '12', reason: '用户 ID 不存在' },
    { kind: 'fail', userId: '10086001', projectId: '9999', ratio: '12', reason: '项目 ID 不存在' },
    { kind: 'ok', userId: '20001001', projectId: 4, ratio: 8.5 },
    { kind: 'fail', userId: '20001001', projectId: '4', ratio: '8.5', reason: '该项目已分配' },
  ]
  let ok = 0
  const failRows: { userId: string; projectId: string; ratio: string; reason: string }[] = []
  for (const row of lines) {
    if (row.kind === 'fail') {
      failRows.push({ userId: row.userId, projectId: row.projectId, ratio: row.ratio, reason: row.reason })
      continue
    }
    const uid = row.userId
    const pid = row.projectId
    if (!MOCK_PLATFORM_USERS[uid]) {
      failRows.push({ userId: uid, projectId: String(pid), ratio: String(row.ratio), reason: '用户 ID 不存在' })
      continue
    }
    const meta = MOCK_PROJECT_POOL.find((p) => p.id === pid)
    if (!meta) {
      failRows.push({ userId: uid, projectId: String(pid), ratio: String(row.ratio), reason: '项目 ID 不存在' })
      continue
    }
    if (!users.value.some((u) => u.userId === uid)) {
      const pu = MOCK_PLATFORM_USERS[uid]
      users.value.unshift({
        userId: uid,
        userNick: pu.nick,
        userRole: pu.role,
        customProjectCount: 0,
        totalSettlementDiff: 0,
        status: 'enable',
        remark: '',
        creator: OP_USER,
        createdAt: nowStr(),
      })
    }
    let list = projectsByUser.value[uid] ?? []
    if (list.some((l) => l.projectId === pid)) {
      failRows.push({ userId: uid, projectId: String(pid), ratio: String(row.ratio), reason: '该项目已分配' })
      continue
    }
    list = [
      ...list,
      {
        projectId: pid,
        projectName: meta.name,
        brandType: meta.brandType,
        bizType: meta.bizType,
        ratio: row.ratio,
        status: 'enable' as const,
        totalDiff: 0,
        createdAt: nowStr(),
      },
    ]
    projectsByUser.value[uid] = list
    const usr = users.value.find((u) => u.userId === uid)
    if (usr) {
      usr.customProjectCount = list.length
      usr.totalSettlementDiff = list.reduce((s, x) => s + x.totalDiff, 0)
    }
    ok++
  }
  lastImportResult.value = { ok, fail: failRows.length, failRows }
  importVisible.value = false
  importFile.value = null
  importResultVisible.value = true
  pushLog('Excel 导入', `Mock：成功 ${ok}，失败 ${failRows.length}`)
  const ir = importRef.value
  if (ir) ir.value = ''
}

function downloadImportFailures() {
  const rows = lastImportResult.value.failRows
  const header = '\uFEFF用户 ID,项目 ID,结算比例,失败原因\n'
  const body = rows.map((r) => `${r.userId},${r.projectId},${r.ratio},${r.reason}`).join('\n')
  const blob = new Blob([header + body], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `项目定制导入失败_${nowStr().replace(/[: ]/g, '')}.csv`
  a.click()
  URL.revokeObjectURL(a.href)
}

const delVisible = ref(false)
const delTarget = ref<CustomUser | null>(null)
function confirmDeleteUser(row: CustomUser) {
  delTarget.value = row
  delVisible.value = true
}
function doDeleteUser() {
  if (!delTarget.value) return
  const id = delTarget.value.userId
  users.value = users.value.filter((u) => u.userId !== id)
  delete projectsByUser.value[id]
  delVisible.value = false
  pushLog('删除定制用户', `用户 ${id} 及全部定制规则已删除`, id)
  toast('已删除')
}

const drawerVisible = ref(false)
const drawerUser = ref<CustomUser | null>(null)
const drawerBrand = ref('')
const drawerBiz = ref('')
const drawerProjName = ref('')
const drawerSort = ref<'none' | 'asc' | 'desc'>('none')

const drawerSortLabel = computed(() => {
  if (drawerSort.value === 'asc') return '↑'
  if (drawerSort.value === 'desc') return '↓'
  return '⇅'
})

function toggleDrawerSort() {
  drawerSort.value = drawerSort.value === 'none' ? 'desc' : drawerSort.value === 'desc' ? 'asc' : 'none'
}

const drawerLines = computed(() => {
  if (!drawerUser.value) return []
  let lines = projectsByUser.value[drawerUser.value.userId] ?? []
  if (drawerBrand.value) lines = lines.filter((l) => l.brandType === drawerBrand.value)
  if (drawerBiz.value) lines = lines.filter((l) => l.bizType === drawerBiz.value)
  if (drawerProjName.value.trim()) lines = lines.filter((l) => l.projectName.includes(drawerProjName.value.trim()))
  return lines
})

const sortedDrawerLines = computed(() => {
  const list = [...drawerLines.value]
  if (drawerSort.value === 'asc') list.sort((a, b) => a.totalDiff - b.totalDiff)
  else if (drawerSort.value === 'desc') list.sort((a, b) => b.totalDiff - a.totalDiff)
  return list
})

function openProjects(row: CustomUser) {
  drawerUser.value = row
  drawerBrand.value = ''
  drawerBiz.value = ''
  drawerProjName.value = ''
  drawerSort.value = 'none'
  drawerVisible.value = true
}

const logVisible = ref(false)
const logDrawerUser = ref<CustomUser | null>(null)

function openLogDrawer(user: CustomUser | null) {
  logDrawerUser.value = user
  logVisible.value = true
}

const displayLogs = computed(() => {
  if (!logDrawerUser.value) return operationLogs.value
  const uid = logDrawerUser.value.userId
  return operationLogs.value.filter((l) => l.relatedUserId === uid)
})

const toasts = ref<{ id: number; msg: string }[]>([])
let tid = 0
function toast(msg: string) {
  const id = ++tid
  toasts.value.push({ id, msg })
  setTimeout(() => { toasts.value = toasts.value.filter((t) => t.id !== id) }, 2400)
}
</script>

<style scoped>
.pcu-wrap { min-height: 100%; }
.pcu-head-actions { display: flex; gap: 8px; flex-wrap: wrap; }
.table-card { padding: 16px 18px; }

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;
}
.table-title { font-size: 15px; font-weight: 600; color: var(--text-primary); }

.pcu-link-num {
  background: none; border: none; color: var(--primary); font-weight: 600;
  cursor: pointer; text-decoration: underline; font-size: 13px;
}
.ellip { max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.req { color: var(--danger); }

.badge { display: inline-flex; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; }
.badge-success { background: var(--success-bg); color: var(--success); }
.badge-gray { background: var(--border); color: var(--text-muted); }

/* 弹窗：沿用全局 .ul-modal，仅补尺寸与正文区 */
.pcu-modal-body { padding: 16px 20px 8px; max-height: 60vh; overflow: auto; }
.pcu-modal-body--scroll { max-height: min(70vh, 560px); overflow-y: auto; }
.pcu-modal-sm { width: 420px; }
.pcu-modal--form { width: min(440px, calc(100vw - 32px)) !important; }

.pcu-modal-assign { width: min(520px, calc(100vw - 32px)) !important; }
.pcu-modal-sub { margin: 6px 0 0; font-size: 12px; color: var(--text-muted); font-weight: 400; }
.pcu-assign-body { max-height: min(62vh, 560px); }

.pcu-label-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
}
.pcu-help {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid var(--border);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: var(--text-muted);
  flex-shrink: 0;
  cursor: help;
}
.pcu-textarea {
  min-height: 72px;
  resize: vertical;
  padding-top: 8px;
  padding-bottom: 8px;
  height: auto;
}

.pcu-seg {
  display: flex;
  gap: 0;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 3px;
}
.pcu-seg--grow .pcu-seg-item { flex: 1; min-width: 0; }
.pcu-seg--wrap {
  flex-wrap: wrap;
  gap: 8px;
  border: none;
  padding: 0;
  background: transparent;
}
.pcu-seg-item {
  border: none;
  background: transparent;
  padding: 8px 14px;
  font-size: 13px;
  cursor: pointer;
  border-radius: 6px;
  color: var(--text-secondary);
  font-family: inherit;
  transition: background 0.15s, color 0.15s;
}
.pcu-seg--wrap .pcu-seg-item {
  border: 1px solid var(--border);
  background: var(--surface);
  border-radius: 8px;
  padding: 6px 14px;
}
.pcu-seg-item.active {
  background: var(--primary);
  color: #fff;
  font-weight: 600;
}
.pcu-seg--wrap .pcu-seg-item.active {
  border-color: var(--primary);
}

.pcu-pick-box {
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  background: var(--surface);
}
.pcu-pick-search {
  border: none !important;
  border-bottom: 1px solid var(--border) !important;
  border-radius: 0 !important;
}
.pcu-pick-inner {
  max-height: 180px;
  overflow-y: auto;
  padding: 6px 10px 10px;
}
.pcu-pick-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 4px;
  font-size: 13px;
  cursor: pointer;
}
.pcu-pick-name { flex: 1; min-width: 0; }
.pcu-pick-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--border);
  color: var(--text-secondary);
  flex-shrink: 0;
}
.pcu-pick-hint-inner {
  margin: 8px 0 0;
  font-size: 11px;
  color: var(--text-muted);
  text-align: center;
}
.pcu-pick-help { margin: 8px 0 0; font-size: 12px; color: var(--text-muted); }
.pcu-pick-empty { margin: 0; font-size: 12px; color: var(--text-muted); text-align: center; padding: 12px; }

.pcu-suffix-inp {
  display: flex;
  align-items: stretch;
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}
.pcu-suffix-inp .ul-input {
  border: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  flex: 1;
}
.pcu-suffix {
  display: flex;
  align-items: center;
  padding: 0 12px;
  font-size: 13px;
  color: var(--text-muted);
  background: var(--surface-hover);
  border-left: 1px solid var(--border);
}

.pcu-overlay--high { z-index: 710 !important; }
.pcu-log-drawer { z-index: 720 !important; max-width: min(480px, 100vw); }
.pcu-log-drawer-titles { min-width: 0; }
.pcu-log-user-line {
  margin: 6px 0 0;
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 400;
}
.pcu-log-user-line--muted { opacity: 0.92; }
.pcu-log-table-wrap { margin: 0 -4px; }
.pcu-log-table {
  border-collapse: collapse;
  font-size: 12.5px;
}
.pcu-log-table th,
.pcu-log-table td {
  border: none;
  border-bottom: 1px solid var(--border);
  padding: 10px 8px;
  vertical-align: top;
}
.pcu-log-table th {
  font-weight: 600;
  color: var(--text-secondary);
  background: transparent;
}
.pcu-op-tag {
  display: inline-flex;
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  background: rgba(99, 102, 241, 0.12);
  color: #6366f1;
}
[data-theme="dark"] .pcu-op-tag {
  background: rgba(129, 140, 248, 0.18);
  color: #a5b4fc;
}

.bc-upload-area {
  border: 1.5px dashed var(--border-hover); border-radius: var(--radius-sm);
  padding: 18px; text-align: center; cursor: pointer;
}
.vis-hid { display: none; }

.pcu-sub-filter { display: flex; gap: 8px; flex-wrap: wrap; }
.pcu-sub-filter .ul-input { max-width: 160px; }
.pcu-sort-th {
  background: none; border: none; padding: 0; font: inherit;
  color: inherit; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;
}
.pcu-sort-th:hover { color: var(--primary); }
.pcu-sort-ind { font-size: 10px; opacity: 0.85; }

.ul-toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9998;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
