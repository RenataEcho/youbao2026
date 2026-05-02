<template>
  <div class="ic-wrap">
    <div class="breadcrumb-bar">
      <router-link to="/dashboard">工作台</router-link>
      <span class="bc-sep">/</span>
      <span style="color:var(--text-secondary)">用户体系</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">用户等级</span>
    </div>

    <div class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">用户等级配置</h1>
          <p class="page-desc">管理创作者等级体系配置，共 10 个等级，固定数量不可新增删除</p>
        </div>
      </div>

      <div class="glass-card table-card">
        <div class="table-header">
          <div class="table-title">等级列表<span class="table-count">共 10 条</span></div>
          <div style="font-size:12px;color:var(--text-muted)">点击操作按钮编辑对应等级配置</div>
        </div>
        <div class="ic-table-wrap">
          <table class="ic-table">
            <colgroup>
              <col style="width:60px">
              <col style="min-width:100px">
              <col style="min-width:90px">
              <col style="min-width:260px">
              <col style="min-width:260px">
              <col style="min-width:200px">
              <col style="width:80px">
            </colgroup>
            <thead>
              <tr>
                <th>等级</th>
                <th>等级名称</th>
                <th>等级图标</th>
                <th>升级条件</th>
                <th>等级特权</th>
                <th>备注</th>
                <th class="col-action" style="text-align:center">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in levels" :key="row.level" class="ul-row">
                <td>
                  <span class="ic-level-badge" :style="`background:${row.color}22;color:${row.color};border:1px solid ${row.color}44`">Lv.{{ row.level }}</span>
                </td>
                <td>
                  <span style="font-size:13px;font-weight:600;color:var(--text-primary)">{{ row.name }}</span>
                </td>
                <td>
                  <div class="ic-icon-placeholder" :style="`background:${row.color}22;border-color:${row.color}44`">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" :stroke="row.color" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  </div>
                </td>
                <td>
                  <div class="ic-cond-list">
                    <div v-for="cond in row.conditions" :key="cond" class="ic-cond-item">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                      <span style="font-size:12px">{{ cond }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="ic-priv-list">
                    <span v-for="priv in row.privileges" :key="priv" class="tag tag-blue" style="font-size:10px">{{ priv }}</span>
                  </div>
                </td>
                <td class="ul-muted" style="font-size:12px">{{ row.remark }}</td>
                <td>
                  <div style="text-align:center">
                    <button type="button" class="action-btn edit" title="编辑" @click="openEdit(row)">编辑</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 编辑弹窗 -->
    <div class="ul-overlay" :class="{show:editVisible}" @click.self="()=>{}"></div>
    <div class="ul-modal" :class="{show:editVisible}" style="width:560px">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid var(--border)">
        <div style="font-size:15px;font-weight:700">编辑等级 — Lv.{{ editTarget?.level }} {{ editTarget?.name }}</div>
        <button class="ul-icon-btn" @click="editVisible=false"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <div v-if="editTarget" style="padding:20px;display:flex;flex-direction:column;gap:14px">
        <div class="ul-form-group"><label class="ul-label">等级名称 <span style="color:var(--danger)">*</span></label><input v-model="editForm.name" class="ul-input" style="max-width:200px"></div>
        <div>
          <label class="ul-label" style="display:block;margin-bottom:6px">升级条件</label>
          <div v-for="(c,idx) in editForm.conditions" :key="idx" style="display:flex;gap:8px;margin-bottom:6px">
            <input :value="c" class="ul-input" style="flex:1" @input="e=>editForm.conditions[idx]=(e.target as HTMLInputElement).value">
            <button class="btn btn-danger btn-sm" style="width:32px;padding:0;flex-shrink:0" @click="editForm.conditions.splice(idx,1)">×</button>
          </div>
          <button class="btn btn-default btn-sm" @click="editForm.conditions.push('')">+ 添加条件</button>
        </div>
        <div>
          <label class="ul-label" style="display:block;margin-bottom:6px">等级特权</label>
          <div v-for="(p,idx) in editForm.privileges" :key="idx" style="display:flex;gap:8px;margin-bottom:6px">
            <input :value="p" class="ul-input" style="flex:1" @input="e=>editForm.privileges[idx]=(e.target as HTMLInputElement).value">
            <button class="btn btn-danger btn-sm" style="width:32px;padding:0;flex-shrink:0" @click="editForm.privileges.splice(idx,1)">×</button>
          </div>
          <button class="btn btn-default btn-sm" @click="editForm.privileges.push('')">+ 添加特权</button>
        </div>
        <div class="ul-form-group"><label class="ul-label">备注</label><textarea v-model="editForm.remark" class="ul-input" rows="2" style="height:auto;resize:vertical" placeholder="备注说明"></textarea></div>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:10px;padding:14px 20px;border-top:1px solid var(--border)">
        <button class="btn btn-default" @click="editVisible=false">取消</button>
        <button class="btn btn-primary" @click="doSave">保存</button>
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
import { ref } from 'vue'

interface Level {
  level:number; name:string; color:string; remark:string
  conditions:string[]; privileges:string[]
}
interface Toast { id:number; msg:string; type:string }

const editVisible = ref(false)
const editTarget = ref<Level|null>(null)
const editForm = ref<{name:string;conditions:string[];privileges:string[];remark:string}>({ name:'', conditions:[], privileges:[], remark:'' })
const toasts = ref<Toast[]>([]); let toastId = 0

const COLORS = ['#6b7280','#3b82f6','#10b981','#8b5cf6','#f59e0b','#ef4444','#06b6d4','#ec4899','#f97316','#a855f7']
const levels = ref<Level[]>([
  { level:1, name:'素人KOC', color:COLORS[0], remark:'默认级别，新注册用户', conditions:['完成实名认证','绑定至少1个媒体账号'], privileges:['参与推文项目','基础收益结算'] },
  { level:2, name:'初级创作者', color:COLORS[1], remark:'初步活跃用户', conditions:['累计完成5单任务','近30日活跃天数≥10天'], privileges:['参与推文项目','参与短剧项目','优先任务推送'] },
  { level:3, name:'进阶创作者', color:COLORS[2], remark:'', conditions:['累计完成20单任务','近30日活跃天数≥15天','累计收益≥500元'], privileges:['参与全类型项目','更高分红比例','专属客服通道'] },
  { level:4, name:'核心创作者', color:COLORS[3], remark:'', conditions:['累计完成50单任务','近30日活跃天数≥20天','累计收益≥2000元'], privileges:['最高分红比例','专属运营对接','优先评估资质'] },
  { level:5, name:'优质创作者', color:COLORS[4], remark:'', conditions:['累计完成100单任务','近90日活跃天数≥60天','累计收益≥5000元','粉丝总量≥5万'], privileges:['项目优先推荐','专属激励活动','独立合同签署'] },
  { level:6, name:'资深创作者', color:COLORS[5], remark:'', conditions:['累计完成200单任务','近90日活跃天数≥70天','累计收益≥15000元','粉丝总量≥20万'], privileges:['最高激励政策','跨品类资源','BD协作机会'] },
  { level:7, name:'专业达人', color:COLORS[6], remark:'', conditions:['累计完成500单任务','近90日活跃天数≥75天','累计收益≥30000元','粉丝总量≥50万'], privileges:['S级项目优先','年度签约激励','专属IP孵化'] },
  { level:8, name:'超级达人', color:COLORS[7], remark:'', conditions:['累计完成1000单任务','近180日活跃天数≥150天','累计收益≥100000元','粉丝总量≥100万'], privileges:['顶级项目优先','个人品牌扶持','平台联名背书'] },
  { level:9, name:'平台明星', color:COLORS[8], remark:'', conditions:['累计完成2000单任务','累计收益≥300000元','粉丝总量≥500万','人工评审通过'], privileges:['全部最高权益','联名活动资源','战略合作伙伴'] },
  { level:10, name:'顶级创作者', color:COLORS[9], remark:'最高等级，运营人工审核', conditions:['累计收益≥1000000元','粉丝总量≥1000万','年度优秀创作者评选通过'], privileges:['平台顶级资源扶持','深度品牌合作','股权激励候选资格'] },
])

function openEdit(row:Level) {
  editTarget.value=row
  editForm.value={ name:row.name, conditions:[...row.conditions], privileges:[...row.privileges], remark:row.remark }
  editVisible.value=true
}
function doSave() {
  if(!editTarget.value) return
  editTarget.value.name=editForm.value.name
  editTarget.value.conditions=[...editForm.value.conditions.filter(c=>c.trim())]
  editTarget.value.privileges=[...editForm.value.privileges.filter(p=>p.trim())]
  editTarget.value.remark=editForm.value.remark
  editVisible.value=false; showToast('保存成功','success')
}
function showToast(msg:string,type='info') { const id=++toastId;toasts.value.push({id,msg,type});setTimeout(()=>removeToast(id),3000) }
function removeToast(id:number) { toasts.value=toasts.value.filter(t=>t.id!==id) }
</script>

<style>
.ic-wrap { min-height:100%; }
.ic-table-wrap { overflow-x:auto; }
.ic-table { width:100%; border-collapse:collapse; font-size:13px; }
.ic-table th { padding:10px 14px; text-align:left; font-size:11px; font-weight:600; color:var(--text-muted); background:var(--surface-hover); border-bottom:1px solid var(--border); white-space:nowrap; }
.ic-table td { padding:12px 14px; border-bottom:1px solid var(--border); color:var(--text-primary); vertical-align:top; }
.ic-table tr:last-child td { border-bottom:none; }
.ic-table .ul-row:hover td { background:rgba(37,99,235,.03); }
.ic-level-badge { display:inline-flex; align-items:center; padding:2px 10px; border-radius:50px; font-size:12px; font-weight:700; }
.ic-icon-placeholder { width:40px; height:40px; border-radius:50%; border:1.5px dashed; display:flex; align-items:center; justify-content:center; }
.ic-cond-list { display:flex; flex-direction:column; gap:4px; }
.ic-cond-item { display:flex; align-items:flex-start; gap:5px; }
.ic-priv-list { display:flex; flex-wrap:wrap; gap:4px; }
</style>
