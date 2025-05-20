import { getFlagImageUrl } from '@/lib/flag';
import { GeographyData, Geometry } from '@/lib/geography';
import { Dispatch, FunctionComponent, RefObject, SetStateAction, useMemo } from 'react';
import { FaFlag } from 'react-icons/fa';
import {} from 'react-icons/md';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';

export const GeographyMap: FunctionComponent<{
    selectedCountry: Geometry | null;
    geographyData: GeographyData;
    answeredCountriesMap: Map<string, Geometry>;
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
