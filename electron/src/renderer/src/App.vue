<script setup>
import { reportEvent } from '~/utils/analytics.js'
import downM3u8 from '~/components/downM3u8.vue'
onMounted(function () {
  // 应用启动 / 页面加载时上报一次
  reportEvent('app_start')
})
</script>

<template>
  <downM3u8 />
</template>
