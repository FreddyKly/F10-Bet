<template>
    <div class="flex items-start">
        <div class="column justify-center full-width">
            <div class="col flex justify-center">
                <h5 style="margin: 5px">
                    Standing:
                </h5>

            </div>
            <div v-for="index in 3" :key="index" class="col flex justify-center">
                <q-card class="q-ma-md" style="height: 15vh; width: 80vw;">
                    {{ index }}
                </q-card>
            </div>
            <div class="col flex justify-center q-mt-md">
                <q-btn color="primary" size="1.5em" icon="payments" label="Bet" @click="$router.push()" />
            </div>
        </div>
    </div>
</template>
  
<script>
import { defineComponent } from 'vue'
import { api } from 'src/boot/axios'
import { useRoute } from 'vue-router';
import { db } from 'src/firebaseConfig'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { collection, query, where, getDoc, doc, getDocs } from "firebase/firestore";
import { useGameStore } from 'src/stores/gameStore';

export default defineComponent({
    name: 'StandingComp',

    async setup() {
        const route = useRoute()
        const auth = getAuth()
        const gameStore = useGameStore()

        console.log(auth.currentUser, 'GameID:', gameStore.gameID)
        const userQ = query(collection(db, "user"), where("game_id", "==", gameStore.gameID));
        const userSnap = await getDocs(userQ);
        userSnap.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
        });

        return {}
    }
})
</script>
  