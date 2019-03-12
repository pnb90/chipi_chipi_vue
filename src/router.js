import Vue from 'vue'
import Router from 'vue-router'
import ListsIndex from './views/ListsIndex.vue'
import ListsShow from './views/ListsShow.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/', name: 'lists-index', component: ListsIndex },
    { path: '/lists', name: 'lists-index', component: ListsIndex },
    { path: "/lists/:id", name: "lists-show", component: ListsShow }
  ]
})
