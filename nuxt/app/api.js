// src/api.js
const delay = (ms)=> new Promise(res=> setTimeout(res, ms))

export const api = {
  // Week 1: Old Photo Restore & Colorize
  async restorePhoto(file, { colorize=true, upscale=true }={}){
    await delay(800 + Math.random()*1200)
    // 这里返回原图作为占位；接你后端后，返回修复后的 URL
    return URL.createObjectURL(file)
  },
  // Week 2: ID Photo background replace
  async removeBg(file, { color='#00B2FF' }={}){
    await delay(700 + Math.random()*1000)
    return URL.createObjectURL(file)
  },
  // Week 3: OCR + Translate
  async ocr(file){
    await delay(900 + Math.random()*1000)
    return '示例文本：这是一段从图片中识别出来的文字。'
  },
  async translate(text, target='en'){
    await delay(600)
    return `[${target}] ` + text
  }
}
