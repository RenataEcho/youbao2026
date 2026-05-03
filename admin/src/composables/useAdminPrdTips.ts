import { getAdminPrdTipBundle } from '@/prd-tips/adminPrdRouteBundle'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

/** 全站列表/看板页 PRD 批注：与 `adminPrdRouteMeta.json` + 当前 `route.name` 对齐 */
export function useAdminPrdTips() {
  const route = useRoute()
  const prdTipAnchorRef = ref<HTMLElement | null>(null)
  const prdTipFilterRef = ref<HTMLElement | null>(null)
  const prdTipOpsRef = ref<HTMLElement | null>(null)
  const prdTipTabRef = ref<HTMLElement | null>(null)

  const bundle = computed(() => getAdminPrdTipBundle(route.name))
  const opsTipId = computed(() => bundle.value.opsTipId)

  return {
    bundle,
    opsTipId,
    prdTipAnchorRef,
    prdTipFilterRef,
    prdTipOpsRef,
    prdTipTabRef,
  }
}
