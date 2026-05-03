<template>
  <div class="ul-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color: var(--text-secondary)">运营</span>
      <span class="bc-sep">/</span>
      <span style="color: var(--text-secondary)">运营配置</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">工具配置</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <div ref="prdTipAnchorRef" class="page-header-title-anchor">
            <h1 class="page-title">工具配置</h1>
          </div>
          <p class="page-desc">分类与工具维护；prd-admin §7.1.3（Mock，各表 ≥20 条，默认每页 10 条）。</p>
        </div>
      </div>

      <PrdTipMarker
        :anchor-el="prdTipAnchorRef"
        :tip-id="1"
        module-name="工具配置（页头汇总）"
        :markdown="OPS_TIP_TOOL_CONFIG"
      />

      <div class="glass-card tab-nav-shell" role="tablist" aria-label="工具配置">
        <div class="tab-nav">
          <button
            id="tc-tab-cat"
            type="button"
            class="tab-item"
            role="tab"
            :class="{ active: tab === 'cat' }"
            :aria-selected="tab === 'cat'"
            :tabindex="tab === 'cat' ? 0 : -1"
            @click="tab = 'cat'"
          >
            分类配置
          </button>
          <button
            id="tc-tab-tool"
            type="button"
            class="tab-item"
            role="tab"
            :class="{ active: tab === 'tool' }"
            :aria-selected="tab === 'tool'"
            :tabindex="tab === 'tool' ? 0 : -1"
            @click="tab = 'tool'"
          >
            工具配置
          </button>
        </div>
      </div>

      <div v-if="tab === 'cat'" class="glass-card table-card" role="tabpanel" aria-labelledby="tc-tab-cat">
        <div class="table-header">
          <div class="table-title">分类列表<span class="table-count">本页 {{ catPg.pageRows.length }} 条</span></div>
          <button type="button" class="btn btn-primary btn-sm" @click="openCat()">新增分类</button>
        </div>
        <div class="ul-table-wrap">
          <table class="ul-table ul-table--fixed">
            <colgroup>
              <col style="width: 72px" />
              <col style="width: 18%" />
              <col style="width: 88px" />
              <col style="width: 72px" />
              <col style="width: 88px" />
              <col style="width: 88px" />
              <col style="width: 120px" />
              <col style="width: 100px" />
            </colgroup>
            <thead>
              <tr>
                <th>ID</th>
                <th>类型名称</th>
                <th class="th-num">工具数量</th>
                <th class="th-num">排序</th>
                <th>状态</th>
                <th>创建人</th>
                <th>创建时间</th>
                <th ref="prdTipCatOpsRef" class="col-action" style="text-align: center">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in catPg.pageRows" :key="c.id" class="ul-row">
                <td class="ul-mono">{{ c.id }}</td>
                <td style="font-weight: 600">{{ c.name }}</td>
                <td class="td-num">{{ c.toolCount }}</td>
                <td class="td-num">{{ c.sort }}</td>
                <td>
                  <span class="badge" :class="c.status === '显示' ? 'badge-success' : 'badge-gray'">{{ c.status }}</span>
                </td>
                <td>{{ c.creator }}</td>
                <td class="ul-muted" style="font-size: 12px">{{ c.createdAt }}</td>
                <td class="col-action">
                  <div class="action-btns" style="justify-content: center">
                    <button type="button" class="action-btn edit" title="编辑" @click="openCat(c)">编辑</button>
                    <button type="button" class="action-btn delete" title="删除" @click="confirmDelCat(c)">删除</button>
                  </div>
                </td>
              </tr>
              <tr v-if="catPg.pageRows.length === 0">
                <td colspan="8">
                  <div class="ul-empty">
                    <div class="ul-empty-title">暂无分类</div>
                    <p class="ul-empty-desc">请先新增分类。</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="categories.length > 0" class="ul-pagination">
          <span class="ul-page-info">共 <strong>{{ categories.length }}</strong> 条，第 <strong>{{ catPg.page }}</strong> / <strong>{{ catPg.totalPages }}</strong> 页</span>
          <div style="display: flex; gap: 4px">
            <button type="button" class="ul-pg-btn" :disabled="catPg.page <= 1" @click="catPg.goPage(1)">«</button>
            <button type="button" class="ul-pg-btn" :disabled="catPg.page <= 1" @click="catPg.goPage(catPg.page - 1)">‹</button>
            <button
              v-for="p in catPg.pageNums"
              :key="p"
              type="button"
              class="ul-pg-btn"
              :class="{ active: p === catPg.page }"
              @click="catPg.goPage(p)"
            >
              {{ p }}
            </button>
            <button type="button" class="ul-pg-btn" :disabled="catPg.page >= catPg.totalPages" @click="catPg.goPage(catPg.page + 1)">›</button>
            <button type="button" class="ul-pg-btn" :disabled="catPg.page >= catPg.totalPages" @click="catPg.goPage(catPg.totalPages)">»</button>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text-muted)">
            <span>每页</span>
            <select v-model.number="catPageSize" class="ul-pg-size" @change="catPg.resetPage()">
              <option :value="10">10</option>
              <option :value="20">20</option>
            </select>
            <span>跳至</span>
            <input
              v-model="catPg.jumpInput"
              type="text"
              class="ul-input"
              style="width: 52px; height: 30px; padding: 0 8px; font-size: 12px"
              @keyup.enter="catPg.applyJump"
            />
            <button type="button" class="btn btn-default btn-sm" @click="catPg.applyJump">跳转</button>
          </div>
        </div>
      </div>

      <template v-else>
        <div ref="prdTipToolFilterRef" class="glass-card ul-filter-card">
          <div class="ul-filter-grid">
            <div class="ul-form-group">
              <label class="ul-label">名称</label>
              <input v-model="toolF.name" type="text" class="ul-input" placeholder="工具名称关键字" />
            </div>
            <div class="ul-form-group">
              <label class="ul-label">所属分类</label>
              <select v-model="toolF.catId" class="ul-input ul-select">
                <option value="">全部分类</option>
                <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </div>
            <div class="ul-form-group">
              <label class="ul-label">状态</label>
              <select v-model="toolF.status" class="ul-input ul-select">
                <option value="">全部</option>
                <option value="显示">显示</option>
                <option value="隐藏">隐藏</option>
              </select>
            </div>
          </div>
          <div class="ul-filter-footer">
            <span class="ul-hint">筛选结果 {{ filteredTools.length }} 条 / 全量 {{ tools.length }} 条</span>
            <div style="display: flex; gap: 8px">
              <button type="button" class="btn btn-default btn-sm" @click="resetToolFilter">重置</button>
              <button type="button" class="btn btn-primary btn-sm" @click="toolPg.resetPage()">查询</button>
            </div>
          </div>
        </div>

        <div class="glass-card table-card" role="tabpanel" aria-labelledby="tc-tab-tool">
          <div class="table-header">
            <div class="table-title">工具列表<span class="table-count">本页 {{ toolPg.pageRows.length }} 条</span></div>
            <button type="button" class="btn btn-primary btn-sm" @click="openTool()">新增工具</button>
          </div>
          <div class="ul-table-wrap">
            <table class="ul-table ul-table--fixed">
              <colgroup>
                <col style="width: 56px" />
                <col style="width: 14%" />
                <col style="width: 72px" />
                <col style="width: 16%" />
                <col style="width: 72px" />
                <col style="width: 12%" />
                <col style="width: 72px" />
                <col style="width: 80px" />
                <col style="width: 72px" />
                <col style="width: 72px" />
                <col style="width: 80px" />
                <col style="width: 12%" />
                <col style="width: 100px" />
              </colgroup>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>工具名称</th>
                  <th>工具图标</th>
                  <th>描述</th>
                  <th>置顶</th>
                  <th>所属分类</th>
                  <th class="th-num">排序</th>
                  <th>状态</th>
                  <th class="th-num">点击次数</th>
                  <th class="th-num">使用次数</th>
                  <th>来源</th>
                  <th>跳转/详情</th>
                  <th ref="prdTipToolOpsRef" class="col-action" style="text-align: center">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="t in toolPg.pageRows" :key="t.id" class="ul-row">
                  <td class="ul-mono">{{ t.id }}</td>
                  <td style="font-weight: 600">{{ t.name }}</td>
                  <td class="ul-muted" style="font-size: 11px">ico</td>
                  <td class="ul-muted" style="font-size: 12px">{{ t.desc }}</td>
                  <td>{{ t.pinned ? '是' : '否' }}</td>
                  <td>{{ catName(t.catId) }}</td>
                  <td class="td-num">{{ t.sort }}</td>
                  <td>
                    <span class="badge" :class="t.status === '显示' ? 'badge-success' : 'badge-gray'">{{ t.status }}</span>
                  </td>
                  <td class="td-num">{{ t.clicks }}</td>
                  <td class="td-num">{{ t.uses }}</td>
                  <td><span class="tag tag-blue">{{ t.source }}</span></td>
                  <td class="ul-muted" style="font-size: 11px">{{ t.jumpOrDetail }}</td>
                  <td class="col-action">
                    <div class="action-btns" style="justify-content: center">
                      <button type="button" class="action-btn edit" title="编辑" @click="openTool(t)">编辑</button>
                      <button type="button" class="action-btn delete" title="删除" @click="confirmDelTool(t)">删除</button>
                    </div>
                  </td>
                </tr>
                <tr v-if="toolPg.pageRows.length === 0">
                  <td colspan="13">
                    <div class="ul-empty">
                      <div class="ul-empty-title">暂无工具</div>
                      <p class="ul-empty-desc">请调整筛选或新增工具。</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="filteredTools.length > 0" class="ul-pagination">
            <span class="ul-page-info">共 <strong>{{ filteredTools.length }}</strong> 条，第 <strong>{{ toolPg.page }}</strong> / <strong>{{ toolPg.totalPages }}</strong> 页</span>
            <div style="display: flex; gap: 4px">
              <button type="button" class="ul-pg-btn" :disabled="toolPg.page <= 1" @click="toolPg.goPage(1)">«</button>
              <button type="button" class="ul-pg-btn" :disabled="toolPg.page <= 1" @click="toolPg.goPage(toolPg.page - 1)">‹</button>
              <button
                v-for="p in toolPg.pageNums"
                :key="p"
                type="button"
                class="ul-pg-btn"
                :class="{ active: p === toolPg.page }"
                @click="toolPg.goPage(p)"
              >
                {{ p }}
              </button>
              <button type="button" class="ul-pg-btn" :disabled="toolPg.page >= toolPg.totalPages" @click="toolPg.goPage(toolPg.page + 1)">›</button>
              <button type="button" class="ul-pg-btn" :disabled="toolPg.page >= toolPg.totalPages" @click="toolPg.goPage(toolPg.totalPages)">»</button>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text-muted)">
              <span>每页</span>
              <select v-model.number="toolPageSize" class="ul-pg-size" @change="toolPg.resetPage()">
                <option :value="10">10</option>
                <option :value="20">20</option>
              </select>
              <span>跳至</span>
              <input
                v-model="toolPg.jumpInput"
                type="text"
                class="ul-input"
                style="width: 52px; height: 30px; padding: 0 8px; font-size: 12px"
                @keyup.enter="toolPg.applyJump"
              />
              <button type="button" class="btn btn-default btn-sm" @click="toolPg.applyJump">跳转</button>
            </div>
          </div>
        </div>
      </template>

      <PrdTipMarker
        v-if="tab === 'tool'"
        variant="filterCard"
        :anchor-el="prdTipToolFilterRef"
        :tip-id="2"
        module-name="工具配置 · 工具筛选区"
        :markdown="OPS_TIP_TOOL_FILTER"
      />
      <PrdTipMarker
        v-if="tab === 'cat'"
        variant="opsHeader"
        :anchor-el="prdTipCatOpsRef"
        :tip-id="3"
        module-name="工具配置 · 分类表 · 操作列"
        :markdown="OPS_TIP_TOOL_OPS_CAT"
      />
      <PrdTipMarker
        v-if="tab === 'tool'"
        variant="opsHeader"
        :anchor-el="prdTipToolOpsRef"
        :tip-id="4"
        module-name="工具配置 · 工具表 · 操作列"
        :markdown="OPS_TIP_TOOL_OPS_TOOL"
      />
    </div>

    <div class="ul-overlay" :class="{ show: catModal }" @click.self="catModal = false" />
    <div class="ul-modal flex-col" :class="{ show: catModal }" style="width: 420px">
      <div class="ul-modal-header">
        <div class="ul-modal-title">{{ catForm.id ? '编辑分类' : '新增分类' }}</div>
        <button type="button" class="ul-icon-btn" aria-label="关闭" @click="catModal = false">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div class="ul-modal-body" style="display: flex; flex-direction: column; gap: 12px">
        <div class="ul-form-group">
          <label class="ul-label">类型名称 <span style="color: var(--danger)">*</span></label>
          <input v-model="catForm.name" type="text" class="ul-input" />
        </div>
        <div class="ul-form-group">
          <label class="ul-label">状态</label>
          <select v-model="catForm.status" class="ul-input ul-select">
            <option value="显示">显示</option>
            <option value="隐藏">隐藏</option>
          </select>
        </div>
        <div class="ul-form-group">
          <label class="ul-label">排序</label>
          <input v-model.number="catForm.sort" type="number" class="ul-input" />
        </div>
      </div>
      <div class="ul-modal-footer">
        <button type="button" class="btn btn-default" @click="catModal = false">取消</button>
        <button type="button" class="btn btn-primary" @click="saveCat">保存</button>
      </div>
    </div>

    <div class="ul-overlay" :class="{ show: toolDw }" @click.self="toolDw = false" />
    <aside class="ul-drawer" :class="{ show: toolDw }" style="width: min(520px, 96vw)" @click.stop>
      <div class="ul-drawer-header">
        <div class="ul-drawer-title">{{ toolForm.id ? '编辑工具' : '新增工具' }}</div>
        <button type="button" class="ul-icon-btn" aria-label="关闭" @click="toolDw = false">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div class="ul-drawer-body" style="display: flex; flex-direction: column; gap: 12px">
        <div class="ul-form-group">
          <label class="ul-label">工具名称 <span style="color: var(--danger)">*</span></label>
          <input v-model="toolForm.name" type="text" class="ul-input" />
        </div>
        <div class="ul-form-group">
          <label class="ul-label">工具描述</label>
          <input v-model="toolForm.desc" type="text" class="ul-input" />
        </div>
        <div class="ul-form-group">
          <label class="ul-label">是否置顶（全平台仅一条）</label>
          <select v-model="toolForm.pinnedStr" class="ul-input ul-select">
            <option value="否">否</option>
            <option value="是">是</option>
          </select>
        </div>
        <div class="ul-form-group">
          <label class="ul-label">所属分类</label>
          <select v-model="toolForm.catId" class="ul-input ul-select">
            <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
        <div class="ul-form-group">
          <label class="ul-label">排序（越大越靠前）</label>
          <input v-model.number="toolForm.sort" type="number" class="ul-input" />
        </div>
        <div class="ul-form-group">
          <label class="ul-label">状态</label>
          <select v-model="toolForm.status" class="ul-input ul-select">
            <option value="显示">显示</option>
            <option value="隐藏">隐藏</option>
          </select>
        </div>
        <div class="ul-form-group">
          <label class="ul-label">工具来源</label>
          <select v-model="toolForm.source" class="ul-input ul-select">
            <option value="端内">端内</option>
            <option value="端外">端外</option>
          </select>
        </div>
        <div v-if="toolForm.source === '端内'" class="ul-form-group">
          <label class="ul-label">跳转地址</label>
          <input v-model="toolForm.jump" type="text" class="ul-input" />
        </div>
        <div v-else class="ul-form-group">
          <label class="ul-label">工具详情（富文本 Mock）</label>
          <textarea v-model="toolForm.detail" class="ul-input" rows="3"></textarea>
        </div>
      </div>
      <div class="ul-drawer-footer">
        <button type="button" class="btn btn-default" @click="toolDw = false">取消</button>
        <button type="button" class="btn btn-primary" @click="saveTool">保存</button>
      </div>
    </aside>

    <div class="ul-overlay" :class="{ show: catDelOpen }" @click.self="catDelOpen = false" />
    <div class="ul-modal flex-col" :class="{ show: catDelOpen }" style="width: 420px">
      <div class="ul-modal-header">
        <div class="ul-modal-title">确认删除</div>
        <button type="button" class="ul-icon-btn" aria-label="关闭" @click="catDelOpen = false">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div class="ul-modal-body">
        <p class="page-desc" style="margin: 0">将删除分类「{{ catDelTarget?.name }}」及其下工具关联（Mock）？</p>
      </div>
      <div class="ul-modal-footer">
        <button type="button" class="btn btn-default" @click="catDelOpen = false">取消</button>
        <button type="button" class="btn btn-danger" @click="doDelCat">确认</button>
      </div>
    </div>

    <div class="ul-overlay" :class="{ show: toolDelOpen }" @click.self="toolDelOpen = false" />
    <div class="ul-modal flex-col" :class="{ show: toolDelOpen }" style="width: 420px">
      <div class="ul-modal-header">
        <div class="ul-modal-title">确认删除</div>
        <button type="button" class="ul-icon-btn" aria-label="关闭" @click="toolDelOpen = false">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div class="ul-modal-body">
        <p class="page-desc" style="margin: 0">将删除工具「{{ toolDelTarget?.name }}」？（Mock）</p>
      </div>
      <div class="ul-modal-footer">
        <button type="button" class="btn btn-default" @click="toolDelOpen = false">取消</button>
        <button type="button" class="btn btn-danger" @click="doDelTool">确认</button>
      </div>
    </div>

    <div class="ul-toast-container">
      <div v-for="t in toasts" :key="t.id" class="ul-toast" :class="t.type">
        <span style="flex: 1">{{ t.msg }}</span>
        <button type="button" class="ul-toast-close" aria-label="关闭通知" @click="removeToast(t.id)">✕</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PrdTipMarker from '@/components/prd/PrdTipMarker.vue'
