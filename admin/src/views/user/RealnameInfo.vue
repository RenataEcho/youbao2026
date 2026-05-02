<template>
  <div class="rn-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">用户管理</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">实名信息</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">实名信息</h1>
          <p class="page-desc">管理用户个人/企业/个体户实名认证资料</p>
        </div>
        <button class="btn btn-default btn-sm" @click="showToast('正在导出 Excel…','info')">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          导出
        </button>
      </div>

      <!-- 三 Tab：使用 page-tabs 规范 -->
      <div class="page-tabs">
        <button class="page-tab" :class="{active:activeTab==='personal'}" @click="activeTab='personal';fetchList()">个人实名</button>
        <button class="page-tab" :class="{active:activeTab==='company'}" @click="activeTab='company';fetchList()">企业实名</button>
        <button class="page-tab" :class="{active:activeTab==='individual'}" @click="activeTab='individual';fetchList()">个体户实名</button>
      </div>

      <!-- ===== 个人实名 ===== -->
      <template v-if="activeTab==='personal'">
        <!-- 筛选 -->
        <div class="glass-card bl-filter">
          <div class="ul-filter-grid" style="grid-template-columns:repeat(3,1fr)">
            <div class="ul-form-group"><label class="ul-label">用户ID</label><input v-model="pf.userId" class="ul-input" placeholder="请输入用户ID"></div>
            <div class="ul-form-group"><label class="ul-label">手机号</label><input v-model="pf.phone" class="ul-input" placeholder="请输入手机号"></div>
            <div class="ul-form-group"><label class="ul-label">信息状态</label>
              <select v-model="pf.infoStatus" class="ul-input ul-select">
                <option value="">全部</option><option>正常</option><option>用户已删除</option><option>后台释放</option>
              </select>
            </div>
            <div class="ul-form-group"><label class="ul-label">认证类型</label>
              <select v-model="pf.certType" class="ul-input ul-select">
                <option value="">全部</option><option>大陆居民</option><option>非大陆居民</option>
              </select>
            </div>
            <div class="ul-form-group"><label class="ul-label">证件类型</label>
              <select v-model="pf.idType" class="ul-input ul-select">
                <option value="">全部</option><option>身份证</option><option>港澳通行证</option><option>台胞证</option><option>护照</option>
              </select>
            </div>
            <div class="ul-form-group"><label class="ul-label">实名状态</label>
              <select v-model="pf.realnameStatus" class="ul-input ul-select">
                <option value="">全部</option><option>成功</option><option>失败</option>
              </select>
            </div>
            <div class="ul-form-group"><label class="ul-label">云账户签约</label>
              <select v-model="pf.yunStatus" class="ul-input ul-select">
                <option value="">全部</option><option>已签约</option><option>未签约</option>
              </select>
            </div>
            <div class="ul-form-group"><label class="ul-label">灵跃签约</label>
              <select v-model="pf.linyueStatus" class="ul-input ul-select">
                <option value="">全部</option><option>已签约</option><option>签约中</option><option>签约失败</option>
              </select>
            </div>
            <div class="ul-form-group"><label class="ul-label">证件号码</label><input v-model="pf.idNo" class="ul-input" placeholder="请输入证件号码"></div>
          </div>
          <div class="ul-filter-footer">
            <span></span>
            <div style="display:flex;gap:8px">
              <button class="btn btn-default btn-sm" @click="resetPersonFilter">重置</button>
              <button class="btn btn-primary btn-sm" @click="fetchList()">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                查询
              </button>
            </div>
          </div>
        </div>

        <!-- 个人实名表格 -->
        <div class="glass-card table-card">
          <div class="table-header">
            <div class="table-title">个人实名信息<span class="table-count">共 {{ total }} 条</span></div>
          </div>
          <div class="rn-table-wrap">
            <table class="rn-table">
              <thead>
                <tr>
                  <th style="min-width:120px">用户信息</th>
                  <th style="min-width:80px">信息状态</th>
                  <th style="min-width:88px">认证类型</th>
                  <th style="min-width:80px">证件类型</th>
                  <th style="min-width:110px">证件照片</th>
                  <th style="min-width:60px">人脸照片</th>
                  <th style="min-width:130px">证件号码</th>
                  <th style="min-width:150px">基础信息</th>
                  <th style="min-width:140px">联系信息</th>
                  <th style="min-width:120px">其他信息</th>
                  <th style="min-width:70px">实名状态</th>
                  <th style="min-width:170px">云账户签约</th>
                  <th style="min-width:170px">灵跃签约</th>
                  <th style="min-width:150px">其他编号</th>
                  <th class="col-action" style="width:110px;text-align:center">操作</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="loading">
                  <tr v-for="i in 5" :key="i"><td colspan="15"><div class="ul-skeleton"></div></td></tr>
                </template>
                <template v-else>
                  <tr v-for="row in list" :key="row.id" class="ul-row" @click="goPersonDetail(row.id)">
                    <td>
                      <div class="ul-mono" style="font-size:12px;color:var(--text-secondary)">{{ row.userId }}</div>
                      <div style="font-size:11px;color:var(--text-muted);margin-top:2px">{{ maskPhone(row.phone) }}</div>
                    </td>
                    <td><span class="badge" :class="getInfoStatusClass(row.infoStatus)" style="white-space:nowrap">● {{ row.infoStatus }}</span></td>
                    <td><span class="tag" :class="row.certType==='大陆居民'?'tag-blue':'tag-purple'">{{ row.certType }}</span></td>
                    <td><span class="tag tag-gray">{{ row.idType }}</span></td>
                    <td @click.stop>
                      <div style="display:flex;gap:4px;align-items:center">
                        <div class="rn-img-thumb rn-img-blue" title="查看正面" @click="showImgPreview('证件正面')">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                          <span>正面</span>
                        </div>
                        <div class="rn-img-thumb rn-img-green" title="查看反面" @click="showImgPreview('证件反面')">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                          <span>反面</span>
                        </div>
                      </div>
                    </td>
                    <td @click.stop>
                      <div class="rn-face-thumb" title="查看人脸" @click="showImgPreview('人脸照片')">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/></svg>
                        <span>人脸</span>
                      </div>
                    </td>
                    <td><span class="ul-mono" style="font-size:11.5px">{{ maskIdCard(row.idNo) }}</span></td>
                    <td>
                      <div style="font-size:13px;font-weight:600">{{ row.realName }}</div>
                      <div style="display:flex;gap:4px;margin-top:3px;align-items:center">
                        <span class="tag" :class="row.gender==='男'?'tag-blue':'tag-purple'" style="font-size:10px;padding:1px 5px">{{ row.gender }}</span>
                        <span style="font-size:11px;color:var(--text-muted)">{{ row.birthDate }}</span>
                      </div>
                    </td>
                    <td>
                      <div style="font-size:12px;color:var(--text-secondary)">{{ maskPhone(row.phone) }}</div>
                      <div class="ul-muted" style="font-size:11px;margin-top:2px;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ row.address }}</div>
                    </td>
                    <td>
                      <div style="font-size:11px;color:var(--text-muted)">{{ row.nationality }}</div>
                      <div style="font-size:11px;color:var(--text-muted);margin-top:2px">{{ row.expireDate }}</div>
                    </td>
                    <td>
                      <span class="badge" :class="row.realnameStatus==='成功'?'badge-success':'badge-danger'" style="white-space:nowrap">● {{ row.realnameStatus }}</span>
                    </td>
                    <td>
                      <div style="display:flex;flex-direction:column;gap:3px">
                        <span class="badge" :class="getContractClass(row.yunStatus)" style="white-space:nowrap;width:fit-content">{{ row.yunStatus }}</span>
                        <a v-if="row.yunStatus==='已签约'" href="#" @click.prevent="showToast('正在下载合同','info')" style="font-size:11px;color:var(--primary);text-decoration:none">下载合同</a>
                        <span style="font-size:11px;color:var(--text-muted)">{{ row.yunTime || '—' }}</span>
                      </div>
                    </td>
                    <td>
                      <div style="display:flex;flex-direction:column;gap:3px">
                        <span class="badge" :class="getLinyueClass(row.linyueStatus)" style="white-space:nowrap;width:fit-content">{{ row.linyueStatus }}</span>
                        <a v-if="row.linyueStatus==='已签约'" href="#" @click.prevent="showToast('正在下载合同','info')" style="font-size:11px;color:var(--primary);text-decoration:none">下载合同</a>
                        <span style="font-size:11px;color:var(--text-muted)">{{ row.linyueTime || '—' }}</span>
                      </div>
                    </td>
                    <td>
                      <div style="font-size:11px;color:var(--text-muted)">客户号：<span class="ul-mono">{{ row.custNo }}</span></div>
                      <div style="font-size:11px;color:var(--text-muted);margin-top:1px">个人号：<span class="ul-mono">{{ row.personNo }}</span></div>
                      <div style="font-size:11px;color:var(--text-muted);margin-top:1px">流水号：<span class="ul-mono">{{ row.flowNo }}</span></div>
                    </td>
                    <td class="col-action" @click.stop>
                      <div class="action-btns action-btns--stack" style="align-items: flex-start">
                        <button
                          type="button"
                          class="action-btn delete"
                          :disabled="row.infoStatus!=='正常'"
                          @click="showToast('释放实名信息','info')"
                        >释放</button>
                        <button
                          type="button"
                          class="action-btn edit"
                          :disabled="row.infoStatus!=='后台释放'"
                          @click="showToast('恢复实名信息','info')"
                        >恢复</button>
                        <button type="button" class="action-btn view" @click="showToast('查看操作日志','info')">操作日志</button>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
          <div class="ul-pagination">
            <span class="ul-page-info">共 <strong>{{ total }}</strong> 条，第 <strong>{{ page }}</strong>/<strong>{{ totalPages }}</strong> 页</span>
            <div style="display:flex;align-items:center;gap:4px">
              <button class="ul-pg-btn" :disabled="page<=1" @click="fetchList(1)">«</button>
              <button class="ul-pg-btn" :disabled="page<=1" @click="fetchList(page-1)">‹</button>
              <button v-for="p in paginationPages" :key="p" class="ul-pg-btn" :class="{active:p===page}" @click="fetchList(Number(p))">{{ p }}</button>
              <button class="ul-pg-btn" :disabled="page>=totalPages" @click="fetchList(page+1)">›</button>
              <button class="ul-pg-btn" :disabled="page>=totalPages" @click="fetchList(totalPages)">»</button>
            </div>
            <div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-muted)">
              每页 <select class="ul-pg-size" @change="(e)=>{pageSize=Number((e.target as HTMLSelectElement).value);fetchList(1)}">
                <option value="10">10</option><option value="20" selected>20</option><option value="50">50</option>
              </select> 条
            </div>
          </div>
        </div>
      </template>

      <!-- ===== 企业/个体户实名 ===== -->
      <template v-if="activeTab==='company' || activeTab==='individual'">
        <div class="glass-card bl-filter">
          <div class="ul-filter-grid">
            <div class="ul-form-group"><label class="ul-label">用户ID</label><input v-model="cf.userId" class="ul-input" placeholder="输入用户ID"></div>
            <div class="ul-form-group"><label class="ul-label">用户手机号</label><input v-model="cf.phone" class="ul-input" placeholder="输入手机号"></div>
            <div class="ul-form-group"><label class="ul-label">{{ activeTab==='company'?'企业名称':'个体户名称' }}</label><input v-model="cf.companyName" class="ul-input" :placeholder="activeTab==='company'?'输入企业名称':'输入个体户名称'"></div>
            <div class="ul-form-group"><label class="ul-label">信用代码</label><input v-model="cf.creditCode" class="ul-input" placeholder="统一社会信用代码"></div>
            <template v-if="corpFilterExpanded">
              <div class="ul-form-group"><label class="ul-label">信息状态</label>
                <select v-model="cf.infoStatus" class="ul-input ul-select">
                  <option value="">全部</option><option>正常</option><option>用户已删除</option><option>后台释放</option>
                </select>
              </div>
              <div class="ul-form-group"><label class="ul-label">审核状态</label>
                <select v-model="cf.auditStatus" class="ul-input ul-select">
                  <option value="">全部</option><option>待审核</option><option>审核通过</option><option>审核驳回</option>
                </select>
              </div>
              <div class="ul-form-group"><label class="ul-label">发票类型</label>
                <select v-model="cf.invoiceType" class="ul-input ul-select">
                  <option value="">全部</option><option>普票</option><option>专票</option>
                </select>
              </div>
              <div class="ul-form-group"><label class="ul-label">创建开始时间</label><input v-model="cf.createStart" type="date" class="ul-input"></div>
              <div class="ul-form-group"><label class="ul-label">创建结束时间</label><input v-model="cf.createEnd" type="date" class="ul-input"></div>
            </template>
          </div>
          <div class="ul-filter-footer">
            <button class="ul-expand-btn" :class="{ expanded: corpFilterExpanded }" @click="corpFilterExpanded = !corpFilterExpanded">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              {{ corpFilterExpanded ? '收起筛选' : '展开更多筛选' }}
            </button>
            <div style="display:flex;gap:8px">
              <button class="btn btn-default btn-sm" @click="resetCorpFilter">重置</button>
              <button class="btn btn-primary btn-sm" @click="fetchList()">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                查询
              </button>
            </div>
          </div>
        </div>

        <!-- 批量操作栏 -->
        <div v-if="corpSelected.length > 0" class="glass-card" style="padding:10px 16px;display:flex;align-items:center;gap:12px;margin-bottom:0;border-radius:var(--radius) var(--radius) 0 0">
          <span style="font-size:13px;color:var(--text-primary)">已选 <strong style="color:var(--primary)">{{ corpSelected.length }}</strong> 项</span>
          <button class="btn btn-primary btn-sm" @click="showToast(`批量审核通过 ${corpSelected.length} 条`,'success')">批量审核通过</button>
          <button class="btn btn-danger btn-sm" @click="showToast('批量驳回','info')">批量驳回</button>
          <button class="btn btn-default btn-sm" @click="showToast('批量删除','info')">批量删除</button>
          <button class="btn btn-ghost btn-sm" @click="corpSelected=[]">取消</button>
        </div>

        <div class="glass-card table-card">
          <div class="table-header">
            <div class="table-title">
              {{ activeTab==='company'?'企业':'个体户' }}实名信息
              <span class="table-count">共 {{ total }} 条</span>
            </div>
          </div>
          <div class="rn-table-wrap">
            <table class="rn-table">
              <thead>
                <tr>
                  <th style="width:36px"><input type="checkbox" :checked="corpSelected.length===corpList.length&&corpList.length>0" style="accent-color:var(--primary)" @change="toggleCorpAll"></th>
                  <th style="min-width:120px">用户信息</th>
                  <th style="min-width:70px">信息状态</th>
                  <th style="min-width:80px">审核状态</th>
                  <th style="min-width:200px">{{ activeTab==='company'?'企业':'个体户' }}信息</th>
                  <th style="min-width:160px">法人信息</th>
                  <th style="min-width:160px">对公账户</th>
                  <th style="min-width:150px">对公协议</th>
                  <th style="min-width:90px">审核信息</th>
                  <th style="min-width:90px">创建时间</th>
                  <th class="col-action" style="width:110px;text-align:center">操作</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="loading">
                  <tr v-for="i in 5" :key="i"><td colspan="11"><div class="ul-skeleton"></div></td></tr>
                </template>
                <template v-else>
                  <tr v-for="row in corpList" :key="row.id" class="ul-row" @click="goCorpDetail(row.id)">
                    <td @click.stop><input type="checkbox" :checked="corpSelected.includes(row.id)" style="accent-color:var(--primary)" @change="toggleCorpRow(row.id)"></td>
                    <td>
                      <div class="ul-mono" style="font-size:12px;color:var(--text-secondary)">{{ row.userId }}</div>
                      <div style="font-size:11px;color:var(--text-muted);margin-top:2px">{{ maskPhone(row.phone) }}</div>
                    </td>
                    <td><span class="badge" :class="getInfoStatusClass(row.infoStatus)" style="white-space:nowrap;font-size:11px">{{ row.infoStatus }}</span></td>
                    <td>
                      <span class="badge" :class="({待审核:'badge-warning',审核通过:'badge-success',审核驳回:'badge-danger'} as any)[row.auditStatus]||'badge-gray'" style="white-space:nowrap;font-size:11px">{{ row.auditStatus }}</span>
                      <div style="font-size:10px;color:var(--text-muted);margin-top:2px">{{ row.auditTime }}</div>
                    </td>
                    <td>
                      <div style="font-size:12px;font-weight:600">{{ row.companyName }}</div>
                      <div class="ul-mono" style="font-size:10px;color:var(--text-muted);margin-top:2px">{{ row.creditCode }}</div>
                      <div style="font-size:10px;color:var(--text-muted);margin-top:1px">{{ row.companyTel }}</div>
                      <div style="font-size:10px;color:var(--text-muted);margin-top:1px;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ row.companyAddr }}</div>
                      <div class="rn-img-thumb rn-img-blue" style="margin-top:4px;display:inline-flex" @click.stop="showImgPreview('营业执照')">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                        <span>营业执照</span>
                      </div>
                    </td>
                    <td>
                      <div style="font-size:12px;font-weight:600">{{ row.legalName }}</div>
                      <div class="ul-mono" style="font-size:10px;color:var(--text-muted);margin-top:2px">{{ maskIdCard(row.legalIdNo) }}</div>
                      <div style="font-size:10px;color:var(--text-muted);margin-top:1px">{{ maskPhone(row.legalPhone) }}</div>
                      <div style="display:flex;gap:3px;margin-top:3px" @click.stop>
                        <div class="rn-img-thumb rn-img-blue" @click="showImgPreview('证件正面')"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/></svg><span>正面</span></div>
                        <div class="rn-img-thumb rn-img-green" @click="showImgPreview('证件反面')"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/></svg><span>反面</span></div>
                        <div class="rn-face-thumb" style="width:32px;height:32px" @click="showImgPreview('人脸照')"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/></svg><span>人脸</span></div>
                      </div>
                    </td>
                    <td>
                      <div style="font-size:11px;color:var(--text-secondary)">{{ row.bankAccount }}</div>
                      <div style="font-size:10px;color:var(--text-muted);margin-top:1px">{{ row.bankName }}{{ row.bankBranch ? ' · ' + row.bankBranch : '' }}</div>
                      <div class="ul-mono" style="font-size:10px;color:var(--text-muted);margin-top:1px">{{ row.bankNo }}</div>
                      <div style="display:flex;gap:3px;margin-top:3px;flex-wrap:wrap">
                        <span class="tag" :class="row.invoiceType==='专票'?'tag-purple':'tag-blue'" style="font-size:10px;padding:1px 5px">{{ row.invoiceType }}</span>
                        <span class="tag tag-gray" style="font-size:10px;padding:1px 5px">税率 {{ row.taxRate }}</span>
                      </div>
                    </td>
                    <td>
                      <div class="ul-mono" style="font-size:10px;color:var(--text-muted)">{{ row.contractNo }}</div>
                      <div style="font-size:10px;color:var(--text-muted);margin-top:1px">{{ row.contractPeriod }}</div>
                      <a href="#" style="font-size:11px;color:var(--primary);text-decoration:none;display:inline-block;margin-top:3px" @click.prevent.stop="showImgPreview('合同附件')">预览合同</a>
                    </td>
                    <td>
                      <div style="font-size:11px;color:var(--text-secondary);font-weight:500">{{ row.auditor || '—' }}</div>
                      <div style="font-size:10px;color:var(--text-muted);margin-top:2px">{{ row.auditTime || '' }}</div>
                    </td>
                    <td class="ul-muted" style="font-size:11px">{{ row.createdAt }}</td>
                    <td class="col-action" @click.stop>
                      <div class="action-btns action-btns--stack">
                        <button
                          type="button"
                          class="action-btn delete"
                          :disabled="row.infoStatus!=='正常'"
                          @click="showToast('释放实名信息','info')"
                        >释放</button>
                        <button
                          type="button"
                          class="action-btn edit"
                          :disabled="row.infoStatus!=='后台释放'"
                          @click="showToast('恢复实名信息','info')"
                        >恢复</button>
                        <button type="button" class="action-btn view" @click="showToast('操作日志','info')">操作日志</button>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
          <div class="ul-pagination">
            <span class="ul-page-info">共 <strong>{{ total }}</strong> 条，第 <strong>{{ page }}</strong>/<strong>{{ totalPages }}</strong> 页</span>
            <div style="display:flex;align-items:center;gap:4px">
              <button class="ul-pg-btn" :disabled="page<=1" @click="fetchList(page-1)">‹</button>
              <button v-for="p in paginationPages" :key="p" class="ul-pg-btn" :class="{active:p===page}" @click="fetchList(Number(p))">{{ p }}</button>
              <button class="ul-pg-btn" :disabled="page>=totalPages" @click="fetchList(page+1)">›</button>
            </div>
            <div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-muted)">
              每页 <select class="ul-pg-size" @change="(e)=>{pageSize=Number((e.target as HTMLSelectElement).value);fetchList(1)}">
                <option value="10">10</option><option value="20" selected>20</option><option value="50">50</option>
              </select> 条
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- 图片预览弹窗 -->
    <div class="ul-overlay" :class="{show:imgPreviewVisible}" @click="imgPreviewVisible=false"></div>
    <div class="ul-modal" :class="{show:imgPreviewVisible}" style="width:500px">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid var(--border)">
        <div style="font-size:14px;font-weight:600">{{ imgPreviewTitle }}</div>
        <button class="ul-icon-btn" @click="imgPreviewVisible=false"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <div style="padding:24px;text-align:center">
        <div style="width:100%;height:220px;background:var(--surface-hover);border-radius:var(--radius);border:2px dashed var(--border);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="0.9"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
          <span style="font-size:13px;color:var(--text-muted)">{{ imgPreviewTitle }}（Mock 占位）</span>
        </div>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

