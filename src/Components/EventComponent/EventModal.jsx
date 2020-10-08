import React, { useState } from 'react'; 
import firebase from '../../firebase';

import backIcon from '../../assets/images/icons/backArrow.svg';

import './EventStyle.css';
import '../SmallModal.css';
import { getYear, getDaysInMonth } from 'date-fns';

function EventModal ({setIsEventModalVisible,day,eventList, getData}){

    // vrariaveis de eventos:
    const [describe,setDescribe] = useState("My Event");
    const [startDate] = useState(day.toString());
    const [endDay, setEndDay] = useState("");
    const [endMonth, setEndMonth] = useState("");
    const [endYear, setEndYear] = useState("");
    const [startTime,setStartTime] = useState("00:00");
    const [endTime, setEndTime] = useState("00:00");

    const [username] = useState(firebase.getCurrentUsername())

    // constante para pegar datas finais invalidas (fora do numero de dias do mês):
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

    function LoopDays(){
            let dayLoops = []
            for (let i=1; i<=31;i++){
                dayLoops.push(i)
            }
            return dayLoops
    }
    function LoopYears(){
        let yearLoops = []
        for (let i=getYear(day); i<=(getYear(day)+100);i++){
            yearLoops.push(i)
        }
        return yearLoops
}

    async function sendEventInformation(){
        if (getDaysInMonth(new Date(endYear, endMonth))>= endDay){
            try {
                await firebase.sendEventInformation(describe,startDate,endMonth,endDay,endYear,startTime,endTime,MonthDays,eventList);
                setIsEventModalVisible(false);
                await getData();
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
                <div className="addEventModalContainer">
                    <div className="eventSpanContainer">
                        <span className="eventSpan"> Please, tell me about your event {username} </span>
                    </div>
                    <div className="actionsContainer">
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
                        <div className="inputsEvent">
                            <input value= {startTime} type="time" onChange={e => setStartTime(e.target.value)}/>
                            <input type="time" value= {endTime} onChange={e => setEndTime(e.target.value)}/>
                            <input type="text" placeholder="Description" value= {describe} onChange={e => setDescribe(e.target.value)}/>
                        </div>
                    </div>
                        <button className="sendIt" onClick={() => sendEventInformation()}>Send</button> 
                    {error === false && <span> Invalid Date!</span>}
                </div>
            </div>
        </div>
    )
}
export default EventModal;