'use Client'
import { User } from '@prisma/client'
import Image from 'next/image'
import React from 'react'
import dp from '../../app/assets/avatarDp.png'

interface AvatarProps {
    users ?: User[]
}
const AvatarGroup:React.FC<AvatarProps> = ({users = []}) =>{

    const slicedUsers = users.slice(0,3);

    const positionMap = {
        0 : 'top-0 left-[12px]',
        1 : 'bottom-0',
        2 : 'bottom-0 right-0'
    }
  return (
    <div className='relative h-11 w-11'>
        {
            slicedUsers.map((user,index)=>(
                <div key={user.id} className={`absolute inline-block rounded-full overflow-hidden h-[23px] w-[23px] ${positionMap[index as keyof typeof positionMap]}`}>
                    <Image alt='avatar' fill src={user.image || dp}/>
                </div>
            ))
        }
    </div>
  )
}

export default AvatarGroup