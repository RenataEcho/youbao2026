<template>
  <div class="mc-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">用户体系</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">勋章配置</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">勋章配置</h1>
          <p class="page-desc">管理勋章类型与勋章详情配置</p>
        </div>
      </div>

      <!-- Tab 切换 -->
      <div class="glass-card tab-nav-shell" role="tablist" aria-label="勋章配置子模块">
        <div class="tab-nav">
          <button
            id="mc-tab-type"
            class="tab-item"
            :class="{ active: activeTab === 'type' }"
            type="button"
            role="tab"
            :aria-selected="activeTab==='type'"
            :tabindex="activeTab==='type'?0:-1"
            @click="activeTab='type'"
          >勋章类型</button>
          <button
            id="mc-tab-medal"
            class="tab-item"
            :class="{ active: activeTab === 'medal' }"
            type="button"
            role="tab"
            :aria-selected="activeTab==='medal'"
            :tabindex="activeTab==='medal'?0:-1"
            @click="activeTab='medal'"
          >勋章配置</button>
        </div>
      </div>

      <!-- ===== Tab 一：勋章类型 ===== -->
      <template v-if="activeTab==='type'">
        <!-- 筛选 -->
        <div class="glass-card bl-filter">
          <div class="ul-filter-grid">
            <div class="ul-form-group"><label class="ul-label">类型名称</label><input v-model="tf.name" class="ul-input" placeholder="模糊搜索类型名称"></div>
            <div class="ul-form-group">
              <label class="ul-label">状态</label>
              <select v-model="tf.status" class="ul-input ul-select">
                <option value="">全部</option><option value="显示">显示</option><option value="隐藏">隐藏</option>
              </select>
            </div>
            <div class="ul-form-group"><label class="ul-label">操作人</label><input v-model="tf.operator" class="ul-input" placeholder="管理员ID"></div>
            <template v-if="typeFilterExpanded">
              <div class="ul-form-group"><label class="ul-label">操作开始时间</label><input v-model="tf.startTime" type="date" class="ul-input"></div>
              <div class="ul-form-group"><label class="ul-label">操作结束时间</label><input v-model="tf.endTime" type="date" class="ul-input"></div>
            </template>
          </div>
          <div class="ul-filter-footer">
            <button class="ul-expand-btn" :class="{expanded:typeFilterExpanded}" @click="typeFilterExpanded=!typeFilterExpanded">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              {{ typeFilterExpanded?'收起筛选':'展开更多筛选' }}
            </button>
            <div style="display:flex;gap:8px">
              <button type="button" class="btn btn-default btn-sm" @click="resetTypeFilter">重置</button>
              <button type="button" class="btn btn-primary btn-sm" @click="queryTypeTab">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                查询
              </button>
            </div>
          </div>
        </div>

        <div class="glass-card table-card">
          <div class="table-header">
            <div class="table-title">勋章类型<span class="table-count">共 {{ filteredTypes.length }} 条</span></div>
            <button class="btn btn-primary btn-sm" @click="openTypeCreate">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              新增
            </button>
          </div>
          <div class="mc-table-wrap">
            <table class="mc-table">
              <colgroup>
                <col style="min-width:120px"><col style="min-width:200px"><col style="min-width:80px">
                <col style="min-width:80px"><col style="min-width:70px"><col style="min-width:90px">
                <col style="min-width:120px"><col style="width:90px">
              </colgroup>
              <thead>
                <tr>
                  <th>类型名称</th><th>类型描述</th><th style="text-align:right">类型排序</th>
                  <th style="text-align:right">关联勋章</th><th>状态</th><th>操作人</th><th>操作时间</th>
                  <th class="col-action" style="text-align:center">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in pagedTypes" :key="row.id" class="ul-row">
                  <td style="font-size:13px;font-weight:600">{{ row.name }}</td>
                  <td class="ul-muted" style="font-size:12px">{{ row.desc }}</td>
                  <td style="text-align:right"><span class="ul-mono" style="font-size:12px">{{ row.sort }}</span></td>
                  <td style="text-align:right">
                    <a href="#" style="font-size:13px;font-weight:700;color:var(--primary);text-decoration:none" @click.prevent="jumpToMedal(row.name)">{{ row.medalCount }}<span style="font-weight:400;font-size:11px;color:var(--text-muted)"> 个</span></a>
                  </td>
                  <td>
                    <span class="badge" :class="row.status==='显示'?'badge-success':'badge-gray'" style="cursor:pointer" @click="row.status=row.status==='显示'?'隐藏':'显示'">{{ row.status }}</span>
                  </td>
                  <td><span class="ul-mono" style="font-size:11px;color:var(--text-muted)">{{ row.operator }}</span></td>
                  <td class="ul-muted" style="font-size:11px">{{ row.operateTime }}</td>
                  <td class="col-action">
                    <div class="action-btns">
                      <button type="button" class="action-btn edit" title="编辑" @click="openTypeEdit(row)">编辑</button>
                      <button type="button" class="action-btn delete" title="删除" @click="typeDeleteTarget=row;typeDeleteVisible=true">删除</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="ul-pagination">
            <span class="ul-page-info">共 <strong>{{ filteredTypes.length }}</strong> 条，第 <strong>{{ typePage }}</strong>/<strong>{{ typeTotalPages }}</strong> 页</span>
            <div style="display:flex;align-items:center;gap:4px">
              <button type="button" class="ul-pg-btn" :disabled="typePage <= 1" @click="goTypePage(1)">«</button>
              <button type="button" class="ul-pg-btn" :disabled="typePage <= 1" @click="goTypePage(typePage - 1)">‹</button>
              <template v-for="p in typePaginationPages" :key="'t' + String(p)">
                <button v-if="p !== '...'" type="button" class="ul-pg-btn" :class="{ active: p === typePage }" @click="goTypePage(Number(p))">{{ p }}</button>
                <span v-else style="padding:0 4px;color:var(--text-muted);font-size:13px">...</span>
              </template>
              <button type="button" class="ul-pg-btn" :disabled="typePage >= typeTotalPages" @click="goTypePage(typePage + 1)">›</button>
              <button type="button" class="ul-pg-btn" :disabled="typePage >= typeTotalPages" @click="goTypePage(typeTotalPages)">»</button>
            </div>
            <div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-muted)">
              每页
              <select class="ul-pg-size" :value="typePageSize" @change="onTypePageSizeChange($event)">
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
              条
            </div>
          </div>
        </div>
      </template>

      <!-- ===== Tab 二：勋章配置 ===== -->
      <template v-if="activeTab==='medal'">
        <!-- 筛选 -->
        <div class="glass-card bl-filter">
          <div class="ul-filter-grid">
            <div class="ul-form-group"><label class="ul-label">勋章名称</label><input v-model="mf.name" class="ul-input" placeholder="模糊搜索勋章名称"></div>
            <div class="ul-form-group">
              <label class="ul-label">勋章类型</label>
              <select v-model="mf.medalType" class="ul-input ul-select">
                <option value="">全部</option>
                <option v-for="t in typeList" :key="t.id" :value="t.name">{{ t.name }}</option>
              </select>
            </div>
            <div class="ul-form-group">
              <label class="ul-label">获得条件类型</label>
              <select v-model="mf.condType" class="ul-input ul-select">
                <option value="">全部</option>
                <option value="首次注册">首次注册</option>
                <option value="连续爆单">连续爆单</option>
                <option value="累计收益">累计收益</option>
                <option value="项目爆单前x名">项目爆单前x名</option>
                <option value="注册累计天">注册累计天</option>
              </select>
            </div>
            <div class="ul-form-group">
              <label class="ul-label">状态</label>
              <select v-model="mf.status" class="ul-input ul-select">
                <option value="">全部</option><option value="显示">显示</option><option value="隐藏">隐藏</option>
              </select>
            </div>
            <template v-if="medalFilterExpanded">
              <div class="ul-form-group"><label class="ul-label">操作人</label><input v-model="mf.operator" class="ul-input" placeholder="管理员ID"></div>
              <div class="ul-form-group"><label class="ul-label">操作开始时间</label><input v-model="mf.startTime" type="date" class="ul-input"></div>
              <div class="ul-form-group"><label class="ul-label">操作结束时间</label><input v-model="mf.endTime" type="date" class="ul-input"></div>
            </template>
          </div>
          <div class="ul-filter-footer">
            <button class="ul-expand-btn" :class="{expanded:medalFilterExpanded}" @click="medalFilterExpanded=!medalFilterExpanded">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              {{ medalFilterExpanded?'收起筛选':'展开更多筛选' }}
            </button>
            <div style="display:flex;gap:8px">
              <button type="button" class="btn btn-default btn-sm" @click="resetMedalFilter">重置</button>
              <button type="button" class="btn btn-primary btn-sm" @click="queryMedalTab">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                查询
              </button>
            </div>
          </div>
        </div>

        <div class="glass-card table-card">
          <div class="table-header">
            <div class="table-title">勋章配置<span class="table-count">共 {{ filteredMedals.length }} 条</span></div>
            <button class="btn btn-primary btn-sm" @click="openMedalCreate">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              新增
            </button>
          </div>
          <div class="mc-table-wrap">
            <table class="mc-table">
              <colgroup>
                <col style="min-width:130px"><col style="width:60px"><col style="min-width:100px">
                <col style="min-width:160px"><col style="min-width:70px"><col style="min-width:80px">
                <col style="min-width:90px"><col style="min-width:120px"><col style="width:90px">
              </colgroup>
              <thead>
                <tr>
                  <th>勋章名称</th><th>勋章图标</th><th>勋章类型</th><th>获得条件</th>
                  <th>状态</th><th style="text-align:right">获得人数</th>
                  <th>操作人</th><th>操作时间</th><th class="col-action" style="text-align:center">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in pagedMedals" :key="row.id" class="ul-row">
                  <td style="font-size:13px;font-weight:600">{{ row.name }}</td>
                  <td>
                    <div class="mc-icon-thumb" :style="`background:${row.color}22`">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" :stroke="row.color" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    </div>
                  </td>
                  <td><span class="tag tag-gray" style="font-size:11px">{{ row.medalType }}</span></td>
                  <td style="font-size:12px;color:var(--text-secondary)">{{ row.condition }}</td>
                  <td><span class="badge" :class="row.status==='显示'?'badge-success':'badge-gray'" style="cursor:pointer" @click="row.status=row.status==='显示'?'隐藏':'显示'">{{ row.status }}</span></td>
                  <td style="text-align:right"><span class="ul-mono" style="font-weight:700">{{ row.earnCount.toLocaleString() }}<span style="font-weight:400;font-size:11px;color:var(--text-muted)"> 人</span></span></td>
                  <td><span class="ul-mono" style="font-size:11px;color:var(--text-muted)">{{ row.operator }}</span></td>
                  <td class="ul-muted" style="font-size:11px">{{ row.operateTime }}</td>
                  <td class="col-action">
                    <div class="action-btns">
                      <button type="button" class="action-btn edit" title="编辑" @click="openMedalEdit(row)">编辑</button>
                      <button type="button" class="action-btn delete" title="删除" @click="medalDeleteTarget=row;medalDeleteVisible=true">删除</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="ul-pagination">
            <span class="ul-page-info">共 <strong>{{ filteredMedals.length }}</strong> 条，第 <strong>{{ medalPage }}</strong>/<strong>{{ medalTotalPages }}</strong> 页</span>
            <div style="display:flex;align-items:center;gap:4px">
              <button type="button" class="ul-pg-btn" :disabled="medalPage <= 1" @click="goMedalPage(1)">«</button>
              <button type="button" class="ul-pg-btn" :disabled="medalPage <= 1" @click="goMedalPage(medalPage - 1)">‹</button>
              <template v-for="p in medalPaginationPages" :key="'m' + String(p)">
                <button v-if="p !== '...'" type="button" class="ul-pg-btn" :class="{ active: p === medalPage }" @click="goMedalPage(Number(p))">{{ p }}</button>
                <span v-else style="padding:0 4px;color:var(--text-muted);font-size:13px">...</span>
              </template>
              <button type="button" class="ul-pg-btn" :disabled="medalPage >= medalTotalPages" @click="goMedalPage(medalPage + 1)">›</button>
              <button type="button" class="ul-pg-btn" :disabled="medalPage >= medalTotalPages" @click="goMedalPage(medalTotalPages)">»</button>
            </div>
            <div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-muted)">
              每页
              <select class="ul-pg-size" :value="medalPageSize" @change="onMedalPageSizeChange($event)">
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
              条
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- 勋章类型 新增/编辑 弹窗 -->
    <div class="ul-overlay" :class="{show:typeEditVisible}" @click.self="()=>{}"></div>
    <div class="ul-modal" :class="{show:typeEditVisible}" style="width:640px">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid var(--border)">
        <div style="font-size:15px;font-weight:700">{{ typeEditTarget?'编辑勋章类型':'新增勋章类型' }}</div>
        <button class="ul-icon-btn" @click="typeEditVisible=false"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <div style="padding:20px;display:flex;flex-direction:column;gap:14px">
        <div class="ul-form-group"><label class="ul-label">类型名称 <span style="color:var(--danger)">*</span></label><input v-model="typeForm.name" class="ul-input" placeholder="请输入类型名称"></div>
        <div class="ul-form-group"><label class="ul-label">类型描述</label><textarea v-model="typeForm.desc" class="ul-input" rows="2" style="height:auto;resize:vertical" placeholder="选填，类型描述说明"></textarea></div>
        <div class="ul-form-group"><label class="ul-label">类型排序 <span style="color:var(--danger)">*</span></label><input v-model.number="typeForm.sort" type="number" min="1" class="ul-input" style="max-width:120px" placeholder="正整数，越小越靠前"></div>
        <div class="ul-form-group">
          <label class="ul-label">状态 <span style="color:var(--danger)">*</span></label>
          <div style="display:flex;gap:16px;margin-top:4px">
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:13px"><input type="radio" v-model="typeForm.status" value="显示" style="accent-color:var(--primary)"> 显示</label>
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:13px"><input type="radio" v-model="typeForm.status" value="隐藏" style="accent-color:var(--primary)"> 隐藏</label>
          </div>
        </div>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:10px;padding:14px 20px;border-top:1px solid var(--border)">
        <button class="btn btn-default" @click="typeEditVisible=false">取消</button>
        <button class="btn btn-primary" :disabled="!typeForm.name||!typeForm.sort" @click="saveType">{{ typeEditTarget?'保存':'新增' }}</button>
      </div>
    </div>

    <!-- 勋章类型删除确认 -->
    <div class="ul-overlay" :class="{show:typeDeleteVisible}" @click.self="()=>{}"></div>
    <div class="ul-modal" :class="{show:typeDeleteVisible}" style="width:420px">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid var(--border)">
        <div style="font-size:15px;font-weight:700;color:var(--danger)">确认删除</div>
        <button class="ul-icon-btn" @click="typeDeleteVisible=false"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <div style="padding:20px;font-size:13px;color:var(--text-secondary);line-height:1.7">确认删除勋章类型「<strong>{{ typeDeleteTarget?.name }}</strong>」？此操作不可撤销。</div>
      <div style="display:flex;justify-content:flex-end;gap:10px;padding:14px 20px;border-top:1px solid var(--border)">
        <button class="btn btn-default" @click="typeDeleteVisible=false">取消</button>
        <button class="btn btn-danger" @click="doDeleteType">确认删除</button>
      </div>
    </div>

    <!-- 勋章 新增/编辑 弹窗 -->
    <div class="ul-overlay" :class="{show:medalEditVisible}" @click.self="()=>{}"></div>
    <div class="ul-modal" :class="{show:medalEditVisible}" style="width:640px">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid var(--border)">
        <div style="font-size:15px;font-weight:700">{{ medalEditTarget?'编辑勋章':'新增勋章' }}</div>
        <button class="ul-icon-btn" @click="medalEditVisible=false"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <div style="padding:20px;display:flex;flex-direction:column;gap:14px">
        <div class="ul-form-group"><label class="ul-label">勋章名称 <span style="color:var(--danger)">*</span></label><input v-model="medalForm.name" class="ul-input" placeholder="请输入勋章名称"></div>
        <div class="ul-form-group">
          <label class="ul-label">勋章图标 <span style="color:var(--danger)">*</span></label>
          <div style="display:flex;align-items:center;gap:12px;margin-top:4px">
            <div class="mc-icon-thumb" style="width:48px;height:48px;background:var(--surface-hover)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
            <button class="btn btn-default btn-sm" @click="showToast('请选择图标文件（Mock）','info')">上传图标</button>
            <span style="font-size:11px;color:var(--text-muted)">JPG/PNG，建议 64×64px</span>
          </div>
        </div>
        <div class="ul-form-group">
          <label class="ul-label">勋章类型 <span style="color:var(--danger)">*</span></label>
          <select v-model="medalForm.medalType" class="ul-input ul-select" style="max-width:200px">
            <option value="">请选择</option>
            <option v-for="t in typeList" :key="t.id" :value="t.name">{{ t.name }}</option>
          </select>
        </div>
        <div>
          <label class="ul-label" style="display:block;margin-bottom:8px">获得条件 <span style="color:var(--danger)">*</span></label>
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px">
            <label v-for="ct in COND_TYPES" :key="ct" style="display:flex;align-items:center;gap:5px;cursor:pointer;font-size:13px">
              <input type="radio" v-model="medalForm.condType" :value="ct" style="accent-color:var(--primary)">{{ ct }}
            </label>
          </div>
          <div v-if="medalForm.condType&&medalForm.condType!=='首次注册'" style="display:flex;align-items:center;gap:8px">
            <span style="font-size:13px;color:var(--text-secondary)">数值：</span>
            <input v-model="medalForm.condValue" type="number" min="1" class="ul-input" style="max-width:120px" placeholder="正整数">
            <span style="font-size:12px;color:var(--text-muted)">
              {{ medalForm.condType==='连续爆单'?'天' : medalForm.condType==='累计收益'?'元' : medalForm.condType==='项目爆单前x名'?'名' : '天' }}
            </span>
          </div>
        </div>
        <div class="ul-form-group">
          <label class="ul-label">状态 <span style="color:var(--danger)">*</span></label>
          <div style="display:flex;gap:16px;margin-top:4px">
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:13px"><input type="radio" v-model="medalForm.status" value="显示" style="accent-color:var(--primary)"> 显示</label>
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:13px"><input type="radio" v-model="medalForm.status" value="隐藏" style="accent-color:var(--primary)"> 隐藏</label>
          </div>
        </div>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:10px;padding:14px 20px;border-top:1px solid var(--border)">
        <button class="btn btn-default" @click="medalEditVisible=false">取消</button>
        <button class="btn btn-primary" :disabled="!medalForm.name||!medalForm.medalType||!medalForm.condType" @click="saveMedal">{{ medalEditTarget?'保存':'新增' }}</button>
      </div>
    </div>

    <!-- 勋章删除确认 -->
    <div class="ul-overlay" :class="{show:medalDeleteVisible}" @click.self="()=>{}"></div>
    <div class="ul-modal" :class="{show:medalDeleteVisible}" style="width:420px">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid var(--border)">
        <div style="font-size:15px;font-weight:700;color:var(--danger)">确认删除</div>
        <button class="ul-icon-btn" @click="medalDeleteVisible=false"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <div style="padding:20px;font-size:13px;color:var(--text-secondary);line-height:1.7">确认删除勋章「<strong>{{ medalDeleteTarget?.name }}</strong>」？此操作不可撤销。</div>
      <div style="display:flex;justify-content:flex-end;gap:10px;padding:14px 20px;border-top:1px solid var(--border)">
        <button class="btn btn-default" @click="medalDeleteVisible=false">取消</button>
        <button class="btn btn-danger" @click="doDeleteMedal">确认删除</button>
      </div>
    </div>

    <div class="ul-toast-container">
      <div v-for="t in toasts" :key="t.id" class="ul-toast" :class="t.type">
        <span style="flex:1;color:var(--text-primary);line-height:1.5">{{ t.msg }}</span>
        <button style="background:none;border:none;cursor:pointer;color:var(--text-muted)" @click="removeToast(t.id)">✕</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface MedalType { id:number; name:string; desc:string; sort:number; medalCount:number; status:string; operator:string; operateTime:string }
