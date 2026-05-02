import { onMounted, onUnmounted } from 'vue'

/**
 * ESC 关闭：从栈顶向下找到第一个打开的层并关闭（后注册者优先，适合「抽屉在上、弹窗在下」等顺序）。
 */
export function useEscCloseStack(items: { isOpen: () => boolean; close: () => void }[]) {
  function onKey(e: KeyboardEvent) {
    if (e.key !== 'Escape') return
    for (let i = items.length - 1; i >= 0; i--) {
      if (items[i].isOpen()) {
        e.preventDefault()
        items[i].close()
        break
      }
    }
  }
  onMounted(() => document.addEventListener('keydown', onKey))
  onUnmounted(() => document.removeEventListener('keydown', onKey))
}
