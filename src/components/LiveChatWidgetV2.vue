<script setup>
import {onMounted} from 'vue';

const LIVECHAT_LICENSE = 19931932;
const SCRIPT_ID = 'livechat-widget-script';

const initLiveChat = () => {
  window.__lc = window.__lc || {}
  window.__lc.license = LIVECHAT_LICENSE
  window.__lc.integration_name = 'manual_channels'
  window.__lc.product_name = 'livechat'

  if (document.getElementById(SCRIPT_ID)) {
    return
  }

  const script = document.createElement('script')
  script.id = SCRIPT_ID
  script.async = true
  script.type = 'text/javascript'
  script.src = 'https://cdn.livechatinc.com/tracking.js'

  document.head.appendChild(script)
}

onMounted(() => {
    initLiveChat();
});
</script>

<template>
    <!--
        Mobile custom position:
        right: 12px
        top: 50%
    -->
    <noscript>
        <a
            href="https://www.livechat.com/chat-with/19931932/"
            rel="nofollow"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="h-6 w-6"
            >
              <path
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75a9.707 9.707 0 0 1-4.431-1.063L3 21l.313-4.569A9.707 9.707 0 0 1 2.25 12Z"
              />
            </svg>
        </a>
    </noscript>
</template>
