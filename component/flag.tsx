import { getFlagImageUrl } from '@/lib/flag';
import { Geometry } from '@/lib/geography';
import { useWindowSize } from '@/lib/util';
import Image from 'next/image';
import { FunctionComponent } from 'react';
import { DrawerHeight } from './layout';

export const FlagDisplay: FunctionComponent<{ selectedCountry: Geometry | null }> = ({
    selectedCountry,
}) => {
    const { keyboardHeight } = useWindowSize();
    return (
        <div
            className="flex flex-col items-center justify-center my-auto"
            style={{ height: `calc(100vh - ${keyboardHeight}px - ${DrawerHeight}px)` }}
        >
            {selectedCountry && (
                <Image
                    src={getFlagImageUrl(selectedCountry?.id)}
                    alt="国旗"
                    className="size-auto lg:size-96 my-auto"
                    width={256}
                    height={192}
                />
            )}
        </div>
    );
};
