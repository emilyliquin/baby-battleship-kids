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
import VidTextbox from '@/components/organisms/VidTextbox.vue'


const router = useRouter()
const route = useRoute()
const smilestore = useSmileStore()

const { next, prev } = useTimelineStepper()

if(route.meta.progress) smilestore.data.progress = route.meta.progress


const pagesLegs1 = [
    {comp: VidAutoAdvance, args:{vid_name: "exposure_study/test_hiding"}},
    {comp: VidAutoAdvance, args:{vid_name: "exposure_study/test13_hint"}},
    {comp: VidTextbox, args:{vid_name: "exposure_study/test13_question_adult", reminderText: "Type <b>your one question</b> in the box below, then click the arrow.", hint:["p_cir_0", "b_0_0", "r_0_0"], hideArrow:true}},
    {comp: VidClickArrow, args:{vid_name: "exposure_study/test13_reveal"}}
]
const pagesLegs2 = [
    {comp: VidAutoAdvance, args:{vid_name: "exposure_study/test_hiding"}},
    {comp: VidAutoAdvance, args:{vid_name: "exposure_study/test7_hint"}},
    {comp: VidTextbox, args:{vid_name: "exposure_study/test7_question_adult", reminderText: "Type <b>your one question</b> in the box below, then click the arrow.", hint:["r_0_1", "p_0_3", "b_0_0"], hideArrow:true}},
    {comp: VidClickArrow, args:{vid_name: "exposure_study/test7_reveal"}}
]
const pagesLegs3 = [
    {comp: VidAutoAdvance, args:{vid_name: "exposure_study/test_hiding"}},
    {comp: VidAutoAdvance, args:{vid_name: "exposure_study/test2_hint"}},
    {comp: VidTextbox, args:{vid_name: "exposure_study/test2_question_adult", reminderText: "Type <b>your one question</b> in the box below, then click the arrow.", hint:["p_sq_2", "r_0_3", "b_0_2"], hideArrow:true}},
    {comp: VidClickArrow, args:{vid_name: "exposure_study/test2_reveal"}}
]
const pagesLegs4 = [
    {comp: VidAutoAdvance, args:{vid_name: "exposure_study/test_hiding"}},
    {comp: VidAutoAdvance, args:{vid_name: "exposure_study/test8_hint"}},
    {comp: VidTextbox, args:{vid_name: "exposure_study/test8_question_adult", reminderText: "Type <b>your one question</b> in the box below, then click the arrow.", hint:["b_sq_3", "r_sq_3", "p_sq_0"], hideArrow:true}},
    {comp: VidClickArrow, args:{vid_name: "exposure_study/test8_reveal"}}
]

// heads go here

const pagesHeads1 = [
    {comp: VidAutoAdvance, args:{vid_name: "exposure_study/test_hiding"}},
    {comp: VidAutoAdvance, args:{vid_name: "exposure_study/test4_hint"}},
    {comp: VidTextbox, args:{vid_name: "exposure_study/test4_question_adult", reminderText: "Type <b>your one question</b> in the box below, then click the arrow.", hint:["p_0_1", "b_0_0", "r_0_0"], hideArrow:true}},
    {comp: VidClickArrow, args:{vid_name: "exposure_study/test4_reveal"}}
]
const pagesHeads2 = [
    {comp: VidAutoAdvance, args:{vid_name: "exposure_study/test_hiding"}},
    {comp: VidAutoAdvance, args:{vid_name: "exposure_study/test6_hint"}},
    {comp: VidTextbox, args:{vid_name: "exposure_study/test6_question_adult", reminderText: "Type <b>your one question</b> in the box below, then click the arrow.", hint:["r_cir_0", "p_cir_0", "b_0_0"], hideArrow:true}},
    {comp: VidClickArrow, args:{vid_name: "exposure_study/test6_reveal"}}
]
const pagesHeads3 = [
    {comp: VidAutoAdvance, args:{vid_name: "exposure_study/test_hiding"}},
    {comp: VidAutoAdvance, args:{vid_name: "exposure_study/test1_hint"}},
    {comp: VidTextbox, args:{vid_name: "exposure_study/test1_question_adult", reminderText: "Type <b>your one question</b> in the box below, then click the arrow.", hint:["r_sq_1", "b_sq_0", "p_cir_0"], hideArrow:true}},
    {comp: VidClickArrow, args:{vid_name: "exposure_study/test1_reveal"}}
]
const pagesHeads4 = [
    {comp: VidAutoAdvance, args:{vid_name: "exposure_study/test_hiding"}},
    {comp: VidAutoAdvance, args:{vid_name: "exposure_study/test10_hint"}},
    {comp: VidTextbox, args:{vid_name: "exposure_study/test10_question_adult", reminderText: "Type <b>your one question</b> in the box below, then click the arrow.", hint:["p_cir_1", "b_sq_2", "r_0_3"], hideArrow:true}},
    {comp: VidClickArrow, args:{vid_name: "exposure_study/test10_reveal"}}
]


// if smilestore.data.conditions.condNum is either 3, 4, 7, 8, 11, or 12, then questionCondition is "legs"
const legConds = ["3", "4", "7", "8", "11", "12"]
let questionCondition
if(legConds.includes(smilestore.data.conditions.condNum)){
    questionCondition = "legs"
} else {
    questionCondition = "heads"
}

// if smilestore.data.conditions.condNum is either 1, 2, 3, 4, 9, or 11 then qualityCondition is "good"
const goodConds = ["1", "2", "3", "4", "9", "11"]
let qualityCondition
if(goodConds.includes(smilestore.data.conditions.condNum)){
    qualityCondition = "good"
} else {
    qualityCondition = "bad"
}


let pagesShuffled
if(questionCondition === "legs"){
    const pagesNested = [pagesLegs1, pagesLegs2, pagesLegs3, pagesLegs4]
    pagesShuffled = random.shuffle(pagesNested)
} else {
    const pagesNested = [pagesHeads1, pagesHeads2, pagesHeads3, pagesHeads4]
    pagesShuffled = random.shuffle(pagesNested)
}


// just add the four trials
// if you want just 4 trials randomized (With animal videos in between), uncomment 100-117
const pages = []
pages.push(...pagesShuffled[0])
pages.push({comp: VidAutoAdvance, args:{vid_name: "vid1"}})
pages.push({comp: VidClickArrow, args:{vid_name: "post_animal"}})

pages.push(...pagesShuffled[1])
pages.push({comp: VidAutoAdvance, args:{vid_name: "vid2"}})
pages.push({comp: VidClickArrow, args:{vid_name: "post_animal"}})

pages.push(...pagesShuffled[2])
pages.push({comp: VidAutoAdvance, args:{vid_name: "vid3"}})
pages.push({comp: VidClickArrow, args:{vid_name: "post_animal"}})

pages.push(...pagesShuffled[3])
pages.push({comp: VidAutoAdvance, args:{vid_name: "vid4"}})

// If you want to see all 14 trials, uncomment the next line
// const pages = pagesShuffled.flat(2)

const page_indx = smilestore.getPageMain

const currentTab = shallowRef(pages[page_indx])

let start_time
onMounted(() => {
    start_time = Date.now()
})

function next_trial(goto) {
    if(currentTab.value.args.reminderText){
        smilestore.incrementQuestions()
    }
    smilestore.local.page_visited = -1
    const newpage = smilestore.incrementPage("main_page", 1)
    if (newpage >= pages.length) {
      smilestore.saveTiming('main', Date.now() - start_time)
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
