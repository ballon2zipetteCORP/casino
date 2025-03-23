import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";
import { useAuthenticationStore } from "./useAuthenticationStore";

export type TGame = "EUROPEAN_ROULETTE" | "SLOT_MACHINE" | "CASH_GAME" | "MINE_SWEEPER" | "AVIATOR_CRASH";
export interface IMessage {
  game: string;
  type: string;
  data?: any;
}

export const useWebsocketStore = defineStore("websocketStore", () => {
  const identityId = ref<string | null>(null);
  const websocket = ref<WebSocket | null>(null);

  const keepAliveTimeout = ref<number | null>(null);
  const keepAliveInterval = ref<number | null>(null);

  // time until the next keep alive check
  const KEEP_ALIVE_CHECK = 10 * 1e3;
  const KEEP_ALIVE_TIMEOUT = 10 * 1e3;

  const actualGame = ref<TGame | null>(null);

  const connect = (game: TGame) => {
    const { me, token } = storeToRefs(useAuthenticationStore());

    identityId.value = me.value!.id;
    actualGame.value = game;
    websocket.value = new WebSocket(
      `${import.meta.env.VITE_WSS}/${encodeURI(token.value!)}/${game}`
    );

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
    websocket.value?.addEventListener("message", ({ data }) => {
      try {
        const message = JSON.parse(data);
        callback(message);
      } catch (e) {} // ignore
    });
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
    close,
    send,
    websocket,
  };
});
