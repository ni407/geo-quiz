'use client';
import { getCoordinates } from '@/lib/coordinates';
import { geographyData } from '@/lib/geography';
import { checkAnswer, getJpNames } from '@/lib/ja_name';
import { getRegion } from '@/lib/region';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FaFlag } from 'react-icons/fa';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';

export default function Page() {
    const [selectedCountryName, setSelectedCountryName] = useState<string | null>(null);
    const [userInput, setUserInput] = useState<string>('');
    const coordinates = useMemo(
        () => (selectedCountryName ? getCoordinates(selectedCountryName) : null),
        [selectedCountryName],
    );
    const [zoomRate, setZoomRate] = useState<number>(1);

    const handleCountryClick = (geo: any) => {
        if (answeredCountriesNameSet.has(geo.properties.name)) {
            const translatedAnswer = getJpNames(geo.properties.name)[0];
            alert(translatedAnswer);
            ref.current?.focus();
            return;
        }
        setSelectedCountryName(geo.properties.name);
        setUserInput('');
        ref.current?.focus();
    };

    const DrawerHeight = 140;

    const [answeredCountriesNameSet, setAnsweredCountriesNameSet] = useState<Set<string>>(
        new Set(),
    );
    const getDefaultBgColor = useMemo(
        () => (countryName: string) => {
            if (answeredCountriesNameSet.has(countryName)) {
                return '#A0D3FF';
            }

            if (countryName === selectedCountryName) {
                return '#E42';
            }
            return '#EAEAEA';
        },
        [selectedCountryName, answeredCountriesNameSet],
    );

    const getHoverBgColor = useMemo(
        () => (countryName: string) => {
            if (answeredCountriesNameSet.has(countryName)) {
                return '#A0D3FF';
            }
            return '#F53';
        },
        [answeredCountriesNameSet],
    );

    const getPressedBgColor = useMemo(
        () => (countryName: string) => {
            if (answeredCountriesNameSet.has(countryName)) {
                return '#A0D3FF';
            }
            return '#E42';
        },
        [answeredCountriesNameSet],
    );

    const answer = () => {
        if (selectedCountryName === null) {
            alert('国を選択してください。');
            return;
        }
        if (checkAnswer(userInput, selectedCountryName)) {
            const newSet = new Set([...answeredCountriesNameSet, selectedCountryName]);
            setAnsweredCountriesNameSet(newSet);
            setUserInput('');
            alert('正解です！');
            save(newSet);
            selectRandomUnansweredCountry(selectedCountryName);
        } else {
            alert('不正解です。');
            setUserInput('');
        }
        ref.current?.focus();
    };
    const ref = useRef<HTMLInputElement>(null);

    const selectRandomUnansweredCountry = (beforeCountryName?: string) => {
        const unansweredCountries = geographyData.objects.world.geometries.filter(
            (geo) =>
                !answeredCountriesNameSet.has(geo.properties.name) &&
                beforeCountryName !== geo.properties.name,
        );
        if (unansweredCountries.length === 0) {
            alert('すべての国を答えました！');
            return;
        }
        let targetCountries = unansweredCountries;
        if (beforeCountryName) {
            const sameRegionCountries = unansweredCountries.filter((geo) => {
                const region = getRegion(geo.properties.name);
                const selectedRegion = getRegion(beforeCountryName);
                return region === selectedRegion;
            });
            if (sameRegionCountries.length > 0) {
                targetCountries = sameRegionCountries;
            }
        }

        const randomIndex = Math.floor(Math.random() * targetCountries.length);
        const randomCountryName = targetCountries[randomIndex].properties.name;
        setSelectedCountryName(randomCountryName);
        setZoomRate(2);
    };

    const save = (countriesNameSet: Set<string>) => {
        const answeredCountriesNameSetString = JSON.stringify(Array.from(countriesNameSet));
        localStorage.setItem('answeredCountriesNameSet', answeredCountriesNameSetString);
    };
    const load = () => {
        const answeredCountriesNameSetString = localStorage.getItem('answeredCountriesNameSet');
        if (answeredCountriesNameSetString) {
            const answeredCountriesNameSetArray = JSON.parse(answeredCountriesNameSetString);
            const answeredCountriesNameSet = new Set(answeredCountriesNameSetArray);
            setAnsweredCountriesNameSet(answeredCountriesNameSet as Set<string>);
        }
    };
    const clearSaveData = () => {
        localStorage.removeItem('answeredCountriesNameSet');
        setAnsweredCountriesNameSet(new Set());
    };

    useEffect(() => {
        if (localStorage.getItem('answeredCountriesNameSet')) {
            if (confirm('前回の途中から再開しますか？')) {
                load();
                selectRandomUnansweredCountry();
                return;
            }
            clearSaveData();
        }
    }, []);

    const showAnswer = () => {
        if (selectedCountryName === null) {
            alert('国を選択してください。');
            return;
        }
        const translatedAnswer = getJpNames(selectedCountryName)[0];
        alert(`答えは「${translatedAnswer}」です。`);
        ref.current?.focus();
    };

    const isFinished = useMemo(() => {
        return answeredCountriesNameSet.size === geographyData.objects.world.geometries.length;
    }, [answeredCountriesNameSet]);

    useEffect(() => {
        if (isFinished) {
            alert('すべての国を答えました！\nあなたこそ世界の国マスターです！');
            clearSaveData();
        }
    }, [isFinished]);

    return (
        <div className={`overflow-hidden w-screen h-[calc(100vh-${DrawerHeight}px)]`}>
            <ComposableMap>
                <ZoomableGroup center={coordinates ?? undefined} zoom={zoomRate}>
                    <Geographies geography={geographyData} className="relative">
                        {({ geographies }) =>
                            geographies.map((geo) => (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    stroke="#FFF"
                                    strokeWidth={0.3}
                                    onClick={(event) => {
                                        handleCountryClick(geo);
                                    }}
                                    style={{
                                        default: { fill: getDefaultBgColor(geo.properties.name) },
                                        hover: { fill: getHoverBgColor(geo.properties.name) },
                                        pressed: { fill: getPressedBgColor(geo.properties.name) },
                                    }}
                                    className="focus:outline-none"
                                />
                            ))
                        }
                    </Geographies>
                    {coordinates && (
                        <Marker coordinates={coordinates} className="-translate-y-[16px]">
                            <FaFlag className=" text-yellow-400 size-4" />
                        </Marker>
                    )}
                </ZoomableGroup>
            </ComposableMap>
            <div
                className="fixed bottom-0 left-0 w-full rounded bg-amber-100 p-4"
                style={{ height: DrawerHeight }}
            >
                <p className="text-xl font-bold">
                    現在の回答状況：{answeredCountriesNameSet.size}/
                    {geographyData.objects.world.geometries.length}カ国
                </p>
                <form
                    className="mt-4 flex items-center gap-x-2"
                    onSubmit={(e) => {
                        e.preventDefault();
                        answer();
                    }}
                >
                    <input
                        type="text"
                        placeholder="国名を入力（Enterで回答可）"
                        className="border p-2 rounded w-full focus:outline-none focus:ring focus:ring-[#F53]"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        ref={ref}
                    />
                    <button
                        type="submit"
                        className=" bg-blue-500 text-white p-2 rounded w-36 cursor-pointer disabled:bg-gray-300"
                        disabled={userInput === '' || selectedCountryName === null}
                    >
                        回答
                    </button>
                    <button
                        type="button"
                        className=" bg-red-400 text-white p-2 rounded w-36 cursor-pointer disabled:bg-gray-300"
                        onClick={showAnswer}
                        disabled={selectedCountryName === null}
                    >
                        カンニング
                    </button>
                </form>
            </div>
        </div>
    );
}
