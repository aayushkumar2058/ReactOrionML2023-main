import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Title, Legend, Filler,Tooltip } from 'chart.js';
import { Line } from 'react-chartjs-2';
import CommonServices from './../../services/common.services';
import DataServices from './../../services/data.services';
import { FaEyeSlash } from "react-icons/fa";
import { Table, Button, Tabs, Form, Tab, Card } from 'react-bootstrap';
import { TbCurrencyRupee } from "react-icons/tb";

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip

)

const PayOffGraph = (props) => {
    console.log ( "Praveen : Payoff graph props are ",props)
    const [graphList, setGraphList] = useState([]);
    const [xg, setXg] = useState();
    const [yg, setYg] = useState();
    const [profit, setprofit] = useState();
    const [ygcurrent, setYgcurrent] = useState();
    const [ygAdjusted, setYgAdjusted] = useState();
    const [expiry, setExpiry] = useState(2);
    const [gridData, setGridData] = useState([]);
    const [rangeDate, setRangeDate] = useState()
    const s_CURRENT_CERTIFICATE_KEY="QWRtaW4iLCJJc3N1dxfdQi_2"
            
    // This is the function that is triggered onChange of expiry date... // praveen adding comment
    const handleExpiry = (e) => {
        console.log('handleExpiry... golden select', e.target.value);
        setRangeDate(e.target.value)
        new CommonServices().setExpiryDetails(e.target.value);
    }

    /**************************************************************************/
    useEffect(() => {
        console.log ("prav... first use effect trigged . Please check how many times" )
        
        new CommonServices().getExpiryDetails().subscribe(daysToExpire => {
            console.log ("prav... got this via subscribe Days daysToExpire(",daysToExpire,")" )
            setExpiry(daysToExpire)
            // comment start by praveen , does not seem relevant 31 may 
            const payoff_expiry = window.fn_common_payoff_calc_PROF(s_CURRENT_CERTIFICATE_KEY,"EXPIRY", json_TxnCollection);
            const payoff_current = window.fn_common_payoff_calc_PROF(s_CURRENT_CERTIFICATE_KEY,"CURRENT", json_TxnCollection);
            const payoff_adjusted = window.fn_common_payoff_calc_PROF(s_CURRENT_CERTIFICATE_KEY,"ADJUSTED", json_TxnCollection, daysToExpire);
            const data_array_adjusted = payoff_adjusted.data;
            var xg = []
            var yg = []
            var yg_current = []
            var yg_adjusted = [];   // 20 Aug

            for (let iGIndex = 0; iGIndex < data_array_adjusted?.length; iGIndex++) {
                yg_adjusted.push(data_array_adjusted[iGIndex].payoff * 50) // 20 aug
                setYgAdjusted(yg_adjusted)
            }
            
            //comment end by praveen , does not seem relevant 31 may 
            
        });

/*  praveen commented to debug on 31 may

        new DataServices().getAllSelectedExchange().subscribe((response) => {
            console.log ("prav... second subscribe getAllSelectedExchange(",response,")" )
            const selected = response.filter((item) => {
                return item.checked === true;
            });
            
            console.log ("Danger... selected item for graphlist is",selected)

            setGraphList(selected);
        });
        
*/


        const graphDataJson = graphList?.map((item, index) => {
            return {
                "txn_index_id": index,
                "txn_type": item.buyOrSell,
                "expiry_date": new Date(item.expiryDate),
                "txn_PE_CE": item.callOrPut,
                "strike_price": item.strikePrice || 0,
                "iv": item[item.callOrPut]?.impliedVolatility,
                "orig_txn_price": item[item.callOrPut]?.lastPrice,
                "lotsize": item.lotsize || 1,
                "lotqty": 50,
                "statusFromServer": 0,
                "marketorLimit": 'Limit'
            }
        });
        const json_TxnCollection = {
            "txn_count": graphDataJson?.length,
            "lot_size": 50,
            "Current_Spot": props.marketPrice, //dynamic from Slider
            "txns": graphDataJson
        };



        if (graphDataJson?.length > 0) {
            console.log('Error Still This Page ???')
            localStorage.setItem('legCount', JSON.stringify(json_TxnCollection));
            new DataServices().setLegsCount(json_TxnCollection)
            console.log('Praveen... Gold... is this interesting block firing')
            
            const payoff_expiry = window.fn_common_payoff_calc_PROF ? window.fn_common_payoff_calc_PROF(s_CURRENT_CERTIFICATE_KEY,"EXPIRY", json_TxnCollection) : '';
            const payoff_current = window.fn_common_payoff_calc_PROF ? window.fn_common_payoff_calc_PROF(s_CURRENT_CERTIFICATE_KEY,"CURRENT", json_TxnCollection) : '';
            const payoff_adjusted = window.fn_common_payoff_calc_PROF ? window.fn_common_payoff_calc_PROF(s_CURRENT_CERTIFICATE_KEY,"ADJUSTED", json_TxnCollection, expiry) : '';
            const data_array_expiry = payoff_expiry.data
            const data_array_current = payoff_current.data;
            const data_array_adjusted = payoff_adjusted.data; // 20 aug
            const jsonProfits = { BreakEven: payoff_expiry.BKEven_Text_Final, maxProfit: payoff_expiry.max_profit, maxLoss: payoff_expiry.max_loss, expiry: Math.ceil(window.fn_TimetoExpiry(json_TxnCollection)), breaks: payoff_expiry.BKEvenLeft, breaks1: payoff_expiry.BKEvenRight }
            const Grid_data = window.projected_payoff_withSPOTandExpiry(json_TxnCollection, (1 - 0 * 1 * 1 / 24), props.marketPrice) //dynamic from Slider
            console.log("Project payoff and Grid Data", Grid_data)
            setGridData(Grid_data);
            console.log('setGridData ==========>', gridData)
            setprofit(jsonProfits)
            new CommonServices().setProfitDetails(jsonProfits);

            var xg = []
            var yg = []
            var yg_current = []
            var yg_adjusted = [];   // 20 Aug

            for (let iGIndex = 0; iGIndex < data_array_expiry?.length; iGIndex++) {
                yg.push(data_array_expiry[iGIndex].payoff * 50)
                yg_current.push(data_array_current[iGIndex].payoff * 50)
                xg.push(data_array_expiry[iGIndex].index);
                yg_adjusted.push(data_array_adjusted[iGIndex].payoff * 50) // 20 aug
                setXg(xg)
                setYg(yg)
                setYgcurrent(yg_current)
                setYgAdjusted(yg_adjusted)
            }
        }
    //}, [expiry]);    //expiry
    return( ()=> { console.log ("Unmouting First use effort in PAYOFF GRAPH ",)})

    }, [graphList]);   // Praveen Test Debug original code

    useEffect(() => {
        console.log('Checking Build Issue')
        const localStorageSelected = JSON.parse(localStorage.getItem('strategyBuilder'));
        console.log ( "prav... local storage val",localStorageSelected )
        console.log ( "prav... local storage val",localStorageSelected )
        setGraphList(localStorageSelected);
        return( ()=> { console.log ("Unmouting Second use effort in PAYOFF GRAPH ",)})

    }, [])

// praveen added above block to debug 31 may 2023

        new DataServices().getAllSelectedExchange().subscribe((response) => {
            console.log ("prav... second subscribe getAllSelectedExchange(",response,")" )
            const selected = response.filter((item) => {
                return item.checked === true;
            });
            
            console.log ("Danger... selected item for graphlist is",selected)

            setGraphList(selected);
        });

// praveen added above block to debug 31 may 2023

    const getTotalTargetPL = (data, header) => {
        var element = []
        data?.map((item, index) => {
            element.push(+item[header])
        })
        const sum = element.reduce((partialSum, a) => partialSum + a, 0);
        return sum;
    }
    // maybe this is better place to subscribe for 

    // const getTotalTargetTargetPrice =(data) => {
    //     var element= []
    //     data?.map((item,index)=>{
    //         element.push(item.target_price)
    //     })
    //     console.log('Element is', element);
    //     const sum = element.reduce((partialSum, a) => partialSum + a, 0).toFixed(2)
    //     return sum;
    // }
    // const ctx = document.getElementById('myChart');
    // const down = (ctx, value) => ctx.p1.parsed.y < 0 && ctx.p0.parsed.y < 0 ? value : 'green';
    // const downfill = (ctx, value) => ctx.p1.parsed.y < 0 && ctx.p0.parsed.y < 0 ? value : 'rgb(144, 238, 144,0.6)'
    const data = {
        labels: xg,
        datasets: [

            {
                label: '',
                data: yg,
                backgroundColor: 'green',
                borderColor: "green",
                tension: 0.2,
                fill: true,
                fillColor: 'yellow',
                pointStyle: 'star',
                pointRadius: 0,
                borderWidth: 2,
                // segment: {
                //     borderColor: ctx => down(ctx, 'red'),
                //     fill: true,
                //     backgroundColor: ctx => downfill(ctx, 'rgb(255, 204, 203,0.4)'),
                // },
            },

            {
                label: '',
                data: ygcurrent,
                borderColor: "blue",
                backgroundColor: 'blue',
                pointRadius: 0,
                borderWidth: 1
            },
            {
                label: '',
                data: ygAdjusted,
                borderColor: "red",
                backgroundColor: 'red',
                pointRadius: 0,
                borderWidth: 2
            }]
    };
    const options = {
        maintainAspectRatio: false,
        scales: {

        },
        plugins:{
            tooltip:{
                bodyColor:'#fff',
                bodyFontSizeColor:'30',
                padding:20,
                titleColor:'#fff',
                yAlign:'bottom',
                displayColors:false,
                textDirection:'rtl',
                multiKeyBackground:'green',
                cornerRadius:4,
                footerColor:'yellow',
                callbacks:{
                    label: function(){
                        var label = 'Future Options'
                        return label
                    }
                }
            }
        },
        legend: {
            labels: {
                fontSize: 1
            }
        }
    }



    return (
        <div className='graphC'>

            <Card>
                {/* <Card.Header>Leads Tracking</Card.Header> */}
                <Card.Body className='resetPadding'>

                    <Tabs
                        defaultActiveKey="PayOff_Graph"
                        id="uncontrolled-tab-example"

                    >
                        <Tab eventKey="PayOff_Graph" title="PayOff Graph">
                            {graphList?.length > 0 ? <Line
                                data={data}
                                options={options}
                                height={400}
                                width={600}

                            /> : <div className='noData'>
                                <FaEyeSlash></FaEyeSlash>
                                <p>There is no leg has been selected </p>
                            </div>}
                        </Tab>
                        <Tab eventKey="Pl_Grid" title="P&L Grid">
                            <div className='plGrid'>
                                <Table >
                                    <thead>
                                        <tr>
                                            <th>Position</th>
                                            <th>Entry Price</th>
                                            <th>Target price</th>
                                            <th>Target PNL</th>
                                            <th>LTP</th>
                                        </tr>
                                    </thead>
                                    <tbody>


                                        {gridData.PNL_Table?.map((item, index) =>
                                            <tr>
                                                <td key={'grid' + index} >{item.position}</td>
                                                <td key={'grid1' + index} >{item.entry_price}</td>
                                                <td key={'grid2' + index} >{item.target_price.toFixed(2)}</td>
                                                <td key={'grid3' + index} >{item.target_PNL.toFixed(2)}</td>
                                                <td key={'grid4' + index} >{item.LTP}</td>
                                            </tr>
                                        )}

                                        <tr className='lastTr'>

                                            <td><b>Total Project </b></td>
                                            <td> <TbCurrencyRupee></TbCurrencyRupee>{getTotalTargetPL(gridData.PNL_Table, 'entry_price').toFixed(2)}</td>
                                            <td> <TbCurrencyRupee></TbCurrencyRupee>{getTotalTargetPL(gridData.PNL_Table, 'target_price').toFixed(2)}</td>
                                            <td> <TbCurrencyRupee></TbCurrencyRupee>{getTotalTargetPL(gridData.PNL_Table, 'target_PNL').toFixed(2)}</td>
                                            <td><TbCurrencyRupee></TbCurrencyRupee>{getTotalTargetPL(gridData.PNL_Table, 'LTP').toFixed(2)}</td>

                                        </tr>


                                    </tbody>
                                </Table>
                            </div>
                        </Tab>
                        <Tab eventKey="Greeks" title="Option Greeks" >
                            <div className='plGrid'>
                                <Table >
                                    <thead>
                                        <tr>
                                            <th>Position</th>
                                            <th>Decay</th>
                                            <th>Delta</th>
                                            <th>Gamma</th>
                                            <th>Theta</th>
                                            <th>Vega</th>
                                        </tr>
                                    </thead>
                                    <tbody>


                                        {gridData.Greeks_Table?.map((item, index) =>
                                            <tr>
                                                <td key={'greek' + index} >{item.position}</td>
                                                <td key={'greek1' + index} >{item.Decay}</td>
                                                <td key={'greek2' + index} >{item.Delta}</td>
                                                <td key={'greek3' + index} >{item.Gamma}</td>
                                                <td key={'greek4' + index} >{item.Theta}</td>
                                                <td key={'greek5' + index} >{item.Vega}</td>
                                            </tr>
                                        )}

                                        <tr className='lastTr'>

                                            <td><b>Total (projected)</b></td>
                                            <td><TbCurrencyRupee></TbCurrencyRupee>{getTotalTargetPL(gridData.Greeks_Table, 'Decay').toFixed(2)}</td>
                                            <td><TbCurrencyRupee></TbCurrencyRupee>{getTotalTargetPL(gridData.Greeks_Table, 'Delta').toFixed(2)}</td>
                                            <td><TbCurrencyRupee></TbCurrencyRupee>{getTotalTargetPL(gridData.Greeks_Table, 'Gamma').toFixed(2)}</td>
                                            <td><TbCurrencyRupee></TbCurrencyRupee>{getTotalTargetPL(gridData.Greeks_Table, 'Theta').toFixed(2)}</td>
                                            <td><TbCurrencyRupee></TbCurrencyRupee>{getTotalTargetPL(gridData.Greeks_Table, 'Vega').toFixed(2)}</td>

                                        </tr>


                                    </tbody>
                                </Table>
                            </div>
                        </Tab>
                    </Tabs>

                </Card.Body>
                <Card.Footer>
                    {/* <ul>
                        <li>
                            <input className='pull-right' type='number' max={profit?.expiry} min={0} onChange={(e) => handleExpiry(e)} /></li>

                    </ul> */}
                    <span>Target Underlying Data Expires in <b>{profit?.expiry || 0 } </b> Days</span>
                    <Form.Label> <p>({rangeDate})</p></Form.Label>
                    <Form.Range max={profit?.expiry} min={0} onChange={(e) => handleExpiry(e)} />

                </Card.Footer>
            </Card>




        </div>
    )
}

export default PayOffGraph;