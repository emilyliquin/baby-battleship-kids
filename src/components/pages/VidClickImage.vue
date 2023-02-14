<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useTimelineStepper from '@/composables/timelinestepper'
import useSmileStore from '@/stores/smiledata' // get access to the global store
import * as random from '@/randomization'
import { v4 as uuidv4 } from 'uuid';
import appconfig from '@/config'
import seedrandom from 'seedrandom'

const x = ref(0)
const y = ref(0)

function update(event) {
  x.value = event.pageX
  y.value = event.pageY
}

onMounted(() => {
    const element = document.getElementById('testvid')
    const rect = element.getBoundingClientRect();
    console.log(rect.top, rect.right, rect.bottom, rect.left);

    window.addEventListener('mousemove', update)
})

onUnmounted(() => window.removeEventListener('mousemove', update))


const router = useRouter()
const route = useRoute()
const smilestore = useSmileStore()

const { next, prev } = useTimelineStepper()

if(route.meta.progress) smilestore.global.progress = route.meta.progress



function finish(goto) { 
    // smilestore.saveData()
    if(goto) router.push(goto)
}
</script>
<template>
    <div class="page">
        <h1 class="title is-3">Mouse position is at: {{ x }}, {{ y }}</h1>
        <video id="testvid" src="../../assets/audio_prac_1.webm" autoplay ></video>
        <hr>
        <button class="button is-success is-light is-large" id='finish' @click="finish(next())"><FAIcon icon="fa-solid fa-arrow-right" /></button>
    </div>
</template>
