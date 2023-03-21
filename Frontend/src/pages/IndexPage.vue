<template>
  <q-page>
    <suspense>
        <template #fallback>
          Loading...
        </template>
        <Login></Login>
    </suspense>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import Login from 'src/components/Login.vue'

export default defineComponent({
  name: 'IndexPage',
  components: {Login},
  

  setup() {

    return {  }
  }
})
</script>
