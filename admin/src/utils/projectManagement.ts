/**
 * 项目管理 — 与 project.md 对齐的数据结构与兼容逻辑。
 * PRD 原文中「门槛」与「所属赛道」均写作 track，此处拆为 entryBarrier / trackRef；
 * 「排序」数字为 sort；标签 icon 为 tagIcons（最多 3 个）。
 */

export type ProjectCategory = '推文' | '短剧' | '资源' | '应用'
export type YesNo = 'yes' | 'no'
export type ShowHide = 'show' | 'hide'
export type OnlineOffline = 'online' | 'offline'
export type OnOff = 'on' | 'off'
export type ContentType = 'article' | 'video'

export interface DetailSection {
  title: string
  description: string
  contentType: ContentType
  content: string
  visible: YesNo
}

export type IntroChildKey =
  | 'projectDescription'
  | 'keywordRequirements'
  | 'backfill'
  | 'order'
  | 'settlement'

export interface IntroductionBlock extends DetailSection {
  children: Record<IntroChildKey, DetailSection>
}

export interface ProjectDetail {
  introduction: IntroductionBlock
  process: DetailSection
  notice: DetailSection
  teaching: DetailSection
}

/** 标签 icon，固定三个槽位，可为空字符串 */
export type ProjectTagIcons = [string, string, string]

export interface ProjectRow {
  id: number
  seq: number
  category: ProjectCategory
  frontTitle: string
  backTitle: string
  projectEn: string
  projectTags: string
  tagTitle: string
  projectIcon: string
  /** 标签 icon，最多 3 个（三槽位） */
  tagIcons: ProjectTagIcons
  sort: number
  /** 日结 / 周结 / 月结 / T+N */
  settlement_cycle: string
  settlementTN: number
  booklistLink: string
  /** 门槛：0门槛、需账号、要资质 */
  entryBarrier: string
  /** 所属赛道（关联赛道类型配置） */
  trackRef: string
  business: string
  memberType: string
  updateTime: string
  /** 关键词过期时长（天） */
  expireDays: number
  projectStatus: ShowHide
  onlineState: OnlineOffline
  hotProject: YesNo
  isNewProduct: YesNo
  isBackfill: YesNo
  forbidPromptWords: YesNo
  adminHidden: YesNo
  transferGift: OnOff
  isToutiao: YesNo
  officialPrompts: YesNo
  isBatch: YesNo
  /** 是否海外：yes=国外项目，no=国内项目 */
  isOverseas: YesNo
  detail: ProjectDetail
}

export function emptyDetailSection(title: string, description = ''): DetailSection {
  return {
    title,
    description,
    contentType: 'article',
    content: '',
    visible: 'yes',
  }
}

export function createDefaultProjectDetail(): ProjectDetail {
  return {
    introduction: {
      ...emptyDetailSection('项目介绍', ''),
      children: {
        projectDescription: emptyDetailSection('项目说明', '项目概览与收益结构介绍'),
        keywordRequirements: emptyDetailSection('关键词要求', '搜索与话题标签约束规则'),
        backfill: emptyDetailSection('回填', '订单与转化回填规则'),
        order: emptyDetailSection('订单', '从选书到出单的下单流程'),
        settlement: emptyDetailSection('结算', '打款与对账说明'),
      },
    },
    process: emptyDetailSection('项目流程', ''),
    notice: emptyDetailSection('特别注意', ''),
    teaching: emptyDetailSection('项目教学', ''),
  }
}

function isDetailSection(x: unknown): x is DetailSection {
  if (!x || typeof x !== 'object') return false
  const o = x as Record<string, unknown>
  return (
    typeof o.title === 'string' &&
    typeof o.description === 'string' &&
    (o.contentType === 'article' || o.contentType === 'video') &&
    typeof o.content === 'string' &&
    (o.visible === 'yes' || o.visible === 'no')
  )
}

function mergeSection(base: DetailSection, patch: unknown): DetailSection {
  if (!isDetailSection(patch)) return { ...base }
  return {
    title: patch.title || base.title,
    description: patch.description ?? base.description,
    contentType: patch.contentType === 'video' ? 'video' : 'article',
    content: typeof patch.content === 'string' ? patch.content : base.content,
    visible: patch.visible === 'no' ? 'no' : 'yes',
  }
}

