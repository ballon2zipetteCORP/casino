<script setup lang="ts">
import LoginRequired from '../ui/LoginRequired.vue';
import MobileOrientationRequirement from '../utils/MobileOrientationRequirement.vue';

defineProps({
    landscapeRequired: {
        type: Boolean,
        default: false
    }
});
</script>

<template>
    <LoginRequired />
    <template v-if="landscapeRequired">
        <MobileOrientationRequirement>
            <slot />
        </MobileOrientationRequirement>
    </template>
    <template v-else>
        <slot />
    </template>
</template>