interface PersonItem { id:string; userId:string; phone:string; infoStatus:string; certType:string; idType:string; idNo:string; realName:string; gender:string; birthDate:string; address:string; nationality:string; expireDate:string; realnameStatus:string; yunStatus:string; yunTime:string; linyueStatus:string; linyueTime:string; custNo:string; personNo:string; flowNo:string }
interface CorpItem {
  id:string; userId:string; phone:string; infoStatus:string; auditStatus:string; auditTime:string; auditor:string
  companyName:string; creditCode:string; companyAddr:string; companyTel:string
  legalName:string; legalIdNo:string; legalPhone:string
  bankAccount:string; bankName:string; bankBranch:string; bankNo:string; invoiceType:string; taxRate:string
  contractNo:string; contractPeriod:string
  createdAt:string
}
interface Toast { id:number; msg:string; type:string }

const router = useRouter()
const activeTab = ref('personal')
const loading = ref(false)
const list = ref<PersonItem[]>([])
const corpList = ref<CorpItem[]>([])
const corpSelected = ref<string[]>([])
const corpFilterExpanded = ref(false)
const total = ref(0); const page = ref(1); const pageSize = ref(20)
const imgPreviewVisible = ref(false); const imgPreviewTitle = ref('')
const toasts = ref<Toast[]>([]); let toastId = 0

