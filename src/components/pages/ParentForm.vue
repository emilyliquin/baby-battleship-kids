<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useTimelineStepper from '@/composables/timelinestepper'
import useSmileStore from '@/stores/smiledata' // get access to the global store

const router = useRouter()
const route = useRoute()
const smilestore = useSmileStore()

const { next, prev } = useTimelineStepper()


smilestore.global.page_bg_color = '#fff'
smilestore.global.page_text_color = '#000'
smilestore.global.status_bar_bg_color = '#fff'
smilestore.global.status_bar_text_color = '#000'


if(route.meta.progress) smilestore.global.progress = route.meta.progress

const forminfo = reactive({
    video_permission: '',
    source: '',
    // add other two here
})



let start_time
onMounted(() => {
    start_time = Date.now()
})

function finish(goto) { 
    smilestore.saveTiming("demographic", Date.now()-start_time)
    smilestore.saveDemographicForm(forminfo);
    smilestore.saveData()
    if(smilestore.config.mode=='development') smilestore.removePageAutofill()
    if(goto) router.push(goto)
}
</script>


<template>
    <div class="page">
        <div class="formcontent">
            <h3 class="is-size-4 has-text-weight-bold">Parent Form</h3>


                        <div class="box is-shadowless formbox">
                            <FormKit type="radio" 
                                     label="Choose your permission"
                                     placeholder="Enter your age"
                                     v-model="forminfo.video_permission"
                                    value="0"  
                                    step="1"  
                            />     
                                     <!-- Man, Woman, Non-binary/Genderqueer, Other, Prefer not to specify (required) -->
                            <FormKit type="select"
                                     label="Gender"
                                     name="gender"
                                     placeholder="Select an option"
                                     :options="['Man', 'Woman', 'Non-binary/Genderqueer', 'Other', 'Prefer not to specify']"
                                     validation="required"
                                     v-model="forminfo.source" />
                            <FormKit type="select"
                                     label="Are you able to speak and understand English?"
                                     name="english"
                                     v-model="forminfo.fluent_english"
                                     placeholder="Select an option"
                                     validation="required"
                                     :options="['Yes', 'No', 'Prefer not to specify']"/>  
                            <FormKit type="checkbox"
                                     label="Which best describes your race/ethnicity?"
                                     name="race"
                                     v-model="forminfo.race"
                                     validation="required"
                                     help="Select one or more"
                                     :options="['Asian', 'Black/African American', 'Hispanic/Latinx', 'Middle Eastern/North African', 'Native American/Alaska Native/First Nations', 'Pacific Islander/Native Hawaiian', 'White', 'Prefer not to specify']"/>

                            <hr>              
                            <div class="has-text-right">
                            <button class="button is-warning" id='finish' @click="finish(next())">continue &nbsp;<FAIcon icon="fa-solid fa-arrow-right" /></button>
                            </div> 
                        </div>

        </div>
    </div>

</template>



<style>

.formstep {
    margin-top: 40px;
}


:root {
    --fk-bg-input: #fff;
    --fk-max-width-input: 100%;
}

.formbox {
    border: 1px solid #dfdfdf;
    text-align: left;
    background-color: rgb(248, 248, 248);
}


.formkit-input  select {
    background-color: #fff;
}


.formcontent {
    width: 80%;
    margin: auto;
    margin-bottom: 40px;
    padding-bottom: 200px;
    text-align: left;
}
.formsectionexplainer {
    text-align: left;
    color: #777;
}
</style>