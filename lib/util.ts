import { useLayoutEffect, useState } from 'react';
import { Geometry, Region, geographyData } from './geography';

export const isJapaneseMatch = (inputStr: string, answer: string) => {
    // ひらがなをカタカナに変換する関数
    const toKatakana = (str: string) => {
        return str.replace(/[\u3041-\u3096]/g, (c) => {
            const code = c.charCodeAt(0) + 0x60;
            return String.fromCharCode(code);
        });
    };

    // 入力文字列と答えをカタカナに変換して比較
    const inputKatakana = toKatakana(inputStr);
    const answerKatakana = toKatakana(answer);

    return inputKatakana === answerKatakana;
};

export const checkAnswer = (inputStr: string, answers: string[]) => {
    let isMatch = false;
    for (const name of answers) {
        if (isJapaneseMatch(inputStr, name)) {
            isMatch = true;
            break;
        }
    }
    return isMatch;
};

export const useWindowSize = (): number[] => {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
        const updateSize = (): void => {
            setSize([window.innerWidth, window.innerHeight]);
        };

        window.addEventListener('resize', updateSize);
        updateSize();

        return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
};

export const useLocalStorage = (LocalStorageKey: string) => {
    const save = (countriesMap: Map<string, Geometry>) => {
        const answeredCountriesMapString = JSON.stringify(Array.from(countriesMap));
        localStorage.setItem(LocalStorageKey, answeredCountriesMapString);
    };
    const load = (updateAnsweredCountriesMap: (map: Map<string, Geometry>) => void) => {
        const answeredCountriesMapString = localStorage.getItem(LocalStorageKey);
        if (answeredCountriesMapString) {
            const answeredCountriesMapArray = JSON.parse(answeredCountriesMapString);
            const answeredCountriesMap = new Map(answeredCountriesMapArray);
            updateAnsweredCountriesMap(answeredCountriesMap as Map<string, Geometry>);
        }
    };
    const clearSaveData = (updateAnsweredCountriesMap: (map: Map<string, Geometry>) => void) => {
        localStorage.removeItem(LocalStorageKey);
        updateAnsweredCountriesMap(new Map());
    };

    return { save, load, clearSaveData };
};

export const pickRandomUnAnsweredCountry = (
    geometries: Geometry[],
    answeredCountriesMap: Map<string, Geometry>,
    prevCountry?: Geometry,
) => {
    const unansweredCountries = geometries.filter((geo) => !answeredCountriesMap.has(geo.id));
    if (unansweredCountries.length === 0) return;

    let targetCountries = unansweredCountries;
    if (prevCountry) {
        const sameRegionCountries = unansweredCountries.filter(
            (geo) => geo.properties.region === prevCountry.properties.region,
        );
        if (sameRegionCountries.length > 0) {
            targetCountries = sameRegionCountries;
        }
    }

    const randomIndex = Math.floor(Math.random() * targetCountries.length);
    const randomCountry = targetCountries[randomIndex];

    return randomCountry;
};

export const getOneRegionGeographyData = (region: Region) => {
    const regionGeometries = geographyData.objects.world.geometries.filter(
        (geo) => geo.properties.region === region,
    );
    const regionGeographyData = {
        ...geographyData,
        objects: {
            ...geographyData.objects,
            world: {
                ...geographyData.objects.world,
                geometries: regionGeometries,
            },
        },
    };
    return regionGeographyData;
};
