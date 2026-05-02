<template>
  <div class="op-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">海外文娱</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">项目管理</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">项目管理</h1>
          <p class="page-desc">字段较多，使用右侧抽屉编辑；详情说明与品牌项目配置一致，使用富文本板块编辑器</p>
        </div>
        <button class="btn btn-primary" type="button" @click="openAdd">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          新增项目
        </button>
      </div>

      <div class="glass-card op-filter">
        <div class="ul-filter-grid">
          <div class="ul-form-group">
            <label class="ul-label">项目名称</label>
            <input v-model="filters.projectName" type="text" class="ul-input" placeholder="模糊搜索">
          </div>
          <div class="ul-form-group">
            <label class="ul-label">所属赛道</label>
            <select v-model="filters.trackTypeId" class="ul-input ul-select">
              <option value="">全部</option>
              <option v-for="t in trackSelectOptions" :key="t.id" :value="String(t.id)">{{ t.trackName }}</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">所属业务</label>
            <select v-model="filters.bizCategoryId" class="ul-input ul-select">
              <option value="">全部</option>
              <option v-for="b in bizSelectOptions" :key="b.id" :value="String(b.id)">{{ b.bizName }}</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">内容类型</label>
            <select v-model="filters.bizTypeShort" class="ul-input ul-select">
              <option value="">全部</option>
              <option v-for="b in BIZ_TYPES" :key="b" :value="b">{{ b }}</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">结算类型</label>
            <select v-model="filters.settleType" class="ul-input ul-select">
              <option value="">全部</option>
              <option value="CPS">CPS</option>
              <option value="CPA">CPA</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">状态</label>
            <select v-model="filters.displayStatus" class="ul-input ul-select">
              <option value="">全部</option>
              <option value="visible">显示</option>
              <option value="hidden">隐藏</option>
            </select>
          </div>
        </div>
        <div class="ul-filter-footer">
          <span></span>
          <div style="display:flex;gap:8px">
            <button class="btn btn-default btn-sm" type="button" @click="resetFilter">重置</button>
            <button class="btn btn-primary btn-sm" type="button" @click="runQuery">查询</button>
          </div>
        </div>
      </div>

      <div class="glass-card table-card">
        <div class="table-header">
          <div class="table-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            海外文娱项目
            <span class="table-count">共 {{ total }} 条</span>
          </div>
        </div>
        <div class="ul-table-wrap op-table-wrap">
          <table class="ul-table op-table op-table-fixed">
            <thead>
              <tr>
                <th>ID</th>
                <th>项目名称</th>
                <th>所属赛道</th>
                <th>所属业务</th>
                <th>内容类型</th>
                <th>结算</th>
                <th class="th-num">合作%</th>
                <th>分佣比例</th>
                <th class="th-num">通道%</th>
                <th class="th-num">服务%</th>
                <th>状态</th>
                <th>用户类型</th>
                <th class="th-num">排序</th>
                <th class="col-action th-act">操作</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="loading">
                <tr v-for="i in 4" :key="i"><td :colspan="OP_TABLE_COLS"><div class="ul-skeleton"></div></td></tr>
              </template>
              <template v-else-if="list.length === 0">
                <tr><td :colspan="OP_TABLE_COLS"><div class="ul-empty"><div style="font-size:14px;color:var(--text-secondary)">暂无数据</div></div></td></tr>
              </template>
              <template v-else>
                <tr v-for="row in list" :key="row.id" class="ul-row">
                  <td><span class="ul-mono cell-ellip">{{ row.id }}</span></td>
                  <td><strong class="cell-ellip">{{ row.projectName }}</strong></td>
                  <td><span class="cell-ellip" style="font-size:12px">{{ trackLabelById(row.trackTypeId) }}</span></td>
                  <td><span class="cell-ellip" style="font-size:12px">{{ bizLabelById(row.bizCategoryId) }}</span></td>
                  <td><span class="tag tag-blue" style="font-size:10.5px">{{ row.bizTypeShort }}</span></td>
                  <td><span class="tag" :class="row.settleType === 'CPS' ? 'tag-purple' : 'tag-amber'" style="font-size:10.5px">{{ row.settleType }}</span></td>
                  <td class="td-num"><span class="ul-mono">{{ row.coopRatioPct.toFixed(1) }}</span></td>
                  <td class="op-cell-tier"><span class="tier-summary">{{ commissionSummary(row.commissionTiers) }}</span></td>
                  <td class="td-num"><span class="ul-mono">{{ row.channelFeePct.toFixed(1) }}</span></td>
                  <td class="td-num"><span class="ul-mono">{{ row.serviceFeePct.toFixed(1) }}</span></td>
                  <td><span class="badge" :class="row.displayStatus === 'visible' ? 'badge-success' : 'badge-gray'">{{ row.displayStatus === 'visible' ? '显示' : '隐藏' }}</span></td>
                  <td><span class="tag tag-gray cell-ellip" style="font-size:10px">{{ userScopeLabel(row.userScope) }}</span></td>
                  <td class="td-num"><span class="ul-mono">{{ row.sortWeight }}</span></td>
                  <td class="col-action td-act">
                    <div class="action-btns">
                      <button type="button" class="action-btn view" title="开白配置" @click="openWhitelist(row)">开白</button>
                      <button type="button" class="action-btn edit" title="编辑" @click="openEdit(row)">编辑</button>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <div class="ul-pagination">
          <span class="ul-page-info">共 <strong>{{ total }}</strong> 条，第 <strong>{{ page }}</strong>/<strong>{{ totalPages }}</strong> 页</span>
          <div class="op-pg">
            <button type="button" class="ul-pg-btn" :disabled="page <= 1" @click="goPage(1)">«</button>
            <button type="button" class="ul-pg-btn" :disabled="page <= 1" @click="goPage(page - 1)">‹</button>
            <button v-for="pn in pageButtons" :key="pn" type="button" class="ul-pg-btn" :class="{ active: pn === page }" @click="goPage(pn)">{{ pn }}</button>
            <button type="button" class="ul-pg-btn" :disabled="page >= totalPages" @click="goPage(page + 1)">›</button>
            <button type="button" class="ul-pg-btn" :disabled="page >= totalPages" @click="goPage(totalPages)">»</button>
          </div>
          <div class="op-pg-size">
            每页
            <select class="ul-pg-size" @change="onPageSizeChange">
              <option :value="10">10</option>
              <option :value="20" selected>20</option>
              <option :value="50">50</option>
            </select>
            条
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑抽屉（UIUX：7+ 字段 → 抽屉） -->
    <div class="ul-overlay" :class="{ show: drawerVisible }" @click="drawerVisible = false"></div>
    <aside class="ul-drawer ul-drawer--glass op-drawer" :class="{ show: drawerVisible }">
      <div class="ul-drawer-header">
        <span class="ul-drawer-title">{{ formMode === 'add' ? '新增海外文娱项目' : '编辑海外文娱项目' }}</span>
        <button class="ul-icon-btn" type="button" @click="drawerVisible = false">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="ul-drawer-body">
        <div class="op-section-title">基础信息</div>
        <div class="op-grid">
          <div class="ul-form-group">
            <label class="ul-label">项目名称 <span class="req">*</span></label>
            <input v-model="form.projectName" type="text" class="ul-input" placeholder="如 reelshort、plot novel">
          </div>
          <div class="ul-form-group">
            <label class="ul-label">所属赛道 <span class="req">*</span></label>
            <select v-model.number="form.trackTypeId" class="ul-input ul-select">
              <option v-for="t in trackSelectOptions" :key="t.id" :value="t.id">{{ t.trackName }}</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">所属业务 <span class="req">*</span></label>
            <select v-model.number="form.bizCategoryId" class="ul-input ul-select">
              <option v-for="b in bizSelectOptions" :key="b.id" :value="b.id">{{ b.bizName }}</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">内容类型 <span class="req">*</span></label>
            <select v-model="form.bizTypeShort" class="ul-input ul-select">
              <option v-for="b in BIZ_TYPES" :key="b" :value="b">{{ b }}</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">结算类型</label>
            <select v-model="form.settleType" class="ul-input ul-select">
              <option value="CPS">CPS</option>
              <option value="CPA">CPA</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">合作比例 %</label>
            <input v-model.number="form.coopRatioPct" type="number" class="ul-input" min="0" step="0.1">
          </div>
          <div class="ul-form-group">
            <label class="ul-label">通道费 %</label>
            <input v-model.number="form.channelFeePct" type="number" class="ul-input" min="0" step="0.1">
          </div>
          <div class="ul-form-group">
            <label class="ul-label">服务费 %</label>
            <input v-model.number="form.serviceFeePct" type="number" class="ul-input" min="0" step="0.1">
          </div>
          <div class="ul-form-group">
            <label class="ul-label">前台状态</label>
            <select v-model="form.displayStatus" class="ul-input ul-select">
              <option value="visible">显示</option>
              <option value="hidden">隐藏</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">用户类型</label>
            <select v-model="form.userScope" class="ul-input ul-select">
              <option value="all">全部</option>
              <option value="whitelist">开白人员</option>
              <option value="normal">普通会员</option>
              <option value="vip">高级会员</option>
              <option value="core_vip">核心高级会员</option>
            </select>
          </div>
          <div class="ul-form-group">
            <label class="ul-label">排序权重</label>
            <input v-model.number="form.sortWeight" type="number" class="ul-input" min="0" step="1" title="数值越大越靠前">
          </div>
          <div class="ul-form-group op-span2">
            <label class="ul-label">素材链接</label>
            <input v-model="form.materialUrl" type="text" class="ul-input" placeholder="https://">
          </div>
        </div>

        <div class="op-section-title">分佣比例（等级区间）</div>
        <table class="op-tier-editor">
          <thead><tr><th>等级起</th><th>等级止</th><th>比例 %</th><th style="width:72px"></th></tr></thead>
          <tbody>
            <tr v-for="(t, i) in form.commissionTiers" :key="i">
              <td><input v-model="t.levelFrom" class="ul-input ul-input-sm" placeholder="V1"></td>
              <td><input v-model="t.levelTo" class="ul-input ul-input-sm" placeholder="V2"></td>
              <td><input v-model.number="t.ratioPct" type="number" class="ul-input ul-input-sm" min="0" step="0.1"></td>
              <td><button type="button" class="btn btn-default btn-sm" @click="removeTier(i)">删除</button></td>
            </tr>
          </tbody>
        </table>
        <button type="button" class="btn btn-default btn-sm op-add-tier" @click="addTier">+ 添加区间</button>

        <div class="op-section-title">项目教程</div>
        <div class="ul-form-group">
          <label class="ul-label">教程类型</label>
          <select v-model="form.tutorialMode" class="ul-input ul-select">
            <option value="richtext">图文</option>
            <option value="link">链接</option>
          </select>
        </div>
        <div v-if="form.tutorialMode === 'richtext'" class="ul-form-group">
          <label class="ul-label">项目教程-图文 <span class="req">*</span></label>
          <div class="op-rich-wrap">
            <RichTextChrome v-model="tutorialRichtextProxy" placeholder="输入正文 HTML…" />
          </div>
        </div>
        <div v-else class="ul-form-group">
          <label class="ul-label">项目教程-链接 <span class="req">*</span></label>
          <input v-model="form.tutorialLink" type="text" class="ul-input" placeholder="URL">
        </div>

        <div class="op-section-title">详情说明（富文本板块）</div>
        <p class="op-detail-lead">与品牌项目-项目配置一致：每块含标题、摘要、前台显隐与正文 HTML。</p>
        <div class="ud-tabs">
          <button type="button" class="ud-tab" :class="{ active: detailTab === 'project' }" @click="detailTab = 'project'">项目说明</button>
          <button type="button" class="ud-tab" :class="{ active: detailTab === 'order' }" @click="detailTab = 'order'">订单说明</button>
          <button type="button" class="ud-tab" :class="{ active: detailTab === 'settle' }" @click="detailTab = 'settle'">结算说明</button>
          <button type="button" class="ud-tab" :class="{ active: detailTab === 'notice' }" @click="detailTab = 'notice'">特别注意</button>
        </div>
        <div class="glass-panel-inner op-detail-editor-card">
          <ProjectDetailSectionEditor v-if="detailTab === 'project'" v-model="detailProjectProxy" />
          <ProjectDetailSectionEditor v-else-if="detailTab === 'order'" v-model="detailOrderProxy" />
          <ProjectDetailSectionEditor v-else-if="detailTab === 'settle'" v-model="detailSettleProxy" />
          <ProjectDetailSectionEditor v-else v-model="detailNoticeProxy" />
        </div>
      </div>
      <div class="ul-drawer-footer">
        <button class="btn btn-default" type="button" @click="drawerVisible = false">取消</button>
        <button class="btn btn-primary" type="button" @click="submitForm">保存</button>
      </div>
    </aside>

    <!-- 开白配置抽屉 -->
    <div class="ul-overlay op-wl-overlay" :class="{ show: whitelistVisible }" @click="closeWhitelist"></div>
    <aside class="ul-drawer ul-drawer--glass op-drawer-whitelist" :class="{ show: whitelistVisible }">
      <div class="ul-drawer-header">
        <span class="ul-drawer-title">开白人员配置<span v-if="whitelistProject" class="op-wl-sub"> · {{ whitelistProject.projectName }}</span></span>
        <button class="ul-icon-btn" type="button" @click="closeWhitelist">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="ul-drawer-body op-wl-body">
        <div class="table-header op-wl-table-head">
          <div class="table-title" style="font-size:14px">开白列表</div>
          <div class="op-wl-toolbar">
            <template v-if="wlSelected.size > 0">
              <span class="op-wl-bulk">已选 <strong>{{ wlSelected.size }}</strong></span>
              <button class="btn btn-default btn-sm" type="button" @click="wlBulkDelete">批量删除</button>
            </template>
            <button class="btn btn-default btn-sm" type="button" @click="openWlImport">批量导入</button>
            <button class="btn btn-primary btn-sm" type="button" @click="openWlAdd">新增</button>
          </div>
        </div>
        <div class="ul-table-wrap">
          <table class="ul-table op-wl-table">
            <thead>
              <tr>
                <th style="width:40px"><input type="checkbox" class="ul-checkbox" :checked="wlAllChecked" @change="wlToggleAll"></th>
                <th>用户ID</th>
                <th>用户手机号</th>
                <th>操作人</th>
                <th>操作时间</th>
                <th class="col-action" style="width:56px;text-align:center">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="whitelistRows.length === 0">
                <td colspan="6"><div class="ul-empty" style="padding:20px"><div style="font-size:13px;color:var(--text-secondary)">暂无开白人员，可新增或批量导入</div></div></td>
              </tr>
              <tr v-for="w in whitelistRows" :key="w.id" class="ul-row">
                <td><input type="checkbox" class="ul-checkbox" :checked="wlSelected.has(w.id)" @change="wlToggleRow(w.id)"></td>
                <td><span class="ul-mono" style="font-size:12px">{{ w.userId }}</span></td>
                <td style="font-size:12px">{{ w.phone }}</td>
                <td style="font-size:12px">{{ w.operator }}</td>
                <td><span class="ul-mono" style="font-size:11px">{{ w.operateTime }}</span></td>
                <td class="col-action">
                  <div class="action-btns">
                    <button type="button" class="action-btn delete" title="删除" @click="wlRemoveOne(w.id)">删除</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="ul-drawer-footer">
        <button class="btn btn-default" type="button" @click="closeWhitelist">关闭</button>
      </div>
    </aside>

    <!-- 开白：新增（校验用户ID） -->
    <div class="ul-overlay op-wl-modal-overlay" :class="{ show: wlAddVisible }" @click="wlAddVisible = false"></div>
    <div class="ul-modal flex-col ul-modal--glass op-wl-modal" :class="{ show: wlAddVisible }" role="dialog" aria-modal="true">
      <div class="ul-modal-header">
        <div class="ul-modal-title">新增开白</div>
        <button class="ul-icon-btn" type="button" @click="wlAddVisible = false"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <div class="ul-modal-body">
        <div class="ul-form-group">
          <label class="ul-label">用户ID <span class="req">*</span></label>
          <input v-model.trim="wlFormUserId" type="text" class="ul-input" placeholder="如 U10001">
        </div>
      </div>
      <div class="ul-modal-footer">
        <button class="btn btn-default" type="button" @click="wlAddVisible = false">取消</button>
        <button class="btn btn-primary" type="button" @click="submitWlAdd">确定</button>
      </div>
    </div>

    <!-- 开白：批量导入（每行一个用户ID） -->
    <div class="ul-overlay op-wl-modal-overlay" :class="{ show: wlImportVisible }" @click="wlImportVisible = false"></div>
    <div class="ul-modal flex-col ul-modal--glass op-wl-modal op-wl-modal-wide" :class="{ show: wlImportVisible }" role="dialog" aria-modal="true">
      <div class="ul-modal-header">
        <div class="ul-modal-title">批量导入</div>
        <button class="ul-icon-btn" type="button" @click="wlImportVisible = false"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <div class="ul-modal-body">
        <div class="ul-form-group">
          <label class="ul-label">用户ID <span class="req">*</span>（每行一个）</label>
          <textarea v-model="wlImportText" class="ul-input ul-textarea" rows="8" placeholder="U10001&#10;U10002"></textarea>
        </div>
      </div>
      <div class="ul-modal-footer">
        <button class="btn btn-default" type="button" @click="wlImportVisible = false">取消</button>
        <button class="btn btn-primary" type="button" @click="submitWlImport">导入</button>
      </div>
    </div>

    <div class="ul-toast-container">
      <div v-for="t in toasts" :key="t.id" class="ul-toast" :class="t.type">
        <span style="flex:1">{{ t.msg }}</span>
        <button type="button" class="toast-x" @click="removeToast(t.id)">✕</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, reactive } from 'vue'
