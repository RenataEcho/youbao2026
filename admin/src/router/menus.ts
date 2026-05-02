/**
 * 菜单配置 — 对照 PRD §2.1 完整菜单架构（项目域含：类目配置、品牌项目、海外文娱）
 * 用于 TopNav 域切换 + Sidebar 二三级渲染
 */

export type MenuGroup = {
  key: string
  label: string
  children: MenuItem[]
}

export type MenuItem = {
  key: string
  label: string
  path: string
  icon?: string
  children?: MenuItem[]
}

export type Domain = {
  key: string
  label: string
  icon: string
  groups: MenuGroup[]
}

export const DOMAINS: Domain[] = [
  {
    key: 'dashboard',
    label: '工作台',
    icon: 'DataAnalysis',
    groups: [],
  },
  {
    key: 'user',
    label: '用户',
    icon: 'User',
    groups: [
      {
        key: 'user-manage',
        label: '用户管理',
        children: [
          { key: 'UserList',        label: '用户列表',   path: '/user/list',           icon: 'List' },
          { key: 'Realname',        label: '实名信息',   path: '/user/realname',       icon: 'Postcard' },
          { key: 'MediaAccount',    label: '媒体账号',   path: '/user/media-account',  icon: 'VideoCamera' },
          { key: 'WithdrawAccount', label: '提现账户',   path: '/user/withdraw-account', icon: 'CreditCard' },
          { key: 'Blacklist',       label: '黑名单',     path: '/user/blacklist',      icon: 'Remove' },
          { key: 'GiftWord',        label: '赠词记录',   path: '/user/gift-word',      icon: 'Gift' },
          { key: 'Exchange',        label: '兑换记录',   path: '/user/exchange',       icon: 'Refresh' },
        ],
      },
      {
        key: 'user-finance',
        label: '用户资金',
        children: [
          { key: 'UserWallet',      label: '用户钱包',   path: '/user/wallet',         icon: 'Wallet' },
          { key: 'Dividend',        label: '分红明细',   path: '/user/dividend',       icon: 'PieChart' },
          { key: 'RewardDetail',    label: '奖励明细',   path: '/user/reward-detail',  icon: 'Trophy' },
          { key: 'WithdrawRecord',  label: '提现记录',   path: '/user/withdraw-record', icon: 'Document' },
        ],
      },
      {
        key: 'user-notify',
        label: '用户通知',
        children: [
          { key: 'WechatNotify',    label: '微信通知',   path: '/user/wechat-notify',  icon: 'ChatDotRound' },
          { key: 'InboxNotify',     label: '站内信通知', path: '/user/inbox-notify',   icon: 'Message' },
        ],
      },
      {
        key: 'user-system',
        label: '用户体系',
        children: [
          { key: 'UserLevel',       label: '用户等级',     path: '/user/level',          icon: 'Medal' },
          { key: 'UserRank',        label: '用户段位',     path: '/user/rank',           icon: 'Trophy' },
          { key: 'BenefitConfig',   label: '权益配置',     path: '/user/benefit-config', icon: 'Star' },
          { key: 'MedalConfig',     label: '勋章配置',     path: '/user/medal-config',   icon: 'Flag' },
          { key: 'UserLevelLog',    label: '用户等级日志', path: '/user/level-log',      icon: 'Notebook' },
        ],
      },
      {
        key: 'leader-system',
        label: '团长体系',
        children: [
          { key: 'CaptainLevel',     label: '团长等级配置', path: '/user/captain-level',     icon: 'Avatar' },
          { key: 'CommissionConfig', label: '分销比例配置', path: '/user/commission-config', icon: 'SetUp' },
          { key: 'LeaderLog',        label: '团长身份日志', path: '/user/leader-log',        icon: 'Document' },
        ],
      },
    ],
  },
  {
    key: 'project',
    label: '项目',
    icon: 'FolderOpened',
    groups: [
      {
        key: 'category-config',
        label: '类目配置',
        children: [
          { key: 'TrackType', label: '赛道类型', path: '/project/track-type', icon: 'Management' },
          { key: 'BizType',   label: '业务类型', path: '/project/biz-type',   icon: 'Briefcase' },
        ],
      },
      {
        key: 'brand-project',
        label: '品牌项目',
        children: [
          { key: 'ProjectConfig',   label: '项目配置',   path: '/project/config',       icon: 'Setting' },
          { key: 'KeywordManage',   label: '关键词管理', path: '/project/keyword',      icon: 'Search' },
          { key: 'WorkManage',      label: '作品管理',   path: '/project/work',         icon: 'Film' },
          { key: 'ProjectOrder',    label: '订单管理',   path: '/project/order',        icon: 'Tickets' },
          { key: 'BytedanceCustom', label: '字节定制',   path: '/project/bytedance',    icon: 'Lightning' },
          { key: 'ProjectCustom',   label: '项目定制',   path: '/project/custom',       icon: 'Tools' },
        ],
      },
      {
        key: 'overseas',
        label: '海外文娱',
        children: [
          { key: 'OverseasCompany', label: '公司管理',   path: '/project/overseas-company', icon: 'OfficeBuilding' },
          { key: 'OverseasProject', label: '项目管理',   path: '/project/overseas-project', icon: 'Folder' },
          { key: 'OverseasTask',    label: '任务管理',   path: '/project/overseas-task',    icon: 'Finished' },
          { key: 'OverseasOrder',   label: '订单管理',   path: '/project/overseas-order',   icon: 'Tickets' },
          { key: 'OverseasLog',     label: '推广日志',   path: '/project/overseas-log',     icon: 'Document' },
        ],
      },
    ],
  },
  {
    key: 'data',
    label: '数据',
    icon: 'DataLine',
    groups: [
      {
        key: 'data-board',
        label: '数据看板',
        children: [
          { key: 'BigScreen',      label: '大数据屏',     path: '/data/bigscreen',      icon: 'Monitor' },
          { key: 'UserData',       label: '用户数据',     path: '/data/user-data',      icon: 'User' },
          { key: 'BrandData',      label: '品牌项目数据', path: '/data/brand-data',     icon: 'TrendCharts' },
          { key: 'OverseasData',   label: '海外文娱数据', path: '/data/overseas-data',  icon: 'Globe' },
          { key: 'FinanceData',    label: '财务数据',     path: '/data/finance-data',   icon: 'Money' },
        ],
      },
      {
        key: 'data-tools',
        label: '查询工具',
        children: [
          { key: 'PersonalDetail',  label: '个人明细查询', path: '/data/personal-detail', icon: 'Search' },
          { key: 'InviteRank',      label: '邀请榜单',    path: '/data/invite-rank',     icon: 'List' },
          { key: 'SubQuery',        label: '查询下级',    path: '/data/sub-query',       icon: 'Share' },
          { key: 'LeaderQuery',     label: '团长数据查询', path: '/data/leader-query',    icon: 'DataAnalysis' },
          { key: 'ByteInviteCode',  label: '字节邀请码',  path: '/data/byte-invite-code', icon: 'Key' },
          { key: 'OfficialOrder',   label: '官方订单源数据', path: '/data/official-order', icon: 'Document' },
          { key: 'OrderAttribution', label: '官方订单归属', path: '/data/order-attribution', icon: 'DocumentChecked' },
        ],
      },
    ],
  },
  {
    key: 'ops',
    label: '运营',
    icon: 'Operation',
    groups: [
      {
        key: 'ops-config',
        label: '运营配置',
        children: [
          { key: 'Announcement', label: '公告管理',   path: '/ops/announcement', icon: 'Bell' },
          { key: 'Banner',       label: 'Banner管理', path: '/ops/banner',       icon: 'Picture' },
          { key: 'ToolConfig',   label: '工具配置',   path: '/ops/tool-config',  icon: 'Tools' },
          { key: 'CommonConfig', label: '通用配置',   path: '/ops/common-config', icon: 'Setting' },
          { key: 'Coupon',       label: '兑换码管理', path: '/ops/coupon',       icon: 'Ticket' },
        ],
      },
      {
        key: 'community',
        label: '社区管理',
        children: [
          { key: 'Community', label: '社区管理', path: '/ops/community', icon: 'ChatSquare' },
          { key: 'Group',     label: '社群管理', path: '/ops/group',     icon: 'ChatDotSquare' },
        ],
      },
    ],
  },
  {
    key: 'system',
    label: '系统',
    icon: 'Setting',
    groups: [
      {
        key: 'finance',
        label: '财务管理',
        children: [
          { key: 'PayoutAccount',   label: '出金账户',   path: '/system/payout-account',   icon: 'Wallet' },
          { key: 'ProjectPayment',  label: '项目打款',   path: '/system/project-payment',  icon: 'Money' },
          { key: 'DividendPayment', label: '分红打款',   path: '/system/dividend-payment', icon: 'PieChart' },
          { key: 'RewardPayment',   label: '奖励打款',   path: '/system/reward-payment',   icon: 'Trophy' },
        ],
      },
      {
        key: 'permission',
        label: '权限管理',
        children: [
          { key: 'RoleManage',   label: '角色管理', path: '/system/role',   icon: 'UserFilled' },
          { key: 'MemberManage', label: '成员管理', path: '/system/member', icon: 'User' },
        ],
      },
      {
        key: 'sys-manage',
        label: '系统管理',
        children: [
          { key: 'HelpDoc',     label: '帮助文档', path: '/system/help-doc',   icon: 'QuestionFilled' },
          { key: 'MenuManage',  label: '菜单管理', path: '/system/menu',        icon: 'Menu' },
          {
            key: 'DictManage',
            label: '字典管理',
            path: '',
            icon: 'Notebook',
            children: [
              { key: 'DictKeyword', label: '关键词配置字典', path: '/system/dict/keyword', icon: 'Search' },
              { key: 'DictWork', label: '作品配置字典', path: '/system/dict/work', icon: 'Film' },
              { key: 'DictDataTable', label: '数据表配置字典', path: '/system/dict/data-table', icon: 'Histogram' },
              { key: 'DictOther', label: '其他字段', path: '/system/dict/other', icon: 'List' },
            ],
          },
          { key: 'SystemConfig', label: '系统配置', path: '/system/config',    icon: 'Setting' },
          { key: 'OpLog',       label: '操作日志', path: '/system/op-log',     icon: 'Document' },
          { key: 'SysNotify',   label: '系统通知', path: '/system/sys-notify', icon: 'Bell' },
        ],
      },
    ],
  },
]

// 域键 → 域对象的快速查找
export const DOMAIN_MAP = Object.fromEntries(DOMAINS.map((d) => [d.key, d]))
