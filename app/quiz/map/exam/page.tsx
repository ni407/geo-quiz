'use client';
import { Modal } from '@/component/common';
import { MapDrawer, MapLayoout } from '@/component/layout';
import {
    AnswerForm,
    AnswerInput,
    CurrentStatus,
    GeographyMap,
    ShuffleButton,
} from '@/component/map';
import { Geometry, geographyData } from '@/lib/geography';
import { pickRandomUnAnsweredCountry, useLocalStorage } from '@/lib/util';
import { useEffect, useRef, useState } from 'react';

export default function Page() {
    const [selectedCountry, setSelectedCountry] = useState<Geometry | null>(null);
    const [answeredCountriesMap, setAnsweredCountriesMap] = useState<Map<string, Geometry>>(
        new Map(),
    );
    const LocalStorageKey = 'exam-answeredCountriesMap';
    const { load, clearSaveData } = useLocalStorage(LocalStorageKey);

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
        if (localStorage.getItem(LocalStorageKey)) {
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
        localStorage.removeItem(LocalStorageKey);
    };

    const copyToClipboard = async () => {
        const text = `国名マスターに挑戦しました！\n
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
        <MapLayoout>
            <GeographyMap
                selectedCountry={selectedCountry}
                geographyData={geographyData}
                answeredCountriesMap={answeredCountriesMap}
                zoomRate={zoomRate}
                inputRef={ref}
                setSelectedCountry={setSelectedCountry}
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
                    <button
                        type="button"
                        onClick={finishAnswering}
                        className=" bg-blue-500 text-white test-xs md:text-sm p-2 rounded h-10 w-36 whitespace-nowrap cursor-pointer disabled:bg-gray-300"
                    >
                        回答終了
                    </button>
                </AnswerForm>
            </MapDrawer>
            <Modal
                visible={finishModalVisible}
                setVisible={setFinishModalVisible}
                onClose={onClose}
                title={''}
                footer={null}
            >
                <div className="flex flex-col items-center justify-center h-full">
                    <h2 className="text-xl font-bold mb-4">
                        あなたのスコアは
                        <span className="text-3xl font-extrabold mx-4">
                            {answeredCountriesMap.size}点
                        </span>
                        ({geographyData.objects.world.geometries.length}点中） です！
                    </h2>
                    <p className="text-lg mb-4">またの挑戦をお待ちしています！</p>
                    <div className="mt-4">
                        <button
                            type="button"
                            className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
                            onClick={copyToClipboard}
                        >
                            スコアをコピぺしてシェア
                        </button>
                    </div>
                </div>
            </Modal>
        </MapLayoout>
    );
}
