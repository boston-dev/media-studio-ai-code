import vue from '@vitejs/plugin-vue'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '~': resolve('src/renderer/src')
      }
    },
    plugins: [
      vue(),
      // 自动导入 API（ElMessage、ref、useRoute 等）
      AutoImport({
        imports: ['vue'],
        resolvers: [ElementPlusResolver()],
        // 下面两个 dts 只是给 TS/IDE 提示用，没有也不影响运行
        dts: 'src/renderer/auto-imports.d.ts'
      }),

      // 自动按需注册组件（<el-button> 等）
      Components({
        resolvers: [ElementPlusResolver()],
        dts: 'src/renderer/components.d.ts'
      })
    ]
  }
})
