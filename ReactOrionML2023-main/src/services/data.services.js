import { BehaviorSubject, Observable, Subject} from 'rxjs';

const user = new Subject();
const oSubject_Basket_List = new Subject();
const backdrop = new Subject();
const profit = new Subject();
const expiryTime = new Subject();
const nifty = new Subject();
const legCount = new Subject();
const userDetails = new Subject();


class DataServices{

  setAllUserDetails(value){
    userDetails.next(value);
  }
   
  getAlluserDetails(){
    return userDetails.asObservable()
  }

  setBasket(value){
    console.log( "Prav... super danger DataServices setBasket... check", value)
    oSubject_Basket_List.next(value);
  }
  
  
  getBasket(){
    console.log( "Prav... super danger DataServices getBasket... check")
    return oSubject_Basket_List.asObservable()
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
  console.log('data  services... culprit here', data)
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

export default  DataServices;