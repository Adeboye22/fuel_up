import React from 'react';
import Data from '../../Components/app/user.json';

const User = () => {
    const {users} = Data;
  return (
    <div className='h-screen px-4'>
      <div className='p-2'>
        {users.map((item,index) => (
            <h1 className='text-gray font-bold'>Hi {item.name}!</h1>
        ))}
        <div>
            <span>Your onestop mobile filling station. A door step away from you.</span>
        </div>
      </div>
      <div className='bg-lime sm:h-48 sm:p-2 mt-12 text-white'>
        asd
      </div>
    </div>
  )
}

export default User;