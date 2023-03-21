<template>
    <q-page>
      <suspense>
          <template #fallback>
            Loading...
          </template>
          <EnterGame></EnterGame>
      </suspense>
    </q-page>
  </template>
  
  <script>
  import { defineComponent } from 'vue'
  import EnterGame from 'src/components/EnterGame.vue'

  export default defineComponent({
    name: 'IndexPage',
    components: {EnterGame},
    
  
    setup() {

      return {  }
    }
  })
  </script>
  