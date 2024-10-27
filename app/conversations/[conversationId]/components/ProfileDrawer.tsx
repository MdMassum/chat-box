'use client'

import { Fragment, useCallback, useMemo, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { format } from 'date-fns';
import { HiX } from "react-icons/hi"; 
import Avatar from "@/app/components/Avatar";
import { Conversation, User } from "@prisma/client";
import useOtherUser from "@/app/hooks/useOtherUser";
import useConversation from "@/app/hooks/useConversation";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa"
import AvatarGroup from "@/app/components/AvatarGroup";
import LoadingModal from "@/app/components/Loading/LoadingModal";
import useActiveList from "@/app/hooks/useActiveList";

interface ProfileDrawerProps {
    data: Conversation & { user: User[] };
    isOpen?: boolean;
    onClose?: () => void;
}

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({ data, isOpen, onClose }) => {
    const otherUser = useOtherUser(data);

    const {members} = useActiveList();
    const isActive = members.indexOf(otherUser?.email!) !== -1;

    const joinedDate = useMemo(() => {
        return format(new Date(otherUser.createdAt), 'PP');
    }, [otherUser.createdAt]);

    const title = useMemo(() => {
        return data.name || otherUser.name;
    }, [data.name, otherUser.name]);

    const statusText = useMemo(() => {
        if(data.isGroup){
            return `${data.user.length} members`
        }
        else{
            return isActive ? 'Active' : 'Offline';
        }
    }, [data, isActive]);

    const router = useRouter()
    const {conversationId} = useConversation();
    const [loading , setLoading] = useState(false);

    const onDelete = useCallback(()=>{

        if(confirm(`Delete Chat with ${otherUser.name}`)){

            setLoading(true);
            axios.delete(`/api/conversations/${conversationId}`)
            .then(()=>{
                router.push('/conversations')
                toast.success('Chat Deleted Successfully');
            })
            .catch(()=>{
                toast.error('Something went wrong');
            })
            .finally(()=>setLoading(false));
        }
        
    },[conversationId])


    return (
        <>
        {loading && <LoadingModal loading={loading} /> }
            <Transition.Root show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={onClose}>
                    {/* Background overlay */}
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-40" />
                    </Transition.Child>

                    {/* Sidebar panel */}
                    <Transition.Child
                        as={Fragment}
                        enter="transform transition ease-in-out duration-300"
                        enterFrom="translate-x-full"
                        enterTo="translate-x-0"
                        leave="transform transition ease-in-out duration-200"
                        leaveFrom="translate-x-0"
                        leaveTo="translate-x-full"
                    >
                        <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-lg p-6 overflow-y-auto">
                            <Dialog.Panel className="relative h-full">
                                {/* Close Icon */}
                                <HiX 
                                    className="absolute top-1 right-4 text-2xl text-gray-500 cursor-pointer hover:text-gray-700 transition" 
                                    onClick={onClose} 
                                />

                                <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
                                {
                                    !data.isGroup && 
                                    <Dialog.Description className="mt-2 text-sm text-gray-500">
                                        {otherUser.email}
                                    </Dialog.Description>
                                }

                                <div className="mt-4 flex flex-col items-center">
                                    {data.isGroup ? (
                                        <AvatarGroup users={data.user}/>
                                    ) : (
                                        <Avatar user={otherUser}/>
                                    )}
                                    <p className="mt-2 text-sm">
                                        <span className="font-medium">{statusText}</span>
                                    </p>
                                    {
                                        !data.isGroup && 
                                        (<p className="mt-2 text-sm">
                                            Joined on: <span className="font-medium">{joinedDate}</span>
                                        </p>)
                                    }
                                    
                                    {data.isGroup && (
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 ">Emails:</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                                                {data.user.map((user)=>user.email).join(', ')}
                                            </dd>
                                        </div>
                                    )}
                                    
                                    <button onClick={onDelete}
                                    className=" hover:opacity-95 bg-gradient-to-bl from-rose-800 to-rose-400 w-32 rounded-lg mt-6 h-8 text-sm text-white flex items-center justify-center gap-2">
                                        <FaTrash size={16} />
                                        <p>Delete chat</p>
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </div>
                    </Transition.Child>
                </Dialog>
            </Transition.Root>
        </>
    );
};

export default ProfileDrawer;
