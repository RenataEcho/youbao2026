import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

/**
 * 路由结构严格对照 PRD §2.1 菜单架构
 * 规则：
 * 1. 每个菜单项对应唯一路由，不允许同一功能多路由入口（防 BUG-09 类问题）
 * 2. 需要详情页的模块（字段≥15）使用子路由 :id，不复用列表路由
 * 3. 页内 Tab（实名信息/通用配置）使用 query 参数切换，不创建独立路由
 */
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/',
    component: MainLayout,
    redirect: '/dashboard',
    children: [
      // ===== 工作台 =====
      { path: 'dashboard', name: 'Dashboard', component: () => import('@/views/dashboard/DashboardPage.vue') },

      // ===== 域二：用户 =====
      // 用户管理
      { path: 'user/list',               name: 'UserList',          component: () => import('@/views/user/UserList.vue') },
      { path: 'user/list/:id',           name: 'UserDetail',        component: () => import('@/views/user/UserDetail.vue') },
      // 实名信息（tab=personal|company|individual，默认 personal）
      { path: 'user/realname',           name: 'Realname',          component: () => import('@/views/user/RealnameInfo.vue') },
      { path: 'user/realname/personal/:id', name: 'RealnamePersonDetail', component: () => import('@/views/user/RealnamePersonDetail.vue') },
      { path: 'user/realname/company/:id',  name: 'RealnameCorpDetail',   component: () => import('@/views/user/RealnameCorpDetail.vue') },
      { path: 'user/media-account',      name: 'MediaAccount',      component: () => import('@/views/user/MediaAccount.vue') },
      { path: 'user/withdraw-account',   name: 'WithdrawAccount',   component: () => import('@/views/user/WithdrawAccount.vue') },
      { path: 'user/blacklist',          name: 'Blacklist',         component: () => import('@/views/user/Blacklist.vue') },
      { path: 'user/gift-word',          name: 'GiftWord',          component: () => import('@/views/user/GiftWord.vue') },
      { path: 'user/exchange',           name: 'Exchange',          component: () => import('@/views/user/Exchange.vue') },
      // 用户资金
      { path: 'user/wallet',             name: 'UserWallet',        component: () => import('@/views/user/UserWallet.vue') },
      { path: 'user/dividend',           name: 'Dividend',          component: () => import('@/views/user/Dividend.vue') },
      { path: 'user/reward-detail',      name: 'RewardDetail',      component: () => import('@/views/user/RewardDetail.vue') },
      { path: 'user/withdraw-record',    name: 'WithdrawRecord',    component: () => import('@/views/user/WithdrawRecord.vue') },
      // 用户通知
      { path: 'user/wechat-notify',      name: 'WechatNotify',      component: () => import('@/views/user/WechatNotify.vue') },
      { path: 'user/inbox-notify',       name: 'InboxNotify',       component: () => import('@/views/user/InboxNotify.vue') },
      // 用户体系
      { path: 'user/level',              name: 'UserLevel',         component: () => import('@/views/user/UserLevel.vue') },
      { path: 'user/rank',               name: 'UserRank',          component: () => import('@/views/user/UserRank.vue') },
      { path: 'user/benefit-config',     name: 'BenefitConfig',     component: () => import('@/views/user/BenefitConfig.vue') },
      { path: 'user/medal-config',       name: 'MedalConfig',       component: () => import('@/views/user/MedalConfig.vue') },
      { path: 'user/level-log',          name: 'UserLevelLog',      component: () => import('@/views/user/UserLevelLog.vue') },
      // 团长体系
      { path: 'user/captain-level',      name: 'CaptainLevel',      component: () => import('@/views/user/CaptainLevel.vue') },
      { path: 'user/commission-config',  name: 'CommissionConfig',  component: () => import('@/views/user/CommissionConfig.vue') },
      { path: 'user/leader-log',         name: 'LeaderLog',         component: () => import('@/views/user/LeaderLog.vue') },

      // ===== 域三：项目 =====
      { path: 'project/track-type',      name: 'TrackType',         component: () => import('@/views/project/TrackType.vue') },
      { path: 'project/biz-type',        name: 'BizType',           component: () => import('@/views/project/BizType.vue') },
      // 子路由顺序：new / :id/edit / :id 需在 project/config 之前注册，避免被兜底或未匹配
      { path: 'project/config/new',        name: 'ProjectConfigNew',    component: () => import('@/views/project/ProjectConfigForm.vue') },
      { path: 'project/config/:id/edit',   name: 'ProjectConfigEdit',   component: () => import('@/views/project/ProjectConfigForm.vue') },
      // 项目维度子配置（路径需在 project/config/:id 之前注册，避免与详情动态段语义混淆）
      { path: 'project/config/:projectId/keyword-config', name: 'ProjectKeywordConfig', component: () => import('@/views/project/config/QuestionnaireConfigEditor.vue'), props: { variant: 'keyword' } },
      { path: 'project/config/:projectId/backfill-config', name: 'ProjectBackfillConfig', component: () => import('@/views/project/config/QuestionnaireConfigEditor.vue'), props: { variant: 'backfill' } },
      { path: 'project/config/:projectId/settlement-config', name: 'ProjectSettlementConfigRoute', component: () => import('@/views/project/config/ProjectSettlementConfig.vue') },
      { path: 'project/config/:projectId/data-table-config', name: 'ProjectDataTableConfigRoute', component: () => import('@/views/project/config/ProjectDataTableConfig.vue') },
      { path: 'project/config/:id',        name: 'ProjectConfigDetail', component: () => import('@/views/project/ProjectConfigDetail.vue') },
      { path: 'project/config',          name: 'ProjectConfig',     component: () => import('@/views/project/ProjectConfig.vue') },
      { path: 'project/keyword',         name: 'KeywordManage',     component: () => import('@/views/project/KeywordManage.vue') },
      { path: 'project/work',            name: 'WorkManage',        component: () => import('@/views/project/WorkManage.vue') },
      { path: 'project/order',           name: 'ProjectOrder',      component: () => import('@/views/project/ProjectOrder.vue') },
      { path: 'project/bytedance',       name: 'BytedanceCustom',   component: () => import('@/views/project/BytedanceCustom.vue') },
      { path: 'project/custom',          name: 'ProjectCustom',     component: () => import('@/views/project/ProjectCustom.vue') },
      // 海外文娱
      { path: 'project/overseas-company',  name: 'OverseasCompany', component: () => import('@/views/project/OverseasCompany.vue') },
      { path: 'project/overseas-project',  name: 'OverseasProject', component: () => import('@/views/project/OverseasProject.vue') },
      { path: 'project/overseas-task',     name: 'OverseasTask',    component: () => import('@/views/project/OverseasTask.vue') },
      { path: 'project/overseas-order',    name: 'OverseasOrder',   component: () => import('@/views/project/OverseasOrder.vue') },
      { path: 'project/overseas-log',      name: 'OverseasLog',     component: () => import('@/views/project/OverseasLog.vue') },

      // ===== 域四：数据 =====
      { path: 'data/bigscreen',          name: 'BigScreen',         component: () => import('@/views/data/BigScreen.vue') },
      { path: 'data/user-data',          name: 'UserData',          component: () => import('@/views/data/UserData.vue') },
      { path: 'data/brand-data',         name: 'BrandData',         component: () => import('@/views/data/BrandData.vue') },
      { path: 'data/overseas-data',      name: 'OverseasData',      component: () => import('@/views/data/OverseasData.vue') },
      { path: 'data/finance-data',       name: 'FinanceData',       component: () => import('@/views/data/FinanceData.vue') },
      { path: 'data/personal-detail',    name: 'PersonalDetail',    component: () => import('@/views/data/PersonalDetail.vue') },
      { path: 'data/invite-rank',        name: 'InviteRank',        component: () => import('@/views/data/InviteRank.vue') },
      { path: 'data/sub-query',          name: 'SubQuery',          component: () => import('@/views/data/SubQuery.vue') },
      { path: 'data/leader-query',       name: 'LeaderQuery',       component: () => import('@/views/data/LeaderQuery.vue') },
      { path: 'data/byte-invite-code',   name: 'ByteInviteCode',    component: () => import('@/views/data/ByteInviteCode.vue') },
      { path: 'data/official-order',     name: 'OfficialOrder',     component: () => import('@/views/data/OfficialOrder.vue') },
      { path: 'data/order-attribution',  name: 'OrderAttribution',  component: () => import('@/views/data/OrderAttribution.vue') },

      // ===== 域五：运营 =====
      { path: 'ops/announcement',        name: 'Announcement',      component: () => import('@/views/ops/Announcement.vue') },
      { path: 'ops/banner',              name: 'Banner',            component: () => import('@/views/ops/Banner.vue') },
      { path: 'ops/tool-config',         name: 'ToolConfig',        component: () => import('@/views/ops/ToolConfig.vue') },
      // 通用配置（tab=desc|ucenter|gray|bank|update，默认 desc）
      { path: 'ops/common-config',       name: 'CommonConfig',      component: () => import('@/views/ops/CommonConfig.vue') },
      { path: 'ops/coupon',              name: 'Coupon',            component: () => import('@/views/ops/Coupon.vue') },
      { path: 'ops/community',           name: 'Community',         component: () => import('@/views/ops/Community.vue') },
      { path: 'ops/group',               name: 'Group',             component: () => import('@/views/ops/Group.vue') },

      // ===== 域六：系统 =====
      { path: 'system/payout-account',   name: 'PayoutAccount',     component: () => import('@/views/system/PayoutAccount.vue') },
      { path: 'system/project-payment',  name: 'ProjectPayment',    component: () => import('@/views/system/ProjectPayment.vue') },
      { path: 'system/dividend-payment', name: 'DividendPayment',   component: () => import('@/views/system/DividendPayment.vue') },
      { path: 'system/reward-payment',   name: 'RewardPayment',     component: () => import('@/views/system/RewardPayment.vue') },
      { path: 'system/role',             name: 'RoleManage',        component: () => import('@/views/system/RoleManage.vue') },
      { path: 'system/member',           name: 'MemberManage',      component: () => import('@/views/system/MemberManage.vue') },
      { path: 'system/help-doc',         name: 'HelpDoc',           component: () => import('@/views/system/HelpDoc.vue') },
      { path: 'system/menu',             name: 'MenuManage',        component: () => import('@/views/system/MenuManage.vue') },
      { path: 'system/dict', redirect: '/system/dict/keyword' },
      {
        path: 'system/dict/keyword',
        name: 'DictKeyword',
        component: () => import('@/views/system/DictConfigList.vue'),
        props: { variant: 'keyword' },
      },
      {
        path: 'system/dict/work',
        name: 'DictWork',
        component: () => import('@/views/system/DictConfigList.vue'),
        props: { variant: 'work' },
      },
      {
        path: 'system/dict/data-table',
        name: 'DictDataTable',
        component: () => import('@/views/system/DictConfigList.vue'),
        props: { variant: 'dataTable' },
      },
      {
        path: 'system/dict/other',
        name: 'DictOther',
        component: () => import('@/views/system/DictConfigList.vue'),
        props: { variant: 'other' },
      },
      { path: 'system/config',           name: 'SystemConfig',      component: () => import('@/views/system/SystemConfig.vue') },
      { path: 'system/op-log',           name: 'OpLog',             component: () => import('@/views/system/OpLog.vue') },
      { path: 'system/sys-notify',       name: 'SysNotify',         component: () => import('@/views/system/SysNotify.vue') },
    ],
  },
  // 兜底：未匹配路由跳首页
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
