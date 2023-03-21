<template>
    <q-page>
      <div class="column fixed-center">
        <q-btn class="q-ma-md" color="primary" no-wrap label="Create" size="1.5rem" icon="add" v-on:click="createGame()"/>
        <q-btn class="q-ma-md" color="primary" no-wrap label="Join" size="1.5rem" icon="group" v-on:click="joinGame()"/>
      </div>
    </q-page>
  </template>
  
  <script>
  import { defineComponent } from 'vue'
  import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
  import { setDoc, doc } from 'firebase/firestore'
  import { useRouter } from 'vue-router';
  import { db } from 'src/firebaseConfig'
  
  export default defineComponent({
    name: 'EnterGameComponent',
    
  
    async setup() {
      const auth = getAuth()
      console.log(auth.currentUser)
        

      await setDoc(doc(db, "user", auth.currentUser.uid), {
        e_mail: auth.currentUser.email,
        google_id: auth.currentUser.uid,
        group_id: 1,
        guesses: [],
        total_points: 0,
        username: auth.currentUser.displayName,
      })


      async function createGame() {
        console.log('Create Game')
      }

      async function joinGame() {
        console.log('Join Game')
      }
      
      return { createGame, joinGame }
    }
  })
  </script>
  