'use client'

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form"

interface MessageInputProps{
    id : string,
    placeholder ?:string,
    type ?: string,
    required ?: boolean,
    register : UseFormRegister<FieldValues>,
    errors : FieldErrors
}
const MessageInput:React.FC<MessageInputProps> = ({id, type, required, register, placeholder, errors}) => {
  return (
    <div className="relative w-full">
        <input 
            id={id}
            type={type}
            autoComplete={id}
            {...register(id,{required})}
            placeholder={placeholder}

            className="w-full rounded-full py-2 px-4 text-black bg-neutral-100 focus:outline-none"
        />
    </div>
  )
}

export default MessageInput