<template>
    <h1 style="align-items: center;">Welcome to TrackTrip!</h1>
    <div id = "firebaseui-auth-container"></div>
    <div class="register">
        <h1 style="align-items: center;">Register</h1>
        <form @submit.prevent="Register">
            <input type="text" placeholder ="Name" v-model="name"/>
            <input type="text" placeholder ="Email" v-model="email"/>
            <input type="password" placeholder ="Password" v-model="password"/>
            <input type="submit" value="Register"/>
            <p>Have an account? <router-link to="/">Login Here</router-link></p>
        </form>
    </div>
</template>

<script>
 import firebaseApp from '@/firebase.js'
 import {getAuth, onAuthStateChanged} from 'firebase/auth'
 import firebase from '@/uifire.js'
 import 'firebase/compat/auth'
 import * as firebaseui from 'firebaseui'
 import 'firebaseui/dist/firebaseui.css'
 import {ref} from 'vue';

 export default {
    setup() {
        const name = ref("")
        const email = ref("")
        const password = ref("")
        const Register = () => {
            firebase
            .auth()
            .createUserWithEmailAndPassword(email.value, password.value)
            .then(user => {
                alert(user)
            })
            .catch(err => alert(err.message))
        }
        return {
            Register,
            name,
            email,
            password
        }
    }
 }

// const validatePassword = () => {
//   let isValid = true
//   if (password !== '' && confirmPassword !== ''){
//     if (password !== confirmPassword) {
//       isValid = false
//       setError('Passwords does not match')
//     }
//   }
//   return isValid
// }
</script>
