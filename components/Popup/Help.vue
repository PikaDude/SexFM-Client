<template>
    <PopupBase
        title="SexFM Desktop Player"
        close-message="Awesome, I fucking love SexFM"
    >
        <AutoUpdateMessage :info="autoUpdateInfo" />
        <br>
        <p>SexFM's official website can be found at <a @click="sex">sexfm.live</a>. Find all their links there. Click on all of them.</p>
        <br>
        <p>
            This is an <u>UNOFFICIAL</u> SexFM desktop player made by <a
                title="i don't really use social media anymore and don't have anything else to link"
                @click="pikadude"
            >PikaDude</a>.
        </p>
        <p>You can find more information about this player on <a @click="github">GitHub</a>.</p>
        <br>
        <p>Some styles/code/assets were borrowed from the official website that was made by <a @click="dot">Dot</a>.</p>
        <div
            class="flex flex-col items-center"
        >
            <br>
            <img
                class="pixelated"
                src="~/assets/ilovesexfm.gif"
            >
            <br>
            <p>CopySEX 1999</p>
        </div>
    </PopupBase>
</template>

<script lang="ts">
import { open } from '@tauri-apps/plugin-shell';
import { object } from 'vue-types';

export default defineComponent({
    props: {
        autoUpdateInfo: object<AutoUpdateInfo>(),
    },
    methods: {
        dot() {
            open('https://dotagotchi.com/');
        },
        github() {
            open('https://github.com/PikaDude/SexFM-Player');
        },
        pikadude() {
            open('https://bsky.app/profile/pikadude.bsky.social');
        },
        sex() {
            open('https://sexfm.live');
        },
    },
});
</script>
