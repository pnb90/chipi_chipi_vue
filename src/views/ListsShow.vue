<template>
  <div class="lists-show">
    <h1>{{ list.name }} </h1>
    <div v-for="(product, index) in list.products">
      <!-- <h5> {{product}} </h5> -->
      <h3>{{ product.name }}</h3>
      <button class="btn-sm btn-danger" v-on:click="destroyListProduct(product.list_products)"> 
      Remove Item 
      </button>
    </div>
    
    <!-- What I need to get: the list product id via the product  -->

    <button class="btn-sm btn-outline-success" type="button" data-toggle="collapse" data-target="#newItem">
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
                            inventories: [
                                          {
                                            store: {
                                            }
                                          }
                                          ]
                          }
                        ]
        },
        list_products: [],
        newListProductProductId: "",
        newListProductQuantity: "",
        newListProductDescription: "",
      };
    },

    created: function() {
      axios.get("/api/lists/" + this.$route.params.id )
      .then(response => {
        this.list = response.data;
      });
    },

    methods: {
      destroyListProduct: function(list) {
        for (var i = 0; i < list.length; i++) {
          var hash = list[i]
          if (hash.list_id === parseInt(this.$route.params.id)) {
            axios.delete("/api/list_products/" + hash.id)
            .then(response => {
              // var listProductIndex = this.listProducts.indexOf()
              this.$router.push("/lists/" + this.list.id)
            })
          }
        }
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
            console.log(response.data);
            this.list.products.push(response.data);
            this.list.forceUpdate();
          })
          .catch(error => {
            this.errors = error.response.data.errors;
          });
      }
    }
  }
</script>