import {
    type Dispatch,
    type FunctionComponent,
    type SetStateAction,
    useEffect,
    useRef,
} from 'react';
import { createPortal } from 'react-dom';
import { PiX } from 'react-icons/pi';

export const Modal: FunctionComponent<{
    children: React.ReactNode;
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
    onClose: (() => void) | null;
    title: string | React.ReactNode | null;
    footer: React.ReactNode | null;
    closeWhenClickOutside?: boolean;
}> = ({ children, visible, setVisible, onClose, title, footer, closeWhenClickOutside = false }) => {
    const rootEl = useRef<HTMLElement | null>(null);

    useEffect(() => {
        rootEl.current = document.getElementById('root');
    }, []);

    if (rootEl.current) {
        return createPortal(
            <div
                className={`
                z-50 isolate
                fixed
                top-0
                w-full
                h-full 
                bg-neutral-600/50
                backdrop-blur-sm
                transition-opacity
                ${visible ? 'opacity-100' : 'pointer-events-none opacity-0'}
                duration-200 ease-in-out
            `}
                onPointerDown={() => {
                    if (closeWhenClickOutside) {
                        if (onClose) {
                            onClose();
                        }
                        setVisible(false);
                    }
                }}
            >
                <div
                    className={`
                        bg-white w-11/12 max-w-[800px] mx-auto mt-6 p-6 rounded-md flex flex-col
                        duration-100 ease-in-out
                        ${visible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}
                    `}
                    onPointerDown={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <div className="flex mb-4">
                        {title && typeof title === 'string' ? (
                            <div className="font-bold text-lg truncate">{title}</div>
                        ) : (
                            title
                        )}
                        <div className="flex-grow" />
                        <button
                            type="button"
                            className="h-auto mb-auto"
                            onClick={() => {
                                if (onClose) {
                                    onClose();
                                }
                                setVisible(false);
                            }}
                        >
                            <PiX className="h-auto text-2xl" />
                        </button>
                    </div>
                    <div className="overflow-y-auto">{children}</div>
                    {footer && <div className="mt-4">{footer}</div>}
                </div>
            </div>,
            rootEl.current,
        );
    }
    return null;
};
