import React from 'react'

const MailVerification = () => {
  return (
    <div className='sm:h-screen sm:justify-center  sm:px-12 h-screen flex flex-col gap-8 px-12 py-40 text-lg text-white bg-black jusify-center'>
      <h1 className='sm:font-black sm:text-2xl font-black text-4xl'>User Verification</h1>
      <span>A mail has been sent to you for verification. Click the link to verify your account.</span>
    </div>
  )
}

export default MailVerification
