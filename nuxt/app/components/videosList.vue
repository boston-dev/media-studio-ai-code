<script setup >
const props = defineProps({
  docs: { type: Array, default: () => [] },
  _id:{ type: String, default:'' }
})
const countUrl=(detail) =>{
 //return 'https://nnyy.in/nnimg2/20253236.jpg'
   if(detail?.img.indexOf('http') == -1){
    return `${detail?.source}${detail?.img}`
  }
  return detail?.img
}
const clearData=computed(() =>{
  return props.docs.filter(v => v._id !== props._id)
})
</script>

<template>
  <el-row :gutter="8">
    <el-col :xs="24" :sm="24" class="p-t-32" v-if="!clearData.length">
          <el-result>
            <template #icon>
              <img src="~/assets/img/no-data.png" height="300" alt="">
            </template>
            <template #extra>
              <el-button type="primary" @click="$router.push('/')">Back</el-button>
            </template>
          </el-result>
      </el-col>
      <el-col :xs="12" :sm="6" :key="`${idx}-${v._id}`" v-for="(v,idx) in clearData" class="m-b-8">
        <NuxtLink :to="`/javs/${v._id}.html`">
            <el-card class="video-item" >
              <template #footer>
                <p class="ellipsis-1">{{ v.title }}</p>
              </template>
              <div class="pic">
                <img
                :src="countUrl(v)"
                :alt="v.title"
                v-if="idx <= 16"      
              />
                <img
                v-else
                :src="countUrl(v)"
                :alt="v.title"
                loading="lazy"    
                class="sdsdsd"   
                decoding="async"       
              />
              </div>
            </el-card>
        </NuxtLink>
      </el-col>
  </el-row>
</template>

<style lang="scss">
.video-item{
  .el-card__body{
    padding: 0;
  }
  .el-card__footer{
    padding:4px;
  }
  .pic{
    height: 174px;
    img{
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
    }
  }
  @media screen and (max-width: 750px){
    .pic{
     height: 100px;
   }
  }
}
</style>
