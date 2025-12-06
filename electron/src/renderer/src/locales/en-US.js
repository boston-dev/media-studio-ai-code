export default {
  app: {
    name: 'Media Studio AI',
    version: 'version',
  },

  nav: {
    steps: 'Steps: Paste link → Parse & download',
  },

  inputPage: {
    title: 'Enter video information',
    realM3U8Label: 'Real m3u8 url (most stable)',
    realM3U8Placeholder: 'Example: https://cdn.example.com/2025/11/xxx/index.m3u8',

    realM3U8Tip:
      'If you paste the real m3u8 playback url, the success rate is almost 100%. This is the most accurate and recommended way to use this tool.',

    pageUrlLabel: 'Video page url (optional)',
    pageUrlPlaceholder: 'Example: https://www.example.com/video/abc123',

    pageUrlTip:
      'If you do not know the m3u8 url, you can paste the video page url and the tool will try to find the m3u8 for you. However, some sites use complex structures or extra protections, so parsing may fail. Using the m3u8 url directly is recommended.',

    downloadBtn: 'Parse & download',
    clearBtn: 'Clear',

    bottomWarn:
      'The browser environment is not suitable for downloading or playing very large video files directly. This page is mainly for generating links and instructions. For actual downloading, please use the desktop client.',
  },

  guide: {
    title: 'What is the “real m3u8 playback url”?',
    desc:
      'If you paste the m3u8 url directly, the success rate is the highest; if you only paste the web page url, the success rate will be much lower.',

    recommendWrite: 'Recommended',
    m3u8SuccessHigh: 'Paste the real m3u8 url (highest success rate)',
    m3u8SuccessHighTip:
      'Pasting the real m3u8 url allows the tool to parse and download very stably, with a success rate close to 100%.',

    writePageOnly: 'Only paste the video page url (low success rate)',
    writePageOnlyTip:
      'The tool will try to detect the m3u8 url from the page, but some sites use complex layouts or extra protection, so parsing may fail.',

    devToolGuide: 'Mini tutorial: how to find a m3u8 url yourself (Chrome example)',

    steps: {
      openVideo: 'Open the video page you want to download',
      f12: 'Press F12 to open Developer Tools',
      filterM3u8: 'Filter requests by “.m3u8” in Network',
      copyAddress: 'Copy the m3u8 url and paste it into the tool',
    },

    tips: {
      openVideoTip:
        'Use Chrome / Edge to open the video page until the player appears.',
      f12Tip:
        'Press F12 on your keyboard to open Developer Tools, then switch to the “Network” tab.',
      filterTip:
        'In the Network search box, type “m3u8” and press Enter to filter all m3u8 requests.',
      copyTip:
        'Right-click the final m3u8 request and choose “Copy → Copy link address”, then paste it into the tool. The success rate is almost 100%.',
    },

    note:
      'Note: usually the last m3u8 in the list is the real playback url (for example, index.m3u8 is often the top level). Please copy the last m3u8 entry.',
  },

  contact: {
    title: 'Feedback & contact',
    desc:
      'If you encounter any problems while using Media Studio AI, or you have feature suggestions, feel free to contact the developer using any of the methods below. We will try our best to reply and keep improving the tool.',

    method1Title: 'Method 1: Contact via WeChat QR code',
    method1Desc:
      'Scan the QR code in WeChat to add support / follow the official account, then send “Media Studio AI” and describe your issue.',

    method2Title: 'Method 2: Send an email',
    method2Desc:
      'If you want to describe the issue in detail, with screenshots or logs, you can contact us by email:',

    emailCopy: 'Copy',
  },
}
