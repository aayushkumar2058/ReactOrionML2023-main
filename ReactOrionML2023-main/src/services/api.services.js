import Config from './../data/config.json';
import ProxyConfig from './../data/proxy.json';

export default class ApiServices {

    LIST_EQUITY = Config.apiPaths.exchangeCall.equity;
    LIST_INDICES = Config.apiPaths.exchangeCall.indices;
    REAL_PLACE_ORDER = Config.apiPaths.order.placeOrder;
    REAL_ORDER_STATUS = Config.apiPaths.order_status.realOrderstatus;
    DUMMY_PLACE_ORDER = Config.apiPaths.order.dummyplaceOrder;
    DUMMY_ORDER_STATUS = Config.apiPaths.order_status.dummyOrderstatus;
    VIRTUAL_ORDER = Config.apiPaths.virtualorder.vorder;
    GET_VIRTUAL_ORDER = Config.apiPaths.virtualorder.getvorder;

    //Server
    AWS_URL = ProxyConfig.serverURL.backendAWS.AWS_PREFIX;
    EXCHANGE_URL =ProxyConfig.serverURL.exchangeURL.URL;

    // API Key for calling backend AWS lambda integration
    apiKey = 'ouivyEJqPf4RxW1CoQQ541ifp4OEOJlv4X4aDkI3';
    
    

    // get All equity and Indices

    // called from 
    getOptionChain_INDEX(value) {
        return fetch(`${this.EXCHANGE_URL}${this.LIST_INDICES}${value}`).then(response => response.json());
    }

    getOptionChainEQUITY(value) {
        return fetch(`${this.EXCHANGE_URL}${this.LIST_EQUITY}${value}`).then(response => response.json());
    }

    doPlaceAnorder(payLoad, sessionToken){
        console.log("aayushsession",sessionToken);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json','x-sessiontoken': sessionToken },// Pass the session token here: changes made on date:09-09-23
            body:payLoad
        };
        return fetch(`${this.AWS_URL}${this.DUMMY_PLACE_ORDER}`, requestOptions).then(response => response.json());//fetch cmd:calls the post method
        //return fetch(`${this.AWS_URL}${this.REAL_PLACE_ORDER}`, requestOptions).then(response => response.json());
    }

    getAllVirtualOrder(payLoad){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' ,'x-api-key': this.apiKey},
            body:payLoad
        };
        return fetch(`${this.AWS_URL}${this.GET_VIRTUAL_ORDER}`,requestOptions).then(response => response.json());
    }

    doVirtualOrder(payLoad) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' ,'x-api-key': this.apiKey},
            body:payLoad
        };
        return fetch(`${this.AWS_URL}${this.VIRTUAL_ORDER}`, requestOptions).then(response => response.json());

    }
    doOrderstatusenquiry(payLoad) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' ,'x-api-key': this.apiKey},
            body:payLoad
        };
        //var my_debug_str=`${this.AWS_URL}${this.DUMMY_ORDER_STATUS}`
        //console.log("checking my url",my_debug_str)
        return fetch(`${this.AWS_URL}${this.DUMMY_ORDER_STATUS}`, requestOptions).then(response => response.json());
        //return fetch(`${this.AWS_URL}${this.REAL_ORDER_STATUS}`, requestOptions).then(response => response.json());

    }
    

    //   sample_API_FOR_POST(userName){
    //     const requestOptions = {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body:userName
    //   };
    //     return fetch(this.URL, requestOptions).then(response => response.json())
    //   }



}