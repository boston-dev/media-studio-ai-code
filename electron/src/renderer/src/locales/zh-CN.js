export default {
  app: {
    name: 'Media Studio AI',
    version: '版本',
  },

  nav: {
    steps: '步骤：填写链接 → 下载解析',
  },

  inputPage: {
    title: '输入视频信息',
    realM3U8Label: 'm3u8 真实地址（最稳！）',
    realM3U8Placeholder: '例如：https://cdn.example.com/2025/11/xxx/index.m3u8',

    realM3U8Tip:
      '如果您直接填写真实 m3u8 地址播放地址，下载成功率可几乎百分百。这是最精准、最推荐的方式。',

    pageUrlLabel: '视频网站页面链接（可选）',
    pageUrlPlaceholder: '例如：https://www.example.com/video/abc123',

    pageUrlTip:
      '如果您不知道 m3u8，可以填写视频网站链接，系统会自动帮您“找” m3u8。但有些网站结构复杂、做了加密防护 → 可能无法解析。建议优先使用 m3u8 地址。',

    downloadBtn: '下载解析',
    clearBtn: '清空',

    bottomWarn:
      '⚠ 浏览器环境下不适合直接下载或播放大体积视频文件，本工具主要用于「生成内容」提示。真正下载请在电脑客户端执行。',
  },

  guide: {
    title: '什么是「真实 m3u8 播放地址」？',
    desc:
      '直接填写 m3u8 地址，下载成功率最高；只填网页链接，成功率会低很多。',

    recommendWrite: '推荐填写',
    m3u8SuccessHigh: '填写真实 m3u8 地址（成功率最高）',
    m3u8SuccessHighTip:
      '直接填写真实 m3u8，可以极速解析下载，成功率几乎 100%。',

    writePageOnly: '只填写视频网站链接（成功率低）',
    writePageOnlyTip:
      '工具会尝试从页面里自动寻找 m3u8 地址，但有些网站结构复杂、做了加密防护 → 可能无法解析成功。',

    devToolGuide: '小白教程：如何自己找到 m3u8 地址（以 Chrome 浏览器为例）',

    steps: {
      openVideo: '打开要下载的视频网页',
      f12: '按 F12 打开开发者工具',
      filterM3u8: '在 Network 里过滤 .m3u8',
      copyAddress: '复制 m3u8 地址并粘贴到工具',
    },

    tips: {
      openVideoTip:
        '用 Chrome / Edge 访问视频页面，出现视频播放器即可。',
      f12Tip:
        '在电脑键盘按 F12 打开开发者工具，顶部切到 Network（网络）。',
      filterTip:
        '在 Network 搜索框中输入 “m3u8”，按回车过滤所有 m3u8 请求。',
      copyTip:
        '右键复制最终的 m3u8 地址，从上下文菜单选择 Copy → Copy link address，然后粘贴到工具上。成功率几乎 100%。',
    },

    note:
      '注意：越靠后的 m3u8 越可能是真实播放地址（如 index.m3u8 为最高层）。请复制列表中最后一个 m3u8。',
  },

  contact: {
    title: '交流与问题反馈',
    desc:
      '如果你在使用 Media Studio AI 时遇到问题，或有功能建议，欢迎通过下方任意一种方式联系作者，我们会尽量回复并持续优化工具。',

    method1Title: '方式一：微信扫码联系',
    method1Desc:
      '使用微信扫一扫添加客服 / 关注公众号，发送“Media Studio AI”说明你的问题。',

    method2Title: '方式二：发送邮件',
    method2Desc:
      '如需详细描述遇到的问题，附带截图或日志，可以通过邮箱联系我们：',

    emailCopy: '复制',
  },
}
