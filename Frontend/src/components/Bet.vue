<template>
    <div class="flex justify-center">
        <h5 style="margin-bottom: 5px;">
            Make your guess for 10<sup>th</sup>
        </h5>
        <p style="margin-bottom: 20px;">
            Next race: {{ f1NextRace }}
        </p>

    </div>

    <div class="row flex justify-center">
        <div style="width: 80vw;">
            <q-select v-model="guess" :options="f1Drivers" label="Your Guess" />
        </div>
    </div>
</template>
  
<script>
import { defineComponent, ref, watchEffect } from 'vue'

import { db } from 'src/firebaseConfig'
import { useRoute } from 'vue-router';
import { useGameStore } from 'src/stores/gameStore';
import { api } from 'src/boot/axios';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { collection, query, where, getDoc, doc, getDocs, updateDoc } from "firebase/firestore";

export default defineComponent({
    name: 'BetComp',

    async setup() {
        const auth = getAuth()
        const gameStore = useGameStore()
        
        const f1ResponseNextRace = await api.get('http://ergast.com/api/f1/current/next.json')
        const f1ResponseDrivers = await api.get('http://ergast.com/api/f1/current/drivers.json')
        const f1NextRace = f1ResponseNextRace.data.MRData.RaceTable.Races[0].raceName
        const f1Drivers = f1ResponseDrivers.data.MRData.DriverTable.Drivers.map(driver => driver.familyName)
        const f1Round = f1ResponseNextRace.data.MRData.RaceTable.Races[0].round

        console.log(f1Drivers)
        console.log(auth.currentUser, 'GameID:', gameStore.gameID)
        console.log('f1Results: ', f1NextRace, f1Round)

        const userDoc = doc(db, "user", auth.currentUser.uid)
        const userSnap = await getDoc(userDoc);
        var guess = ref(userSnap.data().guesses[f1Round - 1].guess)


        // eslint-disable-next-line vue/no-watch-after-await
        watchEffect(async () => {
            var userRef = doc(db, 'user', auth.currentUser.uid)
            var newGuess = userSnap.data().guesses
            newGuess[f1Round - 1].guess = guess.value
            console.log(newGuess[f1Round - 1].guess)
            await updateDoc(userRef, {
                guesses: newGuess,
            });
        })

        return { f1NextRace, f1Drivers, guess }
    }
})
</script>
  