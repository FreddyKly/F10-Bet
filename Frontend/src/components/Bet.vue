<template>
    <div class="column flex justify-center">
        <h5 class="self-center" style="margin-bottom: 5px;">
            Make your guess for 10<sup>th</sup>
        </h5>
        <p class="self-center" style="margin-bottom: 20px;">
            Next race: {{ f1NextRace }}
        </p>

    </div>

    <div class="column">
        <div class="row flex justify-center">
            <div style="width: 80vw;">
                <q-select v-model="guess" :options="f1Drivers" label="Your Guess" />
            </div>
        </div>
        <div class="row self-center q-ma-lg">
            <q-btn size="1.5rem" color="primary" label="Submit" v-on:click="showNotif = true"></q-btn>
        </div>
        <div class="flex justify-center full-width fixed-bottom ">
            <q-banner v-if="showNotif" rounded class="bg-green-9 q-mb-lg self-center" style="max-width: 200px;">
                Submit Successful
            </q-banner>
        </div>

    </div>
</template>
  
<script>
import { defineComponent, ref, watchEffect } from 'vue'

import { db } from 'src/firebaseConfig'
import { useRoute } from 'vue-router';
import { useGameStore } from 'src/stores/gameStore';
import { api } from 'src/boot/axios';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth'
import { collection, query, where, getDoc, doc, getDocs, updateDoc } from "firebase/firestore";

export default defineComponent({
    name: 'BetComp',

    async setup() {
        const auth = getAuth()
        const gameStore = useGameStore()
        const showNotif = ref(false)

        onAuthStateChanged(auth, (user) => {
            if (user) {
                gameStore.userID = auth.currentUser.uid
            } else {
                // User is not signed in.
                // ...
            }
        });

        const f1ResponseNextRace = await api.get('https://ergast.com/api/f1/current/next.json')
        const f1ResponseDrivers = await api.get('https://ergast.com/api/f1/current/drivers.json')
        const f1NextRace = f1ResponseNextRace.data.MRData.RaceTable.Races[0].raceName
        const f1Drivers = f1ResponseDrivers.data.MRData.DriverTable.Drivers.map(driver => driver.familyName)
        const f1Round = f1ResponseNextRace.data.MRData.RaceTable.Races[0].round

        console.log(f1Drivers)
        console.log(auth.currentUser, 'GameID:', gameStore.gameID, 'UserID: ', gameStore.userID)
        console.log('f1Results: ', f1NextRace, f1Round)
        

        const userDoc = doc(db, "user", gameStore.userID)
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

        return { f1NextRace, f1Drivers, guess, showNotif }
    }
})
</script>
  