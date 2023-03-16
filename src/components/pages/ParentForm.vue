<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useTimelineStepper from '@/composables/timelinestepper'
import useSmileStore from '@/stores/smiledata' // get access to the global store
import { VueSignaturePad } from 'vue-signature-pad';

const router = useRouter()
const route = useRoute()
const smilestore = useSmileStore()

const { next, prev } = useTimelineStepper()


smilestore.global.page_bg_color = '#fff'
smilestore.global.page_text_color = '#000'
smilestore.global.status_bar_bg_color = '#fff'
smilestore.global.status_bar_text_color = '#000'


if(route.meta.progress) smilestore.data.progress = route.meta.progress

const forminfo = reactive({
    video_permission: '',
    source: '',
    source_other: '',
    language: '',
    language_other: '',
    comments: '',
})

/// / SIGNATURE PAD STUFF
const signaturePad = ref(null)
function clear() {
    signaturePad.value.clearSignature();
}

let start_time
onMounted(() => {
    start_time = Date.now()
})

function finish(goto) { 
    if(signaturePad.value.isEmpty()){
        alert("Please sign in the box to confirm your privacy settings.")
    } else{
        smilestore.saveTiming("parentform", Date.now()-start_time)
        smilestore.saveParentForm(forminfo);
        smilestore.saveData()
        if(smilestore.config.mode=='development') smilestore.removePageAutofill()
        if(goto) router.push(goto)
        }
}

</script>


<template>
    <div class="page">
        <div class="formcontent">
            <h3 class="is-size-4 has-text-weight-bold">Parent Questions</h3>
                        <div class="box is-shadowless formbox">
                            <FormKit type="radio" 
                                     label="Please choose your privacy settings and enter your signature."
                                     :options="{
                                        PANDA: 'I prefer for my video to remain accessible only to PANDA researchers and never shared with other researchers.',
                                        Databrary: 'I give permission to share the material from this session with authorized researchers in a secure data library called Databrary.',
                                        DatabraryExpanded: 'I give permission to share the material from this session with authorized data researchers in a secure data library called Databrary, and for authorized Databrary researchers to show selected video excerpts and images from recordings of this session for scientific presentations and informational/educational purposes, but never for commerical purposes.'
                                     }"
                                     v-model="forminfo.video_permission"
                            />
                            
                            <div class="wrapper">
                                <img class="imgsign" :src="'./signbox.jpeg'" width=400 height=150 />
                                <VueSignaturePad  class="sigpad" width="400px" height="150px" ref="signaturePad" />
                            </div>            
                            <button class="button is-warning is-small" @click="clear" style="left:50%; margin-left:-50px;" >Clear Signature</button>

                            
                            <FormKit type="checkbox"
                                     label="Please let us know how you found us."
                                     :options="['Facebook Ad','Facebook Post','Twitter','Instagram','Podcast Ad','Reddit','Other parenting message board or forum','www.kidconcepts.org','Direct email or personal contact','Childrens Museum of Manhattan','Prolific','Other']"
                                     v-model="forminfo.source"
                            >       
                            <template #label="context">
                                    {{context.option.label}} &nbsp;
                                    <input v-model="forminfo.source_other" v-if="context.option.label === 'Other'" type = "text" />
                                </template>
                            </FormKit>
                            <FormKit type="radio"
                                     label="What is the primary language you use to speak to your child at home?"
                                     :options="['English', 'Spanish', 'Mandarin', 'Other']"
                                     v-model="forminfo.language"
                            >
                                <template #label="context">
                                    {{context.option.label}} &nbsp;
                                    <input v-model="forminfo.language_other" v-if="context.option.label === 'Other'" type = "text" />
                                </template>
                            </FormKit>  
                            <FormKit type="textarea"
                                     label="If you have any questions or comments about this study, please note them here."
                                     placeholder=""
                                     rows="10"
                                     v-model="forminfo.comments"

                            />
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


.wrapper {
    position:relative;
  width: 400px;
  height: 155px;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  border:black 1px solid;
  margin-left: -200px;
    left: 50%;
}
.imgsign {
  position: absolute;
  left: 0;
  top: 0;
}

.sigpad {
  position: absolute;
  left: 0;
  top: 0;
  width:400px;
  height:150px;
}
</style>