<template>
    <template v-if="!hasOrientedToLandscape && !ignoreLandscapeMode">
        <div class="orientation">
            <div class="center">
                <button class="ignore" @click="ignoreLandscapeMode = true">Je m'en fou je veux jouer quand même</button>
                <router-link :to="{name: 'home'}">Me ramener à l'accueil</router-link>
                <mdicon class="cellphone-icon" name="cellphone" :size="120" />
                <h2>Orientez votre téléphone en mode paysage pour jouer</h2>
            </div>
        </div>
    </template>
    <template v-else>
        <slot />
    </template>
</template>

<script lang="ts" setup>
import useMobilePhone from '@/composables/useMobilephone';
import { computed, ref } from 'vue';

const {orientation, isOnMobilePhone} = useMobilePhone();

const ignoreLandscapeMode = ref<boolean>(false);
const hasOrientedToLandscape = computed(() => {
    if(!isOnMobilePhone.value) return true;
    return orientation.value === "LANDSCAPE";
})
</script>

<style scoped>
.ignore {
    display: block;
    text-align: center;
    text-decoration: underline;
    color: var(--primary);
}
a {
    color: var(--gray-3);
    text-align: center;
    display: block;
    font-size: 1.3em;
}
div.orientation {
    position: fixed;
    top: 0;
    left: 0;

    width: 100%;
    height: 100vh;

    background-color: var(--gray-1);

    z-index: 99999;
}
div.center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
h2, h3 {
    text-align: center;
}
h2 {
    font-family: "poppins-bold", sans-serif;
}
h3 {
    color: var(--gray-3);
}
.cellphone-icon {
    animation: 3s mobile-rotating infinite;
    display: block;
    transform-origin: 0 0;

    width: fit-content;
    margin: 3em auto;
}

@keyframes mobile-rotating {
    0% {
        transform: rotate(0);
    }
    50% {
        transform: rotate(90deg);
    }
    100% {
        transform: rotate(0);
    }
}
</style>