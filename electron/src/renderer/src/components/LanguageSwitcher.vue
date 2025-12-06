<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'

const { t, locale } = useI18n()

// 支持的语言列表
const languages = [
  { label: '中文', value: 'zh-CN', flag: '🇨🇳' },
  { label: 'EN',   value: 'en-US', flag: '🇺🇸' },
]

// 当前语言显示
const currentLang = computed(() => {
  return languages.find(l => l.value === locale.value) || languages[0]
})

function onCommand(lang) {
  locale.value = lang
  localStorage.setItem('app_locale', lang)

  ElMessage.success(
    lang === 'zh-CN'
      ? '已切换为中文'
      : 'Language switched to English'
  )
}
</script>

<template>
  <el-dropdown @command="onCommand">
    <button
      class="inline-flex items-center px-3 py-1 rounded-md border
             bg-white/5 hover:bg-white/10 text-sm
             shadow-sm transition"
    >
      <span class="mr-1">{{ currentLang.flag }}</span>
      <span class="mr-1">{{ currentLang.label }}</span>
      <i class="el-icon-arrow-down el-icon--right"></i>
    </button>

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item in languages"
          :key="item.value"
          :command="item.value"
        >
          <span class="mr-1">{{ item.flag }}</span>
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
