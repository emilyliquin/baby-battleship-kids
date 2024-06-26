<script setup>
import { onMounted, watch, ref, reactive } from 'vue';
import { useMouse } from '@vueuse/core'
import { useRouter, useRoute  } from 'vue-router'

import useSmileStore from '@/stores/smiledata'
import { routes } from '@/router' 
import appconfig from '@/config'

const smilestore = useSmileStore() // load the global store
const { x, y } = useMouse({ touch: false }) // tracks mouse reactively
const router = useRouter()  // this is needed in composition API because this.$router not availabel
const route = useRoute()

// watch route -- if route changes, update value of current query. This will get carried forward when you jump routes
const currentQuery = ref(route.query)
watch(route, async (newRoute, oldRoute) => {
  currentQuery.value = newRoute.query
})


// easter egg to jump to config page (press 2 with mouse in top right of screen)
onMounted(() => {
  window.addEventListener('keyup', (ev) => {
      if((x.value<10) && (y.value<50) && (ev.key==='2')) {
        router.push('/config') // jump to the config page
      }
      if((x.value<10) && (y.value<50) && (ev.key==='1')) {
        router.push('/') // jump to the start page (or get redirected)
      }
      if((x.value<10) && (y.value<50) && (ev.key==='a')) {
        smilestore.autofill()
      }

  })
})

function resetLocalState() { // this is repeated on config and maybe should be a utility function
  localStorage.removeItem(smilestore.config.local_storage_key) // delete the local store
  // localStorage.removeItem(`${appconfig.local_storage_key}-seed_id`)
  // localStorage.removeItem(`${appconfig.local_storage_key}-seed_set`)
  smilestore.$reset()  // reset all the data even
  window.location = '/' // this will refresh the page rather than just load the route
  // router.push('/')
}

function resetPages(routeName){
  smilestore.resetPageTracker() // reset all the page counts
  if (route.name === routeName){
    router.go(0)
  }
}

// display in the toolbar the selected conditions
const conditions = reactive(smilestore.getConditions)

// when condition is set in the store, update the toolbar conditions
watch(() => smilestore.data.conditions, async (newConds) => {
  // for each key in newConds, update that entry in conditions
  Object.keys(newConds).forEach((key) => {
    conditions[key] = newConds[key]
  })
})

// when a condition is changed in the toolbar, update the store
function changeCond(key, cond) {
  smilestore.setCondition(key, cond)
}


</script>

