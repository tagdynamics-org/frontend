<template>
  <div class="transitions">
    <TransitionsTable/>
  </div>
</template>

<script lang="ts">

import Vue from "vue";

// @ is an alias to /src
import TransitionsTable from "@/components/TransitionsTable.vue";

export default Vue.extend({
  name: "transitions",
  components: {
    TransitionsTable,
  },
});
</script>
