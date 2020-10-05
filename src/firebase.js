import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

var firebaseConfig = {
    apiKey: "AIzaSyB-6t0yH2fA-lCq_DhO22dCYRURqsf-XY4",
    authDomain: "bancotokenlab.firebaseapp.com",
    databaseURL: "https://bancotokenlab.firebaseio.com",
    projectId: "bancotokenlab",
    storageBucket: "bancotokenlab.appspot.com",
    messagingSenderId: "980100931612",
    appId: "1:980100931612:web:99b7183994af1bbd3abfd9",
    measurementId: "G-DX0V3NKGSJ"
  };
  // Initialize Firebase
  class Firebase{
      constructor(){
        app.initializeApp(firebaseConfig);
        this.auth = app.auth();
        this.db = app.firestore();
      }

      login(email,password){
          return this.auth.signInWithEmailAndPassword(email,password)
      }

      logout(){
          return this.auth.signOut()
      }

      async register(name,email, password){
          console.log(name, email, password)
          await this.auth.createUserWithEmailAndPassword(email,password)
          return this.auth.currentUser.updateProfile({
              displayName: name
          })
      }

      isInitialized(){
          return new Promise(resolve =>{
              this.auth.onAuthStateChanged(resolve)
          })
      }
      getCurrentUsername(){
          return this.auth.currentUser && this.auth.currentUser.displayName
      }
      isLogged(){
          return this.auth.currentUser ? (true): (false); 
      }
      //adiciona no firebase   
      async sendEventInformation(describe,startDate,endMonth,endDay,endYear,startTime,endTime,MonthDays) {
            let userId = this.auth.currentUser.uid;

            // separando string em mes, dia e ano
            let dateString = startDate.toString().split(" ");
            // posicao 1 - mes, posicao 2- dia, posicao 3- ano
            let startMonth = dateString[1];
            let startDay = dateString[2];
            let startYear = dateString[3];

            // let MonthNumber = 0;
            let i = 0;
            // transforma o nome do mes de inicio em numero.
            for(i=0; i<=11; i++){
                if (MonthDays[i] === startMonth) startMonth = i;
            }
            startMonth= startMonth.toString();

            await this.db.collection('users').doc(userId).collection('events').add({
                description: describe,
                startMonth: startMonth,
                startDay:startDay,
                startYear:startYear,
                endMonth:endMonth,
                endDay:endDay,
                endYear:endYear,
                startTime: startTime,
                endTime: endTime
            })
      }
      //pega informacao do firebase
      async getEventInformation(){
          let userId = this.auth.currentUser.uid; 

          const querySnapshot = await this.db.collection('users')
          .doc(userId)
          .collection('events')
          .get();
          return querySnapshot.docs.map(function(doc){
              return {...doc.data(),id:doc.id};
          })
      }
      //remove informacao do firebase
      async removeEventInformation(event){
          let userId = this.auth.currentUser.uid;

          try{
              const querySnapshot=await this.db.collection('users')
              .doc(userId)
              .collection('events')
              .doc(event.id)
              .delete()
              return "Evento removido com sucesso!";
          }
          catch(error){
              return "Houve um erro na exclusao do evento:" + error;
          }
      }
      //atualiza informacao do firebase:
      async updateEventInformation(event,eventDescriptionEdit,eventStartEdit,eventEndEdit){
          let userId=this.auth.currentUser.uid;
          try{
              const querySnapshot = await this.db.collection('users')
              .doc(userId)
              .collection('events')
              .doc(event.id)

              return querySnapshot.update({
                description: eventDescriptionEdit,
                startTime: eventStartEdit,
                endTime: eventEndEdit
              })
          }
          catch(error){
            return "Houve um erro na edicao do evento:" + error;
        }
      }

  }

  export default new Firebase()