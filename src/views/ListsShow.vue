<template>
  <div class="lists-show">
    <h1>{{ list.name }} </h1>
    <div v-for="product in list.products">
        <p>{{ product.name }}</p>
        <div v-for="store in product.store">
          <p>${{ store.inventory.price }} at {{ store.name }} </p>
        </div>
    </div>
<!--   <button v-on:click="destroylist()"> Delete </button> -->
  <form v-on:submit.prevent="submit()">
    <h2>Add Product!</h2>
<!--     <div v-for="list_product in list_products">
      <p>{{list_product}}</p>
    </div> -->
    <p>Product ID #: <input v-model="newListProductProductId"></p>
    <p>List ID #: <input v-model="list.id"></p>
    <p>Quantity: <input v-model="newListProductQuantity"></p>
    <p>Description: <input v-model="newListProductDescription"></p>
    <input type="submit" value="Add Item">
  </form>
  </div>
</template>

<style>
</style>

<script>
  var axios = require("axios");

  export default {
    data: function() {
      return {
        list: {
              id: "",
              user_id: "",
              store_id: "",
              name: ""
        },

        list_products: [],

        list_product: {
                      id: "",
                      product_id: "",
                      quantity: "",
                      description: ""
        },

        newListProductProductId: "",
        newListProductQuantity: "",
        newListProductDescription: "",
      };
    },
    created: function() {
      axios.get( "/api/lists/" + this.$route.params.id )
      .then( response => {
        this.list = response.data;
      });

      axios.get( "/api/list_products" )
      .then ( response => {
        this.list_products = response.data;
      });

      axios.get( "/api/list_products" )
      .then ( response => {
        this.list_products = response.data;
      });
    },
    methods: {
      destroylist: function() {
        axios.delete("/api/lists/" + this.list.id)
        .then(response => {
          console.log("Successfully deleted list", response.data);
        this.$router.push("/");
        });
      },

      submit: function() {
        var params = {
                      list_id: this.list.id,
                      product_id: this.newListProductProductId,
                      quantity: this.newListProductQuantity,
                      description: this.newListProductDescription
        };

        axios.post("/api/list_products/", params)
          .then(response => {
            this.$router.push("/lists/" + this.list.id);
          })
          .catch(error => {
            this.errors = error.response.data.errors;
          })
      }
    }
  }
</script>