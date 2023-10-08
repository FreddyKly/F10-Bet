<template>
  <div class="column">
    <div style="width: 80vw;">
      <q-card>
        <h5 style="margin: 3px; margin-left: 5px;">
          {{ user.username }}
        </h5>
        <h6 style="margin: 3px; margin-left: 5px;">
          Total Points: {{ user.total_points }}
        </h6>
      </q-card>
    </div>
    <h5 class="q-ml-sm">
      Race Results:
    </h5>
    <div v-for="(result, idx) in f1Results" :key="result" class="flex justify-center">
      <q-card class="q-my-md" style="min-width: 80vw; max-width:85vw">
        {{ result.raceName }} &emsp; {{ result.date }}
        <!-- <q-btn class="q-ma-xs" color="primary" icon="edit" style="float: right;" v-on:click="createGame()"></q-btn> -->
        <h6 class="q-my-md">
          Guess: {{ user.guesses[idx].guess }}
        </h6>
        <h6 class="q-my-md">
          10<sup>th</sup>: {{ result.Results[9].Driver.familyName }}
        </h6>
        <h6 class="q-my-md">
          Points: {{ user.guesses[idx].points }}
        </h6>


      </q-card>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

import { db } from 'src/firebaseConfig'
import { useRoute } from 'vue-router';
import { useGameStore } from 'src/stores/gameStore';
import { api } from 'src/boot/axios';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth'
import { collection, query, where, getDoc, doc, getDocs } from "firebase/firestore";

export default defineComponent({
  name: 'UserComp',

  async setup() {
    const route = useRoute()
    const auth = getAuth()
    const gameStore = useGameStore()
    const user = ref()

    onAuthStateChanged(auth, (user) => {
      if (user) {
        gameStore.userID = auth.currentUser.uid
      } else {
        // User is not signed in.
        // ...
      }
    });

    const f1Response = await api.get('https://ergast.com/api/f1/current/results.json?limit=460')
    const f1Results = ref(f1Response.data.MRData.RaceTable.Races)

    console.log(auth.currentUser, 'GameID:', gameStore.gameID)
    const userDoc = doc(db, "user", route.params.id)
    const userSnap = await getDoc(userDoc);
    user.value = userSnap.data()
    console.log(userSnap.data())
    console.log('f1Results: ', f1Results.value)

    return { user, f1Results }
  }
})
</script>
