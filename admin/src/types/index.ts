/* ===================================================
   全局类型定义 — 对照 PRD 严格定义枚举和接口
   =================================================== */

// ===== Badge 语义变体 =====
export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'gray'

// ===== 通用分页响应 =====
export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export interface PageQuery {
  page: number
  pageSize: number
  [key: string]: unknown
}

// ===== 用户相关 =====
export type AccountStatus = 'normal' | 'blacklist' | 'disabled' | 'cancelled' | 'deleted'
export type RealnameStatus = 'unverified' | 'verified'
export type RegisterChannel = '小程序' | 'H5' | 'PC' | '安卓' | 'iOS'

export interface UserListItem {
  id: string
  name: string
  avatar: string
  mobile: string
  identities: string[]
  withdrawn: number
  balance: number
  realnameStatus: RealnameStatus
  realnameTypes: ('个人' | '企业' | '个体户')[]
  accountStatus: AccountStatus
  channel: RegisterChannel
  inviteCode: string
  inviteCodeAdmin: string
  inviterId: string
  isVirtual: boolean
  isDisabled: boolean
  registeredAt: string
}

// ===== 实名信息 =====
export type InfoStatus = '正常' | '用户已删除' | '后台释放'
export type AuditStatusCorp = '待审核' | '审核通过' | '审核驳回'

export interface RealnamePersonItem {
  id: string
  userId: string
  mobile: string
  infoStatus: InfoStatus
  certType: '大陆居民' | '非大陆居民'
  idType: string
  idNo: string // 脱敏
  realName: string
  gender: '男' | '女' | '未知'
  birthday: string
  phone: string
  address: string
  country: string
  idExpiry: string
  realnameResult: '成功' | '失败'
  cloudSignStatus: '已签约' | '未签约'
  cloudSignTime: string
  cloudContractUrl: string
  lianyueSignStatus: '已签约' | '签约中' | '签约失败'
  lianyueSignTime: string
  lianyueContractUrl: string
  customerNo: string
  personalNo: string
  merchantFlowNo: string
}

export interface RealnameCorpItem {
  id: number
  userId: string
  mobile: string
  infoStatus: InfoStatus
  legalName: string
  legalIdNo: string // 脱敏
  legalMobile: string
  legalAddress: string
  companyName: string
  creditCode: string
  companyPhone: string
  companyAddress: string
  bankAccountName: string
  bankName: string
  bankBranch: string
  bankAccountNo: string
  invoiceType: '普票' | '专票'
  invoiceRate: '3%' | '6%'
  contractNo: string
  contractPeriod: string
  auditStatus: AuditStatusCorp
  auditTime: string
  rejectReason?: string
  createdAt: string
}

// ===== 媒体账号 =====
export type MediaPlatform = '抖音' | '快手' | '哔哩哔哩' | '小红书' | 'TikTok' | '其他'
export type AccountType = '混剪' | '真人出镜' | '图文' | '其他'
export type MediaAccountStatus = '正常' | '禁用' | '用户删除' | '后台删除'

export interface MediaAccountItem {
  id: number
  userId: string
  platform: MediaPlatform
  accountType: AccountType
  accountName: string
  accountId: string
  profileUrl: string
  status: MediaAccountStatus
  createdAt: string
  deletedAt: string | null
}

// ===== 提现账户 =====
export type WithdrawAccountType = '银行卡' | '支付宝'
export type WithdrawAccountStatus = '正常' | '用户删除' | '后台删除'

export interface WithdrawAccountItem {
  id: number
  userId: string
  type: WithdrawAccountType
  bankNo: string // 脱敏
  bank: string
  name: string
  idcard: string // 脱敏：前3后4
  mobile: string
  sort: number
  isSelf: boolean
  status: WithdrawAccountStatus
}

// ===== 黑名单 =====
export type BlacklistBanType =
  | '禁止登录'
  | '禁止题词'
  | '禁止项目钱包提现'
  | '禁止分红钱包提现'
  | '禁止奖励钱包提现'

export interface BlacklistItem {
  id: number
  userId: string
  banTypes: BlacklistBanType[]
  isNotify: boolean
  notifyType?: '重要通知' | '站内信' | '封号通知'
  message?: string
  remarks: string
  operator: string
  createdAt: string
}

// ===== 赠词记录（PRD §4.1.6） =====
export type GiftWordStatus = '未接收' | '已接收' | '已失效'

export interface GiftWordItem {
  id: number
  projectId: string
  projectName: string
  keyword: string
  senderUserId: string
  receiverUserId: string
  status: GiftWordStatus
  createdAt: string
}

// ===== 奖励打款（reward-prd.md） =====
export type RewardBusinessType = 'brand' | 'overseas'
export type RewardAuditStatus = 'pending_review' | 'reviewed' | 'rejected'
export type RewardPaymentStatus = 'pending_payment' | 'paid'
export type RewardWechatNotify = 'pending' | 'sent'

// ===== 分销比例配置 =====
/** 团长等级 */
export type LeaderLevel = 'V1' | 'V2' | 'V3' | 'V4' | 'V5'

/** 单个目标等级的用户关系分佣配置 */
export interface UserCommission {
  direct: number      // 直邀比例 %
  indirect: number | null  // 间邀比例 %（null=不适用，以 userIndirectApplicable 为准）
  infinite: number | null  // 无限比例 %（null=不适用，仅 V2/V3→V1）
}

/** 单个目标等级的团队关系分佣配置 (V1 无团队=null) */
export interface TeamCommission {
  direct: number      // 直属团比例 %
  indirect: number    // 间属团比例 %
  infinite: number | null  // 无限团比例 % (null=不适用)
}

/** 某等级针对某目标等级的分佣配置项 */
export interface CommissionTarget {
  targetLevel: LeaderLevel
  user: UserCommission
  team: TeamCommission | null  // null = targetLevel 为 V1（非团长）
}

/** 分销比例配置列表项 */
export interface CommissionItem {
  id: number
  level: LeaderLevel
  enabled: boolean
  targets: CommissionTarget[]
  createdAt: string
  updatedAt: string
  operator: string
}

/** 操作日志项 */
export interface CommissionLog {
  id: number
  commissionId: number
  op: string
  detail: string
  operator: string
  time: string
  /** 分佣等级（列表/汇总接口可冗余返回，便于表格展示） */
  level?: LeaderLevel
}

/** 编辑抽屉表单（扁平化，按 tab 索引存储） */
export interface CommissionEditForm {
  enabled: boolean
  targets: CommissionTarget[]
}

export interface RewardItem {
  id: string
  orderId: string
  importedAt: string
  businessType: RewardBusinessType
  projectId: string
  projectName: string
  keyword: string
  userId: string
  amount: number
  rewardTitle: string
  rewardReason: string
  importOperator: string
  reviewer: string
  reviewedAt: string | null
  rejectReason: string
  payer: string
  paidAt: string | null
  auditStatus: RewardAuditStatus
  paymentStatus: RewardPaymentStatus
  wechatNotify: RewardWechatNotify
}
