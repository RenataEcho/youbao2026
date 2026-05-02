<template>
  <div class="pcf-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">品牌项目</span>
      <span class="bc-sep">/</span>
      <router-link to="/project/config" style="color:var(--text-secondary);text-decoration:none">项目配置</router-link>
      <span class="bc-sep">/</span>
      <span class="bc-cur">{{ pageTitle }}</span>
    </div>

    <div class="page-content pcf-page">
      <div class="pcf-page-inner">
        <div class="page-header pcf-header">
          <div style="display:flex;align-items:flex-start;gap:14px">
            <button type="button" class="btn btn-default btn-sm" @click="goBack">
              返回列表
            </button>
            <div>
              <h1 class="page-title">{{ pageTitle }}</h1>
              <p class="page-desc">完整填写基础信息、状态开关与详情介绍；字段较多时使用独立页面编辑（符合 UI/UX ≥15 字段规范）。</p>
            </div>
          </div>
        </div>

        <template v-if="form">
          <!-- 基础信息 -->
          <div class="glass-card ud-section">
            <div class="ud-section-title"><div class="ud-dot"></div>基础信息</div>
            <div class="ud-field-grid">
              <div class="ud-field">
                <div class="ud-label">项目类别 <span class="req">*</span></div>
                <select v-model="form.category" class="ul-input ul-select">
                  <option v-for="c in CATEGORIES" :key="c" :value="c">{{ c }}</option>
                </select>
              </div>
              <div class="ud-field">
                <div class="ud-label">前台标题 <span class="req">*</span></div>
                <input v-model="form.frontTitle" type="text" class="ul-input" placeholder="展示给用户的名称">
              </div>
              <div class="ud-field">
                <div class="ud-label">后台标题 <span class="req">*</span></div>
                <input v-model="form.backTitle" type="text" class="ul-input" placeholder="仅后台使用">
              </div>
              <div class="ud-field">
                <div class="ud-label">项目英文标识 <span class="req">*</span></div>
                <input v-model="form.projectEn" type="text" class="ul-input" placeholder="唯一标识，如 novel_cpa_q2">
              </div>
              <div class="ud-field">
                <div class="ud-label">项目标签</div>
                <input v-model="form.projectTags" type="text" class="ul-input" placeholder="逗号分隔，如 小说,CPA">
              </div>

              <template v-if="form.settlement_cycle === 'T+N'">
                <div class="ud-field">
                  <div class="ud-label">角标标题</div>
                  <input v-model="form.tagTitle" type="text" class="ul-input" placeholder="如：爆单">
                </div>
                <div class="ud-field">
                  <div class="ud-label">排序 sort</div>
                  <input v-model.number="form.sort" type="number" class="ul-input" min="0" step="1" title="数字越大越靠前">
                </div>
                <div class="ud-field">
                  <div class="ud-label">结算周期</div>
                  <select v-model="form.settlement_cycle" class="ul-input ul-select">
                    <option value="日结">日结</option>
                    <option value="周结">周结</option>
                    <option value="月结">月结</option>
                    <option value="T+N">T+N</option>
                  </select>
                </div>
                <div class="ud-field">
                  <div class="ud-label">T+N 的 N</div>
                  <input v-model.number="form.settlementTN" type="number" class="ul-input" min="1" step="1">
                </div>
                <div class="ud-field">
                  <div class="ud-label">门槛</div>
                  <select v-model="form.entryBarrier" class="ul-input ul-select">
                    <option value="0门槛">0门槛</option>
                    <option value="需账号">需账号</option>
                    <option value="要资质">要资质</option>
                  </select>
                </div>
                <div class="ud-field">
                  <div class="ud-label">所属赛道 <span class="req">*</span></div>
                  <select v-model="form.trackRef" class="ul-input ul-select">
                    <option value="">请选择</option>
                    <option v-for="t in TRACK_OPTIONS" :key="t" :value="t">{{ t }}</option>
                  </select>
                </div>
                <div class="ud-field">
                  <div class="ud-label">所属业务 <span class="req">*</span></div>
                  <select v-model="form.business" class="ul-input ul-select">
                    <option value="">请选择</option>
                    <option v-for="b in BIZ_OPTIONS" :key="b" :value="b">{{ b }}</option>
                  </select>
                </div>
                <div class="ud-field">
                  <div class="ud-label">可见用户</div>
                  <select v-model="form.memberType" class="ul-input ul-select">
                    <option v-for="m in MEMBER_TYPES" :key="m" :value="m">{{ m }}</option>
                  </select>
                </div>
                <div class="ud-field">
                  <div class="ud-label">关键词过期时长（天）</div>
                  <input v-model.number="form.expireDays" type="number" class="ul-input" min="1" step="1" placeholder="默认 360">
                </div>
                <div class="ud-field ud-field--full">
                  <div class="ud-label">书单链接</div>
                  <input v-model="form.booklistLink" type="text" class="ul-input" placeholder="https://…">
                </div>
              </template>
              <template v-else>
                <div class="ud-field">
                  <div class="ud-label">角标标题</div>
                  <input v-model="form.tagTitle" type="text" class="ul-input" placeholder="如：爆单">
                </div>
                <div class="ud-field">
                  <div class="ud-label">排序 sort</div>
                  <input v-model.number="form.sort" type="number" class="ul-input" min="0" step="1" title="数字越大越靠前">
                </div>
                <div class="ud-field">
                  <div class="ud-label">结算周期</div>
                  <select v-model="form.settlement_cycle" class="ul-input ul-select">
                    <option value="日结">日结</option>
                    <option value="周结">周结</option>
                    <option value="月结">月结</option>
                    <option value="T+N">T+N</option>
                  </select>
                </div>
                <div class="ud-field">
                  <div class="ud-label">门槛</div>
                  <select v-model="form.entryBarrier" class="ul-input ul-select">
                    <option value="0门槛">0门槛</option>
                    <option value="需账号">需账号</option>
                    <option value="要资质">要资质</option>
                  </select>
                </div>
                <div class="ud-field">
                  <div class="ud-label">所属赛道 <span class="req">*</span></div>
                  <select v-model="form.trackRef" class="ul-input ul-select">
                    <option value="">请选择</option>
                    <option v-for="t in TRACK_OPTIONS" :key="t" :value="t">{{ t }}</option>
                  </select>
                </div>
                <div class="ud-field">
                  <div class="ud-label">所属业务 <span class="req">*</span></div>
                  <select v-model="form.business" class="ul-input ul-select">
                    <option value="">请选择</option>
                    <option v-for="b in BIZ_OPTIONS" :key="b" :value="b">{{ b }}</option>
                  </select>
                </div>
                <div class="ud-field">
                  <div class="ud-label">可见用户</div>
                  <select v-model="form.memberType" class="ul-input ul-select">
                    <option v-for="m in MEMBER_TYPES" :key="m" :value="m">{{ m }}</option>
                  </select>
                </div>
                <div class="ud-field">
                  <div class="ud-label">关键词过期时长（天）</div>
                  <input v-model.number="form.expireDays" type="number" class="ul-input" min="1" step="1" placeholder="默认 360">
                </div>
                <div class="ud-field">
                  <div class="ud-label">书单链接</div>
                  <input v-model="form.booklistLink" type="text" class="ul-input" placeholder="https://…">
                </div>
              </template>

              <div class="ud-field ud-field--full">
                <div class="pc-iconpair-row">
                  <div class="pc-iconpair-col">
                    <AttachmentImageField
                      v-model="form.projectIcon"
                      label="项目 icon"
                      compact
                      hide-url
                      hide-format-hints
                    />
                  </div>
                  <div class="pc-iconpair-col pc-iconpair-col--tags">
                    <div class="ud-label">角标</div>
                    <div class="pc-tag-icons-inline">
                      <AttachmentImageField
                        v-for="idx in 3"
                        :key="idx"
                        :model-value="form.tagIcons[idx - 1]"
                        :label="`角标 ${idx}`"
                        size-hint="64×64"
                        compact
                        hide-url
                        hide-format-hints
                        @update:model-value="(v: string) => setTagIcon(idx - 1, v)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 状态与开关 -->
          <div class="glass-card ud-section">
            <div class="ud-section-title"><div class="ud-dot"></div>状态与开关</div>
            <div class="ud-field-grid">
              <div v-for="item in FLAG_FIELDS" :key="item.key" class="ud-field pc-flag-field">
                <div class="ud-label">{{ item.label }}</div>
                <select
                  class="ul-input ul-select"
                  :value="String(form[item.key])"
                  @change="setFlagField(item.key, ($event.target as HTMLSelectElement).value)"
                >
                  <option v-for="opt in item.options" :key="String(opt.v)" :value="opt.v">{{ opt.l }}</option>
                </select>
                <p class="pc-flag-hint">{{ item.hint }}</p>
              </div>
            </div>
          </div>

          <!-- 详情介绍（Tab：四大板块；项目介绍下含子 Tab） -->
          <div id="project-config-detail" class="glass-card ud-section">
            <div class="ud-section-title"><div class="ud-dot"></div>详情介绍</div>
            <p class="pc-detail-lead">
              项目介绍含五个子模块；以下为富文本内容配置（默认图文 HTML）。切换 Tab 编辑对应板块。
            </p>
            <div class="pc-detail-main-tabs ud-tabs">
              <button
                type="button"
                class="ud-tab"
                :class="{ active: detailMainTab === 'introduction' }"
                @click="detailMainTab = 'introduction'"
              >
                项目介绍
              </button>
              <button
                type="button"
                class="ud-tab"
                :class="{ active: detailMainTab === 'process' }"
                @click="detailMainTab = 'process'"
              >
                项目流程
              </button>
              <button
                type="button"
                class="ud-tab"
                :class="{ active: detailMainTab === 'notice' }"
                @click="detailMainTab = 'notice'"
              >
                特别注意
              </button>
              <button
                type="button"
                class="ud-tab"
                :class="{ active: detailMainTab === 'teaching' }"
                @click="detailMainTab = 'teaching'"
              >
                项目教学
              </button>
            </div>

            <div v-if="detailMainTab === 'introduction'" class="pc-detail-sub-tabs ud-tabs">
              <button
                v-for="sub in INTRO_CHILDREN"
                :key="sub.key"
                type="button"
                class="ud-tab"
                :class="{ active: detailIntroSub === sub.key }"
                @click="detailIntroSub = sub.key"
              >
                {{ sub.label }}
              </button>
            </div>

            <div class="glass-panel-inner pc-detail-editor-card">
              <ProjectDetailSectionEditor
                v-if="form && detailMainTab === 'introduction'"
                :key="detailIntroSub"
                v-model="form.detail.introduction.children[detailIntroSub]"
              />
              <ProjectDetailSectionEditor
                v-else-if="form && detailMainTab === 'process'"
                v-model="form.detail.process"
              />
              <ProjectDetailSectionEditor
                v-else-if="form && detailMainTab === 'notice'"
                v-model="form.detail.notice"
              />
              <ProjectDetailSectionEditor
                v-else-if="form && detailMainTab === 'teaching'"
                v-model="form.detail.teaching"
              />
            </div>
          </div>

          <div class="glass-card pcf-footer-section">
            <div class="pcf-footer">
              <button type="button" class="btn btn-default" @click="goBack">取消</button>
              <button type="button" class="btn btn-primary" @click="submitForm">
                保存
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div class="ul-toast-container">
      <div v-for="t in toasts" :key="t.id" class="ul-toast" :class="t.type">
        <span style="flex:1;color:var(--text-primary);line-height:1.5">{{ t.msg }}</span>
        <button type="button" style="background:none;border:none;cursor:pointer;color:var(--text-muted)" @click="removeToast(t.id)">✕</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { ProjectRow, IntroChildKey, ProjectTagIcons } from '@/utils/projectManagement'
