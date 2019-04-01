<template>
  <div class="lists-show">
    <div class="container">
      <h2 id=listName class="text-center text-muted mb-2" >{{ list.name }} </h2>
      <div v-if="list.products.length > 0 ">
        <table class="table table-hover">
          <thead id="thead">
            <tr>
              <th class="text-center" scope="col" v-on:click="setSortAttribute('product')">Product</th>
              <th class="text-center" scope="col" v-on:click="setSortAttribute('quantity')">Quantity</th>
              <th class="text-center" scope="col">Description</th>
              <th class="text-center" scope="col" v-on:click="setSortAttribute('store')">Store</th>
              <th class="text-center" scope="col" v-on:click="setSortAttribute('price')">Price</th>
              <th class="text-center" scope="col" v-on:click="setSortAttribute('totalPrice')">Total</th>
              <th class="text-center" scope="col"></th>
            </tr>
          </thead>
          <tbody id="tbody">
            <tr v-for="product in list.products">

              <td class="text-center align-middle column-product"> {{ product.name }} </td>


              <td @click="editItem(list_product)"  class="text-center align-middle column-quantity">
                <div v-for="list_product in product.list_products">
                  <div v-if="list_product.list_id = $route.params.id">  
                    {{ list_product.quantity }}
                  </div>
                </div>
              </td>

              <td class="text-center align-middle column-description">
                <div v-for="list_product in product.list_products">
                  <div v-if="list_product.list_id = $route.params.id">  
                    {{ list_product.description}}
                  </div>
                </div>
              </td>

              <td class="text-center column-store">
                <div class="store_name text-center " v-for="inventory in  product.inventories">
                  <td>
                    {{inventory.store.name}}
                  </td>
                </div>
              </td>

              <td class="column-price">
                <div class="price text-center align-middle " v-for="inventory in product.inventories" @click="splicePrice(list.products)">
                  <td @click="clickedPrice = inventory.price" >
                     {{inventory.price}} 
                  </td>
                </div>
              </td>

              <td class="column-total">
                <div class="price text-center align-middle " v-for="list_product in product.list_products">
                  <div v-for="inventory in product.inventories" v-if="totalProducts(list_product.quantity, inventory.price)">
                    <td>
                      {{totalProducts(list_product.quantity, inventory.price)}}
                    </td>
                  </div>
                </div>
              </td>

              <td class="btn-lg text-center align-middle" v-on:click="destroyListProduct(product.list_products)">
                  ❌
              </td>
            </tr>
            <!-- <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td class="text-right">Total:</td>
              <td v-if="totalList()"> {{totalList()}}</td>
            </tr> -->
          </tbody>
        </table>
      </div>
      <div id="else" v-else>
        <h3 class="text-center text-muted">Why not add some items?</h3>
      </div>
  
      <!-- Start ListProduct Modal -->
      <div>
        <modal v-if="showModal">
          <h3 slot="header" class="modal-title">
            Add Item
          </h3>
          <div slot="body">
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
      </div>
      <!-- End ListProduct Modal -->


      <!-- Start Quagga Modal -->
      <div>
        <modal v-if="showModal2">
          <h3 slot="header" class="modal-title">
            Create New Item
          </h3>
          <div slot="body">
            <ul>
              <li v-for="error in errors">{{ error }}</li>
            </ul>
            <form class="ml-4" v-on:submit.prevent="closeModal2(); submitQuagga()">
              <div class='mt-2 mb-2'>
                Name: <input id="quaggaInput" class="ml-2 " v-model="newProductName">
              </div>
              <div class='mt-2 mb-2'>
                Store: <input id="quaggaInput" class="ml-2" v-model="newProductStore" list="storeNames">
                <datalist id="storeNames">
                  <option v-for="store in stores" >{{ store.name }} </option>
                </datalist>
              </div>
              <div class='mt-2 mb-2'>
                Weight: <input id="quaggaInput" class="ml-2" v-model="newProductWeight">
              </div>
              <div class='mt-2 mb-2'>
                Price: $<input id="quaggaInput" class="ml-2" v-model=" newProductPrice">  
              </div>
              <div v-if="newDisplayBarcode.length != 0">
                Barcode: <input id="quaggaInput" class="ml-2" v-model="newDisplayBarcode">
              </div>
            </form>
          </div>
          <div slot="footer" class="mt-3">
            <button id="barcode-scanner" class="btn btn-outline-warning mt-2 mr-1" @click="runQuagga()"> Barcode Scanner </button>
            <button type="button" class="btn btn-outline-info mt-2 ml-1 mr-1" @click="closeModal2(); stopQuagga()"> Close </button>
            <button type="button" class="btn btn-outline-primary mt-2 ml-1" data-dismiss="modal" @click="closeModal2(); submitQuagga();">
             Submit
           </button>
          </div>
        </modal>
      </div>
      <!-- End Quagga Modal -->
      <div>
        <div>
          <button class="btn btn-success" @click="openModal()"> Add Item </button>
          <button class="btn btn-outline-success" @click="openModal2()" style="margin-left: 25px"> Create New Item </button>
      </div>
    </div>
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

