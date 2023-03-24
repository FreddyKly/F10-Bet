import {defineStore} from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useGameStore = defineStore('gameStore', {
    state: () => ({
        gameID: useLocalStorage('gameID', ''),
        userID: useLocalStorage('userID', '')
    })
})