interface Medal { id:number; name:string; color:string; medalType:string; condition:string; status:string; earnCount:number; operator:string; operateTime:string }
interface Toast { id:number; msg:string; type:string }

const activeTab = ref<'type'|'medal'>('type')
const typeFilterExpanded = ref(false); const medalFilterExpanded = ref(false)
const tf = ref({ name:'', status:'', operator:'', startTime:'', endTime:'' })
const mf = ref({ name:'', medalType:'', condType:'', status:'', operator:'', startTime:'', endTime:'' })

const typeEditVisible = ref(false); const typeEditTarget = ref<MedalType|null>(null)
const typeDeleteVisible = ref(false); const typeDeleteTarget = ref<MedalType|null>(null)
const typeForm = ref({ name:'', desc:'', sort:1, status:'显示' })

const medalEditVisible = ref(false); const medalEditTarget = ref<Medal|null>(null)
const medalDeleteVisible = ref(false); const medalDeleteTarget = ref<Medal|null>(null)
const medalForm = ref({ name:'', medalType:'', condType:'', condValue:'', status:'显示' })

const toasts = ref<Toast[]>([]); let toastId = 0; let uid = 100

const COND_TYPES = ['首次注册','连续爆单','累计收益','项目爆单前x名','注册累计天']
const COLORS = ['#3b82f6','#8b5cf6','#f59e0b','#10b981','#ef4444','#06b6d4','#ec4899']

