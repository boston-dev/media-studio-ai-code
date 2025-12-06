import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

export default defineNuxtPlugin((nuxtApp) => {
  const router = nuxtApp.$router

  // 你想要的最短显示时间 (毫秒)
  const MIN_DURATION = 800

  // 记录这次 start 的时间戳
  let startAt = 0
  // 记录一个可能的延迟定时器，防止重复触发
  let timer: number | null = null

  NProgress.configure({
    showSpinner: false,
    trickleSpeed: 200,
    trickleRate: 0.02
  })

  router.beforeEach(() => {
    // 清掉上一次的定时器，避免并发路由导致提前关闭
    if (timer) {
      clearTimeout(timer)
      timer = null
    }

    startAt = Date.now()
    NProgress.start()
    return true
  })

  router.afterEach(() => {
    const elapsed = Date.now() - startAt
    const remain = MIN_DURATION - elapsed

    if (remain <= 0) {
      // 已经显示够久了，直接关
      NProgress.done()
    } else {
      // 还没到最少时间，等一等再关
      timer = window.setTimeout(() => {
        NProgress.done()
        timer = null
      }, remain)
    }
  })

  router.onError(() => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    NProgress.done()
  })
})
