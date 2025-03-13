<template>
  <home-page />
  <marketing-campaign-home-component />
</template>

<script setup>
import HomePage from '@/components/games/HomePage.vue';
import useMarketing from '@/marketing/useMarketing';
import { shallowRef } from 'vue';

const MarketingCampaignHomeComponent = shallowRef(
  useMarketing().getCurrentCampaign()?.getHomeComponent()
);
</script>