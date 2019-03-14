<template>
  <div class="lists-show">
    <h1>{{ list.name }} </h1>

    <div v-for="product in list.products">
      <p>{{ product.name }}</p>
      <p>{{ product.list_products }}</p>
      <button class="btn-sm btn-danger" v-on:click="destroyListProduct(product)"> Remove Item </button>
       <div v-for="inventory in product.inventories">

        <!-- in_stock returns an array, so always truthy unless as in no inventories whatsoever -->
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
        <!-- need to retrieve quantity and description via list_products -->
        <p>Quantity: {{  }}</p>
        <p>Description: {{ product.description }}</p>
        <br>

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


<!--   <div v-for="product in list_products">
    {{product}}
  </div> -->


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

      destroyListProduct: function(Product) {
        axios.delete("/api/list_products/" + product.id)
        .then(response => {
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