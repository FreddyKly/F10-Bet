<template>
  <q-page>
    <div class="column flex justify-center">
      <h5 class="self-center" style="margin-bottom: 5px;">
        Make your guess for 10<sup>th</sup>
      </h5>
    </div>
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

  setup() {

    return {}
  }
})
</script>
