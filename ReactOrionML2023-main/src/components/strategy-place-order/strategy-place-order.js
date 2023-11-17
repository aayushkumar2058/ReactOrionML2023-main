import React, { useState } from 'react';
import classes from './StrategyPlaceOrder.module.css';
import { Table, Button, Modal, Form, FormControl, InputGroup, ProgressBar, Row, Col } from 'react-bootstrap';
import CommonServices from '../../services/common.services';
import { useEffect } from 'react';
import axios from 'axios';
import ApiServices from '../../services/api.services';
import { FcOk } from "react-icons/fc";
import DataServices from '../../services/data.services';
import { FiChevronsRight } from "react-icons/fi";
import jwtDecode from 'jwt-decode';


function calculateChecksum(data) {   //changes made on date:08-09-23
  let checksum = 0;
  for (let i = 0; i < data.length; i++) {
    checksum += data.charCodeAt(i);
  }
  return checksum;
}


const StrategyPlaceOrder = (props) => {
 
  const [show, setShow] = useState(false);
  const [placeOrder, setPlaceOrder] = useState([]);
  const [error, setError] = useState('');
  const [isPlaceOrderActive, setIsPlaceOrderActive] = useState(false);
  
  const [totalLeg, setTotalLeg] = useState([]);
  const [pollingInterval, setPollingInterval] = useState(null); // Store the polling interval ID
  const [indexPlaceOrder, setindexPlaceOrder] = useState('');
  const [startPollingFlag, setStartPollingFlag] = useState(true); 
  const [pendingQtyArray, setPendingQtyArray] = useState([]);
  let displayStr=""
  
  console.log('placeOrder data:', placeOrder);
  const convertToEpochTimestamp = (dateString) => {
    return new Date(dateString).getTime();
  };


  //const handleClose = () => setShow(false);
  //const handleShow = () => setShow(true);
  const startPollingOnClick = () => {
    if (startPollingFlag) {
    let pollCount = 0;
    
    const pollInterval = setInterval(() => {
      let shouldPoll = false;// Checking if there's any order to poll
      placeOrder.forEach((order, index) => {
        if (order.statusFromServer !== 'fully_executed' && order.statusFromServer !== 'canceled') {
          shouldPoll = true;
        }
      });
      if (shouldPoll) {
        placeOrder.forEach((order, index) => {
          if (order.statusFromServer !== 'fully_executed' && order.statusFromServer !== 'canceled') {
            fn_poll_singleOrder(index);
          }
        });
      pollCount++;
      console.log('Polling count:', pollCount);//to track the count
      if (pollCount >= 10) {
        clearInterval(pollInterval);
        console.log('Polling stopped');//to indicate the end of polling
      }
    }else {
      // No active orders to poll, stop the interval
      clearInterval(pollInterval);
      console.log('No active orders to poll. Polling stopped');
    }
  }, 2000);  // Adjust the interval time (in milliseconds) as needed

    setPollingInterval(pollInterval);
  } else {
    console.log('Polling not started. Flag is false.');
  }
  };
  useEffect(() => {
    const dta = JSON.parse(localStorage.getItem('legCount'));
    setPlaceOrder(dta.txns);
    dta.txns.forEach((item) => {
      if (item.statusFromServer !== 0) {
        setIsPlaceOrderActive(true)
      }
    });
  }, []);

  const createUID = () => {
    const date = new Date();
    const components = [
      date.getYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    ];
    return components.join("");
  }

  const selectMarketorLimit = (e, orignalIndex) => {
    console.log('foo is ==>', e.target.value);
    var leg = JSON.parse(localStorage.getItem('legCount'));
    var dataToFilter = leg.txns;
    dataToFilter.map((item, index) => {
      if (orignalIndex === index) {
        item['marketorLimit'] = e.target.value
        console.log('test', orignalIndex === index)
      }
    })

  }
  
  const getScript_tag_name = () => {
    const underlying = props?.OptionChain?.records?.data[0]?.CE?.underlying || props?.OptionChain?.records?.data[0]?.PE?.underlying;
    return underlying;
  }
  const fn_poll_singleOrder = (index) => {
    console.log("Polling for order at index:", index); //  to identify the order being polled
    let leg = JSON.parse(localStorage.getItem('legCount'));
    console.log("aayush debug leg",leg)
    const OrderStatusPayload = {
      Reference_Order_ID : "REF_ORD1",
      ClientCode:"Ayush1",
      ScripCode:55084/*
      ClientCode: "55271604",
        OrdStatusReqList: [
            {
                Exch: "N",
                ExchType: "D",
                ScripCode:  44166,
                RemoteOrderID: "PRAV_12oct_v1.03"
            }
          ]*/
    };
    //console.log("order status payload",OrderStatusPayload)
    new ApiServices().doOrderstatusenquiry(JSON.stringify(OrderStatusPayload)).then((res) => {
      //console.log("aayush fired dummy order status enquiry ")
      if (res) {
        const PendingQty = res.PendingQty;
        const Processed_Qty = res.OrderQty - PendingQty;       //i will get value of pending qty and aayush will derive executed qty i.e,qty=(qty-pending qty) 
        
        console.log("aayush order qty,processed qty,pending qty",res.OrderQty,Processed_Qty,PendingQty) 
        //my response is comming properly
        setPendingQtyArray((prevPendingQtyArray) => {   
          displayStr = Processed_Qty+"/"+res.OrderQty;
          console.log("display string debug",displayStr)
          const updatedArray = [...prevPendingQtyArray];
          updatedArray[index] = PendingQty;
          const completedPercentage = ((100 - PendingQty) / 100) * 100; // Calculate completion percentage
          updatedArray[index] = completedPercentage; // Update pendingQtyArray to show completion percentage
  
          return updatedArray;
        });
        console.log('Success');
      }
    }, (error) => {
      console.log('Error is Error')
    })
    
  }
  
  const placeAllOrder = () => {
    const timestamp = createUID();
    const leg = JSON.parse(localStorage.getItem('legCount'));
    console.log('my data',leg)
    const updatdLeg = leg.txns.forEach((item, index) => { return item.UID = `CID_${timestamp}_${index}` })
    const UpdatedPayload = {
      Current_Spot: leg.Current_Spot,
      lot_size: leg.lot_size,
      txn_count: 1,
      txns: leg.txns
    };
    new ApiServices().doPlaceAnorder(JSON.stringify(leg)).then((res) => {
      if (res) {
        console.log('Success');
      }
    }, (error) => {
      console.log('Error is Error')
    })

  };

  const fn_placesingleOrder = (index) => {
    const timestamp = createUID();
    //getting txn basket
    const leg = JSON.parse(localStorage.getItem('legCount'));
    setindexPlaceOrder(index);
    const item = leg.txns[index];
    leg.txns[index]['UID'] = `1500_${timestamp}_${index}`
    const dataToProtect = JSON.stringify(leg);//changes made on date:08-09-23
    const checksum = calculateChecksum(dataToProtect);//changes made on date:08-09-23
    var sessionToken = sessionStorage.getItem('tokenss');// Assuming you've already obtained and stored the token in sessionStorage:change made on:14/09/23
    //console.log("aayush sessionToken",sessionToken)
    var UserDetails = jwtDecode(sessionToken);
    //aayush will read the session storage and retrive the session id which was created during login
    var sessionToken= UserDetails.SECURE_SESSION_ID;
    //console.log("aayush secure session id",sessionToken)
    const scriptTagName = getScript_tag_name();
    
    const RemoteOrderID = `TEST_${timestamp}_Ayush${index}`;
    const getCurrentEpochTime = () => {
      return Math.floor(Date.now() / 1000); // Convert milliseconds to seconds for epoch timestamp
    };
  

    const UpdatedPayload = {
      Current_Spot: leg.Current_Spot,
      lot_size: leg.lot_size,
      txn_count: 1,
      strike_price: leg.txns[index].strike_price,
      txn_PE_CE: leg.txns[index].txn_PE_CE,
      txn_type: leg.txns[index].txn_type,
      txn_UID: leg.txns[index].UID,
      marketorLimit: leg.txns[index].marketorLimit,
      ClientCode: "55271604",//this hard coding has to be removed
      ScripCode: "52875",
      Qty: leg.txns[index].lotsize*leg.txns[index].lotqty,
      RemoteOrderID: RemoteOrderID,
      OrderType: "BUY",
      Script_Name_tag: scriptTagName,
      ValidTillDate: convertToEpochTimestamp(leg.txns[index].expiry_date),
      OrderDateTime: `${getCurrentEpochTime()}000`,
      checksum: checksum, //changes made on date:08-09-23
      SECURE_SESSION_ID: sessionToken,//changes made on date:09-09-23
    };
    console.log("leg debug",leg.txns)
    console.log("validtilldate debug",UpdatedPayload.ValidTillDate)
    console.log("script name tag debug",UpdatedPayload.Script_Name_tag)
    var str_SessionToken= sessionToken;
    //console.log("string session token",str_SessionToken)
    new ApiServices().doPlaceAnorder(JSON.stringify(UpdatedPayload),str_SessionToken).then((res) => {   //change made on :14/09/23
      if (res) {         
        //console.log("sucessfully placed order")
        //i will set bool flag for polling 
        setIsPlaceOrderActive(true)
        setStartPollingFlag(true);
        //let leg = JSON.parse(localStorage.getItem('legCount'));
        console.log("polling for basket index",index)
        fn_poll_singleOrder(index);
        console.log("i finised fn_poll_singleorder")
        leg.txns.map((item, indexItem) => {
          if (indexItem === index) {
            item['statusFromServer'] = res.Order_Status;
            console.log("aayush status from server",item?.statusFromServer)
            //item['Qty'] = updatedQty;   //placed--> partially executed--->fully executed
          }
        })
        const UpdateLegDetails = {
          Current_Spot: leg.Current_Spot,
          lot_size: leg.lot_size,
          txn_count: 1,
          txns: leg.txns
        };
        new DataServices().setBasket(UpdateLegDetails)
        localStorage.setItem('legCount', JSON.stringify(UpdateLegDetails))
        setPlaceOrder(UpdateLegDetails.txns)
        console.log('LEG FROM SERVER', UpdateLegDetails)
      }
    }, (error) => {
      console.log('Error is Error')
    })

  }
  

  return (
    <div className='mainContent_placePrder'>
      <div className='posBtn'>
        <span className='title'>Place Order</span>
        <Button 
          variant="success" 
          className='PlaceOrder f2' 
          onClick={() => { 
            placeAllOrder(); 
            startPollingOnClick();
            }} 
            disabled={isPlaceOrderActive}>
              <FiChevronsRight></FiChevronsRight>Place All Order</Button>
      </div>
      
        
      {placeOrder?.map((item, index) => (
        
        <div className={classes.containerBox} key={index}>
          <div className={classes.titleHead}>
            <span className={item.txn_type === 'B' ? 'buy pattern-diagonal-lines-sm' : 'sell pattern-diagonal-lines-sm'}><span className='textColorWhite'>{item.txn_type === 'B' ? 'BUY' : 'SELL'}</span></span>
            <span className={classes.boldLetter}>
              {getScript_tag_name}
            </span>
            
            
            <span className={classes.boldLetter1}>
              {item?.txn_PE_CE === 'PE' ? 'PUT' : 'CALL'}
            </span>
            <span className={classes.boldLetter2}>
              {item.strike_price}
            </span>
            <span className={classes.boldLetter4}>
              {new Date(item.expiry_date).toDateString()}
            </span>
            <span>

            </span>

            <span className='hdrTitle'>STATUS</span>
          </div>
          <div className={classes.placeOrderContainer}>
            <Form>

              <Row>
                <Col sm={2}>
                  <div>
                    {/* <Form.Check
                    onChange={(e) => selectMarketorLimit(e, index)}
                    type='radio'
                    id='market'
                    label='Market'
                    name='radio'
                    inline
                  />

                  <Form.Check
                    onChange={(e) => selectMarketorLimit(e, index)}
                    type='radio'
                    id='limit'
                    label='Limit'
                    name='radio'
                    inline
                    checked
                    
                  /> */}
                    <div className='radioBtns'>
                      <select onChange={(e) => selectMarketorLimit(e, index)}>
                        <option value="Market">Market</option>
                        <option value="Limit" selected>Limit</option>
                      </select>
                    </div>

                  </div>
                </Col>
                <Col sm={2}>
                  <InputGroup>
                    <InputGroup.Text id="basic-addon1">price</InputGroup.Text>
                    <Form.Control
                      placeholder="Username"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      defaultValue={item.orig_txn_price}
                    />
                  </InputGroup>

                </Col >
                <Col sm={2} className="formControl_placeorder">
                  <InputGroup >
                    <InputGroup.Text id="basic-addon1">Quantity</InputGroup.Text>
                    <Form.Control
                     
                      placeholder="Username"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      defaultValue={item.lotsize *item.lotqty}
                    />
                  </InputGroup>
                </Col>

                <Col sm={3}>
                  <div>
                    
                    {/*cancelBtnShow ? <Button variant="secondary" className="PlaceOrder"> Cancel </Button> : ''}
                    {item?.statusFromServer == 'In Progress' ? (
                    <Button variant="cancel" className="cancelBtn" onClick={()=> cancelBtnShow(index)}> Cancel</Button> ): ''*/}
                    {item?.statusFromServer == '' ? <Button 
                    className="PlaceOrder" 
                    onClick={() => {
                      fn_placesingleOrder(index);
                      startPollingOnClick();
                      }}> Place Order</Button> : ''}
                    {/*item?.statusFromServer == 'In Progress' ? <Button className="PlaceOrder" onClick={() => fn_placesingleOrder(index)}> Modify Order</Button> : ''*/}

                    
                    {index == indexPlaceOrder ? <div className='error'>{error ? error : ''}</div> : ''}
                  </div>
                </Col>
                <Col>
                {isPlaceOrderActive && index === indexPlaceOrder && (
                    <div className='progressBarContainer'>
                      <ProgressBar 
                        variant="warning" 
                        now={(pendingQtyArray[index] || 0) } // Assuming 100 is the total quantity
                        //label={`${100 - (pendingQtyArray[index] || 0)}/100 completed`} // Show the completion percentage
                      />
                      
                      <p>
                      {(pendingQtyArray[index]===0 ? 'progressing....':'completed')}
                      </p>
                      <p>
                      ({ displayStr})
                      
                         
                      </p>
                      

                      </div>
                       )}
                  
                </Col>
              </Row>

            </Form>
          </div>
        </div>
      ))}
      <div>

      </div>
    </div>

  )
}

export default StrategyPlaceOrder;