<script setup lang="ts">
import { RouterView } from 'vue-router'
import BaseHeader from './components/layout/BaseHeader.vue';
import { useAuthenticationStore } from './stores/useAuthenticationStore';

//useAuthenticationStore().login();
</script>

<template>
  <base-header />
  <router-view />
</template>