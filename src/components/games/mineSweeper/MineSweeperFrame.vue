<template>
    <div class="game-frame">
        <div class="cols" v-for="(_, index) in new Array(NB_COL)" :key="index">
            <div @click="() => reveal(index, jindex)" class="rows" v-for="(_, jindex) in new Array(NB_ROW)" :key="jindex+index">
                <img 
                    v-if="!reveledGrid[index][jindex]" 
                    alt="chest" 
                    src="/images/games/mineSweeper/chest.png" 
                />
                <img v-else alt="reveled items" :src="`/images/games/mineSweeper/${SYMBOLS[grid[index][jindex]]}.png`" />
            </div>
        </div>

        <div class="footer">
            <button>Jouer</button>
            <div>
                <!-- BET -->
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const NB_COL = 6;
const NB_ROW = 6;
const SYMBOLS: string[] = ["bomb", "diamond", "coin", "crown"];

const grid = ref<number[][]>([
    [0, 1, 1, 1, 0, 1],
    [0, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 2, 1],
    [0, 1, 1, 0, 1, 1],
    [0, 1, 1, 1, 1, 3],
    [0, 1, 1, 1, 1, 0]
]);
const reveledGrid = ref<boolean[][]>([
    [false, false, false, false, false, false],
    [false, false, false, false, false, false],
    [false, false, false, false, false, false],
    [false, false, false, false, false, false],
    [false, false, false, false, false, false],
    [false, false, false, false, false, false]
]);

const reveal = (i: number, j: number) => {
    reveledGrid.value[i][j] = true;
}
</script>

<style scoped>
div.game-frame {
    margin: auto;
    margin-top: 1em;
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