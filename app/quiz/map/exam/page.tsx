'use client';
import { Drawer, QuizLayout } from '@/component/layout';
import { GeographyMap } from '@/component/map';
import {
    AnswerForm,
    AnswerInput,
    CurrentStatus,
    FinishButton,
    FinishModal,
    SkipButton,
} from '@/component/quiz';
import { Geometry, geographyData } from '@/lib/geography';
import { pickRandomUnAnsweredCountry, useLocalStorage, useWindowSize } from '@/lib/util';
import { useEffect, useRef, useState } from 'react';

export type AnsweredCountriesMap = Map<string, Geometry & { skipped?: boolean }>;
export default function Page() {
    const [selectedCountry, setSelectedCountry] = useState<Geometry | null>(null);
    const [answeredCountriesMap, setAnsweredCountriesMap] = useState<AnsweredCountriesMap>(
        new Map(),
    );
    const localStorageKey = 'exam-answeredCountriesMap';
    const { load, clearSaveData } = useLocalStorage(localStorageKey);

    const [userInput, setUserInput] = useState<string>('');
    const defaultZoomRate = 1.5;
    const [zoomRate, setZoomRate] = useState<number>(1);
    //初期値からdefaultZoomRateを適用すると、地図の中心がズレる前の位置で拡大されてしまうため。
    useEffect(() => {
        setZoomRate(defaultZoomRate);
    }, []);

    const ref = useRef<HTMLInputElement>(null);

    const selectRandomUnansweredCountry = (countriesMap: Map<string, Geometry>) => {
        const randomCountry = pickRandomUnAnsweredCountry(
            geographyData.objects.world.geometries,
            countriesMap,
        );
        if (!randomCountry) return;
        setSelectedCountry(randomCountry);
        setZoomRate(defaultZoomRate);
        ref.current?.focus();
    };

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

    const { width, contentHeight } = useWindowSize();

    const [finishModalVisible, setFinishModalVisible] = useState(false);
    const onClose = () => {
        setAnsweredCountriesMap(new Map());
        setSelectedCountry(null);
        setUserInput('');
        localStorage.removeItem(localStorageKey);
    };

    const score = [...answeredCountriesMap.values()].filter((country) => !country.skipped).length;
    const copyToClipboard = async () => {
        const text = `GeoQuizの地図検定に挑戦しました！\n
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

    const geometries = geographyData.objects.world.geometries;
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
        if (setZoomRate && defaultZoomRate) {
            setZoomRate(defaultZoomRate);
        }
        ref.current?.focus();
    };

    return (
        <QuizLayout>
            <GeographyMap
                selectedCountry={selectedCountry}
                geographyData={geographyData}
                answeredCountriesMap={answeredCountriesMap}
                setAnsweredCountriesMap={setAnsweredCountriesMap}
                zoomRate={zoomRate}
                inputRef={ref}
                setSelectedCountry={setSelectedCountry}
                setUserInput={setUserInput}
                mapScale={250}
                width={width}
                height={contentHeight}
            />
            <Drawer>
                <CurrentStatus
                    answeredCountriesMap={answeredCountriesMap}
                    geometries={geometries}
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
                    geometries={geometries}
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
