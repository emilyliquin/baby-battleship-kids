import { createPinia } from 'pinia'
import appconfig from '@/config'

const local = localStorage.getItem(appconfig.local_storage_key);
const lastStart = JSON.parse(local).lastStart
// if more than 1 hour has passed, reset local storage
if(Date.now()-lastStart > 3.6e6){
    localStorage.removeItem(appconfig.local_storage_key)
}

export const pinia = createPinia()

export default pinia