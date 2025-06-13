'use client';
import { FlagDisplay } from '@/component/flag';
import { Drawer, QuizLayout } from '@/component/layout';
import {
    AnswerForm,
    AnswerInput,
    CurrentStatus,
    FinishButton,
    FinishModal,
    SkipButton,
} from '@/component/quiz';
import { Geometry, geographyData } from '@/lib/geography';
import { pickRandomUnAnsweredCountry, useLocalStorage, useQuizPreparation } from '@/lib/util';
import { useRef, useState } from 'react';
import { AnsweredCountriesMap } from '../../map/exam/page';

export default function Page() {
    const geometries = geographyData.objects.world.geometries;

    const startCountry = geometries[Math.floor(Math.random() * geometries.length)];

    const [selectedCountry, setSelectedCountry] = useState<Geometry | null>(startCountry ?? null);
    const [answeredCountriesMap, setAnsweredCountriesMap] = useState<AnsweredCountriesMap>(
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

    const localStorageKey = 'flag-exam-answeredCountriesMap';

    useQuizPreparation(localStorageKey, setAnsweredCountriesMap, selectRandomUnansweredCountry);

    const [finishModalVisible, setFinishModalVisible] = useState(false);
    const onClose = () => {
        setAnsweredCountriesMap(new Map());
        setSelectedCountry(null);
        setUserInput('');
        localStorage.removeItem(localStorageKey);
        selectRandomUnansweredCountry(new Map());
    };

    const score = [...answeredCountriesMap.values()].filter((country) => !country.skipped).length;

    const copyToClipboard = async () => {
        const text = `GeoQuizの国旗検定に挑戦しました！\n
わたしのスコアは
${score}点(${geographyData.objects.world.geometries.length}点中） \nでした！\n
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

    const { save } = useLocalStorage(localStorageKey);

    const pass = () => {
        if (selectedCountry === null) {
            alert('国を選択してください。');
            return;
        }
        const newMap = new Map(answeredCountriesMap);
        newMap.set(selectedCountry.id, { ...selectedCountry, skipped: true });
        setAnsweredCountriesMap(newMap);
        save(newMap);
        if (newMap.size === geometries.length) {
            setFinishModalVisible(true);
            return;
        }

        const nextCountry = pickRandomUnAnsweredCountry(geometries, newMap, selectedCountry);
        if (!nextCountry) return;

        setSelectedCountry(nextCountry);

        ref.current?.focus();
    };

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
                    setFinishModalVisible={setFinishModalVisible}
                >
                    <AnswerInput userInput={userInput} setUserInput={setUserInput} inputRef={ref} />
                    <SkipButton onClick={pass} />
                    <FinishButton
                        onClick={() => {
                            setFinishModalVisible(true);
                        }}
                    />
                </AnswerForm>
            </Drawer>
            <FinishModal
                finishModalVisible={finishModalVisible}
                setFinishModalVisible={setFinishModalVisible}
                geographyData={geographyData}
                score={score}
                onClose={onClose}
                copyToClipboard={copyToClipboard}
            />
        </QuizLayout>
    );
}
