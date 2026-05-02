<template>
  <div class="ur-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">用户体系</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">用户段位</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">用户段位</h1>
          <p class="page-desc">配置用户段位体系及对应福利，通过子 Tab 切换「段位配置」与「段位福利」。</p>
        </div>
      </div>

      <div class="glass-card tab-nav-shell" role="tablist" aria-label="用户段子模块切换">
        <div class="tab-nav">
          <button
            id="ur-tab-rank"
            class="tab-item"
            :class="{ active: activeTab === 'rank' }"
            type="button"
            role="tab"
            :aria-selected="activeTab === 'rank'"
            :tabindex="activeTab === 'rank' ? 0 : -1"
            @click="activeTab = 'rank'"
          >段位配置</button>
          <button
            id="ur-tab-benefit"
            class="tab-item"
            :class="{ active: activeTab === 'benefit' }"
            type="button"
            role="tab"
            :aria-selected="activeTab === 'benefit'"
            :tabindex="activeTab === 'benefit' ? 0 : -1"
            @click="activeTab = 'benefit'"
          >段位福利</button>
        </div>
      </div>

    <!-- ===== Tab 一：段位配置 ===== -->
    <template v-if="activeTab === 'rank'">
      <!-- 筛选区 -->
      <div class="glass-card filter-card" role="tabpanel" aria-labelledby="ur-tab-rank">
        <div class="filter-grid">
          <div class="form-group-filter">
            <label class="form-label-sm">段位名称</label>
            <input v-model="rankFilter.name" class="form-input-sm" placeholder="模糊搜索" />
          </div>
          <div class="form-group-filter">
            <label class="form-label-sm">状态</label>
            <select v-model="rankFilter.status" class="form-input-sm">
              <option value="">全部</option>
              <option value="显示">显示</option>
              <option value="隐藏">隐藏</option>
            </select>
          </div>
          <div class="form-group-filter">
            <label class="form-label-sm">操作人</label>
            <input v-model="rankFilter.op" class="form-input-sm" placeholder="请输入操作人" />
          </div>
          <div class="form-group-filter">
            <label class="form-label-sm">操作时间起</label>
            <input v-model="rankFilter.timeStart" type="date" class="form-input-sm" />
          </div>
          <div class="form-group-filter">
            <label class="form-label-sm">操作时间止</label>
            <input v-model="rankFilter.timeEnd" type="date" class="form-input-sm" />
          </div>
        </div>
        <div class="filter-footer">
          <span></span>
          <div class="filter-actions">
            <button type="button" class="btn btn-default btn-sm" @click="resetRankFilter">重置</button>
            <button type="button" class="btn btn-primary btn-sm" @click="queryRankTab">查询</button>
          </div>
        </div>
      </div>
      <!-- 数据表 -->
      <div class="glass-card table-card">
        <div class="table-header">
          <div class="table-title">段位配置<span class="table-count">共 {{ filteredRanks.length }} 条</span></div>
          <div class="table-header-right">
            <button class="btn btn-primary btn-sm" @click="openRankEdit(null)">+ 新增段位</button>
          </div>
        </div>
        <div class="ur-table-wrap">
          <table class="ur-table">
            <colgroup>
              <col style="min-width:90px;width:10%">
              <col style="min-width:56px;width:6%">
              <col style="min-width:180px;width:22%">
              <col style="min-width:90px;width:10%">
              <col style="min-width:70px;width:8%">
              <col style="min-width:80px;width:9%">
              <col style="min-width:130px;width:15%">
              <col style="min-width:80px;width:9%">
            </colgroup>
            <thead>
              <tr>
                <th>段位名称</th><th>段位图标</th><th>段位条件</th>
                <th>该段位人数</th><th>状态</th><th>操作人</th><th>操作时间</th><th class="col-action">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in pagedRanks" :key="row.id" class="ur-row">
                <td>
                  <div style="display:flex;align-items:center;gap:8px">
                    <span class="ur-rank-badge" :style="`background:${row.color}22;color:${row.color};border:1px solid ${row.color}44`">{{ row.name }}</span>
                  </div>
                </td>
                <td>
                  <div class="ur-icon-box" :style="`background:${row.color}18;border:1px solid ${row.color}33`">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" :stroke="row.color" stroke-width="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  </div>
                </td>
                <td style="font-size:13px;color:var(--text-secondary)">
                  近 30 天收益 ≥ <strong>{{ row.threshold.toLocaleString() }}</strong> 元
                </td>
                <td class="ur-num">{{ row.count.toLocaleString() }} 人</td>
                <td>
                  <span class="ur-badge" :class="row.status === '显示' ? 'ur-badge-green' : 'ur-badge-gray'">{{ row.status }}</span>
                </td>
                <td style="font-size:13px">{{ row.op }}</td>
                <td class="ur-time">{{ row.time }}</td>
                <td class="col-action">
                  <div class="action-btns">
                    <button type="button" class="action-btn edit" title="编辑" @click="openRankEdit(row)">编辑</button>
                    <button type="button" class="action-btn delete" title="删除" @click="confirmDelete(row.id, row.name, 'rank')">删除</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="ul-pagination">
          <span class="ul-page-info">共 <strong>{{ filteredRanks.length }}</strong> 条，第 <strong>{{ rankPage }}</strong>/<strong>{{ rankTotalPages }}</strong> 页</span>
          <div style="display:flex;align-items:center;gap:4px">
            <button type="button" class="ul-pg-btn" :disabled="rankPage <= 1" @click="goRankPage(1)">«</button>
            <button type="button" class="ul-pg-btn" :disabled="rankPage <= 1" @click="goRankPage(rankPage - 1)">‹</button>
            <template v-for="p in rankPaginationPages" :key="'r' + String(p)">
              <button v-if="p !== '...'" type="button" class="ul-pg-btn" :class="{ active: p === rankPage }" @click="goRankPage(Number(p))">{{ p }}</button>
              <span v-else style="padding:0 4px;color:var(--text-muted);font-size:13px">...</span>
            </template>
            <button type="button" class="ul-pg-btn" :disabled="rankPage >= rankTotalPages" @click="goRankPage(rankPage + 1)">›</button>
            <button type="button" class="ul-pg-btn" :disabled="rankPage >= rankTotalPages" @click="goRankPage(rankTotalPages)">»</button>
          </div>
          <div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-muted)">
            每页
            <select class="ul-pg-size" :value="rankPageSize" @change="onRankPageSizeChange($event)">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            条
          </div>
        </div>
      </div>
    </template>

    <!-- ===== Tab 二：段位福利 ===== -->
    <template v-if="activeTab === 'benefit'">
      <div class="glass-card filter-card" role="tabpanel" aria-labelledby="ur-tab-benefit">
        <div class="filter-grid">
          <div class="form-group-filter">
            <label class="form-label-sm">福利名称</label>
            <input v-model="benefitFilter.name" class="form-input-sm" placeholder="模糊搜索" />
          </div>
          <div class="form-group-filter">
            <label class="form-label-sm">是否免费</label>
            <select v-model="benefitFilter.free" class="form-input-sm">
              <option value="">全部</option>
              <option value="是">是</option>
              <option value="否">否</option>
            </select>
          </div>
          <div class="form-group-filter">
            <label class="form-label-sm">独立解锁段位</label>
            <select v-model="benefitFilter.rank" class="form-input-sm">
              <option value="">全部</option>
              <option v-for="r in ranks" :key="r.id" :value="r.name">{{ r.name }}</option>
            </select>
          </div>
          <div class="form-group-filter">
            <label class="form-label-sm">状态</label>
            <select v-model="benefitFilter.status" class="form-input-sm">
              <option value="">全部</option>
              <option value="显示">显示</option>
              <option value="隐藏">隐藏</option>
            </select>
          </div>
          <div class="form-group-filter">
            <label class="form-label-sm">操作人</label>
            <input v-model="benefitFilter.op" class="form-input-sm" placeholder="请输入操作人" />
          </div>
          <div class="form-group-filter">
            <label class="form-label-sm">操作时间起</label>
            <input v-model="benefitFilter.timeStart" type="date" class="form-input-sm" />
          </div>
          <div class="form-group-filter">
            <label class="form-label-sm">操作时间止</label>
            <input v-model="benefitFilter.timeEnd" type="date" class="form-input-sm" />
          </div>
        </div>
        <div class="filter-footer">
          <span></span>
          <div class="filter-actions">
            <button type="button" class="btn btn-default btn-sm" @click="resetBenefitFilter">重置</button>
            <button type="button" class="btn btn-primary btn-sm" @click="queryBenefitTab">查询</button>
          </div>
        </div>
      </div>
      <div class="glass-card table-card">
        <div class="table-header">
          <div class="table-title">段位福利<span class="table-count">共 {{ filteredBenefits.length }} 条</span></div>
          <div class="table-header-right">
            <button class="btn btn-primary btn-sm" @click="openBenefitEdit(null)">+ 新增福利</button>
          </div>
        </div>
        <div class="ur-table-wrap">
          <table class="ur-table">
            <colgroup>
              <col style="min-width:120px;width:14%">
              <col style="min-width:56px;width:6%">
              <col style="min-width:72px;width:8%">
              <col style="min-width:80px;width:9%">
              <col style="min-width:180px;width:22%">
              <col style="min-width:70px;width:8%">
              <col style="min-width:80px;width:9%">
              <col style="min-width:120px;width:13%">
              <col style="min-width:80px;width:9%">
            </colgroup>
            <thead>
              <tr>
                <th>福利名称</th><th>福利图标</th><th>是否免费</th><th>价格</th>
                <th>独立解锁段位</th><th>状态</th><th>操作人</th><th>操作时间</th><th class="col-action">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in pagedBenefits" :key="row.id" class="ur-row">
                <td style="font-weight:600">{{ row.name }}</td>
                <td>
                  <div class="ur-icon-box" style="background:#f0f9ff;border:1px solid #bfdbfe">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="1.5"><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
                  </div>
                </td>
                <td>
                  <span class="ur-badge" :class="row.free === '是' ? 'ur-badge-green' : 'ur-badge-amber'">{{ row.free }}</span>
                </td>
                <td>
                  <span v-if="row.free === '否'" style="color:var(--warning);font-weight:700">¥ {{ row.price.toFixed(2) }}</span>
                  <span v-else class="ur-muted">-</span>
                </td>
                <td>
                  <div style="display:flex;flex-wrap:wrap;gap:4px">
                    <span v-for="(rn, idx) in row.rankNames.slice(0,3)" :key="rn" class="ur-tag-gray">{{ rn }}</span>
                    <span v-if="row.rankNames.length > 3" class="ur-tag-gray">+{{ row.rankNames.length - 3 }}</span>
                  </div>
                </td>
                <td>
                  <span class="ur-badge" :class="row.status === '显示' ? 'ur-badge-green' : 'ur-badge-gray'">{{ row.status }}</span>
                </td>
                <td style="font-size:13px">{{ row.op }}</td>
                <td class="ur-time">{{ row.time }}</td>
                <td class="col-action">
                  <div class="action-btns">
                    <button type="button" class="action-btn edit" title="编辑" @click="openBenefitEdit(row)">编辑</button>
                    <button type="button" class="action-btn delete" title="删除" @click="confirmDelete(row.id, row.name, 'benefit')">删除</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="ul-pagination">
          <span class="ul-page-info">共 <strong>{{ filteredBenefits.length }}</strong> 条，第 <strong>{{ benefitPage }}</strong>/<strong>{{ benefitTotalPages }}</strong> 页</span>
          <div style="display:flex;align-items:center;gap:4px">
            <button type="button" class="ul-pg-btn" :disabled="benefitPage <= 1" @click="goBenefitPage(1)">«</button>
            <button type="button" class="ul-pg-btn" :disabled="benefitPage <= 1" @click="goBenefitPage(benefitPage - 1)">‹</button>
            <template v-for="p in benefitPaginationPages" :key="'b' + String(p)">
              <button v-if="p !== '...'" type="button" class="ul-pg-btn" :class="{ active: p === benefitPage }" @click="goBenefitPage(Number(p))">{{ p }}</button>
              <span v-else style="padding:0 4px;color:var(--text-muted);font-size:13px">...</span>
            </template>
            <button type="button" class="ul-pg-btn" :disabled="benefitPage >= benefitTotalPages" @click="goBenefitPage(benefitPage + 1)">›</button>
            <button type="button" class="ul-pg-btn" :disabled="benefitPage >= benefitTotalPages" @click="goBenefitPage(benefitTotalPages)">»</button>
          </div>
          <div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-muted)">
            每页
            <select class="ul-pg-size" :value="benefitPageSize" @change="onBenefitPageSizeChange($event)">
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
    <!-- /page-content -->

    <!-- 段位配置弹窗 -->
    <div class="ur-overlay" :class="{ show: rankModalVisible }" @click.self="rankModalVisible = false"></div>
    <div class="ur-modal" :class="{ show: rankModalVisible }" style="width:560px">
      <div class="ur-modal-header">
        <span class="ur-modal-title">{{ rankEditTarget ? '编辑段位' : '新增段位' }}</span>
        <button class="ur-icon-btn" @click="rankModalVisible = false"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <div class="ur-modal-body">
        <div class="ur-form-group">
          <label class="ur-label">段位名称 <span class="req">*</span></label>
          <input v-model="rankForm.name" class="ur-input" placeholder="请输入段位名称" />
        </div>
        <div class="ur-form-group">
          <label class="ur-label">段位图标 <span class="req">*</span></label>
          <div class="ur-upload-box" @click="showToast('图片上传功能演示', 'info')">＋ 上传图标<div style="font-size:10px">建议 64×64，JPG/PNG</div></div>
        </div>
        <div class="ur-form-group">
          <label class="ur-label">近 30 天收益门槛（元）<span class="req">*</span></label>
          <input v-model.number="rankForm.threshold" type="number" min="0" class="ur-input" placeholder="0" />
        </div>
        <div class="ur-form-group">
          <label class="ur-label">状态 <span class="req">*</span></label>
          <div class="ur-radio-group">
            <label class="ur-radio"><input type="radio" v-model="rankForm.status" value="显示" />显示</label>
            <label class="ur-radio"><input type="radio" v-model="rankForm.status" value="隐藏" />隐藏</label>
          </div>
        </div>
      </div>
      <div class="ur-modal-footer">
        <button class="btn btn-default" @click="rankModalVisible = false">取消</button>
        <button class="btn btn-primary" @click="doSaveRank">保存</button>
      </div>
    </div>

    <!-- 段位福利弹窗 -->
    <div class="ur-overlay" :class="{ show: benefitModalVisible }" @click.self="benefitModalVisible = false"></div>
    <div class="ur-modal" :class="{ show: benefitModalVisible }" style="width:560px">
      <div class="ur-modal-header">
        <span class="ur-modal-title">{{ benefitEditTarget ? '编辑福利' : '新增福利' }}</span>
        <button class="ur-icon-btn" @click="benefitModalVisible = false"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <div class="ur-modal-body">
        <div class="ur-form-group">
          <label class="ur-label">福利名称 <span class="req">*</span></label>
          <input v-model="benefitForm.name" class="ur-input" placeholder="请输入福利名称" />
        </div>
        <div class="ur-form-group">
          <label class="ur-label">福利图标 <span class="req">*</span></label>
          <div class="ur-upload-box" @click="showToast('图片上传功能演示', 'info')">＋ 上传图标</div>
        </div>
        <div class="ur-form-group">
          <label class="ur-label">是否免费 <span class="req">*</span></label>
          <div class="ur-radio-group">
            <label class="ur-radio"><input type="radio" v-model="benefitForm.free" value="是" />是</label>
            <label class="ur-radio"><input type="radio" v-model="benefitForm.free" value="否" />否（需填写价格）</label>
          </div>
        </div>
        <div v-if="benefitForm.free === '否'" class="ur-form-group">
          <label class="ur-label">价格（元）<span class="req">*</span></label>
          <input v-model.number="benefitForm.price" type="number" min="0" step="0.01" class="ur-input" placeholder="0.00" />
        </div>
        <div class="ur-form-group">
          <label class="ur-label">独立解锁段位 <span class="req">*</span></label>
          <div style="display:flex;flex-wrap:wrap;gap:8px">
            <label v-for="r in ranks" :key="r.id" class="ur-checkbox">
              <input type="checkbox" :value="r.name" v-model="benefitForm.rankNames" style="accent-color:var(--primary)" />
              {{ r.name }}
            </label>
          </div>
        </div>
        <div class="ur-form-group">
          <label class="ur-label">状态 <span class="req">*</span></label>
          <div class="ur-radio-group">
            <label class="ur-radio"><input type="radio" v-model="benefitForm.status" value="显示" />显示</label>
            <label class="ur-radio"><input type="radio" v-model="benefitForm.status" value="隐藏" />隐藏</label>
          </div>
        </div>
      </div>
      <div class="ur-modal-footer">
        <button class="btn btn-default" @click="benefitModalVisible = false">取消</button>
        <button class="btn btn-primary" @click="doSaveBenefit">保存</button>
      </div>
    </div>

    <!-- 删除确认弹窗 -->
    <div class="ur-overlay" :class="{ show: deleteConfirmVisible }" @click.stop></div>
    <div class="ur-modal ur-modal-sm" :class="{ show: deleteConfirmVisible }">
      <div class="ur-modal-header">
        <span class="ur-modal-title" style="color:var(--danger)">确认删除</span>
        <button class="ur-icon-btn" @click="deleteConfirmVisible = false"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <div class="ur-modal-body">
        <p style="font-size:14px;color:var(--text-primary)">{{ deleteConfirmText }}</p>
      </div>
      <div class="ur-modal-footer">
        <button class="btn btn-default" @click="deleteConfirmVisible = false">取消</button>
        <button class="btn btn-danger" @click="doDelete">确认删除</button>
      </div>
    </div>

    <!-- Toast -->
    <div class="ur-toast-container">
      <div v-for="t in toasts" :key="t.id" class="ur-toast" :class="t.type">
        <span style="flex:1;line-height:1.5">{{ t.msg }}</span>
        <button class="ur-toast-close" @click="removeToast(t.id)">✕</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Rank { id: number; name: string; color: string; threshold: number; count: number; status: string; op: string; time: string }
