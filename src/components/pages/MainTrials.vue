<script setup>
import { ref, reactive, shallowRef } from 'vue'
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


const pages = [ 
{comp: VidAutoAdvance, args:{id: 1, vid_name: "trial_mixing"}},
{comp: VidClickArrow, args:{id: 2, vid_name: "mt1_1"}},
{comp: VidAutoAdvance, args:{id: 3, vid_name: "mt1_2"}},
{comp: VidAutoAdvance, args:{id: 4, vid_name: "trial_mixing"}},
{comp: VidClickArrow, args:{id: 5, vid_name: "mt2_1"}},
{comp: VidAutoAdvance, args:{id: 6, vid_name: "mt2_2"}},
{comp: VidAutoAdvance, args:{id: 7, vid_name: "trial_mixing"}},
{comp: VidClickArrow, args:{id: 8, vid_name: "mt3_1"}},
{comp: VidAutoAdvance, args:{id: 9, vid_name: "mt3_2"}},
{comp: VidClickArrow, args:{id: 10, vid_name: "interim_6"}},
{comp: VidAutoAdvance, args:{id: 11, vid_name: "trial_mixing"}},
{comp: VidClickArrow, args:{id: 12, vid_name: "mt4_1"}},
{comp: VidAutoAdvance, args:{id: 13, vid_name: "mt4_2"}},
{comp: VidAutoAdvance, args:{id: 14, vid_name: "trial_mixing"}},
{comp: VidClickArrow, args:{id: 15, vid_name: "mt5_1"}},
{comp: VidAutoAdvance, args:{id: 16, vid_name: "mt5_2"}},
{comp: VidAutoAdvance, args:{id: 17, vid_name: "trial_mixing"}},
{comp: VidClickArrow, args:{id: 18, vid_name: "mt6_1"}},
{comp: VidAutoAdvance, args:{id: 19, vid_name: "mt6_2"}},
]

let page_indx = 0

const currentTab = shallowRef(pages[page_indx])


function next_trial(goto) {
    page_indx += 1
    if (page_indx >= pages.length) {
      smilestore.saveTiming('main', Date.now() - start_time)
        if(goto) router.push(goto)
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
        
        <component :is="currentTab.comp" v-bind="{...currentTab.args}" :key="currentTab.args.id" @next-vid="next_trial(next())"></component>
     </div>
</template>
