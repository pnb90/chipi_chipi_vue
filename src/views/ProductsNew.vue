<template>
  <div class="products-new">
    <div class="container">
      <h1>Add a New Product!</h1>
      <div>
        <ul>
          <li v-for="error in errors">{{ error }}</li>
        </ul>
      </div>
      <form v-on:submit.prevent="submit()">
        <div>
          Name: <input v-model="newProductName">
        </div>
        <div >
          Store: <input v-model="newProductStore" list="names">
          <datalist id="names">
            <option v-for="store in stores" >{{ store.name }}</option>
          </datalist>
        </div>
        <div>
          Weight (in oz): <input v-model="newProductWeight">
        </div>
        <div>
          Price: <input v-model="newProductPrice">  
        </div>
        <div>
          UPC: <input v-model="newDisplayBarcode">
        </div>
        <input type="submit" value="Submit" name="btn btn-success">
      </form>
      <button id="barcode-scanner" v-on:click="runQuagga()"> Barcode Scanner </button>
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
import Quagga from "quagga";
import axios from "axios";

export default {
  data: function() {
    return {
      newDisplayBarcode: "",
      newProductName: "",
      newProductWeight: "",
      newProductStore: "",
      newProductPrice: "",
      newProductID: "",
      storeID: "",
      errors: [],
      stores: []
    };
  },
  
  created: function() {
    axios.get("/api/stores")
      .then(response => {
      this.stores = response.data;
    });
  },

  methods: {
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


    lookUp: function() {
      var upc = this.displayBarcode
              

      // var response = axios.post( "https://api.upcitemdb.com/prod/trial/lookup", upc )
      // console.log(response)

      fetch('https://api.upcitemdb.com/prod/trial/lookup?upc=' + upc)
      .then(response => 
          response.json())
      .then(data => 
            console.log(data));
    },

    submit: function() {
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
  }
}

</script>