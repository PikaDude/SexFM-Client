<template>
    <div class="flex flex-col gap-1 text-center">
        <span class="text-lg leading-none select-text">{{ metadata.metadata['current-track'].title }}</span>
        <span class="leading-none select-text">{{ metadata.metadata['current-track'].artist }}</span>
    </div>
</template>

<script lang="ts">
export default defineComponent({
    setup() {
        return { metadata: useMetadataStore() };
    },
});
</script>
