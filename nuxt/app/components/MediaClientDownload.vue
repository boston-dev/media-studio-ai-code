<!-- components/MediaClientDownload.vue -->
<template>
  <section class="mb-1 rounded-2xl border border-slate-200 bg-slate-50/70 p-6 md:p-8">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <!-- 左侧文案 -->
      <div class="space-y-3">
        <h2 class="text-xl font-semibold text-slate-900">
          下载 Media Studio AI 客户端（推荐）
        </h2>
        <p class="text-sm leading-relaxed text-slate-600">
          由于浏览器存在跨域、文件大小限制、标签页关闭即中断下载等问题，
          我们<strong class="font-semibold text-slate-900">更推荐使用桌面客户端</strong>：
          所有操作在本地完成，下载更稳定、更高速，同时不上传你的视频内容。
        </p>

        <ul class="list-disc pl-5 text-sm text-slate-600 space-y-1">
          <li>支持长时间下载，不怕误关浏览器页面</li>
          <li>多线程下载与重试机制，失败自动重试</li>
          <li>本地解析 M3U8、合并 TS 为 MP4，不经任何云端</li>
          <li>后续将集成更多 AI 媒体工具，一次安装长期使用</li>
        </ul>

        <p class="text-xs text-slate-500">
          当前版本：<span class="font-semibold">{{ version }}</span> ·
          当前平台：<span class="font-semibold">{{ platformText }}</span>
          <span v-if="extraNote"> · {{ extraNote }}</span>
        </p>
      </div>

      <!-- 右侧按钮 -->
      <div class="mt-4 flex flex-col items-start gap-3 md:mt-0 md:items-end">
        <a
          :href="downloadUrl"
          download
          class="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium
                 bg-blue-600 text-white shadow hover:bg-blue-700 active:bg-blue-800
                 transition-colors"
        >
          ⬇ 立即下载 Windows 客户端 (.exe)
        </a>

        <p class="text-xs text-slate-500 max-w-xs text-left md:text-right">
          目前提供 Windows 10 / 11 版本，后续将陆续适配 macOS / Linux。
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  downloadUrl: string
  version?: string
  platformText?: string
  extraNote?: string
}

const props = withDefaults(defineProps<Props>(), {
  version: 'v1.0.2',
  platformText: 'Windows 10 / 11（64 位）',
  extraNote: ''
})
</script>
