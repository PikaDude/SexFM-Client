<template>
    <div class="top-0 z-50 absolute w-full xs:text-2xl text-center leading-none">
        <p
            v-if="autoUpdateInfo?.status == 'ready'"
            class="bg-red-300"
        >
            An update will be installed once you exit
        </p>
        <p
            v-if="autoUpdateInfo?.status == 'angry'"
            class="bg-red-300 cursor-pointer"
            @click="autoUpdateInfo.runInstallFunction"
        >
            Click here to install the update
        </p>
        <p
            v-if="playError"
            class="bg-red-300 py-1"
        >
            <SexLink
                link="https://sexfm.live"
                :use-style="false"
            >
                A playback error occurred.<br>Click here to check the radio status.
            </SexLink>
        </p>
    </div>
</template>

<script lang="ts">
import { bool } from 'vue-types';

export default defineComponent({
    props: {
        playError: bool().isRequired,
    },
    setup() {
        return { autoUpdateInfo: useAutoUpdateStore() };
    },
});
</script>