const pf = ref({ userId:'', phone:'', infoStatus:'', certType:'', idType:'', realnameStatus:'', yunStatus:'', linyueStatus:'', idNo:'' })
const cf = ref({ userId:'', phone:'', companyName:'', creditCode:'', infoStatus:'', auditStatus:'', invoiceType:'', createStart:'', createEnd:'' })

const totalPages = computed(() => Math.max(1, Math.ceil(total.value/pageSize.value)))
const paginationPages = computed(() => {
  const arr:number[] = []; const s=Math.max(1,page.value-2); const e=Math.min(totalPages.value,page.value+2)
  for (let i=s;i<=e;i++) arr.push(i); return arr
})

const INFO_STATUSES = ['正常','用户已删除','后台释放']
const CERT_TYPES = ['大陆居民','非大陆居民']
const ID_TYPES = ['身份证','港澳通行证','台胞证','护照']
const REALNAME_STATUSES = ['成功','失败']
const YUN_STATUSES = ['已签约','未签约']
const LINYUE_STATUSES = ['已签约','签约中','签约失败']

function mockPersonList(n=20): PersonItem[] {
  const names = ['张*明','李*华','王*芳','赵*强','孙*丽','钱*伟','周*红','吴*刚','郑*美','林*超']
  return Array.from({length:n},(_,i)=>({
    id:`R${10024+i}`, userId:`U${10024+i}`, phone:`138${String(10000000+i*7777)}`,
    infoStatus: INFO_STATUSES[i%3], certType: CERT_TYPES[i%2], idType: ID_TYPES[i%4],
    idNo: `11010119${90+i%10}0${String(i%28+1).padStart(2,'0')}${String(1000+i).padStart(4,'0')}X`,
    realName: names[i%10], gender: i%3===0?'女':'男',
    birthDate: `${1985+i%10}-${String(i%12+1).padStart(2,'0')}-${String(i%28+1).padStart(2,'0')}`,
    address: ['广东省深圳市南山区科技园','北京市朝阳区三里屯','上海市徐汇区漕河泾','香港特别行政区九龙区','广东省广州市天河区'][i%5],
    nationality: ['中国','中国香港','中国台湾'][i%3],
    expireDate: `${2026+i%5}-${String(i%12+1).padStart(2,'0')}-${String(i%28+1).padStart(2,'0')}`,
    realnameStatus: REALNAME_STATUSES[i%4===3?1:0],
    yunStatus: YUN_STATUSES[i%3===2?1:0], yunTime: i%3!==2?`2026-0${i%3+1}-${String(i%28+1).padStart(2,'0')} 10:00`:'',
    linyueStatus: LINYUE_STATUSES[i%3], linyueTime: i%3===0?`2026-0${i%3+1}-${String(i%28+1).padStart(2,'0')} 11:00`:'',
    custNo:`CU${20240000+i}`, personNo:`PE${10000000+i}`, flowNo:`MR${20240000+i}`,
  }))
}

