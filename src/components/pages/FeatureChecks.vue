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


const fullClickOptions3 = [{option_id: "l", height: "200", width: "200", margin_top: "125", margin_left: "-380"},
{option_id: "m", height: "200", width: "200", margin_top: "125", margin_left: "-100"},
{option_id: "r", height: "200", width: "200", margin_top: "125", margin_left: "180"}]

const clickOptionsL3 = [{option_id: "l", height: "200", width: "200", margin_top: "125", margin_left: "-380"}]
const clickOptionsM3 = [{option_id: "m", height: "200", width: "200", margin_top: "125", margin_left: "-100"}]
const clickOptionsR3 = [{option_id: "r", height: "200", width: "200", margin_top: "125", margin_left: "180"}]


const fullClickOptions2 = [{option_id: "l", height: "200", width: "200", margin_top: "125", margin_left: "-275"},
{option_id: "r", height: "200", width: "200", margin_top: "125", margin_left: "75"}]

const clickOptionsL2 = [{option_id: "l", height: "200", width: "200", margin_top: "125", margin_left: "-275"}]
const clickOptionsR2 = [{option_id: "r", height: "200", width: "200", margin_top: "125", margin_left: "75"}]


let pages = [{comp: VidAutoAdvance, args:{vid_name: "introbuttons"}},
    {comp: VidClickArrow, args:{vid_name: "audio_prac_1", reminderText: "Say <b>how old you are</b>, then click the arrow."}}, 
{comp: VidClickArrow, args:{vid_name: "audio_prac_2", reminderText: "Say <b>what your favorite color is</b>, then click the arrow."}},
{comp: VidAutoAdvance, args:{vid_name: "cc_intro"}}]


const colorTrialsShuffle = random.shuffle([[{comp: VidClickImage, args:{vid_name: "cc_colors_1_attempt1", attempt: 1, correct: "m", clickOptions: fullClickOptions3}},
{comp: VidClickImage, args:{vid_name: "cc_colors_1_attempt2", attempt: 2, correct: "m", clickOptions: fullClickOptions3 }},
{comp: VidClickImage, args:{vid_name: "cc_colors_1_attempt3", attempt: 3, correct: "m" , clickOptions: clickOptionsM3}}], 
[{comp: VidClickImage, args:{vid_name: "cc_colors_2_attempt1", attempt: 1, correct: "l", clickOptions: fullClickOptions3}},
{comp: VidClickImage, args:{vid_name: "cc_colors_2_attempt2", attempt: 2, correct: "l", clickOptions: fullClickOptions3}},
{comp: VidClickImage, args:{vid_name: "cc_colors_2_attempt3", attempt: 3, correct: "l", clickOptions: clickOptionsL3}}],
[{comp: VidClickImage, args:{vid_name: "cc_colors_3_attempt1", attempt: 1, correct: "r", clickOptions: fullClickOptions3}},
{comp: VidClickImage, args:{vid_name: "cc_colors_3_attempt2", attempt: 2, correct: "r", clickOptions: fullClickOptions3}},
{comp: VidClickImage, args:{vid_name: "cc_colors_3_attempt3", attempt: 3, correct: "r", clickOptions: clickOptionsR3}}]])

const legTrialsShuffle = random.shuffle([[{comp: VidClickImage, args:{vid_name: "cc_legs_1_attempt1", attempt: 1, correct: "r", clickOptions: fullClickOptions3}},
{comp: VidClickImage, args:{vid_name: "cc_legs_1_attempt2", attempt: 2, correct: "r", clickOptions: fullClickOptions3 }},
{comp: VidClickImage, args:{vid_name: "cc_legs_1_attempt3", attempt: 3, correct: "r" , clickOptions: clickOptionsR3}}], 
[{comp: VidClickImage, args:{vid_name: "cc_legs_2_attempt1", attempt: 1, correct: "m", clickOptions: fullClickOptions3}},
{comp: VidClickImage, args:{vid_name: "cc_legs_2_attempt2", attempt: 2, correct: "m", clickOptions: fullClickOptions3}},
{comp: VidClickImage, args:{vid_name: "cc_legs_2_attempt3", attempt: 3, correct: "m", clickOptions: clickOptionsM3}}],
[{comp: VidClickImage, args:{vid_name: "cc_legs_3_attempt1", attempt: 1, correct: "l", clickOptions: fullClickOptions3}},
{comp: VidClickImage, args:{vid_name: "cc_legs_3_attempt2", attempt: 2, correct: "l", clickOptions: fullClickOptions3}},
{comp: VidClickImage, args:{vid_name: "cc_legs_3_attempt3", attempt: 3, correct: "l", clickOptions: clickOptionsL3}}]])

// TO DO: change to two options
const headTrialsShuffle = random.shuffle([[{comp: VidClickImage, args:{vid_name: "cc_head_1_attempt1", attempt: 1, correct: "l", clickOptions: fullClickOptions2}},
{comp: VidClickImage, args:{vid_name: "cc_head_1_attempt2", attempt: 2, correct: "l", clickOptions: fullClickOptions2 }},
{comp: VidClickImage, args:{vid_name: "cc_head_1_attempt3", attempt: 3, correct: "l" , clickOptions: clickOptionsL2}}], 
[{comp: VidClickImage, args:{vid_name: "cc_head_2_attempt1", attempt: 1, correct: "r", clickOptions: fullClickOptions2}},
{comp: VidClickImage, args:{vid_name: "cc_head_2_attempt2", attempt: 2, correct: "r", clickOptions: fullClickOptions2}},
{comp: VidClickImage, args:{vid_name: "cc_head_2_attempt3", attempt: 3, correct: "r", clickOptions: clickOptionsR2}}]])

const allTrials = random.shuffle([colorTrialsShuffle, legTrialsShuffle, headTrialsShuffle])

pages.push(allTrials)
pages = pages.flat(3)

const page_indx = smilestore.getPageCC

const currentTab = shallowRef(pages[page_indx])

let start_time
onMounted(() => {
    start_time = Date.now()
})

function next_trial(success, attempt_num) {
    smilestore.local.page_visited = -1
    let newpage = page_indx
    if(success){
        newpage = smilestore.incrementPage("cc_page", 3-attempt_num)
    } else {
        newpage = smilestore.incrementPage("cc_page", 1)
    }
    if (newpage >= pages.length) {
      smilestore.saveTiming('cc', Date.now() - start_time)
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
