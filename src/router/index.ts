import { createRouter, createWebHistory } from "vue-router";

import HomeView from "@/views/HomeView.vue";
import ShopView from "@/views/shop/ShopView.vue";

import CashView from "@/views/games/CashView.vue";
import EuropeanRouletteView from "@/views/games/EuropeanRouletteView.vue";
import SlotMachineView from "@/views/games/SlotMachineView.vue";

import MinesweeperView from "@/views/games/MinesweeperView.vue";
import CGUView from "@/views/legal/CGUView.vue";
import MentionsLegalesView from "@/views/legal/MentionsLegalesView.vue";
import PolitiqueDeConfidentialiteView from "@/views/legal/PolitiqueDeConfidentialiteView.vue";
import GiveView from "@/views/other/GiveView.vue";
import LeaderboardView from "@/views/other/LeaderboardView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/shop",
      name: "shop",
      component: ShopView,
    },
    {
      path: "/legal",
      name: "legal",
      children: [
        {
          path: "cgu",
          name: "legal.cgu",
          component: CGUView,
        },
        {
          path: "mentions-legales",
          name: "legal.mentions-legales",
          component: MentionsLegalesView,
        },
        {
          path: "politique-de-confidentialite",
          name: "legal.politique-de-confidentialite",
          component: PolitiqueDeConfidentialiteView,
        },
      ],
    },
    {
      path: "/games",
      name: "games",
      children: [
        {
          path: "european-roulette",
          name: "games.european-roulette",
          component: EuropeanRouletteView,
        },
        {
          path: "slot-machine",
          name: "games.slot-machine",
          component: SlotMachineView,
        },
        {
          path: "cash",
          name: "games.cash",
          component: CashView,
        },
        {
          path: "mine-sweeper",
          name: "games.mine-sweeper",
          component: MinesweeperView,
        },
      ],
    },
    {
      path: "/give",
      name: "give",
      component: GiveView,
    },
    {
      path: "/leaderboard",
      name: "leaderboard",
      component: LeaderboardView,
    },
  ],
});

export default router;
