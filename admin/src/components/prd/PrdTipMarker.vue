<!-- PRD 原型批注角标 + 浮窗（prd-tip-marker Workflow C）；Teleport 至 body，fixed 定位 -->
<template>
  <Teleport to="body">
    <button
      v-show="anchorReady"
      ref="badgeRef"
      type="button"
      class="prd-tip-badge"
      :class="{ 'prd-tip-badge--sm': tipId > 9 }"
      :style="badgeStyle"
      :aria-label="`需求批注 ${tipId}`"
      @mouseenter="onBadgeEnter"
      @focus="onBadgeEnter"
    >
      {{ displayNum }}
    </button>

    <div
      v-show="open"
      ref="panelRef"
      class="prd-tip-panel"
      :style="panelStyle"
      role="dialog"
      aria-modal="false"
      @click.stop
      @mousedown.stop
      @pointerdown.stop
      @wheel.capture="onPanelWheel"
    >
      <div class="prd-tip-panel__header" @mousedown="onDragMouseDown" @touchmove.stop>
        <div class="prd-tip-panel__title">
          <span v-if="!editing" class="prd-tip-panel__title-text" v-html="titleHtml"></span>
          <span v-else class="prd-tip-panel__title-text">
            <span class="prd-tip-panel__readonly">[{{ tipId }}]</span>
            <span
              ref="titleEditableRef"
              class="prd-tip-panel__editable"
              contenteditable="true"
              spellcheck="false"
              @keydown.enter.prevent
            />
          </span>
        </div>
        <button type="button" class="prd-tip-panel__close" aria-label="关闭" @click.stop="closePanel">×</button>
      </div>
      <div class="prd-tip-panel__divider" aria-hidden="true" />

      <div class="prd-tip-panel__actions" @touchmove.stop>
        <template v-if="!editing">
          <button type="button" class="prd-tip-panel__btn" @click.stop="startEdit">编辑</button>
        </template>
        <template v-else>
          <button type="button" class="prd-tip-panel__btn prd-tip-panel__btn--primary" @click.stop="saveEdit">保存</button>
          <button type="button" class="prd-tip-panel__btn" @click.stop="cancelEdit">取消</button>
        </template>
      </div>
      <p v-if="saveHint" class="prd-tip-panel__hint">{{ saveHint }}</p>

      <div
        ref="bodyScrollRef"
        class="prd-tip-panel__scroll"
        @wheel="onBodyWheel"
        @touchmove.stop
      >
        <div
          v-if="!editing"
          class="prd-tip-panel__body prd-tip-md"
          v-html="bodyHtml"
        />
        <div
          v-else
          ref="bodyEditableRef"
          class="prd-tip-panel__body prd-tip-md prd-tip-md--edit"
          contenteditable="true"
          spellcheck="false"
        />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { parse as mdParse } from 'marked'
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue'
import { useRoute } from 'vue-router'
import {
  getPersistKey,
  persistTipToWorkspace,
  resolveTipContent,
} from '@/prd-tips/prdTipRepo'

const props = withDefaults(
  defineProps<{
    /** 页头等锚点 DOM（父级模板传入 ref，Vue 会自动拆包为元素） */
    anchorEl: HTMLElement | null
    /** 角标数字 1–99 */
    tipId: number
    /** 浮窗标题中的模块名（不含编号） */
    moduleName: string
    /** Markdown 正文 */
    markdown: string
    /** 角标相对锚点的摆位（筛选区/表头「操作」用模块右上角） */
    variant?: 'pageTitle' | 'filterCard' | 'opsHeader'
  }>(),
  { variant: 'pageTitle' }
)

const route = useRoute()
const persistKey = computed(() => getPersistKey(route.name, props.tipId))

const badgeRef = ref<HTMLButtonElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const bodyScrollRef = ref<HTMLElement | null>(null)
const bodyEditableRef = ref<HTMLDivElement | null>(null)
const titleEditableRef = ref<HTMLSpanElement | null>(null)

const open = ref(false)
const editing = ref(false)
const saveHint = ref('')
const draftTitle = ref('')
const draftMd = ref('')
const savedModuleName = ref(props.moduleName)
const bodyMd = ref(props.markdown)

const anchorReady = ref(false)
const badgeStyle = ref<Record<string, string>>({})
const panelStyle = ref<Record<string, string>>({ left: '-9999px', top: '-9999px' })

const displayNum = computed(() => {
  const n = props.tipId
  return n > 99 ? '99' : String(n)
})