const typeList = ref<MedalType[]>([
  { id:1, name:'入门成就', desc:'用户完成基础任务获得的入门类勋章', sort:1, medalCount:3, status:'显示', operator:'admin01', operateTime:'2026-01-10 10:00' },
  { id:2, name:'活跃达人', desc:'体现用户活跃度和参与度的勋章', sort:2, medalCount:5, status:'显示', operator:'admin01', operateTime:'2026-01-12 14:30' },
  { id:3, name:'收益成就', desc:'基于用户累计收益的荣誉勋章', sort:3, medalCount:4, status:'显示', operator:'admin02', operateTime:'2026-02-01 09:15' },
  { id:4, name:'特别荣誉', desc:'运营特别颁发的荣誉勋章', sort:4, medalCount:2, status:'显示', operator:'admin01', operateTime:'2026-03-05 11:20' },
])

const medalList = ref<Medal[]>([
  { id:1, name:'初出茅庐', color:COLORS[0], medalType:'入门成就', condition:'首次注册', status:'显示', earnCount:12480, operator:'admin01', operateTime:'2026-01-10 10:00' },
  { id:2, name:'七日连胜', color:COLORS[1], medalType:'活跃达人', condition:'连续爆单 7 天', status:'显示', earnCount:3240, operator:'admin01', operateTime:'2026-01-12 14:30' },
  { id:3, name:'千元达人', color:COLORS[2], medalType:'收益成就', condition:'累计收益 1000 元', status:'显示', earnCount:5680, operator:'admin02', operateTime:'2026-02-01 09:15' },
  { id:4, name:'项目先锋', color:COLORS[3], medalType:'活跃达人', condition:'项目爆单前 10 名', status:'显示', earnCount:980, operator:'admin01', operateTime:'2026-02-15 16:45' },
  { id:5, name:'老司机', color:COLORS[4], medalType:'入门成就', condition:'注册累计 365 天', status:'显示', earnCount:2100, operator:'admin02', operateTime:'2026-03-01 10:30' },
  { id:6, name:'万元精英', color:COLORS[5], medalType:'收益成就', condition:'累计收益 10000 元', status:'显示', earnCount:460, operator:'admin01', operateTime:'2026-03-05 11:20' },
  { id:7, name:'特别贡献奖', color:COLORS[6], medalType:'特别荣誉', condition:'首次注册', status:'隐藏', earnCount:12, operator:'admin02', operateTime:'2026-03-10 09:00' },
])

