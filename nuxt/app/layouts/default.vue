<template>
  <div class="app-container select-none">
    <!-- 结构示例 -->
    <!-- <header class="nav">
      <div class="nav__inner">
        <a class="nav__logo" href="/">一級導航</a>

        <nav class="nav__scroller" aria-label="主导航">
          <ul class="nav__list">
            <li><a class="nav__item is-active" href="#mobile">移动端优先</a></li>
            <li><a class="nav__item" href="#jsx">无 JSX</a></li>
            <li><a class="nav__item" href="#biz">可商用二开</a></li>
            <li><a class="nav__item" href="#old">老照片修复</a></li>
            <li><a class="nav__item" href="#id">证件照换底</a></li>
            <li><a class="nav__item" href="#ocr">图片转文字+翻译</a></li>
          </ul>
          <span class="nav__indicator"></span>
        </nav>
      </div>
    </header> -->

    <!-- 标签切换 -->
    <nav class="grid grid-cols-24 gap-2 mb-4">
      <RouterLink class="btn btn-ghost text-sm" :class="is('/')" to="/">M3U8 提取下载</RouterLink>
      <RouterLink class="btn btn-ghost text-sm" :class="is('/privacy')" to="/privacy">隐私政策</RouterLink>
      <!-- <RouterLink class="btn btn-ghost text-sm" :class="is('/')" to="/">图片提取文字</RouterLink> -->
      <!-- <RouterLink class="btn btn-ghost text-sm" :class="is('/restore')" to="/restore">老照片修复</RouterLink>
      <RouterLink class="btn btn-ghost text-sm" :class="is('/idphoto')" to="/idphoto">证件照换底</RouterLink> -->

    </nav>

    <!-- 路由视图 -->
    <slot />

    <!-- 底部区 -->
    <footer class="text-center text-xs text-gray-500 mt-10">
      © {{ year }} AI Tools · Vue3 模板（可商用二开）
    </footer>

  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const year = new Date().getFullYear()
const is = (p) => route.path === p ? 'bg-black text-white' : 'bg-white'


</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .2s
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0
}

/* ========== 基础变量 ========== */
:root {
  --nav-h: 52px;
  --nav-bg: rgba(255, 255, 255, 0.85);
  --nav-text: #1f2328;
  --nav-muted: #8a8f98;
  --nav-accent: #2563eb;
  /* 主色：自行替换 */
  --nav-border: #e5e7eb;
  --nav-radius: 12px;
  --nav-shadow: 0 6px 20px rgba(0, 0, 0, .06);
}

@media (prefers-color-scheme: dark) {
  :root {
    --nav-bg: rgba(20, 20, 22, 0.75);
    --nav-text: #e9edf1;
    --nav-muted: #9aa3ad;
    --nav-border: #2a2d33;
    --nav-shadow: 0 6px 20px rgba(0, 0, 0, .35);
  }
}

/* ========== 容器 ========== */
.nav {
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(8px);
  background: var(--nav-bg);
  border-bottom: 1px solid var(--nav-border);
}

.nav__inner {
  max-width: 1200px;
  margin: env(safe-area-inset-top) auto 0 auto;
  padding: 8px 12px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: center;
}

/* ========== LOGO/标题 ========== */
.nav__logo {
  font-size: 18px;
  font-weight: 700;
  color: var(--nav-text);
  text-decoration: none;
  padding: 6px 10px;
  border-radius: 8px;
}

/* ========== 滚动导航 ========== */
.nav__scroller {
  position: relative;
  overflow: hidden;
  height: var(--nav-h);
  border-radius: var(--nav-radius);
  background: transparent;
}

.nav__list {
  list-style: none;
  margin: 0;
  padding: 0 6px;
  display: flex;
  align-items: center;
  gap: 4px;
  height: 100%;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scrollbar-width: none;
  /* firefox */
}

.nav__list::-webkit-scrollbar {
  display: none;
}

/* webkit */

/* ========== 导航项 ========== */
.nav__item {
  --pad-x: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: calc(var(--nav-h) - 10px);
  padding: 0 var(--pad-x);
  border-radius: 10px;
  color: var(--nav-muted);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  transition: color .2s ease, background .2s ease, transform .1s ease;
}

.nav__item:hover {
  color: var(--nav-text);
}

.nav__item:active {
  transform: translateY(1px);
}

.nav__item.is-active {
  color: var(--nav-accent);
}

/* ========== 指示条（自动贴合 active 项） ========== */
.nav__indicator {
  position: absolute;
  bottom: 6px;
  height: 3px;
  background: var(--nav-accent);
  border-radius: 999px;
  left: 12px;
  width: 0;
  transition: left .25s ease, width .25s ease, transform .25s ease;
  box-shadow: 0 2px 8px rgba(37, 99, 235, .35);
  pointer-events: none;
}

/* ========== 辅助：在页面加载后用 JS 同步指示条位置 ========== */
/* 可选：若不写 JS，也可以仅靠 .is-active 的下边框高亮 */
</style>
