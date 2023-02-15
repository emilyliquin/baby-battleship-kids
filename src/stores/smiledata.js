import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import appconfig from '@/config'

import {
  createDoc,
  updateSubjectDataRecord,
  updateExperimentCounter,
  loadDoc,
  fsnow,
} from './firestore-db'


export default defineStore('smilestore', {
  // arrow function recommended for full type inference
  state: () => ({
    local: useStorage(appconfig.local_storage_key, {
      // syncs with local storage
      knownUser: false,
      lastRoute: appconfig.mode === 'development' ? 'recruit' : 'landing',
      allowJumps: appconfig.mode === 'development',
      docRef: null,
      partNum: null,
      completionCode: '',
      totalWrites: 0,
      lastWrite: null,
      seedActive: true,
      seedID: '',
      seedSet: false,
    }, localStorage, { mergeDefaults: true }),
    global: {
      // ephemeral state, resets on browser refresh
      progress: 0,
      page_bg_color: '#fff',
      page_text_color: '#000',
      status_bar_bg_color: '#fff',
      status_bar_text_color: '#000',
      db_connected: false,
      search_params: null,
    },
    dev: {
      // ephemeral state, utilized by developer mode functions
      page_provides_autofill: null,
    },
    data: {
      // syncs with firestore
      trial_num: 0, // not being updated correctly
      consented: false,
      done: false,
      recruitment_service: 'web', // fake
      recruitment_info: {}, // empty
      browser_data: [], // empty
      time_data: [],
      demographic_form: {}, // empty
      withdraw: false, // false
      withdraw_data: {}, // empty
      route_order: [],
      conditions: {}
    },
    config: appconfig,
  }),

  getters: {
    isKnownUser: (state) => state.local.knownUser,
    isConsented: (state) => state.data.consented,
    isDone: (state) => state.data.done,
    lastRoute: (state) => state.local.lastRoute,
    isDBConnected: (state) => state.global.db_connected,
    hasAutofill: (state) => state.dev.page_provides_autofill,
    searchParams: (state) => state.global.search_params,
    recruitmentService: (state) => state.data.recruitment_service,
    isSeedSet: (state) => state.local.seedSet,
    getSeedID: (state) => state.local.seedID
  },

  actions: {
    setDBConnected() {
      this.global.db_connected = true
    },
    setSearchParams(search_params) {
      this.global.search_params = search_params
    },
    setConsented() {
      this.data.consented = true
    },
    setDone() {
      this.data.done = true
    },
    setCompletionCode(code) {
      this.local.completionCode = code
    },
    setSeedID(seed) {
      this.local.seedID = seed
      this.local.seedSet = true
    },
    recordWindowEvent(type, event_data = null) {
      if (event_data) {
        this.data.browser_data.push({
          event_type: type,
          timestamp: fsnow(),
          event_data,
        })
      } else {
        this.data.browser_data.push({
          event_type: type,
          timestamp: fsnow(),
        })
      }
    },
    setPageAutofill(fn) {
      this.dev.page_provides_autofill = fn
    },
    removePageAutofill() {
      this.dev.page_provides_autofill = null
    },
    setRecruitmentService(service, info) {
      this.data.recruitment_service = service
      this.data.recruitment_info = info
    },
    autofill() {
      if (this.dev.page_provides_autofill) {
        this.dev.page_provides_autofill()
      }
    },
    saveDemographicForm(data) {
      this.data.demographic_form = data
    },
    setCondition(name, cond) {
      this.data.conditions[name] = cond
    },
    async setKnown() {
      this.local.knownUser = true
      this.local.partNum = await updateExperimentCounter('participants')
      this.local.docRef = await createDoc(this.data, this.local.seedID, this.local.partNum)

      // assign conditions, with id number for randomization
      // this.assignConds(this.local.partNum)

      if (this.local.docRef) {
        this.setDBConnected()
      }
    },
    saveTiming(page, time) {
      this.data.time_data.push({page, time})
    },
    async loadData() {
      let data
      if (this.local.docRef) {
        data = await loadDoc(this.local.docRef)
      }
      if (data) {
        this.data = data
        this.setDBConnected()
      }
    },
    setLastRoute(route) {
      this.local.lastRoute = route
      // if (route !== 'config') {
      //   this.local.lastRoute = route
      // }
    },
    recordRoute(route){
      this.data.route_order.push(route)
    },
    async saveData(force = false) {
      if (this.isDBConnected) {
        if (!force && this.local.totalWrites >= appconfig.max_writes) {
          console.error(
            'SMILESTORE: max writes reached to firebase.  Data NOT saved.  Call saveData() less numerously to avoid problems/cost issues.'
          )
          return
        }

        if (
          !force &&
          this.local.lastWrite &&
          Date.now() - this.local.lastWrite < appconfig.min_write_interval
        ) {
          console.error(
            'SMILESTORE: write interval too short for firebase.  Data NOT saved. Call saveData() less frequently to avoid problems/cost issues.'
          )
          console.error(
            'SMILESTORE: interval was',
            appconfig.min_write_interval
          )
          // console.error(Date.now() - this.local.lastWrite)
          return
        }
        updateSubjectDataRecord(this.data, this.local.docRef)
        this.local.totalWrites += 1
        this.local.lastWrite = Date.now()
        console.log('Request to firebase successful')
      }
    },
    resetLocal() {
      // this.local.knownUser = false
      // this.local.lastRoute = 'welcome'
      // this.local.allowJumps = false
      // this.global.db_connected = false
      this.$reset()
    },
  },
})

