<template>
  <div class="kce-root">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">首页</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">品牌项目</span>
      <span class="bc-sep">/</span>
      <router-link to="/project/config" class="bc-link">项目配置</router-link>
      <span class="bc-sep">/</span>
      <span class="bc-cur">{{ pageTitle }}</span>
    </div>

    <div class="page-content kce-page">
      <header class="kce-topbar">
        <div class="kce-topbar-inner">
          <div class="kce-topbar-left">
            <button type="button" class="btn btn-default btn-sm" @click="goProjectList">返回项目列表</button>
            <span class="kce-topbar-page-title">{{ pageTitle }}</span>
          </div>
          <div class="kce-topbar-right">
            <button type="button" class="btn btn-ghost kce-icon-btn" title="切换主题" aria-label="切换主题" @click="themeStore.toggle()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            </button>
            <button type="button" class="btn btn-default btn-sm" @click="toast('已保存草稿', 'info')">保存草稿</button>
            <button type="button" class="btn btn-primary btn-sm" @click="toast('配置发布成功', 'success')">
              发布配置
            </button>
          </div>
        </div>
      </header>
      <p class="kce-project-hint">项目：<strong>{{ projectLabel }}</strong></p>

      <div class="kce-editor-shell">
        <div class="kce-editor-layout">
          <!-- 左栏 -->
          <aside class="kce-left-panel">
            <div class="kce-lp-search">
              <input v-model="paletteSearch" class="kce-lp-search-input" placeholder="搜索组件与字段">
            </div>
            <div class="kce-lp-body">
              <div class="kce-lp-card">
                <div class="kce-lp-card-hd">基础组件</div>
                <div class="kce-lp-card-bd">
                  <div
                    v-for="c in baseCompList"
                    v-show="paletteMatch(c.label)"
                    :key="c.comp"
                    class="kce-lp-item"
                    draggable="true"
                    @click="addFromLeft(c.comp, '', '')"
                    @dragstart="onItemDragStart($event, 'comp', c.comp)"
                  >
                    <div class="kce-lp-item-icon" v-html="c.icon" />
                    <span class="kce-lp-item-label">{{ c.label }}</span>
                  </div>
                </div>
              </div>
              <div class="kce-lp-card">
                <div class="kce-lp-card-hd">{{ dictCardTitle }}</div>
                <div class="kce-lp-card-bd">
                  <div
                    v-for="f in dictFieldList"
                    v-show="paletteMatch(f.label, f.key)"
                    :key="f.key"
                    class="kce-lp-field-item"
                    draggable="true"
                    @click="addFromLeft(f.defComp, f.key, f.label)"
                    @dragstart="onItemDragStart($event, 'field', f.key, f.defComp, f.label)"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                    <span class="kce-lp-field-name">{{ f.label }}</span>
                    <span class="kce-lp-field-key">{{ f.key }}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <!-- 画布 -->
          <div
            class="kce-canvas-wrap"
            @click.self="handleBgClick"
            @dragover.prevent="onCanvasDragOver"
            @drop.prevent="onCanvasDrop"
            @dragleave="onCanvasDragLeave"
          >
            <div id="kce-canvas" class="kce-canvas" @click.self="handleBgClick">
              <div class="kce-form-header-card">
                <input v-model="formTitle" class="kce-form-header-title" type="text" placeholder="请输入问卷标题">
                <textarea v-model="formDesc" class="kce-form-header-desc" rows="2" placeholder="请输入说明（选填）" />
              </div>

              <div
                v-for="(q, idx) in questions"
                :key="q.id"
                class="kce-question-wrap"
                :class="{
                  'kce-is-dragging': dragQReorderId === q.id,
                  'kce-drop-before': dropIntentTarget === q.id && dropIntentBefore,
                  'kce-drop-after': dropIntentTarget === q.id && !dropIntentBefore,
                }"
                :data-id="q.id"
                @dragover="onReorderDragOver($event, q.id)"
                @drop="onReorderDrop($event, q.id)"
              >
                <div
                  class="kce-row-drag-handle"
                  draggable="true"
                  title="拖动调整顺序"
                  @dragstart="onQReorderStart($event, q.id)"
                  @click.stop
                >
                  <svg width="10" height="14" viewBox="0 0 10 18" fill="none"><circle cx="3" cy="3" r="1.4" fill="currentColor"/><circle cx="7" cy="3" r="1.4" fill="currentColor"/><circle cx="3" cy="9" r="1.4" fill="currentColor"/><circle cx="7" cy="9" r="1.4" fill="currentColor"/><circle cx="3" cy="15" r="1.4" fill="currentColor"/><circle cx="7" cy="15" r="1.4" fill="currentColor"/></svg>
                </div>
                <div
                  class="kce-question-card"
                  :class="{ active: activeId === q.id }"
                  @click="activateCard(q.id)"
                >
                  <div class="kce-q-toolbar">
                    <label class="kce-toolbar-req">
                      <input type="checkbox" :checked="q.required" @change="setRequired(q.id, ($event.target as HTMLInputElement).checked)" @click.stop> 必填
                    </label>
                    <div class="kce-toolbar-sep" />
                    <button type="button" class="ul-icon-btn" title="复制" @click.stop="dupCard(q.id)">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                    </button>
                    <button type="button" class="ul-icon-btn danger" title="删除" @click.stop="delCard(q.id)">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/></svg>
                    </button>
                  </div>
                  <div class="kce-q-number">
                    <span>Q{{ idx + 1 }}</span>
                    <span v-if="q.required" class="kce-q-dot" />
                  </div>
                  <input v-model="q.title" class="kce-q-title-input" type="text" placeholder="题目标题" @click.stop>
                  <div
                    class="kce-q-field-drop"
                    :class="{ 'has-field': !!q.fieldKey, 'drag-over': fieldDropOverId === q.id }"
                    @dragover.prevent.stop="onFieldDropOver($event, q.id)"
                    @dragleave="onFieldDropLeave($event, q.id)"
                    @drop.prevent.stop="onFieldDrop($event, q.id)"
                    @click.stop
                  >
                    <template v-if="q.fieldKey">
                      <span>已绑定</span><span>{{ q.fieldLabel }}</span><span class="kce-fd-tag">{{ q.fieldKey }}</span>
                    </template>
                    <template v-else>
                      <span>将左侧字典字段拖到此绑定</span>
                    </template>
                  </div>
                  <textarea v-model="q.desc" class="kce-q-desc-input" rows="2" placeholder="题目说明（选填）" @click.stop />

                  <div @click.stop>
                    <template v-if="isChoiceComp(q.comp)">
                      <div class="kce-choice-block">
                        <div class="kce-style-inline">
                          <span class="kce-sec-label">选项样式</span>
                          <div class="kce-style-chips">
                            <button v-for="s in styleOpts" :key="s.v" type="button" class="kce-style-chip" :class="{ sel: q.style === s.v }" @click="setStyle(q.id, s.v)">{{ s.t }}</button>
                          </div>
                        </div>
                        <template v-if="q.style === 'dropdown'">
                          <div class="kce-preview-select">请选择… <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></div>
                          <div class="kce-preview-dropdown-editor">
                            <div class="kce-sec-label">下拉选项</div>
                            <div v-if="!q.options?.length" class="kce-opt-empty">暂无选项，点击下方添加</div>
                            <div v-for="(o, oi) in q.options" :key="oi" class="kce-preview-option">
                              <div class="kce-opt-circle" />
                              <input v-model="q.options[oi]" type="text" class="kce-preview-opt-input" placeholder="选项内容（提交值）" @click.stop>
                              <button type="button" class="ul-icon-btn danger" title="删除" @click.stop="removeOpt(q.id, oi)">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                              </button>
                            </div>
                          </div>
                        </template>
                        <template v-else>
                          <div class="kce-preview-options" :class="{ horiz: q.style === 'horizontal' }">
                            <div v-if="!q.options?.length" class="kce-opt-empty">暂无选项，点击下方添加</div>
                            <div v-for="(o, oi) in q.options" :key="oi" class="kce-preview-option">
                              <div :class="q.comp === 'radio' ? 'kce-opt-circle' : 'kce-opt-square'" />
                              <input v-model="q.options[oi]" type="text" class="kce-preview-opt-input" placeholder="选项内容（提交值）" @click.stop>
                              <button type="button" class="ul-icon-btn danger" @click.stop="removeOpt(q.id, oi)">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                              </button>
                            </div>
                          </div>
                        </template>
                        <button type="button" class="kce-add-opt-btn" @click="addOpt(q.id)">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                          添加选项
                        </button>
                      </div>
                    </template>
                    <template v-else>
                      <PreviewNonChoice :comp="q.comp" />
                    </template>

                    <div v-if="['text','textarea','number'].includes(q.comp)" class="kce-limit-row">
                      <span class="kce-sec-label" style="margin:0">长度限制</span>
                      <input v-model="q.min" class="kce-limit-input" type="number" placeholder="最少" min="0" @click.stop>
                      <span class="kce-muted-dash">—</span>
                      <input v-model="q.max" class="kce-limit-input" type="number" placeholder="最多" min="0" @click.stop>
                      <span class="kce-muted-unit">{{ q.comp === 'number' ? '范围' : '字' }}</span>
                    </div>
                  </div>

                  <hr class="kce-q-sep">

                  <div class="kce-logic-area">
                    <template v-if="!q.showLogic">
                      <button type="button" class="kce-toggle-logic-btn" @click.stop="toggleLogic(q.id)">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        添加显示逻辑
                      </button>
                    </template>
                    <template v-else>
                      <div class="kce-sec-label">显示逻辑</div>
                      <div class="kce-logic-panel">
                        <div class="kce-logic-panel-hd">当关联题为单选/复选时，比较符作用于用户提交的选项值；请选择下方选项或填写比较值。</div>
                        <div v-for="(r, ri) in q.logicRows" :key="ri" class="kce-logic-row">
                          <span class="kce-logic-tag" :class="ri === 0 ? 'w' : 'a'">{{ ri === 0 ? '当' : '且' }}</span>
                          <select class="kce-logic-sel" style="flex:1;min-width:88px" :value="r.qRef" @change="setLogicQ(q.id, Number(ri), ($event.target as HTMLSelectElement).value)" @click.stop>
                            <option value="">选择题目</option>
                            <option v-for="qq in otherQuestions(q.id)" :key="qq.id" :value="qq.id">{{ qq.title || '（未命名题）' }}</option>
                          </select>
                          <select class="kce-logic-sel" :value="r.op" @change="setLogicOp(q.id, ri, ($event.target as HTMLSelectElement).value)" @click.stop>
                            <option v-for="op in logicOperatorsFor(refQ(r.qRef))" :key="op" :value="op">{{ op }}</option>
                          </select>
                          <template v-if="logicNeedsValue(r.op)">
                            <select v-if="refChoiceOptions(r.qRef).length" class="kce-logic-sel kce-logic-val" style="flex:1;min-width:110px" :value="r.val" @change="setLogicVal(q.id, ri, ($event.target as HTMLSelectElement).value)" @click.stop>
                              <option value="">选项值</option>
                              <option v-for="opt in refChoiceOptions(r.qRef)" :key="opt" :value="opt">{{ opt }}</option>
                            </select>
                            <input v-else v-model="r.val" class="kce-logic-val" placeholder="比较值" @input="setLogicVal(q.id, ri, r.val)" @click.stop>
                          </template>
                          <span v-else class="kce-logic-dash">—</span>
                          <button type="button" class="ul-icon-btn danger" title="删除条件" @click.stop="removeLogicRow(q.id, ri)">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                          </button>
                        </div>
                        <button type="button" class="kce-add-logic-btn" @click.stop="addLogicRow(q.id)">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                          添加条件
                        </button>
                      </div>
                      <button type="button" class="kce-toggle-logic-btn" style="margin-top:6px" @click.stop="toggleLogic(q.id)">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        移除逻辑
                      </button>
                    </template>
                  </div>
                </div>
              </div>

              <div
                v-show="questions.length === 0"
                class="kce-canvas-drop-hint"
                :class="{ 'drag-over': canvasHintOver }"
              >
                <div>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                </div>
                从左侧拖拽组件或字段到此处，或点击直接添加
              </div>

              <div v-show="questions.length > 0" class="kce-add-q-zone">
                <button type="button" class="kce-add-q-btn" @click="addFromLeft('text','','')">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  添加题目
                </button>
              </div>
            </div>
          </div>

          <!-- 右栏 -->
          <aside class="kce-right-panel">
            <div v-show="!activeQ" class="kce-rp-empty">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              <p>点击题目卡片<br>查看字段属性</p>
            </div>
            <div v-show="activeQ" class="kce-rp-content">
              <div class="kce-rp-section-title">字段属性</div>
              <div class="kce-rp-row">
                <div class="kce-rp-label">绑定字段</div>
                <select v-model="rpFieldProxy" class="kce-rp-select">
                  <option value="">-- 不绑定 --</option>
                  <option v-for="opt in fieldSelectOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                </select>
              </div>
              <div class="kce-rp-row">
                <div class="kce-rp-label">组件类型</div>
                <select v-model="rpCompProxy" class="kce-rp-select">
                  <option v-for="(lab, k) in COMP_LABELS" :key="k" :value="k">{{ lab }}</option>
                </select>
              </div>
              <div class="kce-rp-section-title">填写规则</div>
              <div class="kce-rp-toggle-row">
                <span class="kce-rp-toggle-text">设为必填</span>
                <label class="kce-toggle-sw">
                  <input v-model="rpRequiredProxy" type="checkbox">
                  <div class="kce-toggle-sl" />
                </label>
              </div>
              <div class="kce-rp-limit">
                <div class="kce-rp-section-title">长度限制</div>
                <div class="kce-rp-limit-inner">
                  <input v-model="rpMinProxy" class="kce-limit-input" type="number" placeholder="最少" min="0">
                  <span class="kce-muted-dash">—</span>
                  <input v-model="rpMaxProxy" class="kce-limit-input" type="number" placeholder="最多" min="0">
                </div>
                <div class="kce-rp-limit-hint">文本 / 数字组件生效</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>

    <div class="kce-toast-ct">
      <div v-for="t in toasts" :key="t.id" class="kce-toast" :class="[t.type, { out: t.out }]">{{ t.msg }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProjectConfigStore } from '@/stores/projectConfig'
