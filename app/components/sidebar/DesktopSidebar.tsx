'use client'
import useRoutes from '@/app/hooks/useRoutes'
import React, { useState } from 'react'
import DesktopItem from './DesktopItem';
import { User } from '@prisma/client';
import Avatar from '../Avatar';
import SettingModal from './SettingModal';

interface DesktopSidbarProps {
  currentUser : User
}
const DesktopSidbar:React.FC<DesktopSidbarProps> = ({currentUser}) => {

  const routes = useRoutes();
  const [isOpen, setOpen] = useState(false);
  
  return (
    <>
      <SettingModal currentUser={currentUser} isOpen={isOpen} onClose={()=>setOpen(false)}/>

      <div className='hidden md:fixed md:inset-y-0 md:left-0 md:z-40 md:w-28 xl:px-6 md:overflow-y-auto md:bg-white md:border-r-[1px] md:pb-4 md:flex md:flex-col justify-between'>
        <nav className='hidden mt-4 md:flex flex-col justify-between'>
          <ul role='list' className='flex flex-col items-center space-y-1'>
            {
              routes.map((item)=>(
                <DesktopItem key={item.label} href={item.href} label={item.label} Icon={item.icon} active={item.active} onClick={item.onClick} />
              ))
            }
          </ul>
        </nav>
        <nav className='mt-4 flex flex-col justify-between items-center'>
          <div onClick={()=>setOpen(true)} className='cursor-pointer hover:opacity-75 transition'>
            <Avatar user={currentUser} />
          </div>
        </nav>
      </div>
    </>
  )
}

export default DesktopSidbar