import { ref } from 'vue'

export type ToastType = 'info' | 'success' | 'error' | 'warning'

export interface ToastItem {
  id: number
  msg: string
  type: ToastType
}

export function useSimpleToast() {
  const toasts = ref<ToastItem[]>([])
  let id = 0
  function toast(msg: string, type: ToastType = 'info') {
    const nid = ++id
    toasts.value.push({ id: nid, msg, type })
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== nid)
    }, 2600)
  }
  function removeToast(nid: number) {
    toasts.value = toasts.value.filter((t) => t.id !== nid)
  }
  return { toasts, toast, removeToast }
}
