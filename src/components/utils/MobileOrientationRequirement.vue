<template>
    <template v-if="!hasOrientedToLandscape">
        <div class="orientation">
            <div class="center">
                <mdicon class="cellphone-icon" name="cellphone" :size="120" />
                <h2>Orientez votre téléphone en mode paysage pour jouer</h2>
                <h3>Pour une meilleure experience jeu sur téléphone nous vous demandons d'orienter votre téléphone</h3>
            </div>
        </div>
    </template>
    <template v-else>
        <slot />
    </template>
</template>

<script lang="ts" setup>
import useMobilePhoneOrientation from '@/composables/useMobilephone';
import { computed } from 'vue';

const {orientation, isOnMobilePhone} = useMobilePhoneOrientation();

const hasOrientedToLandscape = computed(() => {
    if(!isOnMobilePhone.value) return true;
    return orientation.value === "LANDSCAPE";
})
</script>

<style scoped>
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