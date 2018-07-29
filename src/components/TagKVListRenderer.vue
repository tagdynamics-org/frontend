<template>
  <section>
    <b-taglist>
      <span v-for="[k, v] in kvPairList" :key="k">
        <b-taglist attached>
          <div v-if="isLarge">
            <b-tag type="is-info" class="is-large"> {{ k }}</b-tag>
            <b-tag class="is-large">{{ v }}</b-tag>
          </div>
          <div v-if="!isLarge">
            <b-tag type="is-info"> {{ k }}</b-tag>
            <b-tag>{{ v }}</b-tag>
          </div>
        </b-taglist>
      </span>
    </b-taglist>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Buefy from "buefy";
import "buefy/lib/buefy.css";

export default Vue.extend({
  props: [
    "kvPairList", // eg. [["amenity", "bench"], ["man_made", "lake"]]
    "isLarge", // true or false (=default for missing value)
    ],
});
</script>

<style>
</style>
