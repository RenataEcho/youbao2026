/** 运营数据大屏 · 数字展示格式（与 HTML 原型一致，供 ObsCount / 后续接口对齐） */
export type ObsCountFormat = 'intComma' | 'k1' | 'k0' | 'm2' | 'moneyFull' | 'moneyCompact'

function commaInt(n: number): string {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export function formatObsCount(n: number, type: ObsCountFormat): string {
  const x = Number(n)
  if (Number.isNaN(x)) return '—'
  if (type === 'intComma') return commaInt(x)
  if (type === 'k1') {
    const k = x / 1000
    return `${(Math.round(k * 10) / 10).toFixed(1).replace(/\.0$/, '')}k`
  }
  if (type === 'k0') return `${Math.round(x / 1000)}k`
  if (type === 'm2') {
    const m = Math.round(x / 10000) / 100
    return `${m.toFixed(2).replace(/\.?0+$/, '')}M`
  }
  if (type === 'moneyFull') return `¥ ${commaInt(x)}`
  if (type === 'moneyCompact') {
    if (x >= 1e6) {
      const v = Math.round((x / 1e6) * 100) / 100
      return `¥ ${v.toFixed(2).replace(/\.?0+$/, '')}M`
    }
    if (x >= 1e3) return `¥ ${Math.round(x / 1000)}k`
    return `¥ ${commaInt(x)}`
  }
  return String(x)
}

function easeOutExpo(t: number): number {
  return t >= 1 ? 1 : 1 - 2 ** (-10 * t)
}

export function runObsCountAnimation(
  el: HTMLElement,
  end: number,
  format: ObsCountFormat,
  opts: { duration: number; delay: number; reduced: boolean; shouldCancel?: () => boolean },
): Promise<void> {
  if (opts.reduced || Number.isNaN(end)) {
    el.textContent = formatObsCount(end, format)
    return Promise.resolve()
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      if (opts.shouldCancel?.()) {
        resolve()
        return
      }
      const start = performance.now()
      const from = 0
      function frame(now: number) {
        if (opts.shouldCancel?.()) {
          resolve()
          return
        }
        const t = Math.min(1, (now - start) / opts.duration)
        const eased = easeOutExpo(t)
        const cur = from + (end - from) * eased
        el.textContent = formatObsCount(cur, format)
        if (t < 1) requestAnimationFrame(frame)
        else {
          el.textContent = formatObsCount(end, format)
          resolve()
        }
      }
      requestAnimationFrame(frame)
    }, opts.delay)
  })
}
