import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import type { MockMethod } from 'vite-plugin-mock'
import type { CommissionItem, CommissionLog } from '../types'

/**
 * 持久化路径仅用 process.cwd()，且本文件自包含 store，避免 vite-plugin-mock / bundle-require
 * 对 mock 目录下多个 .ts 打包注入时出现重复符号。
 */
const COMMISSION_STORE_PATH = (() => {
  const cwd = process.cwd()
  const inAdminPkg = join(cwd, 'src/mock/data/commission-store.json')
  const fromMonorepoRoot = join(cwd, 'admin/src/mock/data/commission-store.json')
  if (existsSync(join(cwd, 'admin/package.json'))) return fromMonorepoRoot
  return inAdminPkg
})()

interface CommissionPersisted {
  commissions: CommissionItem[]
  logs: CommissionLog[]
}

function clone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x)) as T
}

const DEFAULT_COMMISSIONS: CommissionItem[] = [
  {
    id: 1,
    level: 'V1',
    enabled: true,
    createdAt: '2026-01-10 09:00:00',
    updatedAt: '2026-04-20 10:30:22',
    operator: '超级管理员',
    targets: [
      { targetLevel: 'V1', user: { direct: 3.0, indirect: 2.0, infinite: null }, team: null },
    ],
  },
  {
    id: 2,
    level: 'V2',
    enabled: true,
    createdAt: '2026-01-10 09:00:00',
    updatedAt: '2026-04-20 10:30:45',
    operator: '超级管理员',
    targets: [
      { targetLevel: 'V1', user: { direct: 5.0, indirect: 3.0, infinite: 1.0 }, team: null },
      {
        targetLevel: 'V2',
        user: { direct: 5.0, indirect: 2.5, infinite: null },
        team: { direct: 2.0, indirect: 1.0, infinite: null },
      },
    ],
  },
  {
    id: 3,
    level: 'V3',
    enabled: true,
    createdAt: '2026-01-10 09:00:00',
    updatedAt: '2026-04-22 14:15:38',
    operator: '超级管理员',
    targets: [
      { targetLevel: 'V1', user: { direct: 8.5, indirect: 5.5, infinite: 3.5 }, team: null },
      {
        targetLevel: 'V2',
        user: { direct: 8.5, indirect: 4.0, infinite: null },
        team: { direct: 3.5, indirect: 2.0, infinite: 1.0 },
      },
      {
        targetLevel: 'V3',
        user: { direct: 8.5, indirect: 3.5, infinite: null },
        team: { direct: 3.5, indirect: 2.0, infinite: null },
      },
    ],
  },
]

const DEFAULT_LOGS: CommissionLog[] = [
  {
    id: 1,
    commissionId: 1,
    op: '编辑分佣配置',
    detail: '修改 V1 直邀比例：2.50% → 3.00%，间邀比例：1.50% → 2.00%',
    operator: '超级管理员',
    time: '2026-04-20 10:30:22',
  },
  {
    id: 2,
    commissionId: 1,
    op: '启用配置',
    detail: '将 V1 分佣配置状态设为启用',
    operator: '超级管理员',
    time: '2026-03-15 14:20:10',
  },
  {
    id: 3,
    commissionId: 1,
    op: '创建配置',
    detail: '初始化 V1 分佣配置',
    operator: '超级管理员',
    time: '2026-01-10 09:00:00',
  },
  {
    id: 4,
    commissionId: 2,
    op: '编辑分佣配置',
    detail: '调整 V2 针对 V1 直邀比例：4.00% → 5.00%',
    operator: '超级管理员',
    time: '2026-04-20 10:30:45',
  },
  {
    id: 5,
    commissionId: 2,
    op: '创建配置',
    detail: '初始化 V2 分佣配置',
    operator: '超级管理员',
    time: '2026-01-10 09:00:00',
  },
  {
    id: 6,
    commissionId: 3,
    op: '编辑分佣配置',
    detail: '调整 V3 针对 V1 的无限比例至 3.50%；V3→V2/V3 用户关系补充间邀比例',
    operator: '超级管理员',
    time: '2026-04-22 14:15:38',
  },
  {
    id: 7,
    commissionId: 3,
    op: '创建配置',
    detail: '初始化 V3 分佣配置',
    operator: '超级管理员',
    time: '2026-01-10 09:00:00',
  },
]

