import React, { useState, useEffect } from "react";
import classes from "./StrategyEditpopOver.module.css";
import {
  Button,
  Form,
  InputGroup,
} from "react-bootstrap";
import DataServices from "../../services/data.services";
import { FcBullish } from "react-icons/fc";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { BiSearchAlt } from "react-icons/bi";
import { FiArrowRight,FiXCircle } from "react-icons/fi";


const StrategyEditPopOver = (props) => {
  console.log ( "Praveen debuggin props to pop up", props)
  const [createdExchangeListMapped, setCreatedExchangeListMapped] = useState([]);
  const [allExchangeListByDateSelected, setAllExchangeListByDateSelected] = useState([]);
  const [expiryDate] = useState(props?.optionchain?.expiryDates);

  //**************************USE EFFECT HOOK START PRAVEEN*************************************//

  useEffect(() => {
      new DataServices().setBasket(createdExchangeListMapped);
     
  }, [createdExchangeListMapped]);

  useEffect(()=>{
    loadExchangeListByDate(props?.optionchain?.expiryDates[0]);
  },[]);

  useEffect(()=>{
    document.getElementsByClassName('modalHeight')[0].scrollTo({
      behavior:'smooth',
      top:1000
    })
  })


  //**************************USE EFFECT HOOK END PRAVEEN*************************************//

  const loadExchangeListByDate = (date) => {
    if(date){
      var allExchangeList = [...props?.optionchain?.data];
      const allExchangeListBy_Date = allExchangeList.filter((item) => {
        return item.expiryDate === date;
      });
      setAllExchangeListByDateSelected(allExchangeListBy_Date)
    }else{
      alert('Network Error')
    }

  };




  const updateSellBuyBtn = (e, index, option, callPut, itemData) => {
    const dataToFilter = [...allExchangeListByDateSelected]
    dataToFilter.map((item, Mapindex) => {
      if (Mapindex === index && option === "B" && callPut === "CE") {
        item["selctedFirstBtn"] === 'yes' ? item["selctedFirstBtn"] = "no" : item["selctedFirstBtn"] = 'yes';
      } else if (Mapindex === index && option === "S" && callPut === "CE") {
        item["selctedSecondBtn"] === 'yes' ? item["selctedSecondBtn"] = "no" : item["selctedSecondBtn"] = 'yes';
      } else if (Mapindex === index && option === "B" && callPut === "PE") {
        item["selctedThirdBtn"] === 'yes' ? item["selctedThirdBtn"] = "no" : item["selctedThirdBtn"] = 'yes';
      } else if (Mapindex === index && option === "S" && callPut === "PE") {
        item["selctedFourthBtn"] === 'yes' ? item["selctedFourthBtn"] = "no" : item["selctedFourthBtn"] = 'yes';
        //setCreatedExchangeListMapped((current) => [...current, eachItem]);
      }
    });
  };



  const onCreateExchangeListMapped = (e, index, option, callPut, item) => {
    console.log('index Dinesh', index)
    updateSellBuyBtn(e, index, option, callPut, item);
    const dataToFilter = [...allExchangeListByDateSelected]
    dataToFilter.map((item, Mapindex) => {
      const eachItem = { ...item };
      eachItem['checked'] = true;

      if (Mapindex === index && option === "B" && callPut === "CE") {
        //eachItem["selctedFirstBtn"] = "yes";
        eachItem["buyOrSell"] = "B";
        eachItem["callOrPut"] = "CE"
        eachItem['id'] = item.expiryDate + item.strikePrice + 'B' + 'CE' + index;
        removeDuplicatesLegs(eachItem)
      } else if (Mapindex === index && option === "S" && callPut === "CE") {
        //eachItem["selctedSecondBtn"] = "yes";
        eachItem["buyOrSell"] = "S";
        eachItem["callOrPut"] = "CE";
        eachItem['id'] = item.expiryDate + item.strikePrice + 'S' + 'CE' + index;
        removeDuplicatesLegs(eachItem)
        //setCreatedExchangeListMapped((current) => [...current, eachItem]);
      } else if (Mapindex === index && option === "B" && callPut === "PE") {
        //eachItem["selctedThirdBtn"] = "yes";
        eachItem["buyOrSell"] = "B";
        eachItem["callOrPut"] = "PE";
        eachItem['id'] = item.expiryDate + item.strikePrice + 'B' + 'PE' + index;
        removeDuplicatesLegs(eachItem)
        //setCreatedExchangeListMapped((current) => [...current, eachItem]);
      } else if (Mapindex === index && option === "S" && callPut === "PE") {
        // eachItem["selctedFourthBtn"] = "yes";
        eachItem["buyOrSell"] = "S";
        eachItem["callOrPut"] = "PE";
        eachItem['id'] = item.expiryDate + item.strikePrice + 'S' + 'PE' + index;
        removeDuplicatesLegs(eachItem)
        //setCreatedExchangeListMapped((current) => [...current, eachItem]);
      }

    });


  };
  //*********************** USE EFECT HOOK**************************************/





  const removeDuplicatesLegs = (eachItem) => {
    setCreatedExchangeListMapped((current) => [...current, eachItem]);
    const dataToFilter = [...createdExchangeListMapped];
    for (let i = 0; i < dataToFilter.length; i++) {
      if (dataToFilter[i]?.id === eachItem.id) { 
        dataToFilter.splice(i,1)
        setCreatedExchangeListMapped([...dataToFilter]);
      }

    }
  }


  const handleSelectedExchangePass = () => {
    const dataToFilter = [...createdExchangeListMapped]

    new DataServices().setBasket(dataToFilter);
    props.closeModal();
  }



  const clearModaPopup = () => {
    const dataToFilter = [...allExchangeListByDateSelected];
    dataToFilter.forEach((item) => {
      item["selctedFirstBtn"] = 'no';
      item["selctedSecondBtn"] = 'no';
      item["selctedThirdBtn"] = 'no';
      item["selctedFourthBtn"] = 'no';
    });
    setCreatedExchangeListMapped([])
    new DataServices().setBasket([]);

  }
  const getWidthOfProgress = (val,action) => {
    const dataToFilter = [...allExchangeListByDateSelected];
    const allOpenInterestArray = dataToFilter.map((item)=> {
      return item[action]?.openInterest
    }).sort((a,b)=> a-b);
    const lower_OI = allOpenInterestArray[0];
    const higher_OI = allOpenInterestArray.pop()
    const percentage = Math.trunc(val/higher_OI*100)
    return `${percentage}%`;
  }


  return (
    <Container fluid className="foo">
      <Row>
        <Col xs={12}>
          <InputGroup className="mb-3">
          <Form.Control
                placeholder="Select Stocks"
                aria-label="Search"
                aria-describedby="Search"
                list="data"
                className='search-form'
                 style={{position: 'relative'}}/>

        <InputGroup.Text ><BiSearchAlt></BiSearchAlt></InputGroup.Text>
              <InputGroup.Text className='hiliteOne'>{props?.optionchain?.data[0]?.CE?.underlying || props?.optionchain?.data[0]?.PE?.underlying}</InputGroup.Text>
              <InputGroup.Text className='hiliteTwo'>{props?.currentPrice} <FcBullish></FcBullish></InputGroup.Text>
          </InputGroup>
        </Col>
        <Col>
          {/* <select >
      
      </select> */}
          <Form.Group className="mb-4">
            {/* <Form.Label htmlFor="disabledSelect">Disabled select menu</Form.Label> */}
            <Form.Select
              id="disabledSelect"
              className="expiryDateInPopover"
              onChange={(e) => loadExchangeListByDate(e.target.value)}
            >
              {expiryDate?.map((item, index) => (
                <option key={'option'+index}>{item}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col>
          <div className="strategyPopOverButton">
            <Button className="cancelBtn" variant="secondary" onClick={handleSelectedExchangePass}>
            Done <FiArrowRight></FiArrowRight>
            </Button>
            <Button className="cancelBtn padRight" variant="primary" onClick={clearModaPopup}>
              Clear<FiArrowRight></FiArrowRight>
            </Button>
          </div>
        </Col>
      </Row>

      <div>
        <div className={classes.titles}>
          <span>Call LTP</span>
          <span>Strike</span>
          <span>Put LTP</span>
        </div>
      </div>
      <div className="modalHeight">
        {allExchangeListByDateSelected.map((item, index) => (
          <div key={'modal'+index} style={{position:'relative'}}>
          
            <div className={`${item.strikePrice < props?.currentPrice ? classes.boxY: classes.boxYb}`}>   
              <span>{item.CE?.lastPrice || 0} </span>
              <span onClick={(e) => onCreateExchangeListMapped(e, index, "B", "CE", item)} className={item.selctedFirstBtn == "yes" ? "activeGreen" : ""}>
                B
              </span>
              <span onClick={(e) => onCreateExchangeListMapped(e, index, "S", "CE", item)} className={item.selctedSecondBtn == "yes" ? "activeRed" : ""} >
                S
              </span>
             <div className="progressContainer">
             <span className="progressBar" style={{width:getWidthOfProgress(item?.CE?.openInterest,'CE')}}></span>
             </div>
            </div>


            
            <div className={`${item.strikePrice > props?.currentPrice ? classes.boxb: classes.box}`}>
              <span>{item.PE?.lastPrice || 0} </span>
              <span onClick={(e) => onCreateExchangeListMapped(e, index, "S", "PE", item)} className={classes.boxings}  >
                <label className={item.selctedFourthBtn == "yes" ? "activeRed" : ""}>
                  S
                </label>
              </span>
             <span style={{float:'left'}}>
             <span onClick={(e) => onCreateExchangeListMapped(e, index, "B", "PE", item)} className={item.selctedThirdBtn == "yes" ? "activeGreen" : ""} >
                B
              </span>
             </span>
             <div className="progressContainerRight">
             <span className="progressBarRight" style={{width:getWidthOfProgress(item?.PE?.openInterest,'PE')}}></span>
             </div>
              <div className={classes.strike} id={props.currentPrice}>{item.strikePrice}</div>
            </div>

          </div>
        ))}
      </div>
    </Container>
  );
};

export default StrategyEditPopOver