<template>
    <div class="flex items-start">
        <div class="column justify-center full-width">
            
            <div v-for="user in users" :key="user" class="col flex justify-center">
                <q-card class="q-ma-md" style="height: 15vh; width: 80vw;"
                    v-on:click="$router.push(`/user/${user.google_id}`)">
                    <h5 style="margin: 3px">
                        {{ user.username }}
                    </h5>
                    <h6 style="margin: 3px;">
                        Total Points: {{ user.total_points }}
                    </h6>
                </q-card>
            </div>
        </div>
    </div>
</template>
  
<script>
import { defineComponent, ref } from 'vue'
import { api } from 'src/boot/axios'
import { useRoute } from 'vue-router';
import { db } from 'src/firebaseConfig'
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth'
import { collection, query, where, getDoc, doc, getDocs, updateDoc, orderBy } from "firebase/firestore";
import { useGameStore } from 'src/stores/gameStore';

export default defineComponent({
    name: 'StandingComp',

    async setup() {
        const route = useRoute()
        const auth = getAuth()
        const gameStore = useGameStore()
        const users = ref([])
        const posDifPoints = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1]

        onAuthStateChanged(auth, (user) => {
            if (user) {
                gameStore.userID = auth.currentUser.uid
            } else {
                // User is not signed in.
                // ...
            }
        });

        console.log(auth.currentUser, 'GameID:', gameStore.gameID)
        const userQ = query(collection(db, "user"), orderBy(`games.${gameStore.gameID}`));
        const userSnap = await getDocs(userQ);
        userSnap.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log('userID: ', doc.id, " => ", doc.data());
            users.value.push(doc.data())
        });
        console.log(users.value[0])

        // Update user data ( should be a service)
        const f1Response = await api.get('https://ergast.com/api/f1/current/results.json?limit=460')
        const f1Results = f1Response.data.MRData.RaceTable.Races
        var racePositions = []
        console.log('f1Results: ', f1Results)
        for (let raceIdx = 0; raceIdx < f1Results.length; raceIdx++) {
            let oneRacePositions = []
            for (let position = 0; position < f1Results[raceIdx].Results.length; position++) {
                oneRacePositions.push(f1Results[raceIdx].Results[position].Driver.familyName)
            }
            racePositions.push(oneRacePositions)
            oneRacePositions = []
        }

        // Calculate points for each user and each race
        console.log(racePositions)
        for (let userIdx = 0; userIdx < users.value.length; userIdx++) {
            var newGuesses = users.value[userIdx].guesses
            var newTotPoints = 0
            for (let raceIdx = 0; raceIdx < racePositions.length; raceIdx++) {
                // console.log(racePositions[raceIdx].indexOf(users.value[userIdx].guesses[raceIdx].guess))
                let posError = Math.abs(racePositions[raceIdx].indexOf(users.value[userIdx].guesses[raceIdx].guess) + 1 - 10)
                // console.log(posError)
                if(posError < 10 ) {
                    newGuesses[raceIdx].points = posDifPoints[posError]
                    newTotPoints += posDifPoints[posError]
                }
            }
            var userRef = doc(db, 'user', users.value[userIdx].google_id)
            console.log('new Guesses: ', newGuesses, 'new Total Points: ', newTotPoints)
            await updateDoc(userRef, {
                games: {
                    [gameStore.gameID]: {
                        guesses: newGuesses,
                        total_points: newTotPoints,
                    } 
                },
            })
        }


        return { users }
    }
})
</script>
  