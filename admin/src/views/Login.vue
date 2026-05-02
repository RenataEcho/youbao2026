<template>
  <div class="login-root" :data-theme="themeStore.theme">
    <!-- 背景场景 -->
    <div class="bg-scene">
      <div class="bg-orb bg-orb-1"></div>
      <div class="bg-orb bg-orb-2"></div>
      <div class="bg-orb bg-orb-3"></div>
      <div v-for="p in particles" :key="p.id" class="particle" :style="p.style"></div>
    </div>

    <!-- 左侧插画区 -->
    <div class="illustration-panel">
      <div class="illus-wrap">
        <svg class="illus-main" viewBox="0 0 420 380" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="30" width="380" height="320" rx="24" fill="url(#card_grad)" opacity="0.13"/>
          <ellipse cx="210" cy="340" rx="170" ry="22" fill="url(#shadow_grad)" opacity="0.18"/>
          <rect x="60" y="60" width="300" height="200" rx="14" fill="url(#screen_grad)" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>
          <rect x="74" y="74" width="272" height="172" rx="8" fill="rgba(255,255,255,0.92)"/>
          <rect x="84" y="84" width="252" height="100" rx="6" fill="rgba(37,99,235,0.05)"/>
          <polyline points="94,168 118,148 142,155 166,132 190,140 214,118 238,126 262,108 286,116 320,100" stroke="url(#line_grad1)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          <polyline points="94,172 118,165 142,170 166,158 190,163 214,150 238,157 262,144 286,152 320,140" stroke="url(#line_grad2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke-dasharray="4 3"/>
          <circle cx="190" cy="140" r="3.5" fill="#2563eb"/>
          <circle cx="214" cy="118" r="3.5" fill="#7c3aed"/>
          <circle cx="262" cy="108" r="3.5" fill="#0891b2"/>
          <rect x="84" y="192" width="76" height="48" rx="6" fill="rgba(37,99,235,0.08)"/>
          <rect x="88" y="197" width="30" height="8" rx="3" fill="rgba(37,99,235,0.4)"/>
          <rect x="88" y="210" width="50" height="14" rx="4" fill="rgba(37,99,235,0.6)"/>
          <rect x="88" y="228" width="40" height="6" rx="3" fill="rgba(16,185,129,0.5)"/>
          <rect x="168" y="192" width="76" height="48" rx="6" fill="rgba(124,58,237,0.08)"/>
          <rect x="172" y="197" width="30" height="8" rx="3" fill="rgba(124,58,237,0.4)"/>
          <rect x="172" y="210" width="50" height="14" rx="4" fill="rgba(124,58,237,0.6)"/>
          <rect x="172" y="228" width="40" height="6" rx="3" fill="rgba(239,68,68,0.4)"/>
          <rect x="252" y="192" width="76" height="48" rx="6" fill="rgba(8,145,178,0.08)"/>
          <rect x="256" y="197" width="30" height="8" rx="3" fill="rgba(8,145,178,0.4)"/>
          <rect x="256" y="210" width="50" height="14" rx="4" fill="rgba(8,145,178,0.6)"/>
          <rect x="256" y="228" width="40" height="6" rx="3" fill="rgba(217,119,6,0.5)"/>
          <circle cx="100" cy="84" r="4" fill="rgba(37,99,235,0.25)"/>
          <circle cx="113" cy="84" r="4" fill="rgba(16,185,129,0.25)"/>
          <circle cx="126" cy="84" r="4" fill="rgba(239,68,68,0.25)"/>
          <rect x="140" y="80" width="60" height="8" rx="3" fill="rgba(37,99,235,0.12)"/>
          <rect x="190" y="260" width="40" height="18" rx="3" fill="rgba(99,102,241,0.3)"/>
          <rect x="165" y="276" width="90" height="10" rx="5" fill="rgba(99,102,241,0.25)"/>
          <!-- 齿轮 -->
          <g class="illus-gear">
            <circle cx="44" cy="214" r="14" stroke="rgba(99,102,241,0.35)" stroke-width="3" fill="rgba(99,102,241,0.06)"/>
            <circle cx="44" cy="214" r="6" fill="rgba(99,102,241,0.2)"/>
            <line x1="44" y1="196" x2="44" y2="202" stroke="rgba(99,102,241,0.35)" stroke-width="3" stroke-linecap="round"/>
            <line x1="44" y1="226" x2="44" y2="232" stroke="rgba(99,102,241,0.35)" stroke-width="3" stroke-linecap="round"/>
            <line x1="26" y1="214" x2="32" y2="214" stroke="rgba(99,102,241,0.35)" stroke-width="3" stroke-linecap="round"/>
            <line x1="56" y1="214" x2="62" y2="214" stroke="rgba(99,102,241,0.35)" stroke-width="3" stroke-linecap="round"/>
          </g>
          <!-- 信封 -->
          <g class="illus-float1" opacity="0.75">
            <rect x="348" y="60" width="40" height="30" rx="5" fill="rgba(255,255,255,0.8)" stroke="rgba(37,99,235,0.3)" stroke-width="1.5"/>
            <polyline points="348,63 368,78 388,63" stroke="rgba(37,99,235,0.4)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          </g>
          <!-- 柱状图 -->
          <g class="illus-float2" opacity="0.8">
            <rect x="363" y="175" width="8" height="18" rx="2" fill="rgba(37,99,235,0.5)"/>
            <rect x="374" y="167" width="8" height="26" rx="2" fill="rgba(124,58,237,0.5)"/>
            <rect x="385" y="171" width="8" height="22" rx="2" fill="rgba(8,145,178,0.5)"/>
          </g>
          <!-- 星星 -->
          <g opacity="0.6">
            <circle cx="350" cy="260" r="3" fill="rgba(217,119,6,0.7)" class="illus-twinkle1"/>
            <circle cx="40" cy="130" r="2.5" fill="rgba(124,58,237,0.6)" class="illus-twinkle2"/>
            <circle cx="390" cy="310" r="2" fill="rgba(37,99,235,0.6)" class="illus-twinkle3"/>
            <circle cx="25" cy="290" r="2" fill="rgba(16,185,129,0.5)" class="illus-twinkle1"/>
          </g>
          <defs>
            <linearGradient id="card_grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#2563eb"/><stop offset="100%" stop-color="#7c3aed"/>
            </linearGradient>
            <linearGradient id="shadow_grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="transparent"/><stop offset="50%" stop-color="#6366f1"/><stop offset="100%" stop-color="transparent"/>
            </linearGradient>
            <linearGradient id="screen_grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#ede9fe"/>
            </linearGradient>
            <linearGradient id="line_grad1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#2563eb"/><stop offset="100%" stop-color="#7c3aed"/>
            </linearGradient>
            <linearGradient id="line_grad2" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#0891b2"/><stop offset="100%" stop-color="#16a34a"/>
            </linearGradient>
          </defs>
        </svg>
        <!-- 装饰徽章 -->
        <div class="illus-badge illus-badge-1">
          <div class="badge-dot-green"></div>
          <span>系统运行正常</span>
        </div>
        <div class="illus-badge illus-badge-2">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span>数据安全加密保护</span>
        </div>
        <div class="illus-badge illus-badge-3">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0891b2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <span>多重身份验证</span>
        </div>
      </div>
    </div>

    <!-- 主题切换 -->
    <button class="theme-toggle" title="切换主题" @click="themeStore.toggle()">
      <svg class="icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
      <svg class="icon-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
    </button>

    <!-- 登录卡片 -->
    <div class="login-wrap">
      <div class="login-card">
        <!-- Logo -->
        <div class="login-logo">
          <div class="logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          <div class="logo-text">
            <span class="logo-name">右豹管理后台</span>
            <span class="logo-sub">YouBao Admin System</span>
          </div>
        </div>

        <h1 class="login-title">欢迎回来</h1>
        <p class="login-desc">请使用管理员账号登录</p>

        <form @submit.prevent="handleLogin">
          <!-- 账号 -->
          <div class="form-group">
            <label class="form-label">
              <span>账号</span><span class="required">*</span>
            </label>
            <div class="input-wrap">
              <span class="input-prefix">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <input
                v-model="form.username"
                type="text"
                class="form-input"
                :class="{ error: errors.username }"
                placeholder="请输入账号"
                autocomplete="username"
                @blur="errors.username = ''"
              >
            </div>
            <div v-if="errors.username" class="error-msg">{{ errors.username }}</div>
          </div>

          <!-- 密码 -->
          <div class="form-group">
            <label class="form-label">
              <span>密码</span><span class="required">*</span>
            </label>
            <div class="input-wrap">
              <span class="input-prefix">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                v-model="form.password"
                :type="pwdVisible ? 'text' : 'password'"
                class="form-input"
                :class="{ error: errors.password }"
                placeholder="请输入密码"
                autocomplete="current-password"
                style="padding-right: 38px"
                @blur="errors.password = ''"
              >
              <button type="button" class="form-input-suffix" title="显示/隐藏密码" @click="pwdVisible = !pwdVisible">
                <svg v-if="!pwdVisible" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
                <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
            </div>
            <div v-if="errors.password" class="error-msg">{{ errors.password }}</div>
          </div>

          <!-- 验证码 -->
          <div class="form-group">
            <label class="form-label">
              <span>验证码</span><span class="required">*</span>
            </label>
            <div class="captcha-row">
              <div class="input-wrap" style="flex:1">
                <span class="input-prefix">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </span>
                <input
                  v-model="form.captcha"
                  type="text"
                  class="form-input"
                  :class="{ error: errors.captcha }"
                  placeholder="请输入验证码"
                  maxlength="4"
                  @blur="errors.captcha = ''"
                >
              </div>
              <div class="captcha-img" title="点击刷新验证码" @click="refreshCaptcha">{{ captchaCode }}</div>
            </div>
            <div v-if="errors.captcha" class="error-msg">{{ errors.captcha }}</div>
          </div>

          <!-- 记住/忘记 -->
          <div class="form-extra">
            <label class="checkbox-wrap">
              <input v-model="form.remember" type="checkbox">
              <span class="checkbox-label">记住登录状态</span>
            </label>
            <a href="#" class="forget-link" @click.prevent>忘记密码？</a>
          </div>

          <!-- 登录按钮 -->
          <button type="submit" class="btn-login" :class="{ loading: loading }" :disabled="loading">
            <span v-if="loading" class="spinner">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M21 12a9 9 0 1 1-6.22-8.56"/>
              </svg>
            </span>
            <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            {{ loading ? '验证中...' : '登 录' }}
          </button>
        </form>

        <div class="login-divider">安全认证</div>

        <div class="login-footer">
          © 2026 右豹科技 · 管理后台系统 v2.0<br>
          仅限授权管理人员使用，请妥善保管账号密码
        </div>
      </div>
    </div>

    <!-- 欢迎提示 -->
    <div class="welcome-toast" :class="{ show: showWelcome }">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      验证通过，正在进入系统
    </div>

    <!-- 全屏加载遮罩 -->
    <div class="page-loader" :class="{ active: showLoader }">
      <div class="loader-logo">
        <div class="loader-logo-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
        </div>
        <div class="loader-logo-text">
          <span class="loader-logo-name">右豹管理后台</span>
          <span class="loader-logo-sub">YouBao Admin System</span>
        </div>
      </div>
      <div class="loader-bar-wrap">
        <div class="loader-bar" :class="{ run: showLoader }"></div>
      </div>
      <div class="loader-tip">{{ loaderTip }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'

const router = useRouter()
const themeStore = useThemeStore()

// 粒子
interface Particle { id: number; style: string }
const particles = ref<Particle[]>([])
const COLORS = [
  'rgba(99,102,241,0.5)', 'rgba(37,99,235,0.5)', 'rgba(14,165,233,0.5)',
  'rgba(16,185,129,0.4)', 'rgba(124,58,237,0.4)', 'rgba(217,119,6,0.4)',
]
function createParticles() {
  const arr: Particle[] = []
  for (let i = 0; i < 22; i++) {
    const size = 3 + Math.random() * 6
    arr.push({
      id: i,
      style: `width:${size}px;height:${size}px;left:${Math.random()*100}%;top:${20+Math.random()*70}%;background:${COLORS[Math.floor(Math.random()*COLORS.length)]};--dur:${4+Math.random()*6}s;--delay:${Math.random()*6}s;`,
    })
  }
  particles.value = arr
}

// 验证码
const CAPS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const captchaCode = ref('')
function refreshCaptcha() {
  let code = ''
  for (let i = 0; i < 4; i++) code += CAPS[Math.floor(Math.random() * CAPS.length)]
  captchaCode.value = code
}

// 表单
const pwdVisible = ref(false)
const loading = ref(false)
const showWelcome = ref(false)
const showLoader = ref(false)
const loaderTip = ref('正在加载工作台...')

const form = reactive({ username: 'admin', password: '123456', captcha: '', remember: true })
const errors = reactive({ username: '', password: '', captcha: '' })

async function handleLogin() {
  errors.username = ''
  errors.password = ''
  errors.captcha = ''
  let valid = true

  if (!form.username.trim()) { errors.username = '请输入账号'; valid = false }
  if (!form.password) { errors.password = '请输入密码'; valid = false }
  if (!form.captcha) {
    errors.captcha = '请输入验证码'; valid = false
  } else if (form.captcha.toUpperCase() !== captchaCode.value) {
    errors.captcha = '验证码错误，请重新输入'; valid = false
    refreshCaptcha()
  }
  if (!valid) return

  loading.value = true
  localStorage.setItem('loginUser', form.username || '管理员')

  setTimeout(() => {
    loading.value = false
    showWelcome.value = true

    setTimeout(() => {
      showLoader.value = true
      const tips = ['正在加载工作台...', '获取数据中...', '初始化看板...', '即将完成...']
      let idx = 0
      const timer = setInterval(() => {
        idx = (idx + 1) % tips.length
        loaderTip.value = tips[idx]
      }, 400)

      setTimeout(() => {
        clearInterval(timer)
        router.push('/')
      }, 1800)
    }, 400)
  }, 600)
}

onMounted(() => {
  themeStore.init()
  createParticles()
  refreshCaptcha()
})
</script>

<style scoped>
/* 继承全局 CSS 变量，所有色值从变量取 */
.login-root {
  min-height: 100vh;
  font-family: 'PingFang SC', 'Microsoft YaHei', 'Segoe UI', -apple-system, sans-serif;
  overflow: hidden;
  position: relative;
}

/* ===== 背景 ===== */
.bg-scene {
  position: fixed; inset: 0; z-index: 0;
  background: linear-gradient(135deg, #dbeafe 0%, #ede9fe 35%, #e0f2fe 65%, #d1fae5 100%);
  overflow: hidden;
}
[data-theme="dark"] .bg-scene {
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 45%, #0c1a2e 100%);
}

.bg-orb {
  position: absolute; border-radius: 50%;
  pointer-events: none; filter: blur(60px);
}
.bg-orb-1 {
  width: 700px; height: 700px; top: -200px; left: -150px;
  background: radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%);
  animation: orbDrift1 18s ease-in-out infinite;
}
.bg-orb-2 {
  width: 600px; height: 600px; bottom: -180px; right: -100px;
  background: radial-gradient(circle, rgba(14,165,233,0.16) 0%, transparent 70%);
  animation: orbDrift2 22s ease-in-out infinite;
}
.bg-orb-3 {
  width: 400px; height: 400px; top: 40%; left: 55%;
  background: radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 70%);
  animation: orbDrift3 26s ease-in-out infinite;
}
[data-theme="dark"] .bg-orb-1 { background: radial-gradient(circle, rgba(99,102,241,0.30) 0%, transparent 70%); }
[data-theme="dark"] .bg-orb-2 { background: radial-gradient(circle, rgba(14,165,233,0.24) 0%, transparent 70%); }
[data-theme="dark"] .bg-orb-3 { background: radial-gradient(circle, rgba(16,185,129,0.16) 0%, transparent 70%); }

@keyframes orbDrift1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(40px,-30px) scale(1.05)} 66%{transform:translate(-20px,40px) scale(0.96)} }
@keyframes orbDrift2 { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(-50px,30px) scale(1.08)} 70%{transform:translate(30px,-40px) scale(0.94)} }
@keyframes orbDrift3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-30px,-50px) scale(1.12)} }

