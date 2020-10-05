import React from 'react'; 

import backIcon from '../../assets/images/icons/backArrow.svg';

import './UpdateEventStyle.css';
import '../SmallModal.css';

function UpdateEvent ({getData,event,setIsUpdateEventVisible}){
    return(
        <div className = "modal">
            <div className = "containerModal">
                <button onClick = {() => setIsUpdateEventVisible(false)} className = "closeModal">
                    <img src={backIcon} alt="back" className= "backIcon"/>
                </button> 
            </div>
        </div>
    )
}

export default UpdateEvent;