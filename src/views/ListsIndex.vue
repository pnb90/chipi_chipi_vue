<template>
  <div class="lists-index">
    <h1>All Lists</h1>
    <div v-for="list in lists">
      <router-link v-bind:to="'/lists/' + list.id">
        <h2>{{ list.name }}</h2>
      </router-link>
        <button class="btn btn-outline-danger" v-on:click="destroyList(list.id, list.name)"> Delete List </button>
    </div>

    <button class="btn btn-outline-success" type="button" data-toggle="collapse" data-target="#newList">
        New List
    </button>

    <div class="collapse" id="newList">
      <h4>New List</h4>
      <ul>
        <li v-for="error in errors">{{ error }}</li>
      </ul>
      <form v-on:submit.prevent="submit()">
        <div>
        Name: <input v-model="newListName">
        </div>
        <input type="submit" value="Submit" name="btn btn-success">
      </form>
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
      lists: [],
      newListName: "",
      errors: []
    };
  },

  created: function() {
    axios.get("/api/lists")
      .then(response => {
      this.lists = response.data;
    });
  },
  
  methods: {
    destroyList: function(listID, listName) {
      axios.delete("/api/lists/" + listID)
      .then(response => {
        console.log("Successfully deleted list", response.data);
        var listIndex = this.lists.indexOf(listName);
        this.lists.splice(listIndex, 1);
      });
      
    },

    submit: function() {
      var params = {
                    name: this.newListName
                    };

      axios.post("/api/lists", params)
        .then(response => {
          this.lists.push(response.data);
        })
        .catch(error => {
          this.errors = error.response.data.errors;
        });
    }
  }
};
</script>
