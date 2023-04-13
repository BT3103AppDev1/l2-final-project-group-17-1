<template>
        <div class="justify-content-center" style="background-color: floralwhite;">

          <div class="align-items-center text-center">
            <h1>Join existing Trip!</h1>
            <p>Join a Trip created by your friend!</p>
          </div>


          <div class="container card shadow-2-strong card-body p-5 text-center" style="border-radius: 1rem; background-color: rgb(156, 201, 215);">
            <form>
              <div class="form-outline mb-4">
                <input type="text" id="typeEmail" class="form-control form-control-lg" v-model = "tripCode"/>
                <label class="form-label" for="typeEmail">Trip Code</label>
              </div>

              <div class="form-outline mb-4">
                <input type="number" id="typeEmail" class="form-control form-control-lg" v-model = "budget"/>
                <label class="form-label" for="typeEmail">Budget</label>
              </div>

              <button class="btn btn-lg btn-block shadow text-light" style="background-color: #3d6d9e;" type="submit" v-on:click.prevent="joinTrip">Save</button>
              <!-- style="background-color: #2196F3; -->
            </form>
          </div>

        </div>

</template>

<script>
    import db from '../firebase.js';
    import { collection, doc, getDocs, addDoc, getDoc, updateDoc, arrayUnion, Timestamp, deleteDoc, getFirestore } from "firebase/firestore";
    import {getAuth, onAuthStateChanged} from 'firebase/auth'

    export default {
        name: 'JoinTrip',
        components: {},
        data() {
            return {
            tripCode: "",
            budget: "",
            }
        },

        mounted() {
            const auth = getAuth()
            onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user = user
                this.useremail = auth.currentUser.email
                this.userid = user.uid
                this.name = user.Name
            }
            })
        },

        methods: {
            async joinTrip() {
                console.log(this.tripCode);
                console.log(this.userid)
                let allTrips = await getDocs(collection(db, "Trip"))
                let existingTrips = []
                allTrips.forEach((trip) => {
                    existingTrips.push(trip.id)
                })
                if (!(existingTrips.includes(this.tripCode))) {
                    alert("Trip does not exist! ");
                    this.budget = '';
                    return;
                }
                if (this.budget <= 0 || this.budget == "") {
                    alert("Please enter a valid budget")
                    this.budget = '';
                    return;
                }
                let tripsArray = []
                const userRef = doc(db, 'User', this.userid);
                await getDoc(userRef).then((doc) => {
                    if (doc.exists()) {
                        doc.data().Trips.forEach(trip => {
                            tripsArray.push(trip.Trip_Code) //tripcode
                        })
                    }
                })
                if (!(tripsArray.includes(this.tripCode))) {
                    try {
                        console.log(this.userid)
                        const userRef = await updateDoc(doc(db, "User", this.userid), {
                            Trips: arrayUnion({
                                Trip_Code: this.tripCode,
                                Budget: this.budget})
                        })
                        const tripRef = await updateDoc(doc(db, "Trip", this.tripCode), {
                            Users: arrayUnion(this.userid)
                        })
                        Promise.all([userRef, tripRef]).then(() => {
                            console.log(this.tripCode)
                            this.tripCode = '';
                            this.budget = '';
                        })
                        this.$emit('update')
                    }
                    catch(error) {
                        console.error("Error adding document: ", error);
                    }
                } else {
                    alert("Already joined trip! ");
                    this.tripCode = '';
                    this.budget = '';
                }

            }
        }
    }
</script>

<style scoped>
  input:hover {
    transform: scale(1.015); /* increase the size by 10% */
    transition: all 0.2s ease-in-out; /* add a smooth transition effect */
  }

  button:hover {
    transform: scale(1.05); /* increase the size by 10% */
    transition: all 0.2s ease-in-out; /* add a smooth transition effect */
  }
</style>
