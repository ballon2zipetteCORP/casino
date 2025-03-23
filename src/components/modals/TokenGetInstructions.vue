<template>
    <BaseModal @close="emit('close')" title="Obtenir des zipettes coins">
        <TokenRewardCard :type="reward" v-for="reward in REWARDS" :key="reward" />
    </BaseModal>
</template>

<script lang="ts" setup>
import BaseModal from '../ui/modals/BaseModal.vue';
import TokenRewardCard, { type RewardType } from './TokenRewardCard.vue';

const emit = defineEmits(["close"]);

const REWARDS: RewardType[] = ["HOURLY", "DAILY", "WEEKLY"];
</script>