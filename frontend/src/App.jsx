
import { Routes, Route } from "react-router-dom";
import Webpage from "./Components/Webpage";
import Login from './Components/Login';
import Signup from './Components/Signup';
import Header from './Components/header';
import Footbar from './Components/Footbar';
import Services from './Components/website/Services';
import MailVerification from "./Components/mailVerification";
import Pricing from "./Components/website/Pricing";
import User from "./Components/app/user";

function App() {

  return (
    <>
    <Header/>
    <Routes>
      <Route path='/' element={<Webpage/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/signup' element={<Signup/>} />
      <Route path='/pricing' element={<Pricing/>} />
      <Route path='/services' element={<Services/>} />
      <Route path='/redirect_mail' element={<MailVerification/>} />
      <Route path='/user' element={<User/>} />
    </Routes>
    <Footbar/>
    </>
  )
}

export default App