/**
 * 将接口/历史数据规范为 project.md 约定的 detail 结构。
 */
export function normalizeProjectManagementDetail(raw: unknown): ProjectDetail {
  const def = createDefaultProjectDetail()
  if (!raw || typeof raw !== 'object') return def

  const r = raw as Record<string, unknown>

  // 新版：四板块
  if (r.introduction || r.process || r.notice || r.teaching) {
    const introRaw = r.introduction
    let introduction = def.introduction
    if (introRaw && typeof introRaw === 'object') {
      const ir = introRaw as Record<string, unknown>
      const ch = ir.children
      introduction = {
        ...mergeSection(def.introduction, ir),
        children: { ...def.introduction.children },
      }
      if (ch && typeof ch === 'object') {
        const cr = ch as Record<string, unknown>
        ;(Object.keys(introduction.children) as IntroChildKey[]).forEach((k) => {
          if (cr[k]) introduction.children[k] = mergeSection(introduction.children[k], cr[k])
        })
      }
    }
    return {
      introduction,
      process: mergeSection(def.process, r.process),
      notice: mergeSection(def.notice, r.notice),
      teaching: mergeSection(def.teaching, r.teaching),
    }
  }

  // 旧版：单块或任意对象 → 写入「项目说明」子模块，其余保持默认
  const legacyContent =
    typeof r.content === 'string'
      ? r.content
      : typeof r.html === 'string'
        ? r.html
        : ''
  const legacyTitle = typeof r.title === 'string' ? r.title : ''
  const out = createDefaultProjectDetail()
  out.introduction.children.projectDescription = {
    ...out.introduction.children.projectDescription,
    title: legacyTitle || out.introduction.children.projectDescription.title,
    content: legacyContent,
    contentType: r.contentType === 'video' ? 'video' : 'article',
  }
  return out
}

/** 兼容旧字段 stampUrl → tagIcons[0] */
export function normalizeTagIcons(input: {
  tagIcons?: unknown
  stampUrl?: string
}): ProjectTagIcons {
  let slots: string[] = []
  if (Array.isArray(input.tagIcons)) {
    slots = input.tagIcons.map((x) => (typeof x === 'string' ? x : '')).slice(0, 3)
  }
  if (!slots.length && typeof input.stampUrl === 'string' && input.stampUrl.trim()) {
    slots = [input.stampUrl.trim()]
  }
  while (slots.length < 3) slots.push('')
  return [slots[0] ?? '', slots[1] ?? '', slots[2] ?? '']
}

export function rowToForm(row: ProjectRow & { stampUrl?: string }): ProjectRow {
  const detail = normalizeProjectManagementDetail(row.detail)
  const tagIcons = normalizeTagIcons(row)
  const base = { ...row, detail: JSON.parse(JSON.stringify(detail)) as ProjectDetail, tagIcons }
  delete (base as ProjectRow & { stampUrl?: string; sortTab?: string }).stampUrl
  delete (base as ProjectRow & { sortTab?: string }).sortTab
  if (base.isOverseas !== 'yes' && base.isOverseas !== 'no') base.isOverseas = 'no'
  return base as ProjectRow
}

export function createEmptyProjectRow(id: number): ProjectRow {
  return {
    id,
    seq: id,
    category: '推文',
    frontTitle: '',
    backTitle: '',
    projectEn: '',
    projectTags: '',
    tagTitle: '',
    projectIcon: '',
    tagIcons: ['', '', ''],
    sort: 0,
    settlement_cycle: '日结',
    settlementTN: 7,
    booklistLink: '',
    entryBarrier: '0门槛',
    trackRef: '',
    business: '',
    memberType: '全部',
    updateTime: '',
    expireDays: 360,
    projectStatus: 'show',
    onlineState: 'offline',
    hotProject: 'no',
    isNewProduct: 'no',
    isBackfill: 'yes',
    forbidPromptWords: 'no',
    adminHidden: 'no',
    transferGift: 'off',
    isToutiao: 'no',
    officialPrompts: 'no',
    isBatch: 'no',
    isOverseas: 'no',
    detail: createDefaultProjectDetail(),
  }
}

/** 深拷贝写入 reactive 表单 */
export function cloneProjectRow(row: ProjectRow): ProjectRow {
  return JSON.parse(JSON.stringify(row)) as ProjectRow
}
