<template>
  <div class="pdt-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">首页</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">品牌项目</span>
      <span class="bc-sep">/</span>
      <router-link to="/project/config" class="bc-a">项目配置</router-link>
      <span class="bc-sep">/</span>
      <span class="bc-cur">数据表配置详情</span>
    </div>

    <div class="page-content pdt-page">
      <div class="pdt-page-head">
        <button type="button" class="btn btn-default btn-sm" @click="goTableHome">返回项目列表</button>
        <div class="pdt-page-head-text">
          <h1 class="pdt-page-title">数据表配置详情</h1>
          <p class="pdt-project-hint">项目 <strong>{{ projectLabel }}</strong></p>
        </div>
      </div>

      <div class="glass-card pdt-card-shell">
        <div class="pdt-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            class="pdt-tab"
            :class="{ active: tab === 'keyword' }"
            :aria-selected="tab === 'keyword'"
            @click="tab = 'keyword'"
          >关键词表</button>
          <button
            type="button"
            role="tab"
            class="pdt-tab"
            :class="{ active: tab === 'works' }"
            :aria-selected="tab === 'works'"
            @click="tab = 'works'"
          >作品表</button>
          <button
            type="button"
            role="tab"
            class="pdt-tab"
            :class="{ active: tab === 'order' }"
            :aria-selected="tab === 'order'"
            @click="tab = 'order'"
          >订单表</button>
        </div>

        <!-- 关键词表 -->
        <div v-show="tab === 'keyword'" class="pdt-panel" role="tabpanel">
          <div class="pdt-toolbar">
            <p class="pdt-hint">调整开关与选项后，需点击右上角「保存」才会生效（原型：保存后写入本地快照并提示）。</p>
            <button type="button" class="btn btn-primary btn-sm" :disabled="!dirtyKeyword" @click="savePanel('keyword')">保存</button>
          </div>
          <div class="pdt-table-wrap">
            <table class="pdt-config-table">
              <thead>
                <tr>
                  <th>字典字段</th>
                  <th>字段标题</th>
                  <th class="pdt-switch-cell">数据表显示</th>
                  <th class="pdt-switch-cell">数据表导入</th>
                  <th class="pdt-switch-cell">数据表导出</th>
                  <th class="pdt-switch-cell">前端显示</th>
                  <th>说明</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in kwRows" :key="row.id">
                  <td><code class="pdt-code">{{ row.code }}</code></td>
                  <td>{{ row.title }}</td>
                  <SwCell
                    :checked="row.tbl.on"
                    :disabled="!!row.tbl.dis"
                    @update:checked="(v: boolean) => { row.tbl.on = v }"
                  />
                  <SwCell
                    :checked="row.imp.on"
                    :disabled="!!row.imp.dis"
                    @update:checked="(v: boolean) => { row.imp.on = v }"
                  />
                  <SwCell
                    :checked="row.exp.on"
                    :disabled="!!row.exp.dis"
                    @update:checked="(v: boolean) => { row.exp.on = v }"
                  />
                  <SwCell
                    :checked="row.ui.on"
                    :disabled="!!row.ui.dis"
                    @update:checked="(v: boolean) => { row.ui.on = v }"
                  />
                  <td class="pdt-note"><NoteCell :tag="row.tag" :text="row.note" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 作品表 -->
        <div v-show="tab === 'works'" class="pdt-panel" role="tabpanel">
          <div class="pdt-toolbar">
            <p class="pdt-hint">与关键词表一致；开关与「前端显示」需保存后生效。</p>
            <button type="button" class="btn btn-primary btn-sm" :disabled="!dirtyWorks" @click="savePanel('works')">保存</button>
          </div>
          <div class="pdt-table-wrap">
            <table class="pdt-config-table">
              <thead>
                <tr>
                  <th>字典字段</th>
                  <th>字段标题</th>
                  <th class="pdt-switch-cell">数据表显示</th>
                  <th class="pdt-switch-cell">数据表导入</th>
                  <th class="pdt-switch-cell">数据表导出</th>
                  <th class="pdt-switch-cell">前端显示</th>
                  <th>说明</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in workRows" :key="row.id">
                  <td><code class="pdt-code">{{ row.code }}</code></td>
                  <td>{{ row.title }}</td>
                  <SwCell
                    :checked="row.tbl.on"
                    :disabled="!!row.tbl.dis"
                    @update:checked="(v: boolean) => { row.tbl.on = v }"
                  />
                  <SwCell
                    :checked="row.imp.on"
                    :disabled="!!row.imp.dis"
                    @update:checked="(v: boolean) => { row.imp.on = v }"
                  />
                  <SwCell
                    :checked="row.exp.on"
                    :disabled="!!row.exp.dis"
                    @update:checked="(v: boolean) => { row.exp.on = v }"
                  />
                  <SwCell
                    :checked="row.ui.on"
                    :disabled="!!row.ui.dis"
                    @update:checked="(v: boolean) => { row.ui.on = v }"
                  />
                  <td class="pdt-note"><NoteCell :tag="row.tag" :text="row.note" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 订单表 -->
        <div v-show="tab === 'order'" class="pdt-panel" role="tabpanel">
          <div class="pdt-toolbar">
            <p class="pdt-hint">含「前端标题」可编辑；全部变更（含新增行）须点「保存」后视为已提交配置。</p>
            <div class="pdt-toolbar-actions">
              <button type="button" class="btn btn-primary btn-sm" @click="openAddModal">+ 新增字段</button>
              <button type="button" class="btn btn-primary btn-sm" :disabled="!dirtyOrder" @click="savePanel('order')">保存</button>
            </div>
          </div>
          <div class="pdt-table-wrap">
            <table class="pdt-config-table">
              <thead>
                <tr>
                  <th>字典字段</th>
                  <th>字段标题</th>
                  <th class="pdt-switch-cell">数据表显示</th>
                  <th class="pdt-switch-cell">数据表导入</th>
                  <th class="pdt-switch-cell">数据表导出</th>
                  <th class="pdt-switch-cell">前端显示</th>
                  <th>前端标题</th>
                  <th>说明</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in orderRows" :key="row.id">
                  <td><code class="pdt-code">{{ row.code }}</code></td>
                  <td>{{ row.title }}</td>
                  <SwCell
                    :checked="row.tbl.on"
                    :disabled="!!row.tbl.dis"
                    @update:checked="(v: boolean) => { row.tbl.on = v }"
                  />
                  <SwCell
                    :checked="row.imp.on"
                    :disabled="!!row.imp.dis"
                    @update:checked="(v: boolean) => { row.imp.on = v }"
                  />
                  <SwCell
                    :checked="row.exp.on"
                    :disabled="!!row.exp.dis"
                    @update:checked="(v: boolean) => { row.exp.on = v }"
                  />
                  <SwCell
                    :checked="row.ui.on"
                    :disabled="!!row.ui.dis"
                    @update:checked="(v: boolean) => { row.ui.on = v }"
                  />
                  <td class="pdt-front-title">
                    <input v-model="row.frontTitle" type="text" class="pdt-cell-input" aria-label="前端标题">
                  </td>
                  <td class="pdt-note"><NoteCell :tag="row.tag" :text="row.note" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="ul-overlay" :class="{ show: addModal }" @click="addModal = false" />
    <div class="ul-modal pdt-modal" :class="{ show: addModal }" role="dialog" aria-labelledby="pdt-modal-title">
      <div class="ul-modal-header">
        <div id="pdt-modal-title" class="ul-modal-title">新增订单表字段</div>
      </div>
      <div class="ul-modal-body">
        <div class="pdt-form-row">
          <label for="pdt-dict-key">字典字段（英文 key）</label>
          <input id="pdt-dict-key" v-model="addForm.code" type="text" placeholder="例如 custom_order_flag" autocomplete="off" class="ul-input">
        </div>
        <div class="pdt-form-row">
          <label for="pdt-field-title">字段标题</label>
          <input id="pdt-field-title" v-model="addForm.title" type="text" placeholder="例如 自定义标记" autocomplete="off" class="ul-input">
        </div>
        <p class="pdt-form-hint">确定后仅加入表格草稿；与开关、前端标题一并需在页面点击「保存」后生效。</p>
      </div>
      <div class="ul-modal-footer">
        <button type="button" class="btn btn-default btn-sm" @click="addModal = false">取消</button>
        <button type="button" class="btn btn-primary btn-sm" @click="confirmAddOrderRow">确定</button>
      </div>
    </div>

    <div class="pdt-toast" :class="{ show: toastMsg }" role="status">{{ toastMsg }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProjectConfigStore } from '@/stores/projectConfig'