import type { DetailSection } from '@/utils/projectManagement'
import { emptyDetailSection } from '@/utils/projectManagement'
import ProjectDetailSectionEditor from './ProjectDetailSectionEditor.vue'
import RichTextChrome from '@/components/project/RichTextChrome.vue'
import {
  TRACK_TYPE_MOCK_SEED,
  BIZ_TYPE_MOCK_SEED,
  trackLabelById,
  bizLabelById,
  mockUserIdExists,
  mockPhoneForUserId,
} from '@/data/projectCategoryCatalog'

export type CommissionTier = { levelFrom: string; levelTo: string; ratioPct: number }

export interface WhitelistEntryRow {
  id: number
  userId: string
  phone: string
  operator: string
  operateTime: string
}

export interface ProjectRow {
  id: number
  projectName: string
  /** 类目配置-赛道类型 id（与 /project/track-type 同源） */
  trackTypeId: number
  /** 类目配置-业务类型 id（与 /project/biz-type 同源） */
  bizCategoryId: number
  bizTypeShort: string
  settleType: 'CPS' | 'CPA'
  coopRatioPct: number
  commissionTiers: CommissionTier[]
  channelFeePct: number
  serviceFeePct: number
  displayStatus: 'visible' | 'hidden'
  userScope: 'all' | 'whitelist' | 'normal' | 'vip' | 'core_vip'
  sortWeight: number
  materialUrl: string
  tutorialMode: 'richtext' | 'link'
  tutorialRichtext: string
  tutorialLink: string
  detailProject: DetailSection
  detailOrder: DetailSection
  detailSettle: DetailSection
  detailNotice: DetailSection
  whitelistEntries: WhitelistEntryRow[]
}

