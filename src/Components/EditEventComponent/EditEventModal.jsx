import React, { useState } from 'react'; 
import firebase from '../../firebase';

import backIcon from '../../assets/images/icons/backArrow.svg';

import './EditEventStyle.css';
import '../SmallModal.css';

import UpdateEventModal from '../UpdateEventComponent/UpdateEventModal.jsx';

function EditEventModal ({getData,setIsEditEventVisible,eventList}){

    const [isUpdateEventVisible,setIsUpdateEventVisible] = useState(false);


    async function removeEvent(event){
        try{
            await firebase.removeEventInformation(event);
            await getData();
        } catch(error) {
            return "Houve um erro na remocao do evento:" + error;
        }
    }

    return(
        <div className = "modal">
            <div className = "containerModal">
                <button onClick = {() => setIsEditEventVisible(false)} className = "closeModal">
                    <img src={backIcon} alt="back" className= "backIcon"/>
                </button> 
                {eventList.map((event,inx)=>
                    <div key={inx} className="eventContainer">
                        <span> {event.description}</span>
                        <span> {event.startMonth}/{event.startDay}/{event.startYear}</span>
                        <span>Start time: {event.startTime} O'clock</span>
                        <span> End date: {event.endMonth} / {event.endDay} / {event.endYear}</span>
                        <span>End time: {event.endTime} O'clock</span>
                        <button className = "excludeEvent" onClick = {() => removeEvent(event)}>
                            Exclude
                        </button> 
                        <button className="editEvent" onClick = {() => setIsUpdateEventVisible(true)}>
                            Edit
                        </button>
                        {isUpdateEventVisible ? <UpdateEventModal getData={getData} event = {event} setIsUpdateEventVisible={setIsUpdateEventVisible} /> : null}
                    </div>
                )}
            </div>
        </div>
    )
}

export default EditEventModal;