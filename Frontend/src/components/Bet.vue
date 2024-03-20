<template>
    <div class="column flex justify-center">     
        <div class="row justify-center" style="width: 80vw;">
            <div style="margin-left: 10%;">
                <h5>for:</h5>
            </div>
            <div class="col flex self-center" style="margin-bottom: 20px; margin-left: 4%;">
                <q-select v-model="selectedRaceLocation" :options="openGuessesLocations" label="Race"/>
            </div>
        </div>
    </div>

    <div class="column">
        <div class="row flex justify-center">
            <div style="width: 80vw;">
                <q-select v-model="guess" :options="f1Drivers" label="Your Guess" />
            </div>
        </div>
        <div class="row self-center q-ma-lg">
            <q-btn size="1.5rem" color="primary" label="Submit" v-on:click="submit()"></q-btn>
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
import { useGameStore } from 'src/stores/gameStore';
import { api } from 'src/boot/axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getDoc, doc, updateDoc} from "firebase/firestore";
import { getActiveGameID } from 'src/utils';

export default defineComponent({
    name: 'BetComp',

    async setup() {
        const f1ResponseDrivers = await api.get('https://ergast.com/api/f1/current/drivers.json')
        const f1Drivers = f1ResponseDrivers.data.MRData.DriverTable.Drivers.map(driver => driver.familyName)
        f1Drivers.unshift('') //So you can select "Nothing" as your bet

        const auth = getAuth()
        const gameStore = useGameStore()

        const userDoc = doc(db, "user", gameStore.userID)
        const userSnap = await getDoc(userDoc);
        gameStore.gameID = getActiveGameID(userSnap)
        const openGuesses = userSnap.data().games[gameStore.gameID].guesses.filter(item => item.guess === '')
        const openGuessesLocations = openGuesses.map(race => race.location)
        var guess = ref()
        var selectedRaceLocation = ref(openGuesses[0].location)
        const showNotif = ref(false)

        onAuthStateChanged(auth, (user) => {
            if (user) {
                gameStore.userID = auth.currentUser.uid
            } else {
                // User is not signed in.
                // ...
            }
        });

        // console.log(f1Drivers, f1Round, f1test)
        // console.log(auth.currentUser, 'GameID:', gameStore.gameID, 'UserID: ', gameStore.userID)
        // console.log('f1Results: ', f1NextRace, f1Round)
        // console.log(openGuesses)

        async function submit() {
            var newGuesses = userSnap.data().games[gameStore.gameID].guesses
            const idxRound = newGuesses.findIndex((race) => race.location === selectedRaceLocation.value)
            newGuesses[idxRound].guess = guess.value
            console.log(newGuesses, idxRound, gameStore.gameID)
            await updateDoc(doc(db, "user", auth.currentUser.uid), {
                [`games.${gameStore.gameID}.guesses`]: newGuesses,
            }).then(
                showNotif.value = true
            );
        }

        // eslint-disable-next-line vue/no-watch-after-await
        // watchEffect(async () => {
        //     var userRef = doc(db, 'user', auth.currentUser.uid)
        //     var newGuess = userSnap.data().guesses
        //     newGuess[f1Round - 1].guess = guess.value
        //     console.log(newGuess[f1Round - 1].guess)
        //     await updateDoc(userRef, {
        //         guesses: newGuess,
        //     });
        // })

        return { f1Drivers, guess, showNotif, openGuessesLocations, selectedRaceLocation, submit }
    }
})
</script>
  