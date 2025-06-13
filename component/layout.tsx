import { useWindowSize } from '@/lib/util';
import Link from 'next/link';
import { Dispatch, FunctionComponent, SetStateAction, createContext, useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { Toast } from './common';

export const DrawerHeight = 140;

type ToastContextType = {
    toast: Toast | null;
    setToast: Dispatch<SetStateAction<Toast | null>>;
};

export const ToastContext = createContext<ToastContextType>({
    toast: null,
    setToast: () => null,
});
export const QuizLayout: FunctionComponent<{
    children: React.ReactNode;
    backgroundColor?: string;
}> = ({ children, backgroundColor }) => {
    const [toast, setToast] = useState<Toast | null>(null);
    return (
        <ToastContext.Provider value={{ toast, setToast }}>
            <div
                className={'overflow-hidden w-screen overflow-y-hidden'}
                style={{
                    height: `calc(100vh - ${DrawerHeight}px)`,
                    backgroundColor: backgroundColor,
                }}
            >
                {children}
                <BackButton />
                <Toast toast={toast} setVisible={setToast} />
            </div>
        </ToastContext.Provider>
    );
};

export const Drawer: FunctionComponent<{
    children: React.ReactNode;
}> = ({ children }) => {
    const { keyboardHeight } = useWindowSize();

    return (
        <div
            className="fixed bottom-0 left-0 w-full rounded bg-amber-100 p-4"
            style={{ height: DrawerHeight, transform: `translateY(-${keyboardHeight}px)` }}
        >
            {children}
        </div>
    );
};

export const BackButton = () => {
    return (
        <Link
            className="fixed top-5 left-5 z-50 bg-white text-black p-2 rounded-full flex items-center justify-center shadow-md"
            href="/"
        >
            <IoIosArrowBack className="text-2xl" />
        </Link>
    );
};
