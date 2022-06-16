import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/MenuPage.vue"),
  },
  {
    path: "/hospitals",
    name: "hospitals",
    component: () => import("../components/MainForms.vue"),
  },
  {
    path: "/data",
    name: "data",
    component: () => import("../components/DataManagement.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
