'use client';
import { MapDrawer, MapLayoout } from '@/component/layout';
import { AnswerForm, CheetButton, CurrentStatus, GeographyMap } from '@/component/map';
import { Geometry, geographyData } from '@/lib/geography';
import { pickRandomUnAnsweredCountry, useLocalStorage } from '@/lib/util';
import { useEffect, useRef, useState } from 'react';

export default function Page() {
    const [selectedCountry, setSelectedCountry] = useState<Geometry | null>(null);
    const [answeredCountriesMap, setAnsweredCountriesMap] = useState<Map<string, Geometry>>(
        new Map(),
    );

    const [userInput, setUserInput] = useState<string>('');
    const defaultZoomRate = 1.5;
    const [zoomRate, setZoomRate] = useState<number>(1);

    const ref = useRef<HTMLInputElement>(null);

    const selectRandomUnansweredCountry = () => {
        const randomCountry = pickRandomUnAnsweredCountry(
            geographyData.objects.world.geometries,
            answeredCountriesMap,
        );
        if (!randomCountry) return;
        setSelectedCountry(randomCountry);
        setZoomRate(defaultZoomRate);
        ref.current?.focus();
    };

    const LocalStorageKey = 'all-answeredCountriesMap';
    const { load, clearSaveData } = useLocalStorage(LocalStorageKey);

    useEffect(() => {
        if (localStorage.getItem(LocalStorageKey)) {
            if (confirm('前回の途中から再開しますか？')) {
                load(setAnsweredCountriesMap);
                selectRandomUnansweredCountry();
                return;
            }
            clearSaveData(setAnsweredCountriesMap);
        }
    }, []);

    return (
        <MapLayoout>
            <GeographyMap
                selectedCountry={selectedCountry}
                geographyData={geographyData}
                answeredCountriesMap={answeredCountriesMap}
                zoomRate={zoomRate}
                inputRef={ref}
                setSelectedCountry={setSelectedCountry}
                setZoomRate={setZoomRate}
                setUserInput={setUserInput}
                mapScale={250}
            />
            <MapDrawer>
                <CurrentStatus
                    answeredCountriesMap={answeredCountriesMap}
                    geometries={geographyData.objects.world.geometries}
                />
                <AnswerForm
                    selectedCountry={selectedCountry}
                    userInput={userInput}
                    setUserInput={setUserInput}
                    inputRef={ref}
                    answeredCountriesMap={answeredCountriesMap}
                    setAnsweredCountriesMap={setAnsweredCountriesMap}
                    localStorageKey={LocalStorageKey}
                    setSelectedCountry={setSelectedCountry}
                    setZoomRate={setZoomRate}
                    defaultZoomRate={defaultZoomRate}
                    geometries={geographyData.objects.world.geometries}
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
                        className=" bg-blue-500 text-white test-xs md:text-base p-2 rounded w-36 whitespace-nowrap cursor-pointer disabled:bg-gray-300"
                        disabled={userInput === '' || selectedCountry === null}
                    >
                        回答
                    </button>
                    <CheetButton selectedCountry={selectedCountry} inputRef={ref} />
                </AnswerForm>
            </MapDrawer>
        </MapLayoout>
    );
}
