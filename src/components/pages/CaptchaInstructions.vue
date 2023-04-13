<script setup>
// import '@/seed'
import { useRouter, useRoute } from 'vue-router'
import useTimelineStepper from '@/composables/timelinestepper'
import useSmileStore from '@/stores/smiledata' // get access to the global store

const router = useRouter()
const route = useRoute()
const smilestore = useSmileStore()

const { next, prev } = useTimelineStepper()

smilestore.global.page_bg_color = '#fff'
smilestore.global.page_text_color = '#000'
smilestore.global.status_bar_bg_color = '#fff'
smilestore.global.status_bar_text_color = '#000'

if(route.meta.progress) smilestore.global.progress = route.meta.progress

function finish(goto) { 
    // smilestore.saveData()
    if(goto) router.push(goto)
}
</script>

<template>
    <div class="page">
        <p class="is-size-5 has-text-left">
                Before we begin the study, we'd like you to play a quick game for us,
                just to warm up your brain. 
            </p>
            <br>
            <p class="is-size-5 has-text-left">
                In the game, you will sort objects into their appropriate locations.
            </p>
        <br>
        <button class="button is-success" id='finish' @click="finish(next())">I'm ready! &nbsp;<FAIcon icon="fa-solid fa-arrow-right" /></button>
    </div>
</template>

<style scoped>
.page {
    width: 80%;
    margin: auto;
}
</style>