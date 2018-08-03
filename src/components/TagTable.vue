<!-- 
  src/components/TagTable.vue 

  This component is based on Buefy example code:
  https://github.com/buefy/buefy/blob/master/docs/pages/components/table/examples/ExAsyncData.vue
-->

<template>
  <div id="tagtable">
    <div id="search-form">
      <SearchForm @on-newtags="gotNewTags"/>
    </div>
    <section>
        <b-table
          :data="data"
          :loading="loading"
          :per-page="perPage"
          :total="totalEntries"

          backend-sorting
          :default-sort-direction="defaultSortOrder"
          :default-sort="[sortColumn, sortOrder]"
          @sort="onSort"

          paginated
          backend-pagination
          @page-change="onPageChange">

        <template slot-scope="props">
          <b-table-column label="Total rank" width="25" numeric
                          :visible="sortColumn === 'TotalCounts'">
            {{ props.row.total_rank }}
          </b-table-column>

          <!-- Show live rank if we sort by live_count or percent_live -->
          <b-table-column label="Live rank" field="live_rank" width="25" numeric 
                          :visible="sortColumn !== 'TotalCounts'">
            {{ props.row.live_rank }}
          </b-table-column>

          <b-table-column field="tags" label="Categorical tags" width="500">
            <TagStateRenderer :state="props.row.state"
                              :selectedTags="selectedTags"/>
          </b-table-column>

          <b-table-column label="First edit" field="first_edit" width="25" numeric sortable>
            {{ formatDate(props.row.first_edit) }}
          </b-table-column>

          <b-table-column label="Last edit" field="last_edit" width="25" numeric sortable>
            {{ formatDate(props.row.last_edit) }}
          </b-table-column>

          <b-table-column label="Total count" field="total_count" width="25" numeric sortable>
            <b-tooltip
              multilined
              label="Total number of unique map elements (nodes, ways, relations) that at some 
              point in the OSM history have been tagged with the tag(s) on this line">
              {{ props.row.total_count }}
            </b-tooltip>
          </b-table-column>

          <b-table-column label="Live count" field="live_count" width="25" numeric sortable>
            <b-tooltip
              multilined
              label="Number of unique map elements that are tagged with the tag(s) on this 
              line on the latest version of the map">
              {{ props.row.live_count }}
            </b-tooltip>
          </b-table-column>

          <b-table-column label="Live percent" field="live_percent" width="25" numeric sortable>
            {{ formatPercent(props.row.live_percent) }}
          </b-table-column>

          <b-table-column label="" width="20" >
            <OpenTransitionButton :targetState="props.row.state"
                                  :selectedTags="selectedTags"/>
          </b-table-column>
        </template>
      </b-table>
    </section>

    <div class="container has-text-left-tablet">
      The tag states listed above only include the follows tags: {{ selectedTags.join(", ") }}.
      These tags are all <b>categorical</b> in the sense that they describe what something is.
      For example, the list does not include any address tags (eg. like
      <a href="https://taginfo.openstreetmap.org/keys/addr%3Ahousenumber#values">addr:housenumber</a>).
      Even if there are over 1M map elements with house number 1, this criterion does
      not define a reasonable category of objects on the OSM like, say,
      map elements with <b>building=greenhouse</b> would do. Entries with counts below 
      5 are omitted.
    </div>

    <LicenseNote :downloadDate="downloadDate" />
  </div>
</template>

<script lang="ts">

import {splitOn, splitTagArray, formatPercent, formatDate} from "@/helper";
import Vue from "vue";
import Buefy from "buefy";
import "buefy/lib/buefy.css";
import LicenseNote from "./LicenseNote.vue";
import SearchForm from "./SearchForm.vue";
import OpenTransitionButton from "./OpenTransitionButton.vue";
import TagStateRenderer from "./TagStateRenderer.vue";

Vue.use(Buefy);

import axios from "axios";

interface TableColumns {
  live_count: number;
  live_rank: number;
  total_count: number;
  first_edit: string;
  last_edit: string;
}

interface DataType {
  data: TableColumns[];
  perPage: number;
  totalEntries: number;
  selectedTags: string[];
  downloadDate: string;
  totalPages: number;
  loading: boolean;
  page: number;
  sortColumn: string;
  sortOrder: string;
  defaultSortOrder: string;
  dataSet: any;
  searchTags: string[];
}

export default Vue.extend({
  components: { LicenseNote, OpenTransitionButton, TagStateRenderer, SearchForm },
  props: ["name", "initialEnthusiasm"],
  filters: {},

  data(): DataType {
    return {
      data: [],
      perPage: 20,
      totalEntries: 1, // total elements in table
      selectedTags: [],
      downloadDate: "",
      loading: false,
      page: 1,
      totalPages: 1,
      sortColumn: "LiveCounts",
      sortOrder: "Descending",
      defaultSortOrder: "desc",
      dataSet: undefined,
      searchTags: [],
    };
  },
  created() {
    window.addEventListener("keydown", this.onkey);
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.onkey);
  },
  methods: {
    gotNewTags(value: any) {
      this.searchTags = value;
      this.page = 1;
      this.loadAsyncData();
    },
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
      this.loadAsyncData();
    },
    loadAsyncData() {
      this.loading = true;
      const params = [
        `sorting=${this.sortColumn}.${this.sortOrder}`,
        `first-index=${(this.page - 1) * this.perPage}`,
        `n=${this.perPage}`,
        `search-tags=${encodeURIComponent(JSON.stringify(this.searchTags))}`,
        ].join("&");

      axios
        .get(`${process.env.VUE_APP_API_URL}/tag-states?${params}`)
        .then((response) => {
          this.data = [];
          this.totalEntries = response.data.totalEntries;
          this.selectedTags = response.data.dataSet.selectedTags;
          this.downloadDate = response.data.dataSet.downloaded;
          this.dataSet = response.data.requestedEntries;
          this.totalPages = Math.floor(this.totalEntries / this.perPage) + 1;
          response.data.entryList.forEach((args: any) => {
            const tags: string[] = args[0].tags;
            const stats: any = args[1];
            const row = {
              state: args[0],
              first_edit: stats.firstEdit,
              last_edit: stats.lastEdit,
              live_count: stats.live ? stats.live.counts : undefined,
              live_rank: stats.live ? stats.live.rank : undefined,
              live_percent: stats.live ? stats.live.livePercent : undefined,
              total_count: stats.total.counts,
              total_rank: stats.total.rank,
            };
            this.data.push(row);
            this.loading = false;
          });
        })
        .catch(((error) => {
          console.log(error);
          this.loading = false;
        }));
    },
    onSort(field: string, order: string) {
      this.page = 1;
      this.sortColumn = ({
        total_count: "TotalCounts",
        live_count: "LiveCounts",
        live_percent: "LivePercent",
        first_edit: "FirstEdit",
        last_edit: "LastEdit",
      } as any)[field];
      this.sortOrder = ({ asc: "Ascending", desc: "Descending" } as any)[order];
      this.loadAsyncData();
    },
  },
  mounted() {
    this.loadAsyncData();
  },
  computed: {
  },
});
</script>

<style>
  #tagtable {
    padding: 0 50px;
  }
  #search-form {
    padding: 50px 0;
  }
</style>