const typePage = ref(1)
const typePageSize = ref(20)
const medalPage = ref(1)
const medalPageSize = ref(20)

const filteredTypes = computed(() => typeList.value.filter((t) => {
  if (tf.value.name && !t.name.includes(tf.value.name)) return false
  if (tf.value.status && t.status !== tf.value.status) return false
  if (tf.value.operator && !t.operator.includes(tf.value.operator)) return false
  const d = t.operateTime.slice(0, 10)
  if (tf.value.startTime && d < tf.value.startTime) return false
  if (tf.value.endTime && d > tf.value.endTime) return false
  return true
}))

function medalConditionMatches(condition: string, condType: string): boolean {
  if (!condType) return true
  if (condType === '项目爆单前x名') return condition.includes('项目爆单前')
  if (condType === '注册累计天') return condition.startsWith('注册累计')
  return condition.startsWith(condType)
}

const filteredMedals = computed(() => medalList.value.filter((m) => {
  if (mf.value.name && !m.name.includes(mf.value.name)) return false
  if (mf.value.medalType && m.medalType !== mf.value.medalType) return false
  if (mf.value.condType && !medalConditionMatches(m.condition, mf.value.condType)) return false
  if (mf.value.status && m.status !== mf.value.status) return false
  if (mf.value.operator && !m.operator.includes(mf.value.operator)) return false
  const d = m.operateTime.slice(0, 10)
  if (mf.value.startTime && d < mf.value.startTime) return false
  if (mf.value.endTime && d > mf.value.endTime) return false
  return true
}))

