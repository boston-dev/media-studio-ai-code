<template>
    <div class="w-full min-h-[520px] flex flex-col gap-6 p-3">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <!-- 左侧：输入区 -->
            <el-card class="!border-0 shadow-sm">
                <template #header>
                    
                       
                    <div style="display: flex;align-items: center;">
                        <LanguageSwitcher style="margin-right: 8px;"/>
                         <div class="flex items-center justify-between" style="flex: 1;">
                            <span class="font-medium text-gray-800">{{ t('inputPage.title') }}({{ pkg.version }}V)</span>
                            <span class="text-xs text-gray-400">{{ t('nav.steps') }}</span>
                        </div>
                        
                    </div>
                    
                </template>

                <el-form label-position="top" size="small" class="space-y-3">
                    <!-- 直接 m3u8 链接 -->
                    <el-form-item :label="t('inputPage.realM3U8Label')">
                        <el-input v-model.trim="customM3u8"
                            :placeholder="t('inputPage.realM3U8Placeholder')" clearable />
                        <p>
                            {{ t('inputPage.realM3U8Tip') }}
                        </p>
                        <p></p>
                    </el-form-item>
                    <!-- 视频网页链接 -->
                    <el-form-item :label="t('inputPage.pageUrlLabel')">
                        <el-input v-model="pageUrl" :placeholder="t('inputPage.pageUrlPlaceholder')" clearable />
                        <p>
                            {{ t('inputPage.pageUrlTip') }}
                        </p>
                    </el-form-item>
                    <el-progress :percentage="progress" />
                    <p>
                        {{ mp4url }}
                    </p>
                    <div class="flex items-center gap-3 mt-2">
                        <el-button type="primary" size="large" @click="handleParse">  {{ t('inputPage.downloadBtn') }} </el-button>
                        <el-button size="large" @click="resetForm">{{ t('inputPage.clearBtn') }}</el-button>
                    </div>

                    <p class="text-xs text-gray-400 mt-2">
                         {{ t('inputPage.bottomWarn') }}
                    </p>
                </el-form>
            </el-card>
            <el-card class="!border-0 shadow-none bg-transparent p-1">
                <M3u8Helper />
            </el-card>
        </div>
        <!-- 底部说明 -->
        <SupportContactPanel email="daoa96021@gmail.com"/>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()   // ✅ 注意是解构出 t，而不是 const t = useI18n()
import { ref } from 'vue'
import LanguageSwitcher from '~/components/LanguageSwitcher.vue'
import SupportContactPanel from '~/components/SupportContactPanel.vue'
import { initUpdateChecker, showUpdatePrompt } from '~/utils/update-checker.js'
import pkg from '../../../../package.json'
async function onClickCheckUpdate() {
    // 1. 调用 initUpdateChecker 只“拿状态”
    const updateState = await initUpdateChecker({
        LOCAL_VERSION: pkg.version,
        VERSION_API: 'https://tool8s.com/api/version',
        APP_NAME: pkg.name,
        DEBUG: true
    })
    
    if (updateState.hasUpdate) {
        console.log(updateState,'----')
        showUpdatePrompt(updateState)
        return updateState
    }
    // 2. 真的要更新（比如你再弹个“是否更新？”或者直接来）
    return updateState
}
// 组件里
const ipcPostM3U8 = (m3u8Url) => window.electron.ipcInvoke('postM3U8', m3u8Url)

const pageUrl = ref('')
const customM3u8 = ref('')

const mp4url = ref('')
const progress = ref(0)
window.electron.on('m3u8:progress', (percent) => {
    progress.value = percent
})
function toFileUrl(p) {
    return 'file:///' + p.replace(/\\/g, '/')
}
async function handleParse() {
    const check = await onClickCheckUpdate()
    if (check.hasUpdate) return
    const result = await ipcPostM3U8(customM3u8.value || pageUrl.value)
    if (result.ok) {
        mp4url.value = result.filePath
    } else {
        ElMessage.warning(`❌ m3u8 不可用，原因 ${result.reason}`)
    }
}

function resetForm() {
    pageUrl.value = ''
    customM3u8.value = ''

    progress.value = 0
}
watch(
    () => [pageUrl.value, customM3u8.value],
    () => {
        progress.value = 0
        mp4url.value = ''
    }
)
</script>
<style>
body,
input,
textarea,
p,
span,
div,
input {
    user-select: text !important;
    -webkit-user-select: text !important;
}
</style>
