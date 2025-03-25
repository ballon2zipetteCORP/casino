<template>
    <div class="parent">
        <div v-if="!gridRevealed" class="before-start">
            <h2>Chasse au zipette coins</h2>
            <UserBetInput v-model="bet" />
            <button class="secondary" @click="startGame">Jouer</button>
        </div>
        <div class="game-frame" v-else>
            <div class="potential-gain">
                <h3>Gain potentiel <span>{{ potentialGain }} ZPC</span></h3>
            </div>
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
            <button @click="cashOut" class="cash-out secondary">
                Retirer
                <mdicon name="check-bold" />
            </button>

            <h3 v-show="bonusShown" ref="bonusRef" class="bonus">{{ bonusLabel }}</h3>
        </div>
        <button :disabled="me?.zipetteCoins! < bet" @click="ruleRef?.show"class="rules">
            Comment jouer ?
        </button>
    </div>
    <MineSweeperRules ref="ruleRef" />
</template>

<script lang="ts" setup>
import UserBetInput from '@/components/ui/UserBetInput.vue';
import { useAuthenticationStore } from '@/stores/useAuthenticationStore';
import { useWebsocketStore } from '@/stores/useWebsocketStore';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue';
import MineSweeperRules from './MineSweeperRules.vue';

const NB_COL = 6;
const NB_ROW = 6;
const ITEMS: Record<number, string> = { "-1": "empty", 0: "bomb", 1: "ruby-chest", 3: "silver-chest", 2: "golden-chest" };

const gridRevealed = ref(false);
const {me} = storeToRefs(useAuthenticationStore());

const ruleRef = ref<undefined|typeof MineSweeperRules>(undefined);

const bet = ref<number>(300);

const grid = ref<number[][]>([]);
const reveledGrid = ref<boolean[][]>([]);
const potentialGain = ref<number>(0);

const bonusShown = ref<boolean>(false);
const bonusLabel = ref<string>("");
const bonusRef = ref<HTMLTitleElement|undefined>(undefined);

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

const showBonus = (label: string) => {
    const close = () => {
        bonusShown.value = false;

        // bonusRef.value?.classList.add("close");
        // setTimeout(() => {
        //     bonusShown.value = false;
        //     bonusRef.value?.classList.remove("close");
        // }, 1e3/2);
    }

    bonusLabel.value = label;
    bonusShown.value = true;
    setTimeout(() => close(), 1e3);
}

const cashOut = () => {
    useWebsocketStore().send({
        type: "CASHOUT"   
    });
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
            case "CASHED_OUT":
                const {totalWon} = message.data;
                me.value!.zipetteCoins += totalWon;
                window.toast({
                    level: "INFO",
                    title: "Vous avez retiré " + totalWon + " ZPC !",
                    subtitle: "Sage décision"
                })
                reset();
                break;
            case "HAS_LOST":
                window.toast({
                    level: "INFO",
                    title: "Vous avez tout perdu",
                    subtitle: "T'as quand même perdu pas mal"
                });
                reset();
                break;
            case "BONUS":
                const {coef, amountWon, totalWon: gain} = message.data;
                potentialGain.value = gain;
                let label;

                if(coef) {
                    label = "x"+coef.toFixed(2);
                } else if(amountWon) {
                    label = "+"+amountWon+" ZPC"
                }
                showBonus(label!);
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
div.parent {
    position: relative;
    margin-top: 4em;

    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
}
button.rules {
    margin-top: .5em;
    text-decoration: underline;
}
div.before-start {
    width: 35em;

    margin: auto;
    background-color: var(--gray-1);

    border-radius: 20px;
    padding: 2em 3em;

    &>h2 {
        text-align: center;
        font-family: "poppins-bold", sans-serif;
        margin-bottom: 1em;
    }
    &>button {
        margin: auto;
        margin-top: 1.5em;
    }
}
div.game-frame {
    margin: auto;
    position: relative;
    width: fit-content;
    padding: 1em;
    border-radius: 20px;

    background-color: var(--gray-1);
    border: 3px solid var(--gray-2);
    margin-bottom: 4em;
}
div.game-frame div.potential-gain {
    position: absolute;
    top: -2em;
    left: 50%;

    transform: translateX(-50%);

    &>h3 {
        position: absolute;
        top: 50%;
        left: 50%;

        transform: translate(-50%, -50%);
        text-align: center;
        border: 3px solid var(--gray-2);

        width: 10em;

        background-color: var(--gray-1);
        border-radius: 20px;
        padding: .5em;
        font-size: 1.4em;

        font-family: "poppins-bold", sans-serif;


        &>span {
            display: block;
        }
    }

    &>img {
        width: 25em;
        position: absolute;
        top: 50%;
        left: 50%;

        transform: translate(-50%, -50%);
    }
}
div.cols, div.rows {
    display: flex;
    position: relative;
    z-index: 9;
}
div.rows {
    cursor: pointer;


    &.odd {
        background-color: var(--gray-2);
        border-radius: 20px;    
    }

    &>img {
        width: 6em;
        height: 6em;
    }
}
button.cash-out {
    position: absolute;
    bottom: -3em;
    left: 50%;

    transform: translate(-50%, -50%);

    display: flex;
    align-items: center;
    gap: .5em;
}

h3.bonus {
    animation: bonus-appear 1s forwards;

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    z-index: 999;

    font-family: "poppins-bold", sans-serif;
    color: white;
}

@keyframes bonus-appear {
    from {
        transform: scale(0);
        opacity: 0;
    }
    to {
        transform: scale(4);
        opacity: 1;
    }
}
</style>