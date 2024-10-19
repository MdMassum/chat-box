'use client'
import { User } from '@prisma/client'
import React from 'react'
import UserBox from './UserBox';

interface UserListProps {
    items : User[];
}
const UserList : React.FC<UserListProps> = ({items}) => {
  return (
    <aside className='fixed inset-y-0 pb-20 md:pb-0 md:left-20 md:w-80 md:block overflow-y-auto border-r border-gray-200 block w-full left-0'>
        <div className='px-5'>
            <div className='flex-col'>
                <div className="text-2xl font-bold text-neutral-800 py-4 ml-7">
                    People
                </div>
            </div>
            {
                items.map((item)=>(
                    <UserBox key={item.id} data={item} />
                ))
            }
        </div>
    </aside>
  )
}

export default UserList