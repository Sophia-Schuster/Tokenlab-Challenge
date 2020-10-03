import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyB7vG4zLvL4ZnMVj5nJmkmuy9YodM-KMyU",
    authDomain: "tokenlabchallenge.firebaseapp.com",
    databaseURL: "https://tokenlabchallenge.firebaseio.com",
    projectId: "tokenlabchallenge",
    storageBucket: "tokenlabchallenge.appspot.com",
    messagingSenderId: "214568610743",
    appId: "1:214568610743:web:d0b2447692756b24a35632",
    measurementId: "G-2K7RNE344Z"
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
      async sendEventInformation(describe, start, end) {
            let userId = this.auth.currentUser.uid;
            await this.db.collection('users').doc(userId).collection('events').add({
                description: describe,
                startTime: start,
                endTime: end
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