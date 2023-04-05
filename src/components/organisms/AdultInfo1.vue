<script setup>
import { onMounted, ref } from 'vue'
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

// if(route.meta.progress) smilestore.data.progress = route.meta.progress
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

let start_time = 0
let end_time = 0

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
    const trialData = {}
    const vidData = {trial_start: start_time, trial_end: Date.now(), trial_data: trialData}
    smilestore.saveTrialData(vidData)
    smilestore.saveData()

    emit('nextVid')
}

</script>

<template>
    <div class="instructions">
        <h1 class="title">Instructions</h1>
        <p class="is-size-5 has-text-left">
            Welcome to the experiment! <b>This experiment was originally designed for children. </b> As a result, the instructions may seem overly detailed or simplistic at times, and some of the questions may seem easy or silly to adults.
        </p>
        <p class="is-size-5 has-text-left">
            Your responses are very important for our research, so we ask that you pay close attention throughout the study. Please take this study seriously and answer all questions to the best of your ability.
        </p>
    </div>
        <hr>
        <button class="button is-success is-large" id='finishp' @click="next_trial()"><FAIcon id="buttontext" icon="fa-solid fa-arrow-right" /></button>
 </template>

<style scoped>

.modaltext {
    background-color: #fff;
    padding: 30px;
}

.modal-content {
    width: 80%;
}
.instructions {
    width: 60%;
    margin: auto;
}

.instructions p {
    padding-bottom: 20px;
}
</style>