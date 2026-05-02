<template>
  <el-dialog
    v-model="visible"
    title="分销比例规则说明"
    width="760px"
    :close-on-click-modal="true"
    class="rule-dialog"
  >
    <template #header>
      <div class="rule-dialog-header">
        <el-icon style="color:var(--primary)"><InfoFilled /></el-icon>
        <span>分销比例规则说明</span>
      </div>
    </template>

    <div class="rule-body">
      <!-- ① 等级权限总览 -->
      <div class="rule-block">
        <div class="rule-block-title">
          <span class="rule-num">1</span>
          等级分佣权限总览
        </div>
        <el-table :data="overviewData" border size="small" class="rule-el-table">
          <el-table-column label="等级" width="70" align="center">
            <template #default="{ row }">
              <span class="lv-tag" :class="`lv-${row.level.toLowerCase()}`">{{ row.level }}</span>
            </template>
          </el-table-column>
          <el-table-column label="用户关系分佣" min-width="180">
            <template #default="{ row }">{{ row.userRule }}</template>
          </el-table-column>
          <el-table-column label="团队关系分佣" min-width="200">
            <template #default="{ row }">
              <span v-if="row.level === 'V1'" class="rule-na">✗ 不适用（非团长）</span>
              <span v-else>{{ row.teamRule }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- ② 用户关系规则 -->
      <div class="rule-block">
        <div class="rule-block-title">
          <span class="rule-num">2</span>
          用户关系分佣规则
        </div>
        <el-alert type="info" :closable="false" class="rule-alert">
          <template #default>
            <strong>用户关系分佣：</strong><strong>V2、V3</strong> 对下级 <strong>V1、V2、V3</strong> 均可获得并配置「直邀 + 间邀」；
            「无限」比例<strong>仅</strong>在针对下级 <strong>V1</strong> 时配置（V2/V3→V1）。
            <strong>V1</strong> 对下级 V1 为直邀 + 间邀（无无限）。各分佣等级需<strong>分别配置</strong>不同下级目标等级的比例。
          </template>
        </el-alert>

        <div class="rule-scene-box">
          <div class="rule-scene-label">场景：V3 等级的用户关系分佣配置项</div>
          <el-table :data="userSceneData" border size="small" class="rule-el-table">
            <el-table-column label="下级等级" width="80" align="center">
              <template #default="{ row }">
                <span class="lv-tag lv-sm" :class="`lv-${row.level.toLowerCase()}`">{{ row.level }}</span>
              </template>
            </el-table-column>
            <el-table-column label="直邀比例" width="90" align="center">
              <template #default><span class="rule-y">✓ 配置</span></template>
            </el-table-column>
            <el-table-column label="间邀比例" width="100" align="center">
              <template #default="{ row }">
                <span v-if="row.hasIndirect" class="rule-y">✓ 配置</span>
                <span v-else class="rule-na">✗ 不配置</span>
              </template>
            </el-table-column>
            <el-table-column label="无限比例" min-width="120" align="center">
              <template #default="{ row }">
                <span v-if="row.hasInfinite" class="rule-y">✓ 配置（{{ row.infiniteNote }}）</span>
                <span v-else class="rule-na">✗ 不配置</span>
              </template>
            </el-table-column>
            <el-table-column label="说明" min-width="160">
              <template #default="{ row }">{{ row.note }}</template>
            </el-table-column>
          </el-table>
          <p class="rule-footnote">补充：针对下级 <strong>V2、V3</strong> 不配「无限」用户关系分佣；间邀比例仍须配置。</p>
        </div>

        <!-- 链路示例 -->
        <div class="rule-scene-box">
          <div class="rule-scene-label">示例：H(V1) 出单链路中，G 为直邀、F 为间邀（V2/V3 均可参与直邀+间邀分佣）</div>
          <div class="chain-flow">
            <span class="cn cn-me">…更高层</span>
            <span class="cn-arr">←</span>
            <span class="cn cn-v2">E(V2)</span>
            <span class="cn-arr">←</span>
            <span class="cn cn-v2">F(V2)</span>
            <span class="cn-arr">←</span>
            <span class="cn cn-v1">G(V1)</span>
            <span class="cn-arr">←</span>
            <span class="cn cn-v1">H(V1)</span>
            <span class="cn-arr">←</span>
            <span class="cn cn-order">出单</span>
          </div>
          <div class="ann-list">
            <div class="ann-row"><span class="ann-dot" style="background:#2563eb"></span>G(V1) 获得【直邀比例】（G 直接邀请了 H，同V1等级）</div>
            <div class="ann-row"><span class="ann-dot" style="background:#7c3aed"></span>F(V2) 获得【间邀比例】（F 是 G 的上级，V2高于V1）</div>
            <div class="ann-row"><span class="ann-dot" style="background:#94a3b8"></span>E 及以上：<strong>无用户关系分佣</strong>，超出2层截止</div>
          </div>
        </div>
      </div>

      <!-- ③ 团队关系规则 -->
      <div class="rule-block">
        <div class="rule-block-title">
          <span class="rule-num">3</span>
          团队关系分佣规则
        </div>
        <el-alert type="warning" :closable="false" class="rule-alert">
          <template #default>
            V1 不是团长，<strong>无团队关系分佣</strong>。V2+ 按目标团长等级分别配置。
            以<strong>团长节点跳数</strong>计算：第1跳=直属团；第2跳=间属团；≥3跳=无限团（仅高等级对低等级）。
          </template>
        </el-alert>

        <div class="rule-scene-box">
          <div class="rule-scene-label">场景：V3 等级的团队关系分佣配置项</div>
          <el-table :data="teamSceneData" border size="small" class="rule-el-table">
            <el-table-column label="目标团长等级" width="100" align="center">
              <template #default="{ row }">
                <span class="lv-tag lv-sm" :class="`lv-${row.level.toLowerCase()}`">{{ row.level }}</span>
              </template>
            </el-table-column>
            <el-table-column label="直属团比例" width="100" align="center">
              <template #default="{ row }">
                <span v-if="row.applicable" class="rule-y">✓ 配置</span>
                <span v-else class="rule-na">—</span>
              </template>
            </el-table-column>
            <el-table-column label="间属团比例" width="100" align="center">
              <template #default="{ row }">
                <span v-if="row.applicable" class="rule-y">✓ 配置</span>
                <span v-else class="rule-na">—</span>
              </template>
            </el-table-column>
            <el-table-column label="无限团比例" min-width="120" align="center">
              <template #default="{ row }">
                <span v-if="!row.applicable" class="rule-na">不适用（V1非团长）</span>
                <span v-else-if="row.hasInfinite" class="rule-y">✓ 配置（{{ row.infiniteNote }}）</span>
                <span v-else class="rule-na">✗ 不配置</span>
              </template>
            </el-table-column>
            <el-table-column label="说明" min-width="160">
              <template #default="{ row }">{{ row.note }}</template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 链路示例 -->
        <div class="rule-scene-box">
          <div class="rule-scene-label">示例：H(V1) 出单，F(V2) 是所属团长，团队分佣链路</div>
          <div class="chain-flow">
            <span class="cn cn-v3">A(V3)</span>
            <span class="cn-arr">←</span>
            <span class="cn cn-v3">B(V3)</span>
            <span class="cn-arr">←</span>
            <span class="cn cn-v3">C(V3)</span>
            <span class="cn-arr">←</span>
            <span class="cn cn-v2">D(V2)</span>
            <span class="cn-arr">←</span>
            <span class="cn cn-v2">E(V2)</span>
            <span class="cn-arr">←</span>
            <span class="cn cn-v2-hl">F(V2)</span>
            <span class="cn-arr">←</span>
            <span class="cn cn-v1">H(V1)</span>
            <span class="cn-arr">←</span>
            <span class="cn cn-order">出单</span>
          </div>
          <div class="ann-list">
            <div class="ann-row"><span class="ann-dot" style="background:#0891b2"></span>E(V2) → <strong style="color:#0891b2">直属团</strong>（F第1跳，同V2级）</div>
            <div class="ann-row"><span class="ann-dot" style="background:#d97706"></span>D(V2) → <strong style="color:#d97706">间属团</strong>（F第2跳，同V2截止）</div>
            <div class="ann-row"><span class="ann-dot" style="background:#dc2626"></span>C(V3) → <strong style="color:#dc2626">无限团</strong>（F第3跳，V3&gt;V2 穿透，重置新起点）</div>
            <div class="ann-row"><span class="ann-dot" style="background:#0891b2"></span>B(V3) → <strong style="color:#0891b2">直属团</strong>（C重置起点第1跳，同V3级）</div>
            <div class="ann-row"><span class="ann-dot" style="background:#d97706"></span>A(V3) → <strong style="color:#d97706">间属团</strong>（C重置起点第2跳，同V3级截止）</div>
          </div>
        </div>
      </div>

      <!-- ④ 完整链路图例 -->
      <div class="rule-block" style="margin-bottom:0">
        <div class="rule-block-title">
          <span class="rule-num">4</span>
          完整分佣链路图例
        </div>
        <div style="overflow-x:auto">
          <svg width="820" height="760" viewBox="0 0 820 760" style="display:block;margin:0 auto;max-width:100%;font-family:'PingFang SC','Microsoft YaHei',sans-serif">
            <defs>
              <marker id="rm-mg" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#64748b"/></marker>
              <marker id="rm-mb" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#2563eb"/></marker>
              <marker id="rm-mv" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#7c3aed"/></marker>
              <marker id="rm-mt" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#0891b2"/></marker>
              <marker id="rm-ma" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#d97706"/></marker>
              <marker id="rm-mr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#dc2626"/></marker>
            </defs>
            <!-- 背景区块 -->
            <rect x="8" y="8" width="318" height="740" rx="10" fill="rgba(8,145,178,0.03)" stroke="rgba(8,145,178,0.12)" stroke-width="1" stroke-dasharray="4,3"/>
            <text x="167" y="24" text-anchor="middle" font-size="10" font-weight="700" fill="#0891b2" letter-spacing="1">团队关系分佣</text>
            <rect x="500" y="430" width="308" height="150" rx="10" fill="rgba(37,99,235,0.03)" stroke="rgba(37,99,235,0.12)" stroke-width="1" stroke-dasharray="4,3"/>
            <text x="654" y="446" text-anchor="middle" font-size="10" font-weight="700" fill="#2563eb" letter-spacing="1">用户关系分佣</text>
            <text x="654" y="464" text-anchor="middle" font-size="9" fill="#64748b">右侧：直邀 + 间邀（V2/V3 用户关系）</text>
            <text x="654" y="478" text-anchor="middle" font-size="9" fill="#64748b">无限用户关系比例仅 V2/V3→V1 可配</text>
            <!-- 邀请链 -->
            <line x1="370" y1="65" x2="370" y2="107" stroke="#64748b" stroke-width="2" marker-end="url(#rm-mg)"/>
            <line x1="370" y1="147" x2="370" y2="187" stroke="#64748b" stroke-width="2" marker-end="url(#rm-mg)"/>
            <line x1="370" y1="227" x2="370" y2="267" stroke="#64748b" stroke-width="2" marker-end="url(#rm-mg)"/>
            <line x1="370" y1="307" x2="370" y2="347" stroke="#64748b" stroke-width="2" marker-end="url(#rm-mg)"/>
            <line x1="370" y1="387" x2="370" y2="427" stroke="#64748b" stroke-width="2" marker-end="url(#rm-mg)"/>
            <line x1="370" y1="467" x2="370" y2="507" stroke="#64748b" stroke-width="2" marker-end="url(#rm-mg)"/>
            <line x1="370" y1="547" x2="370" y2="587" stroke="#64748b" stroke-width="2" marker-end="url(#rm-mg)"/>
            <line x1="370" y1="623" x2="370" y2="669" stroke="#64748b" stroke-width="2" marker-end="url(#rm-mg)"/>
            <!-- 节点 -->
            <ellipse cx="370" cy="47" rx="44" ry="16" fill="#dbeafe" stroke="#93c5fd" stroke-width="1.5"/>
            <text x="370" y="52" text-anchor="middle" font-size="12" font-weight="700" fill="#1e40af">A(V3)</text>
            <ellipse cx="370" cy="127" rx="44" ry="16" fill="#dbeafe" stroke="#93c5fd" stroke-width="1.5"/>
            <text x="370" y="132" text-anchor="middle" font-size="12" font-weight="700" fill="#1e40af">B(V3)</text>
            <ellipse cx="370" cy="207" rx="44" ry="16" fill="#dbeafe" stroke="#93c5fd" stroke-width="1.5"/>
            <text x="370" y="212" text-anchor="middle" font-size="12" font-weight="700" fill="#1e40af">C(V3)</text>
            <ellipse cx="370" cy="287" rx="44" ry="16" fill="#d1fae5" stroke="#6ee7b7" stroke-width="1.5"/>
            <text x="370" y="292" text-anchor="middle" font-size="12" font-weight="700" fill="#065f46">D(V2)</text>
            <ellipse cx="370" cy="367" rx="44" ry="16" fill="#d1fae5" stroke="#6ee7b7" stroke-width="1.5"/>
            <text x="370" y="372" text-anchor="middle" font-size="12" font-weight="700" fill="#065f46">E(V2)</text>
            <ellipse cx="370" cy="447" rx="50" ry="18" fill="#bbf7d0" stroke="#34d399" stroke-width="2"/>
            <text x="370" y="452" text-anchor="middle" font-size="12" font-weight="700" fill="#065f46">F(V2)</text>
            <text x="422" y="445" font-size="9" fill="#065f46">所属团长</text>
            <ellipse cx="370" cy="527" rx="44" ry="16" fill="#fef3c7" stroke="#fcd34d" stroke-width="1.5"/>
            <text x="370" y="532" text-anchor="middle" font-size="12" font-weight="700" fill="#92400e">G(V1)</text>
            <ellipse cx="370" cy="607" rx="44" ry="16" fill="#fef3c7" stroke="#fcd34d" stroke-width="1.5"/>
            <text x="370" y="612" text-anchor="middle" font-size="12" font-weight="700" fill="#92400e">H(V1)</text>
            <ellipse cx="370" cy="687" rx="36" ry="16" fill="#16a34a"/>
            <text x="370" y="692" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">出单</text>
            <!-- 用户关系（右） -->
            <path d="M414,527 L700,527" fill="none" stroke="#2563eb" stroke-width="2" stroke-dasharray="6,3" marker-end="url(#rm-mb)"/>
            <rect x="660" y="512" width="52" height="18" rx="4" fill="rgba(37,99,235,0.10)"/>
            <text x="686" y="525" text-anchor="middle" font-size="10" font-weight="600" fill="#2563eb">直邀</text>
            <path d="M420,447 L730,447 L730,513" fill="none" stroke="#7c3aed" stroke-width="2" stroke-dasharray="6,3" marker-end="url(#rm-mv)"/>
            <rect x="685" y="467" width="52" height="18" rx="4" fill="rgba(124,58,237,0.10)"/>
            <text x="711" y="480" text-anchor="middle" font-size="10" font-weight="600" fill="#7c3aed">间邀</text>
            <line x1="420" y1="367" x2="790" y2="367" stroke="#94a3b8" stroke-width="1" stroke-dasharray="3,2"/>
            <text x="506" y="362" font-size="10" fill="#94a3b8">E及以上无用户关系分佣 ↑</text>
            <!-- 团队关系（左） -->
            <path d="M326,367 L260,367 L260,432" fill="none" stroke="#0891b2" stroke-width="2" stroke-dasharray="6,3" marker-end="url(#rm-mt)"/>
            <rect x="225" y="387" width="44" height="18" rx="4" fill="rgba(8,145,178,0.10)"/>
            <text x="247" y="400" text-anchor="middle" font-size="10" font-weight="600" fill="#0891b2">直属团</text>
            <path d="M326,287 L230,287 L230,432" fill="none" stroke="#d97706" stroke-width="2" stroke-dasharray="6,3" marker-end="url(#rm-ma)"/>
            <rect x="190" y="347" width="44" height="18" rx="4" fill="rgba(217,119,6,0.10)"/>
            <text x="212" y="360" text-anchor="middle" font-size="10" font-weight="600" fill="#d97706">间属团</text>
            <line x1="180" y1="267" x2="326" y2="267" stroke="#94a3b8" stroke-width="1" stroke-dasharray="3,2"/>
            <text x="182" y="262" font-size="9" fill="#94a3b8">↑ V2同级截止</text>
            <path d="M326,207 L150,207 L150,432" fill="none" stroke="#dc2626" stroke-width="2.5" stroke-dasharray="6,3" marker-end="url(#rm-mr)"/>
            <rect x="100" y="307" width="52" height="18" rx="4" fill="rgba(220,38,38,0.10)"/>
            <text x="126" y="320" text-anchor="middle" font-size="10" font-weight="600" fill="#dc2626">无限团</text>
            <path d="M326,127 L100,127 L100,192" fill="none" stroke="#0891b2" stroke-width="2" stroke-dasharray="6,3" marker-end="url(#rm-mt)"/>
            <rect x="56" y="147" width="44" height="18" rx="4" fill="rgba(8,145,178,0.10)"/>
            <text x="78" y="160" text-anchor="middle" font-size="10" font-weight="600" fill="#0891b2">直属团</text>
            <path d="M326,47 L60,47 L60,112" fill="none" stroke="#d97706" stroke-width="2" stroke-dasharray="6,3" marker-end="url(#rm-ma)"/>
            <rect x="20" y="67" width="44" height="18" rx="4" fill="rgba(217,119,6,0.10)"/>
            <text x="42" y="80" text-anchor="middle" font-size="10" font-weight="600" fill="#d97706">间属团</text>
            <line x1="20" y1="25" x2="326" y2="25" stroke="#94a3b8" stroke-width="1" stroke-dasharray="3,2"/>
            <text x="22" y="21" font-size="9" fill="#94a3b8">↑ V3同级截止</text>
            <!-- 图例 -->
            <rect x="340" y="710" width="470" height="44" rx="6" fill="rgba(200,200,200,0.1)"/>
            <circle cx="355" cy="728" r="4" fill="#2563eb"/><text x="363" y="732" font-size="10" fill="#2563eb">直邀</text>
            <circle cx="395" cy="728" r="4" fill="#7c3aed"/><text x="403" y="732" font-size="10" fill="#7c3aed">间邀</text>
            <circle cx="435" cy="728" r="4" fill="#0891b2"/><text x="443" y="732" font-size="10" fill="#0891b2">直属团</text>
            <circle cx="487" cy="728" r="4" fill="#d97706"/><text x="495" y="732" font-size="10" fill="#d97706">间属团</text>
            <circle cx="541" cy="728" r="4" fill="#dc2626"/><text x="549" y="732" font-size="10" fill="#dc2626">无限团</text>
            <circle cx="597" cy="728" r="4" fill="#64748b"/><text x="605" y="732" font-size="10" fill="#64748b">邀请链</text>
            <text x="355" y="748" font-size="9" fill="#94a3b8">虚线 = 分佣流向；紫色 = 间邀示意（V2/V3 均可配间邀）</text>
          </svg>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button type="primary" @click="visible = false">我知道了</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { InfoFilled } from '@element-plus/icons-vue'

const visible = defineModel<boolean>('visible', { default: false })

// ===== 静态表格数据 =====
const overviewData = [
  { level: 'V1', userRule: '直邀 + 间邀（对下级 V1，无无限）', teamRule: '' },
  { level: 'V2', userRule: '对 V1：直+间+∞；对 V2：直+间（无无限）', teamRule: '直属团 + 间属团（同级无无限团）' },
  { level: 'V3', userRule: '对 V1：直+间+∞；对 V2/V3：直+间（无无限）', teamRule: '直属团 + 间属团 + 无限团（仅对下级 V2）' },
]

const userSceneData = [
  { level: 'V1', hasIndirect: true,  hasInfinite: true,  infiniteNote: 'V2/V3→V1', note: '邀请下级 V1：直+间+∞' },
  { level: 'V2', hasIndirect: true,  hasInfinite: false, infiniteNote: '',       note: 'V3 邀 V2：直+间' },
  { level: 'V3', hasIndirect: true,  hasInfinite: false, infiniteNote: '',       note: 'V3 邀 V3：直+间' },
]

const teamSceneData = [
  { level: 'V1', applicable: false, hasInfinite: false, infiniteNote: '', note: '' },
  { level: 'V2', applicable: true,  hasInfinite: true,  infiniteNote: 'V3>V2', note: '高等级对低等级团长，三项全配' },
  { level: 'V3', applicable: true,  hasInfinite: false, infiniteNote: '', note: '同等级团长，仅直属+间属' },
]
</script>

<style scoped>
.rule-dialog-header {
  display: flex; align-items: center; gap: 8px;
  font-size: 15px; font-weight: 700; color: var(--text-primary);
}

.rule-body { max-height: 68vh; overflow-y: auto; overflow-x: hidden; padding-right: 4px; }
.rule-body::-webkit-scrollbar { width: 4px; }
.rule-body::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

.rule-block { margin-bottom: 22px; }
.rule-block:last-child { margin-bottom: 0; }

.rule-block-title {
  display: flex; align-items: center; gap: 9px;
  font-size: 14px; font-weight: 700; color: var(--text-primary);
  margin-bottom: 10px;
}
.rule-num {
  width: 22px; height: 22px; border-radius: 50%;
  background: var(--primary); color: #fff;
  font-size: 11px; font-weight: 700;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}

.rule-alert { margin-bottom: 10px; font-size: 12.5px; }

.rule-scene-box {
  padding: 12px 14px; border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--surface-hover);
  margin-top: 10px; overflow: hidden;
}
.rule-scene-label {
  font-size: 11px; font-weight: 700; color: var(--text-muted);
  text-transform: uppercase; letter-spacing: 0.5px;
  margin-bottom: 8px;
}
.rule-footnote {
  margin: 10px 0 0;
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.55;
}

