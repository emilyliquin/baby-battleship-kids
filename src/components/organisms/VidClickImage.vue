<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
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

const props = defineProps(["vid_name", "attempt", "correct", "clickOptions", "hideOptions", "hideArrow"])

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
    if(props.hideOptions){
        const opts = document.getElementsByClassName("overlay")
        // for each option, hide it
        for (let i = 0; i < opts.length; i++) {
            opts[i].style.visibility = "hidden"
        }
    }
    if(props.hideArrow){
        document.getElementById("finishp").style.visibility = "hidden"
    }
  })

function showButtons(){
    end_time =  Date.now()
    const collection = document.getElementsByClassName("overlay");
    for (let i = 0; i < collection.length; i++) {
        collection[i].style.visibility = ("")
    }

    if(props.hideArrow){
        // document.getElementById("finishp").style.visibility = ""
    }
}

function getStyle(option){
    return { height: `${option.height  }px`, width: `${option.width  }px`, marginTop: `${option.margin_top  }px`, marginLeft: `${option.margin_left  }px`}
}

// for optional parameters, return null to data if they are undefined
function cleanDataVar(v){
    if(v){
        return v
    } 
    return null
}


function next_trial(choice) { 
    smilestore.local.page_visited = -1
    const {attempt} = props
    const correct_choice = props.correct
    const trialData = {...(attempt ? { attempt } : {}),
    ...(correct_choice ? { correct_choice } : {}),
    ...{choice}}
    const vidData = {video: props.vid_name, vid_start: start_time, vid_end: end_time, trial_end: Date.now(), trial_data: trialData}
    smilestore.saveTrialData(vidData)

    if(choice === props.correct){
        smilestore.saveData()
        emit('nextVid', true,  props.attempt)
    } else {
        emit('nextVid')
    }
}




</script>

<template>
        <div v-for="option in clickOptions" class="overlay" :key="option.option_id" :id="option.option_id" @click="next_trial(option.option_id)" :style="getStyle(option)"> </div>
        <video class="kidvid" id="kidvid" autoplay @ended="showButtons()">
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
        <button class="button is-light is-large" id='finishp' @click="next_trial('')" style="visibility: hidden;"><FAIcon class="fa" id="buttontext" icon="fa-solid fa-arrow-right" /></button>

</template>

<style scoped>

.kidvid {
    width: 800px;
    height: auto
  
}

.fa {color: rgb(166, 165, 165);}

.overlay{
    position:absolute;
    background:white;
    opacity:0;
    border:1px solid black;
    z-index:99;
    left: 50%;
}
.overlay:hover {
    opacity:0.3;
}




</style>