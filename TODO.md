# 右豹管理后台 · 修复待办

> 仅保留修复与收尾项；其它规划请见 `prd-admin.md` / `prd-dashboard.md`。

## 修复 / 收尾（前端）

- [ ] **个人明细查询**（`/data/personal-detail`）：表格区增加「导出 CSV」，复用 `downloadCsv`。
- [x] **邀请榜单**：筛选条件变更时重置页码，且页码不超过总页数（`/data/invite-rank`）。
- [ ] **构建体积**：`npm run build` 主 chunk >500kB 警告；按需路由懒加载或拆包。
- ~~**表格规范巡检**（数据域）：`admin/src/views/data/*.vue` 已与 `theme.css` 约定对齐（`th-num`/`td-num`、`ul-table--fixed`+`colgroup` 等）；其余 `views` 按需增量巡检。~~