import { useEscCloseStack } from '@/composables/useEscCloseStack'
import { useOpsListPagination } from '@/composables/useOpsListPagination'
import {
  OPS_TIP_TOOL_CONFIG,
  OPS_TIP_TOOL_FILTER,
  OPS_TIP_TOOL_OPS_CAT,
  OPS_TIP_TOOL_OPS_TOOL,
} from '@/prd-tips/opsDomainTips'
import { computed, ref } from 'vue'
import { useSimpleToast } from './useOpsToast'

interface Cat {
  id: string
  name: string
  toolCount: number
  sort: number
  status: string
  creator: string
  createdAt: string
}
interface Tool {
  id: string
  name: string
  desc: string
  pinned: boolean
  catId: string
  sort: number
  status: string
  clicks: number
  uses: number
  source: string
  jumpOrDetail: string
}

function genCats(n: number): Cat[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `TC${i + 1}`,
    name: `工具分类-${String(i + 1).padStart(2, '0')}`,
    toolCount: 1 + (i % 8),
    sort: 30 - (i % 20),
    status: i % 9 === 0 ? '隐藏' : '显示',
    creator: ['运营A', '运营B'][i % 2],
    createdAt: `2026-03-${String((i % 28) + 1).padStart(2, '0')}`,
  }))
}

