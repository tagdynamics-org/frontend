<template>
  <section>
    <b-taglist>
      <div :v-if="renderCombinedTags">
        <TagKVListRenderer :kvPairList="tagKVPairsToRender" />
      </div>
      <div v-if="isDelete">
        <b-tag type="is-primary">Deleted</b-tag>
      </div>
      <div v-if="isVisible && tagKVPairsToRender.length === 0">
        None of the selected tags
      </div>
    </b-taglist>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Buefy from "buefy";
import "buefy/dist/buefy.css";
import TagKVListRenderer from "./TagKVListRenderer.vue";
import {splitOn, splitTagArray, getTagDict, formatPercent, stateIsVisible, stateIsDeleted} from "@/helper";

export default Vue.extend({
  // provide either `kvPairList` or (`state` and `selectedTags)
  props: ["state", "selectedTags"],
  components: { TagKVListRenderer },
  computed: {
    tagKVPairsToRender(): any {
      return splitTagArray(this.state, this.selectedTags);
    },
    renderCombinedTags(): boolean {
      return stateIsVisible(this.state);
    },
    isDelete(): boolean {
      return stateIsDeleted(this.state);
    },
    isVisible(): boolean {
      return stateIsVisible(this.state);
    },
  },
});
</script>

<style>
</style>
