<template>
  <BaseGame>
    <div class="blackjack">
      <h1>Blackjack</h1>

      <div v-if="!gameStarted" class="start-game">
        <UserBetInput v-model="bet" :disabled="gameStarted" />
        <button
          class="primary start"
          @click="startGame"
          :disabled="!bet || isLoading"
        >
          Commencer
        </button>
      </div>

      <div v-else class="plateau">
        <div class="game">
          <div class="dealer">
            <h2>Cartes du croupier</h2>
            <div class="cards">
              <div
                v-for="(card, index) in dealerHand"
                :key="'dealer-' + index"
                class="card"
                ref="dealerCards"
              >
                <mdicon
                  :name="iconNameByCardSuit(card.color)"
                  :style="{ color: colorByCardSuit(card.color) }"
                />
                <span
                  class="text"
                  :style="{ color: colorByCardSuit(card.color) }"
                  >{{ card.value }}</span
                >
                <mdicon
                  :name="iconNameByCardSuit(card.color)"
                  :style="{ color: colorByCardSuit(card.color) }"
                />
              </div>
            </div>
            <p>Valeur : {{ dealerHandValue }}</p>
          </div>

          <div class="player">
            <h2>Vos cartes</h2>
            <div class="cards">
              <div
                v-for="(card, index) in playerHand"
                :key="'player-' + index"
                class="card"
                ref="playerCards"
              >
                <mdicon
                  :name="iconNameByCardSuit(card.color)"
                  :style="{ color: colorByCardSuit(card.color) }"
                />
                <span
                  class="text"
                  :style="{ color: colorByCardSuit(card.color) }"
                  >{{ card.value }}</span
                >
                <mdicon
                  :name="iconNameByCardSuit(card.color)"
                  :style="{ color: colorByCardSuit(card.color) }"
                />
              </div>
            </div>
            <p>Valeur : {{ playerHandValue }}</p>
          </div>
        </div>

        <div class="deck">
          <div class="card-back" ref="cardBack"></div>
        </div>
      </div>

      <div v-if="gameStarted" class="actions">
        <button @click="hit" :disabled="isLoading || gameOver">Tirer</button>
        <button @click="stand" :disabled="isLoading || gameOver">Rester</button>
      </div>

      <div v-if="gameOver" class="result">
        <button @click="resetGame">Rejouer</button>
      </div>

      <div class="advert">
        <mdicon class="warning" name="alert" />
        En cas d'égalité avec le croupier vous être perdant (soyez meilleur)
        <mdicon class="warning" name="alert" />
      </div>
    </div>
  </BaseGame>
</template>

<script lang="ts" setup>
import UserBetInput from "@/components/ui/UserBetInput.vue";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { useWebsocketStore } from "@/stores/useWebsocketStore";
import gsap from "gsap";
import { storeToRefs } from "pinia";
import { nextTick, ref, watch } from "vue";
import BaseGame from "../BaseGame.vue";

const { me } = storeToRefs(useAuthenticationStore());

const bet = ref<number>(0);
const gameStarted = ref(false);
const isLoading = ref(false);
const gameOver = ref(false);

const playerHand = ref<{ value: number; color: string }[]>([]);
const dealerHand = ref<{ value: number; color: string }[]>([]);
const playerHandValue = ref(0);
const dealerHandValue = ref(0);

const playerCards = ref<HTMLElement[]>([]);
const dealerCards = ref<HTMLElement[]>([]);
const cardBack = ref<HTMLElement | null>(null);

const iconNameByCardSuit = (suit: string) => {
  switch (suit) {
    case "HEART":
      return "cards-heart";
    case "DIAMOND":
      return "cards-diamond";
    case "CLUB":
      return "cards-club";
    case "SPADE":
      return "cards-spade";
  }
};

const colorByCardSuit = (suit: string) => {
  switch (suit) {
    case "HEART":
      return "red";
    case "DIAMOND":
      return "red";
    case "CLUB":
      return "black";
    case "SPADE":
      return "black";
  }
};

const startGame = () => {
  if (!bet.value) return;
  isLoading.value = true;

  useWebsocketStore().send({
    type: "START_GAME",
    data: { bet: bet.value },
  });
};

const hit = () => {
  useWebsocketStore().send({
    type: "ACTION",
    data: { action: "HIT" },
  });
};

const stand = () => {
  useWebsocketStore().send({
    type: "ACTION",
    data: { action: "STAND" },
  });
};

const resetGame = () => {
  gameStarted.value = false;
  gameOver.value = false;
  playerHand.value = [];
  dealerHand.value = [];
};

const animateCard = async (target: HTMLElement) => {
  await nextTick();
  if (!cardBack.value) return;

  const cardBackRect = cardBack.value.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();

  gsap.fromTo(
    target,
    {
      x: cardBackRect.left - targetRect.left,
      y: cardBackRect.top - targetRect.top,
      opacity: 0,
      rotate: -45,
    },
    {
      x: 0,
      y: 0,
      opacity: 1,
      rotate: 0,
      duration: 0.5,
      ease: "power2.out",
    }
  );
};

const handleMessages = () => {
  useWebsocketStore().addMessageListener(async (message) => {
    switch (message.type) {
      case "GAME_STARTED":
        gameStarted.value = true;
        isLoading.value = false;
        playerHand.value = message.data.playerHand;
        dealerHand.value = message.data.dealerHand;
        playerHandValue.value = message.data.playerHandValue;
        dealerHandValue.value = message.data.dealerHandValue;

        window.toast({
          level: "INFO",
          title: "La partie a commencé",
        });

        break;

      case "CARD_HIT":
        playerHand.value = message.data.playerHand;
        playerHandValue.value = message.data.playerValue;

        await nextTick();
        animateCard(playerCards.value[playerCards.value.length - 1]);
        break;

      case "GAME_OVER":
        gameOver.value = true;
        window.toast({
          level: "INFO",
          title: "Perdu",
          subtitle: `Merci pour tes ${bet.value} ZPC !`,
        });
        break;

      case "DEALER_HAND":
        dealerHand.value = message.data.dealerHand;
        dealerHandValue.value = message.data.dealerValue;

        await nextTick();
        animateCard(dealerCards.value[dealerCards.value.length - 1]);
        break;

      case "GAME_WIN":
        gameOver.value = true;
        window.toast({
          level: "SUCCESS",
          title: "Gagner",
          subtitle: `Tu remportes ${bet.value! * 2} ZPC !`,
        });
        break;
    }
  });
};

watch(
  me,
  (value) => {
    if (value) {
      useWebsocketStore().connect("BLACKJACK");
      handleMessages();
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.start-game {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.blackjack {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.cards {
  display: flex;
  gap: 0.5rem;
}

.card {
  padding: 0.2rem;
  width: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;

  .text {
    text-align: center;
  }
}

.card-back {
  width: 50px;
  height: 70px;
  background-color: #333;
  border-radius: 4px;
  border: 1px solid #000;
}

.deck {
  position: relative;
  margin-bottom: 1rem;
}

.actions {
  display: flex;
  gap: 1rem;
}

.result {
  margin-top: 1rem;
}

.advert {
  text-align: center;
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: center;
  .warning {
    color: red;
  }
}

.plateau {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
}
</style>
