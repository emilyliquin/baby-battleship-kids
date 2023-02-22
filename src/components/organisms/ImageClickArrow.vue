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

if(route.meta.progress) smilestore.global.progress = route.meta.progress

const props = defineProps(["img_name"])

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
    const button = document.getElementById("finishp")
    button.classList.add("is-success")
    button.classList.remove('is-light');
    document.getElementById("buttontext").classList.toggle("fa")
    document.getElementById("reminder").style.visibility = ""
}



function next_trial() { 
    smilestore.local.page_visited = -1

    const vidData = {video: props.vid_name, reminder: props.reminderText, vid_start: start_time, vid_end: end_time, trial_end: Date.now()}
    smilestore.saveVidData(vidData)
    smilestore.saveData()

    emit('nextVid')
}

</script>

<template>
        <img class="kidvid" id="kidvid" :src="'./' + img_name">

        
        
        <hr>
        <button class="button is-success is-large" id='finishp' @click="next_trial()"><FAIcon id="buttontext" icon="fa-solid fa-arrow-right" /></button>
 </template>

<style scoped>
.kidvid {
    width: auto;
    height: 450px;
  
}

.fa {color: rgb(166, 165, 165);}


.modaltext {
    background-color: #fff;
    padding: 30px;
}

.modal-content {
    width: 80%;
}

</style>