const titleHtml = computed(() => {
  const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return `<span class="prd-tip-panel__readonly">[${props.tipId}]</span> 原型推断 · ${esc(savedModuleName.value)}`
})

const bodyHtml = computed(
  () => mdParse(bodyMd.value, { async: false }) as string
)

function initFromRepoOrProps() {
  const { moduleName, md } = resolveTipContent(
    persistKey.value,
    props.moduleName,
    props.markdown
  )
  bodyMd.value = md
  savedModuleName.value = moduleName
}

const MARKER = 20
const BADGE_Z = 10000
const PANEL_Z = 9999
const PANEL_W = 450
const GAP = 8
/** 标题右缘与角标左缘间距 */
const TITLE_BADGE_GAP = 8

function getAnchor(): HTMLElement | null {
  return props.anchorEl
}

function layoutBadge() {
  const anchor = getAnchor()
  if (!anchor || !anchor.isConnected) {
    anchorReady.value = false
    return
  }
  anchorReady.value = true
  const r = anchor.getBoundingClientRect()
  let left: number
  let top: number
  if (props.variant === 'filterCard' || props.variant === 'opsHeader') {
    // prd-tip-marker：筛选区/表头类模块 — 角标贴在锚点框右上角外扩（top/right -10px 量级）
    left = r.right - MARKER + 10
    top = r.top - 10
  } else {
    // 页标题：标题右侧间距 + 与标题行底对齐
    left = r.right + TITLE_BADGE_GAP
    top = r.bottom - MARKER
  }
  left = Math.min(Math.max(4, left), window.innerWidth - MARKER - 4)
  top = Math.min(Math.max(4, top), window.innerHeight - MARKER - 4)
  badgeStyle.value = {
    position: 'fixed',
    left: `${left}px`,
    top: `${top}px`,
    width: `${MARKER}px`,
    height: `${MARKER}px`,
    zIndex: String(BADGE_Z),
  }
}

function layoutPanel(useBadge = true, force = false) {
  if (!open.value || dragActive.value) return
  if (!force && panelLockedByUserDrag.value) return
  const badge = badgeRef.value
  if (!badge || !useBadge) return
  const b = badge.getBoundingClientRect()
  const panelH = panelRef.value?.offsetHeight ?? 360
  let left = b.left - PANEL_W - GAP
  let top = b.bottom + GAP
  if (left < 4) left = b.right + GAP
  if (left + PANEL_W > window.innerWidth - 4) left = window.innerWidth - PANEL_W - 4
  if (top + panelH > window.innerHeight - 4) top = b.top - panelH - GAP
  top = Math.max(4, Math.min(top, window.innerHeight - panelH - 4))
  left = Math.max(4, left)
  panelStyle.value = {
    position: 'fixed',
    left: `${left}px`,
    top: `${top}px`,
    width: `${PANEL_W}px`,
    zIndex: String(PANEL_Z),
  }
}

const dragActive = ref(false)
let dragOffX = 0
let dragOffY = 0
let dragStartX = 0
let dragStartY = 0
let lastDragDidMove = false
/** 用户拖动弹窗后，关闭前不因滚动/缩放等自动改位 */
const panelLockedByUserDrag = ref(false)

function onDragMouseDown(e: MouseEvent) {
  const t = e.target as HTMLElement
  if (
    t.closest('.prd-tip-panel__close') ||
    t.closest('.prd-tip-panel__actions') ||
    t.closest('.prd-tip-panel__btn')
  ) {
    return
  }
  dragActive.value = true
  lastDragDidMove = false
  dragStartX = e.clientX
  dragStartY = e.clientY
  const pl = panelRef.value
  if (!pl) return
  const curLeft = parseFloat(panelStyle.value.left ?? '0') || 0
  const curTop = parseFloat(panelStyle.value.top ?? '0') || 0
  dragOffX = e.clientX - curLeft
  dragOffY = e.clientY - curTop
  window.addEventListener('mousemove', onDragMove)
  window.addEventListener('mouseup', onDragUp)
}

function onDragMove(e: MouseEvent) {
  if (!dragActive.value) return
  if (Math.abs(e.clientX - dragStartX) + Math.abs(e.clientY - dragStartY) > 3) {
    lastDragDidMove = true
  }
  let left = e.clientX - dragOffX
  let top = e.clientY - dragOffY
  const pw = PANEL_W
  const ph = panelRef.value?.offsetHeight ?? 400
  left = Math.max(4, Math.min(left, window.innerWidth - pw - 4))
  top = Math.max(4, Math.min(top, window.innerHeight - ph - 4))
  panelStyle.value = {
    ...panelStyle.value,
    left: `${left}px`,
    top: `${top}px`,
  }
}

