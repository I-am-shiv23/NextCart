import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import About from './pages/About.jsx'
import ReturnPolicy from './pages/Return.jsx'
import Disclaimer from './pages/Disclaimer.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import OrderSuccess from './pages/OrderSuccess.jsx'
import Profile from './pages/Profile.jsx'
import AddProduct from './admin/AddProduct.jsx'
import AdminDashboard from './admin/AdminDashboard.jsx'
import AdminProducts from './admin/AdminProducts.jsx'
import EditProduct from './admin/EditProduct.jsx'
import AdminOrders from './admin/AdminOrders.jsx'
import AdminUsers from './admin/AdminUsers.jsx'
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">  
        <Navbar/>
        <main className="flex-1">                   
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/shop' element={<Shop/>}/>
            <Route path='/about' element={<About/>}/>
            <Route path='/return' element={<ReturnPolicy/>}/>
            <Route path='/disclaimer' element={<Disclaimer/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/product/:id' element={<ProductDetails/>}/>
            <Route path='/cart' element={<Cart/>}/>
            <Route path='/checkout' element={<Checkout/>}/>
            <Route path='/order-success' element={<OrderSuccess/>}/>
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/admin' element={<AdminDashboard/>}/>
            <Route path='/admin/add-product' element={<AddProduct/>}/>
            <Route path='/admin/products' element={<AdminProducts/>}/>
            <Route path='/admin/products/:id/edit' element={<EditProduct/>}/>
            <Route path='/admin/orders' element={<AdminOrders/>}/>
            <Route path='/admin/users' element={<AdminUsers/>}/>
          </Routes>
        </main>                                      
        <Footer/>
      </div>                                         
    </Router>
  )
}

export default App