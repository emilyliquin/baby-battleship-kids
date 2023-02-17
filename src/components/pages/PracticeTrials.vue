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

// #todo
const headOpts2 = [{option_id: "square", height: "50", width: "50", margin_top: "48", margin_left: "173"},
{option_id: "circle", height: "50", width: "50", margin_top: "48", margin_left: "255"}]

const headOpts3 = [{option_id: "square", height: "50", width: "50", margin_top: "48", margin_left: "173"},
{option_id: "circle", height: "50", width: "50", margin_top: "48", margin_left: "255"}]

const legOpts2 = [{option_id: "l1", height: "50", width: "40", margin_top: "175", margin_left: "-78"},
{option_id: "l2", height: "50", width: "40", margin_top: "175", margin_left: "-35"},
{option_id: "l3", height: "50", width: "50", margin_top: "175", margin_left: "15"}]

const legOpts3 = [{option_id: "l1", height: "50", width: "40", margin_top: "175", margin_left: "142"},
{option_id: "l2", height: "50", width: "40", margin_top: "175", margin_left: "185"},
{option_id: "l3", height: "50", width: "50", margin_top: "175", margin_left: "235"}]



const pages = [
{comp: VidClickImage, args:{id: 13, vid_name: "pt3_answerguess_1", clickOptions: legOpts3}},
{comp: VidAutoAdvance, args:{id: 1, vid_name: "game_intro"}}, 
{comp: VidAutoAdvance, args:{id: 2, vid_name: "first_mixing"}},
{comp: VidClickArrow, args:{id: 3, vid_name: "pt1_hintquestion"}},
{comp: VidClickImage, args:{id: 4, vid_name: "pt1_answerguess_1", clickOptions: headOpts3}},
{comp: VidClickImage, args:{id: 5, vid_name: "pt1_answerguess_2", clickOptions: legOpts2}},
{comp: VidClickArrow, args:{id: 6, vid_name: "pt1_reveal"}},
{comp: VidAutoAdvance, args:{id: 7, vid_name: "trial_mixing"}},
{comp: VidClickArrow, args:{id: 8, vid_name: "pt2_hintquestion"}},
{comp: VidClickImage, args:{id: 9, vid_name: "pt2_answerguess", clickOptions: headOpts3}},
{comp: VidClickArrow, args:{id: 10, vid_name: "pt2_reveal"}},
{comp: VidAutoAdvance, args:{id: 11, vid_name: "trial_mixing"}},
{comp: VidClickArrow, args:{id: 12, vid_name: "pt3_hintquestion"}},

{comp: VidClickImage, args:{id: 14, vid_name: "pt3_answerguess_2"}},
{comp: VidClickArrow, args:{id: 15, vid_name: "pt3_reveal"}},
{comp: VidClickArrow, args:{id: 16, vid_name: "interim_3"}}
]

let page_indx = 0

const currentTab = shallowRef(pages[page_indx])

let start_time
onMounted(() => {
    start_time = Date.now()
})

function next_trial(goto) {
    page_indx += 1
    if (page_indx >= pages.length) {
      smilestore.saveTiming('practice', Date.now() - start_time)
        if(goto) router.push(goto)
    } else {
        currentTab.value = pages[page_indx]
    }
}


</script>

<template>
    <div class="page">
        
        <component :is="currentTab.comp" v-bind="{...currentTab.args}" :key="currentTab.args.id" @next-vid="next_trial(next())"></component>
     </div>
</template>