import { useThemeStore } from '@/stores/theme'
import PreviewNonChoice from './QuestionnairePreviewNonChoice.vue'

const props = defineProps<{
  variant: 'keyword' | 'backfill'
}>()

const route = useRoute()
const router = useRouter()

function goProjectList() {
  router.push({ name: 'ProjectConfig' })
}

const projectId = computed(() => String(route.params.projectId))

const themeStore = useThemeStore()
const store = useProjectConfigStore()
const { rows } = storeToRefs(store)

const projectLabel = computed(() => {
  const r = rows.value.find((x) => x.id === Number(projectId.value))
  return r ? `${r.frontTitle}（id=${r.id}）` : `id=${projectId.value}`
})

const isKeyword = computed(() => props.variant === 'keyword')
const pageTitle = computed(() => (isKeyword.value ? '关键词配置' : '回填配置'))
const dictCardTitle = computed(() => (isKeyword.value ? '字典字段（关键词类）' : '字典字段（回填类）'))

type CompType = 'text' | 'textarea' | 'number' | 'radio' | 'checkbox' | 'date' | 'image' | 'video' | 'url'
interface LogicRow { qRef: string; op: string; val: string }
interface Question {
  id: string
  comp: CompType
  fieldKey: string
  fieldLabel: string
  title: string
  desc: string
  required: boolean
  style: 'vertical' | 'horizontal' | 'dropdown'
  options: string[]
  logicRows: LogicRow[]
  showLogic: boolean
  min: string
  max: string
}

