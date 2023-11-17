import React, { useEffect, useState } from 'react';
import { Navbar, NavDropdown, Nav, Container } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { FiBox } from "react-icons/fi";
import DataServices from '../../../services/data.services';
import { BsFillPersonFill } from "react-icons/bs";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import jwtDecode from 'jwt-decode';

const Header = (props) => {

  const [user, setUser] = useState({})
//this file needs security scanning and code review
  useEffect(() => {
    const tokenDetails = sessionStorage.getItem('tokenss');
    console.log('USER IS Aayush', tokenDetails)
    if (tokenDetails === null) {
      new DataServices().getAlluserDetails().subscribe((response) => {
        console.log('MY USER DETAILS', response);// secure session id 
        setUser(response)
      })
    } else {
      setUser(jwtDecode(tokenDetails))
      console.log('user', user)//need a security check
    }



    // const token = sessionStorage.getItem('token');

  }, [])
  const logout = () => {
    sessionStorage.clear();
    localStorage.clear();
    setUser({})
    navigate('/login')

  }
  const navigate = useNavigate();
  const iconProfile = 'https://e7.pngegg.com/pngimages/436/585/png-clipart-computer-icons-user-account-graphics-account-icon-vector-icons-silhouette-thumbnail.png'
  const btnOther = <DropdownButton drop='start' title={<img src='https://e7.pngegg.com/pngimages/436/585/png-clipart-computer-icons-user-account-graphics-account-icon-vector-icons-silhouette-thumbnail.png' alt="empty" />}>
    <Dropdown.Item eventKey="1">
    </Dropdown.Item>
    <Dropdown.Item eventKey="2">Account Details</Dropdown.Item>
    <Dropdown.Item eventKey="2">My Orders</Dropdown.Item>
    <Dropdown.Divider />
    <Dropdown.Item eventKey="4" onClick={logout}>Logout</Dropdown.Item>
  </DropdownButton>

  return (
    <Navbar bg="white" variant="white" className='navigationHdr'>
      <Container fluid>
        <Navbar.Brand href="#home">
          <label><FiBox></FiBox></label>
          <b className='themeColor logoFont'>SB OrionML<sub>beta</sub></b>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#/home">Learn How to Trade</Nav.Link>
            <Nav.Link href="#link">Daily Market</Nav.Link>
            <NavDropdown title="Trade" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/home/create-strategy"><Nav.Link href="#/home/create-strategy">Strategy Builder</Nav.Link></NavDropdown.Item>
              <NavDropdown.Item  as={Link} to="/home/virtual-order">
              <Nav.Link href="#/home/virtual-order">Virtual Order</Nav.Link>
              </NavDropdown.Item>
             
              {/* <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item> */}
            </NavDropdown>
          </Nav>
          {/* <Nav.Link onClick={logout}>{}</Nav.Link> */}
          {user.email? <div><b>{user?.given_name + ' ' + user?.family_name}</b></div> : ''}
          {user.unique_name? <div><b>{user?.unique_name}</b></div> : ''}
          {user? <DropdownButton drop='start' variant='datrk' title={<img src={iconProfile} alt="img" />}>
          {/*<Link to={`/strategy-place-order?SECURE_SESSION_ID=${user.SECURE_SESSION_ID}`}>Strategy Place Order</Link> /*} {/*change made*/}   
            <Dropdown.Item eventKey="1"> 
              <b> {user?.given_name} {user?.family_name} {user?.unique_name}</b>
              
              <p className='smallFont'>{user?.email}</p>
            </Dropdown.Item>
            <Dropdown.Item eventKey="2">Account Details</Dropdown.Item>
            <Dropdown.Item eventKey="2">My Orders</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="4" onClick={logout}>Logout</Dropdown.Item>
          </DropdownButton> : btnOther}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header;
