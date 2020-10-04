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

import EventModal from '../../Components/EventComponent/EventModal.jsx'
// componente

import './CalendarStyle.css';
import '../SmallModal.css';
//css

function CalendarModal ({setIsCalendarVisible}){

    // calendario 
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(new Date())

    const [isEventModalVisible, setIsEventModalVisible] = useState(false);
    // const [isClickForEvent, setIsClickForEvent] = useState(new Date())

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
               formattedDate = format(day, dateFormat);
               const cloneDay = day;
               days.push(
                  <div 
                   className={`column cell ${!isSameMonth(day, monthStart)
                   ? "disabledDays" : isSameDay(day, selectedDate) 
                   ? "selected" : "" }`} 
                   key={day} 
                   onClick={() => onDateClick(toDate(cloneDay))}
                   >  
                   <span className="numbers">{formattedDate}</span>
                    <span className="numbersHover">{formattedDate}</span>
                 </div>
                 );
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
                <div className="calendar">
                    <div>{header()}</div>        
                    <div>{daysOfWeek()}</div>        
                    <div>{days()}</div> 
                </div>
                <div>
                    {/* selectedDate */}
                    {isEventModalVisible ? <EventModal day={selectedDate} setIsEventModalVisible={setIsEventModalVisible} /> : null}
                </div>
            </div>
        </div>
    )
}

export default CalendarModal;