<script setup lang="ts">
import { RouterView } from "vue-router";
import BaseFooter from "./components/layout/BaseFooter.vue";
import BaseHeader from "./components/layout/BaseHeader.vue";
import BaseToast from "./components/ui/BaseToast.vue";
import BaseChat from '@/components/chat/BaseChat.vue';

import { storeToRefs } from 'pinia';
import { useWebsocketStore } from '@/stores/useWebsocketStore';
import { useAuthenticationStore } from "./stores/useAuthenticationStore";
import { ref, watch } from "vue";
import { userChatStore } from "./stores/useUserChat";

const isShown = ref<boolean>(false);
const {actualGame} = storeToRefs(useWebsocketStore());

useAuthenticationStore().authenticate();

watch(actualGame, value => {
  if(value) {
    isShown.value = true;
    userChatStore().init();
  }
})
</script>

<template>
  <base-toast />
  <base-header />
  <main>
    <router-view />
    <!-- <base-chat v-show="isShown" /> -->
  </main>
  <base-footer />
</template>
