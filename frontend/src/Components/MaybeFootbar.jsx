import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const MaybeFootbar = ({ children }) => {
    const location = useLocation();
    const[showFooter, setShowFooter] = useState(false);

    useEffect(() => {
        console.log('this is location: ', location)
        if(location.pathname === '/user') {
            setShowFooter(false)
        } else if(location.pathname === '/admin'){
            setShowFooter(false)
        }else if (location.pathname === '/admin/dashboard'){
          setShowFooter(false)
        } else if (location.pathname ==='/admin/priceCtrl'){
          setShowFooter(false)
        } else if (location.pathname === '/admin/userList') {
          setShowFooter(false)
        } else if(location.pathname === '/admin/employee'){
          setShowFooter(false)
        } else if(location.pathname === '/user/orderPetrol'){
          setShowFooter(false)
        } else if(location.pathname === '/user/orderDiesel'){
          setShowFooter(false)
        } else if(location.pathname === '/user/orderKero'){
          setShowFooter(false)
        } else if(location.pathname === '/user/transactions'){
          setShowFooter(false)
        } else if(location.pathname === '/verify_mail'){
          setShowFooter(false)
        }else {
            setShowFooter(true)
        }
    }, [location])

  return (
    <div>
      {showFooter && children}
    </div>
  )
}

export default MaybeFootbar
