<!-- M3u8Helper.vue -->
<template>
    <el-card class="m3u8-helper max-w-4xl mx-auto">
        <!-- 标题 -->
        <div class="flex items-center justify-between mb-4">
            <div>
                <h2 class="text-xl font-bold text-sky-400"> {{ t('guide.title') }}</h2>
                <p class="text-sm text-slate-400 mt-1">
                   {{ t('guide.desc') }}
                </p>
            </div>
            <el-tag type="success" effect="dark"> {{ t('guide.recommendWrite') }}</el-tag>
        </div>

        <!-- 两种输入方式对比 -->
        <div class="grid md:grid-cols-2 gap-4 mb-6">
            <el-card shadow="never" class="border border-emerald-500/40 bg-emerald-900/10">
                <div class="flex items-center mb-2">
                    <span
                        class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-xs font-bold text-white mr-2">
                        ①
                    </span>
                    <span class="font-semibold text-emerald-300">{{ t('guide.m3u8SuccessHigh') }}</span>
                </div>
                <p class="text-xs text-emerald-300 leading-relaxed">
                    <span class="font-mono break-all">https://cdn.example.com/2025/11/xxx/index.m3u8</span><br />
                    {{ t('guide.m3u8SuccessHighTip') }}
                </p>
            </el-card>

            <el-card shadow="never" class="border border-amber-500/40 bg-amber-900/10">
                <div class="flex items-center mb-2">
                    <span
                        class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-xs font-bold text-white mr-2">
                        ②
                    </span>
                    <span class="font-semibold text-amber-300">{{ t('guide.writePageOnly') }}</span>
                </div>
                <p class="text-xs text-amber-300 leading-relaxed">
                    <span class="font-mono break-all">https://www.example.com/video/abc123</span><br />
                    {{ t('guide.writePageOnlyTip') }}
                </p>
            </el-card>
        </div>

        <img :src="gl" alt="" />

        <!-- 步骤标题 -->
        <h3 class="text-lg font-semibold text-sky-300 mb-2">
            {{ t('guide.devToolGuide') }}
        </h3>

        <!-- 步骤条 -->
        <el-steps :active="4" finish-status="success" align-center class="hidden md:flex mb-4">
            <el-step :title="t('guide.steps.openVideo')" />
            <el-step :title="t('guide.steps.f12')" />
            <el-step :title="t('guide.steps.filterM3u8')"  />
            <el-step :title="t('guide.steps.copyAddress')"  />
        </el-steps>

        <!-- 文字 + 图示步骤（适合手机） -->
        <div class="space-y-4 text-sm text-slate-100">
            <!-- step 1 -->
            <div class="flex">
                <div
                    class="w-6 h-6 flex-shrink-0 rounded-full bg-sky-500 text-xs font-bold text-white flex items-center justify-center mt-1 mr-3">
                    1
                </div>
                <div>
                    <p class="font-semibold text-sky-200">{{ t('guide.tips.openVideoTip') }}</p>
                    <p class="text-xs text-slate-300 mt-1">
                       {{ t('guide.tips.f12Tip') }}
                    </p>
                </div>
            </div>

            <!-- step 2 -->
            <div class="flex">
                <div
                    class="w-6 h-6 flex-shrink-0 rounded-full bg-sky-500 text-xs font-bold text-white flex items-center justify-center mt-1 mr-3">
                    2
                </div>
                <div>
                    <p class="font-semibold text-sky-200">
                        {{ t('guide.tips.filterTip') }}
                    </p>
                    <p class="text-xs text-slate-300 mt-1">
                        {{ t('guide.tips.copyTip') }}
                    </p>
                </div>
            </div>

        
        </div>

        <el-divider />

        <!-- 小贴士 -->
        <div class="text-xs text-slate-400 leading-relaxed space-y-1">
            <p>
                ⚠️ {{ t('guide.note') }}
            </p>
        </div>
    </el-card>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()   // ✅ 注意是解构出 t，而不是 const t = useI18n()
import gl from '~/assets/gg.png';
// 纯展示组件，不需要额外逻辑
</script>

<style scoped>
.m3u8-helper {
    @apply bg-slate-900/90 border border-slate-700/80 text-slate-100;
}
</style>
