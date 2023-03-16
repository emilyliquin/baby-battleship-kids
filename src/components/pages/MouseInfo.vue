<script setup>
import { ref, shallowRef, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useTimelineStepper from '@/composables/timelinestepper'
import useSmileStore from '@/stores/smiledata'

import InformedConsentText from '@/components/atoms/InformedConsentText.vue';
import VidAutoAdvance from '@/components/organisms/VidAutoAdvance.vue'
import VidClickArrow from '@/components/organisms/VidClickArrow.vue'
import VidClickImage from '@/components/organisms/VidClickImage.vue'
import ImageClickArrow from '@/components/organisms/ImageClickArrow.vue'

const router = useRouter()
const route = useRoute()
const smilestore = useSmileStore()

smilestore.global.page_bg_color = '#fff'
smilestore.global.page_text_color = '#000'
smilestore.global.status_bar_bg_color = '#fff'
smilestore.global.status_bar_text_color = '#000'

const { next, prev } = useTimelineStepper()

if(route.meta.progress) smilestore.data.progress = route.meta.progress

/// //////// TO DO: EDIT PAGES HERE ////////////
const pages = [{comp: VidAutoAdvance, args:{vid_name: "mouse_info"}},
    {comp: VidClickArrow, args:{vid_name: "lets_get_started"}}
]

/// /////////////////////////////////////////////

const page_indx = smilestore.getPageMouseInfo

const currentTab = shallowRef(pages[page_indx])

let start_time
onMounted(() => {
    start_time = Date.now()
})

function next_trial(goto) {
    smilestore.local.page_visited = -1
    const newpage = smilestore.incrementPage("mouseinfo_page", 1)
    if (newpage >= pages.length) {
        if (!smilestore.isKnownUser) {
        // console.log('not known')
        smilestore.setKnown() // set new user and add document
    }
    smilestore.setConsented()
      smilestore.saveTiming('mouseinfo', Date.now() - start_time)
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


<style scoped>

.pagecontent {
    padding-bottom: 100px;
    margin-bottom: 20px;
        margin: 50px;
    margin-top: 0px;
  
}
.consentbox {
    margin-bottom: 20px;
    margin-top: 30px;
}
.widetoggle {
  --toggle-width: 5.9rem;
}

.column {
    padding: 40px;
    padding-top: 0px;
}

.hname {
    visibility: hidden;
    display: none;
}

</style>