import SwCell from './ProjectDataTableSwCell.vue'
import NoteCell from './ProjectDataTableNoteCell.vue'

interface Sw { on: boolean; dis?: boolean }
interface Row {
  id: string
  code: string
  title: string
  frontTitle?: string
  tbl: Sw
  imp: Sw
  exp: Sw
  ui: Sw
  tag?: 'fixed' | 'config' | 'orderAdd'
  note: string
}

function sw(on: boolean, locked?: boolean): Sw {
  return locked ? { on, dis: true } : { on }
}

const route = useRoute()
const router = useRouter()
const projectId = computed(() => Number(route.params.projectId))

function goTableHome() {
  router.push({ name: 'ProjectConfig' })
}

const store = useProjectConfigStore()
const { rows: projects } = storeToRefs(store)

const projectLabel = computed(() => {
  const p = projects.value.find((x) => x.id === projectId.value)
  return p ? p.frontTitle : `id=${projectId.value}`
})

const tab = ref<'keyword' | 'works' | 'order'>('keyword')

const KW_DEFAULT: Row[] = [
  { id: 'kw-t', code: 'task_ID', title: '任务名称', tbl: sw(true), imp: sw(false), exp: sw(true), ui: sw(true), tag: 'config', note: '任务 ID 与任务名称字段' },
  { id: 'kw-k', code: 'keyword_field_1', title: '主关键词', tbl: sw(true), imp: sw(true), exp: sw(true), ui: sw(true), tag: 'config', note: '用户在关键词配置中定义的字段' },
  { id: 'kw-u', code: 'user_id', title: '用户 ID', tbl: sw(true, true), imp: sw(false, true), exp: sw(true, true), ui: sw(true, true), tag: 'fixed', note: '系统字段，开关只读' },
  { id: 'kw-p', code: 'project_short_name', title: '项目简称', tbl: sw(true), imp: sw(false), exp: sw(true), ui: sw(false), tag: 'fixed', note: '' },
  { id: 'kw-e', code: 'export_status', title: '导出状态', tbl: sw(true), imp: sw(false), exp: sw(true), ui: sw(true), tag: 'fixed', note: '' },
  { id: 'kw-a', code: 'audit_status', title: '审核状态', tbl: sw(true), imp: sw(false), exp: sw(true), ui: sw(true), tag: 'fixed', note: '' },
  { id: 'kw-c', code: 'create_time', title: '创建时间', tbl: sw(true), imp: sw(false), exp: sw(true), ui: sw(true), tag: 'fixed', note: '' },
  { id: 'kw-x', code: 'export_time', title: '导出时间', tbl: sw(true), imp: sw(false), exp: sw(true), ui: sw(false), tag: 'fixed', note: '' },
  { id: 'kw-i', code: 'import_time', title: '导入时间', tbl: sw(true), imp: sw(false), exp: sw(true), ui: sw(true), tag: 'fixed', note: '' },
  { id: 'kw-f', code: 'audit_feedback', title: '审核反馈', tbl: sw(true), imp: sw(false), exp: sw(true), ui: sw(true), tag: 'fixed', note: '' },
]

