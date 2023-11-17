import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Layout from "./container/layout/layout-component";
import Home from "./container/home/home-component";
import StrategyPlaceOrder from './components/strategy-place-order/strategy-place-order';
import Login from "./components/login/login";
import { Route, Navigate, Routes, HashRouter } from 'react-router-dom'
import VirtualOrder from "./components/virtual-order/virtual-order";
import PrivateRoute from "./components/privateRoute/privateRoute";
import { VirtualAction } from "rxjs";
import BrokerAuth from "./components/broker-auth/broker-auth";
import VirtualOrder_V2 from "./components/virtual-order/virtual-order praveen";


function App() {
  return (
    <Layout>
     <Routes>
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route exact path='/login' element={<Login />} />
          <Route exact path='/auth/iifl_login_success/:token' element={<BrokerAuth/>} />
          <Route exact path='/home/create-strategy' element={
            <PrivateRoute>
            <Home />
          </PrivateRoute>
          } />
          <Route exact path='/home/virtual-order' element={
            <PrivateRoute>
            <VirtualOrder />
          </PrivateRoute>

          } />
          <Route exact path='/home/virtual-order_V2' element={
            <PrivateRoute>
            <VirtualOrder_V2 />
            </PrivateRoute>
          } />

          <Route exact path='/place-order' element={
            <PrivateRoute>
            <StrategyPlaceOrder />
          </PrivateRoute>
          } />
        </Routes>


    </Layout>
  );
}

export default App;