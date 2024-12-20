'use client'

import Avatar from "@/app/components/Avatar";
import { FullMessageType } from "@/app/types"
import { useSession } from "next-auth/react";
import {format} from 'date-fns'
import clsx from "clsx";
import Image from "next/image";
import { useEffect } from "react";
import axios from "axios";
import useConversation from "@/app/hooks/useConversation";


interface MessageBoxProps{
    isLast ?: boolean,
    data : FullMessageType;
}
const MessageBox :React.FC<MessageBoxProps> = ({isLast, data}) => {

    const session = useSession();
    const isOwn = session?.data?.user?.email === data?.sender?.email;

    const seenList = (data.seen || [])
    .filter((user)=>user.email !== data?.sender?.email)
    .map((user)=>user.name)
    .join(', ')

    const container = clsx("flex gap-3 p-4 ", isOwn && 'justify-end');

    const avatar = clsx(isOwn && "order-2");

    const body = clsx('flex flex-col gap-2', isOwn && 'items-end')

    const message = clsx('text-sm w-fit overflow-hidden', isOwn ? 'bg-gradient-to-r from-purple-400 to-purple-900 text-white' : 'bg-gradient-to-r from-gray-200 to-gray-400', data.image ? 'rounded-md p-0' : 'rounded-full py-2 px-3')

    const {conversationId} = useConversation();
    
    useEffect(() => {
      axios.post(`/api/conversations/${conversationId}/seen`)
    }, [conversationId])
    
    
  return (
    <div className={container}>
      <div className={avatar}>
        <Avatar user={data.sender}/>
      </div>
      <div className={body}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">
            {data.sender.name}
          </div>
          <div className="text-xs text-gray-400">
            {format(new Date(data.createdAt),'p')}
          </div>
        </div>
        <div className={message}>
          {
            data.image ?(
              <Image alt="Image" height="288" width="288"
              src={data.image} 
              className="object-cover cursor-pointer hover:scale-110 transition translate"/>
            ):(
              <div>
                {data.body}
              </div>
            )
          }
        </div>
        {
          isLast && isOwn && seenList.length > 0 && (
            <div className="text-xs font-light text-gray-500">
              {`Seen By ${seenList}`}
            </div>
          )
        }
      </div>
    </div>
  )
}

export default MessageBox