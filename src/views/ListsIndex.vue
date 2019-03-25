<template>
  <div class="lists-index">
    <h1>All Lists</h1>
    <div id="lists" v-for="list in lists">
      <router-link v-bind:to="'/lists/' + list.id">
        <h2>{{ list.name }}</h2>
      </router-link>
      <span class="btn btn-outline-danger" @click="destroyList(list.id)"> Delete List </span>
    </div>

    <!-- modal -->
    <div>
      <modal v-if="showModal">
        <h3 slot="header" class="modal-title">
          Add List
        </h3>
        <div slot="body" class="text-center mb-3">
          <ul>
            <li v-for="error in errors">{{ error }}</li>
          </ul>
          <form v-on:submit.prevent="closeModal(); submit()">
            <div>
            Name: <input v-model="newListName">
            </div>
          </form>
        </div>
        <div slot="footer" class="mt-3">
         <button type="button" class="btn btn-outline-info mr-1" @click="closeModal()"> Close </button>
         <button type="button" class="btn btn-primary ml-1" data-dismiss="modal" @click="closeModal(); submit();">
           Submit
         </button>
        </div>
      </modal>
      <button class="btn btn-success" @click="openModal()"> Add New List </button>
    </div>
    <!-- end modal -->

  </div>
</template>

<style>
</style>

<script>
var axios = require("axios");
import Modal from '../components/Modal.vue';


export default {
  components: {
    Modal
  },

  data: function() {
    return {
      lists: [],
      newListName: "",
      errors: [],
      showModal: false
    };
  },

  created: function() {
    axios.get("/api/lists")
      .then(response => {
      this.lists = response.data;
      })
      .catch(error => {
        this.$router.push("/login")
      });
  },
  
  methods: {
    openModal: function() {
      this.showModal = true;
    },

    closeModal: function() {
      this.showModal = false;
    },

    destroyList: function(listID) {
      axios.delete("/api/lists/" + listID)
      .then(response => {
        axios.get("/api/lists")
        .then(response => {
          this.lists = response.data
        });
      });
    },

    submit: function() {
      var params = {
                    name: this.newListName
                    };

      axios.post("/api/lists", params)
        .then(response => {
          this.lists.push(response.data);
          this.newListName = "";
        })
        .catch(error => {
          this.errors = error.response.data.errors;
        });
    }
  }
};
</script>
