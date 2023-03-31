<template>

  <nav id="vue" v-if="user">

      <img class="logo" src="src/assets/images/logo3.png">

      <router-link to="/InputPage" class="routerLeftSide">
      <button class = "btn btn-outline-light border-0 btnLeftSide">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6" style="width: 20px; height: 20px;">
          <path fill-rule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z" clip-rule="evenodd" />
          <path fill-rule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zM6 12a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V12zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 15a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V15zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 18a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V18zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75z" clip-rule="evenodd" />
        </svg>
        <b>Input</b>
      </button>
      </router-link>

      <router-link to="/trips" class="routerLeftSide">
        <button class = "btn btn-outline-light border-0 btnLeftSide" >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6" style="width: 20px; height: 20px;">
            <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM8.547 4.505a8.25 8.25 0 1011.672 8.214l-.46-.46a2.252 2.252 0 01-.422-.586l-1.08-2.16a.414.414 0 00-.663-.107.827.827 0 01-.812.21l-1.273-.363a.89.89 0 00-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.211.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 01-1.81 1.025 1.055 1.055 0 01-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.654-.261a2.25 2.25 0 01-1.384-2.46l.007-.042a2.25 2.25 0 01.29-.787l.09-.15a2.25 2.25 0 012.37-1.048l1.178.236a1.125 1.125 0 001.302-.795l.208-.73a1.125 1.125 0 00-.578-1.315l-.665-.332-.091.091a2.25 2.25 0 01-1.591.659h-.18c-.249 0-.487.1-.662.274a.931.931 0 01-1.458-1.137l1.279-2.132z" clip-rule="evenodd" />
          </svg>
          <b>Trips</b>
        </button>
      </router-link>

      <div class = "rightSide" style="display: inline-block; float: right;  margin-left: auto;">
        <button @click="showMenu = !showMenu" id = "userCard" class="d-flex align-items-center" >
          <div class="circular-icon mr-2">
            <img src="src/assets/images/snowy.png" alt="Your Image">
            <!-- "src/assets/images/plane4.jpg" -->
          </div>
          <div id="userName">{{ this.displayName }}</div>
        </button>
        <ul class = "dropdown" v-if="showMenu">
        <router-link to="/Profile">
          <button style="width:100%; color:white; background-color: black;" @click="showMenu = !showMenu;" >Edit Profile</button>
        </router-link>
        <button style="width:100%; border-bottom-left-radius: 20px; border-bottom-right-radius: 20px; color:white; background-color: black;">Sign Out</button>
        </ul>
      </div>

      <router-link to="/" id = "signoutRouter">
        <button class="btn btn-dark border-0" @click="signOut()" v-if="user">Sign Out</button>
      </router-link>

  </nav>

</template>

<script>
 import firebaseApp from '@/firebase.js'
 import db from '../firebase.js';
 import {getAuth, onAuthStateChanged, signOut} from 'firebase/auth'
 import { collection, doc, getDoc, getDocs, query, where} from "firebase/firestore";


  export default {
    name: 'Navbar',
    components: {

    },
    data() {
      return {
        user:false,
        showMenu: false,
        componentKey: 0,
        displayName: "",
      }
    },
    mounted() {
      const auth = getAuth()
        onAuthStateChanged(auth, (user) => {
          if (user) {
            console.log("logged")
            this.userid = user.uid
          }
          this.user = user
          this.getName()
        })
    },
    methods: {
      signOut: function() {
            console.log("signing out")
            const auth = getAuth()
            const user = auth.currentUser
            signOut(auth, user)
            //this.$router.push('/')
            ui.start("#firebaseui-auth-container", uiConfig)
        },
        async getName() {
          const userRef = await getDoc(doc(db, "User", this.userid))
          this.displayName = userRef.data().Name
        },
  

      
      }
  }
</script>

<style scoped>
  #vue {
    bottom: 0;
    margin-bottom: 0;
  }
  nav {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;

    color:rgb(248, 241, 210);
    background-color: rgb(156, 201, 215);
    font-family: Arial, Helvetica, sans-serif;
    line-height: 50px;
    height: 100%;
    position: relative;
    z-index: 1;
  }


  img {
    margin-left: 20px;
    margin-right: 20px;
    height: 70px;
  }

  #signoutRouter{
    margin-right: 30px;
  }

  .routerLeftSide {
    margin-left: 60px;
    width: auto;
  }

  .btnLeftSide {
    background-color: lightblue;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
    color: black;
    font-size: 20px;
    text-shadow: 4px 4px 6px whitesmoke;
  }

  .btn:hover {
    transform: scale(1.1); /* increase the size by 10% */
    transition: all 0.2s ease-in-out; /* add a smooth transition effect */
    background-color: floralwhite;
  }

  #userCard:hover {
    transform: scale(1.1); /* increase the size by 10% */
    transition: all 0.2s ease-in-out; /* add a smooth transition effect */
    background-color: floralwhite;
  }


  #userCard {
    margin-right: 60px;
    margin-left: auto;
    background-color: aliceblue;
    border-radius: 10px;
    padding: 5px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
    border-radius: 15px;
    border-width: 2px;
    position: relative;
  }

  #userName {
    position: relative;
    display: inline-block;
    color: darkslategrey;
    font-size: 15px;
    text-shadow: 4px 4px 6px whitesmoke;
    display:flex;
    justify-content: center;
    align-items: center;
    height: 10px;
    margin-left: 5px;
    margin-right: 5px;
  }

  .circular-icon {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #ddd;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  .circular-icon img {
    max-width: 100%;
    max-height: 100%;
    object-fit:fill;
  }

  .dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 3;
    list-style: none;
    padding: 0;
    margin: 0;
    background-color:grey;
    /* box-shadow: 0 2px 2px black; */
    width: 68%;
    text-align: center;
    color: white;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
  }

  .rightSide {
    position: relative;
    max-width: 600px;
    /* margin:  auto; */
  }


</style>
