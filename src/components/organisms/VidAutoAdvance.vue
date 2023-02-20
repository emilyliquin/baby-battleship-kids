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
        <video class="kidvid" autoplay @ended="next_trial()">
            <source :src="'./' + vid_name + '.webm'" >
            <source :src="'./' + vid_name + '.mp4'" >
            <p>Sorry, we're experiencing technical difficulties! Please contact the researcher to let them know.</p>
        </video>
        <hr>
        <button class="button is-light is-large" id='finishp' @click="next_trial()"><FAIcon class="fa" id="buttontext" icon="fa-solid fa-arrow-right" /></button>
    </div>
</template>

<style scoped>
.kidvid {
    width: 800px;
    height: 450px;
  
}
.fa {color: rgb(166, 165, 165);}

</style>