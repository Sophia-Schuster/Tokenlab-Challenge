import React from 'react'; 

import backIcon from '../../assets/images/icons/backArrow.svg';

import './SeeAndRemoveEvent.css';
import '../SmallModal.css';

import EventInfo from '../EventInfoDisplay/eventInfo';

function EditEventModal ({setIsEditEventVisible,eventList}){


    return(
        <div className = "modal">
            <div className = "containerModal">
                <button onClick = {() => setIsEditEventVisible(false)} className = "closeModal">
                    <img src={backIcon} alt="back" className= "backIcon"/>
                </button> 
                <span className="spanEvent">Event List</span>
                <div className="eventInfoContainer">
                    {eventList.map((event,inx)=>
                        <EventInfo event= {event} key={inx}></EventInfo>
                    )}
                </div>
            </div>
        </div>
    )
}

export default EditEventModal;