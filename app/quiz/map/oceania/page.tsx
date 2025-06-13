'use client';
import { Drawer, QuizLayout } from '@/component/layout';
import { ColorPalette, GeographyMap } from '@/component/map';
import {
    AnswerForm,
    AnswerInput,
    CheetButton,
    CurrentStatus,
    HintButton,
    HintType,
    ShuffleButton,
} from '@/component/quiz';
import { Geometry } from '@/lib/geography';
import {
    getOneRegionGeographyData,
    pickRandomUnAnsweredCountry,
    useQuizPreparation,
    useWindowSize,
} from '@/lib/util';
import { useEffect, useRef, useState } from 'react';

export default function Page() {
    const geographyData = getOneRegionGeographyData('オセアニア');
    const startCountry = geographyData.objects.world.geometries.find((geo) => geo.id === 'AUS');
    const localStorageKey = 'oceania-answeredCountriesMap';

    const [selectedCountry, setSelectedCountry] = useState<Geometry | null>(null);
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

    const selectRandomUnansweredCountry = (countriesMap: Map<string, Geometry>) => {
        const randomCountry = pickRandomUnAnsweredCountry(
            geographyData.objects.world.geometries,
            countriesMap,
        );
        if (!randomCountry) return;
        setSelectedCountry(randomCountry);
        ref.current?.focus();
    };

    useQuizPreparation({
        localStorageKey,
        setAnsweredCountriesMap,
        selectRandomUnansweredCountry,
        reStartQuiz: () => {
            setSelectedCountry(startCountry || null);
        },
    });

    const { width, contentHeight } = useWindowSize();

    return (
        <QuizLayout backgroundColor={ColorPalette.ocean}>
            <GeographyMap
                selectedCountry={selectedCountry}
                geographyData={geographyData}
                answeredCountriesMap={answeredCountriesMap}
                setAnsweredCountriesMap={setAnsweredCountriesMap}
                zoomRate={zoomRate}
                inputRef={ref}
                setSelectedCountry={setSelectedCountry}
                setUserInput={setUserInput}
                mapCenter={startCountry?.properties.coordinates}
                mapScale={200}
                width={width}
                height={contentHeight}
            />
            <Drawer>
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
                    localStorageKey={localStorageKey}
                    setSelectedCountry={setSelectedCountry}
                    setZoomRate={setZoomRate}
                    defaultZoomRate={defaultZoomRate}
                    geometries={geographyData.objects.world.geometries}
                >
                    <AnswerInput userInput={userInput} setUserInput={setUserInput} inputRef={ref} />
                    <ShuffleButton
                        onClick={() => {
                            const nextCountryExceptions = new Map(answeredCountriesMap);
                            if (selectedCountry) {
                                nextCountryExceptions.set(selectedCountry?.id, selectedCountry);
                            }

                            selectRandomUnansweredCountry(nextCountryExceptions);
                        }}
                    />
                    <HintButton
                        selectedCountry={selectedCountry}
                        hintTypes={[HintType.Flag, HintType.Description]}
                    />
                    <CheetButton selectedCountry={selectedCountry} inputRef={ref} />
                </AnswerForm>
            </Drawer>
        </QuizLayout>
    );
}
