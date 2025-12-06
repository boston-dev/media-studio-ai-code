<script setup>
import { splitPathAndQuery, buildPath } from '@/utils/url'

const props = defineProps({
  range: {
    type: Object,
    default: () => []
  },
})
const router=useRouter()
const goPage =(p) =>{
  if(!p) return
  console.log(p)
  const { path, query } = splitPathAndQuery(p)
  router.push({
    path,
    query
  })
}
</script>

<template>
  <div class="center-center p-t-8 p-b-24">
    <div class="el-pagination is-background list-page">
        <ul class="el-pager">
          <li v-for="(v,idx) in range" :key="v.href" class="center-center" 
          @click="goPage(v.href)" :class="[v.class ? 'is-active' : null]">
            <NuxtLink :to="v.href" class="flex-1">
              {{v.text}}
            </NuxtLink>
          </li>
        </ul>
      </div>
  </div>
  <el-pagination background layout="prev, pager, next" :total="1" style="display: none;" />

</template>

<style scoped  lang="scss">
.list-page{
  a{
    color: rgb(48, 49, 51);
     text-decoration: none;
  }
 
}

</style>
