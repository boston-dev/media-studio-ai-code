<script setup>
import { appName,appdesc,appKeywords } from '~/constants'
const route = useRoute()
//keywords
useHead({
  title: appName,
   meta: [
      { name: 'description', content: appdesc },
      { name: 'keywords', content: appKeywords },
      { property: 'og:title', content: appName },
      { property: 'og:description', content: appdesc },
    ].filter(Boolean),
})
</script>
<template>
  <NuxtLayout>
    <NuxtPage :key="route.fullPath"  />
  </NuxtLayout>
</template>
