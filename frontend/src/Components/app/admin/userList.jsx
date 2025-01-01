import React from 'react'

const UserList = () => {
// dummy data
    const userList = [
        {
          "name": "Ade",
          "id": 1,
          "email": 'Ade@hotmail.com',
          "number": 8036173848,
          "date": "22/12/24"
        },
        {
          "name": "Gbade",
          "id": 2,
          "email": 'Gbade@hotmail.com',
          "number": 8059123546,
          "date": "22/12/24"
        }
      ]

  return (
    <div className='p-8 w-full'>
        <div className='flex flex-row justify-between mb-8'>
            <h1 className='text-2xl font-bold'>User List</h1>
            <span className='text-lg font-bold text-lime'>2 Users</span>
        </div>

        <div className='flex flex-col gap-2'>
            {userList.map((user,index) => (
                <div className='grid grid-cols-4 gap-4 text-base text-gray'>
                    <span>{user.name}</span>
                    <span>{user.email}</span>
                    <span>{user.number}</span>
                    <span>{user.date}</span>
                </div>
            ))}
        </div>
    </div>
  )
}

export default UserList;
