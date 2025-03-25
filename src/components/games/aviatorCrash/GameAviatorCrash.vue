<template>
    <BaseGame>
        <div class="frame">
            <div class="header">
                <h2>Crash aviator</h2>
                <p>Cliquez sur "arrêter" une fois lancé avant que l'avion explose ! Kaaris n'a pas validé le jeu.</p>
            </div>
            
            <div class="scene">
                <div class="inner-landing">
                    <div class="landing"></div>
                    <div class="landing"></div>
                </div>
                <div class="explosion-sprite" />
                <img class="airplane" src="/images/games/aviatorCrash/airplane.png" alt="Avion">
                <h3 class="multiplicator">x{{ currentCoef.toFixed(2) }}</h3>

                <div v-if="!startedPlaying" class="start-playing">
                    <div class="middle">
                        <UserBetInput v-model="bet" />
                        <button class="secondary" @click="requestToPlay">Jouer</button>  
                    </div> 
                </div>
            </div>

            <button v-if="startedPlaying" @click="cashout" class="cashout secondary">
                Atterrir <mdicon name="check" />
            </button>
        </div>
    </BaseGame>
</template>

<script lang="ts" setup>
import UserBetInput from '@/components/ui/UserBetInput.vue';
import BaseGame from '../BaseGame.vue';
import gsap from "gsap";

import { ref, watch } from 'vue';
import { useSound } from '@/composables/useSound';
import { useWebsocketStore } from '@/stores/useWebsocketStore';
import { storeToRefs } from 'pinia';
import { useAuthenticationStore } from '@/stores/useAuthenticationStore';
import globalUtils from '@/helpers/globalUtils';

const {me} = storeToRefs(useAuthenticationStore());

const bet = ref<number>(10);
const startedPlaying = ref<boolean>(false);

const maxCoef = ref<number>(1.05);
const currentCoef = ref<number>(1);

const airplane = ref<gsap.core.Tween|undefined>(undefined);
const scrollAnimation = ref<gsap.core.Tween|undefined>(undefined);

const getDuration = () => {
    const newCoef = (2.5-currentCoef.value)/2.5;
    return newCoef;
}

const loseSound = useSound("/sounds/kaaris-loose.mp3");
const hasExplosed = ref<boolean>(false);

const playLose = () => {
    reset();
    
    loseSound.playSound();
    window.toast({
        level: "INFO",
        title: "Vous avez tout perdu !",
        subtitle: "Fallait se retirer avant"
    })
}
const playWin = (totalWon: number) => {
    reset();
    window.toast({
        level: "INFO",
        title: "Vous avez gagné " + totalWon + " ZPC !",
        subtitle: "Bien vu chacal"
    })
}
const cashout = () => {
    useWebsocketStore().send({ 
        type: "CASHOUT", 
        data: { 
            currentCoef: currentCoef.value 
        } 
    });
}
const reset = () => {
    airplane.value?.kill();
    scrollAnimation.value?.kill();

    gsap.set(".inner-landing", { x: "0" });
    gsap.set(".airplane", { x: "-15em" });

    startedPlaying.value = false;
    currentCoef.value = 1;
}

const requestToPlay = () => {
    useWebsocketStore().send({
        type: "WANTS_TO_PLAY",
        data: {
            bet: bet.value
        }
    })
}

const toggleExplosionAnimation = async (onComplete: () => void) => {
    if(hasExplosed.value) return;
    hasExplosed.value = true;
    gsap.set(".explosion-sprite", { x: "19em" });
    await globalUtils.sleep(100);
    gsap.set(".airplane", { x: "-15em" });
    gsap.set(".explosion-sprite", { backgroundPosition: "47% 10%" });
    await globalUtils.sleep(100);
    gsap.set(".explosion-sprite", { backgroundPosition: "97% 10%" });
    await globalUtils.sleep(100);
    gsap.set(".explosion-sprite", { backgroundPosition: "0 91%" });
    await globalUtils.sleep(100);
    gsap.set(".explosion-sprite", { backgroundPosition: "46% 91%" });
    await globalUtils.sleep(100);
    gsap.set(".explosion-sprite", { backgroundPosition: "95% 91%" });
    await globalUtils.sleep(100);
    onComplete();

    gsap.set(".explosion-sprite", { x: "-15em" });
    gsap.set(".explosion-sprite", { backgroundPosition: "47% 10%" });
    hasExplosed.value = false;
}
  
const play = () => {
    startedPlaying.value = true;
    airplane.value = gsap.fromTo(".airplane", {  x: "-15em" }, 
    { 
        x: "13em",
        duration: .5, 
        ease: "power2.out"
    });

    const slotInner = `.inner-landing`;
    scrollAnimation.value = gsap.to(slotInner, {
        x: `-50%`,
        duration: getDuration(),
        repeat: -1,
        ease: "linear",
        onRepeat: () => {
            if(maxCoef.value > currentCoef.value) {
                currentCoef.value+=0.01;
                scrollAnimation.value?.duration(getDuration());
                scrollAnimation.value?.restart();
            } else {
                toggleExplosionAnimation(() => {
                     playLose();
                });
            }
        },
        onComplete: () => {
            scrollAnimation.value?.restart();
        }
    });
}

watch(me, value => {
    if(value) {
        useWebsocketStore().connect("AVIATOR_CRASH");
        useWebsocketStore().addMessageListener(message => {
            switch (message.type) {
                case "CASHED_OUT":
                    const {totalWon} = message.data ?? {};
                    playWin(totalWon);
                    break;
                case "START_PLAYING":
                    const {maxCoef: coef} = message.data;
                    maxCoef.value = coef;
                    play();
                    break;
            }
        })
    }
})
</script>

<style scoped>
button.cashout {
    position: absolute;
    right: 2.5em;
    bottom: -1.5em;

    z-index: 99;
}
h3.multiplicator {
    position: absolute;
    left: 50%;
    bottom: 1em;
    font-family: "poppins-bold", sans-serif;
    font-size: 2.3em;

    transform: translateX(-50%);
}
div.start-playing {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    background-color: rgba(0, 0, 0, .1);
    backdrop-filter: blur(10px);
    z-index: 99;

    &>.middle {
        position: absolute;
        top: 50%;
        left: 50%;

        padding: 2em;
        border-radius: 20px;

        transform: translate(-50%, -50%);

        background-color: var(--gray-1);
        z-index: 99;

        width: 70%;

        &>button {
            margin: auto;
            margin-top: 1em;
            font-size: 1.3em;
        }
    }
}
div.header {
    text-align: center;
    margin-bottom: 1em;
    &>h2 {
        font-family: "poppins-bold", sans-serif;
    }
}
div.frame {
    margin: auto;
    width: fit-content;
    position: relative;
}
div.scene {
    overflow: hidden;
    position: relative;
    width: 40em;
    border-radius: 10px;
    margin: auto;
}
div.inner-landing {
    display: inline-flex;
}
div.landing {
    background-image: url(/images/games/aviatorCrash/landing.png);
    background-size: contain;
    height: 16em;
    width: 55em;

    &:nth-child(odd) {
        margin-left: -.3em;
    }
}
div.explosion-sprite {
    background-image: url(/images/games/aviatorCrash/explosion.png);
    position: absolute;
    bottom: 8em;
    transform: translateX(-15em);
    z-index: 99;
    width: 7em;
    height: 7em;
    background-size: 22em;
}
img.airplane {
    width: 13em;
    position: absolute;
    bottom: 10em;
    transform: translateX(-15em);
    z-index: 9;
}
</style>