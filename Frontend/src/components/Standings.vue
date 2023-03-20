<template>
    <div class="flex items-start">
        <div class="column justify-center full-width">
            <div class="col flex justify-center">
                <h5 style="margin: 5px">
                    Standing:
                </h5>

            </div>
            <div v-for="index in 3" :key="index" class="col flex justify-center">
                <q-card class="q-ma-md" style="height: 15vh; width: 80vw;">
                    {{ index }}
                </q-card>
            </div>
            <div class="col flex justify-center q-mt-md">
                <q-btn color="primary" size="1.5em" icon="payments" label="Bet" @click="$router.push()" />
            </div>
        </div>
    </div>
</template>
  
<script>
import { defineComponent } from 'vue'
import { api } from 'src/boot/axios'
import { useRoute } from 'vue-router';
import { db } from 'src/firebaseConfig'
import { collection, query, where, getDoc, doc } from "firebase/firestore";

export default defineComponent({
    name: 'IndexPage',

    async setup() {
        const route = useRoute()
        const game = doc(db, "group", 'Ws4u3cABHxkPDYHOA7IK')
        const gameSnap = await getDoc(game);
        console.log(gameSnap.data())
        // const q = query(collection(db, "user"), where("capital", "==", true));

        // const querySnapshot = await getDocs(q);
        // querySnapshot.forEach((doc) => {
        //   // doc.data() is never undefined for query doc snapshots
        //   console.log(doc.id, " => ", doc.data());
        // });


        return {}
    }
})
</script>
  