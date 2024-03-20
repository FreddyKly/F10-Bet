<template>
    <q-page>
      <div class="fixed-center">
        <q-btn color="primary" label="Login" size="2rem" icon="login" v-on:click="signInWithGoogle()" />
      </div>
    </q-page>
  </template>
  
  <script>
  import { defineComponent } from 'vue'
  import Standings from 'src/components/Standings.vue'
  import { getAuth, GoogleAuthProvider, signInWithPopup, browserLocalPersistence, setPersistence } from 'firebase/auth'
  import { doc, getDoc, setDoc } from 'firebase/firestore'
  import { db } from 'src/firebaseConfig'
  import { useRouter } from 'vue-router';
  import { useGameStore } from 'src/stores/gameStore'
import { getActiveGameID } from 'src/utils'
  
  export default defineComponent({
    name: 'LoginComp',
  
    async setup() {
      const router = useRouter()
      const auth = getAuth()
      await setPersistence(auth, browserLocalPersistence);
      console.log(auth.currentUser)
      const gameStore = useGameStore()
      if(auth.currentUser !== null) {
        // if(gameStore.gameID !== null) {
        console.log('User is logged in')
        const user = doc(db, "user", auth.currentUser.uid)
        const userSnap = await getDoc(user)
        console.log(userSnap.data().game_id)
        if (userSnap.exists()) {
            gameStore.gameID = userSnap.data().game_id
            router.push('/ranking')
        } else {
            router.push('/game')
        }
      }
  
      function signInWithGoogle() {
        const provider = new GoogleAuthProvider()
            return signInWithPopup(getAuth(), provider)
              .then(async () => {
                const user = doc(db, "user", auth.currentUser.uid)
                const userSnap = await getDoc(user);
                if (userSnap.exists()) {
                  console.log('Login worked for user: ', userSnap)
                  const activeGameID = getActiveGameID(userSnap)
                  if (activeGameID){ 
                    gameStore.gameID = activeGameID
                    gameStore.userID = auth.currentUser.uid
                    router.push('/ranking')
                  } else {
                    router.push("/game")
                  }
                } else {
                  await setDoc(user, {
                    e_mail: auth.currentUser.email,
                    google_id: auth.currentUser.uid,
                    username: auth.currentUser.displayName,
                  })
                  router.push('/game')
                }
                
              })
              .catch((error) => {
                alert('login did not work', error)
              })
          .catch((error) => {
            const errorMessage = error.message;
            console.log(errorMessage)
          });
  
      }
  
      return { signInWithGoogle }
    }
  })
  </script>
  