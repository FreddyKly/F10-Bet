import router from '.'
import { getAuth } from 'firebase/auth'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }
    ]
  },
  {
    path: '/ranking',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/RankingsPage.vue') }
    ]
  },
  {
    path: '/bet',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/BetPage.vue') }
    ]
  },
  {
    path: '/betDetails',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/DetailsBetPage.vue') }
    ]
  },
  {
    path: '/setting',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/GameSettingsPage.vue') }
    ]
  },
  {
    path: '/game',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/EnterGamePage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