import ProjectDetailSectionEditor from './ProjectDetailSectionEditor.vue'
import AttachmentImageField from '@/components/common/AttachmentImageField.vue'
import {
  cloneProjectRow,
  createEmptyProjectRow,
  normalizeProjectManagementDetail,
  rowToForm,
} from '@/utils/projectManagement'
import { useProjectConfigStore } from '@/stores/projectConfig'
import {
  CATEGORIES,
  TRACK_OPTIONS,
  BIZ_OPTIONS,
  MEMBER_TYPES,
  INTRO_CHILDREN,
  FLAG_FIELDS,
} from './projectConfigConstants'

const route = useRoute()
const router = useRouter()
const store = useProjectConfigStore()

const formMode = computed<'add' | 'edit'>(() => (route.name === 'ProjectConfigNew' ? 'add' : 'edit'))
const pageTitle = computed(() => (formMode.value === 'add' ? '新增项目' : '编辑项目'))

const form = ref<ProjectRow | null>(null)

/** 详情介绍 — 主 Tab：四大板块 */
const detailMainTab = ref<'introduction' | 'process' | 'notice' | 'teaching'>('introduction')
/** 项目介绍 — 子 Tab */
const detailIntroSub = ref<IntroChildKey>('projectDescription')

interface ToastItem { id: number; msg: string; type: 'success' | 'error' | 'info' }
const toasts = ref<ToastItem[]>([])
let toastId = 0

