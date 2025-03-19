<template>
    <BaseModal @close="emit('close')" title="Obtenir des zipettes coins">
        <div class="reward">
            <h2>Récompense journalière <span>(2 500 ZPC)</span></h2>
            <button @click="claimReward" :disabled="!canGetReward" class="primary">
                <template v-if="canGetReward">
                    Réclamer ma récompense
                </template>
                <template v-else>
                    Prochaine récompense dans {{ nextRewardAt }}
                </template>
                <mdicon name="gift" />
            </button>
        </div>
    </BaseModal>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import BaseModal from '../ui/modals/BaseModal.vue';
import { storeToRefs } from 'pinia';
import { useAuthenticationStore } from '@/stores/useAuthenticationStore';
import useAPIRequest from '@/composables/useAPIRequest';

const emit = defineEmits(["close"]);
const now = ref<number>(Date.now());
const {me} = storeToRefs(useAuthenticationStore());

const nextRewardAt = computed(() => {
    const _format = (number: number) => number.toString().padStart(2, "0");

    const nextReward = me.value?.nextRewardAt ? new Date(me.value?.nextRewardAt) : null;
    if(nextReward) {
        const diff = new Date(nextReward.getTime()-now.value);
        return `${_format(24-(diff.getHours()+1))}:${_format(diff.getMinutes())}:${_format(diff.getSeconds())}`;
    }
    return '';
});
const canGetReward = computed(() => {
    if(!me.value) return false;
    const nextRewardAt = new Date(me.value.nextRewardAt);
    if(!nextRewardAt) return true;
    return nextRewardAt.getTime() <= Date.now()
});

const claimReward = async () => {
    if(!me.value) return;
    const {handleRequest} = useAPIRequest<{
        rewarded: boolean; 
        amount: number;
        nextRewardAt: Date;
    }>({ method: "POST", endpoint: "/me/daily-reward" });

    const response = await handleRequest();
    if(response) {
        me.value.nextRewardAt = response.nextRewardAt;
        me.value.zipetteCoins+=response.amount;
    }
}

onMounted(() => {
    setInterval(() => now.value = Date.now(), 1e3);
})
</script>

<style scoped>
div.reward {
    &>h2 {
        margin-top: 1em;
        font-family: "poppins-medium", sans-serif;

        &>span {
            color: var(--gray-3);
            font-size: .7em;
        }
    }
    &>p {
        color: var(--gray-3);
    }
    &>button.primary {
        margin-top: .5em;

        display: flex;
        align-items: center;
        gap: 1em;
    }
}
</style>