<template>
  <nav class="navbar">
    <div class="navbar-brand">

        <div class="devmode-title">DEVELOPER MODE</div>
        <div class="devmode">
          -- &nbsp; Reset: 
          <a alt="Reset all state and return to / route" @click="resetLocalState()">
            <FAIcon icon="fa-solid fa-arrow-rotate-left" />
          </a>
        </div>
        <div class="devmode">
          | &nbsp; Config: 
          <a href="/#/config" alt="View config">
            <FAIcon icon="fa-solid fa-gear" />
          </a>
        </div>

        <div class="devmode">
          | &nbsp; Docs: 
          <a href="https://smile.gureckislab.org" alt="View docs" target="_new">
            <FAIcon icon="fa-solid fa-book" />
          </a>
        </div>

        <div class="devmode">
          <div class="dropdown is-hoverable">
            <div class="dropdown-trigger">
              | &nbsp; Jump
              
              <a alt="Skip sections">
                <FAIcon icon="fa-solid fa-rainbow" />
              </a>
            </div>
            <div class="dropdown-menu" id="dropdown-menu" role="menu" >
              <div class="dropdown-content">
                <br>
                <input type="checkbox" v-model='smilestore.local.allowJumps'/> <b>Force</b>
                <br><br>
                <hr class="dropdown-divider">
                <template v-for="r in routes">
                  <!-- make a special link for web_referred, which has params -->
                  <router-link class="dropdown-item routelink" v-if="r.name === 'welcome_referred'" :to="{ name: r.name, params: { service: 'web' }, query: currentQuery }" :key="r.path">
                    <span v-on:click="resetPages(r.name)">/{{ r.name }}</span>
                  </router-link>
                  <!-- make a link for everything else -->
                  <router-link class="dropdown-item routelink" v-else :to="{ name: r.name, query: currentQuery }" :key="r.name">
                    <span v-on:click="resetPages(r.name)">/{{ r.name }}</span>
                  </router-link>
                </template>

              </div>
            </div>
          </div>
        </div>
        
        <div class="devmode">
          <div class="dropdown is-hoverable">
            <div class="dropdown-trigger">
              | &nbsp; Useful: 
              <a alt="Skip sections">
                <FAIcon icon="fa-solid fa-face-laugh-beam" />
              </a>
            </div>
            <div class="dropdown-menu" id="dropdown-menu" role="menu">
              <div class="dropdown-content">
                <a href="https://github.com/NYUCCL/smile" class="dropdown-item" target="_new">
                  <FAIcon icon="fa-solid fa-globe" /> Smile GitHub
                </a>
                <a href="https://vuejs.org" class="dropdown-item" target="_new">
                  <FAIcon icon="fa-solid fa-globe" /> Vuejs
                </a>
                <a href="https://sfc.vuejs.org" class="dropdown-item" target="_new">
                  <FAIcon icon="fa-solid fa-globe" /> Vuejs SFC Playground
                </a>
                <a href="https://devtools.vuejs.org/" class="dropdown-item" target="_new">
                  <FAIcon icon="fa-solid fa-globe" /> Vue Dev Tools (Chrome)
                </a>
                <a href="https://bulma.io" class="dropdown-item" target="_new">
                  <FAIcon icon="fa-solid fa-globe" /> Bulma
                </a>
                <a href="https://fontawesome.com" class="dropdown-item" target="_new">
                  <FAIcon icon="fa-solid fa-globe" /> FontAwesome
                </a>
                <a href="https://www.internetingishard.com" class="dropdown-item" target="_new">
                  <FAIcon icon="fa-solid fa-globe" /> Interneting is hard
                </a>
                <a href="https://javascript.info" class="dropdown-item" target="_new">
                  <FAIcon icon="fa-solid fa-globe" /> The Modern Javascript Tutorial
                </a>
              </div>
            </div>
          </div>&nbsp;
        </div>

        <div class="devmode" v-if="smilestore.hasAutofill">
          | &nbsp; Autofill Form: 
          <a @click="smilestore.autofill()" alt="View docs" >
            <FAIcon icon="fa-solid fa-pen-to-square" />
          </a>
        </div>

    </div>

    <div class="devmode">
          | &nbsp; Seed: 
          <input type="checkbox" v-model='smilestore.local.seedActive'/> 
    </div>
    
    <template v-for="(value, key) in smilestore.getPossibleConditions" :key="key">
      <div class="devmode">
          <div class="dropdown is-hoverable">
            <div class="dropdown-trigger">
              | &nbsp; {{key}}:
              
              <a alt="Condition assignments">
                <FAIcon icon="fa-solid fa-flask" />
              </a>
            </div>
            <div class="dropdown-menu" id="dropdown-menu" role="menu" >
              <div class="dropdown-content">
                <template v-for="cond in value" :key="cond">
                  <!-- make checkboxes for each condition -->
                  <br>
                  <div class="control">
                      <input type="radio" :name="key" :id="cond" :value="cond" v-model="conditions[key]" @change="changeCond(key, cond)">
                      <label :for="cond">{{cond}}</label>
                  </div>
                  <!-- <input type="checkbox" :value="isCond(key, cond)"/> <b>{{cond}}</b> -->
                  <br>
                </template>
              </div>
            </div>
          </div>
        </div>
    </template>
    

  </nav>
</template>

<style scoped>
a {
  color: #fff;
}
.dropdown-content {
  border-radius: 0;
  padding-top:0;
  padding-bottom:0;
  color: #000;
}
.routelink {
  font-family: monospace;
}
.dropdown-content b {
  color: #000;
  font-size: 13px;
}
.dropdown-divider {
  margin: 0;
}
.dropdown-item {
  color: #000;
  font-size: 13px;
  padding: 8px;
  margin: 0px;
  text-align: left;
}
a:hover {
  color: #10dffa;
}

.iconcolor {
  color: #10dffa;
}
.navbar {
  font-size: 13px;
  background: rgb(63, 160, 149);
  color: #fff;
  height: 5px;
  padding: 0px;
  padding-left: 10px;
  margin: 0px;
  min-height: 32px;
  text-align: center;
}
.devmode-title {
  padding-top: 8px;
  font-weight: 500;
  padding-left: 10px;
}
.devmode {
  padding-top: 8px;
  font-weight: 400;
  padding-left: 10px;
}

.dropdown-menu{
  min-width:80px
}
</style>