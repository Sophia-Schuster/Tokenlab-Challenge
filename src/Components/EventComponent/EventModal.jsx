import React, { useEffect, useState } from 'react'; 
import firebase from '../../firebase';

import backIcon from '../../assets/images/icons/backArrow.svg';

import './EventStyle.css';
import '../SmallModal.css';

function EventModal ({setIsEventModalVisible,day}){
    // firebase:
    const [eventList,setEventList] = useState([]);
    // const [eventInfo, setEventInfo] = useState(null);

    // vrariaveis de eventos:
    const [describe,setDescribe] = useState("");
    const [startDay,setStartDay] = useState("");
    const [startMonth,setStartMonth] = useState("");
    const [startYear,setStartYear] = useState("");
    const [endDay, setEndDay] = useState("");
    const [endMonth, setEndMonth] = useState("");
    const [endYear, setEndYear] = useState("");
    const [startTime,setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    function updateData(){
        const dateString = day.toString().split(" ");
        //posicao 1 - mes, posicao 2- dia, posicao 3- ano
        setStartMonth(dateString[1]);
        setStartDay(dateString[2]);
        setStartYear(dateString[3]);
    }

    //pega informacao assim que a pagina carregar
    useEffect(()=>{
        async function getData(){
            // infoEvent guarda toda minha informacao vinda do firebase
            const infoEvent = await firebase.getEventInformation();
            // async só termina quando o await pegar as informacoes
            setEventList(infoEvent);
        };
    getData();
    });
    async function sendEventInformation(){
        await firebase.sendEventInformation(describe,startMonth,startDay,startYear,endMonth,endDay,endYear,startTime,endTime);
        setIsEventModalVisible(false);
    }

    return(
        <div className = "modal">
            <div className = "containerModal">
                <button onClick = {() => setIsEventModalVisible(false)} className = "closeModal">
                    <img src={backIcon} alt="back" className= "backIcon" id="backIconUp"/>
                </button> 
                <input type="text" placeholder="Description" value= {describe} onChange={e => setDescribe(e.target.value)}/>
                <input type="text" placeholder= "Month" value= {endMonth} onChange={e => setEndMonth(e.target.value)}/>
                <input type="text" placeholder="Day" value= {endDay} onChange={e => setEndDay(e.target.value)}/>
                <input type="text" placeholder="Year" value= {endYear} onChange={e => setEndYear(e.target.value)}/>
                <input type="text" placeholder="Time it starts" value= {startTime} onChange={e => setStartTime(e.target.value)}/>
                <input type="text" placeholder= "Time it ends" value= {endTime} onChange={e => setEndTime(e.target.value)}/>
                <button onClick={() => {updateData();sendEventInformation();}}>end time</button> 
            </div>
        </div>
    )
}

export default EventModal;