const typeTotalPages = computed(() => Math.max(1, Math.ceil(filteredTypes.value.length / typePageSize.value)))
const medalTotalPages = computed(() => Math.max(1, Math.ceil(filteredMedals.value.length / medalPageSize.value)))

const pagedTypes = computed(() => {
  const start = (typePage.value - 1) * typePageSize.value
  return filteredTypes.value.slice(start, start + typePageSize.value)
})
const pagedMedals = computed(() => {
  const start = (medalPage.value - 1) * medalPageSize.value
  return filteredMedals.value.slice(start, start + medalPageSize.value)
})

function buildPaginationPages(current: number, total: number): (number | string)[] {
  const pages: (number | string)[] = []
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
    return pages
  }
  pages.push(1)
  if (current > 4) pages.push('...')
  const s = Math.max(2, current - 2)
  const e = Math.min(total - 1, current + 2)
  for (let i = s; i <= e; i++) pages.push(i)
  if (current < total - 3) pages.push('...')
  pages.push(total)
  return pages
}

const typePaginationPages = computed(() => buildPaginationPages(typePage.value, typeTotalPages.value))
const medalPaginationPages = computed(() => buildPaginationPages(medalPage.value, medalTotalPages.value))

watch([() => filteredTypes.value.length, typePageSize], () => {
  if (typePage.value > typeTotalPages.value) typePage.value = typeTotalPages.value
})
watch([() => filteredMedals.value.length, medalPageSize], () => {
  if (medalPage.value > medalTotalPages.value) medalPage.value = medalTotalPages.value
})

