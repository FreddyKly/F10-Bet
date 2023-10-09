<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <img src="~assets/F1_white.png" style="width: 50px; height: 20px" v-on:click="$router.push('/ranking')">
        <q-space></q-space>
        <q-btn flat v-on:click="qualiPressed">
          <q-icon name="equalizer" size="2em"/>
        </q-btn>
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
            <q-btn flat icon="content_copy" v-on:click="copy()"></q-btn>
          </q-card-section>

          <q-card-actions>
            <q-btn flat label="OK" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="showQuali">
        <q-card>
          <h5 style="margin: 10px;">
            Qualifying Results:
          </h5>
          <q-card-section style="background-color: rgb(36, 36, 36); padding-top: 5px;">
            <q-select v-model="selectedRaceLocation" :options="locations" label="Race" style="font-size: 20px;"/>
          </q-card-section>
            <div v-for="driver in driverGrid" :key="driver">
              <q-separator dark/>
              <div class="row">
                <span style="border-left: thick solid #609cd4; margin: 4px;"></span>
                <p style="font-size: 20px; margin: 5px;">
                {{ driver }}
              </p>
              </div>
              
              
              
            </div>
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
import { api } from 'src/boot/axios'
import { useGameStore } from 'src/stores/gameStore';
import { copyToClipboard } from 'quasar'

export default defineComponent({
  name: 'MainLayout',

  setup() {
    const auth = getAuth();
    const router = useRouter()
    const gameStore = useGameStore()
    const share = ref(false)
    const showQuali = ref(false)
    var gameID = ref(gameStore.gameID)
    var selectedRaceLocation = ref()
    var qualiResult = ref()
    var locations = ref([])
    const test = ['asdfasdf', 'asdfdsaf', 'asdfsdf', 'asdfdsf', 'asdfasdf', 'asdfsdafas']
    var driverGrid = Array()

    function logOut() {
      signOut(auth).then(() => {
        console.log('logout worked')
        router.push('/')
      }).catch((error) => {
        console.log('logout didnt worked')
      });
    }

    function copy() {
      copyToClipboard(gameID.value)
        .then(() => {
          console.log('copy worked')
        })
        .catch(() => {
          console.log('copy did not work')
        })
    }

    async function getQualiResults(){
      const f1Response = await api.get('https://ergast.com/api/f1/current.json')
      locations.value = f1Response.data.MRData.RaceTable.Races.map(race => race.raceName)

      const f1LastResult = await api.get('http://ergast.com/api/f1/current/9/results.json')
      selectedRaceLocation.value = f1LastResult.data.MRData.RaceTable.Races[0].raceName
      const lastRaceStandings = f1LastResult.data.MRData.RaceTable.Races[0].Results
      
      for(let i = 0; i < 20; i++){
        console.log(lastRaceStandings[i].Driver)
        if (lastRaceStandings[i].grid === "0") {
          driverGrid.push(lastRaceStandings[i].Driver.familyName)
        } else {
          driverGrid[lastRaceStandings[i].grid - 1] = lastRaceStandings[i].Driver.familyName
        }
        
      }
      console.log(f1LastResult.data.MRData.RaceTable.Races[0])
      console.log(driverGrid)
    }

    // eslint-disable-next-line vue/no-watch-after-await
    watchEffect(async () => {
      if (gameStore.gameID != '') {
        gameID.value = gameStore.gameID
        console.log(gameStore.gameID, 'share: ', share.value)
      }
    })
    watchEffect(async () => {
      console.log(selectedRaceLocation.value)
      // const raceLocationID = f1LastResult.data.MRData.RaceTable.Races[0].Circuit.circuitId
      // const f1SelectedRaceResults = await api.get(`http://ergast.com/api/f1/current/circuits/${raceLocationID}/results/.json`)
      
    })

    return {
      logOut,
      copy,
      gameID,
      locations,
      share,
      showQuali,
      selectedRaceLocation,
      driverGrid,
      sharePressed() {
        share.value = !share.value
      },
      qualiPressed() {
        showQuali.value = !showQuali.value
        getQualiResults()
      }
    }
  }
})
</script>
