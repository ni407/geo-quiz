import { getFlagImageUrl } from '@/lib/flag';
import { GeographyData, Geometry } from '@/lib/geography';
import {
    checkAnswer,
    pickRandomUnAnsweredCountry,
    useLocalStorage,
    useWindowSize,
} from '@/lib/util';
import { Dispatch, FunctionComponent, RefObject, SetStateAction, useMemo } from 'react';
import { FaFlag } from 'react-icons/fa';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { DrawerHeight } from './layout';

export const GeographyMap: FunctionComponent<{
    selectedCountry: Geometry | null;
    geographyData: GeographyData;
    answeredCountriesMap: Map<string, Geometry>;
    zoomRate: number;
    inputRef: RefObject<HTMLInputElement | null>;
    setSelectedCountry: Dispatch<SetStateAction<Geometry | null>>;
    setUserInput: Dispatch<SetStateAction<string>>;
    setZoomRate: Dispatch<SetStateAction<number>>;
    mapScale: number;
    mapCenter?: [number, number];
}> = ({
    selectedCountry,
    geographyData,
    answeredCountriesMap,
    zoomRate,
    inputRef,
    setSelectedCountry,
    setUserInput,
    setZoomRate,
    mapScale,
    mapCenter,
}) => {
    const size = useWindowSize();

    const getDefaultBgColor = useMemo(
        () => (countryId: string) => {
            if (answeredCountriesMap.has(countryId)) {
                return '#A0D3FF';
            }

            if (countryId === selectedCountry?.id) {
                return '#E42';
            }
            return '#EAEAEA';
        },
        [selectedCountry, answeredCountriesMap],
    );

    const getHoverBgColor = useMemo(
        () => (countryId: string) => {
            if (answeredCountriesMap.has(countryId)) {
                return '#A0D3FF';
            }
            return '#F53';
        },
        [answeredCountriesMap],
    );

    const getPressedBgColor = useMemo(
        () => (countryId: string) => {
            if (answeredCountriesMap.has(countryId)) {
                return '#A0D3FF';
            }
            return '#E42';
        },
        [answeredCountriesMap],
    );

    const handleCountryClick = (geo: Geometry) => {
        if (answeredCountriesMap.has(geo.id)) {
            alert(geo.properties.jpNames[0]);
            inputRef.current?.focus();
            return;
        }
        setSelectedCountry(geo);
        setUserInput('');
        setZoomRate(2);
        inputRef.current?.focus();
    };

    return (
        <ComposableMap
            projection="geoEqualEarth"
            width={size[0]}
            height={size[1] - DrawerHeight < 0 ? 0 : size[1] - DrawerHeight}
            projectionConfig={{
                scale: mapScale,
                center: mapCenter,
            }}
        >
            <ZoomableGroup center={selectedCountry?.properties.coordinates} zoom={zoomRate}>
                <Geographies geography={geographyData}>
                    {({ geographies }) =>
                        geographies.map((geo) => (
                            <g key={geo.rsmKey}>
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    stroke="#FFF"
                                    strokeWidth={0.3}
                                    onClick={() => {
                                        handleCountryClick(geo);
                                    }}
                                    style={{
                                        default: { fill: getDefaultBgColor(geo.id) },
                                        hover: { fill: getHoverBgColor(geo.id) },
                                        pressed: { fill: getPressedBgColor(geo.id) },
                                    }}
                                    className="focus:outline-none"
                                />
                                <img
                                    src={getFlagImageUrl(geo.id)}
                                    alt={geo.id}
                                    width={256}
                                    height={192}
                                />
                            </g>
                        ))
                    }
                </Geographies>
                {selectedCountry && (
                    <Marker
                        coordinates={selectedCountry.properties.coordinates}
                        className="-translate-y-[15px]"
                    >
                        <FaFlag className=" text-yellow-400" />
                    </Marker>
                )}
            </ZoomableGroup>
        </ComposableMap>
    );
};

export const CurrentStatus: FunctionComponent<{
    answeredCountriesMap: Map<string, Geometry>;
    geometries: Geometry[];
}> = ({ answeredCountriesMap, geometries }) => {
    return (
        <p className="text-xl font-bold">
            現在の回答状況：{answeredCountriesMap.size}/{geometries.length}カ国
        </p>
    );
};

export const CheetButton: FunctionComponent<{
    selectedCountry: Geometry | null;
    inputRef: RefObject<HTMLInputElement | null>;
}> = ({ selectedCountry, inputRef }) => {
    const showAnswer = () => {
        if (selectedCountry === null) {
            alert('国を選択してください。');
            return;
        }
        if (confirm('カンニングしても良いですか？')) {
            alert(`答えは「${selectedCountry.properties.jpNames[0]}」です。`);
        }
        inputRef.current?.focus();
    };

    return (
        <button
            type="button"
            className=" bg-red-400 text-white test-xs md:text-base p-2 rounded w-36 whitespace-nowrap cursor-pointer disabled:bg-gray-300"
            onClick={showAnswer}
            disabled={selectedCountry === null}
        >
            カンニング
        </button>
    );
};

export const AnswerForm: FunctionComponent<{
    children: React.ReactNode;
    selectedCountry: Geometry | null;
    userInput: string;
    setUserInput: Dispatch<SetStateAction<string>>;
    inputRef: RefObject<HTMLInputElement | null>;
    answeredCountriesMap: Map<string, Geometry>;
    setAnsweredCountriesMap: Dispatch<SetStateAction<Map<string, Geometry>>>;
    localStorageKey: string;
    setSelectedCountry: Dispatch<SetStateAction<Geometry | null>>;
    setZoomRate: Dispatch<SetStateAction<number>>;
    defaultZoomRate: number;
    geometries: Geometry[];
}> = ({
    children,
    selectedCountry,
    userInput,
    setUserInput,
    inputRef,
    answeredCountriesMap,
    setAnsweredCountriesMap,
    localStorageKey,
    setSelectedCountry,
    setZoomRate,
    defaultZoomRate,
    geometries,
}) => {
    const { save, clearSaveData } = useLocalStorage(localStorageKey);

    const answer = () => {
        if (selectedCountry === null) {
            alert('国を選択してください。');
            return;
        }
        if (!checkAnswer(userInput, selectedCountry.properties.jpNames)) {
            alert('不正解です。');
            setUserInput('');
            inputRef.current?.focus();
            return;
        }

        const newMap = new Map(answeredCountriesMap);
        newMap.set(selectedCountry.id, selectedCountry);
        setAnsweredCountriesMap(newMap);
        setUserInput('');
        alert('正解です！');
        save(newMap);

        if (newMap.size === geometries.length) {
            alert('すべての国を答えました！\nあなたこそ世界の国マスターです！');
            clearSaveData(setAnsweredCountriesMap);
            return;
        }

        const nextCountry = pickRandomUnAnsweredCountry(geometries, newMap, selectedCountry);
        if (!nextCountry) return;

        setSelectedCountry(nextCountry);
        setZoomRate(defaultZoomRate);
        inputRef.current?.focus();

        return;
    };

    return (
        <form
            className="mt-4 flex items-center gap-x-2"
            onSubmit={(e) => {
                e.preventDefault();
                answer();
            }}
        >
            {children}
        </form>
    );
};
