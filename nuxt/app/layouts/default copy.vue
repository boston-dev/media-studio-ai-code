<template>
 <div class="g-container">
    <ul class="flex-wrap nav justify-between m-b-12">
      <li class="p-x-8 no-grow">
          <NuxtLink to="/" class="flex-1">
              首页
          </NuxtLink>
        </li>
        <li class="p-x-8 no-grow" v-for="(v,idx) in curNav" :key="idx">
          <template v-if="!v.href">
            <NuxtLink :to="`/cat/${v}/`" class="flex-1">
              {{v}}
            </NuxtLink>
          </template>
          <template v-else><a target="_blank" :href="v.href">{{v.text}}</a></template>
        </li>
        <li class="p-l-8 p-t-4">
          <el-form
          :inline="true"
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          class="demo-form-inline"
          @submit.prevent="submitForm(ruleFormRef)"  
        >
          <el-form-item class="m-b-0 m-r-8" prop="search_query">
            <el-input
              placeholder="Search"
              clearable
              v-model.trim="ruleForm.search_query"     
              @keyup.enter="submitForm(ruleFormRef)"  
            />
          </el-form-item>

          <el-form-item class="m-b-0">
            <el-button
              type="primary"
              :icon="Search"
              @click="submitForm(ruleFormRef)"
            />
          </el-form-item>
        </el-form>
        </li>
      </ul>
      <div class="p-l-8 p-r-8">
       <slot /> 
      </div>
    
 </div>
</template>
<script setup >
const route=useRoute()
const router=useRouter()
const query=router.query
console.log(query,'------------------')
import {Search} from '@element-plus/icons-vue'

const ruleFormRef = ref()
const ruleForm = ref({
  search_query: ''
})

// 自定义校验：非空且去掉空格后仍需有内容
const rules = {
  search_query: [
    {
      validator: (_rule, value, callback) => {
        if (!value || !String(value).trim()) {
          callback(new Error('请输入搜索内容'))
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change']
    }
  ]
}

const submitForm = async (formRef) => {
  if (!formRef) return
  await formRef.validate((valid) => {
    if (!valid) return
    console.log('提交：', ruleForm.value.search_query.trim())
    router.push({
      path:'/search/javs',
      query:{
        ...ruleForm.value
      }
    })
  })
}
import { useJavStore } from '~/stores/jav'
const store = useJavStore()
const detail=computed(() => store.detail)
console.log(detail.value)
import { useConfigStore } from '~/stores/config'
const configStore = useConfigStore()
const { speceilArr } = useAppConfig()
const curNav = computed(() => {
    if(speceilArr.find(v => route.fullPath.includes('asiangay'))){
       return configStore.allNav['asiangayNav']
    }
    if(speceilArr.find(v => route.fullPath.includes('hanime'))){
       return configStore.allNav['hanimeNav']
    }
    if(speceilArr.find(v => route.fullPath.includes('lesbian'))){
       return configStore.allNav['lesbianNav']
    }
   return configStore.allNav['porn5fNav']

})
</script>
<style lang="scss">
.nav{
  width: 100%;
  .el-form-item__error{
    display: none;
  }
}
</style>