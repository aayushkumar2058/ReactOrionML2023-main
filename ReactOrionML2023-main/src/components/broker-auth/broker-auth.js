import React, { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import DataServices from '../../services/data.services';
import jwtDecode from 'jwt-decode';



export default function BrokerAuth() {
  //console.log("loading broker auth")
const navigate = useNavigate();
useEffect(()=>{
  //console.log("aayush entered useeffect")
    const token = window.location.href.split('/').pop(); //tokens from Broker
    
    //console.log("aayush token",token)
     // aayush will parse the url and obtain the token in step 12 which will be in jwt format
     //aayush will decode jwt token onto user details variable
     //aayush will determine child variable:- SECURE_SESSION_ID 
     //aayush will save SECURE_SESSION_ID into session storage as it is (in future i will store it encrypted)
    //token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNTUyNzE2MDQiLCJleHAiOjE2OTQ2Njc2ODMsIlNFQ1VSRV9TRVNTSU9OX0lEIjoiMjA1NzU2NzkzMjM5MzIxNzk4NiJ9.eUxcHN5Nfw85Nx0UiGr8eFe81_EbcvUVeAgAUCMGcbA"
    var UserDetails = jwtDecode(token);
    console.log("aayush token control",UserDetails)
    // Store user details in your application state or storage as needed
    new DataServices().setAllUserDetails(UserDetails)
    sessionStorage.setItem('tokenss',token); // Store the token in sessionStorage
    if(token) {
        navigate('/home/create-strategy')
    }
},[])

  return (
    <div className='container'>Broker Authenticaton in progress....</div>
  )
}
