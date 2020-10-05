import React, { useEffect, useState } from 'react'; 
import firebase from '../../firebase';

import backIcon, { ReactComponent } from '../../assets/images/icons/backArrow.svg';

import './EventStyle.css';
import '../SmallModal.css';
import userEvent from '@testing-library/user-event';
import { id } from 'date-fns/locale';
import { getYear, getMonth, getDaysInMonth } from 'date-fns';

// import EventModal from '../CalendarComponent/CalendarModal.jsx';

function EventModal ({setIsEventModalVisible,day,setEventList, getData}){
    // firebase:
    // const [eventList,setEventList] = useState([]);
    // const [eventInfo, setEventInfo] = useState(null);

    // vrariaveis de eventos:
    const [describe,setDescribe] = useState("");
    const [startDate] = useState(day.toString());
    const [endDay, setEndDay] = useState("");
    const [endMonth, setEndMonth] = useState("");
    const [endYear, setEndYear] = useState("");
    const [startTime,setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const [username] = useState(firebase.getCurrentUsername())

    // constante para pegar datas finais invalidas:
    const [error,setError] = useState("");

    // ajeitando inputs de data final
    const MonthDays = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ] 

    // const dayLoops = []
    function LoopDays(){
            let dayLoops = []
            // console.log(endMonth);
            // console.log(getDaysInMonth(new Date(endMonth)));
            for (let i=1; i<=31;i++){
                // <option value={i}>{i}</option>
                dayLoops.push(i)
            }
            return dayLoops
    }
    function LoopYears(){
        let yearLoops = []
        // console.log(endMonth);
        // console.log(getDaysInMonth(new Date(endMonth)));
        // var result = getYear(day)
        // a variavel day guarda o dia selecionado no calendario
        for (let i=getYear(day); i<=(getYear(day)+100);i++){
            // <option value={i}>{i}</option>
            yearLoops.push(i)
        }
        return yearLoops
}

    // //pega informacao assim que a pagina carregar
    // useEffect(()=>{
    //     async function getData(){
    //         // infoEvent guarda toda minha informacao vinda do firebase
    //         const infoEvent = await firebase.getEventInformation();
    //         // async só termina quando o await pegar as informacoes
    //         setEventList(infoEvent);
    //     };
    // getData();
    // });

    // console.log(eventList);

    async function sendEventInformation(){
        if (getDaysInMonth(new Date(endYear, endMonth))>= endDay){
            try {
                // updateData();
                await firebase.sendEventInformation(describe,startDate,endMonth,endDay,endYear,startTime,endTime,MonthDays);
                setIsEventModalVisible(false);
                getData();
            } catch(error){
                return "Houve um erro na adicao do evento:" + error;
            }
        } else  setError(false);
    }

    return(
        <div className = "modal">
            <div className = "containerModal">
                <button onClick = {() => setIsEventModalVisible(false)} className = "closeModal">
                    <img src={backIcon} alt="back" className= "backIcon" id="backIconUp"/>
                </button> 
                <span className="eventSpan"> Please, tell me about your event {username} </span>
                <div className="EndDate">
                    <select value= {endMonth} onChange={e => setEndMonth(e.target.value)}>
                        <option value="" selected="">Month</option>
                        {MonthDays.map((MonthDay, inx) =>
                            <option key={inx} value={inx}>{MonthDay}</option> 
                        )}
                    </select>
                    <select value= {endDay} onChange={e => setEndDay(e.target.value)}>
                        <option value="" selected="">Day</option>
                        {LoopDays().map((dayLoop, inx )=>
                            <option key={inx} value={dayLoop}>{dayLoop}</option>
                        )}
                    </select>
                    <select value= {endYear} onChange={e => setEndYear(e.target.value)}>
                        <option value="" selected="">Year</option>
                        {LoopYears().map((yearLoop,inx) =>
                            <option key={inx} value={yearLoop}>{yearLoop}</option>
                        )}
                    </select>
                    {/* {getDaysInMonth(new Date(endYear, endMonth))< endDay && <span> Invalid Date</span>} */}
                </div>
                <input type="time" placeholder="Time it starts" value= {startTime} onChange={e => setStartTime(e.target.value)}/>
                <input type="time" placeholder= "Time it ends" value= {endTime} onChange={e => setEndTime(e.target.value)}/>
                <input type="text" placeholder="Description" value= {describe} onChange={e => setDescribe(e.target.value)}/>
                <button onClick={() => sendEventInformation()}>Send</button> 
                {error === false && <span> Invalid Date!</span>}
            </div>
        </div>
    )
}
export default EventModal;