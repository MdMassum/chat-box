'use client';

import { Dialog } from '@headlessui/react';
import { HiX } from 'react-icons/hi';
import { useState } from 'react';
import { User } from '@prisma/client';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Select from '@/app/components/inputs/Select';
import LoadingModal from '@/app/components/Loading/LoadingModal';

interface GroupChatModelProps {
    isOpen: boolean;
    onClose: () => void;
    users: User[];
}

const GroupChatModel: React.FC<GroupChatModelProps> = ({ isOpen, onClose, users }) => {
    if (!isOpen) return null;

    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            members: []
        }
    });
    const members = watch('members');

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        
        setLoading(true);
        axios.post('/api/conversations', {
            ...data,
            isGroup: true,
        })
        .then(() => {
            router.refresh();
            onClose();
            toast.success("Group Created Successfully");
        })
        .catch((error:any) => {
            toast.error(error.response.data);
        })
        .finally(() => setLoading(false));
    };

    return (
        <>
            {loading && <LoadingModal loading={loading} /> }
            <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-40">
                <Dialog.Panel className="relative w-full max-w-md bg-white rounded-lg shadow-xl p-6">
                    <HiX
                        className="absolute top-4 right-4 text-2xl text-gray-500 cursor-pointer hover:text-gray-700 transition"
                        onClick={onClose}
                    />
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center space-y-4">
                        <div className='w-full'>
                            <h2 className='text-2xl text-purple-500 font-semibold'>Create a Group Chat</h2>
                            <p className='text-xs'>Create chat with more than 2 people:</p>
                        </div>

                        {/* Name Field */}
                        <div className="w-full">
                            <label htmlFor="name" className="block text-gray-700 font-medium mb-1">Group Name</label>
                            <input
                                {...register("name", { required: true })}
                                id="name"
                                disabled={loading}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-sky-300"
                            />
                            {errors.name && <p className="text-red-500">Group name is required</p>}
                        </div>
                        <div className='w-full'>
                            <Select 
                                disabled={loading}
                                label="Members"
                                options={users.map(user => ({
                                    value: user.id,
                                    label: user.name || "Unknown"
                                }))}
                                onChange={(value) => setValue('members', value, { shouldValidate: true })}
                                value={members}
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full mt-8 px-4 py-2 text-white bg-gradient-to-l from-purple-400 to-purple-900  hover:opacity-95 transition rounded-md"
                            disabled={loading}
                        >
                            Create
                        </button>
                    </form>
                </Dialog.Panel>
            </Dialog>
        </>
    );
};

export default GroupChatModel;