.particle {
  position: absolute; border-radius: 50%;
  pointer-events: none; opacity: 0;
  animation: particleFly var(--dur) var(--delay) ease-in-out infinite;
}
@keyframes particleFly { 0%{opacity:0;transform:translateY(0) scale(0.4)} 20%{opacity:0.6} 80%{opacity:0.3} 100%{opacity:0;transform:translateY(-120px) scale(1)} }

/* ===== 左侧插画 ===== */
.illustration-panel {
  position: fixed; left: 0; top: 0; bottom: 0; width: 52%;
  display: flex; align-items: center; justify-content: center;
  z-index: 1; pointer-events: none;
}
@media (max-width: 900px) { .illustration-panel { display: none; } }

.illus-wrap { position: relative; width: 420px; height: 380px; }

.illus-main {
  width: 100%; height: 100%;
  animation: illusFloat 6s ease-in-out infinite;
  filter: drop-shadow(0 24px 48px rgba(37,99,235,0.15));
}
@keyframes illusFloat { 0%,100%{transform:translateY(0px) rotate(0deg)} 50%{transform:translateY(-18px) rotate(1deg)} }

.illus-gear { transform-origin: 44px 214px; animation: gearSpin 8s linear infinite; }
@keyframes gearSpin { to { transform: rotate(360deg); } }
.illus-float1 { transform-origin: 368px 80px; animation: floatY 4s 1s ease-in-out infinite; }
.illus-float2 { transform-origin: 380px 185px; animation: floatY 5s 0.5s ease-in-out infinite; }
@keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
.illus-twinkle1 { animation: twinkle 2s ease-in-out infinite; }
.illus-twinkle2 { animation: twinkle 2.5s 0.5s ease-in-out infinite; }
.illus-twinkle3 { animation: twinkle 3s 1s ease-in-out infinite; }
@keyframes twinkle { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.3)} }

