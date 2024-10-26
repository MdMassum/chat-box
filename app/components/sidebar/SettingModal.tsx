'use client'

import { Dialog } from '@headlessui/react';
import { HiX } from 'react-icons/hi';
import { useRef, useState } from 'react';
import { CldUploadButton } from 'next-cloudinary';
import { User } from '@prisma/client';
import dp from '@/app/assets/avatarDp.png'
import axios from 'axios';
import toast from 'react-hot-toast';

interface SettingModalProps {
    currentUser: User;
    isOpen: boolean;
    onClose: () => void;
}

const SettingModal: React.FC<SettingModalProps> = ({ currentUser, isOpen, onClose }) => {
    
    if (!isOpen) return null;

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [name, setName] = useState(currentUser.name);
    const [profilePicture, setProfilePicture] = useState<string | null>(currentUser.image || null);

    // Handle profile picture upload success
    const handleUpload = (result: any) => {
        const uploadedImageUrl = result.info.secure_url;
        setProfilePicture(uploadedImageUrl);
        console.log('Uploaded Image URL:', profilePicture);
    };

    // Submit handler
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Updated User Info:', { name, profilePicture });

        axios.post('/api/settings',{name,profilePicture})
        .then(()=>{
            toast.success("Profile Updated Successfully");
            onClose();
        })
        .catch(()=>{
            toast.error("Something went wrong!")
        })
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-40">
            <Dialog.Panel className="relative w-full max-w-md bg-white rounded-lg shadow-xl p-6">
                {/* Close Icon */}
                <HiX
                    className="absolute top-4 right-4 text-2xl text-gray-500 cursor-pointer hover:text-gray-700 transition"
                    onClick={onClose}
                />

                <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
                    {/* Profile Picture with Cloudinary Upload Button */}
                    <div className="cursor-pointer flex flex-col items-center justify-center gap-2">
                    <div className='inline-block rounded-full overflow-hidden h-24 w-24'>
                        <img
                            src={`${profilePicture || currentUser.image || dp}`}
                            alt=""
                            width={96}
                            height={96}
                            className="rounded-full border border-black bg-cover"
                        />
                    </div>
                    
                        <CldUploadButton
                            options={{ maxFiles: 1 }}
                            onSuccess={handleUpload}
                            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || 'b1wcmapc'}
                        >
                            <button onClick={() => fileInputRef.current?.click()}
                            className="w-full mt-2 px-4 py-1 text-white bg-sky-500 rounded-md hover:bg-sky-600 transition">
                                Change
                            </button>
                        </CldUploadButton>
                       
                    </div>

                    {/* Name Field */}
                    <div className="w-full">
                        <label className="block text-gray-700 font-medium mb-1" htmlFor="name">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-sky-300"
                        />
                    </div>

                    {/* Email Field */}
                    <div className="w-full ">
                        <label className="block text-gray-700 font-medium mb-1" htmlFor="email">
                            Email
                        </label>
                        <input
                            value={currentUser.email}
                            type="email"
                            id="email"
                            disabled
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-sky-300"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full mt-8 px-4 py-2 text-white bg-sky-500 rounded-md hover:bg-sky-600 transition"
                    >
                        Save Changes
                    </button>
                </form>
            </Dialog.Panel>
        </Dialog>
    );
};

export default SettingModal;
