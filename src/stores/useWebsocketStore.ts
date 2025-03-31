import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";
import { useAuthenticationStore } from "./useAuthenticationStore";

export type TGame =
  | "EUROPEAN_ROULETTE"
  | "SLOT_MACHINE"
  | "CASH_GAME"
  | "MINE_SWEEPER"
  | "AVIATOR_CRASH"
  | "BLACKJACK";
export interface IMessage {
  game: string;
  type: string;
  data?: any;
}

export const GameMapper: Record<TGame, string> = {
  AVIATOR_CRASH: "Aviator",
  BLACKJACK: "Blackjack",
  CASH_GAME: "Cash",
  EUROPEAN_ROULETTE: "Roulette",
  MINE_SWEEPER: "Chasse",
  SLOT_MACHINE: "Machine",
};

type TListener = (message: IMessage) => void;

export const useWebsocketStore = defineStore("websocketStore", () => {
  const identityId = ref<string | null>(null);
  const websocket = ref<WebSocket | null>(null);

  const keepAliveTimeout = ref<number | null>(null);
  const keepAliveInterval = ref<number | null>(null);

  // time until the next keep alive check
  const KEEP_ALIVE_CHECK = 5 * 1e3;
  const KEEP_ALIVE_TIMEOUT = 5 * 1e3;

  const actualGame = ref<TGame | null>(null);

  const actualListeners = ref<TListener[]>([]);
  const chatListener = ref<TListener | null>(null);

  const connect = (game: TGame) => {
    const { me, token } = storeToRefs(useAuthenticationStore());

    identityId.value = me.value!.id;
    websocket.value = new WebSocket(
      `${import.meta.env.VITE_WSS}/${encodeURI(token.value!)}/${game}`
    );

    if (actualGame.value !== game) {
      actualListeners.value = [];
    }

    actualGame.value = game;

    websocket.value.onopen = () => {
      if (keepAliveInterval.value) {
        clearInterval(keepAliveInterval.value);
      }
      keepAliveInterval.value = setInterval(ping, KEEP_ALIVE_CHECK);
      _log("Connection opened");
    };
    websocket.value.onclose = () => {
      _log("Connection closed");
    };
    websocket.value.onerror = () => {
      console.log(`Connection error: ${JSON.stringify(websocket)}`);
    };

    // keep alive connection
    websocket.value.addEventListener("message", (event) => {
      const message = event.data;
      if (message === "__pong__") {
        pong();
        return;
      }
      try {
        const data = JSON.parse(message);

        actualListeners.value.forEach((listener) => {
          listener(data);
        });

        if (chatListener.value !== null) {
          chatListener.value(data);
        }

        // theses errors are sent by the WS
        if (data.type === "ERROR") {
          console.error(data.data);
        }
      } catch (e) {}
    });
  };

  const close = () => {
    websocket.value?.close();
    _log("websocket was closed normally");
  };

  const ping = () => {
    send("__ping__");
    _log("keep alive - waiting for a response...");

    keepAliveTimeout.value = setTimeout(() => {
      _log("Connection with the socket lost, reconnecting...");
      if (actualGame.value) {
        connect(actualGame.value);
      } else {
        console.warn("Actual game not found");
      }
    }, KEEP_ALIVE_TIMEOUT);
  };

  const pong = () => {
    if (keepAliveTimeout.value) {
      clearTimeout(keepAliveTimeout.value);
      _log("keep alive - response received !");
    }
  };

  const addMessageListener = (callback: (message: IMessage) => void) => {
    actualListeners.value.push(callback);
  };

  const addChatListener = (callback: (message: IMessage) => void) => {
    chatListener.value = callback;
  };

  const send = (data: string | Record<string, unknown>) => {
    let message: string;
    if (typeof data !== "string") {
      data.game = actualGame.value;
      message = JSON.stringify(data);
    } else {
      message = data;
    }

    if (websocket.value?.readyState === WebSocket.OPEN) {
      websocket.value.send(message);
    }
  };

  const _log = (message: string) => {
    console.log(`[Connected ID: ${identityId.value}] ${message}`);
  };

  return {
    connect,
    addMessageListener,
    addChatListener,
    close,
    send,
    websocket,
    actualGame,
  };
});
