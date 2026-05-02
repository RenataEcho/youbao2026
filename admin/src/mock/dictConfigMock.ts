import keywordTsv from './data/dict-keyword.tsv?raw'
import postVideoTsv from './data/dict-post-video.tsv?raw'
import orderDataTableTsv from './data/dict-order-data-table.tsv?raw'

export type DictCategory = 'keyword' | 'work' | 'order'

export type DictConfigRow = {
  id: number
  /** 字段注释（中文说明） */
  fieldComment: string
  /** 字段名称（英文 key，与筛选项「字段名称」一致） */
  fieldName: string
  status: 'enabled' | 'disabled'
  remark: string
  createdAt: string
  /** 数据表配置字典：业务类型 */
  categoryType?: DictCategory
}

const TABLE_TYPE_MAP: Record<string, DictCategory> = {
  订单表: 'order',
  关键词表: 'keyword',
  作品表: 'work',
}

function padTime(n: number) {
  return String(n).padStart(2, '0')
}

function fakeCreatedAt(id: number) {
  const d = 1 + (id % 28)
  const h = 9 + (id % 8)
  return `2024-01-${padTime(d)} ${padTime(h)}:${padTime((id * 3) % 60)}:00`
}

function parseTwoColTsv(raw: string, startId: number): DictConfigRow[] {
  const lines = raw
    .trim()
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
  const rows: DictConfigRow[] = []
  let id = startId
  for (const line of lines) {
    const tab = line.indexOf('\t')
    if (tab < 0) continue
    const fieldComment = line.slice(0, tab).trim()
    const fieldName = line.slice(tab + 1).trim()
    if (!fieldName) continue
    const rowId = id++
    rows.push({
      id: rowId,
      fieldComment,
      fieldName,
      status: 'enabled',
      remark: '',
      createdAt: fakeCreatedAt(rowId),
    })
  }
  return rows
}

function parseOrderDataTable(raw: string): DictConfigRow[] {
  const lines = raw
    .trim()
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
  const header = lines[0]?.includes('字段标题') && lines[0]?.includes('字段')
  const body = header ? lines.slice(1) : lines
  const rows: DictConfigRow[] = []
  let id = 1
  for (const line of body) {
    const parts = line.split('\t')
    if (parts.length < 3) continue
    const tableType = parts[0].trim()
    const fieldComment = parts[1].trim()
    const fieldName = parts[2].trim()
    const cat = TABLE_TYPE_MAP[tableType]
    if (!cat || !fieldName) continue
    const rowId = id++
    rows.push({
      id: rowId,
      fieldComment,
      fieldName,
      status: 'enabled',
      remark: '',
      createdAt: fakeCreatedAt(rowId),
      categoryType: cat,
    })
  }
  return rows
}

export const MOCK_DICT_KEYWORD: DictConfigRow[] = parseTwoColTsv(keywordTsv, 1)

export const MOCK_DICT_POST_VIDEO: DictConfigRow[] = parseTwoColTsv(postVideoTsv, 1)

export const MOCK_DICT_DATA_TABLE: DictConfigRow[] = parseOrderDataTable(orderDataTableTsv)

/** 其他字段：初始可维护空表示例 */
export const MOCK_DICT_OTHER: DictConfigRow[] = [
  {
    id: 1,
    fieldComment: '自定义扩展 A',
    fieldName: 'custom_ext_a',
    status: 'enabled',
    remark: '示例',
    createdAt: '2024-03-01 11:00:00',
  },
  {
    id: 2,
    fieldComment: '预留字段 B',
    fieldName: 'reserved_b',
    status: 'disabled',
    remark: '',
    createdAt: '2024-03-02 14:20:00',
  },
]

export function categoryTypeLabel(t: DictCategory | undefined) {
  if (!t) return '—'
  return { keyword: '关键词', work: '作品', order: '订单' }[t]
}

export function cloneRows<T>(rows: T[]): T[] {
  return JSON.parse(JSON.stringify(rows)) as T[]
}
