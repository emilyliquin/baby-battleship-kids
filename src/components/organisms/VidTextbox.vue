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

const props = defineProps(["vid_name", "reminderText", "hint"])

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


function highlightNext(){
    end_time =  Date.now()
    // const button = document.getElementById("finishp")
    // const box = document.getElementById("textbox")
    // button.style.visibility = ""
    // box.style.visibility = ""

    // button.classList.add("is-success")
    // button.classList.remove('is-light');
    // document.getElementById("buttontext").classList.toggle("fa")
    document.getElementById("hiddenstuff").style.visibility = ""

}

const questionText = ref("")

function next_trial() { 
    smilestore.local.page_visited = -1
    const reminder = props.reminderText
    const {hint} = props
    const trialData = {...(reminder ? { reminder } : {}),
    ...(hint ? { hint } : {}),
    ...{ question: questionText.value }}
    const vidData = {video: props.vid_name, vid_start: start_time, vid_end: end_time, trial_end: Date.now(), trial_data: trialData}
    smilestore.saveTrialData(vidData)
    smilestore.saveData()
    emit('nextVid')
}

</script>

<template>
        <video class="kidvid" id="kidvid" autoplay @ended="highlightNext()">
            <source :src="'./' + vid_name + '.webm'" >
            <source :src="'./' + vid_name + '.mp4'" >
            <p>Sorry, we're experiencing technical difficulties! Please contact the researcher to let them know.</p>
        </video>     
        <div id="hiddenstuff" style="visibility: hidden;">
            <p class="is-size-4 has-text-center" id="reminder" v-html="reminderText" > </p>   


        <hr>
        <input class="input" id="textbox" type="text" placeholder="Your question" v-model="questionText">
        <br>
        <br>
        <button class="button is-success is-large" id='finishp' @click="next_trial()"><FAIcon id="buttontext" icon="fa-solid fa-arrow-right" /></button>

        </div>
 </template>

<style scoped>
.kidvid {
    width: 800px;
    height: auto;
  
}

.fa {color: rgb(166, 165, 165);}


.modaltext {
    background-color: #fff;
    padding: 30px;
}

.modal-content {
    width: 80%;
}

.input{
    width: 70%;
}

</style>