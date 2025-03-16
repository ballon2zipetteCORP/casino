<template>
  <footer>
    &copy; Casino2zipette {{ new Date().getFullYear() }} | v{{
      packageJSON.version
    }}
    |
    <RouterLink :to="{ name: 'legal.cgu' }"
      >Conditions générale d'utilisation</RouterLink
    >
    |
    <RouterLink :to="{ name: 'legal.mentions-legales' }"
      >Mentions légales</RouterLink
    >
    |
    <RouterLink :to="{ name: 'legal.politique-de-confidentialite' }"
      >Politique de confidentialité</RouterLink
    >
  </footer>
</template>

<script lang="ts" setup>
import packageJSON from "../../../package.json";
</script>

<style scoped>
footer {
  text-align: center;
  padding: 1.5em 0;
  margin-top: auto;

  background-color: var(--gray-1);
}
a {
  color: var(--gray-3);
}
</style>
