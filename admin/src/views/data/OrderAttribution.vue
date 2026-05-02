<template>
  <div class="dq-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">首页</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">数据</span>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">查询工具</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">官方订单归属</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">官方订单归属</h1>
          <p class="page-desc">单品牌多平台词包订单归因；上传批次管理与清洗结果下载（PRD §6.2.7）</p>
        </div>
        <button type="button" class="btn btn-primary btn-sm" @click="openUpload">上传批次</button>
      </div>

      <div class="glass-card" style="padding:14px 18px;display:flex;flex-wrap:wrap;gap:20px;align-items:center">
        <div class="oa-stat"><span class="oa-stat-l">今日上传批次</span><strong>{{ stats.today }}</strong></div>
        <div class="oa-stat"><span class="oa-stat-l">处理成功</span><strong class="ok">{{ stats.ok }}</strong></div>
        <div class="oa-stat"><span class="oa-stat-l">处理中</span><strong class="run">{{ stats.run }}</strong></div>
        <div class="oa-stat"><span class="oa-stat-l">处理失败</span><strong class="fail">{{ stats.fail }}</strong></div>
      </div>

      <div class="glass-card table-card">
        <div class="table-header">
          <div class="table-title">批次列表<span class="table-count">共 {{ batches.length }} 条</span></div>
        </div>
        <div class="ul-table-wrap">
          <table class="ul-table ul-table--fixed">
            <colgroup>
              <col v-for="n in 5" :key="'c'+n" style="width:15%">
              <col class="col-action" style="width:25%" />
            </colgroup>
            <thead>
              <tr>
                <th>源文件</th>
                <th>关联项目名称</th>
                <th>上传时间</th>
                <th>处理状态</th>
                <th>数据情况</th>
                <th class="col-action">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="b in batches" :key="b.id">
                <td class="ul-mono">{{ b.file }}</td>
                <td>{{ b.project }}</td>
                <td class="td-muted">{{ b.uploaded }}</td>
                <td><span class="tag" :class="statusClass(b.status)">{{ b.status }}</span></td>
                <td class="oa-summary">{{ b.summary }}</td>
                <td class="col-action">
                  <div class="action-btns action-btns--end">
                    <button type="button" class="action-btn view" @click="mockDl('源文件', b.file)">源文件</button>
                    <button type="button" class="action-btn view" :disabled="b.status === '处理中'" @click="mockDl('清洗结果', b.file)">清洗结果</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 上传抽屉 -->
    <div class="ul-overlay" :class="{ show: uploadOpen }" @click="uploadOpen = false" />
    <aside class="ul-drawer" :class="{ show: uploadOpen }" @click.stop>
      <div class="ul-drawer-header">
        <div class="ul-drawer-title">上传归因批次</div>
        <button type="button" class="ul-icon-btn" aria-label="关闭" @click="uploadOpen = false">×</button>
      </div>
      <div class="ul-drawer-body">
        <div class="ul-form-group">
          <label class="ul-label">选择项目</label>
          <select v-model="form.project" class="ul-input ul-select">
            <option value="">请选择右豹侧品牌项目</option>
            <option v-for="p in projects" :key="p" :value="p">{{ p }}</option>
          </select>
        </div>
        <div class="ul-form-group">
          <label class="ul-label">选择归因字段</label>
          <select v-model="form.attrField" class="ul-input ul-select">
            <option value="">请选择归因维度</option>
            <option value="video_id">video_id</option>
            <option value="order_sn">order_sn</option>
            <option value="promotion_id">promotion_id</option>
          </select>
        </div>
        <div class="ul-form-group">
          <label class="ul-label">上传文件</label>
          <input type="file" class="ul-input" accept=".xlsx,.xls,.csv" @change="onFile">
          <p style="font-size:11px;color:var(--text-muted);margin-top:6px">演示环境不实际上传；格式与大小限制接入后端时约束。</p>
        </div>
      </div>
      <div class="ul-drawer-footer" style="display:flex;justify-content:flex-end;gap:10px">
        <button type="button" class="btn btn-default" @click="resetForm">重置</button>
        <button type="button" class="btn btn-primary" @click="confirmUpload">确定上传</button>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'

const uploadOpen = ref(false)
const form = ref({ project: '', attrField: '', file: null as File | null })

const projects = ['番茄小说推文', '红果短剧推广', '百度网盘拉新']

const batches = ref([
  { id: '1', file: 'batch_youboom_0428.xlsx', project: '番茄小说推文', uploaded: '2026-04-28 10:22:06', status: '处理成功', summary: '右豹：12,420 条；youboom：12,388 条' },
  { id: '2', file: 'batch_mix_0429.csv', project: '红果短剧推广', uploaded: '2026-04-29 15:01:33', status: '部分成功', summary: '右豹：8,102 条；youboom：8,090 条' },
  { id: '3', file: 'batch_pending_0430.xlsx', project: '百度网盘拉新', uploaded: '2026-04-30 09:18:44', status: '处理中', summary: '—' },
  { id: '4', file: 'batch_bad_0427.xlsx', project: '番茄小说推文', uploaded: '2026-04-27 18:40:12', status: '处理失败', summary: '格式校验失败' },
])

const stats = computed(() => ({
  today: batches.value.filter((b) => b.uploaded.startsWith('2026-04-30')).length,
  ok: batches.value.filter((b) => b.status === '处理成功').length,
  run: batches.value.filter((b) => b.status === '处理中').length,
  fail: batches.value.filter((b) => b.status === '处理失败').length,
}))

function statusClass(s: string) {
  if (s === '处理成功') return 'tag-green'
  if (s === '处理中') return 'tag-amber'
  if (s === '部分成功') return 'tag-blue'
  return 'tag-gray'
}

function openUpload() {
  uploadOpen.value = true
}

function resetForm() {
  form.value = { project: '', attrField: '', file: null }
}

function onFile(e: Event) {
  const t = e.target as HTMLInputElement
  form.value.file = t.files?.[0] ?? null
}

function confirmUpload() {
  ElMessage.success('已提交归因任务（演示）')
  uploadOpen.value = false
  resetForm()
}

function mockDl(kind: string, name: string) {
  ElMessage.info(`下载 ${kind}：${name}（演示）`)
}
</script>

<style scoped>
.dq-wrap { min-height: 100%; }
.oa-stat { display: flex; align-items: baseline; gap: 8px; font-size: 13px; color: var(--text-secondary); }
.oa-stat strong { font-size: 18px; color: var(--text-primary); font-variant-numeric: tabular-nums; }
.oa-stat-l { color: var(--text-muted); }
.oa-stat .ok { color: var(--success); }
.oa-stat .run { color: var(--warning); }
.oa-stat .fail { color: var(--danger); }
.td-muted { font-size: 12px; color: var(--text-muted); white-space: nowrap; }
.oa-summary { font-size: 12px; color: var(--text-secondary); }
</style>
