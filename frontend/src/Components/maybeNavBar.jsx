import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const MaybeNavBar = ({ children }) => {

    const location = useLocation();
    const[showNavBar, setShowNavBar] = useState(false);

    useEffect(() => {
        console.log('this is location: ', location)
        if(location.pathname === '/user') {
            setShowNavBar(false)
        } else if(location.pathname === '/admin') {
          setShowNavBar(false)
        } else if(location.pathname === '/user/orderPetrol'){
          setShowNavBar(false)
        } else if(location.pathname === '/user/orderDiesel'){
          setShowNavBar(false)
        } else if(location.pathname === '/user/orderKero'){
          setShowNavBar(false)
        } else if(location.pathname === '/user/transactions'){
          setShowNavBar(false)
        } else {
          setShowNavBar(true)
      }

    }, [location])
  return (
    <div>
      {showNavBar && children}
    </div>
  )
}

export default MaybeNavBar