function genTools(n: number, catIds: string[]): Tool[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `T${9000 + i}`,
    name: `工具-${String(i + 1).padStart(2, '0')}-${(i * 7) % 100}`,
    desc: `描述摘要 ${i % 5}`,
    pinned: i === 0,
    catId: catIds[i % catIds.length] ?? catIds[0],
    sort: 100 - (i % 40),
    status: i % 6 === 0 ? '隐藏' : '显示',
    clicks: 200 + i * 17,
    uses: 50 + i * 3,
    source: i % 3 === 0 ? '端外' : '端内',
    jumpOrDetail: i % 3 === 0 ? `摘要 ${i}` : `/app/tools/${i}`,
  }))
}

const { toasts, toast, removeToast } = useSimpleToast()
const prdTipAnchorRef = ref<HTMLElement | null>(null)
const prdTipCatOpsRef = ref<HTMLElement | null>(null)
const prdTipToolFilterRef = ref<HTMLElement | null>(null)
const prdTipToolOpsRef = ref<HTMLElement | null>(null)
const tab = ref<'cat' | 'tool'>('cat')

const categories = ref(genCats(22))
const tools = ref(genTools(22, categories.value.map((c) => c.id)))

const catPageSize = ref(10)
const catPg = useOpsListPagination(categories, catPageSize, (msg) => toast(msg, 'error'))

