<!--
  src/components/TransitionsTable.vue 

  This component is based on Buefy example code:
  https://github.com/buefy/buefy/blob/master/docs/pages/components/table/examples/ExAsyncData.vue
-->

<template>
  <div id="tagtable">

    <section class="section">
      <div class="container">
        <TagKVListRenderer :kvPairList="kvPairs" :isLarge="true"/>
      </div>
    </section>

    <section class="section">
      <h1 class="title">Transitions</h1>
        <b-table
          :data="data"
          paginated
          :loading="loading"
          :per-page="perPage"
          :total="total"

          :default-sort-direction="defaultSortOrder"
          :default-sort="[sortField, sortOrder]"
          @sort="onSort">

        <template slot-scope="props">
          <b-table-column label="Total rank" width="25" numeric
                          :visible="sortField === 'totalCount'">
            {{ props.row.totalRank }}
          </b-table-column>

          <!-- Show live rank if we sort by liveCount or percent_live -->
          <b-table-column label="Live rank" field="liveRank" width="25" numeric
                          :visible="sortField !== 'totalCount'">
            {{ props.row.liveRank }}
          </b-table-column>

          <b-table-column field="tags" width=800 label="Categorical tags">
            <TagStateRenderer :state="props.row.state"
                              :selectedTags="selectedTags"/>
          </b-table-column>

          <b-table-column label="First edit" field="first_edit" width="25" numeric sortable>
            {{ formatDate(props.row.first_edit) }}
          </b-table-column>

          <b-table-column label="Last edit" field="last_edit" width="25" numeric sortable>
            {{ formatDate(props.row.last_edit) }}
          </b-table-column>

          <b-table-column label="Total count" field="totalCount" width="15" numeric sortable>
            {{ props.row.totalCount }}
          </b-table-column>

          <b-table-column label="Live count" field="liveCount" width="15" numeric sortable>
            {{ props.row.liveCount }}
          </b-table-column>

          <b-table-column label="Live" field="livePercent" width="15" numeric sortable>
            {{ formatPercent(props.row.livePercent) }}
          </b-table-column>

          <b-table-column label="To" field="toTransitions" width="15" numeric sortable>
            <b-tooltip
              multilined
              label="Number of unique map elements (nodes, ways, relations) that at some
              point in the OSM history have changed FROM the tag(s) listed on this line TO the
              tag(s) listed at the top of the page.">
                {{ props.row.toTransitions }}
            </b-tooltip>
          </b-table-column>

          <b-table-column label="From" field="fromTransitions" width="15" numeric sortable>
            <b-tooltip
              multilined
              label="Number of unique map elements (nodes, ways, relations) that at some
              point in the OSM history have changed TO the tag(s) listed on this line FROM the
              tag(s) listed at the top of the page.">
                {{ props.row.fromTransitions }}
            </b-tooltip>
          </b-table-column>

          <b-table-column label="To+From" field="toPlusFromTransitions" width="15" numeric sortable>
            {{ props.row.toPlusFromTransitions }}
          </b-table-column>
        </template>
      </b-table>
    </section>

    <LicenseNote :downloadDate="downloadDate" />
  </div>
</template>

<script lang="ts">
import {splitOn, splitTagArray, formatPercent, formatDate} from "@/helper";

import LicenseNote from "./LicenseNote.vue";
import TagStateRenderer from "./TagStateRenderer.vue";
import TagKVListRenderer from "./TagKVListRenderer.vue";

import Vue from "vue";
import axios from "axios";

interface TableColumns {
  state: any;
  first_edit: string;
  last_edit: string;
  liveCount: number;
  liveRank: number;
  totalCount: number;
  toTransitions: number;
  fromTransitions: number;
}

interface DataType {
  $route: any;
  data: TableColumns[];
  perPage: number;
  total: number;
  loading: boolean;
  page: number;
  totalPages: number;
  sortField: string;
  sortOrder: string;
  defaultSortOrder: string;
  dataSet: any;
  selectedTags: string[];
  downloadDate: string | undefined;
}

export default Vue.extend({
  components: { LicenseNote, TagStateRenderer, TagKVListRenderer },
  props: [],
  data(): (DataType | null ) {
    return {
      $route: undefined,
      data: [],
      perPage: 100,
      total: 1, // total elements in table
      loading: false,
      page: 1,
      totalPages: 1,
      sortField: "toPlusFromTransitions",
      sortOrder: "desc",
      defaultSortOrder: "desc",
      dataSet: undefined,
      selectedTags: [],
      downloadDate: undefined,
    };
  },
  created() {
    window.addEventListener("keydown", this.onkey);
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.onkey);
  },
  methods: {
    formatPercent,
    formatDate,
    onkey(event: any) {
      if (event.key === "ArrowRight" && this.page < this.totalPages) {
        this.onPageChange(this.page + 1);
      } else if (event.key === "ArrowLeft" && this.page > 1) {
        this.onPageChange(this.page - 1);
      }
    },
    onPageChange(page: any) {
      this.page = page;
    },
    loadAsyncData() {
      this.loading = true;
      const params = this.tagList.join("&");
      axios
        .get(`${process.env.VUE_APP_API_URL}/transitions?${params}`)
        .then((response) => {
          this.data = [];
          this.total = response.data.transitions.length;
          this.dataSet = response.data.dataSet;
          this.selectedTags = response.data.dataSet.selectedTags;
          this.downloadDate = response.data.dataSet.downloaded;
          this.totalPages = Math.floor(this.total / this.perPage) + 1;

          response.data.transitions.forEach((item: any) => {
            const row = {
              state: item.state,
              first_edit: item.tagStats.firstEdit,
              last_edit: item.tagStats.lastEdit,
              totalCount: item.tagStats.total.counts,
              totalRank: item.tagStats.total.rank,
              liveCount: item.tagStats.live ? item.tagStats.live.counts : undefined,
              liveRank: item.tagStats.live ? item.tagStats.live.rank : undefined,
              livePercent: item.tagStats.live ? item.tagStats.live.livePercent : undefined,
              toTransitions: item.to,
              fromTransitions: item.from,
              toPlusFromTransitions: item.to + item.from,
            };
            this.data.push(row);
          });
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
        });
    },
    onSort(field: string, order: string) {
      this.page = 1;
      this.sortField = field;
      this.sortOrder = order;
    },
  },
  mounted() {
    this.loadAsyncData();
  },
  computed: {
    kvPairs(): string[][] {
      const result: string[][] = [];
      Object.keys(this.$route.query).forEach((key) => {
        const kv: string[] = [key, this.$route.query[key]];
        result.push(kv);
      });
      return result;
    },
    tagList(): string[] {
      const result: string[] = [];
      Object.keys(this.$route.query).forEach((key) => {
        result.push(`${key}=${this.$route.query[key]}`);
      });
      return result;
    },
  },
});
</script>

<style>
  #tagtable {
    padding: 0 50px;
  }
</style>