interface Benefit { id: number; name: string; free: string; price: number; rankNames: string[]; status: string; op: string; time: string }

const RANK_COLORS = ['#94a3b8', '#60a5fa', '#f59e0b', '#818cf8', '#06b6d4']

const activeTab = ref<'rank' | 'benefit'>('rank')

const ranks = ref<Rank[]>([
  { id:1, name:'初级', color:RANK_COLORS[0], threshold:0,     count:12486, status:'显示', op:'系统初始化', time:'2024-01-01' },
  { id:2, name:'白银', color:RANK_COLORS[1], threshold:300,   count:5832,  status:'显示', op:'张管理',   time:'2024-01-01' },
  { id:3, name:'黄金', color:RANK_COLORS[2], threshold:1000,  count:2341,  status:'显示', op:'张管理',   time:'2024-01-01' },
  { id:4, name:'铂金', color:RANK_COLORS[3], threshold:5000,  count:892,   status:'显示', op:'李运营',   time:'2024-01-01' },
  { id:5, name:'钻石', color:RANK_COLORS[4], threshold:20000, count:186,   status:'显示', op:'王审核',   time:'2024-01-01' },
])

const benefits = ref<Benefit[]>([
  { id:1, name:'初级专属任务包',   free:'是',  price:0,    rankNames:['初级'],       status:'显示', op:'运营', time:'2024-01-15' },
  { id:2, name:'白银创作者徽章',   free:'是',  price:0,    rankNames:['白银','黄金'], status:'显示', op:'运营', time:'2024-01-15' },
  { id:3, name:'黄金优先推送权',   free:'是',  price:0,    rankNames:['黄金','铂金','钻石'], status:'显示', op:'运营', time:'2024-02-01' },
  { id:4, name:'铂金专属客服通道', free:'是',  price:0,    rankNames:['铂金','钻石'], status:'显示', op:'运营', time:'2024-02-01' },
  { id:5, name:'钻石专属礼包',     free:'否',  price:9.9,  rankNames:['钻石'],       status:'显示', op:'李运营', time:'2024-03-01' },
])