const toolF = ref({ name: '', catId: '', status: '' })
const filteredTools = computed(() =>
  tools.value.filter((t) => {
    if (toolF.value.name && !t.name.includes(toolF.value.name)) return false
    if (toolF.value.catId && t.catId !== toolF.value.catId) return false
    if (toolF.value.status && t.status !== toolF.value.status) return false
    return true
  })
)
const toolPageSize = ref(10)
const toolPg = useOpsListPagination(filteredTools, toolPageSize, (msg) => toast(msg, 'error'))

function resetToolFilter() {
  toolF.value = { name: '', catId: '', status: '' }
  toolPg.resetPage()
}

function catName(id: string) {
  return categories.value.find((c) => c.id === id)?.name ?? id
}

const catModal = ref(false)
const toolDw = ref(false)
const catDelOpen = ref(false)
const catDelTarget = ref<Cat | null>(null)
const toolDelOpen = ref(false)
const toolDelTarget = ref<Tool | null>(null)

useEscCloseStack([
  { isOpen: () => toolDelOpen.value, close: () => (toolDelOpen.value = false) },
  { isOpen: () => catDelOpen.value, close: () => (catDelOpen.value = false) },
  { isOpen: () => toolDw.value, close: () => (toolDw.value = false) },
  { isOpen: () => catModal.value, close: () => (catModal.value = false) },
])