const WORK_DEFAULT: Row[] = [
  { id: 'wk-t', code: 'task_ID', title: '任务名称', tbl: sw(true), imp: sw(false), exp: sw(true), ui: sw(true), tag: 'config', note: '' },
  { id: 'wk-w', code: 'work_title', title: '作品标题', tbl: sw(true), imp: sw(true), exp: sw(true), ui: sw(true), tag: 'config', note: '示例动态字段' },
  { id: 'wk-u', code: 'user_id', title: '用户 ID', tbl: sw(true), imp: sw(false), exp: sw(true), ui: sw(true), tag: 'fixed', note: '与关键词表相同体系' },
  { id: 'wk-p', code: 'project_short_name', title: '项目简称', tbl: sw(true), imp: sw(false), exp: sw(true), ui: sw(false), tag: 'fixed', note: '' },
  { id: 'wk-e', code: 'export_status', title: '导出状态', tbl: sw(true), imp: sw(false), exp: sw(true), ui: sw(true), tag: 'fixed', note: '' },
  { id: 'wk-a', code: 'audit_status', title: '审核状态', tbl: sw(true), imp: sw(false), exp: sw(true), ui: sw(true), tag: 'fixed', note: '' },
  { id: 'wk-c', code: 'create_time', title: '创建时间', tbl: sw(true), imp: sw(false), exp: sw(true), ui: sw(true), tag: 'fixed', note: '' },
  { id: 'wk-x', code: 'export_time', title: '导出时间', tbl: sw(true), imp: sw(false), exp: sw(true), ui: sw(false), tag: 'fixed', note: '' },
  { id: 'wk-i', code: 'import_time', title: '导入时间', tbl: sw(true), imp: sw(false), exp: sw(true), ui: sw(true), tag: 'fixed', note: '' },
  { id: 'wk-f', code: 'audit_feedback', title: '审核反馈', tbl: sw(true), imp: sw(false), exp: sw(true), ui: sw(true), tag: 'fixed', note: '' },
]