const OP_TABLE_COLS = 14

const BIZ_TYPES = ['小说', '短剧']

interface Toast { id: number; msg: string; type: 'success' | 'error' | 'info' }

const trackSelectOptions = computed(() => TRACK_TYPE_MOCK_SEED.filter((t) => t.status === 'show'))
const bizSelectOptions = computed(() => BIZ_TYPE_MOCK_SEED.filter((b) => b.status === 'show'))

function detailBlock(title: string, html: string): DetailSection {
  return { ...emptyDetailSection(title, ''), content: html || '<p></p>', visible: 'yes', contentType: 'article' }
}

function defaultDetailTabs(): Pick<ProjectRow, 'detailProject' | 'detailOrder' | 'detailSettle' | 'detailNotice'> {
  return {
    detailProject: detailBlock('项目说明', '<p>海外文娱项目前台说明</p>'),
    detailOrder: detailBlock('订单说明', '<p>下单与回填规则</p>'),
    detailSettle: detailBlock('结算说明', '<p>结算周期与对账</p>'),
    detailNotice: detailBlock('特别注意', '<p>版权与合规提示</p>'),
  }
}

function sampleWhitelist(i: number): WhitelistEntryRow[] {
  if (i % 4 === 0) return []
  const uid = ['U10001', 'U10002', 'U10003'][i % 3]
  const phone = mockPhoneForUserId(uid) ?? '—'
  return [
    { id: i * 100 + 1, userId: uid, phone, operator: 'admin', operateTime: '2026-04-20 10:00:00' },
  ]
}