function confirmDelCat(c: Cat) {
  catDelTarget.value = c
  catDelOpen.value = true
}
function doDelCat() {
  const id = catDelTarget.value?.id
  if (!id) return
  tools.value = tools.value.filter((t) => t.catId !== id)
  categories.value = categories.value.filter((c) => c.id !== id)
  catDelOpen.value = false
  catDelTarget.value = null
  toast('已删除分类（Mock）', 'success')
}

function confirmDelTool(t: Tool) {
  toolDelTarget.value = t
  toolDelOpen.value = true
}
function doDelTool() {
  const id = toolDelTarget.value?.id
  if (!id) return
  tools.value = tools.value.filter((t) => t.id !== id)
  toolDelOpen.value = false
  toolDelTarget.value = null
  toast('已删除工具（Mock）', 'success')
}

const catForm = ref({ id: '', name: '', status: '显示' as string, sort: 0 })
function openCat(c?: Cat) {
  catForm.value = c ? { id: c.id, name: c.name, status: c.status, sort: c.sort } : { id: '', name: '', status: '显示', sort: 0 }
  catModal.value = true
}
function saveCat() {
  if (!catForm.value.name.trim()) {
    toast('请填写类型名称', 'error')
    return
  }
  toast('已保存分类（Mock）', 'success')
  catModal.value = false
}