const rankFilter = ref({ name:'', status:'', op:'', timeStart:'', timeEnd:'' })
const filteredRanks = computed(() => ranks.value.filter(r => {
  if (rankFilter.value.name && !r.name.includes(rankFilter.value.name)) return false
  if (rankFilter.value.status && r.status !== rankFilter.value.status) return false
  if (rankFilter.value.op && !r.op.includes(rankFilter.value.op)) return false
  if (rankFilter.value.timeStart && r.time < rankFilter.value.timeStart) return false
  if (rankFilter.value.timeEnd && r.time > rankFilter.value.timeEnd) return false
  return true
}))

const benefitFilter = ref({ name:'', free:'', rank:'', status:'', op:'', timeStart:'', timeEnd:'' })
const filteredBenefits = computed(() => benefits.value.filter(b => {
  if (benefitFilter.value.name && !b.name.includes(benefitFilter.value.name)) return false
  if (benefitFilter.value.free && b.free !== benefitFilter.value.free) return false
  if (benefitFilter.value.rank && !b.rankNames.includes(benefitFilter.value.rank)) return false
  if (benefitFilter.value.status && b.status !== benefitFilter.value.status) return false
  if (benefitFilter.value.op && !b.op.includes(benefitFilter.value.op)) return false
  if (benefitFilter.value.timeStart && b.time < benefitFilter.value.timeStart) return false
  if (benefitFilter.value.timeEnd && b.time > benefitFilter.value.timeEnd) return false
  return true
}))

