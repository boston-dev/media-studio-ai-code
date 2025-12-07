<template>
  <section
    class="rounded-2xl border border-slate-100 bg-white/90 px-6 py-5 shadow-sm shadow-slate-100"
  >
    <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <!-- 左侧：标题 + 说明 -->
      <div class="space-y-2">
        <h2 class="text-base font-semibold text-slate-900">
          交流与问题反馈
        </h2>
        <p class="text-sm text-slate-600">
          如果你在使用 <span class="font-medium">Media Studio AI</span> 时遇到问题，或有功能建议，
          欢迎通过下方任意一种方式联系作者，我们会尽量回复并持续优化工具。
        </p>
      </div>

      <!-- 右侧：两种联系方式 -->
      <div
        class="flex flex-col gap-4 md:flex-row md:items-center md:gap-8"
      >
       <!-- 方式二：邮箱反馈 -->
        <div class="space-y-2">
          <p class="text-xs font-medium text-slate-900">
            方式一：发送邮件
          </p>
          <p class="text-xs text-slate-600">
            如需详细描述问题、附带截图或日志，可以通过邮箱联系我们：
          </p>
          <div class="flex items-center gap-2">
            <a
              :href="`mailto:${email}`"
              class="text-xs font-medium text-blue-600 hover:underline break-all"
            >
              {{ email }}
            </a>
            <el-button
              v-if="showCopyButton"
              size="small"
              text
              @click="copyEmail"
            >
              复制
            </el-button>
          </div>
          <p v-if="copyHint" class="text-[11px] text-emerald-600">
            {{ copyHint }}
          </p>
        </div>
        <!-- 方式一：扫码加客服 / 公众号 -->
        <!-- <div class="flex items-center gap-3">
          <div
            class="flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
          >
            <img
              v-if="qrImage"
              :src="qrImage"
              alt="客服 / 公众号二维码"
              class="h-full w-full object-contain"
            />
            <span v-else class="text-[10px] text-slate-400 px-1 text-center leading-snug">
              在 props 里传入<br />qr-image
            </span>
          </div>
          <div class="space-y-1">
            <p class="text-xs font-medium text-slate-900">
              方式二：微信扫码联系
            </p>
            <p class="text-xs text-slate-600">
              使用微信扫一扫添加客服 / 关注公众号，发送
              <span class="font-medium">“Media Studio AI”</span> 说明你的问题。
            </p>
          </div>
        </div> -->

       
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'

interface Props {
  qrImage?: string
  email?: string
  showCopyButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  qrImage: '',
  email: 'support@example.com',
  showCopyButton: true
})

const copyHint = ref('')

const copyEmail = async () => {
  try {
    await navigator.clipboard.writeText(props.email)
    copyHint.value = '邮箱地址已复制，可直接粘贴到邮件客户端。'
    ElMessage.success('邮箱已复制')
    setTimeout(() => {
      copyHint.value = ''
    }, 3000)
  } catch (err) {
    ElMessage.error('复制失败，请手动选择邮箱复制')
  }
}
</script>