function onDragUp() {
  dragActive.value = false
  if (lastDragDidMove) {
    panelLockedByUserDrag.value = true
  }
  window.removeEventListener('mousemove', onDragMove)
  window.removeEventListener('mouseup', onDragUp)
}

function onBadgeEnter() {
  open.value = true
}

function closePanel() {
  open.value = false
  editing.value = false
  saveHint.value = ''
  panelLockedByUserDrag.value = false
}

function onPanelWheel(e: WheelEvent) {
  e.stopPropagation()
}

function onBodyWheel(e: WheelEvent) {
  e.stopPropagation()
  const el = bodyScrollRef.value
  if (!el) return
  const { scrollTop, scrollHeight, clientHeight } = el
  const atTop = scrollTop <= 0 && e.deltaY < 0
  const atBottom = scrollTop + clientHeight >= scrollHeight - 2 && e.deltaY > 0
  if (atTop || atBottom) e.preventDefault()
}

function startEdit() {
  saveHint.value = ''
  editing.value = true
  draftMd.value = bodyMd.value
  draftTitle.value = savedModuleName.value
  nextTick(() => {
    const be = bodyEditableRef.value
    const te = titleEditableRef.value
    if (be) {
      be.innerHTML = mdParse(bodyMd.value, { async: false }) as string
    }
    if (te) te.textContent = draftTitle.value
  })
}

async function saveEdit() {
  const te = titleEditableRef.value
  const be = bodyEditableRef.value
  if (te?.textContent?.trim()) savedModuleName.value = te.textContent.trim()
  if (be) {
    const html = be.innerHTML
    bodyMd.value = htmlToApproxMd(html)
  }
  const key = persistKey.value
  const result = await persistTipToWorkspace(key, {
    moduleName: savedModuleName.value,
    md: bodyMd.value,
  })
  saveHint.value = result.ok
    ? result.message ?? '已保存'
    : `保存失败：${result.message ?? '未知错误'}`
  editing.value = false
}

/** 编辑态从富文本 DOM 抽回近似 Markdown（管理端自用批注，可再手工改） */
function htmlToApproxMd(html: string): string {
  const d = document.createElement('div')
  d.innerHTML = html
  function walk(n: Node): string {
    if (n.nodeType === Node.TEXT_NODE) return n.textContent ?? ''
    if (n.nodeType !== Node.ELEMENT_NODE) return ''
    const el = n as HTMLElement
    const tag = el.tagName.toLowerCase()
    const inner = Array.from(el.childNodes).map(walk).join('')
    if (tag === 'p') return `${inner}\n\n`
    if (tag === 'br') return '\n'
    if (tag === 'strong' || tag === 'b') return `**${inner}**`
    if (tag === 'em' || tag === 'i') return `*${inner}*`
    if (tag === 'ul') return `${Array.from(el.querySelectorAll(':scope > li')).map((li) => `- ${walk(li)}`).join('\n')}\n\n`
    if (tag === 'ol')
      return `${Array.from(el.querySelectorAll(':scope > li')).map((li, i) => `${i + 1}. ${walk(li)}`).join('\n')}\n\n`
    if (tag === 'li') return inner.trim()
    if (tag === 'blockquote') return `> ${inner.replace(/\n+/g, ' ').trim()}\n\n`
    if (tag === 'code') return `\`${inner}\``
    if (tag === 'pre') return `\`\`\`\n${inner}\n\`\`\`\n\n`
    return inner
  }
  return walk(d).replace(/\n{3,}/g, '\n\n').trim()
}

function cancelEdit() {
  editing.value = false
  saveHint.value = ''
}

let ro: ResizeObserver | null = null

function bindAnchorObserver() {
  ro?.disconnect()
  const el = getAnchor()
  if (!el) return
  ro = new ResizeObserver(() => {
    layoutBadge()
    if (open.value) nextTick(() => layoutPanel(true))
  })
  ro.observe(el)
}

onMounted(() => {
  initFromRepoOrProps()
  layoutBadge()
  bindAnchorObserver()
  window.addEventListener('scroll', onWinScroll, true)
  window.addEventListener('resize', onWinResize)
})

onBeforeUnmount(() => {
  ro?.disconnect()
  window.removeEventListener('scroll', onWinScroll, true)
  window.removeEventListener('resize', onWinResize)
  window.removeEventListener('mousemove', onDragMove)
  window.removeEventListener('mouseup', onDragUp)
})

function onWinScroll() {
  layoutBadge()
  if (open.value && !dragActive.value) layoutPanel(true)
}