const COMP_LABELS: Record<CompType, string> = {
  text: '单行文本',
  textarea: '多行文本',
  number: '数值',
  radio: '单选',
  checkbox: '复选',
  date: '日期',
  image: '图片',
  video: '视频',
  url: 'URL',
}

const KW_FIELDS_MAP: Record<string, { label: string; key: string; defComp: CompType }> = {
  keyword: { label: '关键词', key: 'keyword', defComp: 'text' },
  task_id: { label: '任务ID', key: 'task_id', defComp: 'number' },
  task_name: { label: '任务名称', key: 'task_name', defComp: 'text' },
  platform_id: { label: '媒体账号', key: 'platform_id', defComp: 'radio' },
  content_url: { label: '内容链接', key: 'content_url', defComp: 'url' },
  post_time: { label: '发布时间', key: 'post_time', defComp: 'date' },
  screenshot: { label: '内容截图', key: 'screenshot', defComp: 'image' },
}

const BF_FIELDS_MAP: Record<string, { label: string; key: string; defComp: CompType }> = {
  order_sn: { label: '订单号', key: 'order_sn', defComp: 'text' },
  backfill_amount: { label: '回填金额', key: 'backfill_amount', defComp: 'number' },
  proof_image: { label: '凭证截图', key: 'proof_image', defComp: 'image' },
  remark: { label: '备注说明', key: 'remark', defComp: 'textarea' },
  platform_id: { label: '媒体账号', key: 'platform_id', defComp: 'radio' },
  task_id: { label: '任务ID', key: 'task_id', defComp: 'number' },
}

const FIELDS_MAP = computed(() => (isKeyword.value ? KW_FIELDS_MAP : BF_FIELDS_MAP))

const dictFieldList = computed(() => Object.values(FIELDS_MAP.value))

const baseCompList: { comp: CompType; label: string; icon: string }[] = [
  { comp: 'text', label: '单行文本', icon: '<svg class="kce-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><line x1="7" y1="9" x2="17" y2="9"/><line x1="7" y1="13" x2="13" y2="13"/></svg>' },
  { comp: 'textarea', label: '多行文本', icon: '<svg class="kce-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="13" y2="16"/></svg>' },
  { comp: 'number', label: '数值', icon: '<svg class="kce-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>' },
  { comp: 'radio', label: '单选', icon: '<svg class="kce-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>' },
  { comp: 'checkbox', label: '复选', icon: '<svg class="kce-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>' },
  { comp: 'date', label: '日期', icon: '<svg class="kce-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' },
  { comp: 'image', label: '图片上传', icon: '<svg class="kce-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>' },
  { comp: 'video', label: '视频上传', icon: '<svg class="kce-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>' },
  { comp: 'url', label: 'URL', icon: '<svg class="kce-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>' },
]

const styleOpts = [
  { v: 'vertical' as const, t: '纵向' },
  { v: 'horizontal' as const, t: '横向' },
  { v: 'dropdown' as const, t: '下拉' },
]

