<script setup>
import { ref, shallowRef, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useTimelineStepper from '@/composables/timelinestepper'
import useSmileStore from '@/stores/smiledata'

import VidAutoAdvance from '@/components/organisms/VidAutoAdvance.vue'
import VidClickArrow from '@/components/organisms/VidClickArrow.vue'
import VidClickImage from '@/components/organisms/VidClickImage.vue'
import ImageClickArrow from '@/components/organisms/ImageClickArrow.vue'
import AdultInfo1 from '@/components/organisms/AdultInfo1.vue'
import AdultInfo2 from '@/components/organisms/AdultInfo2.vue'


const router = useRouter()
const route = useRoute()
const smilestore = useSmileStore()

smilestore.global.page_bg_color = '#fff'
smilestore.global.page_text_color = '#000'
smilestore.global.status_bar_bg_color = '#fff'
smilestore.global.status_bar_text_color = '#000'

const { next, prev } = useTimelineStepper()

if(route.meta.progress) smilestore.data.progress = route.meta.progress


const choices = [{option_id: "1", height: "170", width: "190", margin_top: "405", margin_left: "-390"},
{option_id: "2", height: "170", width: "190", margin_top: "405", margin_left: "-200"},
{option_id: "3", height: "170", width: "190", margin_top: "405", margin_left: "-10"},
{option_id: "4", height: "170", width: "190", margin_top: "405", margin_left: "195"}]


/// //////// TO DO: EDIT PAGES HERE ////////////
const pages = [{comp: AdultInfo1, args:{vid_name: "none"}},
    {comp: AdultInfo2, args:{vid_name: "none"}},
    {comp: VidClickImage, args:{vid_name: "soundcheck_adults", clickOptions: choices, correct: "2", attempt: 1}}
]

/// /////////////////////////////////////////////

const page_indx = smilestore.getPageMouseInfo

const currentTab = shallowRef(pages[page_indx])

let start_time
onMounted(() => {
    start_time = Date.now()
})

function next_trial(success, attempt_num) {
    console.log(success, attempt_num)
    smilestore.local.page_visited = -1
    const newpage = smilestore.incrementPage("mouseinfo_page", 1)
    console.log(newpage)
    if (newpage >= pages.length) {
      smilestore.saveTiming('mouseinfo', Date.now() - start_time)
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