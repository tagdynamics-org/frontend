<template>
  <section>
    <div v-if="showButton">
      <router-link
        :to="toArgument"
        class="button is-link is-small"
        tag="button">Open
      </router-link>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Buefy from "buefy";
import "buefy/dist/buefy.css";
import {splitOn, getTagDict, formatPercent} from "@/helper";

export default Vue.extend({
  props: ["targetState", "selectedTags"],
  computed: {
    /** Show transition button for visible tags; not for Deleted */
    showButton(): boolean {
      return (this.targetState.state === "VIS");
    },
    /** convert eg. ["0:bench"] => {amenity: "bench"} */
    toArgument(): any {
      return { name: "transitions", query: getTagDict(this.targetState, this.selectedTags) };
    },
  },
});
</script>

<style>
</style>
