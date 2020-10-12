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
  // Inicializa Firebase
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
      //Testa se os eventos coincidem:
      async TestOverlap(startMonth,startDay,startYear,endMonth,endDay,endYear,startTime,endTime,eventList){
        let startDayString= "";
        let endDayString = "";
        if (startMonth<10) startDayString = startYear+"-"+"0"+startMonth+"-"+String(startDay)+"T"+startTime;
        else startDayString = startYear+"-"+startMonth+"-"+String(startDay)+"T"+startTime;
        if (endMonth<10) endDayString = endYear+"-"+"0"+endMonth+"-"+String(endDay)+"T"+endTime;
        else endDayString = endYear+"-"+endMonth+"-"+String(endDay)+"T"+endTime;
          let startDate=Math.round(new Date(startDayString).getTime())
          let endDate=Math.round(new Date(endDayString).getTime())
          console.log(startDate);
          console.log(endDate);
          //time stamp
              eventList.forEach( event=>{ 
                let same = false;
                let startDateOldString="";
                let endDateOldString="";
                if (event.startMonth<10) startDateOldString = event.startYear+"-"+"0"+event.startMonth+"-"+String(event.startDay)+"T"+event.startTime;
                else startDateOldString = event.startYear+"-"+event.startMonth+"-"+String(event.startDay)+"T"+event.startTime;
                if(event.endMonth<10) endDateOldString=event.endYear+"-"+"0"+event.endMonth+"-"+String(event.endDay)+"T"+event.endTime;
                else endDateOldString = event.endYear+"-"+event.endMonth+"-"+String(event.endDay)+"T"+event.endTime;
                let startDateOld=Math.round(new Date(startDateOldString).getTime())
                let endDateOld=Math.round(new Date(endDateOldString).getTime())
                console.log(startDateOld)
                console.log(endDateOld)
                  if (!same) {
                    if ((startDate>endDateOld) || (startDate<startDateOld && endDate < startDateOld))
                        same=true;
                      if (same===false) alert ("your event will coincide with " + event.description + " remove or edit it if you want to")
                  }
              })
      }

      //adiciona no firebase:
      async sendEventInformation(describe,startDate,endMonth,endDay,endYear,startTime,endTime,MonthDays,eventList) {
            let userId = this.auth.currentUser.uid;

            let dateString = startDate.toString().split(" ");
            let startMonth = dateString[1];
            let startDay = dateString[2];
            let startYear = dateString[3];

            let i = 0;
            // transforma o nome do mes em numero.
            for(i=0; i<=11; i++){
                if (MonthDays[i] === startMonth) startMonth = i;
            }
            startMonth= startMonth.toString();

            await this.TestOverlap(startMonth,startDay,startYear,endMonth,endDay,endYear,startTime,endTime,eventList);

            await this.db.collection('users').doc(userId).collection('events').add({
                description: describe,
                startMonth: startMonth,
                startDay:startDay,
                startYear:startYear,
                endMonth:endMonth,
                endDay:endDay,
                endYear:endYear,
                startTime: startTime,
                endTime: endTime,
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
              await this.db.collection('users')
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
      async updateEventInformation(event,eventDescriptionEdit,startMonthEdit,startDayEdit,startYearEdit, endMonthEdit, endDayEdit,endYearEdit,startTimeEdit,endTimeEdit){
          let userId=this.auth.currentUser.uid;
          let eventListAtt = [];
           let eventList = await this.getEventInformation();
            eventList.forEach( allEvent=>{
                if (allEvent.id!==event.id){
                    //TIVE QUE TROCAR, TINHA COLOCADO === AO INVÉS DE !==
                    eventListAtt.push(allEvent);
                }
            })

          this.TestOverlap(startMonthEdit,startDayEdit,startYearEdit,endMonthEdit,endDayEdit,endYearEdit,startTimeEdit,endTimeEdit,eventListAtt);
          try{
              const querySnapshot = await this.db.collection('users')
              .doc(userId)
              .collection('events')
              .doc(event.id)

              return querySnapshot.update({
                description: eventDescriptionEdit,
                startMonth: startMonthEdit,
                startDay:startDayEdit,
                startYear:startYearEdit,
                endMonth:endMonthEdit,
                endDay:endDayEdit,
                endYear:endYearEdit,
                startTime: startTimeEdit,
                endTime: endTimeEdit
              })
          }
          catch(error){
            return "Houve um erro na edicao do evento:" + error;
        }
      }

  }

  export default new Firebase()