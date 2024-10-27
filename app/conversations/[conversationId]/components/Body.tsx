'use client'

import useConversation from "@/app/hooks/useConversation"
import { FullMessageType } from "@/app/types"
import { useEffect, useRef, useState } from "react"
import MessageBox from "./MessageBox"
import axios from "axios"
import { pusherClient } from "@/app/libs/pusher"
import { debounce, find } from "lodash"

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

    const markMessagesAsSeen = debounce(async () => {
      try {
        await axios.post(`/api/conversations/${conversationId}/seen`);
      } catch (error) {
        console.error('Error marking messages as seen:', error);
      }
    }, 5000);
    

    useEffect(() => {
      markMessagesAsSeen();
    }, [conversationId])

    useEffect(() => {
      if (!conversationId) return;
      
      pusherClient.subscribe(conversationId);
      scrollToBottom()

      // new message handler
      const messageHandler = (message : FullMessageType) =>{
        markMessagesAsSeen();
        setMessages((current)=>{
          
          if(find(current, {id:message.id})){
            return current;
          }
          return [...current,message]
        })

        scrollToBottom()
      }

      //updated message handler
      const UpdatedmessageHandler = (newMessage : FullMessageType) =>{

        markMessagesAsSeen();

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
    </div>
  )
}

export default Body