const paletteSearch = ref('')
function paletteMatch(label: string, key = '') {
  const q = paletteSearch.value.trim().toLowerCase()
  if (!q) return true
  return label.toLowerCase().includes(q) || key.toLowerCase().includes(q)
}

const questions = ref<Question[]>([])
let qCounter = 0

function isChoiceComp(c: CompType) {
  return c === 'radio' || c === 'checkbox'
}

function newQuestion(comp: CompType, fieldKey: string, fieldLabel: string): Question {
  qCounter++
  const id = `q${qCounter}`
  return {
    id,
    comp,
    fieldKey: fieldKey || '',
    fieldLabel: fieldLabel || '',
    title: fieldLabel ? `请填写${fieldLabel}` : '',
    desc: '',
    required: false,
    style: 'vertical',
    options: isChoiceComp(comp) ? ['选项 A', '选项 B', '选项 C'] : [],
    logicRows: [],
    showLogic: false,
    min: '',
    max: '',
  }
}

function initDemo() {
  questions.value = []
  qCounter = 0
  if (isKeyword.value) {
    qCounter++
    questions.value.push({
      id: `q${qCounter}`, comp: 'text', fieldKey: 'keyword', fieldLabel: '关键词',
      title: '请输入本次投稿的关键词',
      desc: '填写本次任务所分配的核心关键词，多个用英文逗号分隔',
      required: true, style: 'vertical', options: [], logicRows: [], showLogic: false, min: '', max: '',
    })
    qCounter++
    questions.value.push({
      id: `q${qCounter}`, comp: 'radio', fieldKey: 'platform_id', fieldLabel: '媒体账号',
      title: '选择投稿所用媒体账号',
      desc: '请选择您发布内容所用的平台账号',
      required: true, style: 'vertical',
      options: ['抖音-@用户名A', '小红书-@用户名B', 'B站-@用户名C'],
      logicRows: [], showLogic: false, min: '', max: '',
    })
    qCounter++
    questions.value.push({
      id: `q${qCounter}`, comp: 'image', fieldKey: 'screenshot', fieldLabel: '内容截图',
      title: '上传内容截图',
      desc: '请上传发布内容的截图，支持 JPG/PNG，最多 5 张',
      required: false, style: 'vertical', options: [], logicRows: [], showLogic: false, min: '', max: '',
    })
    qCounter++
    questions.value.push({
      id: `q${qCounter}`, comp: 'url', fieldKey: 'content_url', fieldLabel: '内容链接',
      title: '内容发布链接',
      desc: '请填写发布内容的页面链接，以 https:// 开头',
      required: true, style: 'vertical', options: [], logicRows: [], showLogic: false, min: '', max: '',
    })
  } else {
    qCounter++
    questions.value.push({
      id: `q${qCounter}`, comp: 'text', fieldKey: 'order_sn', fieldLabel: '订单号',
      title: '请填写订单号', desc: '', required: true, style: 'vertical', options: [], logicRows: [], showLogic: false, min: '', max: '',
    })
    qCounter++
    questions.value.push({
      id: `q${qCounter}`, comp: 'image', fieldKey: 'proof_image', fieldLabel: '凭证截图',
      title: '上传凭证截图', desc: '', required: true, style: 'vertical', options: [], logicRows: [], showLogic: false, min: '', max: '',
    })
  }
}

watch(
  () => props.variant,
  () => initDemo(),
  { immediate: true },
)

const formTitle = ref('关键词配置')
const formDesc = ref('请按要求填写本次任务的关键词及相关信息，带 * 号为必填项。')

watch(pageTitle, () => {
  if (isKeyword.value) {
    formTitle.value = '关键词配置'
    formDesc.value = '请按要求填写本次任务的关键词及相关信息，带 * 号为必填项。'
  } else {
    formTitle.value = '回填配置'
    formDesc.value = '请按要求完成订单回填信息，带 * 号为必填项。'
  }
}, { immediate: true })

function addFromLeft(comp: CompType, fieldKey: string, fieldLabel: string) {
  const q = newQuestion(comp, fieldKey, fieldLabel)
  questions.value.push(q)
  activateCard(q.id)
}

let dragType: 'comp' | 'field' | null = null
let dragComp = ''
let dragField = ''
let dragFieldLabel = ''
const canvasHintOver = ref(false)
const fieldDropOverId = ref<string | null>(null)

function onItemDragStart(e: DragEvent, type: 'comp' | 'field', compOrKey: string, fieldComp?: CompType, fieldLabel?: string) {
  dragType = type
  if (type === 'comp') {
    dragComp = compOrKey as CompType
    dragField = ''
    dragFieldLabel = ''
    e.dataTransfer!.effectAllowed = 'copy'
    e.dataTransfer!.setData('application/x-keyword-comp', compOrKey)
  } else {
    dragComp = (fieldComp || 'text') as CompType
    dragField = compOrKey
    dragFieldLabel = fieldLabel || ''
    const payload = JSON.stringify({ key: compOrKey, label: fieldLabel || '', comp: fieldComp || 'text' })
    e.dataTransfer!.effectAllowed = 'copy'
    e.dataTransfer!.setData('application/x-keyword-field', payload)
    e.dataTransfer!.setData('text/plain', fieldLabel || compOrKey)
  }
}

function dtHasKeywordField(types: DOMStringList | readonly string[]) {
  return Array.from(types as unknown as string[]).includes('application/x-keyword-field')
}

function onFieldDropOver(e: DragEvent, qId: string) {
  if (!e.dataTransfer || !dtHasKeywordField(e.dataTransfer.types)) return
  e.preventDefault()
  e.stopPropagation()
  e.dataTransfer.dropEffect = 'copy'
  fieldDropOverId.value = qId
}

function onFieldDropLeave(e: MouseEvent, qid: string) {
  const el = e.currentTarget as HTMLElement
  const rel = e.relatedTarget as Node | null
  if (rel && el.contains(rel)) return
  el.classList.remove('drag-over')
  if (fieldDropOverId.value === qid) fieldDropOverId.value = null
}

