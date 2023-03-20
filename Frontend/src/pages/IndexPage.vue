<template>
  <q-page>
    <suspense>
        <template #fallback>
          Loading...
        </template>
        <Standings></Standings>
    </suspense>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import Standings from 'src/components/Standings.vue'

export default defineComponent({
  name: 'IndexPage',
  components: { Standings },

  setup () {

    return {  }
  }
})
</script>
