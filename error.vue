<template>
    <div class="bg-white p-2 h-screen">
        <p class="text-4xl">
            Error {{ error?.statusCode || 'Unknown' }}
        </p>
        <a @click="handleError">
            Clear error
        </a>
        <br>
        <code>{{ error }}</code>
    </div>
</template>

<script lang="ts">
import { object } from 'vue-types';
import type { NuxtError } from '#app';

export default defineComponent({
    props: {
        error: object<NuxtError>(),
    },
    methods: {
        handleError() {
            clearError({ redirect: '/' });
        },
    },
});
</script>
