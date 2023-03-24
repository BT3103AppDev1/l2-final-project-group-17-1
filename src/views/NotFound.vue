<template>
    <div style="text-align:center;" v-if="user">
        <h3>Page Not Found!!</h3>
        <h4>Please click on the above available options</h4>
    </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Logout from '@/components/Logout.vue'
import {getAuth, onAuthStateChanged} from "firebase/auth"

export default {
    name:"NotFound",
    components: {
        Navbar,
        Logout
    },
    data() {
        return {
            user:false,
        }
    },
    mounted() {
        const auth = getAuth() 
        onAuthStateChanged(auth, (user)=> {
            if (user) {
                this.user = user
            }
        })
    }
}
</script>