.illus-badge {
  position: absolute;
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.7);
  border-radius: 12px; padding: 8px 14px;
  font-size: 12px; font-weight: 600;
  color: #18222f;
  box-shadow: 0 4px 16px rgba(30,40,60,0.10);
  display: flex; align-items: center; gap: 7px;
  white-space: nowrap;
  animation: badgePop 0.6s cubic-bezier(.34,1.56,.64,1) forwards;
  opacity: 0;
}
[data-theme="dark"] .illus-badge { background: rgba(30,41,59,0.90); border-color: rgba(255,255,255,0.10); color: #f1f5f9; }
.illus-badge-1 { top: 18px; left: 24px; animation-delay: 0.8s; }
.illus-badge-2 { bottom: 55px; left: 10px; animation-delay: 1.1s; }
.illus-badge-3 { top: 44%; right: -8px; animation-delay: 1.4s; }
@keyframes badgePop { from{opacity:0;transform:scale(0.8) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
.badge-dot-green { width:8px;height:8px;border-radius:50%;background:#16a34a;flex-shrink:0; }

/* ===== 主题切换按钮 ===== */
.theme-toggle {
  position: fixed; top: 20px; right: 20px; z-index: 100;
  width: 36px; height: 36px; border-radius: 50%;
  background: rgba(255,255,255,0.75);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.6);
  box-shadow: 0 2px 8px rgba(30,40,60,0.12);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.16s ease; color: #4a5568;
}
[data-theme="dark"] .theme-toggle { background: rgba(30,41,59,0.75); border-color: rgba(255,255,255,0.1); color: #94a3b8; }
.theme-toggle:hover { transform: scale(1.08); box-shadow: 0 4px 12px rgba(30,40,60,0.18); }
.icon-sun { display: none; }
[data-theme="dark"] .icon-moon { display: none; }
[data-theme="dark"] .icon-sun { display: block; }

/* ===== 登录卡片 ===== */
.login-wrap {
  position: relative; z-index: 2;
  height: 100vh; display: flex; align-items: center;
  justify-content: flex-end;
  padding: 24px max(24px, calc(50vw - 660px)) 24px 24px;
}
@media (max-width: 900px) { .login-wrap { justify-content: center; padding: 24px; } }

.login-card {
  width: 100%; max-width: 420px;
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255,255,255,0.7);
  box-shadow: 0 8px 40px rgba(30,40,80,0.13), inset 0 1px 0 rgba(255,255,255,0.95);
  border-radius: 20px; padding: 40px 36px;
  animation: cardIn 0.7s cubic-bezier(.22,.68,0,1.2) both;
}
@keyframes cardIn { from{opacity:0;transform:translateY(24px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
[data-theme="dark"] .login-card {
  background: rgba(30,41,59,0.80);
  backdrop-filter: blur(24px) saturate(160%);
  border: 1px solid rgba(255,255,255,0.09);
  box-shadow: 0 8px 40px rgba(0,0,0,0.50), inset 0 1px 0 rgba(255,255,255,0.06);
}

.login-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 28px; }
.logo-icon {
  width: 40px; height: 40px; border-radius: 10px;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; color: #fff;
  box-shadow: 0 4px 12px rgba(37,99,235,0.35);
}
.logo-text { display: flex; flex-direction: column; }
.logo-name { font-size: 17px; font-weight: 700; color: #18222f; line-height: 1.2; }
[data-theme="dark"] .logo-name { color: #f1f5f9; }
.logo-sub { font-size: 11px; color: #9aa5b4; margin-top: 2px; }

.login-title { font-size: 22px; font-weight: 700; color: #18222f; margin-bottom: 6px; }
[data-theme="dark"] .login-title { color: #f1f5f9; }
.login-desc { font-size: 13px; color: #9aa5b4; margin-bottom: 28px; }

.form-group { margin-bottom: 16px; }
.form-label { display: flex; align-items: center; gap: 5px; font-size: 13px; font-weight: 500; color: #4a5568; margin-bottom: 6px; }
[data-theme="dark"] .form-label { color: #94a3b8; }
.required { color: #dc2626; }

.input-wrap { position: relative; }
.input-prefix { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: #9aa5b4; display: flex; align-items: center; }
.form-input {
  width: 100%; height: 40px; padding: 0 12px 0 38px;
  font-size: 13px; font-family: inherit; color: #18222f;
  background: #ffffff; border: 1px solid #e8edf3;
  border-radius: 8px; outline: none; transition: all 0.16s ease;
}
[data-theme="dark"] .form-input { background: #1e293b; border-color: #334155; color: #f1f5f9; }
.form-input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.12); }
.form-input.error { border-color: #dc2626; }
.form-input::placeholder { color: #9aa5b4; }
.form-input-suffix { position: absolute; right: 11px; top: 50%; transform: translateY(-50%); color: #9aa5b4; cursor: pointer; background: none; border: none; padding: 0; display: flex; align-items: center; transition: all 0.16s ease; }
.form-input-suffix:hover { color: #4a5568; }
.error-msg { margin-top: 5px; font-size: 11px; color: #dc2626; }

.captcha-row { display: flex; gap: 10px; }
.captcha-row .input-wrap { flex: 1; }
.captcha-img {
  width: 110px; height: 40px; border-radius: 8px;
  border: 1px solid #e8edf3;
  background: linear-gradient(135deg, #dbeafe, #ede9fe);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; font-weight: 700; letter-spacing: 6px;
  color: #2563eb; flex-shrink: 0; user-select: none;
  font-family: 'SFMono-Regular', 'Consolas', monospace;
  position: relative; overflow: hidden;
}
.captcha-img::after { content:'';position:absolute;inset:0;background:repeating-linear-gradient(45deg,transparent,transparent 3px,rgba(99,102,241,0.05) 3px,rgba(99,102,241,0.05) 4px); }

.form-extra { display: flex; align-items: center; justify-content: space-between; margin: 4px 0 20px; }
.checkbox-wrap { display: flex; align-items: center; gap: 6px; cursor: pointer; user-select: none; }
.checkbox-wrap input[type="checkbox"] { width: 15px; height: 15px; accent-color: #2563eb; cursor: pointer; }
.checkbox-label { font-size: 12px; color: #4a5568; }
[data-theme="dark"] .checkbox-label { color: #94a3b8; }
.forget-link { font-size: 12px; color: #2563eb; text-decoration: none; transition: all 0.16s ease; }
.forget-link:hover { color: #1d4ed8; }

.btn-login {
  width: 100%; height: 42px;
  background: linear-gradient(135deg, #2563eb, #4f46e5);
  color: #fff; border: none; border-radius: 8px;
  font-size: 14px; font-weight: 600; font-family: inherit;
  cursor: pointer; transition: all 0.2s ease;
  display: flex; align-items: center; justify-content: center; gap: 6px;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 14px rgba(37,99,235,0.35);
}
.btn-login:hover { background: linear-gradient(135deg, #1d4ed8, #4338ca); box-shadow: 0 6px 20px rgba(37,99,235,0.45); transform: translateY(-1px); }
.btn-login:active { transform: translateY(1px); box-shadow: 0 2px 8px rgba(37,99,235,0.25); }
.btn-login.loading { opacity: 0.75; cursor: not-allowed; transform: none; }

.login-divider { display: flex; align-items: center; gap: 12px; margin: 22px 0; color: #9aa5b4; font-size: 12px; }
.login-divider::before, .login-divider::after { content: ''; flex: 1; height: 1px; background: #e8edf3; }
[data-theme="dark"] .login-divider::before, [data-theme="dark"] .login-divider::after { background: #334155; }

.login-footer { margin-top: 24px; text-align: center; font-size: 11px; color: #9aa5b4; line-height: 1.6; }

/* ===== spinner ===== */
.spinner { animation: spin 0.8s linear infinite; display: inline-flex; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ===== 欢迎提示 ===== */
.welcome-toast {
  position: fixed; top: 28px; left: 50%;
  transform: translateX(-50%) translateY(-20px);
  z-index: 9998;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(37,99,235,0.15);
  border-radius: 99px; padding: 10px 20px;
  font-size: 13px; font-weight: 500; color: #2563eb;
  box-shadow: 0 4px 20px rgba(37,99,235,0.15);
  display: flex; align-items: center; gap: 8px;
  opacity: 0; pointer-events: none;
  transition: all 0.4s cubic-bezier(.34,1.56,.64,1);
}
[data-theme="dark"] .welcome-toast { background: rgba(30,41,59,0.92); }
.welcome-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

/* ===== 全屏加载遮罩 ===== */
.page-loader {
  position: fixed; inset: 0; z-index: 9999;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px;
  background: linear-gradient(135deg, #dbeafe 0%, #ede9fe 40%, #e0f2fe 100%);
  opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
}
[data-theme="dark"] .page-loader { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0c1a2e 100%); }
.page-loader.active { opacity: 1; pointer-events: all; }

.loader-logo { display: flex; align-items: center; gap: 12px; animation: loaderLogoIn 0.5s 0.1s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes loaderLogoIn { from{opacity:0;transform:scale(0.7)} to{opacity:1;transform:scale(1)} }
.loader-logo-icon { width: 52px; height: 52px; border-radius: 14px; background: linear-gradient(135deg, #2563eb, #7c3aed); display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 28px rgba(37,99,235,0.4); color: #fff; }
.loader-logo-text { display: flex; flex-direction: column; }
.loader-logo-name { font-size: 22px; font-weight: 700; color: #18222f; }
[data-theme="dark"] .loader-logo-name { color: #f1f5f9; }
.loader-logo-sub { font-size: 12px; color: #9aa5b4; }

.loader-bar-wrap { width: 200px; background: rgba(255,255,255,0.4); border-radius: 99px; height: 4px; overflow: hidden; }
.loader-bar { height: 100%; background: linear-gradient(90deg, #2563eb, #7c3aed, #06b6d4); border-radius: 99px; width: 0%; }
.loader-bar.run { animation: loaderProgress 1.4s 0.4s cubic-bezier(.4,0,.2,1) forwards; }
@keyframes loaderProgress { 0%{width:0%} 40%{width:55%} 70%{width:75%} 90%{width:88%} 100%{width:100%} }

.loader-tip { font-size: 13px; color: #9aa5b4; }

@media (max-width: 480px) { .login-card { padding: 28px 20px; } }
</style>
