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

const checked = ref(false)
function soundcheck(){
    checked.value = !checked.value
}


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
            Before proceeding with the experiment, please <b>turn your sound on</b> and <b>make this window full screen</b>.
        </p>
        <p class="is-size-5 has-text-left">
        If you are unable to do so, please close this window and return your submission on Prolific.
        </p>
        <div class="field">
            <div class="control">
                <label class="checkbox">
                    <input type="checkbox" id="soundcheck" @click="soundcheck()">
                    I have turned my sound on and made this window full screen.
                </label>
            </div>
        </div>
    </div>
        <hr>
        <button v-if="checked" class="button is-success is-large" id='finishp' @click="next_trial()"><FAIcon id="buttontext" icon="fa-solid fa-arrow-right" /></button>
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