const rankPage = ref(1)
const rankPageSize = ref(20)
const benefitPage = ref(1)
const benefitPageSize = ref(20)

const rankTotalPages = computed(() => Math.max(1, Math.ceil(filteredRanks.value.length / rankPageSize.value)))
const benefitTotalPages = computed(() => Math.max(1, Math.ceil(filteredBenefits.value.length / benefitPageSize.value)))

const pagedRanks = computed(() => {
  const start = (rankPage.value - 1) * rankPageSize.value
  return filteredRanks.value.slice(start, start + rankPageSize.value)
})
const pagedBenefits = computed(() => {
  const start = (benefitPage.value - 1) * benefitPageSize.value
  return filteredBenefits.value.slice(start, start + benefitPageSize.value)
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

const rankPaginationPages = computed(() => buildPaginationPages(rankPage.value, rankTotalPages.value))
const benefitPaginationPages = computed(() => buildPaginationPages(benefitPage.value, benefitTotalPages.value))

watch([() => filteredRanks.value.length, rankPageSize], () => {
  if (rankPage.value > rankTotalPages.value) rankPage.value = rankTotalPages.value
})
watch([() => filteredBenefits.value.length, benefitPageSize], () => {
  if (benefitPage.value > benefitTotalPages.value) benefitPage.value = benefitTotalPages.value
})

function goRankPage(p: number) {
  if (p < 1 || p > rankTotalPages.value) return
  rankPage.value = p
}
function goBenefitPage(p: number) {
  if (p < 1 || p > benefitTotalPages.value) return
  benefitPage.value = p
}
function onRankPageSizeChange(e: Event) {
  rankPageSize.value = Number((e.target as HTMLSelectElement).value)
  rankPage.value = 1
}
function onBenefitPageSizeChange(e: Event) {
  benefitPageSize.value = Number((e.target as HTMLSelectElement).value)
  benefitPage.value = 1
}
function resetRankFilter() {
  rankFilter.value = { name: '', status: '', op: '', timeStart: '', timeEnd: '' }
  rankPage.value = 1
}
function resetBenefitFilter() {
  benefitFilter.value = { name: '', free: '', rank: '', status: '', op: '', timeStart: '', timeEnd: '' }
  benefitPage.value = 1
}
function queryRankTab() {
  rankPage.value = 1
  showToast(`查询完成，共 ${filteredRanks.value.length} 条`, 'info')
}
function queryBenefitTab() {
  benefitPage.value = 1
  showToast(`查询完成，共 ${filteredBenefits.value.length} 条`, 'info')
}

// 段位配置 Modal
const rankModalVisible = ref(false)
const rankEditTarget = ref<Rank | null>(null)
const rankForm = ref({ name:'', threshold:0, status:'显示' })
let nextRankId = 6

function openRankEdit(row: Rank | null) {
  rankEditTarget.value = row
  rankForm.value = row ? { name: row.name, threshold: row.threshold, status: row.status } : { name:'', threshold:0, status:'显示' }
  rankModalVisible.value = true
}
function doSaveRank() {
  if (!rankForm.value.name.trim()) { showToast('段位名称不能为空', 'warning'); return }
  if (rankEditTarget.value) {
    rankEditTarget.value.name = rankForm.value.name
    rankEditTarget.value.threshold = rankForm.value.threshold
    rankEditTarget.value.status = rankForm.value.status
    rankEditTarget.value.op = '当前管理员'
    rankEditTarget.value.time = new Date().toISOString().slice(0,10)
  } else {
    ranks.value.push({ id: nextRankId++, name: rankForm.value.name, color: RANK_COLORS[(nextRankId % RANK_COLORS.length)], threshold: rankForm.value.threshold, count: 0, status: rankForm.value.status, op:'当前管理员', time: new Date().toISOString().slice(0,10) })
  }
  rankModalVisible.value = false
  showToast('保存成功', 'success')
}

// 段位福利 Modal
const benefitModalVisible = ref(false)
const benefitEditTarget = ref<Benefit | null>(null)
const benefitForm = ref({ name:'', free:'是', price:0, rankNames:[] as string[], status:'显示' })
let nextBenefitId = 6

function openBenefitEdit(row: Benefit | null) {
  benefitEditTarget.value = row
  benefitForm.value = row ? { name:row.name, free:row.free, price:row.price, rankNames:[...row.rankNames], status:row.status } : { name:'', free:'是', price:0, rankNames:[], status:'显示' }
  benefitModalVisible.value = true
}
function doSaveBenefit() {
  if (!benefitForm.value.name.trim()) { showToast('福利名称不能为空', 'warning'); return }
  if (!benefitForm.value.rankNames.length) { showToast('请至少选择一个解锁段位', 'warning'); return }
  if (benefitEditTarget.value) {
    Object.assign(benefitEditTarget.value, { ...benefitForm.value, op:'当前管理员', time: new Date().toISOString().slice(0,10) })
  } else {
    benefits.value.push({ id: nextBenefitId++, ...benefitForm.value, op:'当前管理员', time: new Date().toISOString().slice(0,10) })
  }
  benefitModalVisible.value = false
  showToast('保存成功', 'success')
}

// 删除确认
const deleteConfirmVisible = ref(false)
const deleteTarget = ref({ id: 0, name: '', type: '' as '' | 'rank' | 'benefit' })
const deleteConfirmText = computed(() => {
  if (deleteTarget.value.type === 'rank') {
    return `确认删除段位「${deleteTarget.value.name}」？此操作不可撤销。`
  }
  if (deleteTarget.value.type === 'benefit') {
    return `确认删除福利「${deleteTarget.value.name}」？此操作不可撤销。`
  }
  return '此操作不可撤销。'
})
function confirmDelete(id: number, name: string, type: 'rank' | 'benefit') {
  deleteTarget.value = { id, name, type }
  deleteConfirmVisible.value = true
}
function doDelete() {
  if (deleteTarget.value.type === 'rank') ranks.value = ranks.value.filter(r => r.id !== deleteTarget.value.id)
  else benefits.value = benefits.value.filter(b => b.id !== deleteTarget.value.id)
  deleteConfirmVisible.value = false
  showToast('删除成功', 'success')
}

interface Toast { id: number; msg: string; type: string }
const toasts = ref<Toast[]>([]); let tid = 0
function showToast(msg: string, type = 'info') { const id = ++tid; toasts.value.push({ id, msg, type }); setTimeout(() => removeToast(id), 3000) }
function removeToast(id: number) { toasts.value = toasts.value.filter(t => t.id !== id) }
</script>

<style scoped>
.ur-wrap { min-height: 100%; }
.ur-table-wrap { overflow-x: auto; }
.ur-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.ur-table th { padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 600; color: var(--text-muted); background: var(--surface-hover); border-bottom: 1px solid var(--border); white-space: nowrap; }
.ur-table td { padding: 12px 14px; border-bottom: 1px solid var(--border); vertical-align: middle; }
.ur-row:hover td { background: var(--surface-hover); }
.ur-num { font-variant-numeric: tabular-nums; font-weight: 700; font-family: monospace; }
.ur-time { font-size: 11px; color: var(--text-muted); }
.ur-muted { color: var(--text-muted); font-size: 12px; }
.ur-rank-badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 4px; font-size: 12px; font-weight: 600; }
.ur-icon-box { width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; }
.ur-tag-gray { display: inline-flex; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 500; background: var(--surface-hover); color: var(--text-secondary); border: 1px solid var(--border); }
.ur-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
.ur-badge::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
.ur-badge-green { background: #f0fdf4; color: #16a34a; }
.ur-badge-amber { background: #fffbeb; color: #d97706; }
.ur-badge-gray  { background: #f1f5f9; color: #64748b; }
[data-theme="dark"] .ur-badge-green { background: rgba(22,163,74,0.15); }
[data-theme="dark"] .ur-badge-amber { background: rgba(217,119,6,0.15); }
[data-theme="dark"] .ur-badge-gray  { background: rgba(100,116,139,0.15); }
/* 弹窗 */
.ur-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 699; opacity: 0; pointer-events: none; transition: opacity 0.22s; }
.ur-overlay.show { opacity: 1; pointer-events: all; }
.ur-modal { position: fixed; top: 50%; left: 50%; z-index: 700; background: var(--surface); border-radius: var(--radius-lg); box-shadow: var(--shadow-xl); display: flex; flex-direction: column; max-height: 90vh; transform: translate(-50%, -50%) scale(0.95); opacity: 0; pointer-events: none; transition: transform 0.22s, opacity 0.22s; }
.ur-modal.show { transform: translate(-50%, -50%) scale(1); opacity: 1; pointer-events: all; }
.ur-modal-sm { width: 420px; }
.ur-modal-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border); flex-shrink: 0; }
.ur-modal-title { font-size: 15px; font-weight: 700; color: var(--text-primary); }
.ur-modal-body { padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; }
.ur-modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 14px 20px; border-top: 1px solid var(--border); flex-shrink: 0; }
.ur-form-group { display: flex; flex-direction: column; gap: 6px; }
.ur-label { font-size: 13px; color: var(--text-secondary); font-weight: 500; }
.req { color: var(--danger); }
.ur-input { width: 100%; height: 36px; padding: 0 10px; font-size: 13px; font-family: inherit; color: var(--text-primary); background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); outline: none; transition: var(--transition); }
.ur-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(37,99,235,0.10); }
.ur-upload-box { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 80px; height: 80px; border: 2px dashed var(--border); border-radius: 8px; cursor: pointer; font-size: 13px; color: var(--text-muted); transition: var(--transition); gap: 4px; }
.ur-upload-box:hover { border-color: var(--primary); color: var(--primary); }
.ur-radio-group { display: flex; gap: 16px; }
.ur-radio { display: flex; align-items: center; gap: 6px; font-size: 13px; cursor: pointer; }
.ur-checkbox { display: flex; align-items: center; gap: 6px; font-size: 13px; cursor: pointer; padding: 4px 10px; border: 1px solid var(--border); border-radius: var(--radius-sm); }
.ur-icon-btn { width: 28px; height: 28px; border-radius: 6px; background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-muted); transition: var(--transition); }
.ur-icon-btn:hover { background: var(--surface-hover); }
/* Toast */
.ur-toast-container { position: fixed; top: 66px; right: 22px; z-index: 9999; display: flex; flex-direction: column; gap: 8px; pointer-events: none; }
.ur-toast { min-width: 200px; max-width: 360px; padding: 12px 14px 12px 16px; background: var(--surface); border-radius: var(--radius); box-shadow: var(--shadow-lg); border-left: 3px solid; display: flex; align-items: flex-start; gap: 8px; font-size: 13px; pointer-events: all; animation: urToastIn 0.28s ease; }
.ur-toast.success { border-left-color: var(--success); }
.ur-toast.info    { border-left-color: var(--primary); }
.ur-toast.warning { border-left-color: var(--warning); }
.ur-toast.error   { border-left-color: var(--danger); }
.ur-toast-close { background: none; border: none; cursor: pointer; color: var(--text-muted); font-size: 14px; }
@keyframes urToastIn { from { opacity: 0; transform: translateX(80px); } to { opacity: 1; transform: translateX(0); } }
</style>
