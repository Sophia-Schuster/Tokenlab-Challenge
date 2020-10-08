import React, { useState } from 'react'; 
import firebase from '../../firebase';


import '../../Components/EditEventComponent/SeeAndRemoveEvent.css';

import UpdateEventModal from '../UpdateEventComponent/UpdateEventModal.jsx';

function EventInfo ({event}){

    const [isUpdateEventVisible,setIsUpdateEventVisible] = useState(false);


    async function removeEvent(event,inx){
        try{
            await firebase.removeEventInformation(event);
            window.location.reload();
        } catch(error) {
            return "Houve um erro na remocao do evento:" + error;
        }
    }

    return(         
        <div>         
            <div className="eventContainer">
                <span> {event.description}</span>
                <span> {parseInt(event.startMonth)+1}/{event.startDay}/{event.startYear}</span>
                {/* transforma a string em numero e soma 1 pois o calendario comeca do 0*/}
                <span>Start time: {event.startTime} O'clock</span>
                <span> End date: {parseInt(event.endMonth)+1} / {event.endDay} / {event.endYear}</span>
                <span>End time: {event.endTime} O'clock</span>
                <button className="buttonClass">
                    <button className = "excludeEvent" onClick = {() => removeEvent(event)}>
                        Exclude
                    </button> 
                    <button className="editEvent" onClick = {() => setIsUpdateEventVisible(true)}>
                        Edit
                    </button>
                </button>
            </div>
            {isUpdateEventVisible ? <UpdateEventModal event = {event} setIsUpdateEventVisible={setIsUpdateEventVisible} /> : null}
        </div>

    )
}

export default EventInfo;