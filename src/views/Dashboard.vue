<template>
    <div class = "page">
        <BudgetBar/>
        <PersonalExp/> 
      <!-- <div class = "container">
        <div id = "budget"> <Budget/> </div>
        <div id = "expenses"><PersonalExpenses/> </div>
      </div> -->
    </div>
    </template>
    
    <script>
        import Navbar from '@/components/Navbar.vue'
        import firebaseApp from '@/firebase.js'
        import {getAuth, onAuthStateChanged} from 'firebase/auth'
        
        export default {
        name: "Dashboard",
        components:{
            Navbar,
            BudgetBar,
            PersonalExp
        },
        mounted() {
            const auth = getAuth()
            onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user = user
                this.userid = user.uid
                this.name = user.Name
            }
            })
        }
        }
    </script> 
    
    <style scoped>
    
        .page {
            background-color: floralwhite;
        }
    
    </style>
    