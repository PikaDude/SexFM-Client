<template>
    <div
        class="flex justify-center items-center gap-2 px-[10px!important] border button"
        @click="popups.lastPlayed = true"
    >
        <SexIcon
            name="material-symbols:menu"
        />
        <span class="xs:text-2xl">Last Played</span>
    </div>
</template>

<script lang="ts">
export default defineComponent({
    setup() {
        return { popups: usePopupsStore() };
    },
});
</script>
