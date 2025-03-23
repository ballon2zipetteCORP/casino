<template>
  <div class="leaderboard">
    <div class="content" v-for="(user, index) in data">
      <!--<img alt="first" src="/images/leaderboard/first.png" />-->
      <span class="place">
        {{ index + 1 }}
      </span>
      <div>
        <span class="username">{{ user.displayName }}</span>
        <span class="zipette"
          >{{ user.zipetteCoins }} <span class="zpc">ZPC</span></span
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useAPIRequest from "@/composables/useAPIRequest";

const { data } = useAPIRequest<
  { id: string; displayName: string; zipetteCoins: number }[]
>({
  endpoint: "/leaderboard?limit=10",
  method: "GET",
  immediate: true,
});
</script>

<style scoped>
.leaderboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1em;

  .content {
    display: grid;
    grid-template-columns: 4em 600px;

    > div {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      .username {
        font-size: 1em;
      }

      .zipette {
        font-size: 0.7em;
      }
    }
  }

  div:first-of-type {
    display: flex;
    align-items: center;
  }

  img {
    width: 6em;
  }
  .place {
    font-size: 2em;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: "Roboto Mono", monospace;
    font-variant-numeric: tabular-nums;
  }

  .content:first-of-type {
    .place {
      color: gold;
      font-size: 6.5em;
    }

    .username {
      font-size: 3em;
    }

    .zipette {
      font-size: 1.5em;
    }
  }

  .content:nth-of-type(2) {
    .place {
      color: silver;
      font-size: 4.8em;
    }

    .username {
      font-size: 2em;
    }

    .zipette {
      font-size: 1em;
    }
  }

  .content:nth-of-type(3) {
    .place {
      color: brown;
      font-size: 3.5em;
    }

    .username {
      font-size: 1.5em;
    }

    .zipette {
      font-size: 0.8em;
    }
  }
}
</style>
