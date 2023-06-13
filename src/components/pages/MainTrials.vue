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


const pages1 = [
{comp: VidAutoAdvance, args:{vid_name: "trial_mixing"}},
{comp: VidClickArrow, args:{vid_name: "mt1_1", reminderText: "Say <b>your one question</b>, then click the arrow.", hint:["r_sq_1", "b_sq_0", "p_cir_0"]}},
{comp: VidClickArrow, args:{vid_name: "mt1_2"}},
]
const pages2 = [
{comp: VidAutoAdvance, args:{vid_name: "trial_mixing"}},
{comp: VidClickArrow, args:{vid_name: "mt2_1", reminderText: "Say <b>your one question</b>, then click the arrow.", hint:["b_sq_3", "r_cir_0", "p_0_0"]}},
{comp: VidClickArrow, args:{vid_name: "mt2_2"}},
]
const pages3 = [
{comp: VidAutoAdvance, args:{vid_name: "trial_mixing"}},
{comp: VidClickArrow, args:{vid_name: "mt3_1", reminderText: "Say <b>your one question</b>, then click the arrow.", hint:["p_sq_2", "r_0_3", "b_0_2"]}},
{comp: VidClickArrow, args:{vid_name: "mt3_2"}},
]
const pages4 = [
{comp: VidAutoAdvance, args:{vid_name: "trial_mixing"}},
{comp: VidClickArrow, args:{vid_name: "mt4_1", reminderText: "Say <b>your one question</b>, then click the arrow.", hint:["r_0_3", "p_sq_0", "b_0_0"]}},
{comp: VidClickArrow, args:{vid_name: "mt4_2"}},
]
const pages5 = [
{comp: VidAutoAdvance, args:{vid_name: "trial_mixing"}},
{comp: VidClickArrow, args:{vid_name: "mt5_1", reminderText: "Say <b>your one question</b>, then click the arrow.", hint:["p_sq_0", "r_sq_0", "b_cir_0"]}},
{comp: VidClickArrow, args:{vid_name: "mt5_2"}},
]
const pages6 = [
{comp: VidAutoAdvance, args:{vid_name: "trial_mixing"}},
{comp: VidClickArrow, args:{vid_name: "mt6_1", reminderText: "Say <b>your one question</b>, then click the arrow.", hint:["r_cir_0", "p_cir_0", "b_0_0"]}},
{comp: VidClickArrow, args:{vid_name: "mt6_2"}},
]
const pages7 = [
{comp: VidAutoAdvance, args:{vid_name: "trial_mixing"}},
{comp: VidClickArrow, args:{vid_name: "mt7_1", reminderText: "Say <b>your one question</b>, then click the arrow.", hint:["r_sq_0", "p_0_2", "b_0_2"]}},
{comp: VidClickArrow, args:{vid_name: "mt7_2"}},
]
const pages8 = [
{comp: VidAutoAdvance, args:{vid_name: "trial_mixing"}},
{comp: VidClickArrow, args:{vid_name: "mt8_1", reminderText: "Say <b>your one question</b>, then click the arrow.", hint:["p_cir_0", "b_0_0", "r_0_0"]}},
{comp: VidClickArrow, args:{vid_name: "mt8_2"}},
]
const pages9 = [
{comp: VidAutoAdvance, args:{vid_name: "trial_mixing"}},
{comp: VidClickArrow, args:{vid_name: "mt9_1", reminderText: "Say <b>your one question</b>, then click the arrow.", hint:["b_0_1", "r_0_2", "p_0_2"]}},
{comp: VidClickArrow, args:{vid_name: "mt9_2"}},
]
const pages10 = [
{comp: VidAutoAdvance, args:{vid_name: "trial_mixing"}},
{comp: VidClickArrow, args:{vid_name: "mt10_1", reminderText: "Say <b>your one question</b>, then click the arrow.", hint:["r_0_1", "p_0_3", "b_0_0"]}},
{comp: VidClickArrow, args:{vid_name: "mt10_2"}},
]
const pages11 = [
{comp: VidAutoAdvance, args:{vid_name: "trial_mixing"}},
{comp: VidClickArrow, args:{vid_name: "mt11_1", reminderText: "Say <b>your one question</b>, then click the arrow.", hint:["p_0_1", "b_0_0", "r_0_0"]}},
{comp: VidClickArrow, args:{vid_name: "mt11_2"}},
]
const pages12 = [
{comp: VidAutoAdvance, args:{vid_name: "trial_mixing"}},
{comp: VidClickArrow, args:{vid_name: "mt12_1", reminderText: "Say <b>your one question</b>, then click the arrow.", hint:["b_sq_3", "r_sq_3", "p_sq_0"]}},
{comp: VidClickArrow, args:{vid_name: "mt12_2"}},
]
const pages13 = [
{comp: VidAutoAdvance, args:{vid_name: "trial_mixing"}},
{comp: VidClickArrow, args:{vid_name: "mt13_1", reminderText: "Say <b>your one question</b>, then click the arrow.", hint:["p_cir_1", "b_sq_2", "r_0_3"]}},
{comp: VidClickArrow, args:{vid_name: "mt13_2"}},
]
const pages14 = [
{comp: VidAutoAdvance, args:{vid_name: "trial_mixing"}},
{comp: VidClickArrow, args:{vid_name: "mt14_1", reminderText: "Say <b>your one question</b>, then click the arrow.", hint:["p_sq_2", "b_cir_1", "r_0_0"]}},
{comp: VidClickArrow, args:{vid_name: "mt14_2"}},
]
const pagesNested = [pages1, pages2, pages3, pages4, pages5, pages6, pages7, pages8, pages9, pages10, pages11, pages12, pages13, pages14]
const pagesShuffled = random.shuffle(pagesNested)

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
