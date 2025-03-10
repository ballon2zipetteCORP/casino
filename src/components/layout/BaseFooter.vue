<template>
    <footer>
        &copy; Casino2zipette {{  new Date().getFullYear() }} | v{{ packageJSON.version }}
    </footer>
</template>

<script lang="ts" setup>
import packageJSON from "../../../package.json";
</script>

<style scoped>
footer {
    text-align: center;
    padding: 1.5em 0;
    margin-top: 2em;

    background-color: var(--gray-1);
}
</style>