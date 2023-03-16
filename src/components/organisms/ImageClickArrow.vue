<script setup>
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useTimelineStepper from '@/composables/timelinestepper'
import useSmileStore from '@/stores/smiledata' // get access to the global store
import * as random from '@/randomization'
import { v4 as uuidv4 } from 'uuid';
import appconfig from '@/config'
import seedrandom from 'seedrandom'
import { VueSignaturePad } from 'vue-signature-pad';


const router = useRouter()
const route = useRoute()
const smilestore = useSmileStore()

const { next, prev } = useTimelineStepper()

if(route.meta.progress) smilestore.data.progress = route.meta.progress

const props = defineProps(["img_name"])

const emit = defineEmits(["nextVid"])



let start_time = 0

onMounted(() => {
    start_time = Date.now()

  })


/// / SIGNATURE PAD STUFF

const signaturePad = ref(null)
function clear() {
    signaturePad.value.clearSignature();
}

 /// next trial (check for signature)
function next_trial() { 
    if(props.img_name === 'consent8.jpeg' && signaturePad.value.isEmpty()){
        alert("If you consent to participate, please sign in the box.")
    } else{
            smilestore.local.page_visited = -1

            const vidData = {image: props.img_name, trial_start: start_time, trial_end: Date.now()}
            smilestore.saveTrialData(vidData)
            emit('nextVid')
        }
}

</script>

<template>
        <img class="kidimg" id="kidimg" :src="'./' + img_name">

        <div class="wrapper" v-if="img_name == 'consent8.jpeg'">
            <img class="imgsign" :src="'./signbox.jpeg'" width=400 height=150 />
            <VueSignaturePad  class="sigpad" width="400px" height="150px" ref="signaturePad" />
        </div>            
        <button v-if="img_name == 'consent8.jpeg'" class="button is-warning is-small" @click="clear" >Clear Signature</button>


        <hr>
        <button class="button is-success is-large" id='finishp' @click="next_trial()"><FAIcon id="buttontext" icon="fa-solid fa-arrow-right" /></button>
 </template>

<style scoped>
.kidimg {
    width: 800px;
    height: auto;
}

.fa {color: rgb(166, 165, 165);}


.modaltext {
    background-color: #fff;
    padding: 30px;
}

.modal-content {
    width: 80%;
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