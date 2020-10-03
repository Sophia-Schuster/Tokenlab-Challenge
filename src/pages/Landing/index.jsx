import React, {useState} from 'react';
import firebase from '../../firebase';

import logoImg from '../../assets/images/logo.png'; //importacao do logo da tokenlab
import landingImg from '../../assets/images/mymarketing.png';
// imagens

import purpleHeartIcon from '../../assets/images/icons/purple-heart.svg';
// icones

import './landingStyle.css';
// css

import LoginModal from '../../Components/LoginComponent/LogModal.jsx'; 
import RegisterModal from '../../Components/RegisterComponent/RegModal.jsx'; 
import GuideModal from '../../Components/GuideComponent/GuideModal.jsx'; 
import CalendarModal from '../../Components/CalendarComponent/CalendarModal.jsx'
import ProfileModal from '../../Components/ProfileComponent/ProfileModal.jsx'
// componentes

function Landing() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    // constante para criacao do modal form de login 
    const [isModalRegVisible, setIsModalRegVisible] = useState(false);
    // constante para criacao do modal form de registro
    const [isModalGuideVisible, setIsModalGuideVisible] = useState(false);
    //constante para criacao do modal de guia
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    //constante para criacao do modal do calendario
    const [isProfileVisible, setIsProfileVisible] = useState(false);
    //constante para criacao do modal form de perfil
    return(
        <div id= "page-landing">
            <div id="page-landing-content" className="container">
                <div className="logo-container">
                    <img src={logoImg} alt="Tokenlablogo"/>
                    <h2>Start using our calendar now and keep all your days on track!</h2>
                    {/* no react nao posso simplesmente colocar o caminho da imagem aqui, preciso importar ela pro meu index.tsx primeiro. */}
                </div>

                <img src={landingImg} alt="example of site" className="site-image"/>

                        {!firebase.isLogged() &&
                            <div className = "buttons-container">
                                <button onClick = {() => setIsModalRegVisible(true)} className="registerAndprofile"> 
                                Register
                                </button>
                                
                                <button onClick = {() => setIsModalVisible(true)} className="loginAndcalendar">
                                Log in
                                </button>
                            </div>
                        }
                        {firebase.isLogged() &&
                            <div className = "buttons-container">

                                <button onClick = {() => setIsCalendarVisible(true)} className="loginAndcalendar">
                                    Calendar
                                </button>

                                <button onClick = {() => setIsProfileVisible(true)} className="registerAndprofile"> 
                                    Profile
                                </button>
                            </div>
                        }
                        
                        {/* testar se formulario deve estar visivel ou nao */}
                        {isModalVisible ? <LoginModal setIsModalVisible={setIsModalVisible}/> : null}

                        {isModalRegVisible ? <RegisterModal setIsModalRegVisible={setIsModalRegVisible} setIsModalGuideVisible={setIsModalGuideVisible}/> : null} 

                        {isModalGuideVisible ? <GuideModal setIsModalGuideVisible={setIsModalGuideVisible} /> : null} 

                        {isCalendarVisible ? <CalendarModal setIsCalendarVisible={setIsCalendarVisible} /> : null} 

                        {isProfileVisible ? <ProfileModal setIsProfileVisible={setIsProfileVisible} /> : null} 

                <a onClick = {() => setIsModalGuideVisible(true)} className= "know-more">
                    <img src={purpleHeartIcon} alt="Purple heart"/>
                    Step by Step Guide
                    {/* fica separado dos outros para facilitar a organizacao do grid */}
                </a>
            </div>
        </div> 
    )
}

export default Landing;