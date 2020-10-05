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

import backIcon from '../../assets/images/icons/backArrowWhite.svg';
// icones

import EventModal from '../../Components/EventComponent/EventModal.jsx';
import EditEventModal from '../../Components/EditEventComponent/EditEventModal.jsx';
// componente

import './CalendarStyle.css';
import '../SmallModal.css';
import { id } from 'date-fns/locale';
//css

function CalendarModal ({setIsCalendarVisible}){

    // calendario 
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(new Date())

    const [isEventModalVisible, setIsEventModalVisible] = useState(false);
    const [isEditEventVisible, setIsEditEventVisible] = useState(false);
    // const [isClickForEvent, setIsClickForEvent] = useState(new Date())

    const [eventList,setEventList] = useState([]);


    async function getData(){
      // infoEvent guarda toda minha informacao vinda do firebase
      const infoEvent = await firebase.getEventInformation();
      // async só termina quando o await pegar as informacoes
      setEventList(infoEvent);
   };
        //pega informacao assim que a pagina carregar
      useEffect(()=>{
         getData();
     }, []);

    // Both of these next functions will use the hook setCurrentDate, wich will use dateFns 
    // dependency to add (next) /subtract (prev) a month from the original value
    const nextMonth = () => {
        setCurrentDate(addMonths(currentDate, 1));
     }
     const prevMonth = () => {
        setCurrentDate(subMonths(currentDate, 1));
     }

     //const to select the clicked day
     function onDateClick (day) {
        setSelectedDate(day);
        // setIsClickForEvent(day);
        setIsEventModalVisible(true) 
        // setIsEventModalVisible(true);
    }

    // Calendar header (where will be the months)
    const header = () => {
        const dateFormat = "MMMM yyyy";
        // title format 
        return (
           <div className="header row">
              <div className="column"> 
                 <div className="icon" onClick={prevMonth}>
                    chevron_left 
                    {/* left arrow, column 1*/}
                 </div>
                 <span>{format(currentDate, dateFormat)}</span>
                 {/* month tittle, column 2 */}
                 <div className="icon" onClick={nextMonth}>
                    chevron_right
                    {/* right arrow, column 3 */}
                 </div>
              </div>
           </div>
           );
        };

        //days of the week of our calendar
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
                  //rendering the days of the week (Sun-Sat)
               }
               return <div className="weekDays row">{weekDays}</div>;
            };

        //the calendar days
        const days = () => {
            // when the month starts and ends:
            const monthStart = startOfMonth(currentDate);
            const monthEnd = endOfMonth(monthStart);
            //first day of the current month
            const startDate = startOfWeek(monthStart);
            //final day of the month
            const endDate = endOfWeek(monthEnd);

            const dateFormat = "d";
            //render all weeks of the given month:
            const rows = [];
            //render days for each calendar week:
            let days = [];
            //points to the start date of the given month: 
            let day = startDate;

            let formattedDate = "";
            while (day <= endDate) {
               for (let i = 0; i < 7; i++) {

                  //testa se o dia tem evento:
                  let bool= false
                  let eventDesc=[];
                  eventList.forEach(event => {
                     let date = new Date(event.startYear,event.startMonth,event.startDay,0,0);
                     if (isSameDay(day,date)) {
                        bool=true; 
                        eventDesc.push(event.description);
                        // console.log(event.description);
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

                  //  className={`column cell ${!isSameMonth(day, monthStart)
                  //    ? "disabledDays" : isSameDay(day, selectedDate) 
                  //    ? "selected" : "" }`} 

                  //  className={`${CompairEventWithDay(day)
                  //    ? "paintIt" : "" }`} 
                  
                   key={day} 
                   onClick={() => onDateClick(toDate(cloneDay))}
                   > 
                   {/* coloca o nome do evento no dia: */}
                   <ul>
                     {eventDesc.map((eventName) => 
                           <li>{eventName}</li>
                      )}
                   </ul>
                   
                  {/* {bool ? <span>{eventDesc}</span> : ""} */}
                   <span className="numbers">{formattedDate}</span>
                    <span className="numbersHover">{formattedDate}</span>
                 </div>
                 );
                 //tentando marcar os dias com evento
               //   for (let j =0; eventList[j]!== null; j++) {
               //      days.push()
               //      let eventday = transformDate(j);
               //       id={`${isSameDay(day,eventday) ? "paintIt" : "" }`} 
               //   }
               day = addDays(day, 1);
              } 
              //For each of the 7 iterations, I push a single date into the days array. 
              //and then moving to the next day in the week using the dateFns.addDays method.
               rows.push(
                  <div className="row" key={day}> {days} </div>
                );
               days = [];
               //At the end of the 7 iterations, I push the entire days array into the rows array.
               // then I clear the days array and start over for the next week.
             }
            return <div className="Calendarbody">{rows}</div>;
            // return the full rows array after the end of the while loop
            }

    return(
        <div className = "modal">
            <div className = "BigcontainerModal">
                <button onClick = {() => setIsCalendarVisible(false)} className = "closeModal">
                    <img src={backIcon} alt="back" className= "backIcon" id="back"/>
                </button> 
                <button onClick={()=>setIsEditEventVisible(true)} className="OpenEvents">
                  Edit events
                </button>
                <div className="calendar">
                    <div>{header()}</div>        
                    <div>{daysOfWeek()}</div>        
                    <div>{days()}</div> 
                </div>
                <div>
                    {/* selectedDate */}
                    {isEditEventVisible ? <EditEventModal getData={getData} eventList = {eventList} setIsEditEventVisible={setIsEditEventVisible} /> : null}
                    {isEventModalVisible ? <EventModal getData={getData} setEventList = {setEventList} day={selectedDate} setIsEventModalVisible={setIsEventModalVisible} /> : null}
                </div>
            </div>
        </div>
    )
}
export default CalendarModal;