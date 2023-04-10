<template>
  <section>
    <button class="btn btn-lg btn-block shadow text-light" id = "back" style="background-color: maroon" @click="goBack">Back</button>
    <div class="contain">
        <div style="border-radius: 1rem; background-color: rgb(179, 214, 214);">

          <div class="card-body p-5 text-center">
            <form>
            <h3 class="mb-5">Edit Profile</h3>
            <div class="form-outline mb-4">
                <input  id="displayNameInput" type="text" class="form-control form-control-lg" v-model="displayName"/>
                <label class="form-label" for="displayNameInput">Display Name</label>
            </div>
            <button class="btn btn-lg btn-block shadow text-light"  style="background-color: #2196F3;" @click.prevent="saveProfile">Save</button>
            </form>
          </div>

        </div>
    </div>
  </section>
</template>

  <script>
    import db from '../firebase.js';
    import { collection, doc, getDoc, getDocs, addDoc, updateDoc, arrayUnion } from "firebase/firestore";
    import {getAuth, onAuthStateChanged} from 'firebase/auth'

    export default{
     name: 'Profile',
     components: {

     },
     data() {
        return {
            displayName: ""
        }
     },

     mounted() {
        const auth = getAuth()
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    this.user = user
                    this.userid = user.uid
                    this.getName()
                    displayNameInput.value = this.displayName
                    console.log("logged in", this.displayName)
                }
                else { //redirect to login page if not logged in
                  this.$router.push('/')
                }
            })
//
     },
     methods: {
        async saveProfile() {
            if (this.displayName.length >= 1) {
                this.user.displayName = this.displayName
                const userRef = doc(db, "User", this.userid);
                await updateDoc(userRef, {
                Name : this.displayName
                });
                alert("Name Updated Successfully!")
                window.history.back();
                //window.location.href = '/InputPage'
            } else {
                alert("Please enter a valid name!")
            }
        },

        async getName() {
          const userRef = await getDoc(doc(db, "User", this.userid))
          this.displayName = userRef.data().Name
        },
        goBack() {
            window.history.back();
        }
    }
    }

  </script>

  <style>

  section {
    background-color: floralwhite;
    height: 93vh;
    width: 100vw;
  }

  .contain {
      margin-top: 80px;
      display: flex;
      justify-content: center;
      align-items: center;
  }

  #back {
      margin-top: 20px;;
      margin-left: 30px;
      height: 50px;
      width: 90px;
      border-top-left-radius: 200px;
      border-bottom-left-radius: 200px;
      border-top-right-radius: 30px;
      border-bottom-right-radius: 30px;
      text-align: center;
  }
  </style>
