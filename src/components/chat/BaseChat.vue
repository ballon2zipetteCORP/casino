<template>
    {{ chats }}

    <input v-model="content" id="content" />
    <button @click="send">Envoyer</button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { userChatStore } from '@/stores/useUserChat';
import { storeToRefs } from 'pinia';

const content = ref<string>("");

const {chats} = storeToRefs(userChatStore());

const send = () => {
    if(!content.value?.trim()) 
        return;
    userChatStore().sendChat({ content: content.value });
}
</script>