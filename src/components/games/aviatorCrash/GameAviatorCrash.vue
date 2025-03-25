<template>
    <BaseGame>
        <div class="scene">
            <div class="inner-clouds">
                <div class="clouds"></div>
                <div class="clouds"></div>
            </div>
            <!--<img src="/images/games/aviatorCrash/airplane.png" class="airplane" alt="Avion">-->
        </div>
        <button @click="play">Jouer</button>
    </BaseGame>
</template>

<script lang="ts" setup>
import BaseGame from '../BaseGame.vue';
import gsap from "gsap";

const play = () => {
    // gsap.to(".airplane", { 
    //     x: "30vw", 
    //     y: "-100px", 
    //     rotation: -10,
    //     duration: 2, 
    //     ease: "power2.out"
    // });

    const slotInner = `.inner-clouds`;
    gsap.set(slotInner, { x: "0em" });
    const scrollAnimation = gsap.to(slotInner, {
        x: `-40em`,
        duration: 2,
        repeat: -1,
        ease: "linear",
        onComplete: () => {
            gsap.set(slotInner, { x: "0em" });
            scrollAnimation.restart();
        }
    });
}
</script>

<style scoped>
.scene {
    overflow: hidden;
    height: 30em;
    width: 40em;
}
div.inner-clouds {
    display: inline-flex;
}
div.clouds {
    background-image: url(/images/games/aviatorCrash/cloud.jpg);
    background-size: cover;
    height: 30em;
    width: 40em;

    &:nth-child(odd) {
        margin-left: -.3em;
    }
}
img {
    width: 20em;
    position: relative;
    z-index: 9;
}
</style>