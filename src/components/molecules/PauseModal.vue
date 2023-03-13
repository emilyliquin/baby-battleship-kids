<script setup>




</script>


<template>
    <article class="message">
        <div class="message-header">
            <p>Study Paused</p>
        </div>
        <div class="message-body has-text-left mr-7 pb-8">
            <p>The study is now paused. When you're ready to resume, click 'Thanks, take me back to the study!' below.</p>
            <div class="has-text-left mt-5">
                <button class="button" aria-label="close" @click="$emit('closePause')">Thanks, take me back to the study!</button>
            </div>

        </div>            
    </article>
</template>

<style scoped>
p{
    margin-top: 10px;
}

</style>