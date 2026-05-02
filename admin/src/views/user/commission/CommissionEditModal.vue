<template>
  <el-dialog
    v-model="dialogVisible"
    width="640px"
    align-center
    destroy-on-close
    :close-on-click-modal="false"
    class="cem-dialog"
    @closed="emit('update:visible', false)"
  >
    <template #header>
      <div class="cem-header">
        <span class="lv-tag" :class="`lv-${form.level.toLowerCase()}`">{{ form.level }}</span>
        <span class="cem-title">编辑分销比例配置</span>
      </div>
    </template>

    <div v-if="form.targets.length" class="cem-body">
      <div class="cem-switch-row">
        <span class="cem-switch-label">配置状态</span>
        <el-switch v-model="form.enabled" active-text="启用" inactive-text="禁用" />
      </div>

      <div class="cem-tabs">
        <button
          v-for="t in form.targets"
          :key="t.targetLevel"
          type="button"
          class="cem-tab"
          :class="{ active: activeTab === t.targetLevel }"
          @click="activeTab = t.targetLevel"
        >
          <span class="lv-tag lv-sm" :class="`lv-${t.targetLevel.toLowerCase()}`">{{ t.targetLevel }}</span>
        </button>
      </div>

      <template v-for="t in form.targets" :key="t.targetLevel">
        <div v-show="activeTab === t.targetLevel" class="cem-sections">
          <div class="cem-section">
            <div class="cem-section-title">
              <span class="cem-dot" />
              用户关系分佣
            </div>
            <div class="cem-form-grid">
              <div class="cem-field">
                <label class="cem-label">直邀比例 <span class="cem-req">*</span></label>
                <div class="cem-input-wrap">
                  <el-input-number
                    v-model="t.user.direct"
                    :min="0"
                    :max="100"
                    :precision="2"
                    :step="0.5"
                    controls-position="right"
                    size="small"
                    style="width: 130px"
                  />
                  <span class="cem-unit">%</span>
                </div>
              </div>
              <div class="cem-field">
                <label class="cem-label">间邀比例 <span v-if="userIndirectApplicable(form.level as LeaderLevel, t.targetLevel as LeaderLevel)" class="cem-req">*</span></label>
                <div class="cem-input-wrap">
                  <template v-if="userIndirectApplicable(form.level as LeaderLevel, t.targetLevel as LeaderLevel)">
                    <el-input-number
                      v-model="t.user.indirect"
                      :min="0"
                      :max="100"
                      :precision="2"
                      :step="0.5"
                      controls-position="right"
                      size="small"
                      style="width: 130px"
                    />
                    <span class="cem-unit">%</span>
                  </template>
                  <span v-else class="cem-na-text">不适用</span>
                </div>
              </div>
              <div class="cem-field">
                <label class="cem-label">
                  无限比例
                  <span v-if="userInfiniteApplicable(form.level as LeaderLevel, t.targetLevel as LeaderLevel)" class="cem-hint">（{{ form.level }}→V1）</span>
                </label>
                <div class="cem-input-wrap">
                  <template v-if="userInfiniteApplicable(form.level as LeaderLevel, t.targetLevel as LeaderLevel)">
                    <el-input-number
                      v-model="t.user.infinite"
                      :min="0"
                      :max="100"
                      :precision="2"
                      :step="0.5"
                      controls-position="right"
                      size="small"
                      style="width: 130px"
                    />
                    <span class="cem-unit">%</span>
                  </template>
                  <span v-else class="cem-na-text">仅 V2/V3 针对 V1 时配置</span>
                </div>
              </div>
            </div>
          </div>

          <div class="cem-section">
            <div class="cem-section-title">
              <span class="cem-dot cem-dot-t" />
              团队关系分佣
            </div>
            <template v-if="t.team === null">
              <div class="cem-na-box">
                <el-icon style="opacity: 0.4"><InfoFilled /></el-icon>
                <span>V1 为普通代理，无团队关系分佣</span>
              </div>
            </template>
            <div v-else class="cem-form-grid">
              <div class="cem-field">
                <label class="cem-label">直属团比例 <span class="cem-req">*</span></label>
                <div class="cem-input-wrap">
                  <el-input-number
                    v-model="t.team.direct"
                    :min="0"
                    :max="100"
                    :precision="2"
                    :step="0.5"
                    controls-position="right"
                    size="small"
                    style="width: 130px"
                  />
                  <span class="cem-unit">%</span>
                </div>
              </div>
              <div class="cem-field">
                <label class="cem-label">间属团比例 <span class="cem-req">*</span></label>
                <div class="cem-input-wrap">
                  <el-input-number
                    v-model="t.team.indirect"
                    :min="0"
                    :max="100"
                    :precision="2"
                    :step="0.5"
                    controls-position="right"
                    size="small"
                    style="width: 130px"
                  />
                  <span class="cem-unit">%</span>
                </div>
              </div>
              <div class="cem-field">
                <label class="cem-label">
                  无限团比例
                  <span v-if="teamInfiniteApplicable(form.level as LeaderLevel, t.targetLevel as LeaderLevel)" class="cem-hint">（{{ form.level }}&gt;{{ t.targetLevel }}）</span>
                </label>
                <div class="cem-input-wrap">
                  <template v-if="teamInfiniteApplicable(form.level as LeaderLevel, t.targetLevel as LeaderLevel)">
                    <el-input-number
                      v-model="t.team.infinite"
                      :min="0"
                      :max="100"
                      :precision="2"
                      :step="0.5"
                      controls-position="right"
                      size="small"
                      style="width: 130px"
                    />
                    <span class="cem-unit">%</span>
                  </template>
                  <span v-else class="cem-na-text">同级或 V1 目标不配置</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <template #footer>
      <el-button size="small" @click="handleClose">取消</el-button>
      <el-button type="primary" size="small" :loading="saving" @click="handleSave">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { InfoFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { CommissionItem, CommissionTarget, LeaderLevel } from '@/types'
import {
  userIndirectApplicable,
  userInfiniteApplicable,
  teamInfiniteApplicable,
} from './commissionUtils'

function formatNow(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

const props = defineProps<{
  visible: boolean
  row: CommissionItem | null
}>()

const emit = defineEmits<{
  (e: 'update:visible', v: boolean): void
  (e: 'saved', updated: CommissionItem): void
}>()

const dialogVisible = computed({
  get: () => props.visible,
  set: (v: boolean) => emit('update:visible', v),
})

interface FormTarget {
  targetLevel: string
  user: { direct: number; indirect: number | null; infinite: number | null }
  team: { direct: number; indirect: number; infinite: number | null } | null
}
interface Form {
  id: number
  level: string
  enabled: boolean
  createdAt: string
  updatedAt: string
  operator: string
  targets: FormTarget[]
}

const form = reactive<Form>({
  id: 0,
  level: 'V1',
  enabled: true,
  createdAt: '',
  updatedAt: '',
  operator: '',
  targets: [],
})
const activeTab = ref('')
const saving = ref(false)

function normalizeTargets(level: LeaderLevel, targets: FormTarget[]) {
  for (const t of targets) {
    const tl = t.targetLevel as LeaderLevel
    if (!userIndirectApplicable(level, tl)) t.user.indirect = null
    else if (t.user.indirect === null) t.user.indirect = 0
    if (!userInfiniteApplicable(level, tl)) t.user.infinite = null
    else if (t.user.infinite === null) t.user.infinite = 0
    if (t.team) {
      if (!teamInfiniteApplicable(level, tl)) t.team.infinite = null
      else if (t.team.infinite === null) t.team.infinite = 0
    }
  }
}

watch(
  () => props.row,
  (newRow) => {
    if (!newRow) return
    const level = newRow.level as LeaderLevel
    const targets = newRow.targets.map((t) => ({
      targetLevel: t.targetLevel,
      user: { ...t.user },
      team: t.team ? { ...t.team } : null,
    }))
    normalizeTargets(level, targets)
    Object.assign(form, {
      id: newRow.id,
      level: newRow.level,
      enabled: newRow.enabled,
      createdAt: newRow.createdAt,
      updatedAt: newRow.updatedAt,
      operator: newRow.operator,
      targets,
    })
    activeTab.value = form.targets[0]?.targetLevel ?? ''
  },
  { immediate: true },
)

function handleClose() {
  emit('update:visible', false)
}

function handleSave() {
  const level = form.level as LeaderLevel
  normalizeTargets(level, form.targets)
  for (const t of form.targets) {
    const tl = t.targetLevel as LeaderLevel
    if (userIndirectApplicable(level, tl) && (t.user.indirect === null || t.user.indirect === undefined)) {
      ElMessage.warning(`请填写 ${t.targetLevel} 的间邀比例`)
      return
    }
    if (userInfiniteApplicable(level, tl) && (t.user.infinite === null || t.user.infinite === undefined)) {
      ElMessage.warning(`请填写针对 ${t.targetLevel} 的无限比例`)
      return
    }
    if (t.team) {
      if (t.team.direct === null || t.team.direct === undefined) {
        ElMessage.warning(`请填写针对 ${t.targetLevel} 的直属团比例`)
        return
      }
      if (t.team.indirect === null || t.team.indirect === undefined) {
        ElMessage.warning(`请填写针对 ${t.targetLevel} 的间属团比例`)
        return
      }
      if (teamInfiniteApplicable(level, tl) && (t.team.infinite === null || t.team.infinite === undefined)) {
        ElMessage.warning(`请填写针对 ${t.targetLevel} 的无限团比例`)
        return
      }
    }
  }

  saving.value = true
  try {
    const targets = form.targets.map(
      (t) =>
        ({
          targetLevel: t.targetLevel as LeaderLevel,
          user: { ...t.user },
          team: t.team ? { ...t.team } : null,
        }) satisfies CommissionTarget,
    )
    const record: CommissionItem = {
      id: form.id,
      level: form.level as LeaderLevel,
      enabled: form.enabled,
      targets,
      createdAt: form.createdAt,
      updatedAt: formatNow(),
      operator: form.operator || '本地编辑',
    }
    ElMessage.success('已保存到当前列表（未请求接口）')
    emit('saved', record)
    dialogVisible.value = false
  } finally {
    saving.value = false
  }
}
</script>

<style>
.cem-dialog .el-dialog__header {
  padding: 16px 20px 10px;
  margin: 0;
  border-bottom: 1px solid var(--border);
}
.cem-dialog .el-dialog__body {
  padding: 0 20px 16px;
  max-height: min(72vh, 640px);
  overflow-y: auto;
}
.cem-dialog .el-dialog__footer {
  padding: 12px 20px 16px;
  border-top: 1px solid var(--border);
}

.cem-header {
  display: flex;
  align-items: center;
  gap: 10px;
}
.cem-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
}

.cem-body {
  padding-top: 14px;
}
.cem-switch-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}
.cem-switch-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  min-width: 64px;
}

