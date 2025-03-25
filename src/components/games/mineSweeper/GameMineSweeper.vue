<template>
    <BaseGame :landscape-required="true">
        <MineSweeperFrame />
    </BaseGame>
</template>

<script setup lang="ts">
import BaseGame from '../BaseGame.vue';
import MineSweeperFrame from './MineSweeperFrame.vue';
</script>
