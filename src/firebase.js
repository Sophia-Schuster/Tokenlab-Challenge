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

          console.log(eventList);
          let same = false;
          let Day = (parseInt(startDay)+ parseInt(startMonth)+parseInt(startYear))
          let EndDay =(parseInt(endDay)+ parseInt(endMonth)+parseInt(endYear))
          //soma os valores para testar se os dias sao iguais, se eles forem iguais a soma sera a mesma
          let startTimeString = startTime.toString().split(":");
          let endTimeString = endTime.toString().split(":");
          startTime=startTimeString[0]+startTimeString[1];
          endTime=endTimeString[0]+endTimeString[1];
          //transforma o tempo em "algo comparavel"
              eventList.forEach( event=>{ 
                  let DayOld= (parseInt(event.startDay) + parseInt(event.startMonth) + parseInt(event.startYear))
                  let DayEndOld=(parseInt(event.endDay) + parseInt(event.endMonth) + parseInt(event.endYear))
                  let startTimeStringOld = event.startTime.toString().split(":");
                  let endTimeStringOld = event.endTime.toString().split(":");
                  let startTimeOld=startTimeStringOld[0]+startTimeStringOld[1];
                  let endTimeOld=endTimeStringOld[0]+endTimeStringOld[1];
                  if (!same) {
                      if ((parseInt(startDay)<=parseInt(event.startDay)) && (parseInt(endDay)>parseInt(event.startDay))) same = true; else if (parseInt(startDay)<parseInt(event.endDay) && (parseInt(startDay)>parseInt(event.startDay))) same = true;
                      //testa dia
                      if ((parseInt(startMonth)<=parseInt(event.startMonth)) && (parseInt(endMonth)>parseInt(event.startMonth))) same = true; else if (parseInt(startMonth)<parseInt(event.endMonth) && (parseInt(startMonth)>parseInt(event.startMonth))) same = true;
                      //testa mes
                      if ((parseInt(startYear)<=parseInt(event.startYear)) && (parseInt(endYear)>parseInt(event.startYear))) same = true; else if (parseInt(startYear)<parseInt(event.endYear) && (parseInt(startYear)>parseInt(event.startYear))) same = true;
                      //testa ano
                      if (DayOld===Day || EndDay===DayEndOld){
                          if (((parseInt(startTime)<parseInt(startTimeOld)) && (parseInt(endTime)>parseInt(startTimeOld)))|| (parseInt(startTime)<parseInt(endTimeOld) && (parseInt(startTime)>parseInt(startTimeOld)))) same = true; 
                          //testa hora do dia
                          if ((parseInt(startTime)===parseInt(startTimeOld))|| (parseInt(startTime)===parseInt(endTimeOld)) || (parseInt(endTime)===parseInt(endTimeOld))) same=true;

                      }
                      if ( EndDay===DayEndOld && (parseInt(endTime)===parseInt(endTimeOld))) same=true;

                      if (same===true) alert ("your event will coincide with " + event.description + " remove or edit it if you want to")
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
                if (allEvent.id===event.id){
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