const EMPTY_STORE: CommissionPersisted = {
  commissions: clone(DEFAULT_COMMISSIONS),
  logs: clone(DEFAULT_LOGS),
}

function readCommissionStore(): CommissionPersisted {
  if (!existsSync(COMMISSION_STORE_PATH)) {
    mkdirSync(dirname(COMMISSION_STORE_PATH), { recursive: true })
    writeCommissionStore(EMPTY_STORE)
    return clone(EMPTY_STORE)
  }
  let data: CommissionPersisted
  try {
    data = JSON.parse(readFileSync(COMMISSION_STORE_PATH, 'utf-8')) as CommissionPersisted
  } catch {
    writeCommissionStore(EMPTY_STORE)
    return clone(EMPTY_STORE)
  }
  if (!Array.isArray(data.commissions)) data.commissions = []
  if (!Array.isArray(data.logs)) data.logs = []

  if (data.commissions.length === 0) {
    data.commissions = clone(DEFAULT_COMMISSIONS)
    if (data.logs.length === 0) data.logs = clone(DEFAULT_LOGS)
    writeCommissionStore(data)
  }

  return data
}

function writeCommissionStore(data: CommissionPersisted) {
  mkdirSync(dirname(COMMISSION_STORE_PATH), { recursive: true })
  writeFileSync(COMMISSION_STORE_PATH, JSON.stringify(data, null, 2) + '\n', 'utf-8')
}

function formatStoreNow(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

function logWithLevel(store: { commissions: CommissionItem[] }, l: CommissionLog): CommissionLog {
  const row = store.commissions.find((c) => c.id === l.commissionId)
  return { ...l, level: row?.level }
}

function nextLogId(logs: CommissionLog[]): number {
  return logs.reduce((m, l) => Math.max(m, l.id), 0) + 1
}

export default [
  {
    url: '/api/commission/list',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      const persisted = readCommissionStore()
      let result = [...persisted.commissions]
      if (query.level) result = result.filter((r) => r.level === query.level)
      if (query.enabled !== '' && query.enabled !== undefined)
        result = result.filter((r) => String(r.enabled) === query.enabled)
      if (query.operator) result = result.filter((r) => r.operator.includes(query.operator))
      return { code: 0, data: { list: result, total: result.length } }
    },
  },
  {
    url: '/api/commission/logs',
    method: 'get',
    response: () => {
      const persisted = readCommissionStore()
      const logs = [...persisted.logs].sort((a, b) => b.time.localeCompare(a.time)).map((l) => logWithLevel(persisted, l))
      return { code: 0, data: logs }
    },
  },
  {
    url: '/api/commission/:id',
    method: 'put',
    response: ({ params, body }: { params: Record<string, string>; body: Partial<CommissionItem> }) => {
      const persisted = readCommissionStore()
      const idx = persisted.commissions.findIndex((r) => r.id === Number(params.id))
      if (idx === -1) return { code: 404, message: '记录不存在' }
      const updatedAt = formatStoreNow()
      Object.assign(persisted.commissions[idx], body, {
        updatedAt,
        operator: '超级管理员',
      })
      const row = persisted.commissions[idx]
      persisted.logs.push({
        id: nextLogId(persisted.logs),
        commissionId: row.id,
        op: '编辑分佣配置',
        detail: '配置已写入仓库 data/commission-store.json',
        operator: '超级管理员',
        time: updatedAt,
      })
      writeCommissionStore(persisted)
      return { code: 0, data: row }
    },
  },
  {
    url: '/api/commission/:id/logs',
    method: 'get',
    response: ({ params }: { params: Record<string, string> }) => {
      const persisted = readCommissionStore()
      const logs = persisted.logs
        .filter((l) => l.commissionId === Number(params.id))
        .sort((a, b) => b.time.localeCompare(a.time))
        .map((l) => logWithLevel(persisted, l))
      return { code: 0, data: logs }
    },
  },
] as MockMethod[]
