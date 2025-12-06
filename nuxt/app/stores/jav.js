import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useJavStore = defineStore('jav', () => {
  const homeList=ref({
    page:1,
    docs:[]
  }) 
  const tagList=ref({
    page:1,
    docs:[]
  })  
  const detail = ref({})
  const clearDetail=(v)=>{
     detail.value=v
  }
  const fetchDetail = async (id) => {
    try {
      // 走我们自己的 /api/ 反代，上游实际是 https://hrt21.com/javs/{id}.html?ajax=1
      const data = await $fetch(`/api/javs/${id}.html`, {
        query: { ajax: 1 }
      })
      detail.value = data.video
    } catch (e) {
      
    } finally {
      
    }
  }
  const fetchHome = async (v) => {
    try {
      const data = await $fetch(`/api`, {
        query: {
             ajax: 1,
             page:v
        }
      })
      const docs=data.docs 
      Object.assign(homeList.value,{
        ...data,
        docs
      })
      return data
    } catch (e) {
    
    } finally {
    }
  }
   const fetchTag = async (v) => {
    try {
      const data = await $fetch(`/api`+v, {
        query: {
             ajax: 1
        }
      })
      const docs=data.docs 
      Object.assign(tagList.value,{
        ...data,
        docs
      })
      return data
    } catch (e) {
    
    } finally {
    }
  }
  const fetchM3u8Config = async (v) => {
    try {
      const data = await $fetch(`/api`+v, {
        query: {
             ajax: 1
        }
      })
      const docs=data.docs 
      Object.assign(tagList.value,{
        ...data,
        docs
      })
      return data
    } catch (e) {
    
    } finally {
    }
  }
  return { tagList,homeList,detail, fetchDetail,fetchHome,fetchTag,clearDetail }
})
