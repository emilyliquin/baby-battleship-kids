<script setup>




</script>


<template>
    <article class="message">
        <div class="message-header">
            <p>Help!</p>
        </div>
        <div class="message-body has-text-left mr-7 pb-8">
            <p>Sorry to hear that you've encountered an issue. Let's see if we can fix it.</p>
            <p> Make sure your sound is on and your window is full screen. Then, click 'Take me back to the study!' to reload the page. </p>
            <p> If that doesn't work, please email us at <a href="mailto:discoveriesinaction@gmail.com">discoveriesinaction@gmail.com</a>.</p>
            <div class="has-text-right mt-5">
                <button class="button is-info" aria-label="close" @click="$emit('closeHelp')">Take me back to the study!</button>
            </div>
        </div>            
    </article>
</template>

<style scoped>
p{
    margin-top: 10px;
}

</style>