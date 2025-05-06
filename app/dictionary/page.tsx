'use client';
import { BackButton } from '@/component/layout';
import { GeographyMap } from '@/component/map';
import { getFlagImageUrl } from '@/lib/flag';
import { Geometry, Region, geographyData as allGeographyData, regions } from '@/lib/geography';
import { getOneRegionGeographyData } from '@/lib/util';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { FunctionComponent, useEffect, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

export default function Dictionary() {
    const [selectedRegion, setSelectedRegion] = useState<Region>('アジア');
    const geographyData = getOneRegionGeographyData(selectedRegion);
    const [selectedCountry, setSelectedCountry] = useState<Geometry | null>(
        geographyData.objects.world.geometries.find((geo) => geo.id === 'JPN') ?? null,
    );
    const changeRegion = (region: Region) => {
        setSelectedRegion(region);
        const startCountry = allGeographyData.objects.world.geometries.find(
            (geo) => geo.properties.region === region,
        );
        setSelectedCountry(startCountry ?? null);
    };

    const selectedRegionCountries = geographyData.objects.world.geometries.filter(
        (item) => item.properties.region === selectedRegion,
    );

    const defaultZoomRate = 2;
    //初期値からdefaultZoomRateを適用すると、地図の中心がズレる前の位置で拡大されてしまうため。
    const [zoomRate, setZoomRate] = useState<number>(1);
    useEffect(() => {
        setZoomRate(defaultZoomRate);
    }, []);

    return (
        <div className="min-h-screen p-4 bg-gray-100">
            <BackButton />
            <div className="flex items-start justify-start gap-x-8 my-16">
                <div className="">
                    <RegionSelector selectedRegion={selectedRegion} changeRegion={changeRegion} />
                    <ul className="my-4 ml-4 flex flex-col gap-y-2">
                        {selectedRegionCountries.map((item) => (
                            <li
                                key={item.id}
                                className="hover:underline cursor-pointer"
                                onClick={() => setSelectedCountry(item)}
                            >
                                {item.properties.jpNames[0]}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="w-full">
                    <div className="mb-8">
                        <div className="flex flex-col justify-center items-center h-full">
                            {selectedCountry && (
                                <div className="">
                                    <h2 className="text-xl text-center font-bold mb-4">
                                        {selectedCountry.properties.jpNames[0]}
                                    </h2>
                                    <img
                                        src={getFlagImageUrl(selectedCountry.id)}
                                        alt={selectedCountry.id}
                                        width={256}
                                        height={192}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="border">
                        <GeographyMap
                            selectedCountry={selectedCountry}
                            geographyData={geographyData}
                            answeredCountriesMap={new Map()}
                            zoomRate={zoomRate}
                            inputRef={null}
                            setSelectedCountry={setSelectedCountry}
                            setUserInput={() => {}}
                            mapScale={400}
                            mapCenter={selectedCountry?.properties.coordinates}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

const RegionSelector: FunctionComponent<{
    selectedRegion: Region;
    changeRegion: (region: Region) => void;
}> = ({ selectedRegion, changeRegion }) => {
    return (
        <Listbox value={selectedRegion} onChange={changeRegion}>
            <ListboxButton className="relative flex justify-between items-center w-52 px-4 rounded-lg bg-white border py-1.5 text-left text-sm/6 focus:outline-none">
                {selectedRegion}
                <FaChevronDown />
            </ListboxButton>
            <ListboxOptions
                anchor="bottom"
                transition
                className="w-52 rounded-xl border border-white/5 bg-white p-1 focus:outline-none"
            >
                {regions.map((region) => (
                    <ListboxOption
                        key={region}
                        value={region}
                        className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none hover:bg-gray-100"
                    >
                        <div className="text-sm/6 ">{region}</div>
                    </ListboxOption>
                ))}
            </ListboxOptions>
        </Listbox>
    );
};
