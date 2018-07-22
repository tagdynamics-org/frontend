<template>
  <section>
    <div class="hello">
      <h1>{{ msg }}</h1>
    </div>

    <template>
      <b-table :data="data" :columns="columns"></b-table>
    </template>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';

import Buefy from 'buefy';
import 'buefy/lib/buefy.css';

Vue.use(Buefy);

export default Vue.extend({
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  data() {
    return {
      data: [
        { id: 1, txt: 'Hello' },
        { id: 2, txt: 'World' },
        { id: 3, txt: 'Testing' },
        { id: 4, txt: 'Buefy' },
      ],
      columns: [
        {
          field: 'id',
          label: 'ID',
          width: '40',
          numeric: true,
        },
        {
          field: 'txt',
          label: 'Content',
        },
      ],
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
