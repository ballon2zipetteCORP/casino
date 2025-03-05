<template>
    <div class="center">
        <game-wheel-spin />
        <game-wheel-table />
    </div>
</template>

<script lang="ts" setup>
import GameWheelTable from './GameWheelTable.vue';
import GameWheelSpin from './GameWheelSpin.vue';
</script>

<style scoped>
div.center {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3em;
}
</style>