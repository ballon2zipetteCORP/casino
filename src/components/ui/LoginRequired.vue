<template>
    <div v-show="!isAuthenticated" class="login">
        <div class="middle">
            <mdicon class="warn" :size="130" name="warning" />
            <h2>Vous devez être connecté pour jouer</h2>
            <button class="primary" @click="useAuthenticationStore().login">
                Se connecter
                <mdicon name="login" />
            </button>
            <RouterLink :to="{name:'home'}">
                Me ramener à l'accueil
            </RouterLink>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useAuthenticationStore } from '@/stores/useAuthenticationStore';
import { storeToRefs } from 'pinia';

const {isAuthenticated} = storeToRefs(useAuthenticationStore());
</script>

<style scoped>
.warn {
    display: block;
    text-align: center;
    color: rgb(255, 196, 87);
}
div.login {
    background-color: rgba(0, 0, 0, .3);
    backdrop-filter: blur(10px);

    position: fixed;
    top: 0;
    left: 0;

    width: 100%;
    height: 100vh;
    z-index: 999;
}
div.login div.middle {
    background-color: var(--gray-2);
    border-radius: 20px;

    width: fit-content;
    padding: 2em 3em;

    position: absolute;
    top: 50%;
    left: 50%;

    transform: translate(-50%, -50%);
}
div.login div.middle h2 {
    font-family: "poppins-bold", sans-serif;
    text-align: center;
}
div.login div.middle button {
    display: block;
    margin: 1em auto;
}
div.login div.middle a {
    color: white;
    text-align: center;
    margin-top: 1em;
    display: block;
}
/* div.login {
    background-color: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    margin: 0 3em;

    position: absolute;
    z-index: 99999;
    height: 86%;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
} */
</style>