<template>
  <div class="home">
    <TagTable/>
  </div>
</template>

<script lang="ts">

import Vue from "vue";

// @ is an alias to /src
import TagTable from "@/components/TagTable.vue";

export default Vue.extend({
  name: "home",
  components: {
    TagTable,
  },
});
</script>
