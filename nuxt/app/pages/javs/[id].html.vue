<!-- pages/javs/[id].html.vue -->
<script setup>
const { speceilArr } = useAppConfig()
import {countUrl} from '~/utils/url'
const route = useRoute()
const id = route.params.id
import { useJavStore } from '~/stores/jav'
const store = useJavStore()
await store.fetchDetail(id)
const detail=computed(() => store.detail)
const url=computed(() => {
  if(detail.value?.url.indexOf('http') == -1){
    return `${detail.value?.source}${detail.value?.url}`
  }
  return detail.value?.url
})
const docs=computed(() => detail.value?.docs || [])
// 可根据接口数据设置 SEO
useHead(() => {
  const title = detail.value?.title || `详情 - ${id}`
  const desc  = detail.value?.desc  || '视频详情页'
  const cover = `${detail.value?.source}${detail.value?.img}` || ''
  return {
    title,
    meta: [
      { name: 'description', content: desc },
      { property: 'og:title', content: title },
      { property: 'og:description', content: desc },
      cover ? { property: 'og:image', content: countUrl(detail.value) } : {}
    ].filter(Boolean),
    script: [{
    type: 'application/ld+json',
    children: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: title,                   // 视频标题
      description: desc,             // 视频简介
      thumbnailUrl: [cover], // 缩略图数组（至少 1 张）
      uploadDate:new Date(detail.value?.date|| Date.now() ).toISOString(),
      embedUrl: `${detail.value?.curName}/javs/${detail.value?._id}.html`,             // 播放页/嵌入页 URL（用你的视频详情页也可）
      genre: detail.value.tags,                   // 标签/分类（数组）

    })
  }]
  }
})
const skipObj=(v) =>{
  const path=`/tag/${v}/`
  if(speceilArr.includes(detail.value?.site)){
    return {
      path,
      query:{
        site:detail.value?.site
      }
    }
  }
  return {
    path
  }
}
onUnmounted(() => {
  store.clearDetail({})
})
</script>

<template>
  <div class="detail-desc ----">
   <PlyrVideo :detail="detail"  :src="url" type="m3u8"  />
   <p class="p-t-8">{{detail.title}}</p>
  </div>
   <p class="m-t-8 m-b-4 ">
     <NuxtLink 
      v-for="(v,idx) in detail.tag"
          :key="idx"
     :to="skipObj(v)" class="m-r-4 color-primary">
      <el-tag
          class="m-r-4 color-primary"
          effect="plain"
        >
          {{ v }}
        </el-tag>
      </NuxtLink>
   </p>
  <videosList class="m-t-8" :docs="docs" :_id="id"/>
</template>
<style lang="scss">
.detail-desc{
  .plyr__wrap{
    max-width: 100%;
    height: 430px;
  }
   @media screen and (max-width: 750px){
   .plyr__wrap{
     height: 210px;
   }
  }
  .plyr--video{
    height: 100%;
  }
}
</style>