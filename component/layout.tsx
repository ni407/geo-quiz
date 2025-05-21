import { useWindowSize } from '@/lib/util';
import Link from 'next/link';
import { FunctionComponent } from 'react';
import { IoIosArrowBack } from 'react-icons/io';

export const DrawerHeight = 140;
export const QuizLayout: FunctionComponent<{
    children: React.ReactNode;
}> = ({ children }) => {
    return (
        <div
            className={'overflow-hidden w-screen'}
            style={{ height: `calc(100vh - ${DrawerHeight}px)` }}
        >
            {children}
            <BackButton />
        </div>
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
