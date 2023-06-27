<script setup>
import { ref, reactive, shallowRef, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useTimelineStepper from '@/composables/timelinestepper'
import useSmileStore from '@/stores/smiledata' // get access to the global store
import * as random from '@/randomization'
import appconfig from '@/config'
import seedrandom from 'seedrandom'


const router = useRouter()
const route = useRoute()
const smilestore = useSmileStore()

const { next, prev } = useTimelineStepper()

if(route.meta.progress) smilestore.data.progress = route.meta.progress


const clickOptions = [{option_id: "apples", height: "140", width: "180", margin_top: "300", margin_left: "-290"},
{option_id: "bananas", height: "140", width: "180", margin_top: "300", margin_left: "108"}]

let trialImages = ['./captcha/red_apple.png', './captcha/banana.png', './captcha/green_apple.png']
trialImages = random.shuffle(trialImages)
const trialNum = ref(0)


function getStyle(option){
    return { height: `${option.height  }px`, width: `${option.width  }px`, marginTop: `${option.margin_top  }px`, marginLeft: `${option.margin_left  }px`}
}

let start_time
onMounted(() => {
    start_time = Date.now()
})

function next_trial(choice) {
    smilestore.saveCaptchaData({trial: trialNum.value, image: trialImages[trialNum.value], choice: choice})
    trialNum.value += 1
    if (trialNum.value >= trialImages.length) {
        smilestore.saveTiming('captcha', Date.now() - start_time)
        if(next()) router.push(next())
    }
}


</script>

<template>
    <div class="page">
        <div>
            <img :src="trialImages[trialNum]" style="width:50px;">
            <p class="is-size-5 has-text-center">Where does this go? Click on the image below to respond.</p>
        </div>
        <div v-for="option in clickOptions" class="overlay" :key="option.option_id" :id="option.option_id" @click="next_trial(option.option_id)" :style="getStyle(option)"> </div>
        <img class="background" id="bg" :src="'./captcha/full_background.png'">
     </div>
</template>

<style scoped>
.background {
    width: 600px;
    height: auto;
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

</style>