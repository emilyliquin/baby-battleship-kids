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


const fullClickOptions = [{option_id: "l", height: "200", width: "200", margin_top: "125", margin_left: "-380"},
{option_id: "m", height: "200", width: "200", margin_top: "125", margin_left: "-100"},
{option_id: "r", height: "200", width: "200", margin_top: "125", margin_left: "180"}]

const clickOptionsL = [{option_id: "l", height: "200", width: "200", margin_top: "125", margin_left: "-380"}]
const clickOptionsM = [{option_id: "m", height: "200", width: "200", margin_top: "125", margin_left: "-100"}]
const clickOptionsR = [{option_id: "r", height: "200", width: "200", margin_top: "125", margin_left: "180"}]

const pages = [{comp: VidClickArrow, args:{id: 1, vid_name: "audio_prac_1"}}, 
{comp: VidClickArrow, args:{id: 2, vid_name: "audio_prac_2"}},
{comp: VidClickImage, args:{id: 3, vid_name: "cc_colors_1_attempt1", attempt: 1, correct: "m", clickOptions: fullClickOptions}},
{comp: VidClickImage, args:{id: 4, vid_name: "cc_colors_1_attempt2", attempt: 2, correct: "m", clickOptions: fullClickOptions }},
{comp: VidClickImage, args:{id: 5, vid_name: "cc_colors_1_attempt3", attempt: 3, correct: "m" , clickOptions: clickOptionsM}},
{comp: VidClickImage, args:{id: 6, vid_name: "cc_colors_2_attempt1", attempt: 1, correct: "l", clickOptions: fullClickOptions}},
{comp: VidClickImage, args:{id: 7, vid_name: "cc_colors_2_attempt2", attempt: 2, correct: "l", clickOptions: fullClickOptions}},
{comp: VidClickImage, args:{id: 8, vid_name: "cc_colors_2_attempt3", attempt: 3, correct: "l", clickOptions: clickOptionsL}},
{comp: VidClickImage, args:{id: 9, vid_name: "cc_colors_3_attempt1", attempt: 1, correct: "r", clickOptions: fullClickOptions}},
{comp: VidClickImage, args:{id: 10, vid_name: "cc_colors_3_attempt2", attempt: 2, correct: "r", clickOptions: fullClickOptions}},
{comp: VidClickImage, args:{id: 11, vid_name: "cc_colors_3_attempt3", attempt: 3, correct: "r", clickOptions: clickOptionsR}},
]

let page_indx = 0

const currentTab = shallowRef(pages[page_indx])

let start_time
onMounted(() => {
    start_time = Date.now()
})

function next_trial(success, attempt_num) {
    if(success){
        page_indx += (3-attempt_num)
    } else {
        page_indx += 1
    }
    if (page_indx >= pages.length) {
      smilestore.saveTiming('practice', Date.now() - start_time)
        if(next()) router.push(next())
    } else {
        currentTab.value = pages[page_indx]
    }
}



function finish(goto) { 
    // smilestore.saveData()
    if(goto) router.push(goto)
}
</script>

<template>
    <div class="page">
        
        <component :is="currentTab.comp" v-bind="{...currentTab.args}" :key="currentTab.args.id" @next-vid="next_trial"></component>
     </div>
</template>
