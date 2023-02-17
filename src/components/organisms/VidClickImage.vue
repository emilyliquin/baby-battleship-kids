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

if(route.meta.progress) smilestore.global.progress = route.meta.progress

const props = defineProps(["vid_name", "attempt", "correct", "clickOptions"])

const emit = defineEmits(["nextVid"])


function showButtons(){
    const collection = document.getElementsByClassName("overlay");
    for (let i = 0; i < collection.length; i++) {
        collection[i].removeAttribute("hidden")
    }
}

function getStyle(option){
    return { height: `${option.height  }px`, width: `${option.width  }px`, marginTop: `${option.margin_top  }px`, marginLeft: `${option.margin_left  }px`}
}

function next_trial(choice) { 
    // smilestore.saveData()
    // TODO: add something to save what was clicked
    if(choice === props.correct){
        emit('nextVid', true,  props.attempt)
    }
    emit('nextVid')
    
}




</script>

<template>
    <div class="page">
        <div v-for="option in clickOptions" class="overlay" :key="option.option_id" :id="option.option_id" @click="next_trial(option.option_id)" :style="getStyle(option)" > </div>
        <video class="kidvid" autoplay @ended="showButtons()">
            <source :src="'./' + vid_name + '.webm'" >
            <source :src="'./' + vid_name + '.mp4'" >
            <p>Sorry, we're experiencing technical difficulties! Please contact the researcher to let them know.</p>
        </video>    

        <hr>
        <button class="button is-success is-light is-large" id='finish' @click="next_trial('')"><FAIcon icon="fa-solid fa-arrow-right" /></button>
    </div>
</template>

<style scoped>

.kidvid {
    width: 800px;
    height: 450px;
  
}

.area {
    background:#fff;
    display:block;
    height:450px;
    opacity:0.5;
    position:absolute;
    width:400px;
}
#area2 {
    left:400px;
}
#area1:hover, #area2:hover {
    opacity:0.2;
}

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

#l {
    height:200px;
    width:200px;
    margin-top: 125px;
    margin-left: -380px;
}

#m {
    height:200px;
    width:200px;
    margin-top: 125px;
    left: 50%;
    margin-left: -100px;
}

#r {
    height:200px;
    width:200px;
    margin-top: 125px;
    left: 50%;
    margin-left: 180px;
}




</style>