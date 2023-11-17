import React, { useState, useEffect, useLocalStorage } from 'react';
import { Table, Button, Modal, Form, InputGroup, Alert } from 'react-bootstrap';
import { FcAbout } from "react-icons/fc";
import { AiOutlineBarChart } from "react-icons/ai";
import { FiBarChart2, FiEdit, FiBarChart } from "react-icons/fi";
import { FcBullish } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import { FiXCircle } from "react-icons/fi";
import NumericInput from 'react-numeric-input';
import StrategyEditPopOver from './../../components/strategy-edit-popOver/strategy-edit-popOver';
import classes from './StrategyBuilder.module.css';
import DataServices from '../../services/data.services';
import NSEDropdownList from './../../enum/enum-data'
import ApiServices from '../../services/api.services';
import { FcOk } from "react-icons/fc";
import jwtDecode from 'jwt-decode';
import { BsFillEyeSlashFill } from "react-icons/bs";
import { BiSearchAlt, BiAnalyse, BiCog } from "react-icons/bi";
import { FiArrowRight } from "react-icons/fi";
import Loader from '../common/loader/loader';
import { BiLeftTopArrowCircle } from "react-icons/bi";
import { TbCurrencyRupee } from "react-icons/tb";
import DatalistInput from 'react-datalist-input';
import 'react-datalist-input/dist/styles.css';





