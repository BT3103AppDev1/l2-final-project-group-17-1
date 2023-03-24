<template>
  <div id="logged" v-if="user">
  <nav id="vue">
    <div class = "bar">
      <img class="logo" src="src/assets/images/logo3.png">
      <router-link to="/InputPage"><button class = "btn btn-light" id = "input"><b>Input</b></button></router-link>
      <router-link to="/trips"><button class = "btn btn-light" id = "trips"><b>Trips</b></button></router-link>
      <router-link to="/"><button class="btn btn-dark" id = "signout">Sign Out</button></router-link>
      
    </div>
  </nav>
  </div>
</template>

<script>
 import firebaseApp from '@/firebase.js'
 import {getAuth, onAuthStateChanged} from 'firebase/auth'
  export default {
    name: 'Navbar',
    components: {
    },
    data() {
      return {
        user:false,
      }
    },
    mounted() {
      const auth = getAuth()
        onAuthStateChanged(auth, (user) => {
          if (user) {
            this.user = user
          }
        })
    }
  }
</script>

<style scoped>
  img {
    height: 70px; 
    margin-right: 30px;

  }

  .bar {
    color:rgb(248, 241, 210);
    background-color: rgb(156, 201, 215);
    font-family: Arial, Helvetica, sans-serif;
    line-height: 50px; 
    height: 100%;
    position: relative;
    z-index: 1;
    width: 1500px
  }

  /* .bar a.router-link-exact-active {
    color:aqua;
  } */

  #input {
    color: black;
    width: 130px;
    background-color: rgb(156, 201, 215);
    font-size: 20px;
    text-shadow: 4px 4px 6px whitesmoke;
    border-color: black;
  }

  #trips {
    margin-right: 40px; 
    margin-left: 35px;
    width: 130px;
    font-size: 20px;
    background-color: rgb(156, 201, 215);
    text-shadow: 4px 4px 6px whitesmoke;
    border-color: black;
    color: black;
  }

  #signout{
    margin-left: 720px;
    position: relative;
  }
</style>
