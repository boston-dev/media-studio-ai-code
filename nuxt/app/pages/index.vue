<template>
  <MediaClientDownload 
  :downloadUrl="downloadUrl"

  />
  <div class="w-full min-h-[520px] flex flex-col gap-6">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <!-- 左侧：输入区 -->
      <el-card class="!border-0 shadow-sm">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-medium text-gray-800">输入视频信息</span>
            <span class="text-xs text-gray-400">步骤：填链接 → 下载解析 → 确认下载</span>
          </div>
        </template>

        <el-form label-position="top" size="small" class="space-y-3">
          <!-- 直接 m3u8 链接 -->
          <el-form-item label="m3u8 真实地址（推荐填写）">
            <el-input v-model.trim="customM3u8" placeholder="例如：https://cdn.example.com/2025/11/xxx/index.m3u8"
              clearable />
            <p class="text-xs text-gray-400 mt-1">
              真实 m3u8 地址播放地址。
            </p>
          </el-form-item>
          <!-- 视频网页链接 -->
          <el-form-item label="视频网页链接（可选）">
            <el-input v-model="pageUrl" placeholder="例如：https://www.example.com/video/abc123" clearable />
            <p class="text-xs text-gray-400 mt-1">
              需要页面上存在播放链接
            </p>
          </el-form-item>




          <div class="flex items-center gap-3 mt-2">
            <el-button type="primary" size="large" @click="handleParse">
              下载解析
            </el-button>
            <el-button @click="resetForm" size="large">清空</el-button>
          </div>

          <p class="text-xs text-gray-400 mt-2">
            ⚠ 浏览器不适合直接下载大体积视频文件，本工具主要用于「生成命令」，真正下载请在电脑终端执行。
          </p>
        </el-form>
      </el-card>

      <!-- 右侧：解析结果 / 命令 -->
      <el-card class="!border-0 shadow-sm">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-medium text-gray-800">解析结果</span>
            <span class="text-xs text-gray-400" v-if="hasParsed">
              <el-button type="primary" size="large" @click="downloadM3u8({
                m3u8Url: customM3u8,
                fileName: 'video',
                format: 'mp4'
              })">
                下载MP4
              </el-button>
              <el-button type="primary" size="large" @click="downloadM3u8({
                m3u8Url: customM3u8,
                fileName: 'video',
                format: 'ts'
              })">
                下载TS
              </el-button>
            </span>
          </div>
        </template>
        <div v-if="hasParsed">
          <PlyrVideo :src="customM3u8" />
        </div>

      </el-card>
    </div>
    <SupportContactPanel email="daoa96021@gmail.com"/>
    <el-dialog
      v-model="showDownloadDialog"
      align-center
      :close-on-click-modal="false"
      :destroy-on-close="true"
      class="media-download-dialog"
    >
      <template #header>
        <div class="text-lg font-semibold">
          下载 Media Studio AI 客户端
        </div>
      </template>
      <MediaClientDownload
        :download-url="downloadUrl"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import MediaClientDownload from "@/components/MediaClientDownload.vue"
import SupportContactPanel from "@/components/SupportContactPanel.vue"
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { downloadM3u8, testM3u8 } from '~/utils/Crawler'
const pageUrl = ref('')
const customM3u8 = ref('')

const downloadUrl="https://tool8s.com/uploads/Media-Studio-AI-1.0.2-setup.exe"
const showDownloadDialog=ref(false)
const hasParsed = ref(false)


async function handleParse() {
  if (!customM3u8.value && !pageUrl.value) {
    ElMessage.warning('请至少填写一个：m3u8 地址或视频网页链接')
    return
  }
  const result = await testM3u8(customM3u8.value)

  if (result.ok) {
    hasParsed.value = true
    ElMessage({
      message: '解析成功',
      type: 'success',
    })

  } else {
    hasParsed.value = false
    showDownloadDialog.value=true
   // ElMessage.warning(`❌ m3u8 不可用，原因 ${result.reason}`)
  }
}

function resetForm() {
  pageUrl.value = ''
  customM3u8.value = ''
  hasParsed.value = false
}

const seoUrl   = 'https://tool8s.com/media-studio-ai'
const coverImg  = 'https://tool8s.com/assets/media-studio-ai-banner-1200x630.png'
const icon64    = 'https://tool8s.com/assets/media-studio-ai-icon-64.png'
const icon180   = 'https://tool8s.com/assets/media-studio-ai-icon-180.png'

useSeoMeta({
  // 基本
  title: 'Media Studio AI - 跨平台 AI 媒体工具箱｜M3U8 提取下载与视频处理',
  description:
    'Media Studio AI 是一款基于 Electron 的跨平台 AI 媒体工具箱，目前主要提供 Windows 版本，支持一键提取 M3U8、下载 TS 切片并合并为 MP4，后续将扩展更多视频下载、转码与智能处理功能，全部本地运行，不上传视频，不收集隐私。',

  // 关键字
  // Nuxt 没有 keywords 的专门字段，用 useHead 也可以，这里先写上：
  // 下面 useHead 会补充
  // og / Open Graph
  ogType: 'website',
  ogTitle: 'Media Studio AI - 跨平台 AI 媒体工具箱｜M3U8 提取下载与视频处理',
  ogDescription:
    'Media Studio AI 是本地运行的跨平台 AI 媒体工具箱，目前提供 Windows 版本，可解析 M3U8、下载并合并 TS 为 MP4，未来将持续扩展更多智能视频工具。',
  ogUrl: seoUrl,
  ogSiteName: 'Media Studio AI',
  ogImage: coverImg,

  // Twitter / X
  twitterCard: 'summary_large_image',
  twitterTitle: 'Media Studio AI - Cross-platform AI Media Toolkit for M3U8 & Video Processing',
  twitterDescription:
    'Media Studio AI is a cross-platform AI media toolkit (currently available for Windows) for extracting M3U8, downloading TS segments and merging them into MP4, with more AI-powered video tools coming soon.',
  twitterImage: coverImg
})

useHead({
  link: [
    { rel: 'canonical', href: seoUrl },
    { rel: 'icon', type: 'image/png', href: icon64 },
    { rel: 'apple-touch-icon', href: icon180 }
  ],
  meta: [
    {
      name: 'keywords',
      content:
        'Media Studio AI,跨平台,AI 媒体工具箱,m3u8 下载,ts 合并,mp4 转换,视频下载工具,Windows 视频工具,本地下载,Media Downloader'
    },
    { name: 'application-name', content: 'Media Studio AI' },
    { name: 'author', content: 'Hale Lin · HaleLab' }
  ],
  script: [
    {
      type: 'application/ld+json',
      // unhead 用 children 填 JSON-LD 内容
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Media Studio AI',
        operatingSystem: 'Windows 10, Windows 11',
        applicationCategory: 'MultimediaApplication',
        description:
          'Media Studio AI 是一款基于 Electron 的跨平台 AI 媒体工具箱，目前主要提供 Windows 版本，用于解析 M3U8、下载 TS 切片并合并为 MP4，并将持续扩展更多智能视频处理功能。',
        author: {
          '@type': 'Person',
          name: 'Hale Lin'
        },
        publisher: {
          '@type': 'Organization',
          name: 'HaleLab'
        },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD'
        },
        url: seoUrl,
        image: coverImg
      })
    }
  ]
})
</script>
