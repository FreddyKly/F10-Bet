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

            <q-dialog v-model="gameNotActive" persistent transition-show="scale" transition-hide="scale">
                <q-card style="width: 50vw">
                    <q-card-section>
                        <div class="text-h6">This game is not active anymore. It is most likely a game from a past season. Create a new Game.</div>
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
import { setDoc, doc, query, collection, where, getDocs, updateDoc, getDoc, deleteField, orderBy } from 'firebase/firestore'
import { useRouter } from 'vue-router';
import { db } from 'src/firebaseConfig'
import { api } from 'src/boot/axios';
import { useGameStore } from 'src/stores/gameStore';
import { generateUniqueID, getActiveGameID } from 'src/utils';
import * as f1Service from 'src/f1Service';

export default defineComponent({
    name: 'EnterGameComponent',


    async setup() {
        var join = ref(false)
        var invalidGameID = ref(false)
        var gameNotActive = ref(false)
        var gameID = ref('')

        const gameStore = useGameStore()
        const router = useRouter()
        const auth = getAuth()
        console.log(auth.currentUser)

        async function initializeGuesses() {
            const locations = await f1Service.getRaceLocations()
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
            const emptyGuesses = await initializeGuesses()
            const currentSeason = await f1Service.getCurrentSeasonYear()
            const user = doc(db, "user", auth.currentUser.uid)
            const generatedGameID = generateUniqueID()

            await updateDoc(user, {
                [`games.${generatedGameID}`]: {
                        season: currentSeason,
                        guesses: emptyGuesses,
                        total_points: 0,
                        active: true
                    } 
            })
            gameStore.gameID = generatedGameID
            router.push('/ranking')
        }

        async function joinGame() {
            console.log('Join Game')
            const userQ = query(collection(db, "user"), orderBy(`games.${gameID.value}`));
            const userSnap = await getDocs(userQ);
            if(userSnap.empty){
                invalidGameID.value = true
            } else {
                gameNotActive.value = !userSnap.docs[0].data().games[gameID.value].active
                if (!gameNotActive.value){
                    console.log("active game")
                    const emptyGuesses = await initializeGuesses()
                    await updateDoc(doc(db, "user", auth.currentUser.uid), {
                        [`games.${generatedGameID}`]: {
                            season: currentSeason,
                            guesses: emptyGuesses,
                            total_points: 0,
                            active: true
                        } 
                    })
                    join.value = false
                    gameStore.gameID = gameID.value
                    router.push('/ranking')
                }
            }
        }
        return { createGame, joinGame, join, gameID, invalidGameID, gameNotActive }
    }
})
</script>
  