<template></template>

<script lang="ts" setup>
import Phaser from 'phaser';
import ComputerScene from '@/scenes/wheel/ComputerScene';

new Phaser.Game({
    type: Phaser.AUTO,
    width: 900,
    height: 400,
    backgroundColor: "#3C9043",
    scene: ComputerScene
});
</script>