const toolForm = ref({
  id: '',
  name: '',
  desc: '',
  pinnedStr: '否',
  catId: 'TC1',
  sort: 10,
  status: '显示',
  source: '端内' as '端内' | '端外',
  jump: '',
  detail: '',
})

function openTool(t?: Tool) {
  toolForm.value = t
    ? {
        id: t.id,
        name: t.name,
        desc: t.desc,
        pinnedStr: t.pinned ? '是' : '否',
        catId: t.catId,
        sort: t.sort,
        status: t.status,
        source: t.source as '端内' | '端外',
        jump: t.source === '端内' ? t.jumpOrDetail : '',
        detail: t.source === '端外' ? t.jumpOrDetail : '',
      }
    : {
        id: '',
        name: '',
        desc: '',
        pinnedStr: '否',
        catId: categories.value[0]?.id ?? 'TC1',
        sort: 10,
        status: '显示',
        source: '端内',
        jump: '',
        detail: '',
      }
  toolDw.value = true
}

function saveTool() {
  if (!toolForm.value.name.trim()) {
    toast('请填写工具名称', 'error')
    return
  }
  if (toolForm.value.pinnedStr === '是') {
    const other = tools.value.some((x) => x.pinned && x.id !== toolForm.value.id)
    if (other) {
      toast('全平台仅允许一条置顶，请先取消其他工具置顶', 'error')
      return
    }
  }
  toast('已保存工具（Mock）', 'success')
  toolDw.value = false
}
</script>
