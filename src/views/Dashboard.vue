<template style="">
    <div class = "page">
        <!-- <TripHeader ref="header"/> -->
        <div class="d-flex justify-content-between">
                <!-- TripName -->
                <div class="text-center py-5" style= "width: 40rem;">
                    <div id="tripName" class="card-body px-3" style="text-align:justify; padding:5px; margin-left:35px;">
                        <img src="src/assets/images/globe.png" style="float:left;" width="120">
                        <h1>Trip to {{tripName}}</h1>
                        <span style="font-family:monospace;">{{startDate}} - {{endDate}}</span>
                    </div>
                </div>

                <div class="d-flex justify-content-end p-5">
                    <input type="checkbox" id="switch" class="inputbtn" @click="redirectToGroup()" /><label for="switch" class="labelbtn"><h1>{{label}}</h1></label>
                </div>
        </div>
        <div v-if = "toggle">
            <PersonalPage :tripCode="tripCode" :tripName="tripName" :currency="currency" :startDate="startDate" :endDate="endDate"/>
        </div>
        <div v-else>
            <GroupPage :tripCode="tripCode" :tripName="tripName" :currency="currency" :startDate="startDate" :endDate="endDate"/>
        </div>
        <!-- <div id = "personal" style="width:500px; margin-right: 5%;"><PersonalPage v-on:update="refresh"/> </div>
        <div id = "group" style="width:500px; margin-left: 5%;"><GroupPage v-on:update="refresh"/> </div> -->
    </div>
    </template>

    <script>
        import db from '../firebase.js';
        import PersonalPage  from '@/components/PersonalPage.vue'
        import GroupPage  from '@/components/GroupPage.vue'
        import Navbar from '@/components/Navbar.vue'
        import firebaseApp from '@/firebase.js'
        import {getAuth, onAuthStateChanged} from 'firebase/auth'
        import { arrayRemove, collection, doc, getDoc, getDocs, query, where, deleteDoc, updateDoc} from "firebase/firestore";
        import moment from 'moment'

        export default {
        name: "Dashboard",

        data() {
            return {
                tripCode: this.$route.query.tripCode,
                tripName: this.$route.query.tripName,
                currency: this.$route.query.currency,
                toggle: true,
                startDate: "",
                endDate: "",
            }
        },
        components:{
            PersonalPage,
            GroupPage
        },

        computed: {
            label() {
                return this.toggle ? 'Personal' : 'Group'
            }
        },

        mounted() {
            const auth = getAuth()
            onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user = user
                this.userid = user.uid
                this.name = user.Name
            } else { //redirect to login page if not logged in
                this.$router.push('/')
            }
            })
        },

        created() {
            this.getStartDate(),
            this.getEndDate()
        },

        methods: {
            refresh() {
                // const tripsTable = this.$refs.table;
                // tripsTable.refresh();
            },
            redirectToGroup() {
                this.toggle = !this.toggle
                // this.$router.push({name:'GroupPage', query:{
                //     tripCode: this.tripCode, tripName: this.tripName, currency: this.currency}})
            },
            async getStartDate() {
                let trip = await getDoc(doc(db, "Trip", this.tripCode))
                this.startDate = moment(trip.data().Start_Date).format('DD/MM/YYYY')
            },
            async getEndDate() {
                let trip = await getDoc(doc(db, "Trip", this.tripCode))
                this.endDate = moment(trip.data().End_Date).format('DD/MM/YYYY')
            }
        }
        }
    </script>

    <style scoped>
        .page {
            background-color: floralwhite;
            font-family: 'Roboto', sans-serif;
        }

        .inputbtn[type=checkbox]{
                height: 0;
                width: 0;
                visibility: hidden;
        }

        .labelbtn {
            cursor: pointer;
            /* text-indent: -9999px; */
            width: 200px;
            height: 80px;
            background: #a5ca2a;
            display: block;
            border-radius: 100px;
            position: relative;
            margin-left: 5px;
            margin-top: 10px;
        }

        .labelbtn h1 {
            position: absolute;
            top: 40%;
            left: 27.5%;
            transform: translate(-50%, -50%);
            z-index: 1;
            font-size:22px;
            color: white;
        }

        .labelbtn:after {
            content: '';
            position: absolute;
            top: 5px;
            left: 105px;
            width: 90px;
            height: 70px;
            background: #fff;
            border-radius: 90px;
            transition: 0.5s;
            color: black;
        }

        .inputbtn:checked + .labelbtn{
            background: grey;
            cursor: pointer;
            /* text-indent: -9999px; */
            width: 200px;
            height: 80px;
            background: rgb(159, 82, 159);
            display: block;
            border-radius: 100px;
            position: relative;
            color: black;
        }

        .inputbtn:checked + .labelbtn h1{
            color: white;
            left: 72%;
            font-size:23px;
        }

        .inputbtn:checked + .labelbtn:after {
            left: calc(100% - 105px);
            transform: translateX(-100%);
        }

        .labelbtn:active:after {
            width: 130px;
        }

    </style>
