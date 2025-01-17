import React from 'react'
import {useNavigate} from 'react-router-dom'

const VerifyMail = () => {
  const navigate = useNavigate();

  const login = () => {
    return(
      navigate('/login')
    )
  }
  return (
    <div className='h-full flex flex-col px-4 gap-4'>
      <h1 className='mt-12 text-lg'>User Verification,</h1>
      <p>Your email has been verified, you can now proceed to login</p>
      <button className='bg-lime border border-white text-white w-1/4 p-1' onClick={login}>Login</button>
    </div>
  )
}

export default VerifyMail;