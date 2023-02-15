<script setup>
import { useRouter, useRoute } from 'vue-router'
import useTimelineStepper from '@/composables/timelinestepper'
import useSmileStore from '@/stores/smiledata' // get access to the global store
import * as random from '@/randomization'
import { v4 as uuidv4 } from 'uuid';
import appconfig from '@/config'
import seedrandom from 'seedrandom'

const router = useRouter()
const route = useRoute()
const smilestore = useSmileStore()

const { next, prev } = useTimelineStepper()

if(route.meta.progress) smilestore.global.progress = route.meta.progress

const props = defineProps(["vid_name"])

const emit = defineEmits(["nextVid"])

function next_trial() { 
    // smilestore.saveData()
    emit('nextVid')
}

</script>

<template>
    <div class="page">
        <video class="kidvid" autoplay>
            <source :src="'./' + vid_name + '.webm'" >
            <source :src="'./' + vid_name + '.mp4'" >
            <p>Sorry, we're experiencing technical difficulties! Please contact the researcher to let them know.</p>
        </video>        
        <hr>
        <button class="button is-success is-light is-large" id='finish' @click="next_trial()"><FAIcon icon="fa-solid fa-arrow-right" /></button>
    </div>
</template>

<style scoped>
.kidvid {
    width: 800px;
    height: 450px;
  
}
</style>