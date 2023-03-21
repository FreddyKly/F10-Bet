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
  import { doc, getDoc } from 'firebase/firestore'
  import { db } from 'src/firebaseConfig'
  import { useRouter } from 'vue-router';
  
  export default defineComponent({
    name: 'LoginComp',
  
    async setup() {
      const router = useRouter()
      const auth = getAuth()
      console.log(auth.currentUser)
      if(auth.currentUser !== null) {
        console.log('User is logged in')
        const user = doc(db, "user", auth.currentUser.uid)
        const userSnap = await getDoc(user);
        if (userSnap.exists()) {
            router.push('/ranking')
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
  