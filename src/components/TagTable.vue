<!-- 
  src/components/TagTable.vue 

  This component is based on Buefy example code:
  https://github.com/buefy/buefy/blob/master/docs/pages/components/table/examples/ExAsyncData.vue
-->

<template>
  <div id="tagtable">
    <section class="section">
      <div class="container">
          <h1 class="title">Tag states</h1>
      </div>
    </section>
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
          <b-table-column label="Total rank" width="85" numeric
                          :visible="sortColumn === 'TotalCounts'">
            {{ props.row.total_rank }}
          </b-table-column>

          <!-- Show live rank if we sort by live_count or percent_live -->
          <b-table-column label="Live rank" field="live_rank" width="85" numeric 
                          :visible="sortColumn !== 'TotalCounts'">
            {{ props.row.live_rank }}
          </b-table-column>

          <b-table-column field="tags" label="Categorical tags" width="500">
            <b-taglist>
              <span v-for="[k,v] in props.row.dtags" :key="k">
                <b-taglist attached>
                  <b-tag type="is-info">{{ k }}</b-tag>
                  <b-tag>{{ v }}</b-tag> 
                </b-taglist>
              </span>

              <span v-for="tag in props.row.single_tags" :key="tag">
                <b-tag type="is-primary">{{ tag }}</b-tag>
              </span>
            </b-taglist>
          </b-table-column>

          <b-table-column label="Total count" field="total_count" width="120" numeric sortable>
            {{ props.row.total_count }}
          </b-table-column>

          <b-table-column label="Live count" field="live_count" width="120" numeric sortable>
            {{ props.row.live_count }}
          </b-table-column>

          <b-table-column label="Live percent" field="live_percent" width="20" numeric sortable>
            {{ formatPercent(props.row.live_percent) }}
          </b-table-column>

          <b-table-column label="" width="20" >
            <!--router-link 
              :to="{ name: "tagstate", query: props.row.tag_dict }"
              class="button is-link is-small" 
              tag="button">Open
            </router-link-->
          </b-table-column>
        </template>
      </b-table>
    </section>
  
    <section>
      The tag states listed above only include the follows tags: {{ selectedTags.join(", ") }}.
      These tags are all <b>categorical</b> in the sense that they describe what something is.
      For example, the list does not include any address tags (eg. like
      <a href="https://taginfo.openstreetmap.org/keys/addr%3Ahousenumber#values">addr:housenumber</a>).
      Even if there are over 1M map elements with house number 1, this criterion does
      not define a reasonable category of objects on the OSM like, say,
      map elements with <b>building=greenhouse</b> would do.

    </section>

    <section>
      <div class="columns" id="license-block">
        <div class="column is-one-fifth"/>
        <div class="column" align="lalign" id="license">
          This work is based on data extracted from the 
          <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> (OSM)
          project, © OpenStreetMap contributors. The OpenStreetMap data is available 
          under the 
          Open Database License (ODbL). As a derivative work, the OSM data on this webpage
          is under the same license. The source codes for this analysis are 
          on <a href="https://github.com/tagdynamics-org">github</a>.

          The OSM data was downloaded {{ downloadDate }}.
        </div>
        <div class="column is-one-fifth"/>
      </div>
    </section>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import Buefy from "buefy";
import "buefy/lib/buefy.css";
Vue.use(Buefy);

import axios from "axios";

/** Split input string on first occurence of `split` */
function splitOn(input: string, split: string) {
  const n = input.indexOf(":");
  return [input.substring(0, n), input.substring(n + 1)];
}

function splitTagArray(state: any, selectedTags: string[]): any {
  const tagArray = state.tags;
  const result: any = [];
  tagArray.forEach((tag: string) => {
    // eg. tag = "a:road"
    const [k, v]: string[] = splitOn(tag, ":");
    const i: number = parseInt(k, 16);
    result.push([selectedTags[i], v]);
  });
  return result;
}

interface TableColumns {
  dtags: string[];
  single_tags: string[];

  live_count: number;
  live_rank: number;
  total_count: number;
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
}

export default Vue.extend({
  props: ["name", "initialEnthusiasm"],
  filters: {},

  data(): DataType {
    return {
      data: [],
      perPage: 15,
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
    };
  },
  created() {
    window.addEventListener("keydown", this.onkey);
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.onkey);
  },
  methods: {
    formatPercent(x: any) {
      return x === undefined ? "-" : `${x.toFixed(1)}%`;
    },
    onkey(event: any) {
      if (event.key === "ArrowRight" && this.page < this.totalPages) {
        this.onPageChange(this.page + 1);
      } else if (event.key === "ArrowLeft" && this.page > 1) {
        this.onPageChange(this.page - 1);
      }
    },
    onPageChange(page: any) {
      console.log("onPageChange", page);
      this.page = page;
      this.loadAsyncData();
    },
    loadAsyncData() {
      this.loading = true;
      const params = [
        `sorting=${this.sortColumn}.${this.sortOrder}`,
        `first-index=${(this.page - 1) * this.perPage}`,
        `n=${this.perPage}`].join("&");

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
              dtags: splitTagArray(args[0], this.selectedTags),
              single_tags: (args[0].state === "DEL") ? ["Deleted"] : [],
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
      this.sortColumn = ({
        total_count: "TotalCounts",
        live_count: "LiveCounts",
        live_percent: "LivePercent",
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
  #license-block {
    padding: 20px 0;
  }
  #license {
    font-size: 12px;
    color: #717171;
  }
</style>
