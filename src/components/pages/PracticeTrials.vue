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

// edit numbers to make boxes in the right place
const legsClickOptions = [{option_id: "3", height: "50", width: "40", margin_top: "175", margin_left: "160"},
{option_id: "4", height: "50", width: "40", margin_top: "175", margin_left: "204"},
{option_id: "5", height: "50", width: "50", margin_top: "175", margin_left: "252"},
{option_id: "6", height: "50", width: "50", margin_top: "175", margin_left: "252"},]

const headsClickOptions = [{option_id: "3", height: "50", width: "40", margin_top: "175", margin_left: "160"},
{option_id: "4", height: "50", width: "40", margin_top: "175", margin_left: "204"},
{option_id: "5", height: "50", width: "50", margin_top: "175", margin_left: "252"},
{option_id: "6", height: "50", width: "50", margin_top: "175", margin_left: "252"},]


const questionCondition = "legs"
const qualityCondition = "good"

const pages = []


pages.push({comp: VidAutoAdvance, args:{vid_name: "exposure_study/game_intro"}})

// hint (depends on heads/legs/good/bad)
if(questionCondition === "legs" && qualityCondition === "good"){
    pages.push({comp: VidAutoAdvance, args:{vid_name: "exposure_study/hint_legs_good"}})
} else if(questionCondition === "legs" && qualityCondition === "bad"){
    pages.push({comp: VidAutoAdvance, args:{vid_name: "exposure_study/hint_legs_bad"}})
} // ADD CONDITIONS FOR HEADS GOOD/BAD


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

// ADD EXPOSURE TRIALS HERE
if(questionCondition === "legs" && qualityCondition === "good"){
    pages.push({comp: VidClickImage, args:{vid_name: "exposure_study/practice_legs_good_qa", correct: "3", clickOptions: legsClickOptions }})
    pages.push({comp: VidAutoAdvance, args:{vid_name: "exposure_study/practice_legs_good_answercorrect" }})
    pages.push({comp: VidAutoAdvance, args:{vid_name: "exposure_study/practice_legs_good_guess" }})
}
// do this for all the conditions




// end of practice
pages.push({comp: VidClickArrow, args:{vid_name: "practice_end"}})


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
