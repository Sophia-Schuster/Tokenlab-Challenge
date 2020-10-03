import React from 'react'; 

import backIcon from '../../assets/images/icons/backArrow.svg';

import './GuideStyle.css';
import '../SmallModal.css';

function GuideModal ({setIsModalGuideVisible}){
    return(
        <div className = "modal">
            <div className = "containerModal">
                <button onClick = {() => setIsModalGuideVisible(false)} className = "closeModal">
                    <img src={backIcon} alt="back" className= "backIcon"/>
                </button> 
            </div>
        </div>
    )
}

export default GuideModal;