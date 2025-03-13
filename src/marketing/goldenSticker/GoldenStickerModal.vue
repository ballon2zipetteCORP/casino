<script setup lang="ts">
import { ref } from 'vue';
import {storeToRefs} from "pinia";

import BaseModal from '@/components/ui/modals/BaseModal.vue';
import type GoldenStickersMarketingCampaign from './GoldenStickersMarketingCampaign';

import useMarketing from '../useMarketing';
import { useAuthenticationStore } from '@/stores/useAuthenticationStore';

const campaign = useMarketing().getCurrentCampaign<GoldenStickersMarketingCampaign>();
const hasSeen = ref<boolean>(campaign!.hasSeenCampaign());

const closeModal = () => {
    campaign!.setAsSeen();
    hasSeen.value = campaign!.hasSeenCampaign();
}


const {me} = storeToRefs(useAuthenticationStore());
</script>

<template>
    <BaseModal v-show="!hasSeen" @close="closeModal" title="En ce moment...">
        <div class="center">
            <img alt="golden sticker" src="/images/shop/stickers/golden-sticker.png" />
            <h3>Achetez des stickers dans la boutique et tentez de gagner le sticker d’or.</h3>
            <p>L'heureux(se) gagnant(e) remportera une soirée avec toute l'équipe B2Z, <span>tous frais payés</span>. </p>

            <template v-if="!me">
                <h4>Je vois que tu n'es pas encore connecté ça va m'énerver ça</h4>
                <button class="primary" @click="() => {useAuthenticationStore().login();closeModal()}">
                    Se connecter
                    <mdicon name="login" />
                </button>
            </template>
            <template v-else>
                <RouterLink @click="closeModal" :to="{name:'shop'}">
                    <button class="primary">
                        Acheter des stickers
                        <mdicon name="arrow-right" />
                    </button>
                </RouterLink>
            </template>
        </div>
    </BaseModal>
</template>

<style scoped>
div.center {
    text-align: center;
}
img {
    width: 15em;
    display: block;
    margin: auto;
    
    margin-top: 1em;
    margin-bottom: 1em;
}
h3 {
    font-family: "poppins-bold", sans-serif;   
}
p {
    color: var(--gray-3);
    padding-bottom: 1em;
    margin-bottom: 1em;
    border-bottom: 2px solid var(--gray-3);
    font-family: "poppins-medium", sans-serif;

    &>span {
        text-decoration: underline;
        color: white;
        text-transform: uppercase;
    }
}
a {
    text-decoration: none;
}
button {
    margin: auto;
    margin-top: .5em;
}
</style>