function applyFieldToQuestion(qId: string, payload: { key: string; label?: string; comp?: string }) {
  const q = questions.value.find((x) => x.id === qId)
  if (!q || !payload.key) return
  const fm = FIELDS_MAP.value[payload.key]
  q.fieldKey = payload.key
  q.fieldLabel = (payload.label || fm?.label || payload.key).trim()
  const newComp = (payload.comp || fm?.defComp || 'text') as CompType
  q.comp = newComp
  if (isChoiceComp(q.comp)) {
    if (!q.options?.length) q.options = ['选项 A', '选项 B', '选项 C']
  } else {
    q.options = []
  }
  const t = (q.title || '').trim()
  if (!t) q.title = q.fieldLabel ? `请填写${q.fieldLabel}` : ''
  toast(`已绑定字段：${q.fieldLabel}`, 'success')
}

function onFieldDrop(e: DragEvent, qId: string) {
  fieldDropOverId.value = null
  ;(e.currentTarget as HTMLElement).classList.remove('drag-over')
  let raw = ''
  try {
    raw = e.dataTransfer?.getData('application/x-keyword-field') || ''
  } catch { /* empty */ }
  if (!raw) return
  try {
    applyFieldToQuestion(qId, JSON.parse(raw))
  } catch { /* empty */ }
}

let dragQReorderId: string | null = null
const dropIntentTarget = ref<string | null>(null)
const dropIntentBefore = ref(true)

function onCanvasDragOver(e: DragEvent) {
  if (dragQReorderId) {
    e.preventDefault()
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
    return
  }
  e.preventDefault()
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy'
  canvasHintOver.value = true
}

function onCanvasDragLeave(e: DragEvent) {
  const canvas = document.getElementById('kce-canvas')
  if (canvas && !canvas.contains(e.relatedTarget as Node)) {
    canvasHintOver.value = false
  }
}

function onCanvasDrop() {
  canvasHintOver.value = false
  if (dragQReorderId) return
  if (dragComp || dragField) {
    addFromLeft((dragComp || 'text') as CompType, dragField, dragFieldLabel)
    dragType = null
    dragComp = ''
    dragField = ''
    dragFieldLabel = ''
  }
}

function onQReorderStart(e: DragEvent, qid: string) {
  e.stopPropagation()
  dragQReorderId = qid
  dragType = null
  dragComp = ''
  dragField = ''
  dragFieldLabel = ''
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', qid)
  }
}

function onReorderDragOver(e: DragEvent, qid: string) {
  if (!dragQReorderId || dragQReorderId === qid) return
  e.preventDefault()
  const wrap = e.currentTarget as HTMLElement
  const rect = wrap.getBoundingClientRect()
  dropIntentBefore.value = e.clientY < rect.top + rect.height / 2
  dropIntentTarget.value = qid
}

function onReorderDrop(e: DragEvent, qid: string) {
  if (!dragQReorderId || dragQReorderId === qid) return
  e.preventDefault()
  e.stopPropagation()
  moveQuestion(dragQReorderId, qid, dropIntentBefore.value)
  dropIntentTarget.value = null
}

function moveQuestion(fromId: string, toId: string, insertBefore: boolean) {
  const fi = questions.value.findIndex((q) => q.id === fromId)
  const ti = questions.value.findIndex((q) => q.id === toId)
  if (fi < 0 || ti < 0) return
  const [moved] = questions.value.splice(fi, 1)
  let insert = questions.value.findIndex((q) => q.id === toId)
  if (!insertBefore) insert += 1
  questions.value.splice(insert, 0, moved)
  activateCard(fromId)
}

function clearDragState() {
  document.querySelectorAll('.kce-q-field-drop.drag-over').forEach((el) => el.classList.remove('drag-over'))
  dropIntentTarget.value = null
  dragQReorderId = null
  fieldDropOverId.value = null
}

onMounted(() => {
  document.addEventListener('dragend', clearDragState)
})
onUnmounted(() => {
  document.removeEventListener('dragend', clearDragState)
})

const activeId = ref<string | null>(null)
const activeQ = computed(() => questions.value.find((q) => q.id === activeId.value))

function activateCard(id: string | null) {
  activeId.value = id
}

function handleBgClick() {
  activeId.value = null
}

function delCard(id: string) {
  questions.value = questions.value.filter((q) => q.id !== id)
  if (activeId.value === id) activeId.value = null
  toast('题目已删除', 'info')
}

function dupCard(id: string) {
  const idx = questions.value.findIndex((q) => q.id === id)
  if (idx < 0) return
  qCounter++
  const src = questions.value[idx]
  const copy = JSON.parse(JSON.stringify(src)) as Question
  copy.id = `q${qCounter}`
  questions.value.splice(idx + 1, 0, copy)
  toast('题目已复制', 'success')
}

function setRequired(id: string, val: boolean) {
  const q = questions.value.find((x) => x.id === id)
  if (q) q.required = val
}

function setStyle(id: string, style: Question['style']) {
  const q = questions.value.find((x) => x.id === id)
  if (q) q.style = style
}

function addOpt(id: string) {
  const q = questions.value.find((x) => x.id === id)
  if (!q) return
  const n = q.options.length
  q.options.push(`选项 ${String.fromCharCode(65 + n)}`)
}

function removeOpt(id: string, idx: number) {
  const q = questions.value.find((x) => x.id === id)
  if (!q) return
  q.options.splice(idx, 1)
}

function logicOperatorsFor(_refQ: Question | undefined) {
  return ['等于', '不等于', '包含', '不包含', '为空', '不为空']
}

function logicNeedsValue(op: string) {
  return op !== '为空' && op !== '不为空'
}

function refQ(qRef: string) {
  return questions.value.find((x) => x.id === qRef)
}

function refChoiceOptions(qRef: string): string[] {
  const qq = refQ(qRef)
  if (qq && isChoiceComp(qq.comp) && qq.options?.length) return qq.options
  return []
}

function otherQuestions(id: string) {
  return questions.value.filter((q) => q.id !== id)
}

function toggleLogic(id: string) {
  const q = questions.value.find((x) => x.id === id)
  if (!q) return
  q.showLogic = !q.showLogic
  if (q.showLogic && !q.logicRows.length) q.logicRows.push({ qRef: '', op: '等于', val: '' })
  if (!q.showLogic) q.logicRows = []
}

function addLogicRow(id: string) {
  const q = questions.value.find((x) => x.id === id)
  if (!q) return
  q.logicRows.push({ qRef: '', op: '等于', val: '' })
}

function removeLogicRow(id: string, idx: number) {
  const q = questions.value.find((x) => x.id === id)
  if (!q) return
  q.logicRows.splice(idx, 1)
  if (!q.logicRows.length) q.showLogic = false
}