function mockCorpList(n=15): CorpItem[] {
  const companies = ['创意视觉工作室（上海）有限公司','北京星辰文化传媒有限公司','深圳蓝海科技有限公司','广州优品网络有限公司','杭州灵感数字科技有限公司']
  const banks = ['中国工商银行','中国建设银行','中国农业银行','招商银行','中信银行']
  const branches = ['深圳南山科技园支行','北京朝阳望京支行','上海浦东陆家嘴支行','广州天河支行','杭州西湖支行']
  const legalNames = ['张三','李四','王五','赵六','孙七']
  const auditors = ['admin01','admin02','admin03','','']
  const AUDIT_STATUSES = ['待审核','审核通过','审核驳回','审核通过']
  return Array.from({length:n},(_,i)=>({
    id:`CR${20001+i}`, userId:`U${10200+i}`, phone:`136${String(10000000+i*9973)}`,
    infoStatus: INFO_STATUSES[i%3],
    auditStatus: AUDIT_STATUSES[i%4],
    auditTime: i%4!==0?`2026-0${(i%3)+1}-${String((i%28)+1).padStart(2,'0')} 14:${String(i%60).padStart(2,'0')}`:'',
    auditor: auditors[i%5],
    companyName: companies[i%5],
    creditCode:`91440300${String(100000000+i*13579)}`,
    companyAddr: ['广东省深圳市南山区科技园路88号','北京市朝阳区望京街10号','上海市浦东新区世纪大道100号','广东省广州市天河区天河路168号','浙江省杭州市西湖区文三路588号'][i%5],
    companyTel: `0${755+i%9}-${String(88000000+i*1234).slice(0,8)}`,
    legalName: legalNames[i%5],
    legalIdNo: `110101${String(1970+i%20)}${String((i%12)+1).padStart(2,'0')}${String((i%28)+1).padStart(2,'0')}${String(1000+i).padStart(4,'0')}X`,
    legalPhone: `138${String(10000000+i*8888)}`,
    bankAccount: legalNames[i%5] + (i%2===0?'（企业）':''),
    bankName: banks[i%5], bankBranch: branches[i%5],
    bankNo: `6222${String(20240000000+i*13579812)}`.slice(0,19),
    invoiceType: i%2===0?'专票':'普票',
    taxRate: i%2===0?'6%':'3%',
    contractNo: `YB-${2024+i%2}-${String(1000+i).padStart(4,'0')}`,
    contractPeriod: `2024-0${(i%12)+1}-01 至 2026-0${(i%12)+1}-01`,
    createdAt: `2026-0${(i%3)+1}-${String((i%28)+1).padStart(2,'0')} ${String(9+(i%8)).padStart(2,'0')}:${String(i%60).padStart(2,'0')}`,
  }))
}

