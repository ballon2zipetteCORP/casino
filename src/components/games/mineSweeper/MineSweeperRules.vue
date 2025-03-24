<script setup lang="ts">
import BaseModal from '@/components/ui/modals/BaseModal.vue';
import { ref } from 'vue';

const isShown = ref<boolean>(false);
defineExpose({
    show: () => {
        isShown.value = true;
    }
});

const BONUS: {name: string;description: string;imagePath:string;}[] = [
    { 
        name: "Bombe",
        description: "Tu perds directement tous les zipette coins que tu as accumulé.e",
        imagePath: "bomb.png"
    },
    { 
        name: "Coffre ruby",
        description: "Tu multiplies par 4 ton gain potentiel.",
        imagePath: "ruby-chest.png"
    },
    { 
        name: "Coffre en argent",
        description: "Tu gagnes 500 ZPC",
        imagePath: "silver-chest.png"
    },
    { 
        name: "Coffre en or",
        description: "Tu mutliplies ton gain par un nombre entre 1 et 2",
        imagePath: "golden-chest.png"
    }
]
</script>

<template>
    <BaseModal v-show="isShown" @close="isShown = false" title="Comment jouer ?">
        <p><span>Objectif:</span> ramasser un maximum de bonus sans tomber sur la bombe !</p>
        <h3>Liste des bonus</h3>
        <ul>
            <li v-for="bonus in BONUS" :key="bonus.name">
                <img :alt="bonus.name" :src="`/images/games/mineSweeper/${bonus.imagePath}`" />
                <div>
                    <h4>{{ bonus.name }}</h4>
                    <p>{{ bonus.description }}</p>
                </div>
            </li>
        </ul>
    </BaseModal>
</template>

<style scoped>
img {
    width: 7em;
}
p {
    margin-top: .5em;
    &>span {
        text-decoration: underline;
        color: var(--primary);
    }
}
h3 {
    margin-top: .5em;
    font-family: "poppins-bold", sans-serif;
}
ul {
    &>li {
        display: flex;
        gap: 1em;
        align-items: center;

        & h4 {
            font-family: "poppins-bold", sans-serif;
            color: var(--primary);
        }
    }
}
</style>