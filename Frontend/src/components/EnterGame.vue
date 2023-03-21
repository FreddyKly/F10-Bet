<template>
    <q-page>
        <div class="column fixed-center">
            <q-btn class="q-ma-md" color="primary" no-wrap label="Create" size="1.5rem" icon="add"
                v-on:click="createGame()" />
            <q-btn class="q-ma-md" color="primary" no-wrap label="Join" size="1.5rem" icon="group"
                v-on:click="join = true" />

            <!-- Popup Dialog -->
            <q-dialog v-model="join" persistent>
                <q-card style="min-width: 80vw;">
                    <q-card-section>
                        <div class="text-h6">Game-ID</div>
                    </q-card-section>

                    <q-card-section class="q-pt-none">
                        <q-input dense v-model="gameID" autofocus @keyup.enter="joinGame()" />
                    </q-card-section>

                    <q-card-actions class="text-primary">
                        <q-btn flat label="Cancel" v-close-popup />
                        <q-btn flat label="Join" v-on:click="joinGame()" />
                    </q-card-actions>
                </q-card>
            </q-dialog>

            <q-dialog v-model="invalidGameID" persistent transition-show="scale" transition-hide="scale">
                <q-card style="width: 50vw">
                    <q-card-section>
                        <div class="text-h6">Game-ID does not exist</div>
                    </q-card-section>

                    <q-card-actions>
                        <q-btn text-color="primary" flat label="OK" v-close-popup />
                    </q-card-actions>
                </q-card>
            </q-dialog>
        </div>
    </q-page>
</template>
  
<script>
import { defineComponent, ref } from 'vue'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { setDoc, doc, query, collection, where, getDocs } from 'firebase/firestore'
import { useRouter } from 'vue-router';
import { db } from 'src/firebaseConfig'
import { api } from 'src/boot/axios';
import { useGameStore } from 'src/stores/gameStore';

export default defineComponent({
    name: 'EnterGameComponent',


    async setup() {
        var join = ref(false)
        var invalidGameID = ref(false)
        var gameID = ref('')

        const gameStore = useGameStore()
        const router = useRouter()
        const auth = getAuth()
        console.log(auth.currentUser)

        async function initializeGuesses() {
            const f1Response = await api.get('http://ergast.com/api/f1/current.json')
            const locations = f1Response.data.MRData.RaceTable.Races.map(race => race.raceName)
            console.log(locations)
            var guesses = []
            for (let i = 0; i < locations.length; i++) {
                guesses.push({
                    guess: '',
                    location: locations[i],
                    points: 0,
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                })
            }
            return guesses
        }

        async function createGame() {
            console.log('Create Game')
            const guesses = await initializeGuesses()
            await setDoc(doc(db, "user", auth.currentUser.uid), {
                e_mail: auth.currentUser.email,
                google_id: auth.currentUser.uid,
                game_id: 'g' + auth.currentUser.uid,
                guesses: guesses,
                total_points: 0,
                username: auth.currentUser.displayName,
            })
            gameStore.gameID = 'g' + auth.currentUser.uid
            router.push('/ranking')
        }

        async function joinGame() {
            console.log('Join Game')
            console.log(join.value)
            const userQ = query(collection(db, "user"), where("game_id", "==", gameID.value));
            const userSnap = await getDocs(userQ);
            console.log(userSnap)
            const guesses = await initializeGuesses()
            if (!userSnap.empty) {
                console.log('exists')
                await setDoc(doc(db, "user", auth.currentUser.uid), {
                    e_mail: auth.currentUser.email,
                    google_id: auth.currentUser.uid,
                    game_id: gameID.value,
                    guesses: guesses,
                    total_points: 0,
                    username: auth.currentUser.displayName,
                })
                join.value = false
                gameStore.gameID = gameID.value
                router.push('/ranking')
            } else {
                console.log('didnt exist')
                invalidGameID.value = true
            }
        }
        return { createGame, joinGame, join, gameID, invalidGameID }
    }
})
</script>
  