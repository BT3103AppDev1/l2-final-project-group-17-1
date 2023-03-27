<template>
    <button id="logoutbtn" @click="signout()" v-if="user">Logout</button>
</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'

export default {
    name: 'Logout',
    data() {
        return {
            user:false,
        }
    },
    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if(user) {
                this.user = user;
            }
        })
    },
    methods: {
        async signOut() {
            const auth = getAuth()
            const user = auth.currentUser
            await signOut(auth, user)
            this.$router.push({name:'Login'})
        }
    }
}
</script>

<style scoped>
#logoutbtn {
    text-align: center;
    margin: auto;
}
#logoutbtn:hover {
    color:rgb(246, 236, 236);
    background-color: orange;
    box-shadow: 3px 3px grey
}
</style>
