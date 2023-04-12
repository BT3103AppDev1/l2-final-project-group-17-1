<template>

  <nav class="displayFlexRow" v-if="user">

      <img id="trackTripImg" src="src/assets/images/logo3.png">


      <router-link to="/InputPage" class="routerLeftSide">
      <button class = "btn btn-outline-light border-0 btnLeftSide" :class="{ 'btn-active': $route.path === '/InputPage' }">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6" style="width: 20px; height: 20px;">
          <path fill-rule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z" clip-rule="evenodd" />
          <path fill-rule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zM6 12a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V12zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 15a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V15zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 18a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V18zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75z" clip-rule="evenodd" />
        </svg>
        <b style="margin-left: 5px;">Input</b>
      </button>
      </router-link>

      <router-link to="/trips" class="routerLeftSide">
        <button class = "btn btn-outline-light border-0 btnLeftSide" :class="{ 'btn-active': $route.path === '/trips' }">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6" style="width: 20px; height: 20px;">
            <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM8.547 4.505a8.25 8.25 0 1011.672 8.214l-.46-.46a2.252 2.252 0 01-.422-.586l-1.08-2.16a.414.414 0 00-.663-.107.827.827 0 01-.812.21l-1.273-.363a.89.89 0 00-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.211.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 01-1.81 1.025 1.055 1.055 0 01-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.654-.261a2.25 2.25 0 01-1.384-2.46l.007-.042a2.25 2.25 0 01.29-.787l.09-.15a2.25 2.25 0 012.37-1.048l1.178.236a1.125 1.125 0 001.302-.795l.208-.73a1.125 1.125 0 00-.578-1.315l-.665-.332-.091.091a2.25 2.25 0 01-1.591.659h-.18c-.249 0-.487.1-.662.274a.931.931 0 01-1.458-1.137l1.279-2.132z" clip-rule="evenodd" />
          </svg>
          <b style="margin-left: 5px;">Trips</b>
        </button>
      </router-link>



        <button @click="toggleDropdown" class = "rightSide" id = "userCard" >
          <div class="circular-icon mr-2">
            <img src="src/assets/images/snowy.png" alt="Your Image" style="">
          </div>
          <div id="userName">{{ this.displayName }}</div>
          <ul class = "dropdown" v-if="showMenu">
            <router-link to="/Profile">
              <button style="width:100%; color:white; background-color: black;" @click="showMenu = !showMenu;" >Edit Profile</button>
            </router-link>
            <router-link to="/" id = "signoutRouter">
              <button style="width:100%; border-bottom-left-radius: 15px; border-bottom-right-radius: 15px; color:white; background-color: black;"  @click="signOut()">Log Out</button>
            </router-link>
          </ul>
        </button>

        <!-- <ul class = "dropdown" v-if="showMenu">
          <router-link to="/Profile">
            <button style="width:100%; color:white; background-color: black;" @click="showMenu = !showMenu;" >Edit Profile</button>
          </router-link>
          <router-link to="/" id = "signoutRouter">
            <button style="width:100%; border-bottom-left-radius: 20px; border-bottom-right-radius: 20px; color:white; background-color: black;"  @click="signOut()">Log Out</button>
          </router-link>
        </ul> -->


      <!-- <router-link to="/" id = "signoutRouter">
        <button id="signoutBtn" class="btn btn-dark border-0" @click="signOut()" v-if="user">Sign Out</button>
      </router-link> -->

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
            this.getName()
          }
          this.user = user
        })
      document.addEventListener("click", this.closeDropdown);
    },
    methods: {
      toggleDropdown() {
        this.showMenu = !this.showMenu
      },
      closeDropdown(event) {
        if (!this.$el.contains(event.target)) {
          this.showMenu = false;
        }
      },
      signOut: function() {
            const confirmLogout = window.confirm('Are you sure you want to log out?');
            if (confirmLogout) {
              console.log("signing out")
              // const auth = getAuth()
              // const user = auth.currentUser
              // signOut(auth, user)
              // this.$router.push('/')
              // ui.start("#firebaseui-auth-container", uiConfig)
            } else {
              console.log("cancelled log out")
              //window.history.back();
              window.location.href = "/InputPage";
            }
      },
      async getName() {
        const userRef = await getDoc(doc(db, "User", this.userid))
        this.displayName = userRef.data().Name
      },

      }
  }
</script>


<style scoped>

  nav {
    color:rgb(248, 241, 210);
    background-color: rgb(156, 201, 215);
    font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  .displayFlexRow {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
  }

  #trackTripImg {
    margin-left: 20px;
    height: 70px;
  }

  .routerLeftSide {
    margin-left: 30px;
    width: auto;
  }

  .btnLeftSide {
    display: flex;
    flex-direction: row;
    align-items: center;

    background-color: lightblue;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
    color: black;
    font-size: 20px;
    /* text-shadow: 1.5px 1.5px 1.5px lightyellow; */
  }

  .btn:hover {
    transform: scale(1.05); /* increase the size */
    transition: all 0.2s ease-in-out; /* add a smooth transition effect */
    background-color: lightcyan;
  }

  .btn-active {
    background-color: lightcyan;
  }


  #userCard:hover {
    transform: scale(1.03); /* increase the size by 10% */
    transition: all 0.2s ease-in-out; /* add a smooth transition effect */
    background-color: aliceblue;
  }

  #userCard {
    margin-right: 35px;
    margin-left: auto;
    background-color: lightcyan;
    border-radius: 10px;
    padding: 5px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
    min-width: 120px;

    display: flex;
    align-items: center;
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
    height: 20px;
    margin-left: 5px;
    margin-right: 5px;
  }

  .circular-icon {
    width: 37px;
    height: 37px;
    border-radius: 50%;
    background-color: #ddd;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  .circular-icon img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .dropdown {
    position: absolute;
    top: 100%;
    padding: 0;
    margin: 0;
    /* box-shadow: 0 2px 2px black; */
    width: 98%;
    text-align: center;
    left: 50%;
    transform: translateX(-50%);
  }

  .rightSide {
    position: relative;
    display: inline-block;
    margin-left: auto;
  }

</style>
