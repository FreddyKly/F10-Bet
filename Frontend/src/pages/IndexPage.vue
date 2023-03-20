<template>
  <q-page class="flex items-start">
    <div class="column justify-center full-width">
      <div class="col flex justify-center">
        Standing:
      </div>
      <div v-for="index in 3" :key="index" class="col flex justify-center">
        <q-card class="q-ma-md" style="height: 15vh; width: 80vw;">
          {{ index }}
        </q-card>
      </div>
      <div class="col flex justify-center q-mt-md">
        <q-btn color="primary" size="1.5em" icon="payments" label="Bet" @click="onClick" />
      </div>
    </div>
    
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IndexPage'
})
</script>
