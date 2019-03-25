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
            <th class="text-center" scope="col" v-on:click="setSortAttribute('store')">Store</th>
            <th class="text-center" scope="col" v-on:click="setSortAttribute('price')">Price Per Unit</th>
            <!-- <th class="text-center" scope="col">Total Price</th> -->
            <th class="text-center" scope="col">Got it!</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in list.products">
            <td class="text-center align-middle"> {{ product.name }} </td>
            <td class="text-center align-middle">
              <div v-for="list_product in product.list_products">
                <div v-if="list_product.list_id = $route.params.id">  
                  {{ list_product.quantity }}
                </div>
                <div v-else>
                  <p class="col-2"> 
                  Not Available in Selected Stores
                  </p>
                </div>
              </div>
            </td>

            <td class="text-center align-middle">
              <div v-for="list_product in product.list_products">
                <div v-if="list_product.list_id = $route.params.id">  
                  {{ list_product.description}}
                </div>
              </div>
            </td>

            <td class="text-center align-middle">
              <div class="store_name" v-for="inventory in  product.inventories">
                {{inventory.store.name}}  
              </div>
            </td>

            <td>
              <div class="price text-center align-middle" v-for="inventory in product.inventories">
                {{inventory.price}}
              </div>
            </td>

      <!--       <td>
              <div class="price text-center align-middle" v-for="inventory in product.inventories">
                ({{inventory.price}} * {{list_product.quantity}})
              </div>
            </td>
 -->
            <td class="btn-sm btn-danger text-center align-middle" v-on:click="destroyListProduct(product.list_products)"> 
                Remove Item 
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Start ListProduct Modal -->
      <div>
        <modal v-if="showModal">
          <h3 slot="header" class="modal-title">
            Add Product
          </h3>
          <div slot="body" class="text-center">
            <ul>
              <li v-for="error in errors">{{ error }}</li>
            </ul>
            <form v-on:submit.prevent="closeModal(); submit()">
              <p>Product Name: <input v-model="newListProductProductName" list="productNames"></p>
              <datalist id="productNames">
                <option v-for="product in products">{{ product.name }}</option>
              </datalist>
              <p>Quantity: <input v-model="newListProductQuantity"></p>
              <p>Description: <input v-model="newListProductDescription"></p>
            </form>
          </div>
          <div slot="footer" class="mt-3">
           <button type="button" class="btn btn-outline-info mr-1" @click="closeModal()"> Close </button>
           <button type="button" class="btn btn-primary ml-1" data-dismiss="modal" @click="closeModal(); submit();">
             Submit
           </button>
          </div>
        </modal>
        <button class="btn btn-success" @click="openModal()"> Add New Product </button>
      </div>
      <!-- End ListProduct Modal -->


      <!-- Start Quagga Modal -->
      <div>
        <modal v-if="showModal">
          <h3 slot="header" class="modal-title">
            Create New Product
          </h3>
          <div slot="body" class="text-center">
            <ul>
              <li v-for="error in errors">{{   error }}</li>
            </ul>
            <form v-on:submit.prevent=" submitQuagga()">
              <div>
                Name: <input v-model="  newProductName">
              </div>
              <div >
                Store: <input v-model=" newProductStore" list="storeNames">
                <datalist id="storeNames">
                  <option v-for="store in stores" >{{ store.name }} </option>
                </datalist>
              </div>
              <div>
                Weight (in oz): <input v-model  ="newProductWeight">
              </div>
              <div>
                Price: <input v-model=" newProductPrice">  
              </div>
              <div>
                UPC: <input v-model=" newDisplayBarcode">
              </div>
            </form>
          </div>
          <div slot="footer" class="mt-3">
            <button id="barcode-scanner" class="btn btn-outline-info mr-1" v-on:click="runQuagga()"> Barcode Scanner </button>
            <button type="button" class="btn btn-outline-info ml-1 mr-1" @click="closeModal()"> Close </button>
            <button type="button" class="btn btn-primary ml-1" data-dismiss="modal" @click="closeModal(); submitQuagga();">
             Submit
           </button>
          </div>
        </modal>
        <button class="btn btn-success" @click="openModal()"> Create New Product </button>
      </div>
      <!-- End Quagga Modal -->
    </div>
  </div>
</template>

<style>
#barcode-scanner canvas.drawingBuffer, #barcode-scanner video.drawingBuffer {
  display: none;
}

