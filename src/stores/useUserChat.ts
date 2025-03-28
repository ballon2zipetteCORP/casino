import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";
import { GameMapper, useWebsocketStore, type TGame } from "./useWebsocketStore";

interface IChat {
  content: string;
  game: string;
  displayName: string;
}

export const userChatStore = defineStore("chat", () => {
  const { actualGame } = storeToRefs(useWebsocketStore());
  const chats = ref<IChat[]>([]);

  const init = () => {
    useWebsocketStore().addMessageListener((message: any) => {
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