function buildProjects(n: number): ProjectRow[] {
  const names = ['reelshort', 'plot novel', 'novelgo', 'streamEast', 'waveNovel', 'shortMax', 'osDrama', 'ficHub', 'pixStory', 'novelN', 'readGo', 'clipT', 'plotV', 'storyArc', 'tikRead', 'seaBook', 'moonLit', 'dramaX', 'liteShort', 'inkSea', 'pageTurn', 'fastFic', 'rowB', 'rowC', 'rowD', 'rowE', 'rowF', 'rowG']
  return Array.from({ length: n }, (_, i) => {
    const id = i + 1
    const base = names[i % names.length]
    const projectName = id <= names.length ? base : `${base}-${id}`
    const trackTypeId = 1 + (i % 6)
    const bizCategoryId = 1 + (i % 6)
    return {
      id,
      projectName,
      trackTypeId,
      bizCategoryId,
      bizTypeShort: i % 2 === 0 ? '短剧' : '小说',
      settleType: i % 3 === 0 ? 'CPA' : 'CPS',
      coopRatioPct: 8 + (i % 5) * 0.8,
      commissionTiers: [
        { levelFrom: 'V1', levelTo: 'V2', ratioPct: 30 },
        { levelFrom: 'V3', levelTo: 'V5', ratioPct: 45 + (i % 3) * 2 },
      ],
      channelFeePct: 1 + (i % 4) * 0.3,
      serviceFeePct: 0.5 + (i % 3) * 0.2,
      displayStatus: i % 7 === 0 ? 'hidden' : 'visible',
      userScope: ['all', 'whitelist', 'normal', 'vip', 'core_vip'][i % 5] as ProjectRow['userScope'],
      sortWeight: 200 - i,
      materialUrl: i % 4 === 0 ? '' : `https://cdn.example.com/os/${id}.zip`,
      tutorialMode: i % 2 === 0 ? 'link' : 'richtext',
      tutorialRichtext: i % 2 === 0 ? '' : `<p>教程正文 #${id}</p>`,
      tutorialLink: i % 2 === 0 ? `https://help.example.com/os/${id}` : '',
      whitelistEntries: sampleWhitelist(i),
      ...defaultDetailTabs(),
    }
  })
}

