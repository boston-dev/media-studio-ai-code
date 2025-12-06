<script setup>
import Hls from 'hls.js';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({
  src: { type: String, required: true },
  type: { type: String, default: 'm3u8' },
  poster: { type: String, default: '' },
  autoplay: { type: Boolean, default: false },
  muted: { type: Boolean, default: false },
  loop: { type: Boolean, default: false },
  defaultVolume: { type: Number, default: 0.7 }, // 0~1
  controls: {
    type: Array,
    default: () => ['play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'] //,'settings','pip','airplay',
  },
  captions: { type: Array, default: () => [] },
  detail: {
    type: Object, default: () => {
      return {}
    }
  }
})

const el = ref(null)
let player = null
let hls = null

const destroyPlayer = () => {
  if (player) { player.destroy(); player = null }
  if (hls) { hls.destroy(); hls = null }
}

const initPlayer = async () => {
  await nextTick()

  // 防御：没有容器或者没有src就先不初始化
  if (!el.value || !props.src) return
  console.log(props.src, '-----------')
  destroyPlayer()

  // 清空容器前再次判断
  if (el.value) el.value.innerHTML = ''

  const video = document.createElement('video')
  video.setAttribute('playsinline', '')
  video.setAttribute('webkit-playsinline', '')
  // if (props.detail) {
  //   console.log(countUrl(props.detail))
  //   video.setAttribute('poster', countUrl(props.detail))
  // }
  if (props.autoplay) video.setAttribute('autoplay', '')
  if (props.muted) video.muted = true
  if (props.loop) video.setAttribute('loop', '')

  // 字幕
  props.captions.forEach(t => {
    const track = document.createElement('track')
    track.kind = 'subtitles'
    track.src = t.src
    track.srclang = t.srclang
    track.label = t.label
    if (t.default) track.default = true
    video.appendChild(track)
  })

  el.value.appendChild(video)


  if (props.type === 'm3u8') {
    if (video.canPlayType('application/vnd.apple.mpegURL')) {
      video.src = props.src
    } else if (Hls.isSupported()) {
      hls = new Hls()
      hls.loadSource(props.src)
      hls.attachMedia(video)
    } else {
      console.warn('HLS not supported')
    }
  } else {
    video.src = props.src
  }

  player = new Plyr(video, {
    controls: props.controls,
    autoplay: props.autoplay,
    muted: props.muted,
    volume: Math.max(0, Math.min(1, props.defaultVolume))
  })
}

onMounted(initPlayer)
onBeforeUnmount(destroyPlayer)

// 当 src 或 type 改变时，等 DOM 刷新后再重建
watch(() => [props.src, props.type], () => initPlayer(), { flush: 'post' })
</script>

<template>
  <!-- 一定要有固定尺寸，避免 0 高导致看不见 -->
  <div ref="el" class="plyr__wrap">

  </div>
</template>

<style scoped lang="scss">
.plyr__wrap {
  width: 100%;
  max-width: 960px;
  aspect-ratio: 16/9;
  background: #000;

  :deep(.plyr__volume input[type=range]) {
    max-width: 60px;
  }
}
</style>
