<script setup lang="ts">
import { RouterView } from 'vue-router'
import BaseHeader from './components/layout/BaseHeader.vue';
import BaseFooter from './components/layout/BaseFooter.vue';

import { useAuthenticationStore } from './stores/useAuthenticationStore';

useAuthenticationStore().authenticate();
</script>

<template>
  <base-header />
  <router-view />
  <base-footer />
</template>