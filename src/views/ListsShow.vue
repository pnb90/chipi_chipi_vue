<template>
  <div class="lists-show">
    <div class="container">
      <h1 class="text-center">{{ list.name }} </h1>
      <table class="table table-striped">
        <thead class="thead-light">
          <tr>
            <th class="text-center" scope="col">Product</th>
            <th class="text-center" scope="col">Quantity</th>
            <th class="text-center" scope="col">Description</th>
            <th class="text-center" scope="col">Store</th>
            <th class="text-center" scope="col">Price</th>
            <th class="text-center" scope="col">Got it!</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in list.products">
            <td class="text-center"> {{ product.name }} </td>

            <td class="text-center">
              <div v-for="list_product in product.list_products">
                <div v-if="list_product.list_id = $route.params.id">  
                  {{ list_product.quantity }}
                </div>
              </div>
            </td>

            <td class="text-center">
              <div v-for="list_product in product.list_products">
                <div v-if="list_product.list_id = $route.params.id">  
                  {{ list_product.description}}
                </div>
              </div>
            </td>

            <td>
              <div class="store_name" v-for="inventory in product.inventories">
                {{inventory.store.name}}  
              </div>
            </td>

            <td>
              <div class="price" v-for="inventory in product.inventories">
                {{inventory.price}}
              </div>
            </td>

            <td class="btn-sm btn-danger text-center" v-on:click="destroyListProduct(product.list_products)"> 
                Remove Item 
            </td>

          </tr>
        </tbody>
      </table>

      <button class="btn-sm btn-outline-success" type="button" data-toggle="collapse" data-target="#newItem">
      Add Item 
      </button>

      <div class="collapse" id="newItem">
        <form v-on:submit.prevent="submit()">
          <h2>Add Product!</h2>
          <!-- <p>Product Name: <input v-model="newListProductProductName"></p> -->
          <p>Product ID #: <input v-model="newListProductProductId"></p>
          <p>Quantity: <input v-model="newListProductQuantity"></p>
          <p>Description: <input v-model="newListProductDescription"></p>
          <input type="submit" value="Add Item">
        </form>
      </div>
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
        // newListProductProductName: "",
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
          if (hash.list_id === this.$route.params.id) {
            axios.delete("/api/list_products/" + hash.id)
            .then(response => {
              console.log("Successfully deleted list_product", response.data);
              axios.get("/api/lists/" + this.$route.params.id )
              .then(response => {
                this.list = response.data;
              });
            });
          }
        }
      },
      submit: function() {
        var params = {
                      list_id: this.list.id,
                      // product_name: this.newListProductProductName,
                      product_id: this.newListProductProductId,
                      quantity: this.newListProductQuantity,
                      description: this.newListProductDescription
        };
        axios.post("/api/list_products", params)
          .then(response => {
            console.log(response.data);
            this.list.products.push(response.data);
            axios.get("/api/lists/" + this.$route.params.id )
            .then(response => {
              this.list = response.data;
              this.newListProductProductId = "";
              this.newListProductQuantity = "";
              this.newListProductDescription = "";
            });
          })
          .catch(error => {
            this.errors = error.response.data.errors;
          });
      }
    }
  }
</script>