'use client'

import useConversation from "@/app/hooks/useConversation";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { HiPaperAirplane, HiPhoto } from "react-icons/hi2";
import MessageInput from "./MessageInput";
import { CldUploadButton } from 'next-cloudinary';
import { useState } from "react";
import LoadingModal from "@/app/components/Loading/LoadingModal";

const Form: React.FC = () => {
  const { conversationId } = useConversation();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      message: ''
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {

    try {
      setValue('message', '', { shouldValidate: true });
      await axios.post('/api/messages', {
        ...data,
        conversationId,
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleUpload = async (result: any) => {
    setIsLoading(true);
    try {
      await axios.post('/api/messages', {
        image: result?.info?.secure_url,
        conversationId,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    finally{
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <LoadingModal loading={isLoading} /> }
      <div className="py-4 px-4 bg-white border-t flex items-center gap-2 md:gap-4 w-full">
        <CldUploadButton
          options={{ maxFiles: 1 }}
          onSuccess={handleUpload} // Updated event handler
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || 'b1wcmapc'}>
          <HiPhoto size={30} className="text-purple-600" />
        </CldUploadButton>

        <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2 md:gap-4 w-full">
          <MessageInput id="message" register={register} required placeholder="Write a message" errors={errors} />
          <button
            type="submit"
            className={`rounded-full p-2 ${isLoading ? 'bg-sky-300' : 'bg-sky-500'} cursor-pointer hover:bg-sky-600 transition`}
            disabled={isLoading}>
            <HiPaperAirplane className="text-white" size={18} />
          </button>
        </form>
      </div>
    </>
  );
};

export default Form;
