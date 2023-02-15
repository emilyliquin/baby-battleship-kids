<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useTimelineStepper from '@/composables/timelinestepper'
import useSmileStore from '@/stores/smiledata' // get access to the global store
import * as random from '@/randomization'
import { v4 as uuidv4 } from 'uuid';
import appconfig from '@/config'
import seedrandom from 'seedrandom'


onMounted(() => {
    window.addEventListener('mousemove', update)
})

onUnmounted(() => window.removeEventListener('mousemove', update))


const router = useRouter()
const route = useRoute()
const smilestore = useSmileStore()

const { next, prev } = useTimelineStepper()

if(route.meta.progress) smilestore.global.progress = route.meta.progress

function showButtons(){
    const collection = document.getElementsByClassName("overlay");
    for (let i = 0; i < collection.length; i++) {
        collection[i].removeAttribute("hidden")
    }
}

function finish(goto, choice) { 
    // smilestore.saveData()
    // TODO: add something to save what was clicked
    if(goto) router.push(goto)
}

</script>

<template>
    <div class="page">
        <div class="overlay" id="l" @click="finish(next(), 'l')" hidden></div>
        <div class="overlay" id="m" @click="finish(next(), 'm')" hidden></div>
        <div class="overlay" id="r" @click="finish(next(), 'r')" hidden></div>
        <video class="kidvid" id="testvid" src="../../assets/cc_colors_2_attempt1.webm" autoplay controls @ended="showButtons()"></video>
        <hr>
        <button class="button is-success is-light is-large" id='finish' @click="finish(next(), '')"><FAIcon icon="fa-solid fa-arrow-right" /></button>
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
}
.overlay:hover {
    opacity:0.3;
}

#l {
    height:200px;
    width:200px;
    margin-top: 125px;
    left: 50%;
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