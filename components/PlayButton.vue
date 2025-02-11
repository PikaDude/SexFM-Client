<template>
    <div
        class="border-2 button"
        :style="{ cursor: (!paused && loading) ? 'wait' : 'pointer' }"
    >
        <Icon
            v-show="paused"
            name="material-symbols:play-arrow"
            size="64"
        />
        <Icon
            v-show="!paused && !loading"
            name="material-symbols:pause"
            size="64"
        />
        <Icon
            v-show="!paused && loading"
            name="eos-icons:hourglass"
            size="64"
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
