<script setup lang="ts">
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import LoginRequired from "../ui/LoginRequired.vue";
import MobileOrientationRequirement from "../utils/MobileOrientationRequirement.vue";

const { landscapeRequired, isInBeta } = defineProps({
  landscapeRequired: {
    type: Boolean,
    default: false,
  },
  isInBeta: {
    type: Boolean,
    default: false,
  },
});

import router from "@/router";
import { storeToRefs } from "pinia";
import { computed, watch } from "vue";

const { me, isLoading, isAuthenticated } = storeToRefs(
  useAuthenticationStore()
);

const isAuthorized = computed(() => {
  return (
    (isAuthenticated.value &&
      (me.value?.groups.includes("/staff") ||
        me.value?.groups.includes("/beta-testeur"))) ||
    !isInBeta
  );
});

watch(
  [me, isLoading],
  ([value, loading]) => {
    if (loading) return;

    if (!isAuthorized.value) {
      return router.push({ name: "home" });
    }
  },
  { immediate: true }
);
</script>

<template>
  <LoginRequired />
  <template v-if="landscapeRequired && isAuthorized">
    <MobileOrientationRequirement>
      <slot />
    </MobileOrientationRequirement>
  </template>
  <template v-else-if="isAuthorized">
    <slot />
  </template>
</template>
