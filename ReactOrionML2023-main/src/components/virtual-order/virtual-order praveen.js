import React, { useEffect, useState } from 'react';
import ApiServices from '../../services/api.services';
import SideNav from '../common/sideNav/sideNav';
import { Table, Button, Tabs, Form, Tab, Card } from 'react-bootstrap';
import DataServices from '../../services/data.services';
import jwtDecode from 'jwt-decode';
import Loader from '../common/loader/loader';
import classes from './virtualTrade.module.css'
import ErrorWidget from '../common/error-widget/error-widget';


const VirtualOrder_V2 = (props) => {

    const [profitVal, setProfitVal] = useState([]);
    const [virtualTransaction, setVirtualTransaction] = useState([]);
    const [user, setUser] = useState();
    const [error, setError] = useState('')


    useEffect(() => {
        const userEmail = jwtDecode(sessionStorage.getItem('tokenss'))?.email
        setUser(userEmail);
        getAllVorder(user);

    }, [user])

    const getAllVorder = (email) => {
        const payload = {
            "customer_id": email
        }
        if (email) {
            new ApiServices().getAllVirtualOrder(JSON.stringify(payload)).then((response) => {
                setVirtualTransaction(response.Virtual_Txns);
                console.log('virtualTransaction======>', response)

            }, (error) => {
                console.log('Error here')
                setError(error || 'Network Error, kindly please Try later');
            })
        }

    }

    return (
        <>
           <div className='mainContent virtualComponent'>
           {!error?<div>
                <div class="posBtn"><span class="title">Virtual Trade_Praveen</span></div>
                {virtualTransaction?.length !== 0 ? <Table striped>
                    <thead>
                        <tr>
                            <th>Strategies_P</th>
                            <th>Entry Price_P</th>
                            <th>LTP_P</th>
                            <th>P&L_P</th>
                            <th>P&L_New Col</th>
                        </tr>
                    </thead>
                </Table> : null}
                {virtualTransaction?.length === 0 ? <div className={classes.positionLoader}><Loader></Loader></div> : null}
                {virtualTransaction && virtualTransaction?.map((item, index) => <div className='cards'>
                    <div className='cardheader'> <b>{item.Strategy_Name} </b></div>
                    <Table striped>
                    <thead>
                        <tr>
                            <th>Strategies_P</th>
                            <th>Entry Price_P</th>
                            <th>LTP_P</th>
                            <th>P&L_P</th>
                            <th>P&L_New Col</th>
                        </tr>
                    </thead>

                    </Table>
                    <Table>
                        <tbody>
                            {item.TxnsforStrategy?.map((itemNew, index) => <tr>
                                <td><span className={itemNew.txn_type}> {itemNew.txn_type}</span> {item.Underlying}- {itemNew.strike_price}-{itemNew.txn_PE_CE} - {itemNew.expiry_date}</td>
                                <td>{itemNew.orig_txn_price}</td>
                                <td>{itemNew.orig_txn_price}</td>
                                <td>{itemNew.txn_PE_CE}</td>
                            </tr>)}
                        </tbody>
                        <Button > Analyze</Button>
                    </Table>
                </div>)}
                </div>:<ErrorWidget error={error}></ErrorWidget>}
            </div>
        </>



    )
}

export default VirtualOrder_V2;