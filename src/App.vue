<template>
  <div id="app">
    <!-- ======== @Region: #header ======== -->
    <div id="header" class="bg-dark overlay overlay-gradient-flip overlay-op-3" data-bg-img="/public/fresh_produce.jpeg" data-css='{"background-position": "center center"}'>
      <div class="header bg-transparent p-3 px-lg-5 py-lg-6 text-center text-lg-right">
        <!--branding/logo -->
        <div class="header-brand">
          <hr class="hr-primary hr-lg mr-0 w-20 mt-0 mb-2 d-none d-lg-block" />
          <router-link class="header-brand-text text-center text-lg-right text-white text-letter-spacing-sm text-alt" title="Home" to="/">
            <h1 class="font-weight-bold">
              Chipi-Chipi
            </h1>
          </router-link>

          <h4 class="header-slogan d-none d-lg-block text-white font-weight-light mt-2">
            Groceries - cheap.
          </h4>
        </div>
        <hr class="hr-light op-2 d-none d-lg-block my-3 w-80 mr-0" />
        <!-- nav links -->
        <div class="text-white text-sm"> 
          <router-link to="/signup" class="text-white op-7">Sign Up</router-link> 
            <span class="text-white op-7 mx-1">-</span> 
          <router-link to="/login" class="text-white op-7">Login</router-link> 
            <span class="text-white op-7 mx-1">-</span> 
          <router-link to="/logout" class="text-white op-7">Logout</router-link>
        </div>
      </div>
    </div>
    <router-view/>
    <!-- Footer -->
    <!-- The .footer-fixed class makes the footer fixed to the bottom left/right when the header is fixed, removed this class to make it show inline after the content -->

    <!-- ======== @Region: #footer ======== -->
    <footer id="footer" class="footer-fixed p-3 px-lg-5 py-lg-6 text-center text-lg-right">
      <a href="#" title="Twitter" class="text-white op-8"><i class="fab fa-twitter-square icon-1x"></i></a>
      <a href="#" title="Facebook" class="text-white op-8"><i class="fab fa-facebook-square icon-1x"></i></a>
      <hr class="hr-light op-2 my-2 w-80 mr-md-0" />
    </footer>
  </div>
</template>

<style>
</style>
