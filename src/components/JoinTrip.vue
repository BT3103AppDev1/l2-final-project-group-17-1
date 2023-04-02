<template>
    <section class="container" style="background-color: floralwhite;">
        <section class="d-flex flex-row container">
        <div class="justify-content-center h-100">

          <div class="align-items-center ">
            <div class="text-center">
            <h1>Join existing Trip!</h1>

            <p>Join a Trip created by your friend!</p>
            </div>
          </div>

          <div class="container">
            <div class="card shadow-2-strong" style="border-radius: 1rem; border-color: #3d6d9e; background-color: rgb(179, 214, 214);">
              <div class="card-body p-4 text-center">
                <form>
                <div class="form-outline mb-4" style="width: 500px">
                  <input type="email" id="typeEmail" class="form-control form-control-lg" v-model = "tripCode"/>
                  <label class="form-label" for="typeEmail">Trip Code</label>
                </div>

                <div class="form-outline mb-4">
                  <input type="email" id="typeEmail" class="form-control form-control-lg" v-model = "budget"/>
                  <label class="form-label" for="typeEmail">Budget</label>
                </div>

                <button class="btn btn-lg btn-block shadow text-light" style="background-color: #3d6d9e;" type="submit" v-on:click="joinTrip">Save</button>
                <!-- style="background-color: #2196F3; -->
                </form>
              </div>
            </div>
          </div>
        </div>
        </section>
    </section>
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
                if (!existingTrips.includes(this.tripCode)) {
                    alert("Trip does not exist! ");
                    this.tripCode = '';
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
                if (!tripsArray.includes(this.tripCode)) {
                    try {
                        const userRef = await updateDoc(doc(db, "User", this.userid), {
                            Trips: arrayUnion({
                                Trip_Code: this.tripCode,
                                Budget: this.budget})
                        })
                        const tripRef = await updateDoc(doc(db, "Trip", this.tripCode), {
                            Users: arrayUnion(this.userid)
                        }) 
                        Promise.all([userRef, tripRef]).then(() => {
                            this.tripCode = '';
                            this.budget = '';
                        })
                    }
                    catch(error) {
                        console.error("Error adding document: ", error);
                    } 
                } else {
                    alert("Already joined trip! ");
                    this.tripCode = '';
                    this.budget = '';
                }
                this.$emit('update')
            }
        }
    }
</script>