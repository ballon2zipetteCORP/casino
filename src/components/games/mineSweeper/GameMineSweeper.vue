<template>
    <BaseGame>
        <h2>Chasse au trésor</h2>
        <MineSweeperFrame />
    </BaseGame>
</template>

<script setup lang="ts">
import BaseGame from '../BaseGame.vue';
import MineSweeperFrame from './MineSweeperFrame.vue';
</script>

<style scoped>
h2 {
    font-family: "poppins-bold", sans-serif;
    text-align: center;
}
</style>