const ORDER_DEFAULT: Row[] = [
  { id: 'or-t', code: 'task_ID', title: '任务名称', frontTitle: '任务名称', tbl: sw(true), imp: sw(false), exp: sw(true), ui: sw(true), tag: 'config', note: '' },
  { id: 'or-n', code: 'order_ext_note', title: '订单备注', frontTitle: '订单备注', tbl: sw(true), imp: sw(true), exp: sw(false), ui: sw(true), tag: 'orderAdd', note: '自定义字段示例' },
  { id: 'or-d', code: 'order_date', title: '订单日期', frontTitle: '订单日期', tbl: sw(true), imp: sw(true), exp: sw(true), ui: sw(true), tag: 'fixed', note: '' },
  { id: 'or-v', code: 'is_virtual_order', title: '是否虚拟订单', frontTitle: '是否虚拟订单', tbl: sw(true), imp: sw(false), exp: sw(true), ui: sw(true), tag: 'fixed', note: '' },
  { id: 'or-m', code: 'member_profit', title: '会员收益', frontTitle: '会员收益', tbl: sw(true), imp: sw(false), exp: sw(true), ui: sw(true), tag: 'fixed', note: '' },
  { id: 'or-i', code: 'imported_by', title: '导入人员', frontTitle: '导入人员', tbl: sw(true), imp: sw(false), exp: sw(true), ui: sw(false), tag: 'fixed', note: '' },
  { id: 'or-a', code: 'audited_by', title: '审核人员', frontTitle: '审核人员', tbl: sw(true), imp: sw(false), exp: sw(true), ui: sw(true), tag: 'fixed', note: '' },
  { id: 'or-s', code: 'audit_status', title: '审核状态', frontTitle: '审核状态', tbl: sw(true), imp: sw(false), exp: sw(true), ui: sw(true), tag: 'fixed', note: '' },
  { id: 'or-it', code: 'import_time', title: '导入时间', frontTitle: '导入时间', tbl: sw(true), imp: sw(false), exp: sw(true), ui: sw(true), tag: 'fixed', note: '' },
  { id: 'or-at', code: 'audit_time', title: '审核时间', frontTitle: '审核时间', tbl: sw(true), imp: sw(false), exp: sw(true), ui: sw(true), tag: 'fixed', note: '' },
  { id: 'or-ps', code: 'payment_status', title: '打款状态', frontTitle: '打款状态', tbl: sw(true), imp: sw(false), exp: sw(true), ui: sw(true), tag: 'fixed', note: '' },
  { id: 'or-pt', code: 'payment_time', title: '打款时间', frontTitle: '打款时间', tbl: sw(true), imp: sw(false), exp: sw(true), ui: sw(true), tag: 'fixed', note: '' },
]

function cloneRows(r: Row[]): Row[] {
  return JSON.parse(JSON.stringify(r)) as Row[]
}

const kwRows = ref<Row[]>(cloneRows(KW_DEFAULT))
const workRows = ref<Row[]>(cloneRows(WORK_DEFAULT))
const orderRows = ref<Row[]>(cloneRows(ORDER_DEFAULT))

let snapKw = ''
let snapWork = ''
let snapOrder = ''

function serialize(rows: Row[]) {
  return JSON.stringify(rows)
}

const dirtyKeyword = computed(() => serialize(kwRows.value) !== snapKw)
const dirtyWorks = computed(() => serialize(workRows.value) !== snapWork)
const dirtyOrder = computed(() => serialize(orderRows.value) !== snapOrder)

onMounted(() => {
  snapKw = serialize(kwRows.value)
  snapWork = serialize(workRows.value)
  snapOrder = serialize(orderRows.value)
})

