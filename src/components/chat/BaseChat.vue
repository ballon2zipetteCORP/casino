<template>
  <div v-if="actualGame" class="chat-container" :class="{ closed: !opened }">
    <button class="close" @click="toggleChat">
      <mdicon name="chevron-up" />
    </button>
    <div class="messages">
      <div
        v-for="(chat, index) in chats"
        :key="index"
        class="message"
        v-if="opened"
      >
        <span class="username"
          >{{ chat.displayName }}
          <span
            class="game"
            :class="GameMapper[chat.game as TGame].toLowerCase()"
            >{{ GameMapper[chat.game as TGame].toUpperCase() ?? "CHAT" }}</span
          ></span
        >
        <p class="content">{{ chat.content }}</p>
      </div>
    </div>
    <div class="input-container" v-if="opened">
      <input
        v-model="content"
        id="content"
        placeholder="Écrivez un message..."
      />
      <button :disabled="inCooldown" @click="send">
        <mdicon name="send" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { userChatStore } from "@/stores/useUserChat";
import {
  GameMapper,
  useWebsocketStore,
  type TGame,
} from "@/stores/useWebsocketStore";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const content = ref<string>("");
const opened = ref<boolean>(true);

const inCooldown = ref<boolean>(false);

const { chats } = storeToRefs(userChatStore());

const { actualGame } = storeToRefs(useWebsocketStore());

const send = () => {
  if (!content.value?.trim()) return;
  userChatStore().sendChat({ content: content.value });
  content.value = "";
  inCooldown.value = true;
  setTimeout(() => {
    inCooldown.value = false;
  }, 700);
};

const toggleChat = () => {
  opened.value = !opened.value;
};
</script>

<style scoped>
.chat-container {
  position: fixed;
  bottom: 0;
  right: 20px;
  width: 300px;
  max-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: var(--gray-1);
  border: 1px solid var(--gray-3);
  border-radius: 10px 10px 0 0;
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.chat-container.closed {
  max-height: 50px;
}

.close {
  position: absolute;
  top: 5px;
  right: 10px;
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transform: rotate(0deg);
  transition: transform 0.3s ease;
  padding: 0;
}

.chat-container.closed .close {
  transform: rotate(180deg);
}

.messages {
  flex: 1;
  padding: 1em;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  transition: opacity 0.3s ease;
}

.chat-container.closed .messages {
  opacity: 0;
  pointer-events: none;
}

.message {
  background-color: var(--gray-2);
  padding: 0.8em;
  border-radius: 10px;
  color: white;
  font-size: 0.9em;
  max-width: 70%;
  word-wrap: break-word;
}

.message.from-user {
  background-color: var(--primary);
  align-self: flex-end;
}

.message .username {
  font-weight: bold;
  font-size: 0.8em;
  margin-bottom: 0.3em;
  display: block;
}

.input-container {
  display: flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.8em;
  background-color: var(--gray-2);
}

.input-container input {
  flex: 1;
  padding: 0.8em;
  border: 1px solid var(--gray-3);
  border-radius: 5px;
  font-size: 1em;
  background-color: var(--gray-1);
  color: white;
}

.input-container input::placeholder {
  color: var(--gray-4);
}

.input-container button {
  position: relative;
  padding: 0.8em 1.2em;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1em;
  cursor: pointer;
  overflow: hidden;
  transition: background-color 0.3s ease;
}

.input-container button:disabled {
  cursor: not-allowed;
  background-color: transparent;
  opacity: 1;
}

.input-container button:disabled::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--primary);
  transform: translateY(100%);
  animation: cooldown 0.7s linear forwards;
  z-index: 0;
}

.input-container button:disabled span {
  position: relative;
  z-index: 1;
}

@keyframes cooldown {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0%);
  }
}

.cash {
  color: var(--green);
}

.aviator {
  color: var(--orange-2);
}

.blackjack {
  color: var(--black);
}

.roulette {
  color: var(--red);
}

.chasse {
  color: var(--blue);
}

.machine {
  color: var(--primary);
}
</style>
