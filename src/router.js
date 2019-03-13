import Vue from 'vue';
import Router from 'vue-router';
import ListsIndex from './views/ListsIndex.vue';
import ListsShow from './views/ListsShow.vue';
import Signup from './views/Signup.vue';
import Login from "./views/Login.vue";
import Logout from "./views/Logout.vue";

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/', name: 'lists-index', component: ListsIndex },
    { path: '/lists', name: 'lists-index', component: ListsIndex },
    { path: "/lists/:id", name: "lists-show", component: ListsShow },
    { path: "/signup", name: "signup", component: Signup },
    { path: "/login", name: "login", component: Login },
    { path: "/logout", name: "logout", component: Logout }
  ]
})
