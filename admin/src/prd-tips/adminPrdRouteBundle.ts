/**
 * 全站菜单路由与 prd-admin 章节对照 + 原型批注 Markdown（Workflow C 风格）。
 * 筛选项/表字段/操作细则以 PRD 正文为准；此处做「章节锚点 + 模块边界」聚合，避免与 PRD 逐字重复导致漂移。
 */
import rawMeta from './adminPrdRouteMeta.json'

export type AdminPrdRouteMetaRow = {
  label: string
  prd: string
  f: boolean
  o: boolean
}

const meta = rawMeta as Record<string, AdminPrdRouteMetaRow>

export type AdminPrdTipSlice = {
  moduleName: string
  md: string
}

export type AdminPrdTipBundle = {
  page: AdminPrdTipSlice
  filter?: AdminPrdTipSlice
  ops?: AdminPrdTipSlice
  /** 有筛选时操作列为 3，无筛选时操作列为 2 */
  opsTipId: 2 | 3
}

function pageMd(prd: string, label: string): string {
  return `**PRD 对照**：${prd}

**推断功能（页头）**

- 本菜单对应后台 **${label}**；权威字段、流程与异常口径以 PRD 上述章节为准。
- 布局、卡片、表格、筛选、抽屉/弹窗等视觉与交互以根目录 **UIUX.md** 及 \`admin/\` 既有页面壳为准。`
}

function filterMd(prd: string, label: string): string {
  return `**PRD 对照**：${prd} — 筛选区

**推断功能**

- 各筛选项含义、默认值、查询/重置/展开更多筛选行为以 PRD **「筛选条件」** 小节为准。
- 「展开更多筛选」按钮样式与类名使用全局 **\`ul-expand-btn\`**（见 UIUX / theme.css）。`
}

function opsMd(prd: string, label: string): string {
  return `**PRD 对照**：${prd} — 数据表操作 / 批量操作

**推断功能**

- 行内操作、表头批量、权限与二次确认以 PRD **「数据表操作」**、**「批量操作（表头）」** 等小节为准。
- 若本页无独立「操作」列（如纯导出/只读表），以 PRD 对「导出」「只读」描述为准。`
}

function buildBundle(row: AdminPrdRouteMetaRow): AdminPrdTipBundle {
  const { label, prd, f, o } = row
  const page: AdminPrdTipSlice = {
    moduleName: `${label}（页头汇总）`,
    md: pageMd(prd, label),
  }
  const filter: AdminPrdTipSlice | undefined = f
    ? {
        moduleName: `${label} · 筛选区`,
        md: filterMd(prd, label),
      }
    : undefined
  const ops: AdminPrdTipSlice | undefined = o
    ? {
        moduleName: `${label} · 操作列`,
        md: opsMd(prd, label),
      }
    : undefined
  return {
    page,
    filter,
    ops,
    opsTipId: f && o ? 3 : 2,
  }
}

const cache: Record<string, AdminPrdTipBundle> = {}

/** 按 vue-router 的 `route.name` 取本页三套批注文案（与持久化键 `RouteName:tipId` 一致） */
export function getAdminPrdTipBundle(routeName: string | symbol | undefined | null): AdminPrdTipBundle {
  const key = String(routeName ?? '')
  if (cache[key]) return cache[key]
  const row = meta[key]
  if (!row) {
    const fallback: AdminPrdRouteMetaRow = {
      label: key || '当前页',
      prd: `（未在 adminPrdRouteMeta.json 建档，route.name=${key || 'empty'}）`,
      f: false,
      o: false,
    }
    const b = buildBundle(fallback)
    cache[key] = b
    return b
  }
  const b = buildBundle(row)
  cache[key] = b
  return b
}

export function hasAdminPrdTipMeta(routeName: string | symbol | undefined | null): boolean {
  return Boolean(meta[String(routeName ?? '')])
}
