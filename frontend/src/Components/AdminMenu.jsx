import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const AdminMenu = ({ children }) => {
    const location = useLocation();
    const [ showMenu, setShowMenu ] = useState(false);

    useEffect(() => {
        console.log('this is location: ', location)
        if(location.pathname === '/admin') {
            setShowMenu(true)
        } else {
            setShowMenu(false)
        }
    }, [location])
  return (
    <div>
      {showMenu && children}
    </div>
  )
}

export default AdminMenu
