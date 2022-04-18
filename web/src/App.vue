<template>
  <div v-if="$auth.ready()" id="app" :class="[minWidthClass, 'bg-light', 'd-flex', 'flex-column']">
    <b-navbar toggleable="md" type="dark" variant="dark" class="w-100">
        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

        <b-navbar-brand href="/">
          <img src="./assets/mlab_logo.png" class="d-inline-block align-top logo">
          TopMat
        </b-navbar-brand>

        <b-collapse is-nav id="nav_collapse">
          <b-navbar-nav>
            <b-nav-item to="/search">Search</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>

      <!-- Main panel -->
      <b-container fluid class="flex-grow-1 px-0 d-flex">
        <!-- <keep-alive :include="['Browse']"> -->
        <keep-alive :include="['Search', 'Browse']">
          <router-view :key="$route.name + (['materials', 'browse'].includes($route.name) ? ($route.params.id || '') : '')"></router-view>
        </keep-alive>
      </b-container>

      <!-- Footer -->
        <b-container fluid class="page-footer text-light px-5 pt-3">
          <b-row>
            <b-col>
              <h5 class="mb-4">Who We Are</h5>
            </b-col>
            <b-col>
              <h5 class="mb-4">Contact Us</h5>
            </b-col>
          </b-row>
        </b-container>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
    }
  },

  computed: {
    minWidthClass () {
      if (this.$route.name === 'home') {
        return 'min-width-1200'
      }
      if (this.$route.name === 'materials') {
        return 'min-width-1200'
      }
      return 'min-width-1200'
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