function onWinResize() {
  layoutBadge()
  if (open.value && !dragActive.value) layoutPanel(true)
}

watch(persistKey, () => {
  initFromRepoOrProps()
  panelLockedByUserDrag.value = false
  nextTick(() => {
    layoutBadge()
    if (open.value) layoutPanel(true, true)
  })
})

watch(
  () => props.anchorEl,
  () => {
    nextTick(() => {
      layoutBadge()
      bindAnchorObserver()
    })
  }
)

watch(
  () => props.variant,
  () => {
    nextTick(() => layoutBadge())
  }
)

watch(open, (v) => {
  if (v) {
    nextTick(() => {
      layoutPanel(true, true)
    })
  }
})

defineExpose({ closePanel })
</script>

<style scoped>
.prd-tip-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  border: none;
  border-radius: 50%;
  background: rgb(250, 173, 20);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
}
.prd-tip-badge:focus-visible {
  outline: 2px solid var(--primary, #409eff);
  outline-offset: 2px;
}
.prd-tip-badge--sm {
  font-size: 9px;
}

.prd-tip-panel__divider {
  height: 1px;
  margin: 0 12px;
  background: var(--border, #e8edf3);
  flex-shrink: 0;
}

.prd-tip-panel {
  background: var(--surface, #fff);
  border: 1px solid var(--border, #e8edf3);
  border-radius: var(--radius-lg, 8px);
  box-shadow: var(--shadow-lg, 0 8px 28px rgba(30, 40, 60, 0.11));
  display: flex;
  flex-direction: column;
  max-height: min(72vh, 560px);
  overflow: hidden;
  touch-action: none;
}

.prd-tip-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 12px 6px;
  cursor: grab;
  user-select: none;
}
.prd-tip-panel__header:active {
  cursor: grabbing;
}

.prd-tip-panel__title {
  flex: 1;
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary, rgba(0, 0, 0, 0.88));
  line-height: 1.45;
}

.prd-tip-panel__readonly {
  font-weight: 800;
}

.prd-tip-panel__editable {
  outline: none;
  border-radius: 2px;
  min-width: 60px;
}
.prd-tip-panel__editable:focus {
  box-shadow: inset 0 0 0 1px var(--border-hover, #c8d5e2);
  background: var(--surface-hover, rgba(0, 0, 0, 0.04));
}

.prd-tip-panel__close {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border: 1px solid var(--border, #e8edf3);
  border-radius: 4px;
  background: var(--surface, #fff);
  color: var(--text-secondary, rgba(0, 0, 0, 0.65));
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
}
.prd-tip-panel__close:hover {
  background: var(--surface-hover, rgba(0, 0, 0, 0.06));
  border-color: var(--border-hover, #c8d5e2);
}

.prd-tip-panel__actions {
  display: flex;
  gap: 8px;
  padding: 4px 12px 8px;
}
.prd-tip-panel__hint {
  margin: 0 12px 8px;
  font-size: 12px;
  line-height: 1.45;
  color: var(--text-secondary, #64748b);
}
.prd-tip-panel__btn {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 4px;
  border: 1px solid var(--border, #e8edf3);
  background: var(--surface, #fff);
  color: var(--text-primary, #333);
  cursor: pointer;
}
.prd-tip-panel__btn--primary {
  background: var(--surface-hover, rgba(0, 0, 0, 0.06));
  font-weight: 600;
}

.prd-tip-panel__scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 0 12px 12px;
}

.prd-tip-panel__body {
  line-height: 1.6;
  color: var(--text-primary, rgba(0, 0, 0, 0.88));
}
.prd-tip-panel__body :deep(p) {
  margin: 0 0 12px;
}
.prd-tip-panel__body :deep(ul),
.prd-tip-panel__body :deep(ol) {
  margin: 0 0 12px;
  padding-left: 1.25rem;
}
.prd-tip-panel__body :deep(blockquote) {
  margin: 0 0 12px;
  padding-left: 10px;
  border-left: 3px solid var(--border-hover, #c8d5e2);
  color: var(--text-secondary, rgba(0, 0, 0, 0.75));
}
.prd-tip-panel__body :deep(strong) {
  font-weight: 700;
}

.prd-tip-md--edit {
  outline: none;
  min-height: 120px;
  cursor: text;
}
.prd-tip-md--edit:focus {
  box-shadow: inset 0 0 0 1px var(--border-hover, #c8d5e2);
  background: var(--surface-hover, rgba(0, 0, 0, 0.03));
}
</style>
