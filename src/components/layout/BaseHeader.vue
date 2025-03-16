<template>
    <header>
        <nav>
            <ul>
                <li>
                    <router-link :to="{name: 'home'}">
                       <mdicon name="home" /> Liste des jeux
                    </router-link>
                </li>
                <li>
                    <router-link :to="{name: 'shop'}">
                        <mdicon name="cart" /> Boutique
                    </router-link>
                </li>
            </ul>
        </nav>
        <div class="left">
            <template v-if="!isLoading">
                <template v-if="isAuthenticated">
                    <div class="money-field">
                        <span class="devise">
                            ZPC
                        </span>
                        <span class="money" v-html="formattedZipetteCoins"></span>

                        <button @click="isTokenGetInstructionsShown = true" class="primary">
                            +
                        </button>
                    </div>
                    <div class="profile-picture">
                        <div @click="isToggled = !isToggled" class="picture">
                            <img loading="lazy" src="/images/default-profile.jpg" alt="profile picture" />
                            <span class="open">
                                <mdicon name="chevron-down" />
                            </span>
                        </div>

                        <ul v-show="isToggled" class="dropdown">
                            <li class="disconnect" @click="authenticationStore.logout">
                                Déconnexion
                                <mdicon name="logout" />
                            </li>
                        </ul>
                    </div>
                </template>
                <template v-else>
                    <button @click="authenticationStore.login" class="primary login">
                        Connexion/Inscription
                        <mdicon name="login" />
                    </button>
                </template>
            </template>
            <template v-else>
                <div class="sekeleton header" />
            </template>
        </div>
    </header>

    <TokenGetInstructions @close="isTokenGetInstructionsShown = false" v-show="isTokenGetInstructionsShown" />
</template>

<script lang="ts" setup>
import { useAuthenticationStore } from '@/stores/useAuthenticationStore';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import TokenGetInstructions from '../modals/TokenGetInstructions.vue';

const authenticationStore = useAuthenticationStore();
const {isAuthenticated, me, isLoading} = storeToRefs(authenticationStore);

const isToggled = ref<boolean>(false);
const isTokenGetInstructionsShown = ref<boolean>(false);

const formattedZipetteCoins = computed(() => {
    const money = me?.value?.zipetteCoins ?? 0;
    const zipetteCoins = parseFloat(money.toString())?.toString();
    const [numbers, digits = "0"] = zipetteCoins.split(".");
    return `${numbers}<span style="font-size: 1em;color: var(--gray-2);">,${(digits).padStart(2, "0")}</span>`
});
</script>

<style scoped>
@keyframes skeleton-loading {
    0% {
        background-color: hsl(200, 10%, 30%);
    }
    100% {
        background-color: hsl(204, 8%, 13%);
    }
}

div.sekeleton.header {
    animation: skeleton-loading .8s linear infinite alternate;
    width: 15em;
    height: 3em;
    border-radius: 100px;
}


header {
    padding: 2em 0;
    display: flex;
    align-items: center;
    gap: 1em;
    justify-content: space-around;
}
header nav ul {
    display: flex;
    align-items: center;
    list-style: none;
    gap: 1em;

    &>li>a {
        text-decoration: none;
        color: white;
        transition: all .5s ease;

        &:hover {
            color: var(--primary);
        }
    }
}
button.primary.login {
    display: flex;
    align-items: center;
    gap: .5em;
}
div.left {
    display: flex;
    align-items: center;
    gap: 1em;
}
div.money-field {
    font-size: 1em;
    background-color: var(--gray-1);
    box-shadow: var(--shadow-settings-1);

    padding: .3em .5em;
    padding-left: 1.5em;
    border-radius: 100px;

    display: flex;
    gap: 1em;
    align-items: center;

    & button {
        border-radius: 100px;
        padding: .5em .9em;
    }

    &>span.devise {
        background-color: var(--tertiary);
        color: var(--gray-4);
        border-radius: 100px;
        font-size: 1.3em;

        display: flex;
        align-items: center;

        &>img {
            width: 2em;
        }
    }
    &>span.money {
        color: white;

        &>span {
            font-size: 1em;
            color: var(--gray-2);
        }
    }
}
div.profile-picture {
    border-radius: 100px;

    display: flex;
    gap: .5em;
    align-items: center;

    width: fit-content;

    position: relative;

    &>.picture {
        position: relative;
        cursor: pointer;
        
        &>img {
            width: 4em;
            border-radius: 100px;
            border: 3px solid var( --primary);

        }
        &>span.open {
            position: absolute;
            bottom: -.2em;
            right: -.2em;
            background-color: var(--gray-1);
            padding: .2em .2em;
            border-radius: 100px;
        }
    }

    ul.dropdown {
        position: absolute;
        bottom: -3.3em;
        z-index: 9;

        background-color: var(--gray-1);
        width: 10em;
        text-align: center;
        list-style: none;

        border-radius: 10px;

        &>li {
            padding: .5em .8em;
            cursor: pointer;

            &:first-of-type {
                border-top-left-radius: 10px;
                border-top-right-radius: 10px;
            }
            &:last-of-type {
                border-bottom-right-radius: 10px;
                border-bottom-left-radius: 10px;
            }

            &.disconnect {
                background-color: var(--red);
                color: white;
            }
        }
    }
}
@media screen and (max-width: 593px) {
    header {
        flex-direction: column;
        gap: 1em;
    }
}
</style>