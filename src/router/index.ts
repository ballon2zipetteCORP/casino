import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import ShopView from '@/views/shop/ShopView.vue'

import EuropeanRouletteView from '@/views/games/EuropeanRouletteView.vue'
import CashView from '@/views/games/CashView.vue'
import SlotMachineView from '@/views/games/SlotMachineView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: "/shop",
      name: "shop",
      component: ShopView
    },
    {
      path: '/games',
      name: 'games',
      children: [
        {
          path: "european-roulette",
          name: 'games.european-roulette',
          component: EuropeanRouletteView
        },
        {
          path: "slot-machine",
          name: 'games.slot-machine',
          component: SlotMachineView
        },
        {
          path: "cash",
          name: 'games.cash',
          component: CashView
        }
      ]
    }
  ],
})

export default router
