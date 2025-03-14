<template>
    <BaseGame>
        <div class="center">
            <game-wheel-spin :next-spin="nextSpin" @on-result="showResult" ref="spinRef" />
            <game-wheel-table ref="tableRef" />
        </div>
    </BaseGame>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, ref, watch } from 'vue';

import GameWheelTable from './GameWheelTable.vue';
import GameWheelSpin from './GameWheelSpin.vue';

import { useWebsocketStore } from '@/stores/useWebsocketStore';
import { storeToRefs } from 'pinia';
import { useAuthenticationStore } from '@/stores/useAuthenticationStore';
import BaseGame from '../BaseGame.vue';

const { me } = storeToRefs(useAuthenticationStore());

const spinRef = ref<typeof GameWheelSpin|null>(null);
const tableRef = ref<typeof GameWheelTable|null>(null);
const nextSpin = ref<Date|null>(null);

const amountWon = ref<number>(0);
const hasLost = ref<boolean>(false);

const handleMessages = () => {  
    useWebsocketStore().addMessageListener(message => {
        switch(message.type) {
            case "INFORMATION":
                nextSpin.value = new Date(message.data?.nextSpin);
                break;
            case "START_SPINNING":
                spinRef?.value?.spin(message.data?.number);
                break;
            case "REWARD":
                amountWon.value = message.data?.amount ?? 0;
                break;
            case "BET_LOST":
                hasLost.value = true;
                break;
        }
    });
}

const showResult = () => {
    if(amountWon.value > 0) {
        me.value!.zipetteCoins += amountWon.value;
        window.toast({
            level: "INFO",
            title: "Vous avez gagné " + amountWon.value + " ZPC !"
        });
    } else if(hasLost.value) {
        window.toast({
            level: "INFO",
            title: "Tu as perdu tous vos zipette coins...",
            subtitle: "Grosse merde"
        });
    }
    
    reset();
}

const reset = () => {
    hasLost.value = false;
    amountWon.value = 0;
    tableRef?.value?.resetUserSelection();
}

watch(me, value => {
    if(value) {
        useWebsocketStore().connect("EUROPEAN_ROULETTE");
        handleMessages();
    }
}, {immediate: true});

onBeforeUnmount(() => {
    // TODO: quand on revient en arrière, il faudrait remettre la somme misée si elle n'a pas été jouée
    useWebsocketStore().close();
})
</script>

<style scoped>
div.center {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3em;
}
</style>