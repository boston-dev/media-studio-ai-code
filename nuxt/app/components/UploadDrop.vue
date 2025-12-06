<template>
  <div class="border-2 border-dashed rounded-2xl p-5 text-center"
       @dragover.prevent
       @drop.prevent="onDrop">
    <div class="text-3xl mb-1">📤</div>
    <div class="mb-2 text-sm">{{ label }}</div>
    <div class="flex items-center justify-center gap-2">
      <button class="btn btn-ghost" @click="open">选择文件</button>
      <slot />
    </div>
    <input ref="ipt" type="file" :accept="accept" class="hidden" :multiple="multiple" @change="onPick" />
    <p class="text-xs text-gray-500 mt-2">{{ hint }}</p>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const props = defineProps({
  label: { type: String, default: '拖拽文件到此，或' },
  accept: { type: String, default: 'image/*' },
  hint: { type: String, default: 'JPG/PNG/WebP，单文件 ≤ 20MB' },
  multiple: { type: Boolean, default: false }
})
const emit = defineEmits(['files'])
const ipt = ref(null)
function open(){ ipt.value && ipt.value.click() }
function onPick(e){ const f=e.target.files; if(f?.length) emit('files', Array.from(f)) }
function onDrop(e){ const f=e.dataTransfer?.files; if(f?.length) emit('files', Array.from(f)) }
</script>
