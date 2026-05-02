import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ProjectRow } from '@/utils/projectManagement'
import { normalizeProjectManagementDetail } from '@/utils/projectManagement'

function seedRows(): ProjectRow[] {
  const baseDetail = normalizeProjectManagementDetail(null)
  baseDetail.process.content = '<p>选书 → 申请关键词 → 回填订单</p>'
  baseDetail.introduction.children.projectDescription.content = '<p>本项目为 CPA 拉新，按有效单结算。</p>'

  const legacySingle = { title: '旧版单块说明', content: '<p>兼容 normalize：旧数据自动落入「项目说明」子模块</p>', contentType: 'article' as const }

  return [
    {
      id: 1,
      seq: 1001,
      category: '推文',
      frontTitle: '剪映海外推广 Q2',
      backTitle: '剪映海外-Q2-内部',
      projectEn: 'capcut_os_q2',
      projectTags: '剪辑,CPA',
      tagTitle: '爆单',
      projectIcon: 'https://dummyimage.com/96x96/2563eb/fff.png&text=icon',
      tagIcons: [
        'https://dummyimage.com/64x64/dc2626/fff.png&text=1',
        '',
        '',
      ],
      sort: 120,
      settlement_cycle: '周结',
      settlementTN: 7,
      booklistLink: 'https://example.com/book/1',
      entryBarrier: '0门槛',
      trackRef: '推文达人',
      business: '推文',
      memberType: '全部',
      updateTime: '2026-04-28 10:22:01',
      expireDays: 360,
      projectStatus: 'show',
      onlineState: 'online',
      hotProject: 'yes',
      isNewProduct: 'no',
      isBackfill: 'yes',
      forbidPromptWords: 'no',
      adminHidden: 'no',
      transferGift: 'off',
      isToutiao: 'yes',
      officialPrompts: 'no',
      isBatch: 'yes',
      isOverseas: 'yes',
      detail: JSON.parse(JSON.stringify(baseDetail)),
    },
    {
      id: 2,
      seq: 1002,
      category: '短剧',
      frontTitle: '番茄小说达人招募',
      backTitle: '番茄-达人-2026',
      projectEn: 'fanqie_daren_26',
      projectTags: '短剧,小说',
      tagTitle: '',
      projectIcon: '',
      tagIcons: ['', '', ''],
      sort: 98,
      settlement_cycle: 'T+N',
      settlementTN: 14,
      booklistLink: '',
      entryBarrier: '需账号',
      trackRef: '短剧达人',
      business: '短剧',
      memberType: '高级会员',
      updateTime: '2026-04-27 16:05:33',
      expireDays: 360,
      projectStatus: 'show',
      onlineState: 'offline',
      hotProject: 'no',
      isNewProduct: 'yes',
      isBackfill: 'yes',
      forbidPromptWords: 'yes',
      adminHidden: 'no',
      transferGift: 'on',
      isToutiao: 'no',
      officialPrompts: 'yes',
      isBatch: 'no',
      isOverseas: 'no',
      detail: normalizeProjectManagementDetail(legacySingle),
    },
    {
      id: 3,
      seq: 1003,
      category: '资源',
      frontTitle: '115 网盘春季推广',
      backTitle: '115-spring',
      projectEn: 'pan115_spring',
      projectTags: '网盘',
      tagTitle: '新品',
      projectIcon: '',
      tagIcons: ['', '', ''],
      sort: 60,
      settlement_cycle: '月结',
      settlementTN: 7,
      booklistLink: 'https://example.com/list/pan',
      entryBarrier: '要资质',
      trackRef: '网盘运营',
      business: '网盘',
      memberType: '开白用户',
      updateTime: '2026-04-20 09:12:00',
      expireDays: 180,
      projectStatus: 'hide',
      onlineState: 'offline',
      hotProject: 'no',
      isNewProduct: 'no',
      isBackfill: 'no',
      forbidPromptWords: 'no',
      adminHidden: 'yes',
      transferGift: 'off',
      isToutiao: 'no',
      officialPrompts: 'no',
      isBatch: 'no',
      isOverseas: 'no',
      detail: normalizeProjectManagementDetail(null),
    },
    {
      id: 4,
      seq: 1004,
      category: '应用',
      frontTitle: 'WPS 高级会员推广',
      backTitle: 'WPS-vip',
      projectEn: 'wps_vip',
      projectTags: '工具,办公',
      tagTitle: '',
      projectIcon: '',
      tagIcons: ['', '', ''],
      sort: 40,
      settlement_cycle: '日结',
      settlementTN: 7,
      booklistLink: '',
      entryBarrier: '0门槛',
      trackRef: '创意工具',
      business: '工具',
      memberType: '普通会员',
      updateTime: '2026-04-15 11:00:00',
      expireDays: 360,
      projectStatus: 'show',
      onlineState: 'online',
      hotProject: 'no',
      isNewProduct: 'no',
      isBackfill: 'yes',
      forbidPromptWords: 'no',
      adminHidden: 'no',
      transferGift: 'off',
      isToutiao: 'no',
      officialPrompts: 'no',
      isBatch: 'yes',
      isOverseas: 'no',
      detail: normalizeProjectManagementDetail(null),
    },
  ]
}

export const useProjectConfigStore = defineStore('projectConfig', () => {
  const rows = ref<ProjectRow[]>([])

  function ensureSeed() {
    if (rows.value.length === 0) {
      rows.value = seedRows()
    }
  }

  function findById(id: number) {
    return rows.value.find((r) => r.id === id)
  }

  function nextId() {
    ensureSeed()
    return rows.value.reduce((m, r) => Math.max(m, r.id), 0) + 1
  }

  function upsert(row: ProjectRow) {
    ensureSeed()
    const idx = rows.value.findIndex((r) => r.id === row.id)
    if (idx >= 0) {
      rows.value[idx] = row
    } else {
      rows.value.unshift(row)
    }
  }

  return { rows, ensureSeed, findById, nextId, upsert }
})
