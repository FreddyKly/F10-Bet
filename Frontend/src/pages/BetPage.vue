<template>
  <q-page>
    <suspense>
        <template #fallback>
          Loading...
        </template>
        <Bet></Bet>
    </suspense>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import Bet from 'src/components/Bet.vue'

export default defineComponent({
  name: 'BetPage',
  components: { Bet },

  setup () {

    return {  }
  }
})
</script>
