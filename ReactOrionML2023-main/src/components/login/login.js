import {React, useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Navigate, useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import DataServices from '../../services/data.services';
import AuthService from '../../services/auth.service';
import imageLogo from './../../assets/images/logo.png'

const Login = (props) => {
  const navigate = useNavigate();
  useEffect(()=>{
    const isLoggedIn = new AuthService().isLoggedIn;
    console.log('isLoggedIn',isLoggedIn)
    if(isLoggedIn){
      navigate('/home/create-strategy');
    }
    // if(isLoggedIn){
    //   Navigate('/foo')
    // }

    
    //this is a google login
    window.google?.accounts.id.initialize({
      // Dashing concha , praveen is 1024...
      // client_id: '1024628067062-g2vm5beu97l76egljambv656tnib2fba.apps.googleusercontent.com',

      // Local host , Dinesh is 1413...
      client_id:'141392760543-9qsse1qk5fl8s5emqj23fa5vr4brjjnm.apps.googleusercontent.com',
      callback: handleCallbackresponse
    });
    window.google?.accounts.id.renderButton(
      document.getElementById('signInBtn'),
      {
        theme:'outline',
        size:'1000'
      }
    )

  },[]);
  // get the user details,
  const handleCallbackresponse =(response) => {  
    if(response) {
      var UserDetails = jwtDecode(response.credential);
      console.log()
      new DataServices().setAllUserDetails(UserDetails)  //new DataServices :to lookback at some time
      sessionStorage.setItem('tokenss', response.credential);
      navigate('/home/create-strategy');
    }
  

  }
  
  // const login = () => {
  //   //window.redirect('https://dashing-concha-f2dbf6.netlify.app/iifl_login_success/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjU1MjcxNjA0Iiwicm9sZSI6IjYwIiwibmJmIjoxNjc3NjQzMjQyLCJleHAiOjE2Nzc2NzkyNDIsImlhdCI6MTY3NzY0MzI0Mn0.edlEBXoZM_s0GQfcKDzmA1CfiO089KGbdj9Y3phR-hQ');
  //   //navigate('#/dashing-concha-f2dbf6.netlify.app/iifl_login_success/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjU1MjcxNjA0Iiwicm9sZSI6IjYwIiwibmJmIjoxNjc3NjQzMjQyLCJleHAiOjE2Nzc2NzkyNDIsImlhdCI6MTY3NzY0MzI0Mn0.edlEBXoZM_s0GQfcKDzmA1CfiO089KGbdj9Y3phR-hQ')
  //   navigate('/auth/iifl_login_success/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjU1MjcxNjA0Iiwicm9sZSI6IjYwIiwibmJmIjoxNjc3NjQzMjQyLCJleHAiOjE2Nzc2NzkyNDIsImlhdCI6MTY3NzY0MzI0Mn0.edlEBXoZM_s0GQfcKDzmA1CfiO089KGbdj9Y3phR-hQ');
  // }


  //this is an iifl broker login
  const login = () => {
      var f = document.createElement('form');
      f.action = 'https://ttweb.indiainfoline.com/trade/Login.aspx';
      f.method = 'POST';
      var i = document.createElement('input');
      i.type = 'hidden';
      i.name = 'VP';
      i.value = 'https://3mhp76sl13.execute-api.us-east-1.amazonaws.com/test/txn_redirect';
      f.appendChild(i);
      var i = document.createElement('input');
      i.type = 'hidden';
      i.name = 'UserKey'
      i.value = 'igjCsLkj8dOrD4wqo18X3WTdop6xqM3F'
      f.appendChild(i);
      document.body.appendChild(f);
      f.submit();
  }



  return (
    <div className='loginContainer'>
      <div className='loginText'>
        <p>Welcome to</p>
        <h2 className='title_bg reset'>SB Orion ML</h2>
        <p><br />
          India’s first and biggest Options Trading Platform.<br />
          Quality trades, expert research, strategies for total risk<br /> management
        </p>
      </div>
      <div className='loginArea'>
        <Card style={{ width: '33rem', height: '270px', margin: '0px auto', border: ' 1px #673ab73b solid' }}>
          <Card.Body>
            <Card.Title>
              <h2 className='title'>Please Choose your Broker</h2>
            </Card.Title>
            <div >
              <div className='loginBox'>
                <div onClick={login}>
                  <img src={imageLogo}/>
                </div>
                <div onClick={login} className="inactive">GL</div>
                <div onClick={login} className="inactive">DK</div>
                <div onClick={login} className="inactive">DI</div>
              </div>
            </div>
          </Card.Body>
        </Card>
        <div>
          <h2 className='title_sml'> Don’t have a broker account ?</h2>
          {/* <div class="g-signin2" data-onsuccess={onSignIn}>test-1</div> */}
          <div id='signInBtn'></div>
          {/* <Button className='cancelBtn'>Login With Gmail</Button> <Button className='cancelBtn'>Login With Facebook</Button> */}
        </div>
      </div>
      <div> 
      </div>
    </div>

  )
}

export default Login;
