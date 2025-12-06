<template>
  <div class="card overflow-hidden">
    <div class="p-4 flex items-center justify-between border-b">
      <div>
        <div class="font-medium text-sm">{{ task.title }}</div>
        <div class="text-xs text-gray-500">
          <span v-if="task.size">{{ size }}</span>
          <span v-if="task.size"> · </span>
          {{ time }}
        </div>
      </div>
      <span class="badge"
        :class="badge">
        {{ label }}
      </span>
    </div>
    <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
      <div class="rounded-xl bg-gray-50 min-h-[160px] flex items-center justify-center overflow-hidden">
        <img v-if="task.preview" :src="task.preview" class="max-h-48 object-contain" alt="preview" />
        <div v-else class="text-sm text-gray-500">无预览</div>
      </div>
      <div>
        <div v-if="task.status!=='done' && task.progress!=null">
          <div class="flex items-center justify-between text-xs mb-1">
            <span>进度</span><span>{{ task.progress }}%</span>
          </div>
          <div class="h-2 rounded-full bg-gray-100 overflow-hidden">
            <div class="h-2 bg-black" :style="{ width: task.progress + '%' }"></div>
          </div>
        </div>
        <div class="text-xs text-gray-500 min-h-[40px] mt-2">{{ task.message || '就绪' }}</div>
      </div>
    </div>
    <div class="p-4 border-t text-right space-x-2">
      <button v-if="task.status==='failed'" class="btn btn-ghost" @click="$emit('retry', task.id)">重试</button>
      <button v-if="task.status==='done'" class="btn btn-primary" @click="$emit('download', task.id)">下载</button>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
const props = defineProps({ task: Object })
const size = computed(()=> props.task.size ? formatBytes(props.task.size) : '')
const time = computed(()=> new Date(props.task.createdAt).toLocaleString())
const label = computed(()=> props.task.status==='done' ? '完成' : (props.task.status==='failed' ? '失败' : (props.task.status==='processing' ? '处理中' : '排队中')))
const badge = computed(()=> props.task.status==='done' ? 'bg-green-100 text-green-700' : (props.task.status==='failed' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'))
function formatBytes(bytes){ if(!+bytes) return '0 B'; const k=1024,s=['B','KB','MB','GB']; const i=Math.floor(Math.log(bytes)/Math.log(k)); return `${(bytes/Math.pow(k,i)).toFixed(1)} ${s[i]}` }
</script>
