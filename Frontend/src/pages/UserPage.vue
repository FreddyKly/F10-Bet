<template>
    <q-page>
      <suspense>
          <template #fallback>
            Loading...
          </template>
          <User></User>
      </suspense>
    </q-page>
  </template>
  
  <script>
  import { defineComponent } from 'vue'
  import User from 'src/components/User.vue'

  export default defineComponent({
    name: 'UserPage',
    components: {User},
  
    setup() {
      
  
      return {  }
    }
  })
  </script>
  