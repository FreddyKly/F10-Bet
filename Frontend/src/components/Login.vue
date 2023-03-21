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
  import { useRouter } from 'vue-router';
  
  export default defineComponent({
    name: 'LoginComp',
  
    async setup() {
      const router = useRouter()
      const auth = getAuth()
      if(auth.currentUser !== null) {
        const game = doc(db, "user", auth.currentUser.uid)
        const gameSnap = await getDoc(game);
        if (gameSnap.exists()) {
            router.push('/rankings')
        } else {
            router.push('/game')
        }
      }
  
      function signInWithGoogle() {
        const provider = new GoogleAuthProvider()
        setPersistence(auth, browserLocalPersistence)
          .then(() => {
            return signInWithPopup(getAuth(), provider)
              .then((result) => {
                console.log(result.user)
                router.push('/game')
                console.log(auth.currentUser)
              })
              .catch((error) => {
                alert('login did not work')
              })
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
  