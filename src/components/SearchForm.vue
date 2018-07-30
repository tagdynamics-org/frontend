<template>
  <section>
    <b-field label="Search tag states on the OpenStreetMap">
      <b-taginput
          v-model="tagList"
          size="is-medium"
          :before-adding="beforeAdding">
      </b-taginput>
    </b-field>
    <div class="container has-text-left-tablet">
      <p>
        Try eg. search tags
        <b-tag>amenity=*</b-tag>, <b-tag>building=greenhouse</b-tag>  or <b-tag>*=construction</b-tag>.
        Supported key values are: {{ selectedTags.join(", ") }}.
      </p>
    </div>
  </section>
</template>

<script lang="ts">

import Vue from "vue";
import Buefy from "buefy";
import "buefy/lib/buefy.css";
import {splitOn} from "@/helper";

export default Vue.extend({
  watch: {
    tagList(newvalue, oldvalue) {
      this.$emit("on-newtags", newvalue);
    },
  },
  data() {
    return {
      selectedTags: (process.env.VUE_APP_SELECTED_TAGS as string).split(","),
      tagList: [],
    };
  },
  methods: {
    beforeAdding(tag: string) {
      if (!tag || tag.length === 0) {
        return false;
      }

      const [k, v]: string[] = splitOn(tag, "=");
      if (k.length === 0 || v.length === 0) {
        return false;
      }

      // "*=pizza" is ok
      if (k === "*") {
        return true;
      }

      // "<one of the selected tags>=<anything>" (eg. "amenity=*") is ok
      if (this.selectedTags.indexOf(k) >= 0) {
        return true;
      }

      return false;
    },
  },
});
</script>

<style>
</style>
