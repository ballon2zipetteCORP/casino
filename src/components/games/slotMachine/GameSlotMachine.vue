<template>
    <BaseGame>
      <h2>Machine à zipette</h2>
      <p>Si vous avez 4 symboles identiques vous remporter le double du gain misé.</p>

      <div id="slot-machine">
        <div
          class="slot"
          :id="`slot-${index}`"
          v-for="(_, index) in new Array(NB_SLOTS).fill('')"
          :key="index"
        >
          <div class="slot-inner">
            <img
              v-for="(icon, jindex) in [...IMAGE_PATH, ...IMAGE_PATH]"
              :key="icon + index + jindex"
              :alt="icon"
              :src="`/images/games/slotMachine/${icon}.png`"
            />
          </div>
        </div>
      </div>
      <button
        :disabled="me?.zipetteCoins! < bet"
        @click="requestToScroll"
        class="primary"
      >
        Faire tourner <span>({{ bet }} ZPC)</span>
      </button>
  </BaseGame>
</template>

<script lang="ts" setup>
import gsap from "gsap";
import BaseGame from "../BaseGame.vue";

import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { useWebsocketStore } from "@/stores/useWebsocketStore";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";

const NB_SLOTS: number = 4;
const IMAGE_PATH: Array<string> = ["logo","beer", "fire", "knife"];

const isSpinning = ref<boolean>(false);

const { me } = storeToRefs(useAuthenticationStore());
const bet = ref<number>(200);
const hasWon = ref<boolean>(false);

const requestToScroll = () => {
  me.value!.zipetteCoins -= bet.value;
  useWebsocketStore().send({
    type: "USER_WANT_TO_PLAY",
    data: { bet: bet.value },
  });
};

const handleMessages = () => {
  useWebsocketStore().addMessageListener((message) => {
    switch (message.type) {
      case "START_TO_PLAY":
        const numbers = message.data?.numbers;
        hasWon.value = message.data?.hasWon;
        startScrollingAnimation(numbers);
        break;
    }
  });
};

const startScrollingAnimation = async (numbers: number[]) => {
  if (isSpinning.value || !numbers.length) return;
  isSpinning.value = true;

  const DELAY = 50;
  const SLOT_HEIGHT = 9;
  const totalHeight = IMAGE_PATH.length * SLOT_HEIGHT;

  const promises = [];
  for (let i = 0; i < NB_SLOTS; i++) {
    promises.push(
      new Promise((resolve: any) => {
        const randomNumber = numbers[i];
        setTimeout(() => {
          const slotInner = `#slot-${i} .slot-inner`;

          gsap.set(slotInner, { y: "0em" });

          const scrollAnimation = gsap.to(slotInner, {
            y: `-${totalHeight}em`,
            duration: 0.5,
            repeat: -1,
            ease: "linear",
            onComplete: () => {
              gsap.set(slotInner, { y: "0em" });
              scrollAnimation.restart();
            },
          });

          setTimeout(() => {
            scrollAnimation.kill();
            const padding = 2;
            const finalPosition = randomNumber * SLOT_HEIGHT + padding;

            gsap.to(slotInner, {
              y: `-${finalPosition}em`,
              duration: 1,
              ease: "bounce.out",
              onComplete: () => {
                resolve();
              },
            });
          }, 2 * 1e3 + Math.random() * 2e3);
        }, DELAY * i);
      })
    );
  }

  await Promise.all(promises);
  isSpinning.value = false;

  if (hasWon.value) {
    const amountWon = bet.value * 2;

    me.value!.zipetteCoins += amountWon;
    window.toast({
      level: "INFO",
      title: "Vous avez gagné !",
      subtitle: amountWon + " ZPC",
    });
  } else {
    window.toast({
      level: "INFO",
      title: "Perdu...",
      subtitle: "Looser!",
    });
  }
};

watch(
  me,
  (value) => {
    if (value) {
      useWebsocketStore().connect("SLOT_MACHINE");
      handleMessages();
    }
  },
  { immediate: true }
);
</script>

<style scoped>
button.primary {
  margin: auto;
  font-size: 1.5em;

  box-shadow: 0px 8px 0 #3945b9;
  transform: translateY(-8px);
  transition: all 0.3s ease;

  font-family: "poppins-bold", sans-serif;

  & > span {
    color: var(--gray-3);
    font-size: 0.7em;
    font-family: "poppins-medium", sans-serif;
  }

  &:hover {
    transform: translateY(0);
    box-shadow: unset;
  }
}

h2 {
  text-align: center;
  font-family: "poppins-bold", sans-serif;
  font-size: 1.8em;
}

p {
  color: var(--gray-4);
  font-size: 1.2em;
  text-align: center;
}

#slot-machine {
  display: flex;
  background-color: var(--gray-1);
  width: fit-content;
  margin: 2em auto;
  border-radius: 20px;

  height: 14em;
  overflow: hidden;

  border: 8px solid var(--gray-3);
}

#slot-machine > div.slot > div.slot-inner {
  display: flex;
  flex-direction: column;

  & img {
    border-right: 5px solid var(--gray-1);
    width: 10em;
    user-select: none;

    &:first-of-type {
      padding-top: 1.5em;
    }
  }

  &:not(:last-of-type) img {
    border-color: var(--gray-2);
  }
}
</style>
