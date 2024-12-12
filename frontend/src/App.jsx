// components
import { Routes, Route } from "react-router-dom";
import Header from './Components/header';
import Footbar from './Components/Footbar';
import MaybeNavBar from "./Components/maybeNavBar";
import AdminMenu from "./Components/AdminMenu";
import MaybeFootbar from "./Components/MaybeFootbar";

// pages
import Webpage from "./Components/Webpage";
import Services from './Components/website/Services';
import Login from './Components/Login';
import Signup from './Components/Signup';
import MailVerification from "./Components/mailVerification";
// import Pricing from "./Components/website/Pricing";
import User from "./Components/app/user/user";
import Petrol from "./Components/app/user/Petrol"
import Kero from "./Components/app/user/Kero"
import Diesel from "./Components/app/user/Diesel"
import History from "./Components/app/user/History"
import Admin from "./Components/app/admin/admin"

function App() {

  return (
    <>
    <MaybeNavBar>
      <Header/>
    </MaybeNavBar>
    <AdminMenu/>
    <Routes>
      <Route path='/' element={<Webpage/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/signup' element={<Signup/>} />
      {/* <Route path='/pricing' element={<Pricing/>} /> */}
      <Route path='/services' element={<Services/>} />
      <Route path='/redirect_mail' element={<MailVerification/>} />
      <Route path='/admin' element={<Admin/>}>
        <Route/>
      </Route>
      <Route path='/user' element={<User/>}>
        <Route path="orderPetrol" element={<Petrol/>} />
        <Route path="orderDiesel" element={<Diesel/>} />
        <Route path="orderKero" element={<Kero/>} />
        <Route path="transactions" element={<History/>} />
      </Route> 
    </Routes>
    <MaybeFootbar>
      <Footbar/>
    </MaybeFootbar>
    </>
  )
}

export default App