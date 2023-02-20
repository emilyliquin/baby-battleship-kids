<script setup>
import {ref, onMounted} from 'vue'
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

// const showmodal = ref(false) // reactive
// function toggleModal() {
//     showmodal.value=!showmodal.value  // have to use .value in <script> when using ref()
//     // document.getElementById('kidvid')
//     if(showmodal.value === false){
//         document.getElementById("kidvid").play();
//     }
// }

let start_time

onMounted(() => {
    start_time = Date.now()

    // if(smilestore.local.page_visited === -1) {
    // // The cookie doesn't exist. Create it now
    //     smilestore.local.page_visited = 1;
    // }
    // else {
    //     // Not the first visit, so alert
    //     console.log("refreshed")
    //     toggleModal()
    // }
  })



function next_trial() { 
    smilestore.local.page_visited = -1

    const vidData = {video: props.vid_name, vid_start: start_time, vid_end: Date.now(), trial_end: Date.now()}
    smilestore.saveVidData(vidData)
    smilestore.saveData()

    emit('nextVid')
}

</script>

<template>
        <video class="kidvid" id="kidvid" autoplay @ended="next_trial()">
            <source :src="'./' + vid_name + '.webm'" >
            <source :src="'./' + vid_name + '.mp4'" >
            <p>Sorry, we're experiencing technical difficulties! Please contact the researcher to let them know.</p>
        </video>

                <!-- modal for refresh page -->
        <!-- <div class="modal" :class="{'is-active': showmodal}">
        <div class="modal-background"></div>
        <div class="modal-content">
            <button class="button is-success is-large" @click="toggleModal()">Click here to keep going</button>
        </div>
        </div> -->

        <hr>
        <button class="button is-light is-large" id='finishp' @click="next_trial()"><FAIcon class="fa" id="buttontext" icon="fa-solid fa-arrow-right" /></button>
</template>

<style scoped>
.kidvid {
    width: 800px;
    height: 450px;
  
}
.fa {color: rgb(166, 165, 165);}

</style>