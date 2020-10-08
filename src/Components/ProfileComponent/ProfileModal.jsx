import React, { useState }from 'react'; 
import firebase from '../../firebase';

import backIcon from '../../assets/images/icons/backArrow.svg';
import exitIcon from '../../assets/images/icons/exit.svg';
import deleteIcon from '../../assets/images/icons/delete.png';

import './profileStyle.css';
import '../SmallModal.css';

function ProfileModal ({setIsProfileVisible}){

    var user = firebase.auth.currentUser;
    const[newName,setNewName] = useState('')
    const [username] = useState(firebase.getCurrentUsername())

    function ChangeName(){
        user.updateProfile({
            displayName: newName,
          }).then(function() {
            window.location.reload()
          }).catch(function(error) {
            alert(error.message)
          });
    }

    function logout(){
        firebase.logout()
        window.location.reload()
    }
    function deleteAccount(){
        user.delete().then(function() {
            window.location.reload()
          }).catch(function(error) {
            alert(error.message)
          });
    }
    return(
        <div className = "modal">
            <div className = "containerModalProfile" id="ProfModal">
                <button onClick = {() => setIsProfileVisible(false)} className = "closeModal">
                    <img src={backIcon} alt="back" className= "backIcon"/>
                </button>
                <div className = "profileContainer">
                    <span className="helloSpan"> Hi {username}! </span>
                    <div className="usernameDiv" >
                        <input className = "newName" placeholder= "New Username" type="text" name="newName" value={newName} onChange={e => setNewName(e.target.value)}/>
                        <button className="ChangeName" onClick={() => ChangeName()}>
                            Change it!
                        </button>
                    </div>
                    <button className="LogOutButton" onClick={() => logout()}>
                        <img className="Icon" src= {exitIcon} alt="Exit"/>
                        Log Out 
                    </button>
                    <button className="DeleteAccount" onClick={() => deleteAccount()}>
                        <img className="Icon" src= {deleteIcon} alt="Exit"/>
                        Delete Account (Are you sure?)
                    </button>
                 </div> 
            </div>
        </div>
    )
}

export default ProfileModal;