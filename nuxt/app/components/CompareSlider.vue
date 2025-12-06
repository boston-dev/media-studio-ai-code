<template>
  <div class="relative w-full overflow-hidden rounded-2xl shadow" :style="{ height: height + 'px' }">
    <img v-if="before" :src="before" class="absolute inset-0 w-full h-full object-contain bg-black/5" alt="before" />
    <div v-if="after" class="absolute inset-0" :style="{ width: (pos*100)+'%', overflow: 'hidden' }">
      <img :src="after" class="w-full h-full object-contain" alt="after" />
    </div>
    <div class="absolute inset-y-0" :style="{ left: (pos*100)+'%' }">
      <div class="-translate-x-1/2 h-full w-px bg-white ring-1 ring-black/20"></div>
      <div class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-white rounded-full px-2 py-1 text-xs shadow">拖动对比</div>
    </div>
    <input type="range" min="0" max="100" :value="pos*100" @input="onInput" class="absolute bottom-3 left-3 right-3"/>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const props = defineProps({ before:String, after:String, height: { type: Number, default: 320 } })
const pos = ref(0.5)
function onInput(e){ pos.value = (+e.target.value)/100 }
</script>
