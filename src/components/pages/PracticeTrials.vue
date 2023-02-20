<script setup>
import { ref, reactive, shallowRef, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useTimelineStepper from '@/composables/timelinestepper'
import useSmileStore from '@/stores/smiledata' // get access to the global store
import * as random from '@/randomization'
import { v4 as uuidv4 } from 'uuid';
import appconfig from '@/config'
import seedrandom from 'seedrandom'

import VidAutoAdvance from '@/components/organisms/VidAutoAdvance.vue'
import VidClickArrow from '@/components/organisms/VidClickArrow.vue'
import VidClickImage from '@/components/organisms/VidClickImage.vue'


const router = useRouter()
const route = useRoute()
const smilestore = useSmileStore()

const { next, prev } = useTimelineStepper()

if(route.meta.progress) smilestore.global.progress = route.meta.progress


const headOpts2 = [{option_id: "square", height: "50", width: "50", margin_top: "45", margin_left: "-64"},
{option_id: "circle", height: "50", width: "50", margin_top: "45", margin_left: "17"}]

const headOpts3 = [{option_id: "square", height: "50", width: "50", margin_top: "45", margin_left: "170"},
{option_id: "circle", height: "50", width: "50", margin_top: "45", margin_left: "252"}]

const legOpts2 = [{option_id: "l1", height: "50", width: "40", margin_top: "175", margin_left: "-73"},
{option_id: "l2", height: "50", width: "40", margin_top: "175", margin_left: "-30"},
{option_id: "l3", height: "50", width: "50", margin_top: "175", margin_left: "18"}]

const legOpts3 = [{option_id: "l1", height: "50", width: "40", margin_top: "175", margin_left: "160"},
{option_id: "l2", height: "50", width: "40", margin_top: "175", margin_left: "204"},
{option_id: "l3", height: "50", width: "50", margin_top: "175", margin_left: "252"}]



const pages = []


pages.push({comp: VidAutoAdvance, args:{vid_name: "game_intro"}})
pages.push({comp: VidAutoAdvance, args:{vid_name: "first_mixing"}})

const trialOrder = random.shuffle([1, 2, 3])
const trial1 = trialOrder[0]
const trial2 = trialOrder[1]
const trial3 = trialOrder[2]

const questions = ["", "What shape is the blue monster's head?", "Is the red monster's head the same shape as the blue monster's head?", "How many monsters have one leg?"]

console.log(questions[trial1])

// add trial 1
pages.push({comp: VidAutoAdvance, args:{vid_name: `pt${trial1}_hint`}})
pages.push({comp: VidClickArrow, args:{vid_name: `pt${trial1}_question_first`, reminderText: `Say <b>"${questions[trial1]}"</b>, then click the arrow.`}})
// if(trial1 === 1){
//     pages.push({comp: VidClickImage, args:{vid_name: `pt${trial1}_answerguess_1`, clickOptions: headOpts3}})
//     pages.push({comp: VidClickImage, args:{vid_name: `pt${trial1}_answerguess_2`, clickOptions: legOpts2}})
// } else if(trial1 === 2) {
//     pages.push({comp: VidClickImage, args:{vid_name: `pt${trial1}_answerguess`, clickOptions: headOpts3}})
// } else {
//     pages.push({comp: VidClickImage, args:{vid_name: `pt${trial1}_answerguess_1`, clickOptions: legOpts3}})
//     pages.push({comp: VidClickImage, args:{vid_name: `pt${trial1}_answerguess_2`, clickOptions: headOpts2}})
// }
pages.push({comp: VidAutoAdvance, args:{vid_name: `pt${trial1}_answer`}})
pages.push({comp: VidClickArrow, args:{vid_name: `pt${trial1}_reveal`}})

// add trial 2
pages.push({comp: VidAutoAdvance, args:{vid_name: "trial_mixing"}})
pages.push({comp: VidAutoAdvance, args:{vid_name: `pt${trial2}_hint`}})
pages.push({comp: VidClickArrow, args:{vid_name: `pt${trial2}_question`, reminderText: `Say <b>"${questions[trial2]}"</b>, then click the arrow.`}})
// if(trial2 === 1){
//     pages.push({comp: VidClickImage, args:{vid_name: `pt${trial2}_answerguess_1`, clickOptions: headOpts3}})
//     pages.push({comp: VidClickImage, args:{vid_name: `pt${trial2}_answerguess_2`, clickOptions: legOpts2}})
// } else if(trial2 === 2) {
//     pages.push({comp: VidClickImage, args:{vid_name: `pt${trial2}_answerguess`, clickOptions: headOpts3}})
// } else {
//     pages.push({comp: VidClickImage, args:{vid_name: `pt${trial2}_answerguess_1`, clickOptions: legOpts3}})
//     pages.push({comp: VidClickImage, args:{vid_name: `pt${trial2}_answerguess_2`, clickOptions: headOpts2}})
// }
pages.push({comp: VidAutoAdvance, args:{vid_name: `pt${trial2}_answer`}})
pages.push({comp: VidClickArrow, args:{vid_name: `pt${trial2}_reveal`}})

// add trial 3
pages.push({comp: VidAutoAdvance, args:{vid_name: "trial_mixing"}})
pages.push({comp: VidAutoAdvance, args:{vid_name: `pt${trial3}_hint`}})
pages.push({comp: VidClickArrow, args:{vid_name: `pt${trial3}_question`, reminderText: `Say <b>"${questions[trial3]}"</b>, then click the arrow.`}})
// if(trial3 === 1){
//     pages.push({comp: VidClickImage, args:{vid_name: `pt${trial3}_answerguess_1`, clickOptions: headOpts3}})
//     pages.push({comp: VidClickImage, args:{vid_name: `pt${trial3}_answerguess_2`, clickOptions: legOpts2}})
// } else if(trial3 === 2) {
//     pages.push({comp: VidClickImage, args:{vid_name: `pt${trial3}_answerguess`, clickOptions: headOpts3}})
// } else {
//     pages.push({comp: VidClickImage, args:{vid_name: `pt${trial3}_answerguess_1`, clickOptions: legOpts3}})
//     pages.push({comp: VidClickImage, args:{vid_name: `pt${trial3}_answerguess_2`, clickOptions: headOpts2}})
// }
pages.push({comp: VidAutoAdvance, args:{vid_name: `pt${trial3}_answer`}})
pages.push({comp: VidClickArrow, args:{vid_name: `pt${trial3}_reveal`}})

pages.push({comp: VidClickArrow, args:{vid_name: `interim_3`}})


const page_indx = smilestore.getPagePrac

const currentTab = shallowRef(pages[page_indx])

let start_time
onMounted(() => {
    start_time = Date.now()
})



function next_trial(goto) {
    smilestore.local.page_visited = -1
    const newpage = smilestore.incrementPage("prac_page", 1)
    if (newpage >= pages.length) {
      smilestore.saveTiming('practice', Date.now() - start_time)
        if(goto) router.push(goto)
    } else {
        currentTab.value = pages[newpage]
    }
}


</script>

<template>
    <div class="page">
        
        <component :is="currentTab.comp" v-bind="{...currentTab.args}" :key="currentTab.args.vid_name" @next-vid="next_trial(next())"></component>
     </div>
</template>
