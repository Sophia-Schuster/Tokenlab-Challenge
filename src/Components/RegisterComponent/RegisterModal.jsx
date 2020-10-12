import React, { useState } from 'react'; 
import firebase from '../../firebase';

import backIcon from '../../assets/images/icons/backArrow.svg';
// icones

import Visibility from '../../assets/images/visibility.svg';
import offVisibility from '../../assets/images/visibility_off.svg';
// imagens

import './RegisterStyle.css';
import '../SmallModal.css';
//css

function RegModal ({setIsModalRegVisible}){
    const[name,setName] = useState('')
    const[email,setEmail] = useState('')
    const[password,setPassword] = useState('')
    const[repeatPassword,setRepeatPassword] = useState('')
    const[repeatShowPassword, setRepeatShowPassword] = useState(false)
    const [showPassword,setShowPass] = useState(false)

    function setShowPassword (){
        setShowPass(showPassword => !showPassword);
    }
    function setShowRepeatPassword (){
        setRepeatShowPassword(repeatShowPassword => !repeatShowPassword);
    }

    return(
        <div className = "modal">
            <div className = "containerModalReg_Login">
                <button onClick = {() => setIsModalRegVisible(false)} className = "closeModal">
                    <img src={backIcon} alt="back" className= "backIcon"/>
                </button>  
                <div className = "contentReg"> 
                    <div className = "RegForm">
                        <span className = "helloSpan"> Hello! </span>
                        <div className= "inputsContainerReg">
                            <div className = "enterName">
                                <input className = "username" placeholder= "Username" type="text" name="Username" value={name} onChange={e => setName(e.target.value)}/>
                            </div>
                            <div className = "enterEmail">
                                <input className = "email" placeholder= "Email" type="text" name="Email" value={email} onChange={e => setEmail(e.target.value)}/>
                            </div>
                            <div className = "enterPassword">
                                <input className = "password" placeholder= "Password" type={showPassword ? 'text' : 'password'} name="password" value={password} onChange={e => setPassword(e.target.value)}/>
                                <img className = "openEye" src= {showPassword? offVisibility : Visibility} onClick={() => setShowPassword()} alt="Show Password"/>
                            </div>
                            <div className = "repeatPassword">
                                <input className = "password" placeholder= "Repeat password" type={repeatShowPassword ? 'text' : 'password'} name="password" value={repeatPassword} onChange={e => setRepeatPassword(e.target.value)}/>
                                <img className = "openEye" src= {repeatShowPassword? offVisibility : Visibility} onClick={() => setShowRepeatPassword()} alt="Show Password"/>
                            </div>
                       </div>
                       <div className = "RegisterButtonContainer">
                           <button className="RegisterButton" onClick={() => onRegister()}>
                               Register
                           </button>
                        </div>
                   </div>
                </div>
                {/* mudei meu form pra div pois o form estava dando erro no firebase */}
            </div>
        </div>
    )

    //funcao do firebase de registro
    async function onRegister(){
        if(password===repeatPassword){
            try{
                await firebase.register(name,email,password)
                setIsModalRegVisible(false)
                // o modal de registro fecha automaticamente ao completar registro
            } catch(error){
                alert(error.message)
            }
        }
        else alert("Passwords do not match")
    }
}

export default RegModal;