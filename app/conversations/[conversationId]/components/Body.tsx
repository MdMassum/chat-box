'use client'

import useConversation from "@/app/hooks/useConversation"
import { FullMessageType } from "@/app/types"
import { useEffect, useRef, useState } from "react"
import MessageBox from "./MessageBox"
import axios from "axios"
import { pusherClient } from "@/app/libs/pusher"
import { find } from "lodash"

interface bodyProps{
  initialMessages : FullMessageType[]
}
const Body :React.FC<bodyProps> = ({initialMessages}) => {

    const [messages, setMessages] = useState(initialMessages);

    const bottomRef = useRef<HTMLDivElement>(null)
    const scrollToBottom = () => {
      setTimeout(() => bottomRef?.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    };

    const {conversationId} = useConversation();

    

    useEffect(() => {
      axios.post(`/api/conversations/${conversationId}/seen`);
    }, [conversationId])

    useEffect(() => {
      
      pusherClient.subscribe(conversationId);
      axios.post(`/api/conversations/${conversationId}/seen`);
      scrollToBottom()

      // new message handler
      const messageHandler = (message : FullMessageType) =>{

        setMessages(current=>{
          
          if(find(current, {id:message.id})){
            return current;
          }
          return [...current,message]
        })

        scrollToBottom()
      }

      //updated message handler
      const UpdatedmessageHandler = (newMessage : FullMessageType) =>{

        setMessages((current)=> current.map((currentMessage)=>
          currentMessage.id === newMessage.id ? newMessage : currentMessage
        ))

        scrollToBottom();
      }

      pusherClient.bind('messages:new',messageHandler);
      pusherClient.bind('message:update',UpdatedmessageHandler);

      return () =>{
        pusherClient.unsubscribe(conversationId);
        pusherClient.unbind('messages:new', messageHandler)
        pusherClient.unbind('message:update', UpdatedmessageHandler)
      }
    }, [conversationId])
    
  return (
    <div className="flex-1 overflow-y-auto">
        {
          messages.map((message,i)=>(
            <MessageBox isLast = {i == messages.length-1}
            key = {message.id}
            data = {message}
            />
          ))
        }
        <div ref={bottomRef} />
    </div>
  )
}

export default Body