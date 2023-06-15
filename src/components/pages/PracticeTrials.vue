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

if(route.meta.progress) smilestore.data.progress = route.meta.progress


// edit numbers to make boxes in the right place
const legsClickOptions = [{option_id: "3", height: "120", width: "60", margin_top: "280", margin_left: "-360"},
{option_id: "4", height: "120", width: "60", margin_top: "280", margin_left: "-232"},
{option_id: "5", height: "120", width: "60", margin_top: "280", margin_left: "-107"},
{option_id: "6", height: "120", width: "60", margin_top: "280", margin_left: "20"},]

const headsClickOptions = [{option_id: "0", height: "130", width: "60", margin_top: "280", margin_left: "-360"},
{option_id: "1", height: "130", width: "60", margin_top: "280", margin_left: "-232"},
{option_id: "2", height: "130", width: "90", margin_top: "280", margin_left: "-121"},
{option_id: "3", height: "130", width: "90", margin_top: "280", margin_left: "5"},]


const questionCondition = smilestore.data.conditions.questionCond
const qualityCondition = smilestore.data.conditions.qualityCond

const pages = []


pages.push({comp: VidAutoAdvance, args:{vid_name: "exposure_study/game_intro"}})

// hint (depends on heads/legs/good/bad)
if(questionCondition === "legs" && qualityCondition === "good"){
    pages.push({comp: VidAutoAdvance, args:{vid_name: "exposure_study/hint_legs_good"}})
} else if(questionCondition === "legs" && qualityCondition === "bad"){
    pages.push({comp: VidAutoAdvance, args:{vid_name: "exposure_study/hint_legs_bad"}})
} // ADD CONDITIONS FOR HEADS GOOD/BAD

if(questionCondition === "heads" && qualityCondition === "good"){
    pages.push({comp: VidAutoAdvance, args:{vid_name: "exposure_study/hint_heads_good"}})
} else if(questionCondition === "heads" && qualityCondition === "bad"){
    pages.push({comp: VidAutoAdvance, args:{vid_name: "exposure_study/hint_heads_bad"}})
}


// question rules
pages.push({comp: VidAutoAdvance, args:{vid_name: "question_rules"}})

// example questions
const questionOrder = random.shuffle([1, 2, 3, 4])
const q1 = questionOrder[0]
const q2 = questionOrder[1]
const q3 = questionOrder[2]
const q4 = questionOrder[3]

pages.push({comp: VidAutoAdvance, args:{vid_name: `exq${q1}_first`}})
pages.push({comp: VidAutoAdvance, args:{vid_name: `exq${q2}`}})
pages.push({comp: VidAutoAdvance, args:{vid_name: `exq${q3}`}})
pages.push({comp: VidAutoAdvance, args:{vid_name: `exq${q4}`}})

pages.push({comp: VidAutoAdvance, args:{vid_name: "exposure_study/question_example_summary"}})


// ADD EXPOSURE TRIALS HERE
if(questionCondition === "legs" && qualityCondition === "good"){
    pages.push({comp: VidClickImage, args:{vid_name: "exposure_study/practice_legs_good_qa", correct: "3", attempt: 1, clickOptions: legsClickOptions }})
    pages.push({comp: VidAutoAdvance, args:{vid_name: "exposure_study/practice_legs_good_answerincorrect", skip: true }})
    pages.push({comp: VidAutoAdvance, args:{vid_name: "exposure_study/practice_legs_good_answercorrect" }})
    pages.push({comp: VidAutoAdvance, args:{vid_name: "exposure_study/practice_legs_good_guess" }})
}
// do this for all the conditions
if(questionCondition === "legs" && qualityCondition === "bad"){
    pages.push({comp: VidClickImage, args:{vid_name: "exposure_study/practice_legs_bad_qa", correct: "6", attempt: 1, clickOptions: legsClickOptions }})
    pages.push({comp: VidAutoAdvance, args:{vid_name: "exposure_study/practice_legs_bad_answerincorrect", skip: true }})
    pages.push({comp: VidAutoAdvance, args:{vid_name: "exposure_study/practice_legs_bad_answercorrect" }})
    pages.push({comp: VidAutoAdvance, args:{vid_name: "exposure_study/practice_legs_bad_guess" }})
}
if(questionCondition === "heads" && qualityCondition === "good"){
    pages.push({comp: VidClickImage, args:{vid_name: "exposure_study/practice_heads_good_qa", correct: "3", attempt: 1, clickOptions: headsClickOptions }})
    pages.push({comp: VidAutoAdvance, args:{vid_name: "exposure_study/practice_heads_good_answerincorrect", skip: true }})
    pages.push({comp: VidAutoAdvance, args:{vid_name: "exposure_study/practice_heads_good_answercorrect" }})
    pages.push({comp: VidAutoAdvance, args:{vid_name: "exposure_study/practice_heads_good_guess" }})
}
if(questionCondition === "heads" && qualityCondition === "bad"){
    pages.push({comp: VidClickImage, args:{vid_name: "exposure_study/practice_heads_bad_qa", correct: "2", attempt: 1, clickOptions: headsClickOptions }})
    pages.push({comp: VidAutoAdvance, args:{vid_name: "exposure_study/practice_heads_bad_answerincorrect", skip: true }})
    pages.push({comp: VidAutoAdvance, args:{vid_name: "exposure_study/practice_heads_bad_answercorrect" }})
    pages.push({comp: VidAutoAdvance, args:{vid_name: "exposure_study/practice_heads_bad_guess" }})
}


// end of practice
pages.push({comp: VidClickArrow, args:{vid_name: "exposure_study/practice_end"}})


const page_indx = smilestore.getPagePrac

const currentTab = shallowRef(pages[page_indx])

let start_time
onMounted(() => {
    start_time = Date.now()
})



function next_trial(success, attempt_num) {
    smilestore.local.page_visited = -1
    // const newpage = smilestore.incrementPage("prac_page", 1)
    let newpage = page_indx
    if(success){
        console.log("skip a page")
        newpage = smilestore.incrementPage("prac_page", 2)
    } else {
        console.log("go to next")
        newpage = smilestore.incrementPage("prac_page", 1)
    }
    if (newpage >= pages.length) {
      smilestore.saveTiming('practice', Date.now() - start_time)
        if(next()) router.push(next())
    } else {
        currentTab.value = pages[newpage]
    }
}


</script>

<template>
    <div class="page">
        
        <component :is="currentTab.comp" v-bind="{...currentTab.args}" :key="currentTab.args.vid_name" @next-vid="next_trial"></component>
     </div>
</template>