.rule-y  { color: var(--success); font-weight: 600; font-size: 12px; }
.rule-na { color: var(--text-muted); font-size: 12px; }

/* 链路图 */
.chain-flow {
  display: flex; flex-wrap: wrap; align-items: center; gap: 5px;
  margin-bottom: 10px; padding: 8px 0;
}
.cn {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 4px 10px; border-radius: 20px;
  font-size: 12px; font-weight: 700; border: 2px solid;
}
.cn-v1    { background: #fef3c7; color: #92400e; border-color: #fcd34d; }
.cn-v2    { background: #d1fae5; color: #065f46; border-color: #6ee7b7; }
.cn-v2-hl { background: #bbf7d0; color: #065f46; border-color: #34d399; }
.cn-v3    { background: #dbeafe; color: #1e40af; border-color: #93c5fd; }
.cn-me    { background: var(--surface-hover); color: var(--text-muted); border-color: var(--border); font-style: italic; opacity: .6; }
.cn-order { background: #16a34a; color: #fff; border-color: #15803d; }
.cn-arr   { color: var(--text-muted); font-size: 14px; font-weight: 700; }
.ann-list { display: flex; flex-direction: column; gap: 5px; }
.ann-row  { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-secondary); }
.ann-dot  { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

/* 等级 tag（继承全局，scoped 内重声明确保优先级） */
.lv-tag {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 2px 9px; border-radius: 4px;
  font-size: 11px; font-weight: 700; white-space: nowrap;
  border: 1px solid transparent;
}
.lv-tag.lv-sm { padding: 1px 6px; font-size: 10px; }
.lv-v1 { background: linear-gradient(135deg,#fef3c7,#fde68a); color: #92400e; border-color: #fcd34d; }
.lv-v2 { background: linear-gradient(135deg,#d1fae5,#a7f3d0); color: #065f46; border-color: #6ee7b7; }
.lv-v3 { background: linear-gradient(135deg,#dbeafe,#bfdbfe); color: #1e40af; border-color: #93c5fd; }
.lv-v4 { background: linear-gradient(135deg,#ede9fe,#ddd6fe); color: #5b21b6; border-color: #c4b5fd; }
.lv-v5 { background: linear-gradient(135deg,#fce7f3,#fbcfe8); color: #9d174d; border-color: #f9a8d4; }

:deep(.rule-el-table) { font-size: 12.5px; }
:deep(.rule-el-table .el-table__cell) { padding: 7px 10px; }
</style>
