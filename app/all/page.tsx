'use client';
import { Geometry, geographyData } from '@/lib/geography';
import { checkAnswer, useWindowSize } from '@/lib/util';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FaFlag } from 'react-icons/fa';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';

export default function Page() {
    const [selectedCountry, setSelectedCountry] = useState<Geometry | null>(null);
    const [userInput, setUserInput] = useState<string>('');

    const [zoomRate, setZoomRate] = useState<number>(1);

    const handleCountryClick = (geo: Geometry) => {
        if (answeredCountriesMap.has(geo.id)) {
            alert(selectedCountry?.properties.jpNames[0]);
            ref.current?.focus();
            return;
        }
        setSelectedCountry(geo);
        setUserInput('');
        setZoomRate(2);
        ref.current?.focus();
    };

    const DrawerHeight = 140;

    const [answeredCountriesMap, setAnsweredCountriesMap] = useState<Map<string, Geometry>>(
        new Map(),
    );
    const getDefaultBgColor = useMemo(
        () => (countryId: string) => {
            if (answeredCountriesMap.has(countryId)) {
                return '#A0D3FF';
            }

            if (countryId === selectedCountry?.id) {
                return '#E42';
            }
            return '#EAEAEA';
        },
        [selectedCountry, answeredCountriesMap],
    );

    const getHoverBgColor = useMemo(
        () => (countryId: string) => {
            if (answeredCountriesMap.has(countryId)) {
                return '#A0D3FF';
            }
            return '#F53';
        },
        [answeredCountriesMap],
    );

    const getPressedBgColor = useMemo(
        () => (countryId: string) => {
            if (answeredCountriesMap.has(countryId)) {
                return '#A0D3FF';
            }
            return '#E42';
        },
        [answeredCountriesMap],
    );

    const answer = () => {
        if (selectedCountry === null) {
            alert('国を選択してください。');
            return;
        }
        if (checkAnswer(userInput, selectedCountry.properties.jpNames)) {
            const newMap = new Map(answeredCountriesMap);
            newMap.set(selectedCountry.id, selectedCountry);
            setAnsweredCountriesMap(newMap);
            setUserInput('');
            alert('正解です！');
            save(newMap);
            selectRandomUnansweredCountry(selectedCountry);
        } else {
            alert('不正解です。');
            setUserInput('');
        }
        ref.current?.focus();
    };
    const ref = useRef<HTMLInputElement>(null);

    const selectRandomUnansweredCountry = (beforeCountry?: Geometry) => {
        const unansweredCountries = geographyData.objects.world.geometries.filter(
            (geo) =>
                !answeredCountriesMap.has(geo.id) &&
                (beforeCountry ? beforeCountry.id !== geo.id : true),
        );
        if (unansweredCountries.length === 0) return;

        let targetCountries = unansweredCountries;
        if (beforeCountry) {
            const sameRegionCountries = unansweredCountries.filter(
                (geo) => geo.properties.region === beforeCountry.properties.region,
            );
            if (sameRegionCountries.length > 0) {
                targetCountries = sameRegionCountries;
            }
        }

        const randomIndex = Math.floor(Math.random() * targetCountries.length);
        const randomCountry = targetCountries[randomIndex];
        setSelectedCountry(randomCountry);
        setZoomRate(2);
        ref.current?.focus();
    };

    const LocalStorageKey = 'all-answeredCountriesMap';
    const save = (countriesMap: Map<string, Geometry>) => {
        const answeredCountriesMapString = JSON.stringify(Array.from(countriesMap));
        localStorage.setItem(LocalStorageKey, answeredCountriesMapString);
    };
    const load = () => {
        const answeredCountriesMapString = localStorage.getItem(LocalStorageKey);
        if (answeredCountriesMapString) {
            const answeredCountriesMapArray = JSON.parse(answeredCountriesMapString);
            const answeredCountriesMap = new Map(answeredCountriesMapArray);
            setAnsweredCountriesMap(answeredCountriesMap as Map<string, Geometry>);
        }
    };
    const clearSaveData = () => {
        localStorage.removeItem(LocalStorageKey);
        setAnsweredCountriesMap(new Map());
    };

    useEffect(() => {
        if (localStorage.getItem(LocalStorageKey)) {
            if (confirm('前回の途中から再開しますか？')) {
                load();
                selectRandomUnansweredCountry();
                return;
            }
            clearSaveData();
        }
    }, []);

    const showAnswer = () => {
        if (selectedCountry === null) {
            alert('国を選択してください。');
            return;
        }
        alert(`答えは「${selectedCountry.properties.jpNames[0]}」です。`);
        ref.current?.focus();
    };

    const isFinished = useMemo(() => {
        return answeredCountriesMap.size === geographyData.objects.world.geometries.length;
    }, [answeredCountriesMap]);

    useEffect(() => {
        if (isFinished) {
            alert('すべての国を答えました！\nあなたこそ世界の国マスターです！');
            clearSaveData();
        }
    }, [isFinished]);

    const size = useWindowSize();

    return (
        <div className={`overflow-hidden w-screen  h-[calc(100vh-${DrawerHeight}px)]`}>
            <ComposableMap
                projection="geoEqualEarth"
                width={size[0]}
                height={size[1] - DrawerHeight < 0 ? 0 : size[1] - DrawerHeight}
            >
                <ZoomableGroup center={selectedCountry?.properties.coordinates} zoom={zoomRate}>
                    <Geographies geography={geographyData}>
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
                                        default: { fill: getDefaultBgColor(geo.id) },
                                        hover: { fill: getHoverBgColor(geo.id) },
                                        pressed: { fill: getPressedBgColor(geo.id) },
                                    }}
                                    className="focus:outline-none"
                                />
                            ))
                        }
                    </Geographies>
                    {selectedCountry && (
                        <Marker
                            coordinates={selectedCountry.properties.coordinates}
                            className="-translate-y-[15px]"
                        >
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
                    現在の回答状況：{answeredCountriesMap.size}/
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
                        disabled={userInput === '' || selectedCountry === null}
                    >
                        回答
                    </button>
                    <button
                        type="button"
                        className=" bg-red-400 text-white p-2 rounded w-36 cursor-pointer disabled:bg-gray-300"
                        onClick={showAnswer}
                        disabled={selectedCountry === null}
                    >
                        カンニング
                    </button>
                </form>
            </div>
        </div>
    );
}