async function fetchList(p=1) {
  loading.value=true; page.value=p
  await new Promise(r=>setTimeout(r,200))
  if (activeTab.value==='personal') { list.value=mockPersonList(); total.value=9842 }
  else { corpList.value=mockCorpList(); total.value=1243 }
  loading.value=false
}
function resetPersonFilter() { pf.value={userId:'',phone:'',infoStatus:'',certType:'',idType:'',realnameStatus:'',yunStatus:'',linyueStatus:'',idNo:''}; fetchList() }
function resetCorpFilter() { cf.value={userId:'',phone:'',companyName:'',creditCode:'',infoStatus:'',auditStatus:'',invoiceType:'',createStart:'',createEnd:''}; fetchList() }
function toggleCorpAll(e: Event) { const checked = (e.target as HTMLInputElement).checked; corpSelected.value = checked ? corpList.value.map(r=>r.id) : [] }
function toggleCorpRow(id: string) { const idx = corpSelected.value.indexOf(id); if (idx>=0) corpSelected.value.splice(idx,1); else corpSelected.value.push(id) }
function goPersonDetail(id:string) { router.push(`/user/realname/personal/${id}`) }
function goCorpDetail(id:string) { router.push(`/user/realname/company/${id}`) }
function showImgPreview(title:string) { imgPreviewTitle.value=title; imgPreviewVisible.value=true }
function maskPhone(s:string) { return s.replace(/(\d{3})\d{4}(\d{4})/,'$1****$2') }
function maskIdCard(s:string) { return s.length>8?s.slice(0,6)+'****'+s.slice(-4):s }
function getInfoStatusClass(s:string) { return {正常:'badge-success',用户已删除:'badge-warning',后台释放:'badge-gray'}[s]||'badge-gray' }
function getContractClass(s:string) { return {已签约:'badge-success',未签约:'badge-gray'}[s]||'badge-gray' }
function getLinyueClass(s:string) { return {已签约:'badge-success',签约中:'badge-warning',签约失败:'badge-danger'}[s]||'badge-gray' }
function showToast(msg:string, type='info') { const id=++toastId; toasts.value.push({id,msg,type}); setTimeout(()=>removeToast(id),3000) }
function removeToast(id:number) { toasts.value=toasts.value.filter(t=>t.id!==id) }

