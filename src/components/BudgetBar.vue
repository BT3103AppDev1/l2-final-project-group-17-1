<template>
    
</template>

<script>
    import db from '../firebase.js';
    import { collection, doc, getDocs, addDoc, updateDoc, arrayUnion, Timestamp, deleteDoc, getFirestore } from "firebase/firestore";
    import {getAuth, onAuthStateChanged} from 'firebase/auth'

    export default {
        name: 'BudgetBar',
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
            
        }
    }
</script>