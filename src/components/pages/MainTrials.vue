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


const pages1 = [
{comp: VidAutoAdvance, args:{vid_name: "trial_mixing"}},
{comp: VidClickArrow, args:{vid_name: "mt1_1", reminderText: "Say <b>your one question</b>, then click the arrow."}},
{comp: VidClickArrow, args:{vid_name: "mt1_2"}},
]
const pages2 = [
{comp: VidAutoAdvance, args:{vid_name: "trial_mixing"}},
{comp: VidClickArrow, args:{vid_name: "mt2_1", reminderText: "Say <b>your one question</b>, then click the arrow."}},
{comp: VidClickArrow, args:{vid_name: "mt2_2"}},
]
const pages3 = [
{comp: VidAutoAdvance, args:{vid_name: "trial_mixing"}},
{comp: VidClickArrow, args:{vid_name: "mt3_1", reminderText: "Say <b>your one question</b>, then click the arrow."}},
{comp: VidClickArrow, args:{vid_name: "mt3_2"}},
]
const pages4 = [
{comp: VidAutoAdvance, args:{vid_name: "trial_mixing"}},
{comp: VidClickArrow, args:{vid_name: "mt4_1", reminderText: "Say <b>your one question</b>, then click the arrow."}},
{comp: VidClickArrow, args:{vid_name: "mt4_2"}},
]
const pages5 = [
{comp: VidAutoAdvance, args:{vid_name: "trial_mixing"}},
{comp: VidClickArrow, args:{vid_name: "mt5_1", reminderText: "Say <b>your one question</b>, then click the arrow."}},
{comp: VidClickArrow, args:{vid_name: "mt5_2"}},
]
const pages6 = [
{comp: VidAutoAdvance, args:{vid_name: "trial_mixing"}},
{comp: VidClickArrow, args:{vid_name: "mt6_1", reminderText: "Say <b>your one question</b>, then click the arrow."}},
{comp: VidClickArrow, args:{vid_name: "mt6_2"}},
]

const pagesNested = [pages1, pages2, pages3, pages4, pages5, pages6]
const pagesShuffled = random.shuffle(pagesNested)

const pages = pagesShuffled.flat()
pages.splice(9, 0, {comp: VidClickArrow, args:{id: 10, vid_name: "interim_6"}});

const page_indx = smilestore.getPageMain

const currentTab = shallowRef(pages[page_indx])

let start_time
onMounted(() => {
    start_time = Date.now()
})

function next_trial(goto) {
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
