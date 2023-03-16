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
import VidEnd from '@/components/organisms/VidEnd.vue'


const router = useRouter()
const route = useRoute()
const smilestore = useSmileStore()

const { next, prev } = useTimelineStepper()

if(route.meta.progress) smilestore.data.progress = route.meta.progress


onMounted(() => {
    smilestore.saveEndTime(Date.now())
    smilestore.setDone()
    smilestore.saveData(true) // force a data save
})




const pages = [{comp: VidEnd, args:{vid_name: "uploadvid", reminderText: "After you upload your video, you can close this page."}}]
/// /////////////////////////////////////////////


const page_indx = smilestore.getPageUpload

const currentTab = shallowRef(pages[page_indx])


</script>

<template>
    <div class="page">
        
        <component :is="currentTab.comp" v-bind="{...currentTab.args}" :key="currentTab.args.vid_name" @next-vid="next_trial(next())"></component>
     </div>
</template>