function setLogicOp(id: string, idx: number, val: string) {
  const q = questions.value.find((x) => x.id === id)
  if (!q?.logicRows[idx]) return
  q.logicRows[idx].op = val
  if (!logicNeedsValue(val)) q.logicRows[idx].val = ''
}

function setLogicQ(id: string, idx: number, val: string) {
  const q = questions.value.find((x) => x.id === id)
  if (!q?.logicRows[idx]) return
  q.logicRows[idx].qRef = val
  q.logicRows[idx].val = ''
}

function setLogicVal(id: string, idx: number, val: string) {
  const q = questions.value.find((x) => x.id === id)
  if (q?.logicRows[idx]) q.logicRows[idx].val = val
}

const fieldSelectOptions = computed(() =>
  Object.entries(FIELDS_MAP.value).map(([value, x]) => ({
    value,
    label: `${x.label} (${value})`,
  })),
)

const rpFieldProxy = computed({
  get: () => activeQ.value?.fieldKey || '',
  set: (v: string) => {
    const q = activeQ.value
    if (!q) return
    q.fieldKey = v
    q.fieldLabel = v ? FIELDS_MAP.value[v]?.label || '' : ''
    if (v) {
      const fm = FIELDS_MAP.value[v]
      if (fm) q.comp = fm.defComp
      if (isChoiceComp(q.comp) && !q.options.length) q.options = ['选项 A', '选项 B', '选项 C']
      if (!isChoiceComp(q.comp)) q.options = []
    }
  },
})

const rpCompProxy = computed({
  get: () => activeQ.value?.comp || 'text',
  set: (v: CompType) => {
    const q = activeQ.value
    if (!q) return
    q.comp = v
    if (!isChoiceComp(v)) q.options = []
    else if (!q.options.length) q.options = ['选项 A', '选项 B', '选项 C']
  },
})

const rpRequiredProxy = computed({
  get: () => !!activeQ.value?.required,
  set: (v: boolean) => {
    const q = activeQ.value
    if (q) q.required = v
  },
})

const rpMinProxy = computed({
  get: () => activeQ.value?.min || '',
  set: (v: string) => {
    const q = activeQ.value
    if (q) q.min = v
  },
})

const rpMaxProxy = computed({
  get: () => activeQ.value?.max || '',
  set: (v: string) => {
    const q = activeQ.value
    if (q) q.max = v
  },
})

interface ToastItem { id: number; msg: string; type: 'success' | 'info' | 'error'; out?: boolean }
const toasts = ref<ToastItem[]>([])
let toastId = 0
function toast(msg: string, type: 'success' | 'info' | 'error' = 'info') {
  const id = ++toastId
  toasts.value.push({ id, msg, type })
  setTimeout(() => {
    const t = toasts.value.find((x) => x.id === id)
    if (t) t.out = true
  }, 2200)
  setTimeout(() => {
    toasts.value = toasts.value.filter((x) => x.id !== id)
  }, 2420)
}
</script>

<style scoped>
.kce-root { min-height: 100%; }
.bc-link { color: var(--text-secondary); text-decoration: none; }
.bc-link:hover { color: var(--primary); }

.kce-page {
  padding-top: 0 !important;
  gap: 0 !important;
}
.kce-project-hint {
  font-size: 12px;
  color: var(--text-muted);
  margin: 0 0 12px;
  padding: 0 clamp(8px, 3.2vw, 48px);
  max-width: min(1560px, 100%);
  margin-left: auto;
  margin-right: auto;
}

/* ---- topbar（与结算配置顶栏一致） ---- */
.kce-topbar {
  position: sticky;
  top: 0;
  z-index: 50;
  height: 52px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  margin: 0 -4px 0 0;
}
.kce-topbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  max-width: min(1560px, 100%);
  height: 100%;
  margin: 0 auto;
  padding: 0 clamp(8px, 3.2vw, 48px);
  box-sizing: border-box;
}
.kce-topbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.kce-topbar-page-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}
.kce-topbar-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.kce-icon-btn { width: 28px; height: 28px; padding: 0 !important; min-height: 28px; }

/* ---- shell ---- */
.kce-editor-shell {
  width: 100%;
  box-sizing: border-box;
  padding: 0 clamp(8px, 3.2vw, 48px);
  overflow-x: auto;
  overflow-y: hidden;
  min-height: calc(100vh - 180px);
}
.kce-editor-layout {
  display: flex;
  align-items: stretch;
  width: 100%;
  max-width: min(1560px, 100%);
  min-height: calc(100vh - 200px);
  margin: 0 auto;
  box-sizing: border-box;
}