const loading = ref(false)
const allRows = ref<ProjectRow[]>(buildProjects(28))
const page = ref(1)
const pageSize = ref(20)
const filters = ref({
  projectName: '',
  trackTypeId: '',
  bizCategoryId: '',
  bizTypeShort: '',
  settleType: '',
  displayStatus: '',
})
const drawerVisible = ref(false)
const formMode = ref<'add' | 'edit'>('add')
const form = ref<Partial<ProjectRow>>({})
const detailTab = ref<'project' | 'order' | 'settle' | 'notice'>('project')
const toasts = ref<Toast[]>([])
let toastId = 0
let nextId = 29

const whitelistVisible = ref(false)
const whitelistProjectId = ref<number | null>(null)
const whitelistRows = ref<WhitelistEntryRow[]>([])
const wlSelected = reactive(new Set<number>())
const wlAddVisible = ref(false)
const wlImportVisible = ref(false)
const wlFormUserId = ref('')
const wlImportText = ref('')

const whitelistProject = computed(() => allRows.value.find((r) => r.id === whitelistProjectId.value) ?? null)

const wlAllChecked = computed(
  () => whitelistRows.value.length > 0 && whitelistRows.value.every((w) => wlSelected.has(w.id)),
)

const filteredAll = computed(() => {
  let data = [...allRows.value]
  if (filters.value.projectName.trim()) {
    const q = filters.value.projectName.trim().toLowerCase()
    data = data.filter((d) => d.projectName.toLowerCase().includes(q))
  }
  if (filters.value.trackTypeId) {
    const tid = Number(filters.value.trackTypeId)
    data = data.filter((d) => d.trackTypeId === tid)
  }
  if (filters.value.bizCategoryId) {
    const bid = Number(filters.value.bizCategoryId)
    data = data.filter((d) => d.bizCategoryId === bid)
  }
  if (filters.value.bizTypeShort) data = data.filter((d) => d.bizTypeShort === filters.value.bizTypeShort)
  if (filters.value.settleType) data = data.filter((d) => d.settleType === filters.value.settleType)
  if (filters.value.displayStatus) data = data.filter((d) => d.displayStatus === filters.value.displayStatus)
  return data
})

