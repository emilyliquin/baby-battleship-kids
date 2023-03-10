<script setup>
import { reactive,  onMounted} from 'vue'
import useSmileStore from '@/stores/smiledata'
 // get access to the global store
const emit = defineEmits(['closeStop','submitWithdraw'])

const smilestore = useSmileStore()

// function testme() {
//     console.log('testme')
// }

function withdraw() {
    smilestore.data.withdraw=true
    emit('submit-withdraw')
}



</script>


<template>
    <article class="message">
        <div class="message-header">
            <p>Stop Study</p>
        </div>
        <div class="message-body has-text-left mr-7 pb-8">
            <p>You are free to stop the study at any time. If you clicked the stop button in error, please click the button below to return to the study.</p>
            <div class="has-text-left mt-5">
                <button class="button is-info" aria-label="close" @click="$emit('closeStop')">Oops, take me back to the study!</button>
            </div>
            <br>
            <p>If you'd like to end your participation early and upload your video from today's session, please click the button below to fill out a brief parent form. Then, you'll upload your video and be all done.</p>
            <div class="has-text-left mt-5">
                <button class="button is-danger" aria-label="close" @click="withdraw()">Parent form and upload video</button>
            </div>        
            <br>
            <p>If you'd like to end your participation early <b>without</b> uploading your video from today's session, you can close this web browser now.</p>

        </div>            
    </article>
</template>

<style scoped>
p{
    margin-top: 10px;
}

</style>