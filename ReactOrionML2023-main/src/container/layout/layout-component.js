import React from 'react';
import { useEffect, useState } from 'react';
import Footer from '../../components/common/footer/footer';
import Header from '../../components/common/header/header';
import SideNav from '../../components/common/sideNav/sideNav';


const Layout = (props) => {
    const [userDetails, setUserDetails] = useState({});
    useEffect(() => {
        const userDetails = JSON.parse(localStorage.getItem('userDetails'));
        setUserDetails(userDetails);
        console.log('userDetails', userDetails?.name);
    }, []);


    return (
        <div>
            {userDetails?.name !== 'Dinesh1' ? <div>
                <Header token={sessionStorage.getItem('token')}></Header>
            </div> : ''}
            {/* {userDetails?.name !== 'Dinesh' ? <div className="sideNav">
             <SideNav></SideNav>
        </div>:''} */}
            <div className='childernElements'>{props.children}</div>
            <Footer></Footer>
        </div>
    )
}

export default Layout;
