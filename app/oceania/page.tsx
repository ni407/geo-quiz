'use client';
import { MapDrawer, MapLayoout } from '@/component/layout';
import { AnswerForm, CheetButton, CurrentStatus, GeographyMap } from '@/component/map';
import { Geometry } from '@/lib/geography';
import {
    getOneRegionGeographyData,
    pickRandomUnAnsweredCountry,
    useLocalStorage,
} from '@/lib/util';
import { useEffect, useRef, useState } from 'react';

export default function Page() {
    const geographyData = getOneRegionGeographyData('オセアニア');
    const startCountry = geographyData.objects.world.geometries.find((geo) => geo.id === 'AUS');
    const LocalStorageKey = 'oceania-answeredCountriesMap';
    const { load, clearSaveData } = useLocalStorage(LocalStorageKey);

    const [selectedCountry, setSelectedCountry] = useState<Geometry | null>(startCountry ?? null);
    const [answeredCountriesMap, setAnsweredCountriesMap] = useState<Map<string, Geometry>>(
        new Map(),
    );

    const [userInput, setUserInput] = useState<string>('');
    const ref = useRef<HTMLInputElement>(null);

    const defaultZoomRate = 2;
    const [zoomRate, setZoomRate] = useState<number>(1);

    //初期値からdefaultZoomRateを適用すると、地図の中心がズレる前の位置で拡大されてしまうため。
    useEffect(() => {
        setZoomRate(defaultZoomRate);
    }, []);

    const selectRandomUnansweredCountry = () => {
        const randomCountry = pickRandomUnAnsweredCountry(
            geographyData.objects.world.geometries,
            answeredCountriesMap,
        );
        if (!randomCountry) return;
        setSelectedCountry(randomCountry);
        ref.current?.focus();
    };

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
                mapCenter={startCountry?.properties.coordinates}
                mapScale={300}
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
