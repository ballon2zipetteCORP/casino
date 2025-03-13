<script setup lang="ts">
import { RouterView } from 'vue-router'
import BaseHeader from './components/layout/BaseHeader.vue';
import BaseFooter from './components/layout/BaseFooter.vue';
import BaseToast from "./components/ui/BaseToast.vue";

import { useAuthenticationStore } from './stores/useAuthenticationStore';

useAuthenticationStore().authenticate();
</script>

<template>


  <base-toast />
  <base-header />
  <main>
    <router-view />
  </main>
  <base-footer />
</template>