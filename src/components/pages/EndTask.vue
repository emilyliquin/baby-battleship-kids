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
import ImageClickArrow from '@/components/organisms/ImageClickArrow.vue'


const router = useRouter()
const route = useRoute()
const smilestore = useSmileStore()

const { next, prev } = useTimelineStepper()

if(route.meta.progress) smilestore.data.progress = route.meta.progress


/// ////////// TO DO: EDIT CHOICES HERE ////////////

// const choices = [{option_id: "1", height: "150", width: "150", margin_top: "285", margin_left: "-300"},
// {option_id: "2", height: "200", width: "200", margin_top: "125", margin_left: "-150"},
// {option_id: "3", height: "200", width: "200", margin_top: "125", margin_left: "50"},
// {option_id: "4", height: "200", width: "200", margin_top: "125", margin_left: "250"}]

/// ////////////////////////////////////////////////


/// ////////// TO DO: EDIT PAGES HERE ////////////

// const pages = [{comp: ImageClickArrow, args:{img_name: "threepoints.png"}},
// {comp: VidClickImage, args:{vid_name: "soundcheck", clickOptions: choices}}]

const pages = [{comp: VidClickArrow, args:{vid_name: "taskend"}}]
/// /////////////////////////////////////////////


const page_indx = smilestore.getPageEndTask

const currentTab = shallowRef(pages[page_indx])

let start_time
onMounted(() => {
    start_time = Date.now()
})

function next_trial(goto) {
    smilestore.local.page_visited = -1
    const newpage = smilestore.incrementPage("endtask_page", 1)
    if (newpage >= pages.length) {
      smilestore.saveTiming('endtask', Date.now() - start_time)
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
