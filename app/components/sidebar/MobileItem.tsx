'use client'
import React from 'react'
import clsx from 'clsx'
import Link from 'next/link'

interface MobileItemProps{
    label : string,
    Icon : any,
    onClick ?:()=>void,
    href : string,
    active ?: boolean
}
const MobileItem : React.FC<MobileItemProps> = ({
    label,
    Icon,
    onClick,
    href,
    active
}) =>{

    const handleClick = (()=>{
        if(onClick){
            return onClick()
        }
    })
  return (
    <Link href={href}
        onClick={handleClick}
        className={clsx(`group flex flex-col items-center gap-x-3 text-sm leading-6 font-semibold w-full justify-center p-4 text-gray-500 hover:text-black hover:bg-gray-100`,active && 'bg-gray-100 text-black')}
    >
        <Icon className = "h-6 w-6"/>
        {label}
    </Link>
  )
}

export default MobileItem