/* left */
.kce-left-panel {
  width: 428px;
  min-width: 428px;
  flex-shrink: 0;
  background: var(--bg-hover);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.kce-lp-search { padding: 8px 10px 6px; flex-shrink: 0; }
.kce-lp-search-input {
  width: 100%;
  height: 30px;
  padding: 0 9px 0 30px;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 12px;
  background: var(--bg-hover);
  color: var(--text-primary);
  outline: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23c9cdd4' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: 8px center;
}
.kce-lp-search-input:focus {
  border-color: var(--primary);
  background-color: var(--bg-card);
}
.kce-lp-body {
  flex: 1;
  overflow-y: auto;
  padding: 0 6px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
}
.kce-lp-card {
  background: var(--bg-card);
  border: 1px solid rgba(54, 110, 244, 0.22);
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 14px rgba(15, 23, 42, 0.06);
}
.kce-lp-card-hd {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  padding: 9px 10px;
  border-bottom: 1px solid var(--border);
  background: linear-gradient(180deg, rgba(54,110,244,0.04), transparent);
}
.kce-lp-card-bd {
  padding: 8px;
  display: grid;
  grid-template-columns: repeat(2, minmax(196px, 1fr));
  gap: 6px;
}
.kce-lp-item, .kce-lp-field-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
  color: var(--text-secondary);
  cursor: grab;
  border: 1px solid var(--border);
  background: var(--bg-hover);
  transition: all 0.14s;
  user-select: none;
  box-sizing: border-box;
  min-width: 0;
}
.kce-lp-item:hover, .kce-lp-field-item:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: rgba(54,110,244,0.08);
  box-shadow: var(--shadow-sm);
}
.kce-lp-item-icon :deep(.kce-svg) { width: 16px; height: 16px; flex-shrink: 0; color: var(--text-muted); }
.kce-lp-item:hover .kce-lp-item-icon :deep(.kce-svg) { color: var(--primary); }
.kce-lp-item-label { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.kce-lp-field-name { font-weight: 500; white-space: nowrap; }
.kce-lp-field-key { font-size: 10px; color: var(--text-muted); font-family: ui-monospace, monospace; white-space: nowrap; }

/* canvas */
.kce-canvas-wrap {
  flex: 1 2 0%;
  min-width: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: clamp(10px, 1.6vw, 16px) clamp(8px, 1.5vw, 14px) 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.kce-canvas {
  width: 100%;
  max-width: min(720px, 100%);
}
.kce-form-header-card {
  background: var(--bg-card);
  border-radius: 12px;
  border: 2px solid var(--primary);
  padding: 22px 24px 18px;
  margin-bottom: 10px;
  position: relative;
  overflow: hidden;
}
.kce-form-header-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #366ef4, #5b8df8);
}
.kce-form-header-title {
  font-size: 20px;
  font-weight: 700;
  border: none;
  background: transparent;
  width: 100%;
  outline: none;
  font-family: inherit;
  padding: 0;
  margin-bottom: 6px;
  color: var(--text-primary);
}
.kce-form-header-desc {
  font-size: 13px;
  color: var(--text-muted);
  border: none;
  background: transparent;
  width: 100%;
  outline: none;
  resize: none;
  font-family: inherit;
}

.kce-question-wrap { position: relative; margin-bottom: 8px; }
.kce-row-drag-handle {
  position: absolute;
  left: -20px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  cursor: grab;
  opacity: 0;
  transition: opacity 0.14s;
  z-index: 2;
}
.kce-question-wrap:hover .kce-row-drag-handle { opacity: 1; }
.kce-question-card {
  background: var(--bg-card);
  border-radius: 8px;
  border: 1px solid rgba(54, 110, 244, 0.18);
  padding: 14px 16px 12px;
  cursor: pointer;
  transition: border-color 0.14s, box-shadow 0.14s;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
  position: relative;
}
.kce-question-card:hover { border-color: rgba(54, 110, 244, 0.35); }
.kce-question-card.active { border-color: var(--primary); box-shadow: var(--shadow-lg); }
.kce-is-dragging { opacity: 0.55; }
.kce-drop-before { box-shadow: 0 -3px 0 0 var(--primary); }
.kce-drop-after { box-shadow: 0 3px 0 0 var(--primary); }

.kce-q-toolbar {
  display: none;
  position: absolute;
  top: -1px;
  right: -1px;
  background: var(--bg-card);
  border: 1.5px solid var(--primary);
  border-radius: 0 8px 0 4px;
  padding: 3px 4px;
  gap: 1px;
  align-items: center;
  box-shadow: var(--shadow-card);
}
.kce-question-card.active .kce-q-toolbar { display: flex; }
.kce-toolbar-sep { width: 1px; height: 14px; background: var(--border); margin: 0 2px; }
.kce-toolbar-req {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  color: var(--text-muted);
  padding: 0 4px;
  cursor: pointer;
  user-select: none;
}

.kce-q-number {
  font-size: 12px;
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.kce-q-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--danger); flex-shrink: 0; }
.kce-q-title-input {
  font-size: 15px;
  font-weight: 600;
  border: none;
  background: transparent;
  width: 100%;
  outline: none;
  margin-bottom: 3px;
  color: var(--text-primary);
}
.kce-q-desc-input {
  font-size: 12px;
  color: var(--text-muted);
  border: none;
  background: transparent;
  width: 100%;
  outline: none;
  margin-bottom: 10px;
  resize: none;
  font-family: inherit;
}
.kce-q-field-drop {
  min-height: 30px;
  margin: 2px 0 8px;
  padding: 5px 10px;
  border-radius: 4px;
  border: 1px dashed var(--border);
  font-size: 11px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  transition: border-color 0.15s, background 0.15s;
}
.kce-q-field-drop.has-field {
  border-style: solid;
  border-color: var(--primary);
  background: rgba(54,110,244,0.08);
  color: var(--primary);
  font-weight: 500;
}
.kce-q-field-drop.drag-over {
  border-color: var(--primary);
  background: rgba(54,110,244,0.14);
  color: var(--primary);
}
.kce-fd-tag { font-family: ui-monospace, monospace; font-size: 10px; opacity: 0.85; }

.kce-sec-label { font-size: 11px; color: var(--text-muted); margin-bottom: 5px; font-weight: 500; }
.kce-style-chips { display: flex; gap: 4px; margin-bottom: 8px; flex-wrap: wrap; }
.kce-style-chip {
  padding: 3px 10px;
  border-radius: 20px;
  border: 1px solid var(--border);
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  background: var(--bg-card);
  font-family: inherit;
}
.kce-style-chip.sel { border-color: var(--primary); color: var(--primary); background: rgba(54,110,244,0.08); font-weight: 500; }

.kce-preview-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px 4px 6px;
  border-radius: 4px;
  border: 1px solid var(--border);
  background: var(--bg-hover);
  font-size: 13px;
}
.kce-opt-circle { width: 15px; height: 15px; border-radius: 50%; border: 1.5px solid var(--border); flex-shrink: 0; }
.kce-opt-square { width: 15px; height: 15px; border-radius: 3px; border: 1.5px solid var(--border); flex-shrink: 0; }
.kce-preview-opt-input {
  flex: 1;
  min-width: 0;
  height: 28px;
  padding: 0 8px;
  border: 1px solid transparent;
  border-radius: 4px;
  font-size: 13px;
  background: transparent;
  color: var(--text-primary);
  outline: none;
}
.kce-preview-opt-input:hover { border-color: var(--border); background: var(--bg-card); }
.kce-preview-options { display: flex; flex-direction: column; gap: 5px; }
.kce-preview-options.horiz { flex-direction: row; flex-wrap: wrap; gap: 6px; }
.kce-preview-select {
  width: 100%;
  height: 34px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--bg-hover);
  padding: 0 10px;
  font-size: 13px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.kce-preview-dropdown-editor {
  margin-top: 8px;
  padding-left: 4px;
  border-left: 2px solid rgba(54,110,244,0.4);
}
.kce-add-opt-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: var(--primary);
  cursor: pointer;
  background: none;
  border: none;
  padding: 3px 0;
  font-family: inherit;
  margin-top: 6px;
}
.kce-opt-empty { font-size: 12px; color: var(--text-muted); padding: 6px 0; }

