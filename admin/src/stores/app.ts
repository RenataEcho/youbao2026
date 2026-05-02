import { defineStore } from 'pinia'
import { ref } from 'vue'

// 顶级域定义
export type DomainKey = 'dashboard' | 'user' | 'project' | 'data' | 'ops' | 'system'

export const useAppStore = defineStore('app', () => {
  const sidebarCollapsed = ref(false)
  const activeDomain = ref<DomainKey>('dashboard')

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function setDomain(domain: DomainKey) {
    activeDomain.value = domain
  }

  return { sidebarCollapsed, activeDomain, toggleSidebar, setDomain }
})
