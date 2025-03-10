<template>
    <!-- TODO: skeleton loading -->
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
            <template v-if="isAuthenticated">
                <div class="money-field">
                    <span class="devise">
                        ZPC
                    </span>
                    <span class="money" v-html="formattedZipetteCoins"></span>

                    <button class="primary">+</button>
                </div>
                <div @click="authenticationStore.logout" class="profile-picture">
                    <img loading="lazy" src="/images/default-profile.jpg" alt="profile picture" />
                </div>
            </template>
            <template v-else>
                <button @click="authenticationStore.login" class="primary login">
                    Connexion/Inscription
                    <mdicon name="login" />
                </button>
            </template>
        </div>
    </header>
</template>

<script lang="ts" setup>
import { useAuthenticationStore } from '@/stores/useAuthenticationStore';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const authenticationStore = useAuthenticationStore();
const {isAuthenticated, me} = storeToRefs(authenticationStore);

const formattedZipetteCoins = computed(() => {
    const money = me?.value?.zipetteCoins ?? 0;
    const zipetteCoins = parseFloat(money.toString())?.toString();
    const [numbers, digits = "0"] = zipetteCoins.split(".");
    return `${numbers}<span style="font-size: 1em;color: var(--gray-2);">,${(digits).padStart(2, "0")}</span>`
});
</script>

<style scoped>
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
    background-color: var(--gray-1);
    border-radius: 100px;

    display: flex;
    gap: .5em;
    align-items: center;

    width: fit-content;

    &>img {
        width: 4em;
        border-radius: 100px;
        border: 3px solid var( --primary);
    }
}
</style>