.cem-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 14px;
}
.cem-tab {
  background: none;
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 4px 12px;
  cursor: pointer;
  font-size: 12px;
  color: var(--text-secondary);
  transition: var(--transition);
}
.cem-tab:hover {
  border-color: var(--primary);
}
.cem-tab.active {
  background: var(--primary-light);
  border-color: var(--primary);
  color: var(--primary);
}
[data-theme='dark'] .cem-tab.active {
  background: rgba(37, 99, 235, 0.15);
}

.cem-sections {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.cem-section {
  padding: 14px 16px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--surface-hover);
}
.cem-section-title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 13px;
}
.cem-dot {
  width: 4px;
  height: 14px;
  border-radius: 2px;
  background: var(--primary);
  flex-shrink: 0;
}
.cem-dot.cem-dot-t {
  background: #0891b2;
}

.cem-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 16px;
}
.cem-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.cem-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
}
.cem-req {
  color: var(--danger);
}
.cem-hint {
  color: var(--primary);
  font-size: 11px;
  font-weight: 400;
  margin-left: 2px;
}
.cem-input-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}
.cem-unit {
  font-size: 13px;
  color: var(--text-muted);
}
.cem-na-text {
  font-size: 12px;
  color: var(--text-muted);
  font-style: italic;
}
.cem-na-box {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  border-radius: 6px;
  background: rgba(100, 116, 139, 0.06);
  font-size: 12px;
  color: var(--text-muted);
}