const StrategyBuilder = (props) => {
  const lots = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [choosenDate, setChoosenDate] = useState(false);
  const [toggleCEandPE, setToggleCEandPE] = useState(false);
  const [DataWithFilterd, setDataWithFilterd] = useState();
  const [selectedValue, setSelectedValue] = useState('');
  const [Basket_List, setBasket_List] = useState([]); // MAP to table Data a;; list
  const [selectionNSE, setSelectionNSE] = useState([]);
  
  //const [lengthAfterunSelect, setLengthAfterunSelect] = useState();
  
  const [mainCheckbox, setMainCheckbox] = useState(true);
  const [virtualShow, setVirtualShow] = useState(false);
  const [placeOrder, setPlaceOrder] = useState([]);
  const [virtualOrderSuccess, setVirtualOrderSuccess] = useState(false);
  const [strategyname, setStrategyName] = useState();
  const [virtualPlceorderTrigr, setVirtualPlceorderTrigr] = useState(false);

  const handleClose = () => setShow(false);
  const handleVirtualClose = () => setVirtualShow(false)

  const handleShow = () => setShow(true);
  const handleShowVirtual = () => {
    setVirtualShow(true);
    setVirtualOrderSuccess(false);
    setStrategyName('')

  }

  // who is sending this prop to strategy-builder ?? Find out.
  // class Home .. ie home component is calling  strategy builder with the prop.
  
  const [optionchain, setoptionchain] = useState(props?.OptionChain?.records?.data);

  // not sure who is calling this...
  const handleChange = (v) => {
    setDataWithFilterd(v);
    var listSlice = [...props.OptionChain.records.data];
    const dataByDate = listSlice.filter(item => {
      return item.expiryDate === DataWithFilterd;
    });
    //setoptionchainBydate(dataByDate);
  }

  // ***** USE EFFECT HOOK ******************//

  useEffect(() => {
    setSelectionNSE(NSEDropdownList.dropdownNSE);


    new DataServices().getBasket().subscribe((response) => {
      setBasket_List(response);
      localStorage.setItem('strategyBuilder', JSON.stringify(response))
    });

    new DataServices().getLegsCount().subscribe((response) => {
      setPlaceOrder(response)
    })
    const strategyBuilder = JSON.parse(localStorage?.getItem('strategyBuilder'));
    if (strategyBuilder) {
      setBasket_List(strategyBuilder);
    }
    // const data = JSON.parse(localStorage.getItem('legCount'));
    // if(data){
    //   setPlaceOrder(data);
    // }



  }, [optionchain]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('legCount'))
    if (data) {
      setPlaceOrder(data);
    }
  }, [optionchain])


  // const searchUnderlying = (e) => {
  //   setSelectedValue(e.target.value);

  // }

  const mainHandleCheckbox = (e) => {
    console.log("Praveen...Goup Click CLICK :-) ,Basket_List   is ", [...Basket_List])

    const cchkBoxSelect = e.target.checked;
    setMainCheckbox(!!cchkBoxSelect)
    console.log ('few values... !!cchkBoxSelect' , !!cchkBoxSelect)

    const temp_new_Basket_List = [...Basket_List];
    temp_new_Basket_List.map((item, index) => {
      item.checked = e.target['checked'] === true ? true : false

    });
    new DataServices().setBasket(temp_new_Basket_List);
  }

  const handleCheckbox = (e, Clickedindex) => {
    console.log("Praveen... LINE CLICK :-) ,Basket_List   is ", [...Basket_List])
    console.log("Clicked Index is : ", Clickedindex," value is : ", e.target['checked'])
    console.log ('few values... !false : !true' , !false , !true)
    const temp_new_Basket_List = [...Basket_List];
    temp_new_Basket_List.map((item, index) => {
      if (Clickedindex === index) {
        const isChecked = e.target['checked'] === true ? !false : !true;
        return item.checked = isChecked;
      }
    });

    setBasket_List((prevValue) => [...temp_new_Basket_List, ...prevValue]);
    console.log('FANCY SELECTED POSITION ==>', Basket_List);
    console.log('FANCY SELECTED POSITION LENGTH==>' , temp_new_Basket_List.length)
    const foo = [...Basket_List]
    console.log('FANCY foo  LENGTH==>' , foo.length)
    const ActiveBasket = foo.filter((item) => {
      return item.checked === true;
    });

    //setLengthAfterunSelect(ActiveBasket.length)
    
    if (Basket_List.length === ActiveBasket.length) {
      setMainCheckbox(true)
    } else {
      setMainCheckbox(false)
    }


    new DataServices().setBasket(temp_new_Basket_List);
  }

  const toggleCEAndPEHandle = (e, indexNumeric, item) => {
    console.log(e.target.innerHTML, item);
    const temp_new_Basket_List = [...Basket_List];
    const optionchainToFilter = [...props.OptionChain.records.data];

    const FilteredData = optionchainToFilter.filter((currentItem) => {
      return currentItem.expiryDate === item.expiryDate
    }).filter((curItem) => {
      return curItem.strikePrice === item.strikePrice;
    })

    const filteredFinal = FilteredData[0]?.hasOwnProperty(item.callOrPut) ? FilteredData : [];

    console.log('FilteredData', filteredFinal)

    temp_new_Basket_List.map((item, index) => {
      console.log(indexNumeric, index, item.callOrPut)
      if (indexNumeric === index) {
        item['callOrPut'] = e.target.innerHTML === 'CE' ? 'PE' : 'CE';
        const xxx = item['callOrPut'];
        console.log('foo ==>', xxx)
        item[xxx].lastPrice = filteredFinal[0][xxx]?.lastPrice;
        console.log(' item[xxx].lastPrice', filteredFinal[0].strikePrice, item[xxx].lastPrice)
      }
    });
    setBasket_List(temp_new_Basket_List)
    new DataServices().setBasket(temp_new_Basket_List);
  }

  const toggleSellBuyIcon = (e, indexNumeric, element) => {
    console.log(element.buyOrSell)
    const dataToFilterForBS = [...Basket_List];
    dataToFilterForBS.map((item, index) => {
      console.log(indexNumeric, index, item.callOrPut)
      if (indexNumeric === index) {
        console.log(item);
        return item['buyOrSell'] = element.buyOrSell === 'B' ? 'S' : 'B'
      }
    });

    console.log('dataToFilterForBS', dataToFilterForBS)
    setBasket_List(dataToFilterForBS);
    new DataServices().setBasket(dataToFilterForBS);
  }

  const changeLots = (e, indexNumeric, items) => {
    console.log('indexNumeric', indexNumeric)
    const temp_new_Basket_List = Basket_List;
    temp_new_Basket_List.map((item, index) => {
      if (indexNumeric === index) {
        console.log('item[items.callOrPut].lastPrice', item[items.callOrPut].lastPrice, e.target.value)
        item['lotsize'] = +e.target.value;
        item[items.callOrPut].lastPrice = item[items.callOrPut].lastPrice * e.target.value;
      }
    });
    console.log('temp_new_Basket_List Lots === >', temp_new_Basket_List)
    setBasket_List(temp_new_Basket_List)
    new DataServices().setBasket(temp_new_Basket_List);
  }

  // API Call - place Virtual order
  const placeVirtualOrder = () => {
    setVirtualPlceorderTrigr(true)
    const email = jwtDecode(sessionStorage.getItem('tokenss')).email;
    const leg = JSON.parse(localStorage.getItem('legCount'));
    const payload = {
      strategy_name: strategyname,
      customer_id: email,
      lot_size: leg?.lot_size,
      txn_count: leg?.txns.length,
      txns: leg.txns,
      underlying: Basket_List[0]?.PE?.underlying || Basket_List[0]?.CE?.underlying
    };
    new ApiServices().doVirtualOrder(JSON.stringify(payload)).then((res) => {//working in the backend

      if (res) {
        setVirtualPlceorderTrigr(false)
        setVirtualOrderSuccess(true)
        console.log('SUCESS', leg)
      }
    }, (error) => {
      setVirtualPlceorderTrigr(false)
    })
  }


  const changeDate = (e, indexNumeric, item) => {
    const buyOrSell = item.buyOrSell;
    const callOrPut = item.callOrPut;
    const itemExpiryDate = e.target.value;
    const itemStrikePrice = item.strikePrice;
    const optionchain = [...props.OptionChain.records.data];
    setChoosenDate(itemExpiryDate)
    const FilteredData = optionchain.filter((currentItem) => {
      return currentItem.expiryDate === itemExpiryDate
    }).filter((curItem) => {
      return curItem.strikePrice === itemStrikePrice;
    })
    console.log('FilteredData-Above', FilteredData)
    const filteredFinal = FilteredData[0]?.hasOwnProperty(item.callOrPut) ? FilteredData : [];
    filteredFinal.length === 0 ? setShowAlert(true) : setShowAlert(false);
    console.log('FilteredData Below', filteredFinal)
    const temp_new_Basket_List = [...Basket_List];
    temp_new_Basket_List.map((itemNew, index) => {
      if (indexNumeric === index) {
        itemNew[callOrPut].lastPrice = filteredFinal.length !== 0 ? filteredFinal[0][callOrPut].lastPrice : '--';
        itemNew[callOrPut].impliedVolatility = filteredFinal.length !== 0 ? filteredFinal[0][callOrPut].impliedVolatility : '--';
        itemNew['strikePrice'] = filteredFinal[0]?.strikePrice;
        itemNew['expiryDate'] = filteredFinal[0]?.expiryDate;

        return itemNew;
      }

    });

    console.log('temp_new_Basket_List', temp_new_Basket_List)
    setBasket_List(temp_new_Basket_List)
    new DataServices().setBasket(temp_new_Basket_List);
  }
  const priceChange = (e, indexPrice, item) => {
    console.log('priceChange e.target.innerHTML==========================>', typeof (+e.target.innerHTML))
    const selectedPriceChnage = Basket_List;
    if (item.callOrPut === 'PE') {
      selectedPriceChnage.filter((item, index) => {
        if (indexPrice === index) {
          return item.PE.lastPrice = parseInt(e.target.innerHTML);
        }
      });

    } else {
      selectedPriceChnage.filter((item, index) => {
        if (indexPrice === index) {
          return item.CE.lastPrice = parseInt(e.target.innerHTML);
        }
      });
    }
    new DataServices().setBasket(selectedPriceChnage);
  }

  const NumericInputChange = (e, indexNumeric, itemCurrent) => {
    const callOrPut = itemCurrent.callOrPut;
    console.log(e, indexNumeric, itemCurrent.callOrPut, itemCurrent.expiryDate)

    const optionchainToFilter = [...props.OptionChain.records.data];
    const FilteredData = optionchainToFilter.filter((item, index) => {
      return item.expiryDate === itemCurrent.expiryDate
    }).filter((itemNew) => {
      return itemNew.strikePrice === e
    });

    console.log('itemCurrent.callOrPut---', itemCurrent.callOrPut)
    const filteredFinal = FilteredData[0]?.hasOwnProperty(itemCurrent.callOrPut) ? FilteredData : [];
    console.log('dataToFilterNummeric', filteredFinal)
    const dataToFilterNummeric = [...Basket_List];
    dataToFilterNummeric.map((itemNew, index) => {
      if (indexNumeric === index) {
        itemNew[callOrPut].lastPrice = filteredFinal.length !== 0 ? filteredFinal[0][callOrPut]?.lastPrice : '--';
        itemNew[callOrPut].impliedVolatility = filteredFinal.length !== 0 ? filteredFinal[0][callOrPut].impliedVolatility : '--';
        itemNew['strikePrice'] = filteredFinal[0]?.strikePrice;
        itemNew['expiryDate'] = filteredFinal[0]?.expiryDate;
      }

    });
    console.log('dataToFilterNummeric====>', dataToFilterNummeric)
    setBasket_List(dataToFilterNummeric)
    new DataServices().setBasket(dataToFilterNummeric);
  }

  const deleteStrategyRow = (item, index) => {
    const listToDelete = [...Basket_List];
    listToDelete.splice(index, 1);
    setBasket_List(lists => ([...lists, ...listToDelete]));
    new DataServices().setBasket(listToDelete);
  }

  const getPremiumCalc = () => {
    console.log('getPremiumCalc-pc.. fixed defect')   // 23 jun 2023
    const oActive_Basket_List = [...Basket_List].filter((x)=>{return (x.checked===true? true:false)});
    const sum = oActive_Basket_List.map((item, index) => {
      console.log ( "Premium debug", item )
      //return (item.buyOrSell === 'B' && item.checked === true) ? parseInt(item[item.callOrPut].lastPrice) : -parseInt((item[item.callOrPut].lastPrice))
      return ( item.buyOrSell === 'S' ? parseInt(item[item.callOrPut].lastPrice)
                                                                : -parseInt(item[item.callOrPut].lastPrice)  
              )
    }).reduce((partialSum, a) => partialSum + a, 0)
    return sum
  }

  const closeModal = () => {
    handleClose();
  }

  const navigateToNewWnd = () => {
    const url = window.location.origin;
    console.log(url + '/place-order')
    //window.open('/place-order')
    window.open(window.location.origin + "#/place-order", '_blank', 'toolbar=0,location=0,menubar=0');//place-order_aayush

  }

  const isCheckedorNot = () => {
    return true
  }

  const resetPrice = () => {

  }

  const clearTrades = () => {
    setBasket_List([])
  }

  const loadVirtualOrder = () => {
    navigate('/home/virtual-order')
  }
  
  const getStepValue = () => {
    const underlying = props?.OptionChain?.records?.data[0]?.CE?.underlying || props?.OptionChain?.records?.data[0]?.PE?.underlying
    if (underlying === 'NIFTY') {
      return 50;
    } else if (underlying === 'BANKNIFTY') {
      return 100;
    } else if (underlying === 'RELIANCE') {
      return 20;
    }
    else {
      return 50;
    }

  }

  const onDataListSelect =(e)=>{
    console.log ("Strategy-builder.js: Prav... the underlying is being changed, new value:",e.value)
    setSelectedValue(e.value || '');
  }



  const loader = <Loader></Loader>
  return (

    <div>
      <div>
        <div >
          {/* {JSON.stringify(Basket_List)} */}
          <div className={classes.filterContainer}>
           
            <InputGroup>
            <DatalistInput
              placeholder="Search Underlying (Index or Equity)"
              onSelect={(e)=>onDataListSelect(e)}
              items={selectionNSE}
            />
              {/* <Form.Control
                placeholder="Search Underlying (Index or Equity)"
                aria-label="Search"
                aria-describedby="Search"
                list="data"
                name='data'
                className='search-form'
                onChange={(e) => searchUnderlying(e)}
              />

              <datalist id="data">
                {selectionNSE.map((item, key) =>
                  <option key={key} category={item.category} value={item.company} />
                )}

              </datalist> */}
              {/* <Button className="cancelBtn" onClick={() => props.getoptionchainSelected(selectedValue)} variant="outline-secondary" id="button-addon2">
                Search
              </Button> */}
              <InputGroup.Text className={selectedValue?'x':'disabledInGp'}  onClick={() => props.getoptionchainSelected(selectedValue)}><BiSearchAlt></BiSearchAlt></InputGroup.Text>
              <InputGroup.Text className='hiliteOne'>{props?.OptionChain?.records?.data[0]?.CE?.underlying || props?.OptionChain?.records?.data[0]?.PE?.underlying}</InputGroup.Text>
              <InputGroup.Text className='hiliteTwo'>{props?.OptionChain?.records?.underlyingValue} <FcBullish></FcBullish></InputGroup.Text>

            </InputGroup>

          </div>
        </div>
        {Basket_List.length > 0 ? <div className='tablecontainer_builder'>
          <Table size="sm" className='tableBuilder'>
            <thead >
              <tr>
                <th style={{ fontSize: '15px' }}>
                  <Form.Check aria-label='test' checked={mainCheckbox} onChange={((e) => mainHandleCheckbox(e))} />
                </th>
                <th> B/S </th>
                <th> Expiry </th>
                <th > Strike </th>
                <th > CE/PE </th>
                <th > Lots </th>
                <th > Price </th>
                <th >  </th>
              </tr>
            </thead>
            <tbody>
              {Basket_List.map((item, index) => <tr key={index}>
                <td>
                  <Form.Check aria-label={`option${index}`}
                    name={`option${index}`}
                    id={`option${index}`}
                    checked={item.checked}
                    onChange={((e) => handleCheckbox(e, index))} />
                </td>
                <td> <span className={`${item.buyOrSell} pattern-diagonal-lines-sm`} onClick={(e) => { toggleSellBuyIcon(e, index, item) }}><span className='textColorWhite'>{item.buyOrSell}</span></span> </td>
                <td>
                  <Form.Group>
                    <Form.Select onChange={(e) => changeDate(e, index, item)}>
                      {props?.OptionChain?.records?.expiryDates?.map((items, index) => (
                        <option key={index} value={items} selected={item.expiryDate === items}>{items}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </td>
                <td>
                  <InputGroup className="mb-1" readonly={true}>
                    {/* <FormControl aria-label="Amount (to the nearest dollar)" value={item.strikePrice} readOnly /> */}
                    <NumericInput className="form-control" onChange={(e) => NumericInputChange(e, index, item)} step={getStepValue()} mobile defaultValue={item.strikePrice} />
                  </InputGroup>
                </td>
                <td><span className={classes.pe} onClick={(e) => toggleCEAndPEHandle(e, index, item)}>{item.callOrPut}</span></td>
                <td >
                  <Form.Group className='slotSize'>
                    <Form.Select onChange={(e) => changeLots(e, index, item)}>
                      {lots.map((item, index) => (
                        <option key={index} value={item} >{item}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </td>
                <td>
                  <span className="editPrice" suppressContentEditableWarning={true} contentEditable onKeyUp={(e) => priceChange(e, index, item)}>{item.callOrPut === 'PE' ? item.PE?.lastPrice : item.CE?.lastPrice}</span>
                </td>
                <td className='cursor'><FiXCircle onClick={() => deleteStrategyRow(item, index)}></FiXCircle></td>
              </tr>)}
            </tbody>
          </Table>
          <div className={classes.builderFooter}>
            <a onClick={clearTrades}>Clear Trads <BiCog></BiCog></a>
            <a onClick={resetPrice}>Reset Prices <BiAnalyse></BiAnalyse></a>
            <span className={classes.net}>Net Premium Get<b>
              <TbCurrencyRupee></TbCurrencyRupee>{getPremiumCalc()?.toFixed(2)}
            </b></span>
          </div>
        </div> : ''}
        {Basket_List.length === 0 ? <div><div className='initialContainer'>
          <p>
            <BsFillEyeSlashFill></BsFillEyeSlashFill>
          </p>
          <p className='smallXX'>There is no startegy created yet, <br />You can create startegy by clicking below button</p>
          <div>
            <Button variant="outline-primary" className='cancelBtnColoured pattern-diagonal-lines-sm colorForPattern' onClick={handleShow}>
              <AiOutlineBarChart></AiOutlineBarChart>
              <span className='textColorWhite'><b>Build a new custom strategy</b></span>
            </Button>
          </div>
        </div> </div> : null}
        <div className='alertWarning'>
          {showAlert ? <Alert key="warning" variant="warning" className='error-message'>
            No Liquidity price is availablefor this choosen date <b>{choosenDate}</b>
          </Alert> : ""}
        </div>
        {Basket_List.length > 0 ? <div className='butonGroup'>
          <Button variant="outline-primary" className='cancelBtn' size='sm' onClick={handleShowVirtual}><FiBarChart2></FiBarChart2>Virtual Trade</Button>
          <Button variant="outline-primary" className='cancelBtn' size='sm' onClick={navigateToNewWnd}><FiBarChart></FiBarChart>Trade All</Button>
          <Button variant="outline-primary" className='cancelBtn' onClick={handleShow} size='sm'><FiEdit></FiEdit>Add/Edit</Button>
        </div> : null}
        <div className={classes.modelContainer}>
          <Modal show={show}
            onHide={handleClose} className="modelContainer" >
            <Modal.Header closeButton >
            </Modal.Header>
            <Modal.Body >
              {console.log ("Option chain is ", props?.OptionChain?.records)}
              <StrategyEditPopOver closeModal={closeModal} optionchain={props?.OptionChain?.records} currentPrice={props?.OptionChain?.records?.underlyingValue}></StrategyEditPopOver>
            </Modal.Body>
          </Modal>
        </div>

        <div className={classes.modelContainerVirtual}>
          <Modal show={virtualShow}
            onHide={handleVirtualClose} className="modelContainerVirtaul" >
            <Modal.Header closeButton >
              <b>Create a Virtual Strategy Praveen</b>
            </Modal.Header>
            <Modal.Body >

              {!virtualOrderSuccess ? <input type="text" placeholder='Strategy Name' className='inputStrategy' onChange={(event) =>
                setStrategyName(event.target.value)
              } /> : ''}
              {!virtualOrderSuccess ? <ul>
                {placeOrder?.txns?.map((items, index) => (
                  <li className='tableLi'>
                    <span className={`${items.txn_type}1 pattern-diagonal-lines-sm`}><label className='textColorWhite'>{items.txn_type} </label></span>
                    <span>{Basket_List[0]?.PE?.underlying || Basket_List[0]?.CE?.underlying}</span>
                    <span>{new Date(items.expiry_date).toLocaleDateString()}</span>
                    <span><b>{items.strike_price}</b></span>
                    <span>{items.txn_PE_CE}</span>
                    <span className='lastChild'>Price: {items.orig_txn_price} | Qty: {items.lotsize * items.lotqty}</span>
                  </li>
                ))}

              </ul> :
                <div className='virtualOrderSuccessBlock'>
                  <icon><FcOk></FcOk></icon><br />
                  Trades added to virtual portfolio
                  <button className='cancelBtnActive' onClick={loadVirtualOrder}>Open Full Virtual Portfolio <FiArrowRight></FiArrowRight></button>

                </div>
              }
            </Modal.Body>
            {!virtualOrderSuccess ? <Modal.Footer>
              <button className='cancelBtn' onClick={handleVirtualClose}>Cancel</button>
              <button className='cancelBtn' onClick={placeVirtualOrder} disabled={strategyname?.trim().length === 0 || virtualPlceorderTrigr}>
                {!virtualPlceorderTrigr ? 'Create Virtual Order' : loader}
              </button>
            </Modal.Footer> : ''}
          </Modal>
        </div>


      </div>
    </div>
  )
}


export default StrategyBuilder;