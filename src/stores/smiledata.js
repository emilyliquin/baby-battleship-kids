import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import axios from 'axios'
import appconfig from '@/config'

import {
  createDoc,
  updateSubjectDataRecord,
  updateExperimentCounter,
  balancedAssignConditions,
  loadDoc,
  fsnow,
  processFinishedData,
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
      seedActive: true, // do you want to use a random seed based on the participant's ID?
      seedID: '',
      seedSet: false,
      pageTracker: 0,
      cc_page: 0,
      prac_page: 0,
      main_page: 0,
      intro_page: 0,
      consent_page:0,
      mouseinfo_page: 0,
      endtask_page: 0,
      upload_page: 0,
      page_visited: -1,
      lastStart: Date.now(),
      possibleConditions: {condNum: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]},
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
      docRef: null,
      trial_num: 0, // not being updated correctly
      consented: false,
      done: false,
      recruitment_service: 'web', // fake
      browser_data: [], // empty
      time_data: [],
      parent_form: {}, // empty
      withdraw: false, // false
      route_order: [],
      conditions: {},
      study_data: [],
      start_time: Date.now(),
      end_time: 0,
      code_hash: appconfig.github.last_commit_hash,
      progress: 0,
      questions_asked: 0,
      smile_config: appconfig, //  adding config info to firebase document
    },
    private_data: {
      recruitment_info: {},
      withdraw_data: {}
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
    getSeedID: (state) => state.local.seedID,
    getPage: (state) => state.local.pageTracker,
    getPossibleConditions: (state) => state.local.possibleConditions,
    getConditions: (state) => state.data.conditions,
    getPageCC: (state) => state.local.cc_page,
    getPagePrac: (state) => state.local.prac_page,
    getPageMain: (state) => state.local.main_page,
    getPageIntro: (state) => state.local.intro_page,
    getPageConsent: (state) => state.local.consent_page,
    getPageMouseInfo: (state) => state.local.mouseinfo_page,
    getPageEndTask: (state) => state.local.endtask_page,
    getPageUpload: (state) => state.local.upload_page,
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
      this.data.starttime = fsnow()
    },
    setWithdraw(forminfo) {
      this.data.withdraw = true
      this.private_data.withdraw_data = forminfo
      this.data.endtime = fsnow()
    },
    setDone() {
      this.data.done = true
      processFinishedData()
    },
    setCompletionCode(code) {
      this.local.completionCode = code
    },
    setSeedID(seed) {
      this.local.seedID = seed
      this.local.seedSet = true
    },
    incrementPageTracker(){
      this.local.pageTracker += 1
      return this.local.pageTracker
    },
    resetPageTracker(){
      this.local.pageTracker = 0
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
    getBrowserFingerprint() {
      // this is not "real" browser fingerprinting, but it's close enough for our purposes
      // it just finds things like browser version, OS, and IP address of user
      // which can be helpful for debugging purposes
      let ip = 'unknown'
      // Make a request for a user with a given ID
      axios
        .get('https://api.ipify.org/?format=json')
        .then((response) => {
          // handle success
          console.log('ip address', response.data)
          // check if ip field exists
          if (response.data.ip) {
            ip = response.data.ip
          }
        })
        .catch((error) => {
          // handle error
          console.log(error)
        })
        .finally(() => {
          // always executed
          const { language } = window.navigator
          const { webdriver } = window.navigator
          const { userAgent } = window.navigator
          this.setFingerPrint(ip, userAgent, language, webdriver)
        })
    },
    setFingerPrint(ip, userAgent, language, webdriver) {
      this.data.browser_fingerprint = {
        ip,
        userAgent,
        language,
        webdriver,
      }
      console.log(this.data.browser_fingerprint)
    },
    setPageAutofill(fn) {
      this.dev.page_provides_autofill = fn
    },
    removePageAutofill() {
      this.dev.page_provides_autofill = null
    },
    setRecruitmentService(service, info) {
      this.data.recruitment_service = service
      this.private_data.recruitment_info = info
    },
    autofill() {
      if (this.dev.page_provides_autofill) {
        this.dev.page_provides_autofill()
      }
    },
    saveParentForm(data) {
      this.data.parent_form = data
    },
    saveTrialData(data) {
      this.data.study_data.push(data)
    },
    setCondition(name, cond) {
      this.data.conditions[name] = cond
    },
    incrementPage(page, amount){
      this.local[page] += amount
      return this.local[page] 
    },
    resetPages(){
      this.local.cc_page = 0
      this.local.prac_page = 0
      this.local.main_page = 0
    },
    saveTiming(page, time) {
      this.data.time_data.push({page, time})
    },
    // saveStartTime(time){
    //   this.data.start_time = time
    // },
    saveEndTime(time){
      this.data.end_time = time
    },
    incrementQuestions(){
      this.data.questions_asked += 1
    },
    async setKnown() {
      this.local.knownUser = true
      this.local.partNum = await updateExperimentCounter('participants')
      this.local.docRef = await createDoc(this.data, this.private_data, this.local.seedID, this.local.partNum)
      this.data.docRef = this.local.docRef
      // if possible conditions are not empty, assign conditions
      if(this.local.possibleConditions){
        this.data.conditions = await balancedAssignConditions(this.local.possibleConditions, this.data.conditions)
      }
      if (this.local.docRef) {
        this.setDBConnected()
        // force a data save so conditions get added to the data right away
        this.saveData(true)
      }
      return this.data.conditions
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