.lv-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 9px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
  border: 1px solid transparent;
}
.lv-tag.lv-sm {
  padding: 1px 6px;
  font-size: 10px;
}
.lv-v1 {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  color: #92400e;
  border-color: #fcd34d;
}
.lv-v2 {
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
  color: #065f46;
  border-color: #6ee7b7;
}
.lv-v3 {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  color: #1e40af;
  border-color: #93c5fd;
}
.lv-v4 {
  background: linear-gradient(135deg, #ede9fe, #ddd6fe);
  color: #5b21b6;
  border-color: #c4b5fd;
}
.lv-v5 {
  background: linear-gradient(135deg, #fce7f3, #fbcfe8);
  color: #9d174d;
  border-color: #f9a8d4;
}
[data-theme='dark'] .lv-v1 {
  background: rgba(217, 119, 6, 0.18);
  color: #fcd34d;
  border-color: rgba(217, 119, 6, 0.3);
}
[data-theme='dark'] .lv-v2 {
  background: rgba(22, 163, 74, 0.18);
  color: #86efac;
  border-color: rgba(22, 163, 74, 0.3);
}
[data-theme='dark'] .lv-v3 {
  background: rgba(37, 99, 235, 0.18);
  color: #93c5fd;
  border-color: rgba(37, 99, 235, 0.3);
}
[data-theme='dark'] .lv-v4 {
  background: rgba(124, 58, 237, 0.18);
  color: #c4b5fd;
  border-color: rgba(124, 58, 237, 0.3);
}
[data-theme='dark'] .lv-v5 {
  background: rgba(157, 23, 77, 0.18);
  color: #f9a8d4;
  border-color: rgba(157, 23, 77, 0.3);
}
</style>
