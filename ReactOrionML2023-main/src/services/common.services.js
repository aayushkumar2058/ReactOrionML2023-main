import { BehaviorSubject, Observable, Subject} from 'rxjs';

//  praveen
const user = new Subject();
const allSelectedExchange = new Subject();
const backdrop = new Subject();
const profit = new Subject();
const expiryTime = new Subject();
const nifty = new Subject();
const legCount = new Subject();

class CommonServices{

  setBasket(value){
    console.log( "Prav... super danger common services... check", value)
    allSelectedExchange.next(value);
  }
  
  

setLegsCount(data){
  console.log('KKKKKKKKKK',data)
  legCount.next(data);
}

getLegsCount(){
  return legCount.asObservable();
}

setNiftyinService(data) {
  console.log('<><><>KANIVU', data)
  nifty.next(data);
}

getNiftyinService() {
  return nifty.asObservable();
}

setExpiryDetails(data) {
  console.log('common services Dinesh expiry date', data)
  expiryTime.next(data);
}
getExpiryDetails(data) {
  return expiryTime.asObservable();
}

setProfitDetails(data) {
  profit.next(data);
}
getProfitDetails(data) {
  return profit.asObservable();
}

setUserCredentials(data){
  user.next(data);
}

getUserCredentials(){
  return user.asObservable();
}

BackdropSettoTrue(value){
  backdrop.next(value)
  console.log('Value inside Common Service is', value)

}
getBackropSettings(){
  return backdrop.asObservable()
}

isLoggedIn() {
  return localStorage.getItem('userDetails') !== null;
}

}

export default  CommonServices;