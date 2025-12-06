<template>
  <div class="fixed left-1/2 -translate-x-1/2 bottom-6 space-y-2 z-50">
    <div v-for="t in items" :key="t.id"
         class="rounded-xl px-3 py-2 text-sm shadow-card text-white"
         :class="bg(t.type)">
      <div class="flex items-center gap-2">
        <span>{{ t.msg }}</span>
        <button class="ml-2 text-white/90" @click="$emit('close', t.id)">✕</button>
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({ items: { type: Array, default: ()=>[] } })
const emit = defineEmits(['close'])
const bg = (type)=> type==='error' ? 'bg-red-500' : (type==='success' ? 'bg-green-600' : 'bg-black/90')
</script>
