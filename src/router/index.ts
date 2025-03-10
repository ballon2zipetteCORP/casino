import EuropeanRouletteView from '@/views/games/EuropeanRouletteView.vue'
import HomeView from '@/views/HomeView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/games',
      name: 'games',
      children: [
        {
          path: "european-roulette",
          name: 'games.european-roulette',
          component: EuropeanRouletteView
        }
      ]
    }
  ],
})

export default router
