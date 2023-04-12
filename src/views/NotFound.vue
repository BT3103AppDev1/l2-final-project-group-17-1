<template>
    <div style="text-align:center; margin-top: 10%;">
        <h3>Page Not Found!!</h3>
        <p>Sorry, the page you are looking for does not exist.</p>
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
