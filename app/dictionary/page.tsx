'use client';
import { BackButton } from '@/component/layout';
import { GeographyMap } from '@/component/map';
import { getDescriptionFromId } from '@/lib/description';
import { getFlagImageUrl } from '@/lib/flag';
import { Geometry, Region, geographyData as allGeographyData, regions } from '@/lib/geography';
import { getOneRegionGeographyData } from '@/lib/util';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import Image from 'next/image';
import { FunctionComponent, useEffect, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { MdNavigateNext } from 'react-icons/md';
import { useSwipeable } from 'react-swipeable';

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

    const prevCountry = () => {
        const currentIndex = selectedRegionCountries.findIndex(
            (country) => country.id === selectedCountry?.id,
        );
        if (currentIndex > 0) {
            const prevCountry = selectedRegionCountries[currentIndex - 1];
            setSelectedCountry(prevCountry);
        } else {
            const currentRegionIndex = regions.indexOf(selectedRegion);
            if (currentRegionIndex > 0) {
                const newRegion = regions[currentRegionIndex - 1];
                //allGeographyData.objects.world.geometriesのregionが一致する中で最後の国を選択
                const lastCountryInNewRegion = allGeographyData.objects.world.geometries
                    .filter((geo) => geo.properties.region === newRegion)
                    .slice(-1)[0];
                setSelectedRegion(newRegion);
                setSelectedCountry(lastCountryInNewRegion ?? null);
            } else {
                setSelectedRegion(regions[regions.length - 1]);
                //allGeographyData.objects.world.geometriesのregionが一致する中で最後の国を選択
                const lastCountryInNewRegion = allGeographyData.objects.world.geometries
                    .filter((geo) => geo.properties.region === regions[regions.length - 1])
                    .slice(-1)[0];
                setSelectedCountry(lastCountryInNewRegion ?? null);
            }
        }
    };

    const nextCountry = () => {
        const currentIndex = selectedRegionCountries.findIndex(
            (country) => country.id === selectedCountry?.id,
        );
        if (currentIndex < selectedRegionCountries.length - 1) {
            const nextCountry = selectedRegionCountries[currentIndex + 1];
            setSelectedCountry(nextCountry);
        } else {
            const currentRegionIndex = regions.indexOf(selectedRegion);
            if (currentRegionIndex < regions.length - 1) {
                const newRegion = regions[currentRegionIndex + 1];
                //allGeographyData.objects.world.geometriesのregionが一致する中で最初の国を選択
                const firstCountryInNewRegion = allGeographyData.objects.world.geometries.filter(
                    (geo) => geo.properties.region === newRegion,
                )[0];
                setSelectedRegion(newRegion);
                setSelectedCountry(firstCountryInNewRegion ?? null);
            } else {
                setSelectedRegion(regions[0]);
                //allGeographyData.objects.world.geometriesのregionが一致する中で最初の国を選択
                const firstCountryInNewRegion = allGeographyData.objects.world.geometries.filter(
                    (geo) => geo.properties.region === regions[0],
                )[0];
                setSelectedCountry(firstCountryInNewRegion ?? null);
            }
        }
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                prevCountry();
            } else if (event.key === 'ArrowRight') {
                event.preventDefault();
                nextCountry();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedRegionCountries, selectedCountry]);

    const handlers = useSwipeable({
        onSwipedLeft: () => nextCountry(),
        onSwipedRight: () => prevCountry(),
    });

    return (
        <div className="h-screen px-4 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100 ">
            <div className="h-16">
                <BackButton />
            </div>
            <div className="flex flex-col lg:flex-row lg:items-center gap-2 my-4">
                <RegionSelector selectedRegion={selectedRegion} changeRegion={changeRegion} />
                {selectedCountry && (
                    <CountrySelector
                        selectedCountry={selectedCountry}
                        changeCountry={(countryId) => {
                            const country = selectedRegionCountries.find((c) => c.id === countryId);
                            setSelectedCountry(country ?? null);
                        }}
                        countries={selectedRegionCountries}
                    />
                )}
            </div>
            <div className="w-full ">
                <div {...handlers} className="h-40 flex items-center my-8 gap-x-4 lg:gap-x-8">
                    <MdNavigateNext
                        className="size-8 rotate-180 cursor-pointer"
                        onClick={prevCountry}
                    />
                    {selectedCountry && (
                        <div className="w-4/5 lg:w-[600px]">
                            <div className="flex items-center gap-x-4 lg:gap-x-8 mb-6">
                                <Image
                                    src={getFlagImageUrl(selectedCountry.id)}
                                    alt={selectedCountry.id}
                                    width={256}
                                    height={192}
                                    className="w-24 lg:w-32"
                                />
                                <div className="">
                                    <h2 className="text-lg lg:text-xl font-bold">
                                        {selectedCountry.properties.jpNames[0]}
                                    </h2>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm lg:text-base text-gray-600">
                                    {getDescriptionFromId(selectedCountry.id)}
                                </p>
                            </div>
                        </div>
                    )}
                    <MdNavigateNext className="size-8 cursor-pointer" onClick={nextCountry} />
                </div>
                <div className="hidden lg:block bg-white shadow rounded-2xl">
                    <GeographyMap
                        selectedCountry={selectedCountry}
                        geographyData={allGeographyData}
                        answeredCountriesMap={new Map()}
                        setAnsweredCountriesMap={() => {}}
                        zoomRate={zoomRate}
                        inputRef={null}
                        setSelectedCountry={setSelectedCountry}
                        setUserInput={() => {}}
                        mapScale={100}
                        height={250}
                    />
                </div>
                <div className="block lg:hidden bg-white shadow rounded-2xl">
                    <GeographyMap
                        selectedCountry={selectedCountry}
                        geographyData={allGeographyData}
                        answeredCountriesMap={new Map()}
                        setAnsweredCountriesMap={() => {}}
                        zoomRate={zoomRate}
                        inputRef={null}
                        setSelectedCountry={setSelectedCountry}
                        setUserInput={() => {}}
                        mapScale={150}
                        height={600}
                    />
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
            <div className="relative w-72 lg:w-56">
                <ListboxButton className="relative flex justify-between items-center w-full px-4 py-2 rounded-xl bg-white border border-gray-200 shadow-sm text-left text-sm lg:text-base font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all">
                    <span>{selectedRegion}</span>
                    <FaChevronDown className="ml-2 text-gray-400" />
                </ListboxButton>
                <ListboxOptions
                    anchor="bottom"
                    transition
                    className="absolute z-10 mt-1 w-72 lg:w-56 rounded-xl border border-gray-100 bg-white shadow-lg p-1 focus:outline-none"
                >
                    {regions.map((region) => (
                        <ListboxOption
                            key={region}
                            value={region}
                            className={({ active, selected }) =>
                                [
                                    'flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 select-none transition-colors',
                                    active ? 'bg-indigo-50 text-indigo-700' : '',
                                    selected ? 'font-semibold bg-indigo-100' : '',
                                ].join(' ')
                            }
                        >
                            <span className="text-sm">{region}</span>
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </div>
        </Listbox>
    );
};

const CountrySelector: FunctionComponent<{
    selectedCountry: Geometry;
    changeCountry: (countryId: Geometry['id']) => void;
    countries: Geometry[];
}> = ({ selectedCountry, changeCountry, countries }) => {
    return (
        <Listbox value={selectedCountry.id} onChange={changeCountry}>
            <div className="relative w-72 lg:w-96">
                <ListboxButton className="relative flex justify-between items-center w-full px-4 py-2 rounded-xl bg-white border border-gray-200 shadow-sm text-left text-sm lg:text-base truncate font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all">
                    <span>{selectedCountry.properties.jpNames[0]}</span>
                    <FaChevronDown className="ml-2 text-gray-400" />
                </ListboxButton>
                <ListboxOptions
                    anchor="bottom"
                    transition
                    className="absolute z-10 mt-1 w-72 lg:w-96 rounded-xl border border-gray-100 bg-white shadow-lg p-1 focus:outline-none"
                >
                    {countries.map((country) => (
                        <ListboxOption
                            key={country.id}
                            value={country.id}
                            className={({ active, selected }) =>
                                [
                                    'flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 select-none transition-colors',
                                    active ? 'bg-indigo-50 text-indigo-700' : '',
                                    selected ? 'font-semibold bg-indigo-100' : '',
                                ].join(' ')
                            }
                        >
                            <span className="text-sm">{country.properties.jpNames[0]}</span>
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </div>
        </Listbox>
    );
};
