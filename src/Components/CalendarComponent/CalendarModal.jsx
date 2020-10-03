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
        parse } from 'date-fns';
        // importacao da dependencia para construcao do calendario

import backIcon from '../../assets/images/icons/backArrow.svg';
// icones

import './CalendarStyle.css';
import '../SmallModal.css';
//css

function CalendarModal ({setIsCalendarVisible}){

    // firebase:
    const [eventList,setEventList] = useState([]);
    const [loadingContent, setLoadingContent] = useState(true);
    const [eventInfo, setEventInfo] = useState(null);
    // vrariaveis de eventos:
    const [describe,setDescribe] = useState("");
    const [start,setStart] = useState("");
    const [end, setEnd] = useState("");
    // calendario 
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(new Date())

    // constantes para passar os meses
    const nextMonth = () => {
        setCurrentDate(addMonths(currentDate, 1));
     }
     const prevMonth = () => {
        setCurrentDate(subMonths(currentDate, 1));
     }

     //constante para os dias/celulas (era o que selecionava o dia, nao estou usando)
     const onDateClick = day => {
        setSelectedDate(day)
        }

    // header do calendario:
    const header = () => {
        const dateFormat = "MMMM yyyy";
        return (
           <div className="header row">
              <div className="column col-start">
                 <div className="icon" onClick={prevMonth}>
                    chevron_left
                 </div>
              </div>
              <div className="column col-center">
                 <span>{format(currentDate, dateFormat)}</span>
              </div>
              <div className="column col-end">
                 <div className="icon" onClick={nextMonth}>
                    chevron_right
                 </div>
              </div>
           </div>
           );
        };

        //dias da semana mostrados abaixo da header do calendario
        const daysOfWeek = () => {
            const dateFormat = "EEE";
            const days = [];
            let startDate = startOfWeek(currentDate);
            for (let i = 0; i < 7; i++) {
                  days.push(
                     <div className="column col-center" key={i}>
                     {format(addDays(startDate, i), dateFormat)}
                     </div>
                  );
               }
               return <div className="days row">{days}</div>;
            };

        //dias do calendario
        const cells = () => {
            const monthStart = startOfMonth(currentDate);
            const monthEnd = endOfMonth(monthStart);
            const startDate = startOfWeek(monthStart);
            const endDate = endOfWeek(monthEnd);
            const dateFormat = "d";
            const rows = [];
            let days = [];
            let day = startDate;
            let formattedDate = "";
            while (day <= endDate) {
               for (let i = 0; i < 7; i++) {
               formattedDate = format(day, dateFormat);
               const cloneDay = day;
               days.push(
                  <div 
                   className={`column cell ${!isSameMonth(day, monthStart)
                   ? "disabled" : isSameDay(day, selectedDate) 
                   ? "selected" : "" }`} 
                   key={day} 
                    //onClick={() => onDateClick(parse(cloneDay))}
                   > 
                   <span className="number">{formattedDate}</span>
                   <span className="bg">{formattedDate}</span>
                 </div>
                 );
               day = addDays(day, 1);
              }
               rows.push(
                  <div className="row" key={day}> {days} </div>
                );
               days = [];
             }
            return <div className="body">{rows}</div>;
            }

    //pega informacao assim que a pagina carregar
    useEffect(()=>{
        async function getData(){
            // infoEvent guarda toda minha informacao vinda do firebase
            const infoEvent = await firebase.getEventInformation();
            // async só termina quando o await pegar as informacoes
            setEventList(infoEvent);
            setLoadingContent(false);
        };
    getData();
    });
    async function sendEventInformation(){
        await firebase.sendEventInformation(describe,start,end);
    }

    return(
        <div className = "modal">
            <div className = "BigcontainerModal">
                <button onClick = {() => setIsCalendarVisible(false)} className = "closeModal">
                    <img src={backIcon} alt="back" className= "backIcon"/>
                </button> 
                {/* calendario */}
                <div className="calendar">
                    <div>{header()}</div>        
                    <div>{daysOfWeek()}</div>        
                    <div>{cells()}</div> 
                </div>
                {/* <input type="text" value= {describe} onChange={e => setDescribe(e.target.value)}/>
                <button onClick={() => sendEventInformation()}>send test</button> */}
            </div>
        </div>
    )
}

export default CalendarModal;