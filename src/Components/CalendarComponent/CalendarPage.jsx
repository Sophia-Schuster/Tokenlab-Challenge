import React, { useEffect, useState } from 'react'; 
import firebase from '../../firebase';

import {addMonths, 
        subMonths, 
        format, 
        startOfWeek, 
        addDays,
        startOfMonth,
        endOfMonth,
        endOfWeek,
        isSameMonth,
        isSameDay,
        toDate } from 'date-fns';
        // importacao da dependencia para construcao do calendario

import EventModal from '../EventComponent/EventModal.jsx';
import EditEventModal from '../EditEventComponent/SeeAndRemoveEvent.jsx';
import ProfileModal from '../../Components/ProfileComponent/ProfileModal.jsx'
// componentes

import './CalendarStyle.css';
import '../SmallModal.css';
//css


function CalendarModal ({setIsCalendarVisible}){
    // calendario 
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(new Date())

    const [isEventModalVisible, setIsEventModalVisible] = useState(false);
    const [isEditEventVisible, setIsEditEventVisible] = useState(false);

    const [isProfileVisible, setIsProfileVisible] = useState(false);
    //modal form de perfil

    const [eventList,setEventList] = useState([]);


    async function getData(){
      // infoEvent guarda toda minha informacao vinda do firebase
      const infoEvent = await firebase.getEventInformation();
      // async só termina quando o await pegar as informacoes
      setEventList(infoEvent);
   };
      useEffect(()=>{
         getData();
     }, []);

   //Ambas as funcoes seguintes usam a dependencia dateFns para passar ou voltar nos meses. 
    const nextMonth = () => {
        setCurrentDate(addMonths(currentDate, 1));
     }
     const prevMonth = () => {
        setCurrentDate(subMonths(currentDate, 1));
     }

     //seleciona o dia clicado
     function onDateClick (day) {
        setSelectedDate(day);
        setIsEventModalVisible(true) 
        // abre o modal de marcacao de evento
    }

    // Meses
    const header = () => {
        const dateFormat = "MMMM yyyy";
        //formato do titulo
        return (
           <div className="header row">
              <div className="column"> 
                 <div className="icon" onClick={prevMonth}>
                    chevron_left 
                    {/* seta para esquerda,coluna 1*/}
                 </div>
                 <span>{format(currentDate, dateFormat)}</span>
                 {/* titulo do mes, coluna 2 */}
                 <div className="icon" onClick={nextMonth}>
                    chevron_right
                    {/* seta para direita, coluna 3 */}
                 </div>
              </div>
           </div>
           );
        };

        //dias da semana
        const daysOfWeek = () => {
            const dateFormat = "EEE";
            const weekDays = [];
            let startDate = startOfWeek(currentDate);
            for (let i = 0; i < 7; i++) {
                  weekDays.push(
                     <div className="column" key={i}>
                     {format(addDays(startDate, i), dateFormat)}
                     </div>
                  );
                  //renderizando os dias da semana
               }
               return <div className="weekDays row">{weekDays}</div>;
            };

        //dias do calendario
        const days = () => {
            const monthStart = startOfMonth(currentDate);
            const monthEnd = endOfMonth(monthStart);
            //Primeiro dia do mes atual
            const startDate = startOfWeek(monthStart);
            //Ultimo dia do mes atual
            const endDate = endOfWeek(monthEnd);

            const dateFormat = "d";

            const rows = [];
            //renderiza os dias para cada semana do calendario:
            let days = [];
            //aponta para o comeco do mes 
            let day = startDate;

            let formattedDate = "";
            while (day <= endDate) {
               for (let i = 0; i < 7; i++) {
                  //testa se o dia tem evento:
                  let bool=false;

                  let eventDesc=[];
                  let eventDescStart=[];
                  let eventDescEnd=[];
                  eventList.forEach(event => {
                     let date = new Date(event.startYear,event.startMonth,event.startDay,0,0);
                     let dateEnd = new Date(event.endYear,event.endMonth,event.endDay,0,0); 
      
                     if (isSameDay(day,date) || isSameDay(day,dateEnd) ){
                        bool=true; 
                        eventDesc.push(event.description);
                     }
                   })

               formattedDate = format(day, dateFormat);
               const cloneDay = day;
               days.push(
                  <div 
                  // marca o dia atual:
                   className={`column cell ${!isSameMonth(day, monthStart)
                   ? "disabledDays" : isSameDay(day, selectedDate) 
                   ? "selected" : "" }`} 
                  
                   id={`${bool ? "paintIt": ""}`}
                  
                   key={day} 
                   onClick={() => onDateClick(toDate(cloneDay))}
                   > 
                   {/* coloca o nome do evento no dia: */}
                   <ul>
                     {eventDescStart.map((eventName) => 
                           <li>{eventName}</li>
                      )}
                   </ul>
                   <ul>
                     {eventDescEnd.map((eventName) => 
                           <li>{eventName}</li>
                      )}
                   </ul>
                   <ul>
                     {eventDesc.map((eventName) => 
                           <li>{eventName}</li>
                      )}
                   </ul>
                   <span className="numbers">{formattedDate}</span>
                    <span className="numbersHover">{formattedDate}</span>
                 </div>
                 );
               day = addDays(day, 1);
              } 
              //para cada uma das 7 iteracoes eu puxo uma unica data dentro do arranjo de dias
              //depois vou para o proximo dia da semana usando o metodo date.fns.addDays
               rows.push(
                  <div className="row" key={day}> {days} </div>
                );
               days = [];
               //No fim das 7 iteracoes, eu coloco todo meu arranjo de dias dentro das rows.
               // Entao eu limpo os dias no meu vetor e comeco de novo. 
             }
            return <div className="Calendarbody">{rows}</div>;
            // retorna o rows completo.
            }

    return(
        <div className = "modal">
            <div className = "BigcontainerModal">
                <div className="calendar">
                    <div>{header()}</div>        
                    <div>{daysOfWeek()}</div>        
                    <div>{days()}</div> 
                </div>
                <div className="buttonsClass">
                  <button onClick = {() => setIsProfileVisible(true)} className="profile"> 
                     Profile
                  </button>
                  <button onClick={()=>setIsEditEventVisible(true)} className="OpenEvents">
                     Edit events
                  </button>
                </div>
                <div>
                    {isEditEventVisible ? <EditEventModal eventList = {eventList} setIsEditEventVisible={setIsEditEventVisible} /> : null}
                    {isEventModalVisible ? <EventModal getData={getData} eventList = {eventList} day={selectedDate} setIsEventModalVisible={setIsEventModalVisible} /> : null}
                    {isProfileVisible ? <ProfileModal setIsProfileVisible={setIsProfileVisible} /> : null} 
                </div>
            </div>
        </div>
    )
}
export default CalendarModal;