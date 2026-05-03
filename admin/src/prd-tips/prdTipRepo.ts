import raw from './overrides/prd-tip-overrides.json'

export type PrdTipPayload = {
  moduleName?: string
  md: string
  updatedAt?: string
}

type RawMap = Record<string, PrdTipPayload>

function cloneRaw(): RawMap {
  return { ...(raw as RawMap) }
}

/** 内存覆盖层：启动时来自 JSON；保存后立即更新，无需刷新即可与文件逻辑一致（文件由开发服异步写入） */
let mem: RawMap = cloneRaw()

/** 持久化键：`路由 name` + `:` + 本页批注序号（同一菜单内从 1 递增，与 `tip-id` 一致）。 */
export function getPersistKey(
  routeName: string | symbol | undefined | null,
  tipId: number
): string {
  return `${String(routeName ?? 'unknown')}:${tipId}`
}

/** 合并仓库覆盖与页面默认值 */
export function resolveTipContent(
  key: string,
  defaultModuleName: string,
  defaultMd: string
): { moduleName: string; md: string } {
  const v = mem[key]
  if (v?.md?.length) {
    return {
      moduleName: (v.moduleName && v.moduleName.length ? v.moduleName : defaultModuleName) as string,
      md: v.md,
    }
  }
  return { moduleName: defaultModuleName, md: defaultMd }
}

export function updateTipMemory(key: string, payload: { moduleName: string; md: string }) {
  mem[key] = {
    moduleName: payload.moduleName,
    md: payload.md,
    updatedAt: new Date().toISOString(),
  }
}

/** 开发环境写入 overrides JSON；生产环境仅更新内存（当前会话） */
export async function persistTipToWorkspace(
  key: string,
  payload: { moduleName: string; md: string }
): Promise<{ ok: boolean; message?: string }> {
  updateTipMemory(key, payload)
  if (!import.meta.env.DEV) {
    return {
      ok: true,
      message: '生产环境未启用文件写入；内容已写入当前会话内存，以构建时 overrides 为准。',
    }
  }
  try {
    const res = await fetch('/__prd-tip/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key,
        moduleName: payload.moduleName,
        md: payload.md,
      }),
    })
    const j = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string }
    if (!res.ok || !j.ok) {
      return { ok: false, message: j.error ?? `HTTP ${res.status}` }
    }
    return { ok: true, message: '已写入 src/prd-tips/overrides/prd-tip-overrides.json，可提交 Git。' }
  } catch (e) {
    return { ok: false, message: String(e) }
  }
}

/** 供测试或 HMR：用文件内容重置内存 */
export function resetTipMemoryFromImport(next: RawMap) {
  mem = { ...next }
}