function goTypePage(p: number) {
  if (p < 1 || p > typeTotalPages.value) return
  typePage.value = p
}
function goMedalPage(p: number) {
  if (p < 1 || p > medalTotalPages.value) return
  medalPage.value = p
}
function onTypePageSizeChange(e: Event) {
  typePageSize.value = Number((e.target as HTMLSelectElement).value)
  typePage.value = 1
}
function onMedalPageSizeChange(e: Event) {
  medalPageSize.value = Number((e.target as HTMLSelectElement).value)
  medalPage.value = 1
}
function resetTypeFilter() {
  tf.value = { name: '', status: '', operator: '', startTime: '', endTime: '' }
  typePage.value = 1
}
function resetMedalFilter() {
  mf.value = { name: '', medalType: '', condType: '', status: '', operator: '', startTime: '', endTime: '' }
  medalPage.value = 1
}
function queryTypeTab() {
  typePage.value = 1
  showToast('查询', 'info')
}
function queryMedalTab() {
  medalPage.value = 1
  showToast('查询', 'info')
}

function jumpToMedal(typeName: string) {
  activeTab.value = 'medal'
  mf.value.medalType = typeName
  medalPage.value = 1
}

function openTypeCreate() { typeEditTarget.value=null; typeForm.value={name:'',desc:'',sort:typeList.value.length+1,status:'显示'}; typeEditVisible.value=true }
function openTypeEdit(row:MedalType) { typeEditTarget.value=row; typeForm.value={name:row.name,desc:row.desc,sort:row.sort,status:row.status}; typeEditVisible.value=true }
function saveType() {
  if(typeEditTarget.value) {
    typeEditTarget.value.name=typeForm.value.name; typeEditTarget.value.desc=typeForm.value.desc
    typeEditTarget.value.sort=typeForm.value.sort; typeEditTarget.value.status=typeForm.value.status
    typeEditTarget.value.operator='admin01'; typeEditTarget.value.operateTime=new Date().toLocaleString('zh-CN',{hour12:false}).replace(/\//g,'-')
  } else {
    typeList.value.push({id:++uid,name:typeForm.value.name,desc:typeForm.value.desc,sort:typeForm.value.sort,medalCount:0,status:typeForm.value.status,operator:'admin01',operateTime:new Date().toLocaleString('zh-CN',{hour12:false}).replace(/\//g,'-')})
  }
  typeEditVisible.value=false; showToast(typeEditTarget.value?'保存成功':'新增成功','success')
}
function doDeleteType() { typeList.value=typeList.value.filter(t=>t.id!==typeDeleteTarget.value?.id); typeDeleteVisible.value=false; showToast('删除成功','success') }

function openMedalCreate() { medalEditTarget.value=null; medalForm.value={name:'',medalType:'',condType:'',condValue:'',status:'显示'}; medalEditVisible.value=true }
function openMedalEdit(row:Medal) { medalEditTarget.value=row; const ct=row.condition.split(' ')[0]; const cv=row.condition.match(/\d+/)?.[0]||''; medalForm.value={name:row.name,medalType:row.medalType,condType:ct,condValue:cv,status:row.status}; medalEditVisible.value=true }
function saveMedal() {
  const cond = medalForm.value.condType==='首次注册'?'首次注册':`${medalForm.value.condType} ${medalForm.value.condValue} ${medalForm.value.condType==='连续爆单'?'天':medalForm.value.condType==='累计收益'?'元':medalForm.value.condType==='项目爆单前x名'?'名':'天'}`
  if(medalEditTarget.value) {
    medalEditTarget.value.name=medalForm.value.name; medalEditTarget.value.medalType=medalForm.value.medalType
    medalEditTarget.value.condition=cond; medalEditTarget.value.status=medalForm.value.status
    medalEditTarget.value.operator='admin01'
  } else {
    medalList.value.push({id:++uid,name:medalForm.value.name,color:COLORS[uid%7],medalType:medalForm.value.medalType,condition:cond,status:medalForm.value.status,earnCount:0,operator:'admin01',operateTime:new Date().toLocaleString('zh-CN',{hour12:false}).replace(/\//g,'-')})
  }
  medalEditVisible.value=false; showToast(medalEditTarget.value?'保存成功':'新增成功','success')
}
function doDeleteMedal() { medalList.value=medalList.value.filter(m=>m.id!==medalDeleteTarget.value?.id); medalDeleteVisible.value=false; showToast('删除成功','success') }
function showToast(msg:string,type='info') { const id=++toastId;toasts.value.push({id,msg,type});setTimeout(()=>removeToast(id),3000) }
function removeToast(id:number) { toasts.value=toasts.value.filter(t=>t.id!==id) }
</script>

<style>
.mc-wrap { min-height:100%; }
.mc-table-wrap { overflow-x:auto; }
.mc-table { width:100%; border-collapse:collapse; font-size:13px; }
.mc-table th { padding:10px 12px; text-align:left; font-size:11px; font-weight:600; color:var(--text-muted); background:var(--surface-hover); border-bottom:1px solid var(--border); white-space:nowrap; }
.mc-table td { padding:10px 12px; border-bottom:1px solid var(--border); color:var(--text-primary); vertical-align:middle; }
.mc-table tr:last-child td { border-bottom:none; }
.mc-table .ul-row:hover td { background:rgba(37,99,235,.03); }
.mc-icon-thumb { width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; }
</style>
