import { createRouter, createWebHistory } from 'vue-router'
import TracksPage from './views/TracksPage.vue'

const routes = [
    { path: '/', component: TracksPage },
    { path: '/tracks', component: TracksPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
export default router