function savePanel(which: 'keyword' | 'works' | 'order') {
  if (which === 'keyword') snapKw = serialize(kwRows.value)
  else if (which === 'works') snapWork = serialize(workRows.value)
  else snapOrder = serialize(orderRows.value)
  const name = which === 'keyword' ? '关键词表' : which === 'works' ? '作品表' : '订单表'
  showToast(`${name} 已保存（原型：配置已提交）`)
}

const toastMsg = ref('')
let toastTimer: ReturnType<typeof setTimeout> | undefined
function showToast(msg: string) {
  toastMsg.value = msg
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastMsg.value = '' }, 2200)
}

const addModal = ref(false)
const addForm = ref({ code: '', title: '' })

function openAddModal() {
  addForm.value = { code: '', title: '' }
  addModal.value = true
}

function confirmAddOrderRow() {
  const code = addForm.value.code.trim()
  const title = addForm.value.title.trim()
  if (!code || !title) {
    // eslint-disable-next-line no-alert
    alert('请填写字典字段与字段标题')
    return
  }
  const id = `or-${Date.now()}`
  orderRows.value.splice(2, 0, {
    id,
    code,
    title,
    frontTitle: title,
    tbl: sw(true),
    imp: sw(false),
    exp: sw(true),
    ui: sw(true),
    tag: 'orderAdd',
    note: '用户自定义',
  })
  addModal.value = false
}
</script>

<style scoped>
.pdt-wrap { min-height: 100%; }
.bc-a { color: var(--text-secondary); text-decoration: none; }
.bc-a:hover { color: var(--primary); }

.pdt-page { max-width: 1280px; margin: 0 auto; }
.pdt-page-head {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.pdt-page-head-text {
  min-width: 0;
}
.pdt-page-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-primary);
}
.pdt-project-hint {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 0;
}

.pdt-card-shell {
  padding: 0;
  overflow: hidden;
  margin-top: 4px;
  border: 1px solid rgba(54, 110, 244, 0.16);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 6px 18px rgba(15, 23, 42, 0.06);
}
.pdt-tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid var(--border);
  padding: 0 16px;
  background: var(--bg-card);
}
.pdt-tab {
  padding: 14px 18px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  cursor: pointer;
  font-family: inherit;
  transition: color 0.15s, border-color 0.15s;
}
.pdt-tab:hover { color: var(--text-primary); }
.pdt-tab.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}

.pdt-panel { padding: 16px; }
.pdt-toolbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}
.pdt-toolbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.pdt-hint {
  font-size: 12px;
  color: var(--text-muted);
  max-width: 640px;
  margin: 0;
  line-height: 1.5;
}

.pdt-table-wrap {
  overflow-x: auto;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}
.pdt-config-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.pdt-config-table th,
.pdt-config-table td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
}
.pdt-config-table th {
  background: var(--bg-hover);
  color: var(--text-secondary);
  font-weight: 600;
  white-space: nowrap;
}
.pdt-config-table tbody tr:last-child td { border-bottom: none; }
.pdt-code {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
  color: var(--primary);
  background: rgba(54,110,244,0.12);
  padding: 2px 6px;
  border-radius: 4px;
}
[data-theme='dark'] .pdt-code {
  background: rgba(54,110,244,0.2);
}
.pdt-note {
  min-width: 180px;
  max-width: 300px;
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.45;
}
.pdt-front-title { min-width: 140px; max-width: 200px; }
.pdt-cell-input {
  width: 100%;
  min-width: 120px;
  height: 32px;
  padding: 0 8px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-family: inherit;
  background: var(--bg-card);
  color: var(--text-primary);
}
.pdt-cell-input:focus {
  outline: none;
  border-color: var(--primary);
}

.pdt-form-row {
  margin-bottom: 14px;
}
.pdt-form-row label {
  display: block;
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 6px;
}
.pdt-form-hint {
  font-size: 12px;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.5;
}

.pdt-modal { width: 100%; max-width: 440px; }

.pdt-toast {
  position: fixed;
  left: 50%;
  bottom: 72px;
  transform: translateX(-50%) translateY(12px);
  padding: 10px 20px;
  background: rgba(29, 33, 41, 0.92);
  color: #fff;
  font-size: 13px;
  border-radius: var(--radius-sm);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s, transform 0.2s;
  z-index: 500;
  max-width: 90vw;
}
.pdt-toast.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
</style>