onMounted(()=>fetchList())
</script>

<style>
.rn-wrap { min-height:100%; }
.rn-table-wrap { overflow-x:auto; }
.rn-table { width:100%; border-collapse:collapse; font-size:12.5px; white-space:nowrap; }
.rn-table th { padding:10px 10px; text-align:left; font-size:11px; font-weight:600; color:var(--text-muted); background:var(--surface-hover); border-bottom:1px solid var(--border); }
.rn-table td { padding:10px 10px; border-bottom:1px solid var(--border); color:var(--text-primary); vertical-align:middle; }
.rn-table tr:last-child td { border-bottom:none; }
.rn-table .ul-row:hover td { background:rgba(37,99,235,.03); }
.rn-img-thumb { display:flex; flex-direction:column; align-items:center; gap:2px; cursor:pointer; padding:3px 5px; border-radius:4px; border:1px solid var(--border); transition:var(--transition); }
.rn-img-thumb:hover { border-color:var(--primary); }
.rn-img-thumb span { font-size:10px; color:var(--text-muted); }
.rn-img-blue { background:linear-gradient(135deg,#dbeafe,#bfdbfe); }
.rn-img-green { background:linear-gradient(135deg,#f0fdf4,#bbf7d0); }
.rn-face-thumb { display:flex; flex-direction:column; align-items:center; gap:2px; cursor:pointer; width:42px; height:42px; border-radius:6px; border:1px solid var(--border); background:linear-gradient(135deg,#faf5ff,#e9d5ff); transition:var(--transition); justify-content:center; }
.rn-face-thumb:hover { border-color:var(--primary); }
.rn-face-thumb span { font-size:9px; color:var(--text-muted); }
</style>