#barcode-scanner canvas, #barcode-scanner video {
  width: 100%;
  height: auto;
}
</style>

<script>
  var axios = require("axios");
  import Vue2Filters from "vue2-filters";
  import Modal from '../components/Modal.vue';
  import Quagga from "quagga";



  export default {
    components: {
      Modal
    },

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
        errors: [],
        list_products: [],
        products: [],
        sortAttribute: "",
        newListProductProductName: "",
        newListProductQuantity: "",
        newListProductDescription: "",
        showModal: false,
        newDisplayBarcode: "",
        newProductName: "",
        newProductWeight: "",
        newProductStore: "",
        newProductPrice: "",
        newProductID: "",
        storeID: "",
        stores: []
      };
    },

    created: function() {
      axios.get("/api/lists/" + this.$route.params.id )
        .then(response => {
          this.list = response.data;
        })
        .catch(error => {
          this.$router.push("/login")
        });

      axios.get("/api/products/" )
        .then(response => {
          this.products = response.data;
        });

      axios.get("/api/stores")
        .then(response => {
        this.stores = response.data;
        });
      },

    methods: {
      openModal: function() {
        this.showModal = true;
      },

      closeModal: function() {
        this.showModal = false;
      },

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
                      product_name: this.newListProductProductName,
                      quantity: this.newListProductQuantity,
                      description: this.newListProductDescription
        };
        axios.post("/api/list_products", params)
          .catch(error => {
            this.errors = error.response.data.errors})
          .then(response => {
            console.log(response.data);
            // this.list.products.push(response.data);
          axios.get("/api/lists/" + this.$route.params.id )
            .then(response => {
              this.list = response.data;
              this.newListProductProductName = "",
              this.newListProductQuantity = "";
              this.newListProductDescription = "";
            });
          })
          .catch(error => {
            this.errors = error.response.data.errors;
          });
      },

      setSortAttribute: function(inputAttribute) {
        if (this.sortAttribute === inputAttribute) {
          this.sortOrder *= -1;
        } else {
        this.sortAttribute = inputAttribute;
        this.sortOrder = 1;
        }
      },

      // QUAGGA STUFF
      runQuagga: function() {
        // starts the webcam
        Quagga.init({
          inputStream : {
            name : "Live",
            type : "LiveStream",
            numOfWorkers: navigator.hardwareConcurrency,
            target: document.querySelector('#barcode-scanner')  
          },
          decoder: {
              readers : ['upc_reader', 'upc_e_reader', 'ean_reader', 'ean_8_reader']
          }
        },function(err) {
            if (err) { console.log(err); return }
            Quagga.initialized = true;
            Quagga.start();
        })
        var newBarcode = "";

        // starts the scanning functionality
        if ('#barcode-scanner'.length > 0 && navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
          var barcodeArray = [];
          if (Quagga.initialized == undefined) {
            Quagga.onDetected(function(result) {
            var barcode = result.codeResult.code;        
            barcodeArray.push(barcode);

        // Once there are 20 scans, finds the mode
          if(barcodeArray.length > 20) {
            var mode = {};
            var max = 0;
            var count = 0;

            barcodeArray.forEach(e => {
              if (mode[e]) { mode[e]++; }
              else { mode[e] = 1; }

              if (count<mode[e]) { 
                  max = e;
                  count = mode[e];
              }
            });
              this.newDisplayBarcode = max;          
            // closes the webcam
            Quagga.stop();
            return;
            };
            }.bind(this));
          }    
        }
      },

      submitQuagga: function() {
        var productParams = {
                      name: this.newProductName,
                      weight: this.newProductWeight,
                      upc_code: this.newDisplayBarcode
                      };

        axios.post("/api/products", productParams)
          .catch(error => {
            this.errors = error.response.data.errors;
          }).then(response => {
            this.newProductID = response.data.id 
            axios.post("/api/inventories", {
                                      product_id: this.newProductID,
                                      store_name: this.newProductStore,
                                      price: this.newProductPrice
                                      })
              .catch(error => {
                this.errors = error.response.data.errors;
              }).then(response => {
                console.log(response.data);
                this.newDisplayBarcode = "";
                this.newProductName = "";
                this.newProductWeight = "";
                this.newProductStore = "";
                this.newProductPrice = "";
              })
          });
      },

      stopQuagga: function() {
        Quagga.stop();
      }
    },
    mixins: [Vue2Filters.mixin]
  }
</script>