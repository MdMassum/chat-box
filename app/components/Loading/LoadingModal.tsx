// LoadingModal.tsx
'use client';

import { Dialog } from '@headlessui/react';
import { ClipLoader } from 'react-spinners';

interface LoadingModalProps {
    loading: boolean;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ loading }) => {
    return (
        <Dialog open={loading} onClose={() => {}} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <Dialog.Panel className="flex flex-col items-center">
                <ClipLoader color="#3B82F6" size={50} />
                <p className="mt-4 text-white text-lg">Loading...</p>
            </Dialog.Panel>
        </Dialog>
    );
};

export default LoadingModal;
