<template>
  <div class="lists-index text-muted">
    <div class="container">

    <h1>Your Grocery Lists</h1>
    <div class="card-deck pt-4 pb-4 pl-2 pr-2" >
      <div class="row" >
        <div class="col-sm-6" v-for="list in lists">
          <div class="card mt-2 mb-2 ">
            <div class="card-body" > 
              <h2 class="text-center">
                  {{ list.name }}
              </h2>
              <div class="text-center">
                <router-link v-bind:to="'/lists/' + list.id">
                  <p class="btn btn-warning mt-2 text-center">Edit</p>
                </router-link>
                <p class="btn btn-danger ml-3 mt-2 text-center" @click="destroyList(list.id)">Delete</p>
              </div>
            </div>
          </div>
        </div>
      </div> 
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
      <button class="btn btn-success mt-3" @click="openModal()"> Add New List </button>
    </div>
    <!-- end modal -->
    </div>
  </div>
</template>

<style>

.card-deck {
  background-color: #CFD0D8;
}

.card-deck .card {
  background-color: #E3E7DD;
}

.card:hover {
  box-shadow: 8px 8px 35px 3px lightgray;
  opacity: 1;
}
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
