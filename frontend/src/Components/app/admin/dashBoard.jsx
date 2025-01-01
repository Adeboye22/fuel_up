import React from 'react'

const Dashboard = () => {
  const userList = [
    {
      "name": "Ade",
      "id": 1,
      "litres": 20,
      "amount": 20000,
      "date": "22/12/24"
    },
    {
      "name": "Gbade",
      "id": 2,
      "litres": 50,
      "amount": 50000,
      "date": "22/12/24"
    }
  ]

  return(
    <div className='py-4 flex flex-col gap-8 w-full'>
      <div className='h-1/2 place-items-center flex flex-row border-b-2 border-lime border-dashed justify-between gap-4 px-16'>
        <div className='flex flex-col gap-8'>
          <h1 className='text-2xl text-altBlack'>Total Orders (Daily)</h1>
          <span className='text-7xl text-center text-lime font-bold'>15</span>
        </div>
        <div className='flex flex-col gap-8'>
          <h1 className='text-2xl text-altBlack'>Total Orders (Monthly)</h1>
          <span className='text-7xl text-center text-lime font-bold'>150</span>
        </div>
        <div className='flex flex-col gap-8'>
          <h1 className='text-2xl text-altBlack'>Total Orders (All time)</h1>
          <span className='text-7xl text-center text-lime font-bold'>2000</span>
        </div>
      </div>
      <div className='px-16 flex flex-col gap-8'>
        <h1 className='text-2xl text-altBlack font-bold'>Users Transactions</h1>
        <div className='text-gray text-xl flex flex-col gap-4'>
          {userList.map((user,index) => (
            <div className='grid grid-cols-5'>
            <span key={user.id} className='col-span-2'>{user.name}</span>
            <span>{user.litres}L</span>
            <span>N{user.amount}</span>
            <span>{user.date}</span>
            </div> 
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard