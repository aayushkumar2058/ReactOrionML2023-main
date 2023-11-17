import React, { Component } from 'react';
import StrategyBuilder from '../../components/strategy-builder/strategy-builder';
import ProfitMarker from '../../components/profit-marker/profit-marker';
//import PayOffGraph from '../../components/payOff-graph/payoff-graph_obsolete';
import PayOffGraphV2 from '../../components/payOff-graph/PayOffGraphV2';

import ApiServices from '../../services/api.services';
import ErrorWidget from '../../components/common/error-widget/error-widget';

class Home extends Component {
    constructor(props) {
        super(props)
        this.api = new ApiServices();
        this.state = {
            nifty: '',
            allExchangeList: [],
            selectedUnderLying: 'NIFTY',
            error: ''
        };
        this.getoptionchainSelected  = this.getoptionchainSelected.bind(this);
    }

    getoptionchainSelected (selectedValue) {
        console.log(" Print and check",selectedValue)
        this.setState({ selectedUnderLying: selectedValue })     //what is this setState function ?

        if (selectedValue === 'NIFTY' || selectedValue === 'BANKNIFTY') {
            this.getOptionChain_INDEX(selectedValue);
        } else {
            this.getOptionChainEQUITY(selectedValue);
        }
    }

    getOptionChain_INDEX(value) {
        console.log ("praveen first debug..." , value)    // 17 may
        this.api.getOptionChain_INDEX(value).then((response) => {
            console.log ("  prav... check1... for sures", response)
            this.setState({
                allExchangeList: response,
                error: ''
            });
        }, (error) => {
            this.setState({
                error: `Can not call the API for  ${value} or Something went wrong`,

            })
        })
    }

    getOptionChainEQUITY(value) {
        console.log('AWESOME !!!!!!', value)
        this.api.getOptionChainEQUITY(value).then((response) => {

            this.setState({
                allExchangeList: response,
                error: ''
            });
        }, (error) => {
            this.setState({
                error: `Can not call the API for <b>${value}</b> or Something went wrong`,
            })
        })
    }

    componentDidMount() {
        console.log ( "prav home component mounting... ")
        this.getOptionChain_INDEX(this.state.selectedUnderLying);
        console.log ("  prav... check1", this.state.allExchangeList.records)
    /* 
        setInterval(() => {
            this.getOptionChain_INDEX(this.state.selectedUnderLying);
            console.log ("  prav... check2", this.state.allExchangeList.records)
        }, 50000)
    */
    }

    render() {
        return (
            <div>
                <div className="mainContent">
                    <ErrorWidget error={this.state.error}></ErrorWidget>
                    <div className="builder">
                        <StrategyBuilder getoptionchainSelected ={this.getoptionchainSelected } OptionChain={this.state.allExchangeList}></StrategyBuilder>
                    </div>
                    <div className="graphContainer">
                        
                        <PayOffGraphV2 marketPrice={this.state.allExchangeList?.records?.underlyingValue}></PayOffGraphV2>
                        <ProfitMarker></ProfitMarker>
                        {/*<PayOffGraph marketPrice={this.state.allExchangeList?.records?.underlyingValue}></PayOffGraph>
                        */}

                        
                    </div>
                </div>
            </div>

        )
    }

}

export default Home;
