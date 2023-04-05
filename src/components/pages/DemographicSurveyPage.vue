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
    age: '',
    gender: '',
    race: '',
    // hispanic: '',
    fluent_english: '',
    normal_vision: '',
    color_blind: '',
    education_level: '',
    household_income: '',
})


const page = ref(1)

const page_one_complete = computed(() => forminfo.gender!==''&&forminfo.race!==''&&forminfo.fluent_english!=='')

const page_two_complete = computed(() => forminfo.normal_vision!==''&&forminfo.color_blind!=='')

const page_three_complete = computed(() => forminfo.education_level!==''&&forminfo.household_income!=='')


function autofill () {
    forminfo.age = '1'
    forminfo.gender = 'Male'
    forminfo.race = ['White']
    // forminfo.hispanic = 'No'
    forminfo.fluent_english = 'Yes'
    forminfo.normal_vision = 'Yes'
    forminfo.color_blind = 'No'
    // forminfo.country = 'United States'
    forminfo.education_level = 'Doctorate Degree (PhD/Other)'
    forminfo.household_income = '$100,000-$199,999'
}

if(smilestore.config.mode==='development') smilestore.setPageAutofill(autofill)

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
            <h3 class="is-size-4 has-text-weight-bold">Demographic Information</h3>
            <p class="is-size-6">
                You're almost done with the study! The following questions will help us understand the extent to which the participants of this study are representative of the US population. Your privacy will be maintained. For all questions, you have the option of indicating 'Prefer not to specify.'
            </p>
            
            <div class="formstep" v-if='page==1'>

                        <div class="box is-shadowless formbox">
                            <!-- maybe numbers can be used instead?-->
                            <FormKit type="number" 
                                     label="Age (in years)"
                                     placeholder="Enter your age"
                                     v-model="forminfo.age"
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
                                     v-model="forminfo.gender" />
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
                            <button class="button is-warning" id='finish' v-if='page_one_complete' @click="page++">continue &nbsp;<FAIcon icon="fa-solid fa-arrow-right" /></button>
                            </div> 
                        </div>
            </div>


            <div class="formstep" v-if='page==2'>
                        <div class="box is-shadowless formbox">
                            <FormKit type="select"
                                     name="vision"
                                     label="Do you have normal vision (or corrected to be normal)?"
                                     placeholder="Select an option"
                                     validation="required"
                                     v-model="forminfo.normal_vision"
                                     :options="['Yes', 'No', 'Prefer not to specify']"/>
                            <FormKit type="select"
                                     name="colorblind"
                                     label="Are you color blind?"
                                     placeholder="Select an option"
                                     validation="required"
                                     v-model="forminfo.color_blind"
                                     :options="['Yes', 'No', 'Prefer not to specify']"/>
                            <hr> 
                            <div class="field is-grouped">
                            <div class="column">
                                    <div class="has-text-left">
                                    <button class="button is-warning" id='finish' @click="page--"><FAIcon icon="fa-solid fa-arrow-left" />&nbsp; Previous</button>
                                    </div> 
                                </div>
                                <div class="column">
                                    <div class="has-text-right">
                                    <button class="button is-warning" id='finish' v-if='page_two_complete' @click="page++">Continue &nbsp;<FAIcon icon="fa-solid fa-arrow-right" /></button>
                                    </div> 
                                </div>
                            </div>
                            
                    </div>
                </div>


            <div class="formstep" v-if='page==3'>
                        <div class="box is-shadowless formbox">
                            <!-- make these not required (require but include "prefer not to specify") -->
                            <FormKit type="select"
                                     name="education"
                                     label="What is the highest level of education/schooling that you completed?"
                                     placeholder="Select an option"
                                     v-model="forminfo.education_level"
                                     validation="required"
                                     :options="['No Formal Qualifications', 'Secondary Education (ie. GED/GCSE)', 'High School Diploma (A-levels)', 'Technical/Community College', 'Undergraduate Degree (BA/BS/Other)', 'Graduate Degree (MA/MS/MPhil/Other)', 'Doctorate Degree (PhD/Other)', 'Don’t Know/Not Applicable', 'Prefer not to specify']"
                                     />
                            <FormKit type="select"
                                     name="income"
                                     label="What is your approximate household income?"
                                     placeholder="Select an option"
                                     v-model="forminfo.household_income"
                                     validation="required"
                                     :options="['Less than $20,000', '$20,000–$39,999', '$40,000–$59,999', '$60,000–$79,999', '$80,000–$99,999', '$100,000–$199,999', '$200,000–$299,999', '$300,000–$399,999', '$400,000–$499,999', '$500,000+', 'I don’t know', 'Prefer not to specify']"
                                     />
                            <hr> 
                            <div class="field is-grouped">

                            <div class="column">
                                    <div class="has-text-left">
                                    <button class="button is-warning" id='finish' @click="page--"><FAIcon icon="fa-solid fa-arrow-left" />&nbsp; Previous</button>
                                    </div> 
                                </div>
                                <div class="column">
                                    <div class="has-text-right">
                                    <button class="button is-success" id='finish' v-if='page_three_complete' @click="finish(next())">That was easy!</button>
                                    </div> 
                                </div>
                                </div>
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