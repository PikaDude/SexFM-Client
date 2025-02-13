<template>
    <div
        class="button"
        :style="{ cursor: (!paused && loading) ? 'wait' : 'pointer', borderWidth: '3px' }"
    >
        <SexIcon
            v-show="paused"
            name="material-symbols:play-arrow"
            size="lg"
        />
        <SexIcon
            v-show="!paused && !loading"
            name="material-symbols:pause"
            size="lg"
        />
        <SexIcon
            v-show="!paused && loading"
            name="eos-icons:hourglass"
            size="lg"
        />
    </div>
</template>

<script lang="ts">
import { bool } from 'vue-types';

export default defineComponent({
    props: {
        paused: bool().isRequired,
        loading: bool().isRequired,
    },
});
</script>
