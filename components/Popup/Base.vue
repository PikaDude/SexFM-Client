<template>
    <div
        class="z-20 flex justify-center items-center bg-black bg-opacity-50 w-full h-full"
    >
        <div
            class="flex flex-col justify-between gap-4 bg-white p-4 sex-border rounded-lg w-[90%] h-full max-h-[90%]"
        >
            <p class="bg-sexfm sex-shadow sox-shadow p-2 rounded-sm sex-outline outline-sexfm-300 text-white text-xl xs:text-3xl text-center leading-none">
                {{ title }}
            </p>

            <div class="px-1 overflow-y-auto xs:text-2xl">
                <slot />
            </div>

            <span
                class="button xs:text-2xl"
                @click="close"
            >{{ closeMessage }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { string } from 'vue-types';

export default defineComponent({
    props: {
        title: string().isRequired,
        closeMessage: string().isRequired,
    },
    emits: ['close'],
    methods: {
        close() {
            this.$emit('close');
        },
    },
});
</script>
