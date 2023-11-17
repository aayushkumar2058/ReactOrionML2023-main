import React from 'react';
import { Navbar, NavDropdown, Nav, Container } from 'react-bootstrap';
import { FcReading } from "react-icons/fc";

const SideNav = (props) => {
    return (
        <div className='navigationLeft'>
        <div className='navLeftHeader'><FcReading></FcReading>Quick Navigations</div>    
        <ul>
            <li> Sample Link </li>
            <li> Future Option </li>
            <li> About Trading </li>
            <li>Trading History </li>
        </ul>
        </div>
    )
}

export default SideNav;