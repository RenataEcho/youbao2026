import { computed, reactive, ref, watch, type Ref } from 'vue'

/** 运营域列表页通用分页（与 Announcement / Group 条一致） */
export function useOpsListPagination<T>(
  list: Ref<T[]>,
  pageSize: Ref<number>,
  onInvalidJump?: (msg: string) => void
) {
  const page = ref(1)
  const jumpInput = ref('1')

  const totalPages = computed(() => Math.max(1, Math.ceil(list.value.length / pageSize.value)))

  const pageRows = computed(() => {
    const s = (page.value - 1) * pageSize.value
    return list.value.slice(s, s + pageSize.value)
  })

  const pageNums = computed(() => {
    const out: number[] = []
    const s = Math.max(1, page.value - 2)
    const e = Math.min(totalPages.value, page.value + 2)
    for (let i = s; i <= e; i++) out.push(i)
    return out
  })

  watch([list, pageSize], () => {
    if (page.value > totalPages.value) page.value = totalPages.value
  })

  watch(page, (p) => {
    jumpInput.value = String(p)
  })

  function goPage(p: number) {
    page.value = Math.min(Math.max(1, p), totalPages.value)
    jumpInput.value = String(page.value)
  }

  function applyJump() {
    const n = parseInt(jumpInput.value.trim(), 10)
    if (Number.isNaN(n) || n < 1) {
      onInvalidJump?.('请输入有效页码')
      return
    }
    goPage(Math.min(n, totalPages.value))
  }

  function resetPage() {
    page.value = 1
    jumpInput.value = '1'
  }

  return reactive({
    page,
    jumpInput,
    totalPages,
    pageNums,
    pageRows,
    goPage,
    applyJump,
    resetPage,
  })
}
