import useAPIRequest from "@/composables/useAPIRequest";
import { defineStore, storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { GameMapper, useWebsocketStore, type TGame } from "./useWebsocketStore";

interface IChat {
  content: string;
  game: string;
  displayName: string;
}

export const userChatStore = defineStore("chat", () => {
  const { actualGame } = storeToRefs(useWebsocketStore());
  const chats = ref<IChat[]>([]);
  const initialized = ref<boolean>(false);

  const { data } = useAPIRequest<IChat[]>({
    method: "GET",
    endpoint: "/chat?limit=100",
    immediate: true,
  });

  watch(data, (newData) => {
    if (newData) {
      chats.value = newData.map((chat) => ({
        content: chat.content,
        displayName: chat.displayName,
        game: chat.game,
      }));
    }
  });

  const init = () => {
    if (initialized.value) return;
    initialized.value = true;
    useWebsocketStore().addChatListener((message: any) => {
      if (message.type === "CHAT_RECEIVED") {
        chats.value.push({
          content: message.content,
          displayName: message.displayName,
          game: message.game,
        });
      }
    });
  };

  const sendChat = ({ content }: { content: string }) => {
    useWebsocketStore().send({
      type: "CHAT_SENT",
      content,
      sentAt: new Date(),
      game: GameMapper[actualGame.value as TGame] ?? "Aucun jeu",
    });
  };

  return {
    chats,
    init,
    sendChat,
  };
});
