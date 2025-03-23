<template>
    <div class="game-frame">
        <div v-if="!gridRevealed" class="before-start">
            <h2>Commencez par mettre des zipette coins</h2>
            <div class="footer">
                <button class="primary" @click="startGame">Jouer</button>
                <UserBetInput v-model="bet" />
            </div>
        </div>
        <h3>Gain potentiel: {{ potentialGain }} ZPC</h3>
        <div v-if="grid.length" class="cols" v-for="(_, index) in new Array(NB_COL)" :key="index">
            <div @click="() => reveal(index, jindex)" class="rows" v-for="(_, jindex) in new Array(NB_ROW)" :key="jindex+index">
                <img 
                    v-if="!reveledGrid[index][jindex]" 
                    alt="chest" 
                    src="/images/games/mineSweeper/chest.png" 
                />
                <img v-else alt="reveled items" :src="`/images/games/mineSweeper/${ITEMS[grid[index][jindex]]}.png`" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import UserBetInput from '@/components/ui/UserBetInput.vue';
import { useAuthenticationStore } from '@/stores/useAuthenticationStore';
import { useWebsocketStore } from '@/stores/useWebsocketStore';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue';

const NB_COL = 6;
const NB_ROW = 6;
const ITEMS: Record<number, string> = { "-1": "empty", 0: "bomb", 1: "key", 2: "diamond", 3: "coin", 4: "crown" };

const gridRevealed = ref(false);
const {me} = storeToRefs(useAuthenticationStore());

const bet = ref<number>(0);

const grid = ref<number[][]>([]);
const reveledGrid = ref<boolean[][]>([]);
const potentialGain = ref<number>(0);

const startGame = () => {
    useWebsocketStore().send({
        type: "START_GAME",
        data: { bet: bet.value }
    });
}
const reveal = (i: number, j: number) => {
    useWebsocketStore().send({
        type: "REVEAL",
        data: { col: i, row: j }
    });
}

const init = () => {
    grid.value = [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
    ];
    reveledGrid.value = [
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false]
    ];
}
const reset = () => {
    gridRevealed.value = false;
    potentialGain.value = 0;
}

const handleMessages = () => {  
    useWebsocketStore().addMessageListener(message => {
        switch(message.type) {
            case "REVEAL_CASE":
                const {col, row, id} = message.data;
                grid.value[col][row] = id;
                reveledGrid.value[col][row] = true
                break;
            case "SHOW_GRID":
                me.value!.zipetteCoins -= bet.value;
                gridRevealed.value = true;
                init();
                break;
            case "HAS_WON":
                const {totalWon} = message.data;
                me.value!.zipetteCoins += totalWon;
                window.toast({
                    level: "INFO",
                    title: "Vous avez gagné " + totalWon + " ZPC !"
                })
                reset();
                break;
            case "HAS_LOST":
                window.toast({
                    level: "INFO",
                    title: "Vous avez perdu"
                });
                reset();
                break;
            case "BONUS":
                const {coef, amountWon, totalWon: gain} = message.data;
                potentialGain.value = gain;
                let label;

                if(coef) {
                    label = "x"+coef;
                } else if(amountWon) {
                    label = "+"+amountWon+" ZPC"
                }

                // TODO: show label
                break;
        }
    })
}

watch(me, value => {
    if(value) {
        useWebsocketStore().connect("MINE_SWEEPER");
        handleMessages();
    }
}, {immediate: true});

onMounted(() => {
    init();
})
</script>

<style scoped>
div.game-frame {
    margin: auto;
    margin-top: 1em;
    position: relative;
    width: fit-content;
}
div.cols, div.rows {
    display: flex;
    gap: 1em;
}
div.rows {
    cursor: pointer;
    &>img {
        width: 6em;
        height: 6em;
    }
}
</style>