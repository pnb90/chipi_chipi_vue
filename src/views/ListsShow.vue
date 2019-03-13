<template>
  <div class="lists-show">
    <h1>{{ list.name }} </h1>
    <div v-for="product in list.products">
      <ul>
        <li>{{ product.name }}</li>
      </ul>
        <span class="btn btn-danger" v-on:click="destroyListProduct()"> Remove Item </span>

       <!-- need to retrieve quantity and description via list_products -->
       <div v-for="inventory in product.inventories">
          <div v-if="inventory.store.in_stock">
            <p> ${{ inventory.price }} at {{ inventory.store.name }} </p>
          </div>
          <div v-else>
            <p> Not in stock :c </p>
          </div>
       </div>

   <!--      <div v-for="list_product in list_products">
          <p> {{list_product.quantity}} </p>
        </div> -->

        <p>Quantity: {{  }}</p>
        <p>Description: {{ product.description }}</p>

        <div v-for="store in product.stores">
           <div v-if="store.in_stock">
            <p>${{ store.inventory.price }} at {{ store.name }} </p>
          </div>
          <div v-else>
            <p>NOT IN STOCK</p>
          </div>
          <br>
        </div>
    </div>
  <button v-on:click="destroyList()"> Delete List </button>

  <button class="btn btn-outline-success" type="button" data-toggle="collapse" data-target="#newItem">
      Add Item
  </button>

  <div class="collapse" id="newItem">
    <h4>New Item</h4>
    <form v-on:submit.prevent="submit()">
      <h2>Add Product!</h2>
      <p>Product ID #: <input v-model="newListProductProductId"></p>
      <p>Quantity: <input v-model="newListProductQuantity"></p>
      <p>Description: <input v-model="newListProductDescription"></p>
      <input type="submit" value="Add Item">
    </form>
  </div>


  <div v-for="product in list_products">
    {{product}}
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
        list: {
              id: "",
              user_id: "",
              store_id: "",
              name: "",
              products: [
                          {
                            stores: [
                                      {}
                                    ]
                          }
                        ]
        },

        list_products: [],

        list_product: { 
                      id: ""
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
    },

    methods: {
      destroyList: function() {
        axios.delete("/api/lists/" + this.list.id)
        .then(response => {
          console.log("Successfully deleted list", response.data);
        this.$router.push("/");
        });
      },

      destroyListProduct: function() {
        axios.delete("/api/list_products/" + this.list_product.id)
        .then(response => {
          console.log("Successfully deleted list_product", response.data);
        this.$router.push("/lists/" + this.list.id);
        });
      },
      submit: function() {
        var params = {
                      list_id: this.list.id,
                      product_id: this.newListProductProductId,
                      quantity: this.newListProductQuantity,
                      description: this.newListProductDescription
        };

        axios.post("/api/list_products", params)
          .then(response => {
            this.list_products.push(response.data);
            // this.$forceUpdate();
          })
          .catch(error => {
            this.errors = error.response.data.errors;
          })
          .then(
            console.log(this))
            // this.$forceUpdate())
      }
    }
  }
</script>