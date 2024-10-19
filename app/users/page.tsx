
import { signOut } from 'next-auth/react';
import React from 'react'
import EmptyState from '../components/EmptyState';

const Users:React.FC = () =>{


  return (
    <div className='hidden md:block md:pl-80 h-full'>
        <EmptyState />
    </div>

  )
}

export default Users;