import React, { useState } from 'react'; 
import firebase from '../../firebase';
import { getDaysInMonth } from 'date-fns';


import backIcon from '../../assets/images/icons/backArrow.svg';

import './UpdateEventStyle.css';
import '../SmallModal.css';
import '../../Components/EventComponent/EventStyle.css';




function UpdateEvent ({event,setIsUpdateEventVisible}){
    const [describe,setDescribe] = useState(event.description);
    const [startMonth,setStartMonth] = useState(event.startMonth);
    const [startDay,setStartDay] = useState(event.startDay);
    const [startYear,setStartYear] = useState(event.startYear);
    const [endDay, setEndDay] = useState(event.endDay);
    const [endMonth, setEndMonth] = useState(event.endMonth);
    const [endYear, setEndYear] = useState(event.endYear);
    const [startTime,setStartTime] = useState(event.startTime);
    const [endTime, setEndTime] = useState(event.endTime);

    console.log(event)

    const [error,setError] = useState("");

    //funcoes para select
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
    } //Deveria ter colocado isos no pai, assim ele passaria para os dois outros modais! Mas só pensei nisso depois 
    function LoopYears(){
        let yearLoops = []
        let year_leght= parseInt(startYear)
        for (let i=year_leght-100; i<=year_leght+100;i++){
            yearLoops.push(i)
        }
        return yearLoops
}

    async function UpdateEventfunc(){
        if (getDaysInMonth(new Date(endYear, endMonth))>= endDay){
            try{
                await firebase.updateEventInformation(event,describe, startMonth,startDay,startYear,endMonth,endDay,endYear,startTime,endTime);
               window.location.reload();
            } catch(error) {
                return "Houve um erro na atualizacao do evento:" + error;
            }
        } else  setError(false);
    }

    return(
        <div className = "modal">
            <div className = "containerModalUpdate">
                <button onClick = {() => setIsUpdateEventVisible(false)} className = "closeModal">
                    <img src={backIcon} alt="back" className= "backIcon"/>
                </button> 
                <span className="eventSpan"> What you want to change?</span>
                <div className="updateContainer">
                    <div className="dateSelect">
                        <span> Begin: </span>
                        <select value= {startMonth} onChange={e => setStartMonth(e.target.value)}>
                                <option value="" selected="">Start Month</option>
                                {MonthDays.map((MonthDay, inx) =>
                                    <option key={inx} value={inx}>{MonthDay}</option> 
                                )}
                        </select>
                            <select value= {startDay} onChange={e => setStartDay(e.target.value)}>
                                <option value="" selected="">Start Day</option>
                                {LoopDays().map((dayLoop, inx )=>
                                    <option key={inx} value={dayLoop}>{dayLoop}</option>
                                )}
                            </select>
                            <select value= {startYear} onChange={e => setStartYear(e.target.value)}>
                                <option value="" selected="">Start Year</option>
                                {LoopYears().map((yearLoop,inx) =>
                                    <option key={inx} value={yearLoop}>{yearLoop}</option>
                                )}
                        </select>
                    </div>
                    <div className="dateSelect">
                        <span> End:  </span>
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
                    </div>
                </div>
                
                <div className="updateContainer">
                    <input type="time" placeholder="Time it starts" value= {startTime} onChange={e => setStartTime(e.target.value)}/>
                    <input type="time" placeholder= "Time it ends" value= {endTime} onChange={e => setEndTime(e.target.value)}/>
                    <input type="text" placeholder="Description" value= {describe} onChange={e => setDescribe(e.target.value)}/>
                </div>    {/* {getDaysInMonth(new Date(endYear, endMonth))< endDay && <span> Invalid Date</span>} */}
                <div className="updateContainer">
                    <button className = "updateEvent" onClick = {() => UpdateEventfunc(event)}>
                                Update it
                    </button> 
                    {error === false && <span> Invalid Date!</span>}
                </div>
            </div>
        </div>
    )
}

export default UpdateEvent;