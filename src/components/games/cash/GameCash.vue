<template>
  <BaseGame>
    <div class="center">
      <div>
        <h1>Cash Game</h1>
      </div>

      <div id="rules">
        <h2>Rules</h2>
        <p>
          Scratch game : scratch the ticket to reveal the numbers. On the left,
          you’ll see the numbers present on the ticket. On the right, you’ll
          find the winning numbers. If a winning number is present on the
          ticket, you win the amount shown on the ticket.
        </p>
      </div>

      <div v-for="(ticket, index) in ticketsList" :key="index">
        <GameCashCard
          ref="cashCardRefs"
          :winningNumbers="ticket.winningNumbers"
          :numero="ticket.numero"
        />
        <button
          class="primary check centered"
          @click="getGain(index)"
          :disabled="ticket.isChecked"
        >
          Check ticket
        </button>
      </div>

      <button
        class="primary buy centered"
        @click="buyCashGame"
        :disabled="me?.zipetteCoins! < bet"
      >
        Buy a cash for {{ bet }} ZPC
      </button>
    </div>
  </BaseGame>
</template>

<script setup lang="ts">
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { useWebsocketStore } from "@/stores/useWebsocketStore";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import BaseGame from "../BaseGame.vue";
import GameCashCard from "./GameCashCard.vue";

const bet = ref<number>(500);

const { me } = storeToRefs(useAuthenticationStore());

const cashCardRefs = ref<InstanceType<typeof GameCashCard>[]>([]);

interface ITicket {
  winningNumbers: number[];
  numero: { number: number; gain: number }[];
  winValue: number;
  isChecked: boolean;
}

const ticketsList = ref<ITicket[]>([]);

const buyCashGame = () => {
  me.value!.zipetteCoins -= bet.value;
  useWebsocketStore().send({
    type: "USER_WANT_TO_PLAY",
    data: { bet: bet.value },
  });
};

const getGain = (index: number) => {
  if (cashCardRefs.value.length > index) {
    const ticket = ticketsList.value[index];
    me.value!.zipetteCoins += ticket.winValue;

    ticket.isChecked = true;
    window.toast({
      level: "INFO",
      title: `You won ${ticket.winValue} ZPC`,
    });
  }
};

const handleMessages = () => {
  useWebsocketStore().addMessageListener((message) => {
    switch (message.type) {
      case "GIVE_CASH":
        window.toast({
          level: "INFO",
          title: "You bought a cash game",
        });

        ticketsList.value.push(message.data);
        break;
    }
  });
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
    margin-top: 30px;
    &:not(:disabled):hover {
      background-color: var(--blue);
      color: var(--gray-1);
    }
  }
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