const total = computed(() => filteredAll.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
const list = computed(() => {
  const s = (page.value - 1) * pageSize.value
  return filteredAll.value.slice(s, s + pageSize.value)
})
const pageButtons = computed(() => {
  const t = totalPages.value
  const c = page.value
  const arr: number[] = []
  for (let i = Math.max(1, c - 2); i <= Math.min(t, c + 2); i++) arr.push(i)
  return arr
})

const detailProjectProxy = computed({
  get: () => form.value.detailProject ?? emptyDetailSection('项目说明', ''),
  set: (v: DetailSection) => { form.value.detailProject = v },
})
const detailOrderProxy = computed({
  get: () => form.value.detailOrder ?? emptyDetailSection('订单说明', ''),
  set: (v: DetailSection) => { form.value.detailOrder = v },
})
const detailSettleProxy = computed({
  get: () => form.value.detailSettle ?? emptyDetailSection('结算说明', ''),
  set: (v: DetailSection) => { form.value.detailSettle = v },
})
const detailNoticeProxy = computed({
  get: () => form.value.detailNotice ?? emptyDetailSection('特别注意', ''),
  set: (v: DetailSection) => { form.value.detailNotice = v },
})

const tutorialRichtextProxy = computed({
  get: () => form.value.tutorialRichtext ?? '',
  set: (v: string) => { form.value.tutorialRichtext = v },
})

function userScopeLabel(s: ProjectRow['userScope']) {
  return { all: '全部', whitelist: '开白人员', normal: '普通会员', vip: '高级会员', core_vip: '核心高级会员' }[s] || s
}

function commissionSummary(tiers: CommissionTier[]) {
  const arr = tiers || []
  if (!arr.length) return '—'
  const byRatio = new Map<number, CommissionTier[]>()
  for (const t of arr) {
    const r = Math.round(t.ratioPct * 10) / 10
    if (!byRatio.has(r)) byRatio.set(r, [])
    byRatio.get(r)!.push(t)
  }
  const parts: string[] = []
  byRatio.forEach((group, r) => {
    parts.push(`${group.map((x) => `${x.levelFrom}～${x.levelTo}`).join('、')}：${r}%`)
  })
  return parts.join('；')
}

function defaultForm(): Partial<ProjectRow> {
  return {
    projectName: '',
    trackTypeId: trackSelectOptions.value[0]?.id ?? 1,
    bizCategoryId: bizSelectOptions.value[0]?.id ?? 1,
    bizTypeShort: '短剧',
    settleType: 'CPS',
    coopRatioPct: 10,
    commissionTiers: [
      { levelFrom: 'V1', levelTo: 'V2', ratioPct: 30 },
      { levelFrom: 'V3', levelTo: 'V5', ratioPct: 50 },
    ],
    channelFeePct: 2,
    serviceFeePct: 1,
    displayStatus: 'visible',
    userScope: 'all',
    sortWeight: 100,
    materialUrl: '',
    tutorialMode: 'richtext',
    tutorialRichtext: '<p></p>',
    tutorialLink: '',
    whitelistEntries: [],
    ...defaultDetailTabs(),
  }
}

function addTier() {
  if (!form.value.commissionTiers) form.value.commissionTiers = []
  form.value.commissionTiers.push({ levelFrom: 'V1', levelTo: 'V1', ratioPct: 25 })
}

function removeTier(i: number) {
  form.value.commissionTiers?.splice(i, 1)
}

async function runQuery() {
  loading.value = true
  page.value = 1
  await new Promise((r) => setTimeout(r, 80))
  loading.value = false
}

function resetFilter() {
  filters.value = {
    projectName: '',
    trackTypeId: '',
    bizCategoryId: '',
    bizTypeShort: '',
    settleType: '',
    displayStatus: '',
  }
  runQuery()
}

function goPage(p: number) {
  const tp = Math.max(1, Math.ceil(filteredAll.value.length / pageSize.value))
  page.value = Math.min(Math.max(1, p), tp)
}

function onPageSizeChange(e: Event) {
  pageSize.value = Number((e.target as HTMLSelectElement).value)
  page.value = 1
}

function openAdd() {
  formMode.value = 'add'
  form.value = defaultForm()
  detailTab.value = 'project'
  drawerVisible.value = true
}

function openEdit(row: ProjectRow) {
  formMode.value = 'edit'
  form.value = JSON.parse(JSON.stringify(row))
  if (!form.value.commissionTiers?.length) {
    form.value.commissionTiers = [{ levelFrom: 'V1', levelTo: 'V2', ratioPct: 30 }]
  }
  if (form.value.trackTypeId == null) form.value.trackTypeId = trackSelectOptions.value[0]?.id ?? 1
  if (form.value.bizCategoryId == null) form.value.bizCategoryId = bizSelectOptions.value[0]?.id ?? 1
  if (!form.value.whitelistEntries) form.value.whitelistEntries = []
  detailTab.value = 'project'
  drawerVisible.value = true
}

function submitForm() {
  if (!form.value.projectName?.trim()) {
    showToast('请填写项目名称', 'error')
    return
  }
  if (form.value.trackTypeId == null || Number.isNaN(Number(form.value.trackTypeId))) {
    showToast('请选择所属赛道', 'error')
    return
  }
  if (form.value.bizCategoryId == null || Number.isNaN(Number(form.value.bizCategoryId))) {
    showToast('请选择所属业务', 'error')
    return
  }
  if (form.value.tutorialMode === 'richtext' && !form.value.tutorialRichtext?.trim()) {
    showToast('图文教程为必填', 'error')
    return
  }
  if (form.value.tutorialMode === 'link' && !form.value.tutorialLink?.trim()) {
    showToast('教程链接为必填', 'error')
    return
  }
  const payload = form.value as ProjectRow
  if (!payload.whitelistEntries) payload.whitelistEntries = []
  if (formMode.value === 'add') {
    allRows.value.unshift({ ...payload, id: nextId++ })
  } else if (payload.id != null) {
    const idx = allRows.value.findIndex((r) => r.id === payload.id)
    if (idx >= 0) allRows.value[idx] = { ...payload }
  }
  drawerVisible.value = false
  showToast('已保存', 'success')
}

function showToast(msg: string, type: Toast['type'] = 'info') {
  const id = ++toastId
  toasts.value.push({ id, msg, type })
  setTimeout(() => removeToast(id), 2500)
}

function removeToast(id: number) {
  toasts.value = toasts.value.filter((t) => t.id !== id)
}

function persistWhitelistToProject() {
  const pid = whitelistProjectId.value
  if (pid == null) return
  const row = allRows.value.find((r) => r.id === pid)
  if (row) row.whitelistEntries = JSON.parse(JSON.stringify(whitelistRows.value))
}

function closeWhitelist() {
  persistWhitelistToProject()
  whitelistVisible.value = false
  wlSelected.clear()
}

function openWhitelist(row: ProjectRow) {
  if (whitelistVisible.value && whitelistProjectId.value !== row.id) persistWhitelistToProject()
  whitelistProjectId.value = row.id
  whitelistRows.value = JSON.parse(JSON.stringify(row.whitelistEntries || []))
  wlSelected.clear()
  whitelistVisible.value = true
}

function wlNextEntryId() {
  const ids = whitelistRows.value.map((w) => w.id)
  return ids.length ? Math.max(...ids) + 1 : 1
}

function wlToggleRow(id: number) {
  if (wlSelected.has(id)) wlSelected.delete(id)
  else wlSelected.add(id)
}

function wlToggleAll(e: Event) {
  const on = (e.target as HTMLInputElement).checked
  if (on) whitelistRows.value.forEach((w) => wlSelected.add(w.id))
  else wlSelected.clear()
}

function openWlAdd() {
  wlFormUserId.value = ''
  wlAddVisible.value = true
}

function submitWlAdd() {
  const uid = wlFormUserId.value.trim()
  if (!uid) {
    showToast('请填写用户ID', 'error')
    return
  }
  if (!mockUserIdExists(uid)) {
    showToast('用户ID不存在，请核对后重试', 'error')
    return
  }
  if (whitelistRows.value.some((w) => w.userId === uid)) {
    showToast('该用户已在开白列表中', 'error')
    return
  }
  const phone = mockPhoneForUserId(uid) ?? '—'
  whitelistRows.value.push({
    id: wlNextEntryId(),
    userId: uid,
    phone,
    operator: 'admin',
    operateTime: nowOperateTime(),
  })
  persistWhitelistToProject()
  wlAddVisible.value = false
  showToast('已添加', 'success')
}

function openWlImport() {
  wlImportText.value = ''
  wlImportVisible.value = true
}

function submitWlImport() {
  const lines = wlImportText.value.split(/\r?\n/).map((s) => s.trim()).filter(Boolean)
  if (!lines.length) {
    showToast('请粘贴至少一行用户ID', 'error')
    return
  }
  let ok = 0
  let skipDup = 0
  let bad = 0
  for (const uid of lines) {
    if (!mockUserIdExists(uid)) {
      bad++
      continue
    }
    if (whitelistRows.value.some((w) => w.userId === uid)) {
      skipDup++
      continue
    }
    const phone = mockPhoneForUserId(uid) ?? '—'
    whitelistRows.value.push({
      id: wlNextEntryId(),
      userId: uid,
      phone,
      operator: 'admin',
      operateTime: nowOperateTime(),
    })
    ok++
  }
  persistWhitelistToProject()
  wlImportVisible.value = false
  showToast(`导入完成：成功 ${ok} 条，无效ID ${bad} 条，已存在跳过 ${skipDup} 条`, ok ? 'success' : 'info')
}

function wlRemoveOne(id: number) {
  whitelistRows.value = whitelistRows.value.filter((w) => w.id !== id)
  wlSelected.delete(id)
  persistWhitelistToProject()
  showToast('已删除', 'success')
}

function wlBulkDelete() {
  if (wlSelected.size === 0) return
  if (!confirm(`确定删除已选的 ${wlSelected.size} 条开白记录？`)) return
  whitelistRows.value = whitelistRows.value.filter((w) => !wlSelected.has(w.id))
  wlSelected.clear()
  persistWhitelistToProject()
  showToast('已批量删除', 'success')
}

function nowOperateTime() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ')
}

