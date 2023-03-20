<template>
  <q-page>
    <div class="fixed-center">
      <q-btn color="primary" label="Login" size="2rem" icon="login" v-on:click="signInWithGoogle()"/>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import Standings from 'src/components/Standings.vue'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'IndexPage',

  setup() {
    const router = useRouter()
    const auth = getAuth()
    console.log(auth.currentUser)

    function signInWithGoogle () {
      const provider = new GoogleAuthProvider()
      signInWithPopup(getAuth(), provider)
      .then((result) => {
        console.log(result.user)
        router.push('/1/ranking')
        console.log(auth.currentUser)
      })
      .catch((error) => {

      })
    }

    return { signInWithGoogle }
  }
})
</script>
