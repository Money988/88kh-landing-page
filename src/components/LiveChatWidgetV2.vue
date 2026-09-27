<script setup>
import {onMounted} from 'vue';

const LIVECHAT_LICENSE = 19931932;
const SCRIPT_ID = 'livechat-widget-script';

const initLiveChat = () => {
    window.__lc = window.__lc || {};
    window.__lc.license = LIVECHAT_LICENSE;
    window.__lc.integration_name = 'manual_channels';
    window.__lc.product_name = 'livechat';

    if (!window.LiveChatWidget) {
        const queue = [];

        const call = (args) => {
            if (widget._h) {
                return widget._h.apply(null, args);
            }

            queue.push(args);
        };

        const widget = {
            _q: queue,
            _h: null,
            _v: '2.0',

            on(...args) {
                call(['on', args]);
            },

            once(...args) {
                call(['once', args]);
            },

            off(...args) {
                call(['off', args]);
            },

            get(...args) {
                if (!widget._h) {
                    throw new Error(
                        "[LiveChatWidget] You can't use getters before load."
                    );
                }

                return call(['get', args]);
            },

            call(...args) {
                call(['call', args]);
            },
        };

        window.LiveChatWidget = widget;
    }

    if (document.getElementById(SCRIPT_ID)) {
        return;
    }

    const script = document.createElement('script');

    script.id = SCRIPT_ID;
    script.async = true;
    script.type = 'text/javascript';
    script.src = 'https://cdn.livechatinc.com/tracking.js';

    document.head.appendChild(script);
};

const openLiveChat = () => {
    window.LiveChatWidget?.call('maximize');
};

onMounted(() => {
    initLiveChat();

    const websiteName = 'Guest';

    window.LiveChatWidget.on('ready', () => {
        window.LiveChatWidget.call(
            'set_customer_name',
            `${websiteName}`,
        );

        window.LiveChatWidget.call('set_session_variables', {
            Domain: websiteName,
            Origin: window.location.origin,
        });

        window.LiveChatWidget.call('hide');
    });
});
</script>

<template>
    <!--
        Mobile custom position:
        right: 12px
        top: 50%
    -->
    <button
        type="button"
        class="
            fixed right-3 bottom-3 z-[99999]
            flex h-12 w-12 -translate-y-1/2
            items-center justify-center
            rounded-full bg-blue-600 text-white
            shadow-lg
            md:bottom-5 md:right-5 md:top-auto md:translate-y-0
        "
        @click="openLiveChat"
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
    </button>

    <noscript>
        <a
            href="https://www.livechat.com/chat-with/19931932/"
            rel="nofollow"
        >
            Chat with us
        </a>
    </noscript>
</template>
