
import { Routes, Route } from "react-router-dom";
import Webpage from "./Components/Webpage"
import Login from './Components/Login';
import Signup from './Components/Signup';
import Header from './Components/header'
import Footbar from './Components/Footbar'

function App() {

  return (
    <>
    <Header/>
    <Routes>
      <Route path='/' element={<Webpage/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/signup' element={<Signup/>} />
    </Routes>
    <Footbar/>
    </>
  )
}

export default App