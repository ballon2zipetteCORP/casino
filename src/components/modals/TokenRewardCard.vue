<template>
    <div class="reward">
        <h2>{{ reward.title }} <span>({{ reward.amount }} ZPC)</span></h2>
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
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthenticationStore } from '@/stores/useAuthenticationStore';
import useAPIRequest from '@/composables/useAPIRequest';

const now = ref<number>(Date.now());
const {me} = storeToRefs(useAuthenticationStore());

export type RewardType = "DAILY"|"HOURLY"|"WEEKLY";
interface IReward {
    title: string;
    amount: number;
    meRewardField: string;
    endpoint: string;
}

const RewardMapper: Record<RewardType, IReward> = {
    "DAILY": {
        title: "Récompense journalière",
        amount: 2500,
        meRewardField: "nextRewardAt",
        endpoint: "/me/daily-reward"
    },
    "HOURLY": {
        title: "Rétribution chaque heure",
        amount: 200,
        meRewardField: "nextHourlyRewardAt",
        endpoint: "/me/hourly-reward"
    },
    "WEEKLY": {
        title: "Récompense hébdomadaire",
        amount: 3_500,
        meRewardField: "nextWeeklyRewardAt",
        endpoint: "/me/weekly-reward"
    }
}
const props = defineProps<{ type: RewardType }>();
const reward = ref<IReward>(RewardMapper[props.type]);

onMounted(() => {
    setInterval(() => now.value = Date.now(), 1e3);
})

const nextRewardAt = computed(() => {
    const _format = (number: number) => number.toString().padStart(2, "0");

    const nextReward = (me.value as any)?.[reward.value.meRewardField] 
        ? new Date((me.value as any)?.[reward.value.meRewardField]) 
        : null;
    if(nextReward) {
        const diff = new Date(nextReward.getTime()-now.value);
        if(props.type === "DAILY") {
            return `${_format(24-(diff.getHours()+1))}:${_format(diff.getMinutes())}:${_format(diff.getSeconds())}`; 
        } else if(props.type == "HOURLY") {
            return `${_format(diff.getMinutes())}:${_format(diff.getSeconds())}`;
        } else if(props.type === "WEEKLY") {
            return `${_format(diff.getDate()-1)}:${_format(24-(diff.getHours()+1))}:${_format(diff.getMinutes())}:${_format(diff.getSeconds())}`;
        }
    }
    return '';
});
const canGetReward = computed(() => {
    if(!me.value) return false;
    const nextRewardAt = new Date((me.value as any)[reward.value.meRewardField]);
    if(!nextRewardAt) return true;
    return nextRewardAt.getTime() <= Date.now()
});

const claimReward = async () => {
    if(!me.value) return;
    const {handleRequest} = useAPIRequest<{
        amount: number;
        nextRewardAt: Date;
    }>({ method: "POST", endpoint: reward.value.endpoint });

    const response = await handleRequest();
    if(response) {
        (me.value as any)[reward.value.meRewardField] = response.nextRewardAt;
        me.value.zipetteCoins+=response.amount;
    }
}

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