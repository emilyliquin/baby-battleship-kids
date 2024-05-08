<script setup>
import {ref} from 'vue'
import { useRouter } from 'vue-router'
import * as random from '@/randomization'
import useSmileStore from '@/stores/smiledata'

const smilestore = useSmileStore()

const router = useRouter()

const expCond = ref(random.sampleWithoutReplacement(['Exposure', 'No Exposure'], 1)[0])
const questionCond = ref(random.sampleWithoutReplacement(['Heads', 'Legs'], 1)[0])
const qualityCond = ref(random.sampleWithoutReplacement(['Good', 'Bad'], 1)[0])

// if smilestore.data.conditions.condNum is either 3, 4, 7, 8, 11, or 12, then questionCondition is "legs"
// if smilestore.data.conditions.condNum is either 1, 2, 3, 4, 9, or 11 then qualityCondition is "good"
// if smilestore.data.conditions.condNum is either 9, 10, 11, or 12, then exposureCondition is "baseline"

// use the above to assign conditions from expCond, questionCond, and qualityCond

function assignConds(expCond, questionCond, qualityCond){
  if(expCond == "Exposure"){
  if(questionCond == "Legs"){
    if(qualityCond == "Good"){
// exposure/legs/good
      smilestore.data.conditions.condNum = "3"
    } else {
// exposure/legs/bad
      smilestore.data.conditions.condNum = "8"
    }
  } else {
    if(qualityCond == "Good"){
// exposure/heads/good
      smilestore.data.conditions.condNum = "1"
    } else {
// exposure/heads/bad
      smilestore.data.conditions.condNum = "6"
    }
  }
} else {
  if(questionCond == "Legs"){
    if(qualityCond == "Good"){
// no exposure/legs/good
      smilestore.data.conditions.condNum = "11"
    } else {
// no exposure/legs/bad
      smilestore.data.conditions.condNum = "12"
    }
  } else {
    if(qualityCond == "Good"){
// no exposure/heads/good
      smilestore.data.conditions.condNum = "9"
    } else {
// no exposure/heads/bad
      smilestore.data.conditions.condNum = "10"
    }
  }
}
}


function startExperiment() {
    console.log('Starting experiment with conditions:', expCond.value, questionCond.value, qualityCond.value)

    // do something with the conditions
    // e.g., save them to a store, or pass them to the next page
    assignConds(expCond.value, questionCond.value, qualityCond.value)

    console.log(smilestore.data.conditions.condNum)
    // for now, just navigate to the next page
    router.push('/welcome')
}

function skipTo(section) {
    console.log('Skipping to', section)
    // do something to skip to the section
    // e.g., navigate to a specific page or section
    assignConds(expCond.value, questionCond.value, qualityCond.value)

    
    // for now, just navigate to the next page
    router.push('/' + section)
}

</script>

<template>
        <section class="hero">
        <div class="hero-body">
            <p class="title">
            <span id="bigsmile">🤠</span>
            </p>
            <p class="subtitle">
            <h1 class="title is-1">Reuse and Remixing in Question Asking Across Development</h1>

            <h2 class="title is-3">Question Exposure Manipulation, Child Version</h2>
            </p>
        </div>
        </section>
        <div class="content">
            <p class="is-size-5 has-text-left">
                Select what conditions you'd like to see:
                <br>
                <div class="is-size-6 is-underlined" >Exposure Condition:</div>
                  <input type="radio" id="exposure" value="Exposure" v-model="expCond" />
                  <label class="is-size-6" for="exposure">Exposure</label> <br>
                  <input type="radio" id="no-exposure" value="No Exposure" v-model="expCond" />
                  <label class="is-size-6" for="no-exposure">No Exposure</label>

                  <div class="is-size-6 is-underlined">Target Question Condition:</div>
                  <input type="radio" id="heads" value="Heads" v-model="questionCond" />
                  <label class="is-size-6" for="heads">How many monsters have a square head?</label> <br>
                  <input type="radio" id="legs" value="Legs" v-model="questionCond" />
                  <label class="is-size-6" for="legs">How many legs do all the monsters have combined together?</label>

                  <div class="is-size-6 is-underlined">Previous Quality Condition:</div>
                  <input type="radio" id="good" value="Good" v-model="qualityCond" />
                  <label class="is-size-6" for="good">Previously Informative</label> <br>
                  <input type="radio" id="bad" value="Bad" v-model="qualityCond" />
                  <label class="is-size-6" for="bad">Previously Uninformative</label>

                  <br><br>

                  Use the links below to navigate to different parts of the experiment, or use the navigation bar at the top of the page.
                <br>
                  
                <hr>
                <h3 class="title is-5">Start from beginning</h3>
                <p class="is-size-6">
                    Start the experiment from the very beginning as if you were a real participant. Your data will not be saved, though some local storage may be used while you are on the page.
                  </p>

                  <a @click="startExperiment()" class="button is-yellow is-small" id="citizen_tester">Start &nbsp;<FAIcon icon="fa-solid fa-arrow-right" /></a>
                <hr>
                <h3 class="title is-5">Skip to game instructions & practice trial (exposure manipulation)</h3>
                  <p class="is-size-6">
                    Go to the game instructions and practice trial. All conditions see the game instructions, but only the exposure condition has a practice trial.
                  </p>
                  <a @click="skipTo('practice')" class="button is-yellow is-small" id='citizen_tester'>Instructions & Practice &nbsp;<FAIcon icon="fa-solid fa-arrow-right" /></a>
                  <hr>
                  <h3 class="title is-5">Skip to question asking task</h3>
                  <p class="is-size-6">
                    Go to the first trial of the question asking task.
                  </p>
                  <a @click="skipTo('main')"  class="button is-yellow is-small" id='citizen_tester'>Question Asking Task &nbsp;<FAIcon icon="fa-solid fa-arrow-right" /></a>
                
              </p>        
        </div>

    
</template>

<style scoped>
.hero {
  background-color: rgb(255, 212, 102);
  margin-bottom: 30px;
  padding: 0px;
}
.hero-body {
  padding: 10px;
}
.content {
    width: 70%;
    margin: auto;
    padding-bottom: 60px;
    
}

.content a {
    margin-left: 10px;
}

.is-pink {
    background-color: #ffc0cb;
}
.is-orange {
    background-color: #fda918;
    color: #fff
}
.config b {
  color: #639aa6;
}
#bigsmile {
  font-size: 100px;
}
</style>