import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Transitions from "./views/Transitions.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    { path: "/", name: "home", component: Home },
    { path: "/transitions", name: "transitions", component: Transitions },
  ],
});
