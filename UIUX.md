# 右豹管理后台 UI/UX 规范文档

> **版本**：v1.1（2026-04-29 补充规范）  
> **整理日期**：2026-04-27（v1.1 更新：2026-04-29）  
> **适用范围**：右豹管理后台所有页面的 UI 开发、设计评审、AI 生成页面  
> **风格定义**：玻璃拟态科技感（Glassmorphism）+ 简约大气，支持明暗双色主题

---

## 目录

1. [风格总则（Glassmorphism）](#一风格总则glassmorphism)
2. [色彩系统](#二色彩系统)
3. [字体与排版](#三字体与排版)
4. [图标规范](#四图标规范)
5. [动效规范](#五动效规范)
6. [菜单架构与导航](#六菜单架构与导航)
7. [页面布局结构](#七页面布局结构)
8. [组件规范](#八组件规范)
9. [表格规范](#九表格规范)
10. [分页规范](#十分页规范)
11. [弹窗与抽屉](#十一弹窗与抽屉)
12. [表单交互规范](#十二表单交互规范)
13. [Toast 通知规范](#十三toast-通知规范)
14. [权限控制规范](#十四权限控制规范)
15. [危险操作规范](#十五危险操作规范)
16. [主题切换规范](#十六主题切换规范)
17. [响应式断点](#十七响应式断点)
18. [特殊表单字段规范](#十八特殊表单字段规范)
19. [错误页规范](#十九错误页规范)
20. [导出与打印规范](#二十导出与打印规范)
21. [ESC 关闭优先级](#二十一esc-关闭优先级)
22. [自检清单](#二十二自检清单)
23. [近期问题归纳与补充规范（v1.1）](#二十三近期问题归纳与补充规范v11-补丁)

---

## 一、风格总则（Glassmorphism）

**核心原则**：卡片/面板采用半透明磨砂玻璃效果，配合渐变背景底色，营造科技感与层次感。

### 背景底色

```css
/* Light 模式 */
body { background: #f0f4f8; }
/* 可选渐变背景（更强玻璃感） */
body.use-gradient { background: linear-gradient(135deg, #e0e7ff 0%, #f0f4f8 40%, #e0f2fe 100%); background-attachment: fixed; }

/* Dark 模式 */
[data-theme="dark"] body { background: #0f172a; }
[data-theme="dark"] body.use-gradient { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0c1a2e 100%); }
```

### 顶部导航（TopNav）背景

```css
/* Light */
--topnav-bg: linear-gradient(135deg, #dbeafe 0%, #ede9fe 40%, #e0f2fe 100%);
/* Dark */
[data-theme="dark"] --topnav-bg: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0c1a2e 100%);
```

### 玻璃卡片（glass-card）

```css
.glass-card {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.55);
  box-shadow: 0 8px 32px rgba(30, 40, 80, 0.10), inset 0 1px 0 rgba(255,255,255,0.8);
  border-radius: 14px; /* --radius-lg */
}

[data-theme="dark"] .glass-card {
  background: rgba(30, 41, 59, 0.65);
  backdrop-filter: blur(16px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05);
}
```

### TopNav / Sidebar 玻璃化

```css
.topnav, .sidebar {
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
}
/* TopNav box-shadow */
.topnav { box-shadow: 0 2px 16px rgba(99,102,241,0.10); }
/* Sidebar box-shadow */
.sidebar { box-shadow: 2px 0 12px rgba(99,102,241,0.07); }
[data-theme="dark"] .sidebar { box-shadow: 2px 0 12px rgba(0,0,0,0.3); }
```

### 装饰光晕（可选）

```css
/* 固定在背景层，pointer-events: none; z-index: 0 */
/* Light */
radial-gradient(circle, rgba(99,102,241,0.15), transparent 60%)
/* Dark */
radial-gradient(circle, rgba(99,102,241,0.25), transparent 60%)
```

### 使用范围

- 所有卡片（stat-card、filter-card、table-card、drawer、modal）均使用玻璃效果
- TopNav、Sidebar 使用轻度玻璃效果
- 按钮、输入框、下拉框**不使用**玻璃效果（保持清晰可操作感）

---

## 二、色彩系统

### CSS 变量定义（Light / Dark 双模式）

```css
:root {
  /* 品牌主色 */
  --primary: #2563eb;
  --primary-hover: #1d4ed8;
  --primary-active: #1e40af;
  --primary-light: #eff6ff;
  --primary-border: #bfdbfe;

  /* 语义色 */
  --success: #16a34a;   --success-bg: #f0fdf4;   --success-border: #bbf7d0;
  --warning: #d97706;   --warning-bg: #fffbeb;   --warning-border: #fde68a;
  --danger:  #dc2626;   --danger-bg:  #fef2f2;   --danger-border:  #fca5a5;
  --info:    #0891b2;   --info-bg:    #ecfeff;   --info-border:    #a5f3fc;

  /* 中性色（Light） */
  --bg: #f0f4f8;
  --surface: #ffffff;
  --surface-hover: #f8fafc;
  --border: #e8edf3;
  --border-hover: #c8d5e2;
  --text-primary: #18222f;
  --text-secondary: #4a5568;
  --text-muted: #9aa5b4;
  --text-disabled: #c8d5e2;

  /* 阴影 */
  --shadow-sm: 0 1px 4px rgba(30,40,60,0.06);
  --shadow:    0 2px 10px rgba(30,40,60,0.08);
  --shadow-lg: 0 8px 28px rgba(30,40,60,0.11);
  --shadow-xl: 0 16px 48px rgba(30,40,60,0.14);

  /* 圆角 */
  --radius-xs: 4px;
  --radius-sm: 7px;
  --radius:    10px;
  --radius-lg: 14px;
  --radius-xl: 20px;

  /* 动效 */
  --transition:      all 0.16s ease;
  --transition-slow: all 0.28s ease;

  /* 导航专用变量 */
  --topnav-h:          54px;
  --sidebar-w:         196px;
  --topnav-bg:         linear-gradient(135deg, #dbeafe 0%, #ede9fe 40%, #e0f2fe 100%);
  --topnav-text:       #3b4d6b;
  --topnav-text-active:#1e3a8a;
  --topnav-hover-bg:   rgba(99,102,241,0.09);
  --topnav-active-bg:  rgba(99,102,241,0.13);
  --topnav-border:     rgba(148,163,196,0.25);
  --sidebar-bg:        rgba(240,244,255,0.92);
  --sidebar-border:    rgba(148,163,196,0.22);
}

[data-theme="dark"] {
  --bg: #0f172a;
  --surface: #1e293b;
  --surface-hover: #273348;
  --border: #334155;
  --border-hover: #475569;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --text-muted: #475569;
  --text-disabled: #334155;
  --shadow-sm: 0 1px 4px rgba(0,0,0,0.3);
  --shadow:    0 2px 10px rgba(0,0,0,0.35);
  --shadow-lg: 0 8px 28px rgba(0,0,0,0.45);
  --shadow-xl: 0 16px 48px rgba(0,0,0,0.55);
  --topnav-bg:         linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0c1a2e 100%);
  --topnav-text:       rgba(203,213,225,0.85);
  --topnav-text-active:#f1f5f9;
  --topnav-hover-bg:   rgba(255,255,255,0.08);
  --topnav-active-bg:  rgba(255,255,255,0.13);
  --topnav-border:     rgba(255,255,255,0.10);
  --sidebar-bg:        rgba(15,23,42,0.97);
  --sidebar-border:    rgba(255,255,255,0.07);
}
```

### Tag 多色系

| 类名 | 背景 | 文字 | 用途示例 |
|------|------|------|---------|
| `tag-blue`   | `#eff6ff` | `#2563eb` | 主要分类、功能类型 |
| `tag-green`  | `#f0fdf4` | `#16a34a` | 正常/在售状态 |
| `tag-amber`  | `#fffbeb` | `#92400e` | 待处理/警告 |
| `tag-purple` | `#faf5ff` | `#7c3aed` | 特殊标记、大版本 |
| `tag-gray`   | `#f1f5f9` | `#64748b` | 停用/归档 |

Dark 模式 Tag 统一加 `rgba(色值, 0.18)` 背景，文字用对应浅色。

---

## 三、字体与排版

**字体栈**：`'PingFang SC', 'Microsoft YaHei', 'Segoe UI', -apple-system, sans-serif`  
**等宽字体**：`'SFMono-Regular', 'Consolas', 'Monaco', monospace`（用于编码、ID、数字统计）

| 级别 | 大小 | 字重 | 行高 | 用途 |
|------|------|------|------|------|
| 页面标题 h1 | 19px | 700 | 1.3 | 页面主标题 |
| 卡片标题 h2 | 15px / 13.5px | 600 | 1.4 | 区块/卡片标题 |
| 小节标题 h3 | 13px | 600 | 1.5 | 表单分组标题 |
| 正文 | 13px | 400 | 1.6 | 表格内容、表单值 |
| 辅助说明 | 12px | 400 | 1.5 | 描述、提示文字 |
| 标签/角标 | 11px | 600 | 1 | Badge、Tag、角标 |
| 超小说明 | 10px | 400 | 1.4 | 版权、时间戳次要信息 |

---

## 四、图标规范

**推荐图标库**：Lucide Icons / Heroicons（MIT 协议，SVG inline）

| 使用场景 | 尺寸 | 线宽 |
|---------|------|------|
| TopNav 一级菜单图标 | 14px | 1.8px |
| 侧边栏导航菜单图标 | 15px | 1.6px |
| 按钮内图标 | 14px | 1.4-1.5px |
| 表格操作图标 | 15px | 1.5px |
| 输入框前缀图标 | 14px | 1.4px |
| 状态提示图标 | 16px | 1.5px |
| 卡片标题图标 | 12px | 2px |
| 空态插图 | 60-64px | 0.9-1.5px |

**使用规则**：
- 仅使用 SVG inline，不使用字体图标
- 图标颜色继承父元素 `currentColor`，便于主题切换
- 图标 + 文字间距：`gap: 5px` 或 `gap: 6px`
- 纯图标按钮必须有 `title` 属性提供无障碍提示

---

## 五、动效规范

| 场景 | 时长 | 缓动 |
|------|------|------|
| 按钮 hover/active | 0.16s | ease |
| 输入框 focus | 0.16s | ease |
| 下拉菜单展开 | 0.15-0.18s | ease-out |
| 抽屉滑入/滑出 | 0.28s | cubic-bezier(0.4,0,0.2,1) |
| 弹窗出现/消失 | 0.22s | ease-out |
| Toast 出现/消失 | 0.25-0.28s | ease |
| 批量操作栏切换 | 0.2s | ease |
| 主题切换色彩过渡 | 0.20s | ease |
| 侧边栏折叠/展开 | 0.22s | ease |
| 骨架屏闪烁 | 1.5s | ease-in-out（infinite） |
| 欢迎横幅入场 | 0.5s | cubic-bezier(.22,.68,0,1.1) |
| 三级菜单展开 | 0.22s | ease |

**原则**：
- 功能性动效优先，装饰性动效克制
- 所有过渡使用 CSS `transition`，避免 JS 驱动动画
- 尊重用户 `prefers-reduced-motion` 设置，减弱或禁用动效

---

## 六、菜单架构与导航

### 架构设计：顶部一级域 + 左侧二三级侧边栏

本项目采用「**顶部通栏（一级域）+ 左侧侧边栏（二三级菜单）**」的双层导航结构：

| 一级域 | 含义 | 包含模块 |
|--------|------|---------|
| 工作台 | 首页看板 | 数据概览、待处理事项、快捷入口 |
| 用户 | 用户相关管理 | 用户管理、团队管理、社区管理 |
| 项目 | 项目类管理 | 品牌项目、海外文娱 |
| 数据 | 数据分析与查询 | 数据看板、查询工具（便捷功能） |
| 运营 | 运营配置 | 运营配置（14项子菜单）、分销管理 |
| 系统 | 系统管理 | 财务管理、权限管理、系统管理 |

### 顶部导航栏（TopNav）

```
高度：54px（--topnav-h）
position: fixed; top: 0; left: 0; right: 0; z-index: 300
背景：渐变玻璃拟态（--topnav-bg）
```

**结构（左→右）：**
1. Logo 区（30×30px 圆角 8px 图标 + 品牌名）+ 右边框分隔
2. 一级域 Tab 导航（等高铺满，可横向滚动）
3. 右侧操作区（主题切换 + 通知角标 + 用户头像下拉）

**一级 Tab 样式：**
```css
.pnav-item { height: 100%; padding: 0 14px; font-size: 13px; font-weight: 500; }
.pnav-item.active::after {
  content: ''; position: absolute; bottom: 0; left: 10px; right: 10px;
  height: 2px; border-radius: 2px 2px 0 0; background: #4f46e5;
}
[data-theme="dark"] .pnav-item.active::after { background: rgba(255,255,255,0.85); }
```

### 左侧侧边栏（Sidebar）

```
展开宽度：196px（--sidebar-w）
折叠宽度：52px
position: fixed; top: 54px; bottom: 0; left: 0; z-index: 200
```

**头部（Sidebar Header）：**
```
高度：min-height 48px
内容：24×24px 模块图标（圆角6px，品牌色背景）+ 当前模块名（13px/700）
折叠时：仅显示图标，居中对齐
```

**二级菜单项（nav-item）：**
```css
.nav-item {
  height: 40px; padding: 0 12px 0 14px;
  margin: 1px 8px; width: calc(100% - 16px);
  border-radius: 8px; font-size: 13px; font-weight: 500;
}
/* 激活态 */
.nav-item.active {
  color: #2563eb; background: rgba(37,99,235,0.12); font-weight: 600;
}
.nav-item.active::before {
  content: ''; position: absolute; left: 0; top: 7px; bottom: 7px;
  width: 3px; border-radius: 0 2px 2px 0; background: #2563eb;
}
```

**三级菜单项（nav-subitem）：**
```css
.nav-subitem {
  height: 36px; padding: 0 14px 0 40px;
  margin: 1px 8px; width: calc(100% - 16px);
  border-radius: 7px; font-size: 12.5px;
}
/* 前置圆点 */
.nav-subitem::before {
  content: ''; position: absolute; left: 27px; top: 50%;
  transform: translateY(-50%); width: 5px; height: 5px;
  border-radius: 50%; background: currentColor; opacity: 0.35;
}
.nav-subitem.active::before { opacity: 1; }
```

**分组标题（nav-group-label）：**
```css
.nav-group-label {
  padding: 14px 22px 4px;
  font-size: 10.5px; font-weight: 700;
  color: #8a9abf; text-transform: uppercase; letter-spacing: 0.8px;
}
/* 折叠态：隐藏 */
.sidebar.collapsed .nav-group-label { opacity: 0; height: 0; padding: 0; }
```

**底部（Sidebar Footer）：**
- 左：版本号（10px，折叠时隐藏）
- 右：折叠/展开按钮（26×26px，圆角6px）
- 折叠/展开按钮图标：`←` 展开态 / `→` 折叠态

**折叠态规则：**
- 文字、箭头、分组标签、Badge：`opacity: 0; pointer-events: none`
- 三级子菜单强制关闭：`max-height: 0 !important`
- 图标（18px）居中显示
- Hover 时右侧显示 Tooltip 浮层展示菜单名

### 面包屑规则

```
首页 / 用户 / 用户列表           ← 最多3层
首页 / 用户 / 实名信息 / 个人实名  ← 三级项展示格式（不超过3层）
```
- 末级不可点击，显示为当前页
- 面包屑区域：`padding: 10px 20px 0; font-size: 12px`

---

## 七、页面布局结构

```
┌──────────────────────────────────────────────────────┐
│  TopNav（54px fixed，z-index: 300）                   │
├────────────┬─────────────────────────────────────────┤
│            │  面包屑（10px 20px 0）                   │
│  Sidebar   │  ──────────────────────────────────      │
│  (196px)   │  Page Header                             │
│  fixed     │   ├── h1 标题（19px/700）                │
│            │   ├── 描述（12px/muted）                 │
│            │   └── 右侧操作按钮组                     │
│            │  Filter Card（筛选卡片，margin-bottom 14px）│
│            │  Table Card                              │
│            │   ├── Table Header（标题行 + 批量操作）  │
│            │   ├── Table Body                         │
│            │   └── Pagination                         │
└────────────┴─────────────────────────────────────────┘
```

### Page Header 规范

```css
.page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
.page-title  { font-size: 19px; font-weight: 700; }
.page-desc   { font-size: 12px; color: var(--text-muted); margin-top: 3px; }
```
- 右侧操作按钮组：导出、新增等，从右到左优先级递减（Primary 按钮最右）

### 筛选区（Filter Card）

```css
.filter-card { padding: 16px 18px; margin-bottom: 14px; }
.filter-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.filter-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border); }
```

**规则：**
- 筛选字段与「重置」「查询」按钮**同在一个卡片容器内**，不分离
- 最多 4 列网格，超过 8 个字段时折叠，点击「展开更多」显示
- 底部操作行：左侧「展开/收起」，右侧「重置（Default）」+「查询（Primary）」
- 查询触发：刷新列表，页码重置至第 1 页
- 重置：清空所有字段值，不自动触发查询，Toast 提示「筛选条件已重置」

### 批量操作栏（Bulk Action Bar）

```css
/* 表格卡片 header 内，右侧区域切换 */
.table-header-right { display: flex; align-items: center; gap: 8px; }
.bulk-bar { display: none; align-items: center; gap: 10px; }
.bulk-bar.show { display: flex; animation: fadeIn 0.2s ease; }
```

**规则：**
- **位置**：表格卡片 header 行右侧，不单独占行
- **默认态**：「列表标题 + 条数 + 每页条数切换」
- **选中态**（有选中时）：切换为「已选 N 项 / 批量操作按钮组 / 取消」，动画过渡 0.2s
- 取消：清空所有选中，header 恢复默认
- 批量删除使用 Danger 色按钮

---

## 八、组件规范

### 按钮（Button）

| 类型 | 背景 | 文字 | 边框 | 用途 |
|------|------|------|------|------|
| Primary | `--primary` | 白 | 无 | 主操作（新增、保存、查询） |
| Default | `--surface` | `--text-primary` | `--border` | 次级操作 |
| Danger | `--danger` | 白 | 无 | 不可逆操作（删除） |
| Danger-Outline | 白 | `--danger` | `#fca5a5` | 危险二级操作 |
| Ghost | 透明 | `--text-secondary` | 无 | 低优先级（取消） |

**尺寸：**
```css
.btn    { height: 34px; padding: 0 16px; font-size: 13px; border-radius: var(--radius-sm); }
.btn-sm { height: 30px; padding: 0 12px; font-size: 12px; }
.btn-lg { height: 38px; padding: 0 20px; font-size: 14px; }
```

**状态：**
- hover：加深背景或边框
- active：`transform: translateY(1px)`
- disabled：`opacity: 0.45; cursor: not-allowed`
- loading：左侧旋转图标，按钮禁用

### 输入框（Input）

> **筛选区专用小尺寸**：筛选条件区域使用 `.form-input-sm`，高度 30px，字号 12px，区别于表单内的标准输入框（34px）。

```css
/* 筛选区小输入框 */
.form-input-sm {
  height: 30px; padding: 0 9px;
  border: 1px solid var(--border); border-radius: 6px;
  font-size: 12px; font-family: inherit; background: var(--surface);
}
.form-input-sm:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37,99,235,0.10);
}
/* 错误态 */
.form-input-sm.error { border-color: var(--danger); }
/* 禁用 */
.form-input-sm:disabled { background: var(--surface-hover); color: var(--text-disabled); }

/* 表单内标准输入框（弹窗/抽屉） */
.form-input {
  height: 34px; padding: 0 10px;
  border: 1px solid var(--border); border-radius: var(--radius-sm);
  font-size: 13px; font-family: inherit; background: var(--surface);
}
```

### 下拉选择（Select）

```css
.form-select-sm {
  appearance: none; -webkit-appearance: none;
  background-image: url("...chevron-down SVG..."); background-repeat: no-repeat;
  background-position: right 8px center; padding-right: 28px; cursor: pointer;
}
```
- 支持搜索过滤（输入关键词过滤选项）
- 多选模式：已选项以 Tag 形式显示，超出换行

### Badge（状态标记）

```
● 在售   绿色背景 + 绿点 → background: var(--success-bg); color: var(--success)
● 草稿   黄色背景 + 黄点 → background: var(--warning-bg); color: var(--warning)
● 停用   灰色背景 + 灰点 → background: #f1f5f9; color: #64748b
● 异常   红色背景 + 红点 → background: var(--danger-bg); color: var(--danger)
```

```css
.status-badge {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 2px 8px; border-radius: var(--radius-xs);
  font-size: 11px; font-weight: 600;
  width: fit-content; white-space: nowrap; /* 宽度自适应内容，禁止撑满 td */
}
.status-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
```

> **注意**：`.badge` / `.tag` / `.status-badge` 均须声明 `width: fit-content; white-space: nowrap`，避免在宽列 `<td>` 中被拉伸撑满。

### 表格操作按钮（行内）

> **核心原则**：表格操作列按钮必须使用语义色系展示，**严禁使用浅灰色（`var(--text-muted)` / `#9aa5b4` 等）**，确保操作意图清晰可辨。

**操作类型 → 语义色映射：**

| 操作类型 | 图标色 | Hover 背景 | Hover 图标色 | 用途 |
|---------|--------|-----------|------------|------|
| 查看（view） | `var(--success)` `#16a34a` | `var(--success-bg)` `#f0fdf4` | `#15803d` | 查看详情、预览 |
| 编辑（edit） | `var(--primary)` `#2563eb` | `var(--primary-light)` `#eff6ff` | `#1d4ed8` | 编辑、修改 |
| 删除（delete） | `var(--danger)` `#dc2626` | `var(--danger-bg)` `#fef2f2` | `#b91c1c` | 删除、移除 |
| 禁用/停用（disable） | `var(--warning)` `#d97706` | `var(--warning-bg)` `#fffbeb` | `#b45309` | 停用、禁止 |
| 复制（copy） | `var(--info)` `#0891b2` | `var(--info-bg)` `#ecfeff` | `#0e7490` | 复制、克隆 |
| 更多（more） | `var(--text-secondary)` `#4a5568` | `var(--surface-hover)` `#f8fafc` | `var(--text-primary)` | 更多操作下拉 |

```css
/* 操作按钮基础样式 */
.action-btn {
  width: 28px; height: 28px; border-radius: 6px;
  display: inline-flex; align-items: center; justify-content: center;
  border: none; cursor: pointer; background: transparent;
  transition: background 0.15s ease, color 0.15s ease;
  flex-shrink: 0;
}

/* 各语义色类 */
.action-btn.view    { color: var(--success); }
.action-btn.edit    { color: var(--primary); }
.action-btn.delete  { color: var(--danger);  }
.action-btn.disable { color: var(--warning); }
.action-btn.copy    { color: var(--info);    }
.action-btn.more    { color: var(--text-secondary); }

/* Hover 状态：显示对应语义色浅色背景 */
.action-btn.view:hover    { background: var(--success-bg); color: #15803d; }
.action-btn.edit:hover    { background: var(--primary-light); color: var(--primary-hover); }
.action-btn.delete:hover  { background: var(--danger-bg);  color: #b91c1c; }
.action-btn.disable:hover { background: var(--warning-bg); color: #b45309; }
.action-btn.copy:hover    { background: var(--info-bg);    color: #0e7490; }
.action-btn.more:hover    { background: var(--surface-hover); color: var(--text-primary); }

/* Dark 模式下 Hover 背景加深一档 */
[data-theme="dark"] .action-btn.view:hover    { background: rgba(22,163,74,0.15);  }
[data-theme="dark"] .action-btn.edit:hover    { background: rgba(37,99,235,0.15);  }
[data-theme="dark"] .action-btn.delete:hover  { background: rgba(220,38,38,0.15);  }
[data-theme="dark"] .action-btn.disable:hover { background: rgba(217,119,6,0.15);  }
[data-theme="dark"] .action-btn.copy:hover    { background: rgba(8,145,178,0.15);  }
[data-theme="dark"] .action-btn.more:hover    { background: rgba(255,255,255,0.08); }

/* disabled 状态 */
.action-btn:disabled,
.action-btn[disabled] { opacity: 0.35; cursor: not-allowed; pointer-events: none; }
```

**操作列布局规范：**
```css
/* 操作列容器 */
.action-cell {
  display: flex; align-items: center; gap: 2px;
  justify-content: flex-end; flex-wrap: nowrap;
}
/* 操作列 th/td 固定右侧 */
.col-action {
  position: sticky; right: 0;
  background: var(--surface);
  box-shadow: -2px 0 6px rgba(0,0,0,0.04);
  white-space: nowrap;
}
[data-theme="dark"] .col-action { background: var(--surface); }
```

**纯图标操作按钮必须加 `title` 属性**（无障碍兜底）：
```html
<button class="action-btn view" title="查看详情"><!-- SVG icon --></button>
<button class="action-btn edit" title="编辑"><!-- SVG icon --></button>
<button class="action-btn delete" title="删除"><!-- SVG icon --></button>
```

---

## 九、表格规范

### 表头

```css
thead th {
  background: var(--surface-hover);
  font-size: 12px; font-weight: 600;
  color: var(--text-secondary); letter-spacing: 0.5px;
  padding: 10px 12px; text-align: left;
  border-bottom: 1px solid var(--border);
  white-space: nowrap; position: sticky; top: 0;
}
[data-theme="dark"] thead th { background: rgba(39,51,72,0.8); }
```

可排序列：右侧 ▲▼ 图标，激活排序方向时高亮为 `--primary` 色。

### 行样式

```css
tbody tr { height: 48px; border-bottom: 1px solid var(--border); cursor: pointer; }
tbody td { padding: 12px; font-size: 13px; vertical-align: middle; }
tbody tr:hover   { background: rgba(37,99,235,0.04); box-shadow: inset 3px 0 0 var(--primary); }
tbody tr.selected{ background: rgba(37,99,235,0.06); box-shadow: inset 3px 0 0 var(--primary); }
```

- 点击整行打开详情（操作列、checkbox 做 `stopPropagation`）

### 操作列

- 固定最右侧（`position: sticky; right: 0`），宽度按按钮数量（每个 28px，间距 2px）
- 图标按钮组使用语义色系：查看（绿 `--success`）/ 编辑（蓝 `--primary`）/ 禁用（橙 `--warning`）/ 删除（红 `--danger`）
- hover 各自显示对应语义色浅色背景（详见「八、组件规范 → 表格操作按钮」）
- **严禁使用统一浅灰色**展示操作按钮，必须通过色彩区分操作意图
- 操作数量 > 3 个时，将次要操作收入「更多」下拉菜单（`action-btn.more`）

### Checkbox 列

- 全选在表头，支持半选态（indeterminate）
- 行级 checkbox 独立勾选，实时更新批量操作栏计数

### 字段截断 Tooltip

```css
.td-overflow { max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
```
- 同时设置 `title` 属性为完整内容（浏览器原生 Tooltip 兜底）
- 富内容单元格：自定义 hover 浮层卡片，`z-index: 500`，延迟 300ms 显示

### 空态

居中：64px SVG 插图（opacity: 0.25）+ 「暂无数据」（14px/600）+ 说明（12px/muted）

### 加载态

骨架屏：按行数渲染行骨架，高度同数据行，灰色渐变闪烁动画。**不使用**全屏 Spinner 遮盖表格。

---

## 十、分页规范

```
左：共 N 条，第 X/Y 页
中：首页 / 上一页 / 页码按钮（当前页前后各2页）/ 下一页 / 末页
右：每页条数切换（10 / 20 / 50）
```

```css
.pagination { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; }
.page-btn   { height: 30px; min-width: 30px; padding: 0 8px; border-radius: 6px; border: 1px solid var(--border); }
.page-btn.active  { background: var(--primary); color: #fff; border-color: var(--primary); }
.page-btn:disabled{ opacity: 0.4; cursor: not-allowed; }
```

- 切换每页条数后重置至第 1 页
- 首页/上一页在第1页时禁用，下一页/末页在末页时禁用

---

## 十一、弹窗与抽屉

### 字段数量决策规则

| 字段数量 | 容器类型 | 理由 |
|---------|---------|------|
| **≤ 6 个字段** | **弹窗（Modal）** | 内容简短，弹窗聚焦效率高 |
| **7–14 个字段** | **抽屉（Drawer）** | 中等复杂度，侧滑不打断上下文 |
| **≥ 15 个字段** | **独立详情页（Detail Page）** | 字段过多，需要充分空间 |

> 字段数量按**可编辑字段**计算。确认删除、状态切换等操作类永远使用**弹窗**。

### 弹窗（Modal）：≤ 6 字段或确认类

| 尺寸 | 宽度 | 适用场景 |
|------|------|---------|
| sm | 420px | 确认删除、简单提示 |
| md | 520px | 简单表单（≤ 4 字段，单列） |
| lg | 640px | 中等表单（5-6 字段，两列） |

```
结构：
Header：标题（左）+ 关闭 ×（右）
────────────────────────────────
Body：表单内容（padding: 24px）
────────────────────────────────
Footer：取消（左）+ 确认（右，Primary）
```

- 遮罩 `rgba(0,0,0,0.45)`，点击关闭（危险确认弹窗除外）
- ESC 键关闭；打开时 focus 第一个输入框
- Body 超出视口时内部滚动，Header/Footer 固定

### 抽屉（Drawer）：7–14 字段

```
宽度：默认 520px，可拖拽（最小 380px，最大 90vw）
```

```
结构：
Header：标题+副标题/编码（左）+ 操作按钮组 + 关闭（右）
─────────────────────────────────────────────────────
Body（overflow-y: auto; overscroll-behavior: contain）
  分组1标题 ─────────
  字段网格...
  分组2标题 ─────────
  字段网格...
─────────────────────────────────────────────────────
Footer：取消（左）+ 保存（右，Primary）
```

- 宽度自适应列数：≥ 700px → 3列；≥ 500px → 2列；< 500px → 1列
- 分组数量不超过 6 组，每组有标题 + 底部 1px 分割线

### 独立详情页（≥ 15 字段）

```
路由：/module/detail/:id
Page Header：← 返回 / 标题 / 右侧（编辑、删除按钮）
分组卡片1：基础信息（2-3列自适应网格）
分组卡片2：详细属性
分组卡片3：关联数据
```

- 字段网格：≥ 1200px → 3列；≥ 800px → 2列；< 800px → 1列
- 只读详情：`label + value` 形式，不使用输入框
- 编辑模式：点击「编辑」按钮 inline edit，保存后切回只读

---

## 十二、表单交互规范

**校验时机：**
- 提交时：统一校验所有字段，滚动至第一个错误项
- blur 时：单字段校验，避免输入中报错
- 实时校验：仅限格式类（手机号、邮箱），输入停止 300ms 后触发

**必填标识**：字段 label 后红色 `*`（`color: var(--danger)`）

**错误展示：**
- 字段边框变红（`border-color: var(--danger)`）
- 字段下方 11px 红色错误文字
- 提交失败后自动 focus 第一个错误字段

**字段说明**：label 右侧 `ⓘ` 图标，hover 显示 Tooltip

**重置 vs 取消：**
- 重置：清空表单但不关闭（用于筛选区）
- 取消：不保存直接关闭（用于弹窗/抽屉）

---

## 十三、Toast 通知规范

```css
.toast-container { position: fixed; top: 66px; right: 22px; z-index: 9998; display: flex; flex-direction: column; gap: 8px; }
.toast { min-width: 200px; max-width: 340px; padding: 11px 13px 11px 14px; border-left: 3px solid; border-radius: var(--radius); }
```

| 类型 | 左边框色 | 图标 |
|------|---------|------|
| 成功 | `--success` | ✓ |
| 错误 | `--danger` | ✕ |
| 警告 | `--warning` | ⚠ |
| 信息 | `--info` | ℹ |

- 持续：2.5s 后右滑淡出（`transform: translateX(120%)`）
- 多条并存：从上到下堆叠，间距 8px
- 支持手动关闭（右侧 × 按钮）
- 出现动画：`from{opacity:0;transform:translateX(60px)} to{opacity:1;transform:translateX(0)}`

---

## 十四、权限控制规范

- 无权限操作：按钮 `disabled`，**不隐藏**，保持布局稳定
- disabled 按钮 hover：显示 Tooltip「暂无操作权限」
- 无权限页面：显示 403 错误页，不跳转登录
- 数据脱敏：无查看权限的字段显示 `****`

---

## 十五、危险操作规范

**删除确认弹窗**（必须）：

```
标题：确认删除？
内容：即将删除「{对象名称}」，此操作不可撤销。
按钮：取消（左，Default）/ 确认删除（右，Danger）
遮罩：点击不关闭（防误触）
```

**批量删除**：同上，内容改为「即将删除 N 条记录，此操作不可撤销。」

---

## 十六、主题切换规范

- 切换入口：TopNav 右侧图标按钮（🌙 Dark / ☀️ Light）
- 实现：切换 `<html data-theme="dark/light">`，纯 CSS 变量驱动

```javascript
function toggleTheme() {
  const cur  = document.documentElement.getAttribute('data-theme');
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}
// 初始化（页面加载时）
(function() {
  const saved  = localStorage.getItem('theme');
  const prefer = window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', saved || prefer);
})();
```

- 过渡：`transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease`

---

## 十七、响应式断点

> 管理后台以桌面端为主，移动端降级展示。

| 断点名 | 宽度 | 行为 |
|--------|------|------|
| xs | < 640px | 侧边栏隐藏，顶部汉堡菜单；表格横向滚动；弹窗全屏 |
| sm | 640-768px | 侧边栏收起（图标模式）；抽屉宽度 100vw |
| md | 768-1024px | 侧边栏可展开；表单 2 列 |
| lg | 1024-1280px | 标准布局；抽屉默认 520px |
| xl | ≥ 1280px | 宽屏；内容区 max-width 1680px |

**表单列数自适应：**

| 容器宽度 | 表单列数 |
|---------|---------|
| ≥ 700px | 3 列 |
| ≥ 500px | 2 列 |
| < 500px | 1 列 |

**统计卡片自适应：**

```css
.stat-grid { grid-template-columns: repeat(4, 1fr); }
@media (max-width: 1200px) { .stat-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 900px)  { .mid-grid  { grid-template-columns: 1fr; } }
```

---

## 十八、特殊表单字段规范

### 级联选择（Cascader）
- 父子三级联动，子级随父级变化重置
- 下拉面板多列并排展示（每级一列）

### 日期范围（DateRange）
- 开始/结束日期联动，开始不得晚于结束
- 清空时两个字段同时清空
- 快捷选项：今天 / 本周 / 本月 / 最近7天 / 最近30天

### 富文本（RichText）
- 工具栏：B / I / U / 有序列表 / 无序列表 / 链接 / 图片
- 最小高度 120px，最大高度 400px（内部滚动）
- 暗色模式工具栏和编辑区背景同步切换

### 文件上传（Upload）
- 支持拖拽 + 点击，格式/大小限制显示在组件下方
- 上传中：进度条显示百分比
- 已上传：文件名 + 大小 + 预览图（图片类）+ 删除

### 数字输入（NumberInput）
- 右侧 +/− 步进按钮
- 支持最大值/最小值/步长/精度配置
- 超限时边框红色提示

---

## 十九、错误页规范

| 页面 | 状态码 | 标题 | 说明 | 操作 |
|------|--------|------|------|------|
| 无权限 | 403 | 访问受限 | 您没有权限访问此页面 | 返回首页 |
| 未找到 | 404 | 页面不存在 | 您访问的页面已移动或删除 | 返回首页 |
| 服务异常 | 500 | 服务器错误 | 系统开小差了，请稍后重试 | 刷新 / 联系管理员 |
| 网络异常 | — | 网络中断 | 请检查您的网络连接 | 重试 |

**样式规范：**
- 居中布局，SVG 插图（light/dark 各一套）
- 状态码大字：64px，font-weight 700，`var(--primary-light)` 色
- 标题 24px，说明 14px `var(--text-muted)`
- 操作按钮横排

---

## 二十、导出与打印规范

### Excel 导出
- 表头：加粗，背景色 `#dbeafe`
- 数字列：右对齐，保留原始精度
- 状态列：导出中文文字（如「在售」），不导出 HTML 标签
- 日期列：格式 `YYYY-MM-DD`
- 文件名：`{模块名}_{YYYYMMDD}.xlsx`

### PDF 导出
- 列数 > 8 用横版，否则竖版
- 页眉：系统名称 + 导出时间；页脚：第N/共M页
- 表头在每页重复

### 打印（`@media print`）
- 隐藏：TopNav、Sidebar、操作按钮、分页、筛选区
- 显示：打印专用页眉（系统名 + 打印时间）
- 表格：铺满宽度，黑色边框，无 hover 效果

---

## 二十一、ESC 关闭优先级

```
危险确认弹窗（最高优先级）
  ↓ 关闭后
编辑抽屉
  ↓ 关闭后
详情抽屉
  ↓ 关闭后
其他浮层 / 下拉菜单（最低优先级）
```

同时存在多个浮层时，ESC 只关闭最顶层，不级联关闭。

---

## 二十二、自检清单

生成或评审页面前必须逐项确认：

**色彩与主题：**
- [ ] 所有色值使用 CSS 变量，`[data-theme="dark"]` 下均有对应覆盖
- [ ] 主题切换：localStorage 持久化 + CSS 变量驱动
- [ ] 暗色模式下 Tag、Badge、图标颜色均已适配

**导航与布局：**
- [ ] TopNav 高度 54px，sticky top 0，z-index 300
- [ ] Sidebar 宽度 196px（折叠 52px），fixed top 54px
- [ ] Sidebar 折叠/展开动效 0.22s ease
- [ ] 面包屑最多3层，末级不可点击
- [ ] 玻璃拟态 backdrop-filter 包含 -webkit- 前缀

**组件：**
- [ ] 图标统一 SVG inline，尺寸符合场景规范，含 `currentColor`
- [ ] 筛选区与批量操作栏严格分离，不混用
- [ ] 弹窗字段数 ≤ 6 个，超出改用抽屉，≥ 15 用独立详情页
- [ ] 表单必填字段有红色 `*`，校验在 blur/submit 时触发
- [ ] 危险操作有二次确认弹窗，遮罩不可点击关闭
- [ ] 无权限按钮 disabled 不隐藏
- [ ] 表格操作列按钮使用语义色系（查看绿/编辑蓝/禁用橙/删除红），**严禁统一浅灰色**
- [ ] 操作按钮 hover 显示对应语义色浅色背景
- [ ] 纯图标操作按钮均有 `title` 属性（无障碍）
- [ ] 操作数 > 3 个时收入「更多」下拉菜单

**交互与通知：**
- [ ] Toast 通知：位置 top 66px / right 22px，类型颜色符合规范
- [ ] ESC 关闭优先级正确
- [ ] 骨架屏加载态已实现（非全屏 Spinner）
- [ ] 空态 SVG + 主文字 + 说明已实现

**响应式与导出：**
- [ ] 移动端表格横向滚动，操作列 sticky right
- [ ] 弹窗/抽屉有移动端降级方案
- [ ] 导出文件名含模块名 + 日期
- [ ] Excel 导出状态列为中文文字

---

---

## 二十三、近期问题归纳与补充规范（v1.1 补丁）

> **整理日期**：2026-04-29  
> **来源**：自动化测试报告 + 多轮人工验收反馈  
> **适用场景**：新生成页面必须规避以下问题；旧页面按优先级逐步修复

---

### 23.1 筛选区规范补充

**问题根源**：多个页面（赠词记录、实名信息-个人、用户钱包等）筛选字段超过一行但没有展开/收起功能，且筛选输入框宽度过大，视觉凌乱。

**补充规范：**

1. **展开/收起阈值**：筛选区字段超过 **8 个**时，默认仅显示前 **4 个**，底部左侧出现「展开更多 ▾」按钮；展开后显示全部字段，按钮变为「收起 ▴」。
2. **筛选组件尺寸统一**：所有筛选区输入框 / 下拉框统一使用 `.form-input-sm`（`height: 30px; font-size: 12px`），宽度由 `grid` 布局均分，**禁止使用固定像素宽度**，禁止 `flex-wrap` 自动换行布局。
3. **强制使用 4 列网格**：`.filter-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }`，不允许改为 flex 或其他列数，响应式缩减见响应式断点章节。
4. **日期字段格式**：筛选区中日期范围必须使用**两个独立字段**（开始日期 + 结束日期），字段 label 分别标注「开始时间」「结束时间」，两字段相邻占用同一行的连续两列；不允许合并为单一宽字段。
5. **重置行为必须 Toast 提示**：重置按钮点击后清空所有字段值，Toast 显示「筛选条件已重置」，**不自动触发查询**。

```css
/* 展开/收起按钮标准样式 */
.filter-expand-btn {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 12px; color: var(--primary); cursor: pointer;
  background: none; border: none; padding: 0;
}
.filter-expand-btn svg { width: 12px; height: 12px; transition: transform 0.18s ease; }
.filter-expand-btn.expanded svg { transform: rotate(180deg); }

/* 折叠态隐藏多余行 */
.filter-grid .filter-row-extra { display: none; }
.filter-grid.expanded .filter-row-extra { display: contents; }
```

---

### 23.2 表格列宽规范补充

**问题根源**：多个表格（用户钱包、提现记录、分销比例配置等）未设置列宽约束，导致内容少的列被浏览器拉伸，视觉间距失衡。

**补充规范：**

1. **必须使用 `<colgroup>`** 对列宽进行约束，不允许完全依赖浏览器自动分配。
2. **列宽分类原则**：

| 列类型 | 推荐宽度 | 示例字段 |
|--------|---------|---------|
| 序号 / ID | `50–70px` | 序号、编号 |
| 短码 / 状态 | `80–100px` | 状态、类型 |
| 时间戳 | `140–160px` | 创建时间、操作时间 |
| 姓名 / 昵称 | `100–130px` | 用户昵称、持卡人 |
| 手机号 / 证件号 | `130–150px` | 手机号、身份证号 |
| 金额 / 数值 | `100–120px` | 金额、比例 |
| 长文本描述 | `剩余空间（flex 1）` | 备注、内容 |
| 操作列 | 按按钮数 × 30px | 操作 |

3. **`table-layout: fixed` + 百分比分配**（推荐）：对于列数稳定的表格，使用固定布局配合百分比，确保各列等比分配。
4. **文字溢出处理**：所有非操作列单元格必须设置 `overflow: hidden; text-overflow: ellipsis; white-space: nowrap`，并通过 `title` 属性展示完整内容。

```css
/* 标准表格列宽示例 */
table { table-layout: fixed; width: 100%; }
colgroup col.col-id     { width: 60px; }
colgroup col.col-time   { width: 150px; }
colgroup col.col-status { width: 90px; }
colgroup col.col-action { width: 120px; } /* 4个操作按钮 */
colgroup col.col-flex   { width: auto; }  /* 自动填充剩余 */

td, th { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
```

---

### 23.3 侧边栏宽度与菜单结构规范补充

**问题根源**：发现多个文件将 `--sidebar-w` 误写为 `210px`，且 `index.html` 工作台的侧边栏菜单结构与 PRD 不一致，缺失多个分组。

**补充规范：**

1. **侧边栏宽度固定值**：`--sidebar-w: 196px`，折叠态 `52px`，**严禁写为其他值**，所有文件 `:root` 必须统一。
2. **侧边栏菜单完整分组结构**（用户域示例）：
   ```
   用户管理     → 用户列表 / 实名信息 / 媒体账号 / 提现账户 / 黑名单 / 赠词记录 / 兑换记录
   用户资金     → 用户钱包 / 分红明细 / 奖励明细 / 提现记录
   用户通知     → 站内信通知 / 微信通知
   用户体系     → 用户等级 / 用户段位 / 权益配置 / 勋章配置 / 用户等级日志
   团长体系     → 团长等级配置 / 分销比例配置 / 团长身份日志
   ```
3. **新增独立 HTML 页面时**：该页面的侧边栏必须与 `index.html` 工作台中对应域的菜单结构**保持完全一致**，不允许出现分组缺失或菜单项遗漏。
4. **折叠态 Tooltip**：侧边栏折叠时，鼠标 hover 菜单图标必须显示菜单名 Tooltip。实现方式：JS 监听 `sidebar.collapsed` 状态，折叠时对所有 `.nav-item` 设置 `title` 属性值为其文字内容。

```javascript
function updateNavTooltips() {
  const collapsed = sidebar.classList.contains('collapsed');
  document.querySelectorAll('.nav-item, .nav-subitem').forEach(item => {
    const textEl = item.querySelector('.nav-text');
    item.title = collapsed && textEl ? textEl.textContent.trim() : '';
  });
}
```

---

### 23.4 操作按钮 CSS 类命名规范

**问题根源**：多个文件将删除按钮类名写为 `.action-btn.del`，但 CSS 规范定义的是 `.action-btn.delete`，导致颜色失效显示为灰色。

**强制规范：**

| 操作 | 正确 class | 错误写法（禁止） |
|------|-----------|----------------|
| 删除 | `action-btn delete` | `action-btn del`、`action-btn danger` |
| 编辑 | `action-btn edit` | `action-btn edit-btn`、`action-btn modify` |
| 查看 | `action-btn view` | `action-btn detail`、`action-btn preview` |
| 禁用 | `action-btn disable` | `action-btn ban`、`action-btn stop` |
| 复制 | `action-btn copy` | `action-btn clone`、`action-btn duplicate` |
| 更多 | `action-btn more` | `action-btn extra`、`action-btn dropdown` |

> 以上类名是唯一合法写法，不允许自造变体。

---

### 23.5 主题初始化防闪烁规范

**问题根源**：主题初始化脚本放在 `<body>` 底部或 JS 文件末尾，导致深色模式下页面刷新时先短暂显示亮色（FOUC 闪白）。

**强制规范：**

主题初始化脚本必须**内联**在 `<head>` 内，位于所有 CSS `<link>` 之前，且必须是同步脚本（不加 `defer` / `async`）：

```html
<head>
  <meta charset="UTF-8">
  <!-- 主题初始化必须放在所有CSS加载之前 -->
  <script>
    (function() {
      var saved = localStorage.getItem('theme');
      var prefer = window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', saved || prefer);
    })();
  </script>
  <link rel="stylesheet" href="...">
</head>
```

---

### 23.6 弹窗遮罩交互规范补充

**问题根源**：危险确认弹窗（删除/批量删除/审核驳回）的遮罩在部分页面可以点击关闭，与规范「不可点击关闭」要求冲突。

**补充规范：**

1. **危险确认弹窗**：遮罩 `onclick` **不得绑定关闭函数**，或使用 `handleOverlayClick()` 内部判断当前是否有危险弹窗激活，激活时阻止关闭。
2. **普通表单弹窗**：遮罩可点击关闭（`onclick="closeModal()"`）。
3. **抽屉**：遮罩可点击关闭（`onclick="closeDrawer()"`）。
4. **审核驳回弹窗**：属于危险操作，遮罩不可点击关闭，需明确输入驳回原因后方可提交。

```javascript
// 标准遮罩点击处理
function handleOverlayClick(event, modalId) {
  // 危险弹窗列表：不允许点击遮罩关闭
  const dangerModals = ['confirm-delete-modal', 'batch-delete-modal', 'reject-modal'];
  if (dangerModals.includes(modalId)) return;
  closeModal(modalId);
}
```

---

### 23.7 分页组件规范补充

**问题根源**：部分页面分页按钮尺寸写为 `28×28px`，每页条数缺少「10条」选项。

**强制规范：**

1. **分页按钮尺寸**：`height: 30px; min-width: 30px`，不允许写为 `28px`。
2. **每页条数选项**：必须提供 **10 / 20 / 50** 三个选项，默认选中 `20`。
3. **每页条数切换后**：自动重置至第 1 页，并触发列表刷新。

```html
<!-- 标准每页条数选择器 -->
<select class="form-select-sm page-size-select">
  <option value="10">10条/页</option>
  <option value="20" selected>20条/页</option>
  <option value="50">50条/页</option>
</select>
```

---

### 23.8 Badge / Tag 类名规范补充

**问题根源**：部分文件使用了 `.badge-primary` 类名，但规范中信息类 Badge 为 `.badge-info`（对应 `--info` 色系）。

**Badge 完整类名映射：**

| 语义 | 类名 | 颜色变量 |
|------|------|---------|
| 成功 / 正常 | `badge-success` | `--success` |
| 警告 / 待处理 | `badge-warning` | `--warning` |
| 危险 / 异常 | `badge-danger` | `--danger` |
| 信息 / 处理中 | `badge-info` | `--info` |
| 默认 / 停用 | `badge-default` | `#64748b` |

> `.badge-primary` **不是合法类名**，禁止使用。信息类统一使用 `.badge-info`。

Dark 模式下 Badge 必须补充适配：
```css
[data-theme="dark"] .badge-info {
  background: rgba(8,145,178,0.18);
  color: #22d3ee;
  border-color: rgba(8,145,178,0.3);
}
```

---

### 23.9 面包屑 HTML 结构规范

**问题根源**：部分页面面包屑中间层使用 `<span>` 而非 `<a>`，导致可点击层级不正确。

**强制规范：**

```html
<!-- 正确结构：可点击层用 <a>，末级用 <span> -->
<nav class="breadcrumb">
  <a href="index.html">工作台</a>
  <span class="sep">/</span>
  <a href="user.html">用户管理</a>   <!-- 可点击，跳转至分组首页 -->
  <span class="sep">/</span>
  <span>用户列表</span>              <!-- 末级：不可点击，当前页 -->
</nav>
```

- 中间层（非末级）**必须使用 `<a>` 标签**，有效 `href` 指向对应页面
- 末级（当前页）**必须使用 `<span>` 标签**，无点击行为
- 分隔符 `/` 使用独立 `<span class="sep">` 包裹，不作为文字内容的一部分

---

### 23.10 无障碍与动效规范补充

**问题根源**：全站所有页面均缺少 `@media (prefers-reduced-motion)` 声明，不尊重用户辅助功能设置。

**强制规范：**

每个页面的全局 CSS 末尾必须添加：

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

### 23.11 空态 SVG 透明度规范

**问题根源**：部分页面空态 SVG 的 `opacity` 写为 `0.3`，规范要求 `0.25`。

**强制规范：**

```css
.empty-state svg,
.empty-state .empty-icon { opacity: 0.25; } /* 固定 0.25，不允许 0.3 或其他值 */
```

---

### 23.12 CSS 变量完整性规范

**问题根源**：部分页面 `:root` 缺少 `--bg`、`--shadow-xl` 等变量声明，导致使用这些变量的组件样式回退失效。

**必须声明的完整变量清单**（每个独立 HTML 文件均须包含）：

```css
:root {
  /* 必须存在，不允许遗漏 */
  --bg: #f0f4f8;
  --surface: #ffffff;
  --surface-hover: #f8fafc;
  --border: #e8edf3;
  --border-hover: #c8d5e2;
  --text-primary: #18222f;
  --text-secondary: #4a5568;
  --text-muted: #9aa5b4;
  --text-disabled: #c8d5e2;
  --primary: #2563eb;
  --primary-hover: #1d4ed8;
  --primary-light: #eff6ff;
  --success: #16a34a;  --success-bg: #f0fdf4;
  --warning: #d97706;  --warning-bg: #fffbeb;
  --danger:  #dc2626;  --danger-bg:  #fef2f2;
  --info:    #0891b2;  --info-bg:    #ecfeff;
  --shadow-sm: 0 1px 4px rgba(30,40,60,0.06);
  --shadow:    0 2px 10px rgba(30,40,60,0.08);
  --shadow-lg: 0 8px 28px rgba(30,40,60,0.11);
  --shadow-xl: 0 16px 48px rgba(30,40,60,0.14); /* 禁止遗漏 */
  --radius-xs: 4px; --radius-sm: 7px; --radius: 10px; --radius-lg: 14px;
  --transition: all 0.16s ease;
  --topnav-h: 54px;
  --sidebar-w: 196px; /* 固定 196px，禁止改为 210px 或其他值 */
}
```

---

### 23.13 Toast 位置精确值

**问题根源**：`index.html` 的 Toast 容器位置写为 `top: 64px; right: 20px`，偏差规范值。

**强制值**（不允许偏差任何像素）：

```css
.toast-container {
  position: fixed;
  top: 66px;   /* 固定 66px，不是 64px */
  right: 22px; /* 固定 22px，不是 20px */
  z-index: 9998;
}
```

---

### 23.14 Page Header margin-bottom 规范

**问题根源**：部分页面 `.page-header` 的 `margin-bottom` 写为 `20px`。

**强制值**：

```css
.page-header { margin-bottom: 16px; } /* 固定 16px，不允许 20px 或其他值 */
```

---

## 二十三补充规范自检清单

在 [二十二、自检清单] 基础上新增以下检查项：

**筛选区：**
- [ ] 筛选字段 > 8 个时有展开/收起按钮，前 4 个默认显示
- [ ] 筛选区布局使用 `grid repeat(4,1fr)`，禁止使用 flex
- [ ] 所有筛选输入框使用 `.form-input-sm`（30px 高），无固定像素宽度
- [ ] 重置按钮有 Toast 提示，不自动触发查询

**表格：**
- [ ] 所有表格有 `<colgroup>` 列宽约束，无「某列极宽某列极窄」现象
- [ ] `table-layout: fixed` 或有效 `min-width` 控制列宽均衡
- [ ] 非操作列单元格有 `text-overflow: ellipsis` + `title` 属性

**CSS 规范：**
- [ ] `--sidebar-w: 196px`（不是 210px）
- [ ] `--shadow-xl` 变量已声明
- [ ] `--bg` 变量已声明
- [ ] Toast `top: 66px; right: 22px`（精确值）
- [ ] `.page-header { margin-bottom: 16px }`（不是 20px）
- [ ] 空态 SVG `opacity: 0.25`（不是 0.3）
- [ ] 删除按钮类名为 `action-btn delete`（不是 `del`）
- [ ] Badge 信息类使用 `badge-info`（不是 `badge-primary`）
- [ ] 全站无 `.badge-primary` 残留

**主题与动效：**
- [ ] 主题初始化脚本在 `<head>` 最前（CSS link 之前）
- [ ] 页面有 `@media (prefers-reduced-motion: reduce)` 声明
- [ ] Dark 模式 `.badge-info` 已适配

**面包屑：**
- [ ] 中间层使用 `<a>` 标签，末级使用 `<span>`

**分页：**
- [ ] 分页按钮 `height: 30px; min-width: 30px`（不是 28px）
- [ ] 每页条数有 10 / 20 / 50 三个选项

**弹窗遮罩：**
- [ ] 危险确认弹窗遮罩不可点击关闭

**侧边栏：**
- [ ] 折叠态菜单图标有 Tooltip（`updateNavTooltips` 实现）

---

*补充规范 v1.1，整理日期 2026-04-29，基于自动化测试 + 多轮验收反馈*
