<script setup >
const route=useRoute()

import { useJavStore } from '~/stores/jav'
const store = useJavStore()
await store.fetchTag(route.fullPath)
const homeList=computed(() => store.tagList || {})
const docs=computed(() => store.tagList?.docs || [])


import { useConfigStore } from '~/stores/config'
const configStore=useConfigStore()
const { speceilArr } = useAppConfig()

</script>

<template>
  <videosList :docs="docs"/>
  <listPage :range="homeList.range"/>
</template>


