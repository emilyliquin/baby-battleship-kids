<script>
  import { defineComponent } from "vue";
  import { VueSignaturePad } from 'vue-signature-pad';
  
  export default defineComponent({
    name: 'MySignaturePad',
    components: { VueSignaturePad },
    methods: {
      save() {
        const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
        console.log(isEmpty);
        console.log(data);
      },
      clear() {
        this.$refs.signaturePad.clearSignature();
      },
    }
  });
  </script>

<template>
    <div id="app">
      <VueSignaturePad class="sigpad" width="500px" height="200px" ref="signaturePad" />
      <div>
        <button @click="save">Save</button>
        <button @click="clear">Clear</button>
      </div>
    </div>
  </template>

<style>

.sigpad{
    border:black 1px solid;
    margin-left: 200px;
    left: 50%
}
</style>