watch(
  () => drawerVisible.value || whitelistVisible.value,
  (v) => {
    document.body.style.overflow = v ? 'hidden' : ''
  },
)

onMounted(() => {
  runQuery()
})
</script>

<style scoped>
.op-wrap { min-height: 100%; }
.op-filter { padding: 16px 18px 14px; margin-bottom: 14px; }
.op-drawer { width: min(720px, 96vw) !important; }
.op-section-title { font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.04em; margin: 14px 0 10px; }
.op-section-title:first-of-type { margin-top: 0; }
.op-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 14px; }
.op-span2 { grid-column: 1 / -1; }
.op-tier-editor { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 8px; }
.op-tier-editor th, .op-tier-editor td { border: 1px solid var(--border); padding: 6px 8px; text-align: left; }
.op-tier-editor th { background: var(--bg-elevated); }
.ul-input-sm { padding: 6px 8px; font-size: 13px; }
.op-add-tier { margin-bottom: 12px; }
.op-detail-lead { font-size: 12.5px; color: var(--text-secondary); margin: 0 0 10px; line-height: 1.5; }
.op-detail-editor-card { padding: 12px 14px; border-radius: var(--radius); border: 1px solid var(--border); background: var(--bg-elevated); }
.op-rich-wrap { border: 1px solid var(--border); border-radius: var(--radius-sm); overflow: hidden; min-height: 200px; }
.op-table-wrap { overflow-x: auto; }
.op-table-fixed { table-layout: fixed; width: 100%; min-width: 0; }
.op-table-fixed th,
.op-table-fixed td { padding-left: 8px; padding-right: 8px; vertical-align: middle; }
.op-table-fixed .th-num,
.op-table-fixed .td-num { text-align: right; width: 6%; }
.op-table-fixed .th-act,
.op-table-fixed .td-act { width: 88px; text-align: center; }
.op-table-fixed .op-cell-tier { white-space: normal; word-break: break-word; }
.cell-ellip { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.op-wl-overlay.ul-overlay { z-index: 705; }
.op-drawer-whitelist.ul-drawer { z-index: 710; width: min(640px, 94vw) !important; }
.op-wl-sub { font-weight: 500; color: var(--text-secondary); font-size: 13px; }
.op-wl-body { padding-top: 12px !important; }
.op-wl-table-head { margin-bottom: 10px; flex-wrap: wrap; gap: 10px; align-items: center; justify-content: space-between; }
.op-wl-toolbar { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.op-wl-bulk { font-size: 13px; color: var(--text-secondary); margin-right: 4px; }
.op-wl-table { width: 100%; table-layout: fixed; }
.op-wl-modal-overlay.ul-overlay { z-index: 715; }
.op-wl-modal.ul-modal { z-index: 716; width: 420px !important; }
.op-wl-modal-wide.ul-modal { width: 520px !important; }
.req { color: var(--danger); }
.badge { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; }
.badge-success { background: var(--success-bg); color: var(--success); }
.badge-gray { background: var(--border); color: var(--text-muted); }
.tag-purple { background: #ede9fe; color: #6d28d9; }
.tag-amber { background: #fffbeb; color: #b45309; }
.toast-x { background: none; border: none; cursor: pointer; color: var(--text-muted); }
.op-pg { display: flex; align-items: center; gap: 4px; }
.op-pg-size { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-muted); }
[data-theme="dark"] .tag-purple { background: rgba(109,40,217,0.2); color: #c4b5fd; }
[data-theme="dark"] .tag-amber { background: rgba(180,83,9,0.2); color: #fcd34d; }
</style>
