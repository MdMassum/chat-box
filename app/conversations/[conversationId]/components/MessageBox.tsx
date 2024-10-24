'use client'

import { FullMessageType } from "@/app/types"
import { useSession } from "next-auth/react";


interface MessageBoxProps{
    isLast ?: boolean,
    data : FullMessageType;
}
const MessageBox :React.FC<MessageBoxProps> = ({isLast, data}) => {

    const session = useSession();
    const isOwn = session?.data?.user?.email === data?.sender?.email;
    
  return (
    <div className="">
        message
    </div>
  )
}

export default MessageBox