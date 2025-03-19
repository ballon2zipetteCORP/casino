<template>
  <BaseGame>
    <div class="center">
      <div>
        <h1>Cash</h1>
      </div>

      <div id="rules">
        <p>
          Grattez le ticket pour révéler les numéros. À gauche, vous verrez les numéros présents sur le ticket. À droite, vous trouverez les numéros gagnants. Si un numéro gagnant est présent sur le ticket, vous gagnez le montant indiqué sur le ticket.
        </p>
      </div>

      <div v-for="ticket in ticketsList" :key="ticket.id">
        <GameCashCard
          :winningNumbers="ticket.winningNumbers"
          :numero="ticket.numero"
          @scratch="handleScratch(ticket.id, $event)"
        />
        <div class="ticket-button">
          <button
            class="primary check"
            @click="getGain(ticket.id)"
            :disabled="ticket.isChecked || ticket.scratch < 75"
          >
            Vérifier
          </button>
          <button
            class="primary"
            @click="deleteTicket(ticket.id)"
            :disabled="!ticket.isChecked"
          >
            Supprimer
          </button>
        </div>
      </div>

      <button
        class="primary buy centered"
        @click="buyCashGame"
        :disabled="me?.zipetteCoins! < bet"
      >
        Acheter ({{ bet }} ZPC)
      </button>
    </div>
  </BaseGame>
</template>

<script setup lang="ts">
import { useSound } from "@/composables/useSound";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { useWebsocketStore } from "@/stores/useWebsocketStore";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import BaseGame from "../BaseGame.vue";
import GameCashCard from "./GameCashCard.vue";

const bet = ref<number>(500);

const { me } = storeToRefs(useAuthenticationStore());

const { playSound: playWin } = useSound("/sounds/win.mp3");
const { playSound: playLose } = useSound("/sounds/lose.mp3");

interface ITicket {
  id: number;
  winningNumbers: number[];
  numero: { number: number; gain: number }[];
  winValue: number;
  isChecked: boolean;
  scratch: number;
}

const ticketsList = ref<ITicket[]>([]);
let ticketID = 0;

const buyCashGame = () => {
  me.value!.zipetteCoins -= bet.value;
  useWebsocketStore().send({
    type: "USER_WANT_TO_PLAY",
    data: { bet: bet.value },
  });
};

const getGain = (id: number) => {
  const index = ticketsList.value.findIndex((ticket) => ticket.id === id);
  if (index !== -1) {
    const ticket = ticketsList.value[index];
    if (ticket.isChecked) return;
    let title = "Vous avez perdu";
    if (ticket.winValue === 0) {
      playLose();
      title = "Vous avez perdu";
    } else {
      playWin();
      title = `Vous avez gagné ${ticket.winValue} ZPC`;
      me.value!.zipetteCoins += ticket.winValue;
    }
    window.toast({
      level: "INFO",
      title,
    });
    ticket.isChecked = true;
  }
};

const deleteTicket = (id: number) => {
  const index = ticketsList.value.findIndex((ticket) => ticket.id === id);
  if (index !== -1) {
    ticketsList.value.splice(index, 1);
  }
};

const handleMessages = () => {
  useWebsocketStore().addMessageListener((message) => {
    switch (message.type) {
      case "GIVE_CASH":
        window.toast({
          level: "INFO",
          title: "Vous avez acheté un cash",
        });

        ticketsList.value.push({ ...message.data, id: ticketID++, scratch: 0 });
        break;
    }
  });
};

const handleScratch = (id: number, percent: number) => {
  const index = ticketsList.value.findIndex((ticket) => ticket.id === id);
  if (index !== -1) {
    ticketsList.value[index].scratch = percent;
    if (percent > 80) {
      getGain(id);
    }
  }
};

watch(
  me,
  (value) => {
    if (value) {
      useWebsocketStore().connect("CASH_GAME");
      handleMessages();
    }
  },
  { immediate: true }
);
</script>

<style scoped>
button.primary {
  display: flex;
  align-items: center;
  gap: 0.5em;

  background-color: transparent;
  border: 1px solid var(--red);
  box-shadow: unset;
  color: var(--red);

  padding: 0.5em 0.8em;
  border-radius: 10px;
  font-size: 1.3em;

  &:not(:disabled):hover {
    background-color: var(--red);
    color: white;
  }

  &.buy {
    border-color: var(--green);
    color: var(--green);
    &:not(:disabled):hover {
      background-color: var(--green);
      color: var(--gray-1);
    }
  }

  &.check {
    border-color: var(--blue);
    color: var(--blue);
    &:not(:disabled):hover {
      background-color: var(--blue);
      color: var(--gray-1);
    }
  }
}

div.ticket-button {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

#rules {
  max-width: 1200px;
  padding: 0em 1em;
  h2 {
    font-size: 1.5em;
    text-align: center;
    margin-bottom: 0.6em;
  }
  p {
    text-align: center;
  }
}
div.center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3em;
}
</style>
