<template>
  <div class="home">
    <HelloWorld msg="more content here.."/>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';

// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';
import Footer from '@/components/Footer.vue';

export default Vue.extend({
  name: 'home',
  components: {
    HelloWorld,
  },
});
</script>