.kce-limit-row {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 8px;
  flex-wrap: wrap;
}
.kce-limit-input {
  width: 60px;
  height: 26px;
  padding: 0 6px;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 12px;
  background: var(--bg-card);
  color: var(--text-primary);
  outline: none;
  text-align: center;
}
.kce-muted-dash, .kce-muted-unit { font-size: 12px; color: var(--text-muted); }
.kce-q-sep { border: none; border-top: 1px dashed var(--border); margin: 10px 0 8px; }

.kce-logic-panel {
  padding: 10px 12px;
  background: var(--bg-hover);
  border-radius: 4px;
  border: 1px solid var(--border);
  margin-top: 6px;
}
.kce-logic-panel-hd { font-size: 12px; color: var(--text-secondary); margin-bottom: 8px; }
.kce-logic-row { display: flex; align-items: center; gap: 5px; margin-bottom: 5px; flex-wrap: wrap; }
.kce-logic-tag { font-size: 11px; font-weight: 600; padding: 2px 7px; border-radius: 3px; flex-shrink: 0; }
.kce-logic-tag.w { background: #e8f3ff; color: #366ef4; }
.kce-logic-tag.a { background: #fff3e8; color: #ff7d00; }
[data-theme="dark"] .kce-logic-tag.w { background: rgba(54,110,244,0.2); }
[data-theme="dark"] .kce-logic-tag.a { background: rgba(255,125,0,0.15); }
.kce-logic-sel, .kce-logic-val {
  height: 24px;
  padding: 0 4px;
  border-radius: 4px;
  border: 1px solid var(--border);
  font-size: 11px;
  font-family: inherit;
  background: var(--bg-card);
  color: var(--text-primary);
  outline: none;
}
.kce-logic-val { flex: 1; min-width: 72px; padding: 0 6px; }
.kce-logic-dash { font-size: 11px; color: var(--text-muted); flex: 1; }
.kce-add-logic-btn, .kce-toggle-logic-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--primary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px 0;
  font-family: inherit;
  margin-top: 4px;
}

.kce-canvas-drop-hint {
  margin-top: 12px;
  padding: 32px;
  border: 2px dashed var(--border);
  border-radius: 8px;
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
  transition: all 0.15s;
}
.kce-canvas-drop-hint.drag-over {
  border-color: var(--primary);
  background: rgba(54,110,244,0.08);
  color: var(--primary);
}
.kce-add-q-zone {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 8px 0 16px;
}
.kce-add-q-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 18px;
  border-radius: 20px;
  border: 1.5px dashed #c9cdd4;
  background: transparent;
  font-size: 13px;
  color: var(--text-muted);
  cursor: pointer;
  font-family: inherit;
}
.kce-add-q-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: rgba(54,110,244,0.08);
}

/* right */
.kce-right-panel {
  flex: 0 0 280px;
  width: 280px;
  min-width: 280px;
  box-sizing: border-box;
  background: var(--bg-card);
  border-left: 1px solid var(--border);
  overflow-x: hidden;
  overflow-y: auto;
  padding: 14px;
  min-height: 0;
}
.kce-rp-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 16px;
  text-align: center;
  color: var(--text-muted);
  gap: 8px;
}
.kce-rp-empty svg { opacity: 0.22; }
.kce-rp-empty p { font-size: 12px; line-height: 1.5; }
.kce-rp-section-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  margin: 14px 0 8px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}
.kce-rp-section-title:first-child { margin-top: 0; }
.kce-rp-row { display: flex; flex-direction: column; gap: 5px; margin-bottom: 10px; }
.kce-rp-label { font-size: 12px; color: var(--text-secondary); }
.kce-rp-select {
  height: 30px;
  padding: 0 24px 0 8px;
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 12px;
  font-family: inherit;
  background: var(--bg-card);
  color: var(--text-primary);
  outline: none;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%2386909c' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 7px center;
}
.kce-rp-toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0;
}
.kce-rp-toggle-text { font-size: 12px; color: var(--text-secondary); }
.kce-toggle-sw { position: relative; width: 32px; height: 18px; display: inline-block; }
.kce-toggle-sw input { opacity: 0; width: 0; height: 0; }
.kce-toggle-sl {
  position: absolute;
  inset: 0;
  border-radius: 9px;
  background: #c9cdd4;
  transition: 0.16s;
  cursor: pointer;
}
.kce-toggle-sl::before {
  content: '';
  position: absolute;
  width: 12px;
  height: 12px;
  left: 3px;
  bottom: 3px;
  background: #fff;
  border-radius: 50%;
  transition: 0.16s;
}
.kce-toggle-sw input:checked + .kce-toggle-sl { background: var(--primary); }
.kce-toggle-sw input:checked + .kce-toggle-sl::before { transform: translateX(14px); }
.kce-rp-limit-inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}
.kce-rp-limit-inner .kce-limit-input {
  flex: 1 1 96px;
  min-width: 72px;
  max-width: 100%;
}
.kce-rp-limit-hint { font-size: 11px; color: var(--text-muted); margin-top: 4px; }

/* toast */
.kce-toast-ct {
  position: fixed;
  top: 62px;
  right: 18px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.kce-toast {
  min-width: 160px;
  max-width: 280px;
  padding: 9px 13px;
  border-radius: 8px;
  background: var(--bg-card);
  box-shadow: var(--shadow-lg);
  border-left: 3px solid var(--primary);
  font-size: 13px;
}
.kce-toast.success { border-color: var(--success); }
.kce-toast.info { border-color: var(--primary); }
.kce-toast.error { border-color: var(--danger); }
.kce-toast.out { opacity: 0; transform: translateX(12px); transition: 0.2s; }

.btn-ghost {
  background: transparent;
  color: var(--text-muted);
  border: none;
}
.btn-ghost:hover { background: var(--bg-hover); color: var(--text-primary); }

@media (max-width: 1100px) {
  .kce-left-panel { width: 400px; min-width: 360px; }
  .kce-right-panel { flex-basis: 248px; width: 248px; min-width: 248px; }
}
@media (max-width: 860px) {
  .kce-editor-layout { flex-direction: column; }
  .kce-left-panel, .kce-right-panel { width: 100%; min-width: 0; border-right: none; border-left: none; }
}
</style>
