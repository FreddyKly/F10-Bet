<template>
  <q-page>
    <div class="col flex justify-center">
      <h5 style="margin: 5px">
        Standing:
      </h5>
    </div>
    <suspense>
      <template #fallback>
        Loading...
      </template>
      <Standings></Standings>
    </suspense>
    <div class="col flex justify-center q-mt-md">
      <q-btn color="primary" size="1.5em" icon="payments" label="Bet" @click="$router.push('/Bet')" />
    </div>
  </q-page>
</template>
  
<script>
import { defineComponent } from 'vue'
import Standings from 'src/components/Standings.vue'

export default defineComponent({
  name: 'RankingsPage',
  components: { Standings },

  setup() {

    return {}
  }
})
</script>
  