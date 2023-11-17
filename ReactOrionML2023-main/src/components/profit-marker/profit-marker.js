import React, { useEffect , useState} from 'react';

import { Card } from 'react-bootstrap';

import CommonServices from './../../services/common.services'



const ProfitMarker = (props) => {   
    const [profitVal,setProfitVal] = useState([]);
    useEffect(()=> {
        new CommonServices().getProfitDetails().subscribe((response) => {
            setProfitVal(response)

        });
    },[profitVal])
       
       
    return (
        <div className='profitMarker'>
        <Card>

      <Card.Body>
<div className='box-profit'>
    <ul>
        <li><span>Max Profit</span><span>{profitVal.maxProfit}</span></li>
        <li><span>Max Loss</span><span className='error'>{profitVal.maxLoss || 0}</span></li>
        <li><span>Risk/Reward</span><span>{ Math.round(profitVal.maxLoss / profitVal.maxProfit,2) || 0}</span></li>
    </ul>
</div> 
<div className='box-profit'>
<ul>
        <li><span>Breakeven</span><span>{profitVal.BreakEven}</span></li>
        <li><span>POP</span><span>TBD</span></li>
        <li><span>Project Return</span><span>TBD</span></li>
    </ul>
</div>
<div className='box-profit'>
<ul>
        <li><span>Funds Needed</span><span>TBD</span></li>
        <li><span>Margin Needed</span><span>TBD</span></li>
    </ul>
</div>
      </Card.Body>
    </Card>
        
       


        </div>
    )
}

export default ProfitMarker;