<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { type ObsCountFormat, formatObsCount, runObsCountAnimation } from '@/utils/obsCountFormat'

const props = withDefaults(
  defineProps<{
    end: number
    format: ObsCountFormat
    /** 为 false 时不播放（如 v-show 隐藏的表） */
    active?: boolean
    /** 手动刷新等场景 bump 以重播 */
    replay?: number
    staggerIndex?: number
    duration?: number
  }>(),
  { active: true, replay: 0, staggerIndex: 0, duration: 1200 },
)

const span = ref<HTMLElement | null>(null)
const reduced = ref(false)
let mq: MediaQueryList | null = null
let cancel = false

function readMq() {
  reduced.value = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

async function play() {
  cancel = true
  await nextTick()
  cancel = false
  const el = span.value
  if (!el || props.active === false) return
  const delay = (props.staggerIndex || 0) * 40
  await runObsCountAnimation(el, props.end, props.format, {
    duration: props.duration ?? 1200,
    delay,
    reduced: reduced.value,
    shouldCancel: () => cancel,
  })
}

watch(
  () => [props.end, props.format, props.active, props.replay],
  () => {
    if (props.active === false) {
      if (span.value) span.value.textContent = formatObsCount(props.end, props.format)
      return
    }
    void play()
  },
  { flush: 'post' },
)

onMounted(() => {
  readMq()
  if (typeof window !== 'undefined') {
    mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    mq.addEventListener('change', readMq)
  }
  if (props.active === false) {
    if (span.value) span.value.textContent = formatObsCount(props.end, props.format)
  } else void play()
})

onBeforeUnmount(() => {
  cancel = true
  mq?.removeEventListener('change', readMq)
})
</script>

<template>
  <span ref="span" class="obs-count" />
</template>

<style scoped>
.obs-count {
  font-variant-numeric: tabular-nums;
}
</style>
