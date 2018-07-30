<template>
  <section>
    <div class="container has-text-left-tablet" id="license-block">
      <p id="license-text">
        This work is based on data extracted from the 
        <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> (OSM)
        project, © OpenStreetMap contributors. The OpenStreetMap data is available 
        under the
        Open Database License (ODbL). As a derivative work, the OSM data on this webpage
        is distributed under the same license. The source codes for this analysis are 
        available on <a href="https://github.com/tagdynamics-org">github</a>.

        The input data is the full OSM data including edit histories. Downloaded {{ downloadDate }}
        from <a href="https://planet.openstreetmap.org/pbf/full-history/">here</a>.
      </p>

      <p id="license-text">
        Please note this is work in progress. If something seems wrong, unclear, or if you have a 
        suggestion how to improve this, maybe 
        <a href="https://github.com/tagdynamics-org/frontend/issues">file an issue</a>?
      </p>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Buefy from "buefy";
import "buefy/lib/buefy.css";

export default Vue.extend({
  props: ["downloadDate"],
});
</script>

<style>
  #tagtable {
    padding: 0 50px;
  }
  #license-block {
    padding: 20px 0;
  }
  #license-text {
    font-size: 14px;
    color: #848383;
  }
</style>
