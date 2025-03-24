<template>
  <div v-if="data" class="leaderboard">
    <div class="top">
      <div v-if="data[1]">
        <img alt="second" src="/images/leaderboard/second.png" />
        <h3 class="username">{{ data[1].displayName }}</h3>
        <h4 class="zipette">
          {{ data[1].zipetteCoins }} <span class="zpc">ZPC</span>
        </h4>
      </div>
      <div class="first">
        <img alt="first" src="/images/leaderboard/first.png" />
        <h3 class="username">{{ data[0].displayName }}</h3>
        <h4 class="zipette">
          {{ data[0].zipetteCoins }} <span class="zpc">ZPC</span>
        </h4>
      </div>
      <div v-if="data[2]">
        <img alt="third" src="/images/leaderboard/third.png" />
        <h3 class="username">{{ data[2].displayName }}</h3>
        <h4 class="zipette">
          {{ data[2].zipetteCoins }} <span class="zpc">ZPC</span>
        </h4>
      </div>
    </div>

    <div class="rest">
      <div v-for="(user, i) in data.slice(3)" :key="i">
        <h3>{{ 4+i }}</h3>
        <h4>{{ user.displayName }}</h4>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useAPIRequest from "@/composables/useAPIRequest";

 const { data } = useAPIRequest<{ displayName: string; zipetteCoins: number }[]>({ 
   endpoint: "/leaderboard?limit=10", method: "GET", immediate: true
});
</script>

<style scoped>
div.leaderboard .top {
  display: flex;
  justify-content: center;
  gap: 2em;
  &>div {
    text-align: center;
    &.first {
      transform: scale(1.2);
      grid-area: first;
    }
    &.second {
      grid-area: second;
    }
    &.third {
      grid-area: third;
    }

    &>img {
      width: 10em;
    }
    font-size: 1.5em;
    &>h3 {
      font-family: "poppins-bold", sans-serif;
    }
    &>h4 {
      color: var(--primary);
      font-family: "poppins-bold", sans-serif;
      &>span {
        font-family: "poppins-medium", sans-serif;
        color: var(--gray-3);
      }
    }
  }
}

div.rest {
  display: flex;
  flex-direction: column;
  gap: 1em;
  align-items: center;
  justify-content: center;
  margin-top: 4em;

  &>div {
    display: flex;
    gap: 1em;
    align-items: center;
    font-size: 1.4em;

    &>h3 {
      background-color: var(--gray-1);
      padding: .5em .8em;
      border-radius: 100px;
      border-radius: 20px;
      font-family: "poppins-bold", sans-serif;
    }
    &>h4 {
      font-family: "poppins-medium", sans-serif;
    }
  }
}

@media screen and (max-width: 808px) {
  div.leaderboard div.top {
    display: grid;
    grid-template-areas: 
      "first"
      "second"
      "third";
  }
}
</style>
