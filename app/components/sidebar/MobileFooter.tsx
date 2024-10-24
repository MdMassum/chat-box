'use client'
import useConversation from '@/app/hooks/useConversation';
import useRoutes from '@/app/hooks/useRoutes'
import React from 'react'
import MobileItem from './MobileItem';

const MobileFooter = () =>{
  const routes = useRoutes();
  const {isOpen} = useConversation();

  if(isOpen){
    return null;
  }
 
  return (
    <div className='fixed justify-between w-full bottom-0 z-40 flex items-center bg-white border-t-[1px] md:hidden'>{
      routes.map((item)=>(
        <MobileItem
        key={item.label}
        Icon={item.icon}
        href={item.href}
        onClick={item.onClick}
        label={item.label}
        active={item.active}
        />
      ))
    }
    </div>
  )
}

export default MobileFooter