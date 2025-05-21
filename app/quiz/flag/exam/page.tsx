'use client';
import { Drawer, QuizLayout } from '@/component/layout';
import {
    AnswerForm,
    AnswerInput,
    CurrentStatus,
    FinishButton,
    FinishModal,
    ShuffleButton,
} from '@/component/quiz';
import { getFlagImageUrl } from '@/lib/flag';
import { Geometry, geographyData } from '@/lib/geography';
import { pickRandomUnAnsweredCountry, useLocalStorage } from '@/lib/util';
import { useEffect, useRef, useState } from 'react';

export default function Page() {
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
        selectRandomUnansweredCountry(new Map());
    }, []);

    const finishAnswering = () => {
        if (confirm('本当に終了しますか？')) {
            setFinishModalVisible(true);
        }
    };
    const [finishModalVisible, setFinishModalVisible] = useState(false);
    const onClose = () => {
        setAnsweredCountriesMap(new Map());
        setSelectedCountry(null);
        setUserInput('');
        localStorage.removeItem(localStorageKey);
        selectRandomUnansweredCountry(new Map());
    };

    const copyToClipboard = async () => {
        const text = `GeoQuizの地図検定に挑戦しました！\n
わたしのスコアは
${answeredCountriesMap.size}点(${geographyData.objects.world.geometries.length}点中） \nでした！\n
みんなも挑戦してみてね！
${location.origin}
`;

        try {
            await navigator.clipboard.writeText(text);
            alert('コピーしました！');
        } catch (err) {
            alert('コピーに失敗しました。');
        }
    };

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
                    setFinishModalVisible={setFinishModalVisible}
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
                    <FinishButton onClick={finishAnswering} />
                </AnswerForm>
            </Drawer>
            <FinishModal
                finishModalVisible={finishModalVisible}
                setFinishModalVisible={setFinishModalVisible}
                geographyData={geographyData}
                answeredCountriesMap={answeredCountriesMap}
                onClose={onClose}
                copyToClipboard={copyToClipboard}
            />
        </QuizLayout>
    );
}
