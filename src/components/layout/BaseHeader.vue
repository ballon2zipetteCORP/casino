<template>
    <header>
        <div class="money-field">
            <span class="devise">
                ZP
            </span>
            <span class="money">1 300<span>,00</span></span>

            <button class="primary">+</button>
        </div>
        <div @click="authenticationStore.logout" class="profile-picture">
            <img loading="lazy" src="/images/default-profile.jpg" alt="profile picture" />
        </div>
    </header>
</template>

<script lang="ts" setup>
import { useAuthenticationStore } from '@/stores/useAuthenticationStore';

const authenticationStore = useAuthenticationStore();
</script>

<style scoped>
header {
    padding: 2em 3em;
    display: flex;
    align-items: center;
    gap: 1em;
    justify-content: flex-end;
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