function setFlagField(key: (typeof FLAG_FIELDS)[number]['key'], val: string) {
  if (!form.value) return
  const row = form.value as Record<string, unknown>
  row[key] = val
}

function setTagIcon(index: number, val: string) {
  if (!form.value) return
  const next = [...form.value.tagIcons] as ProjectTagIcons
  if (index >= 0 && index < 3) next[index] = val
  form.value.tagIcons = next
}

function mockNow() {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

onBeforeMount(() => {
  store.ensureSeed()
  if (route.name === 'ProjectConfigNew') {
    const nid = store.nextId()
    form.value = createEmptyProjectRow(nid)
    return
  }
  const id = Number(route.params.id)
  if (!Number.isFinite(id)) {
    router.replace({ name: 'ProjectConfig' })
    return
  }
  const row = store.findById(id)
  if (!row) {
    router.replace({ name: 'ProjectConfig' })
    return
  }
  form.value = cloneProjectRow(rowToForm(row))
})

function goBack() {
  router.push({ name: 'ProjectConfig' })
}

function submitForm() {
  if (!form.value) return
  const f = form.value
  if (!f.category) {
    showToast('请选择项目类别', 'error')
    return
  }
  if (!f.frontTitle?.trim() || !f.backTitle?.trim() || !f.projectEn?.trim()) {
    showToast('请填写前台标题、后台标题与英文标识', 'error')
    return
  }
  if (!f.trackRef || !f.business) {
    showToast('请选择所属赛道与所属业务', 'error')
    return
  }

  f.detail = normalizeProjectManagementDetail(f.detail)
  f.updateTime = mockNow()

  if (formMode.value === 'add') {
    const id = f.id
    store.upsert({ ...cloneProjectRow(f), id, seq: id })
    showToast('新增成功（演示数据仅前端）', 'success')
  } else {
    store.upsert(cloneProjectRow(f))
    showToast('保存成功', 'success')
  }
  setTimeout(() => router.push({ name: 'ProjectConfig' }), 400)
}

function showToast(msg: string, type: ToastItem['type'] = 'info') {
  const id = ++toastId
  toasts.value.push({ id, msg, type })
  setTimeout(() => removeToast(id), 3200)
}
function removeToast(id: number) {
  toasts.value = toasts.value.filter((t) => t.id !== id)
}
</script>

<style scoped>
.pcf-wrap { min-height: 100%; }
.pcf-page { box-sizing: border-box; }
.pcf-page-inner {
  max-width: 1040px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}
.pcf-header { align-items: flex-start; margin-bottom: 12px; }
.req { color: var(--danger); }

/* 项目 icon + 标签 icon 同一行 */
.pc-iconpair-row {
  display: grid;
  grid-template-columns: minmax(160px, 1fr) minmax(0, 2.4fr);
  gap: 16px 20px;
  align-items: start;
}
@media (max-width: 900px) {
  .pc-iconpair-row {
    grid-template-columns: 1fr;
  }
}
.pc-tag-icons-inline {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  align-items: start;
}
@media (max-width: 520px) {
  .pc-tag-icons-inline {
    grid-template-columns: 1fr;
  }
}

.pc-flag-field {
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  background: var(--surface-hover);
  border: 1px solid var(--border);
}
.pc-flag-hint {
  font-size: 11px;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.45;
}

.pc-detail-lead {
  font-size: 12px;
  color: var(--text-muted);
  margin: 0 0 14px;
  line-height: 1.55;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  background: var(--surface-hover);
  border: 1px solid var(--border);
}
.pc-detail-main-tabs {
  margin-bottom: 0;
}
.pc-detail-sub-tabs {
  margin-top: 8px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}
.pc-detail-editor-card {
  padding: 14px 16px 16px;
  border-radius: var(--radius);
}
.glass-panel-inner {
  background: var(--surface-hover);
  border: 1px solid var(--border);
}
[data-theme='dark'] .glass-panel-inner {
  background: rgba(255, 255, 255, 0.04);
}

.pcf-footer-section {
  padding: 14px 18px;
  margin-bottom: 8px;
}
.pcf-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin: 0;
  padding: 0;
  border: none;
}
</style>
