<template>
    <BaseGame>
        <h2>Machine à zipette</h2>
        <p>Si vous avez 4 symboles indiques vous remporter le double du gain misé.</p>

        <div id="slot-machine">
            <div class="slot" :id="`slot-${index}`" v-for="(_, index) in new Array(NB_SLOTS).fill('')" :key="index">
                <div class="slot-inner">
                    <img
                        v-for="(icon, jindex) in [...IMAGE_PATH, ...IMAGE_PATH]" 
                        :key="icon+index+jindex" 
                        :alt="icon" 
                        :src="`/images/games/slotMachine/${icon}.png`"
                    />
                </div>
            </div>
        </div>
        <button @click="startRolling" class="primary">
            Faire tourner <span>(200 ZPC)</span>
        </button>
    </BaseGame>
</template>

<script lang="ts" setup>
import gsap from "gsap";
import BaseGame from '../BaseGame.vue';
import { ref } from "vue";

const NB_SLOTS: number = 4;
const IMAGE_PATH: Array<string> = ["logo","beer", "fire", "knife", "mechant", "no-play", "play"];

const isSpinning = ref<boolean>(false);

const startRolling = () => {
    if(isSpinning.value) return;
    isSpinning.value = true;
    
    const DELAY = 50;
    const SLOT_HEIGHT = 9;

    for(let i = 0; i < NB_SLOTS;i++) {
        // TODO: pick from serve
        const randomNumber = Math.floor(Math.random() * IMAGE_PATH.length);
        setTimeout(() => {
            const slotInner = `#slot-${i} .slot-inner`;

            gsap.to(slotInner, {
                y: `-${IMAGE_PATH.length * SLOT_HEIGHT}em`,
                duration: .5,
                repeat: -1,
                ease: "linear"
            });

            setTimeout(() => {
                gsap.killTweensOf(slotInner);
                const padding = 2;
                const finalPosition = (randomNumber * SLOT_HEIGHT) + padding;
                
                gsap.to(slotInner, {
                    y: `-${finalPosition}em`,
                    duration: 1,
                    ease: "bounce.out",
                    onComplete: () => {
                        isSpinning.value = false;
                    }
                });
            }, (2 * 1e3) + (Math.random() * 2e3));
        }, DELAY*i);
    }
}
</script>

<style scoped>
button.primary {
    margin: auto;
    font-size: 1.5em;

    box-shadow: 0px 8px 0 #3945b9;
    transform: translateY(-8px);
    transition: all .3s ease;

    font-family: "poppins-bold", sans-serif;    

    &>span {
        color: var(--gray-3);
        font-size: .7em;
        font-family: "poppins-medium", sans-serif;
    }

    &:hover {
        transform: translateY(0);
        box-shadow: unset;
    }
}

h2 {
    text-align: center;
    font-family: "poppins-bold", sans-serif;
    font-size: 1.8em;
}

p {
    color: var(--gray-4);
    font-size: 1.2em;
    text-align: center;
}

#slot-machine {
    display: flex;
    background-color: var(--gray-1);
    width: fit-content;
    margin: 2em auto;
    border-radius: 20px;

    height: 14em;
    overflow: hidden;

    border: 8px solid var(--gray-3);
}

#slot-machine>div.slot>div.slot-inner {
    display: flex;
    flex-direction: column;

    & img {
        border-right: 5px solid var(--gray-1);
        width: 10em;
        user-select: none;

        &:first-of-type {
            padding-top: 1.5em;
        }
    }

    &:not(:last-of-type) img {
        border-color: var(--gray-2);
    }
}
</style>