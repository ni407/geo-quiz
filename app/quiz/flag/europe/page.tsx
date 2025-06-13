'use client';
import { FlagDisplay } from '@/component/flag';
import { Drawer, QuizLayout } from '@/component/layout';
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
} from '@/lib/util';
import { useRef, useState } from 'react';

export default function Page() {
    const geographyData = getOneRegionGeographyData('ヨーロッパ');
    const startCountry = geographyData.objects.world.geometries.find((geo) => geo.id === 'GBR'); // イギリス
    const localStorageKey = 'flag-eu-answeredCountriesMap';

    const [selectedCountry, setSelectedCountry] = useState<Geometry | null>(null);
    const [answeredCountriesMap, setAnsweredCountriesMap] = useState<Map<string, Geometry>>(
        new Map(),
    );

    const [userInput, setUserInput] = useState<string>('');
    const ref = useRef<HTMLInputElement>(null);

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

    return (
        <QuizLayout>
            <FlagDisplay selectedCountry={selectedCountry} />

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
                        hintTypes={[HintType.Description]}
                    />
                    <CheetButton selectedCountry={selectedCountry} inputRef={ref} />
                </AnswerForm>
            </Drawer>
        </QuizLayout>
    );
}
