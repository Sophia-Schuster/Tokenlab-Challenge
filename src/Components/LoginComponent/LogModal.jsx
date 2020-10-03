import React, { useState } from 'react'; 
import firebase from '../../firebase';

import TokenIcon from '../../assets/images/icons/tokenicon.png';
import backIcon from '../../assets/images/icons/backArrow.svg';
// icones

import Visibility from '../../assets/images/visibility.svg';
import offVisibility from '../../assets/images/visibility_off.svg';
// imagens

import './logStyle.css';
import '../SmallModal.css';
//css

//Modal / Dialog do formulário de login
function Modal({setIsModalVisible}) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword,setShowPass] = useState(false)

    function setShowPassword (){
        setShowPass(showPassword => !showPassword);
    }
    return(
        <div className = "modal">
            <div className = "containerModal">
                <button onClick = {() => setIsModalVisible(false)} className = "closeModal">
                    <img src={backIcon} alt="back" className= "backIcon"/>
                </button> 
                {/* self-close element */}
                <div className = "content"> 
                    <div className = "loginForm">
                        <span className = "helloSpan"> Welcome </span>
                        <img src={TokenIcon} alt="tokenlabIcon" className="tokenIcon" />
                        <div className= "inputsContainer">
                        <div className = "enterEmail">
                            <input className = "email" placeholder= "Email" type="text" name="Email" value={email} onChange={e => setEmail(e.target.value)}/>
                        </div>
                        <div className = "enterPassword">
                            <input className = "password" placeholder= "Password" type={showPassword ? 'text' : 'password'} name="password" value={password} onChange={e => setPassword(e.target.value)}/>
                            <img className = "openEye" src= {showPassword? offVisibility : Visibility} onClick={() => setShowPassword()} alt="Show Password"/>
                        </div>
                        </div>
                        <div className = "loginButtonContainer">
                            <button onClick = {login} className="logInButton">
                                Log in
                            </button>
                        </div>
                        <a href= "" className= "goToRegister">
                            Don’t have an account?
                        </a>
                    </div>
                </div>
            </div>
        </div>
    ) 
    async function login(){
        try{
            await firebase.login(email,password)
            // setIsModalVisible(false)
            window.location.reload()
        } catch(error){
            alert(error.message)
        }
    }
}

export default Modal;