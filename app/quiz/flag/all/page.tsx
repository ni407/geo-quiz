'use client';
import { Drawer, QuizLayout } from '@/component/layout';
import {
    AnswerForm,
    AnswerInput,
    CheetButton,
    CurrentStatus,
    RegionHintButton,
    ShuffleButton,
} from '@/component/quiz';
import { getFlagImageUrl } from '@/lib/flag';
import { Geometry, geographyData } from '@/lib/geography';
import { pickRandomUnAnsweredCountry, useLocalStorage } from '@/lib/util';
import { useEffect, useRef, useState } from 'react';

export default function Page() {
    const startCountry = geographyData.objects.world.geometries.find((geo) => geo.id === 'JPN');

    const [selectedCountry, setSelectedCountry] = useState<Geometry | null>(startCountry ?? null);
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

    const localStorageKey = 'flag-all-answeredCountriesMap';
    const { load, clearSaveData } = useLocalStorage(localStorageKey);

    useEffect(() => {
        if (localStorage.getItem(localStorageKey)) {
            if (confirm('前回の途中から再開しますか？')) {
                const savedAnswerMap = load();
                setAnsweredCountriesMap(savedAnswerMap);
                selectRandomUnansweredCountry(savedAnswerMap);
                return;
            }
            clearSaveData();
            setAnsweredCountriesMap(new Map());
        }
    }, []);

    return (
        <QuizLayout>
            <div className="flex flex-col items-center justify-center my-auto h-full">
                {selectedCountry && (
                    <img
                        src={getFlagImageUrl(selectedCountry?.id)}
                        alt="国旗"
                        className="size-auto lg:size-96 my-auto"
                    />
                )}
            </div>

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
                    <RegionHintButton selectedCountry={selectedCountry} />
                    <CheetButton selectedCountry={selectedCountry} inputRef={ref} />
                </AnswerForm>
            </Drawer>
        </QuizLayout>
    );
}
