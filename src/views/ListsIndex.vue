<template>
  <div class="lists-index">
    <h1>All Lists</h1>
    <div v-for="list in lists">
      <router-link v-bind:to="'/lists/' + list.id">
        <h2>{{ list.name }}</h2>
      </router-link>
    </div>
  </div>
</template>

<style>
</style>

<script>
var axios = require("axios");

export default {
  data: function() {
    return {
      lists: []
    };
  },
  created: function() {
    axios.get("/api/lists")
      .then(response => {
      this.lists = response.data;
    });
  },
  methods: {}
};
</script>
