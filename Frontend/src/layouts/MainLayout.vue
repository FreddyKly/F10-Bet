<template>alerttoolbaralerttoolbar


  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <img src="~assets/F1_white.png" style="width: 50px; height: 20px" v-on:click="$router.push('/')">
        <q-space></q-space>
        <q-btn flat dense round label="logout" @click="logOut()" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>
          Essential Links
        </q-item-label>

        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from 'vue-router';

const linksList = [
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup() {
    const auth = getAuth();
    const router = useRouter()

    function logOut() {
      signOut(auth).then(() => {
        console.log('logout worked')
        router.push('/')
      }).catch((error) => {
        console.log('logout didnt worked')
      });
    }

    const leftDrawerOpen = ref(false)

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      logOut,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
