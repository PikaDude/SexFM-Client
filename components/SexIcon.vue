<template>
    <Icon
        v-if="size == 'sm'"
        :name="name"
        class="w-4 h-4 xs:w-5 xs:h-5 xs:m-1"
    />
    <Icon
        v-else
        :name="name"
        class="w-16 h-16 xs:w-20 xs:h-20 xs:m-2"
    />
</template>

<script lang="ts">
import { oneOf, string } from 'vue-types';

export default defineComponent({
    props: {
        name: string().isRequired,
        size: oneOf<'sm' | 'lg'>(['sm', 'lg']).def('sm'),
    },
});
</script>
