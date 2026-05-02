import type { ProjectRow, ProjectCategory, IntroChildKey } from '@/utils/projectManagement'

export const CATEGORIES: ProjectCategory[] = ['推文', '短剧', '资源', '应用']
export const TRACK_OPTIONS = ['推文达人', '短剧达人', '漫剧达人', '网盘运营', '创意工具', '其他任务', '蓝海内测']
export const BIZ_OPTIONS = ['推文', '短剧', '网盘', '工具', 'AI', '版权', '出海']
export const MEMBER_TYPES = ['全部', '开白用户', '普通会员', '高级会员', '核心高级会员', '合伙人']

export const INTRO_CHILDREN: { key: IntroChildKey; label: string }[] = [
  { key: 'projectDescription', label: '项目说明' },
  { key: 'keywordRequirements', label: '关键词要求' },
  { key: 'backfill', label: '回填' },
  { key: 'order', label: '订单' },
  { key: 'settlement', label: '结算' },
]

export const FLAG_FIELDS: {
  key: keyof Pick<
    ProjectRow,
    | 'projectStatus'
    | 'onlineState'
    | 'hotProject'
    | 'isNewProduct'
    | 'isBackfill'
    | 'forbidPromptWords'
    | 'adminHidden'
    | 'transferGift'
    | 'isToutiao'
    | 'officialPrompts'
    | 'isBatch'
    | 'isOverseas'
  >
  label: string
  options: { v: string; l: string }[]
  hint: string
}[] = [
  { key: 'projectStatus', label: '项目状态', options: [{ v: 'show', l: '前台展示' }, { v: 'hide', l: '前台隐藏' }], hint: 'hide 时前台不可见，后台仍可维护' },
  { key: 'onlineState', label: '上线状态', options: [{ v: 'online', l: '已上线' }, { v: 'offline', l: '未上线' }], hint: '与项目状态独立；online + show 时前台正常展示' },
  { key: 'isOverseas', label: '是否海外', options: [{ v: 'yes', l: '是' }, { v: 'no', l: '否' }], hint: '标识为国内项目或国外（海外）项目，用于运营与展示区分' },
  { key: 'hotProject', label: '是否热门', options: [{ v: 'yes', l: '是' }, { v: 'no', l: '否' }], hint: '影响品牌推荐策略分' },
  { key: 'isNewProduct', label: '是否新品', options: [{ v: 'yes', l: '是' }, { v: 'no', l: '否' }], hint: '影响品牌推荐随机分' },
  { key: 'isBackfill', label: '是否回填', options: [{ v: 'yes', l: '是' }, { v: 'no', l: '否' }], hint: '是否支持订单回填' },
  { key: 'forbidPromptWords', label: '禁止题词', options: [{ v: 'yes', l: '是' }, { v: 'no', l: '否' }], hint: '禁止用户发布题词' },
  { key: 'adminHidden', label: '后台隐藏', options: [{ v: 'yes', l: '是' }, { v: 'no', l: '否' }], hint: '后台列表隐藏，适合测试中项目' },
  { key: 'transferGift', label: '关键词赠送', options: [{ v: 'on', l: '开启' }, { v: 'off', l: '关闭' }], hint: '关键词转赠' },
  { key: 'isToutiao', label: '字节项目', options: [{ v: 'yes', l: '是' }, { v: 'no', l: '否' }], hint: '字节系列合作' },
  { key: 'officialPrompts', label: '官方题词', options: [{ v: 'yes', l: '是' }, { v: 'no', l: '否' }], hint: '是否含官方题词渠道' },
  { key: 'isBatch', label: '批量操作', options: [{ v: 'yes', l: '是' }, { v: 'no', l: '否' }], hint: '是否支持批量操作' },
]