#thead {
  background-color: #E1DDE7;
}

#tbody {
  background-color: #DDDFE7;
}

#quaggaInput {
  left: 500px;
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
                                            },
                                            price: "",
                                          }
                                          ]
                          }
                        ]
        },
        errors: [],
        list_products: [
        ],
        products: [],
        sortAttribute: "",
        newListProductProductName: "",
        newListProductQuantity: "1",
        newListProductDescription: "",
        showModal: false,
        showModal2: false,
        newDisplayBarcode: "",
        newProductName: "",
        newProductWeight: "",
        newProductStore: "",
        newProductPrice: "",
        newProductID: "",
        storeID: "",
        stores: [],
        productTotals: "",
        listTotals: [],
        clickedPrice: "",
        replacementArray: "",
        patchProduct: "",
        index: ""
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

      openModal2: function() {
        this.showModal2 = true;
      },

      closeModal: function() {
        this.showModal = false;
      },

      closeModal2: function() {
        this.showModal2 = false;
      },

      splicePrice: function(products) {
        self = this
        for (var i = 0; i < products.length; i++) {
          for (var index = 0; index < products[i].inventories.length; index++) {
            if (products[i].inventories[index].price === self.clickedPrice) {
              self.patchProduct = products[i]
              var replacementArray = products[i].inventories.splice(index, index+1)
              self.index = index
            }
          } 
        }
        // console.log(self.index)
        // this.patchPrice(self.patchProduct.list_products[0].id)
      },

      patchPrice: function(listProductID) {
        var params = {index: self.index}
        axios.patch("/api/list_products/" + listProductID, params)
        .then(response => {
          console.log("Successfully removed something, I guess?")
        })
        .catch(errors => {
          console.log(errors)
        });
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
              this.newListProductQuantity = "1";
              this.newListProductDescription = "";
            });
          })
          .catch(error => {
            this.errors = error.response.data.errors;
          });
      },

      editItem: function(item){
        console.log("got into edit!")
        console.log(item)

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
            this.errors = error.response.data.errors;})
          .then(response => {
            this.newProductID = response.data.id 
            axios.post("/api/inventories", {
                                      product_id: this.newProductID,
                                      store_name: this.newProductStore,
                                      price: this.newProductPrice
                                      })
              .catch(error => {
                this.errors = error.response.data.errors;})
              .then(response => {
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
        this.newDisplayBarcode = "";
        this.newProductName = "";
        this.newProductWeight = "";
        this.newProductStore = "";
        this.newProductPrice = "";
      },
      // END QUAGGA STUFF

      totalProducts: function(quantity, price) {
        var regex = /\$/g;
        var floatPrice = parseFloat(price.replace(regex, ''));
        var floatQuantity = parseInt(quantity);
        this.totalList(floatPrice * floatQuantity);
        return "$" + (floatPrice * floatQuantity).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$0.99,');
      },

      totalList: function(total) {
        if (total) {
          if (this.listTotals.length < 10) {
            this.listTotals.push(total)
            // console.log(this.listTotals) 
          }
          // array.push(total)
          // console.log(array)
          // console.log(this.listTotals)
          var sum = 0
          // for(var i = 0; i < array.length; i++) {
          //   console.log(array)
          //   sum += parseInt(array[i]);
          // }
        }
      },

      apiCall: function() {
        console.log("HEY I GOT HERE")
      },

    },
    mixins: [Vue2Filters.mixin]
  }
</script>