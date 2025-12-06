<script setup lang="ts">
const pageTitle = '隐私政策 Privacy Policy - Media Studio AI'

useSeoMeta({
  title: pageTitle,
  description:
    'Media Studio AI 隐私政策：说明本工具如何处理和保护用户数据。Media Studio AI 为本地运行的跨平台 AI 媒体工具箱，不收集、不上传用户的个人信息和视频内容。'
})
</script>

<template>
  <main class="mx-auto max-w-3xl px-4 py-10 text-slate-800">
    <h1 class="mb-6 text-2xl font-semibold">
      Media Studio AI 隐私政策（Privacy Policy）
    </h1>
    <p class="mb-2 text-sm text-slate-500">
      最近更新日期：2025-12-03
    </p>

    <!-- 英文简要摘要（给审核和海外用户看） -->
    <section class="mb-6 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
      <p class="font-semibold mb-1">English Summary</p>
      <p class="leading-relaxed">
        Media Studio AI is a locally running, cross-platform AI media toolkit.  
        The app does not collect, store or upload any personal data or media content.
        All operations such as parsing M3U8, downloading TS segments and merging MP4
        are processed on your own device. We do not use any tracking SDK, analytics
        services, or cloud storage. For details, please refer to the Chinese sections below.
      </p>
    </section>

    <p class="mb-6 text-sm leading-relaxed">
      欢迎使用 <strong>Media Studio AI</strong>（下称“本应用”）。本隐私政策旨在说明本应用如何处理与保护您的信息。
      Media Studio AI 是一款本地运行的跨平台 AI 媒体工具箱，目前主要提供 Windows 版本，用于解析 M3U8、下载 TS
      切片并合并为 MP4。我们非常重视您的隐私和数据安全。
    </p>

    <!-- 一 -->
    <section class="mb-6">
      <h2 class="mb-2 text-lg font-semibold">一、我们不收集哪些信息</h2>
      <p class="mb-2 text-sm leading-relaxed">
        使用本应用时，我们<strong>不会收集、存储、传输或分享</strong>任何可识别您个人身份的信息。本应用不会向开发者或任何第三方上传您在本地的使用数据。
      </p>
      <p class="mb-2 text-sm">具体包括但不限于：</p>
      <ul class="list-disc pl-5 text-sm leading-relaxed">
        <li>不收集您的姓名、电话号码、邮箱地址等身份信息；</li>
        <li>不收集账户信息、支付信息或任何登录凭证；</li>
        <li>不收集设备唯一标识符、浏览历史或使用习惯；</li>
        <li>不记录您输入的任意视频链接、M3U8 地址或下载内容；</li>
        <li>不在云端保存您下载的任何文件或播放记录。</li>
      </ul>
    </section>

    <!-- 二 -->
    <section class="mb-6">
      <h2 class="mb-2 text-lg font-semibold">二、本地处理原则</h2>
      <p class="mb-2 text-sm leading-relaxed">
        Media Studio AI 的核心设计理念是：<strong>所有操作尽可能在本地完成</strong>。在正常使用过程中，本应用仅在您的设备上执行以下操作：
      </p>
      <ul class="list-disc pl-5 text-sm leading-relaxed">
        <li>解析您提供的网页或 M3U8 地址；</li>
        <li>下载并处理 TS 等媒体切片文件；</li>
        <li>在本地合并并转换为 MP4 或其他格式；</li>
        <li>在界面展示下载进度、日志等本地信息。</li>
      </ul>
      <p class="mt-2 text-sm leading-relaxed">
        以上操作均在您的电脑本地完成，本应用不会将您的媒体内容上传至任何服务器。
      </p>
    </section>

    <!-- 三 -->
    <section class="mb-6">
      <h2 class="mb-2 text-lg font-semibold">三、网络请求与更新检查</h2>
      <p class="mb-2 text-sm leading-relaxed">
        在某些版本中，本应用可能会向官方服务器发起<strong>版本更新检查</strong>，以便通知您有新版本可用。此类请求仅用于获取：
      </p>
      <ul class="list-disc pl-5 text-sm leading-relaxed">
        <li>最新版本号；</li>
        <li>更新内容简介；</li>
        <li>下载页面或更新包地址。</li>
      </ul>
      <p class="mt-2 text-sm leading-relaxed">
        在此过程中，我们不会上传您的个人信息、媒体内容或其他使用数据。若您不希望进行更新检查，可以在防火墙或网络层面自行限制本应用访问互联网。
      </p>
    </section>

    <!-- 四 -->
    <section class="mb-6">
      <h2 class="mb-2 text-lg font-semibold">四、第三方网站与内容</h2>
      <p class="mb-2 text-sm leading-relaxed">
        您在本应用中输入的任何网页链接、M3U8 地址或其他资源地址，均由您自行提供。这些链接可能指向第三方网站或服务，其隐私政策由对应网站或服务提供方负责。
      </p>
      <p class="text-sm leading-relaxed">
        我们不控制也不对第三方网站的内容与隐私做出承诺。使用任何第三方资源前，请您自行确认其合法性，并仔细阅读相关隐私政策与使用条款。
      </p>
    </section>

    <!-- 五 -->
    <section class="mb-6">
      <h2 class="mb-2 text-lg font-semibold">五、数据安全</h2>
      <p class="mb-2 text-sm leading-relaxed">
        由于本应用不收集您的个人数据，也不保存云端信息，因此不存在通过我们的服务器泄露您数据的风险。
      </p>
      <p class="text-sm leading-relaxed">
        您下载和生成的所有文件都存储在您的本地设备中，其安全性取决于您的操作系统、安全软件、防病毒软件以及个人使用习惯。我们建议您妥善管理设备与本地文件，避免在公共或不安全环境中使用。
      </p>
    </section>

    <!-- 六 -->
    <section class="mb-6">
      <h2 class="mb-2 text-lg font-semibold">六、未成年人使用</h2>
      <p class="text-sm leading-relaxed">
        本应用面向具备完全民事行为能力的用户设计，不针对未成年人主动提供服务。由于本应用不收集任何个人数据，我们不会主动识别或区分用户年龄。如果您是未成年人，请在监护人指导下使用本应用。
      </p>
    </section>

    <!-- 七 -->
    <section class="mb-6">
      <h2 class="mb-2 text-lg font-semibold">七、本政策的更新</h2>
      <p class="text-sm leading-relaxed">
        随着本应用功能的更新或法律法规的变化，我们可能会适时调整本隐私政策。更新后的版本将发布在本页面，并以“最近更新日期”标注。除非另有特别说明，修改后的隐私政策自发布之日起生效。
      </p>
    </section>

    <!-- 八 -->
    <section class="mb-10">
      <h2 class="mb-2 text-lg font-semibold">八、联系我们</h2>
      <p class="mb-2 text-sm leading-relaxed">
        如果您对本隐私政策或 Media Studio AI 的使用有任何疑问、建议或需求，欢迎通过以下方式联系开发者：
      </p>
      <ul class="list-disc pl-5 text-sm leading-relaxed">
        <li>
          邮箱：
          <a href="mailto:daoa96021@gmail.com" class="text-blue-600 hover:underline">
            daoa96021@gmail.com
          </a>
        </li>
        <li>
         官方网站：
          <a href="https://tool8s.com" class="text-blue-600 hover:underline">
            https://tool8s.com
          </a>
        </li>
      </ul>
      <p class="mt-3 text-xs text-slate-500">
        请在邮件中尽量说明您使用的系统版本、应用版本以及遇到的问题，方便我们进行排查与改进。
      </p>
    </section>
  </main>
</template>
