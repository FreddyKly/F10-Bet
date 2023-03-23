<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <img src="~assets/F1_white.png" style="width: 50px; height: 20px" v-on:click="$router.push('/ranking')">
        <q-space></q-space>
        <q-btn v-if="gameID != ''" class="q-mr-md" flat dense round icon="share" v-on:click="sharePressed"></q-btn>
        <q-btn flat dense round label="logout" @click="logOut()" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-dialog v-model="share">
        <q-card>
          <q-card-section>
            <div class="text-h6">Group-ID:</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            {{ gameID }}
          </q-card-section>

          <q-card-actions>
            <q-btn flat label="OK" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, watchEffect } from 'vue'

import { getAuth, signOut } from "firebase/auth";
import { useRouter } from 'vue-router';
import { useGameStore } from 'src/stores/gameStore';

export default defineComponent({
  name: 'MainLayout',

  setup() {
    const auth = getAuth();
    const router = useRouter()

    function logOut() {
      signOut(auth).then(() => {
        console.log('logout worked')
        router.push('/')
      }).catch((error) => {
        console.log('logout didnt worked')
      });
    }

    const gameStore = useGameStore()
    const share = ref(false)

    var gameID = ref(gameStore.gameID)
    // eslint-disable-next-line vue/no-watch-after-await
    watchEffect(async () => {
      if (gameStore.gameID != '') {
        gameID.value = gameStore.gameID
        console.log(gameStore.gameID, 'share: ', share.value)

      }
    })

    return {
      logOut,
      gameID,
      share,
      sharePressed() {
        share.value = !share.value
      }
    }
  }
})
</script>
