import { AnsweredCountriesMap } from '@/app/quiz/map/exam/page';
import { getFlagImageUrl } from '@/lib/flag';
import { GeographyData, Geometry } from '@/lib/geography';
import { Dispatch, FunctionComponent, RefObject, SetStateAction, useMemo } from 'react';
import { FaFlag } from 'react-icons/fa';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';

export const ColorPalette = {
    ocean: '#F0F4F8',
    default: '#C7C7C7',
    selected: '#E42',
    answered: '#A0D3FF',
    skipped: '#9E9E9E',
    border: '#616161',
    flag: '#FACC15',
};

export const GeographyMap: FunctionComponent<{
    selectedCountry: Geometry | null;
    geographyData: GeographyData;
    answeredCountriesMap: AnsweredCountriesMap;
    setAnsweredCountriesMap: Dispatch<SetStateAction<AnsweredCountriesMap>>;
    zoomRate: number;
    inputRef: RefObject<HTMLInputElement | null> | null;
    setSelectedCountry: Dispatch<SetStateAction<Geometry | null>>;
    setUserInput: Dispatch<SetStateAction<string>>;
    mapScale: number;
    mapCenter?: [number, number];
    width?: number;
    height?: number;
}> = ({
    selectedCountry,
    geographyData,
    answeredCountriesMap,
    setAnsweredCountriesMap,
    zoomRate,
    inputRef,
    setSelectedCountry,
    setUserInput,
    mapScale,
    mapCenter,
    width,
    height,
}) => {
    const getDefaultBgColor = useMemo(
        () => (countryId: string) => {
            const country = answeredCountriesMap.get(countryId);
            if (country) {
                if (country.skipped) {
                    return ColorPalette.skipped;
                }
                return ColorPalette.answered;
            }

            if (countryId === selectedCountry?.id) {
                return ColorPalette.selected;
            }
            return ColorPalette.default;
        },
        [selectedCountry, answeredCountriesMap],
    );

    const getHoverBgColor = useMemo(
        () => (countryId: string) => {
            const country = answeredCountriesMap.get(countryId);
            if (country) {
                if (country.skipped) {
                    return ColorPalette.skipped;
                }
                return ColorPalette.answered;
            }
            return ColorPalette.selected;
        },
        [answeredCountriesMap],
    );

    const handleCountryClick = (geo: Geometry) => {
        const answeredCountry = answeredCountriesMap.get(geo.id);
        if (answeredCountry) {
            if (answeredCountry.skipped) {
                if (confirm('この国はパスされています。再度回答しますか？')) {
                    const newAnsweredCountriesMap = new Map(answeredCountriesMap);
                    newAnsweredCountriesMap.delete(geo.id);
                    setAnsweredCountriesMap(newAnsweredCountriesMap);
                    setSelectedCountry(geo);
                }
            } else {
                alert(geo.properties.jpNames[0]);
            }
            inputRef?.current?.focus();
            return;
        }
        setSelectedCountry(geo);
        setUserInput('');

        inputRef?.current?.focus();
    };

    return (
        <ComposableMap
            projection="geoEqualEarth"
            width={width}
            height={height}
            projectionConfig={{
                scale: mapScale,
                center: mapCenter,
            }}
            style={{ backgroundColor: ColorPalette.ocean }}
        >
            <ZoomableGroup center={selectedCountry?.properties.coordinates} zoom={zoomRate}>
                <Geographies geography={geographyData}>
                    {({ geographies }) =>
                        geographies.map((geo) => (
                            <g key={geo.rsmKey}>
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    stroke={ColorPalette.border}
                                    strokeWidth={0.3}
                                    onClick={() => {
                                        handleCountryClick(geo);
                                    }}
                                    style={{
                                        default: { fill: getDefaultBgColor(geo.id) },
                                        hover: { fill: getHoverBgColor(geo.id) },
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
                        <FaFlag style={{ color: ColorPalette.flag }} />
                    </Marker>
                )}
            </ZoomableGroup>
        </ComposableMap>
    );
};
