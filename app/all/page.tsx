"use client"
import { geographyData } from "@/lib/geography";
import { translateCountryName } from "@/lib/ja_name";
import { isJapaneseMatch } from "@/lib/util";
import { useEffect, useMemo, useRef, useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";

export default function Page() {
    const [selectedCountryName, setSelectedCountryName] = useState<string|null>(null);
    const [userInput, setUserInput] = useState<string>("");

    const handleCountryClick = (geo: any) => {
        if(answeredCountriesNameSet.has(geo.properties.name)) {
            return;
        }
        setSelectedCountryName(geo.properties.name);
        setUserInput("");
        ref.current?.focus();
    };

    const DrawerHeight= 140;

    const [answeredCountriesNameSet, setAnsweredCountriesNameSet] = useState<Set<string>>(new Set());
    const getDefaultBgColor = useMemo(()=>(countryName: string) => {
        if (answeredCountriesNameSet.has(countryName)) {
            return "#A0D3FF";
        }

        if(countryName === selectedCountryName) {
            return "#E42";
        }
        return "#EAEAEA";
    },[selectedCountryName,answeredCountriesNameSet]);

    const getHoverBgColor = useMemo(()=>(countryName: string) => {
        if (answeredCountriesNameSet.has(countryName)) {
            return "#A0D3FF";
        }
        return "#F53";
    },[answeredCountriesNameSet]);

    const getPressedBgColor = useMemo(()=>(countryName: string) => {
        if (answeredCountriesNameSet.has(countryName)) {
            return "#A0D3FF";
        }
        return "#E42";
    },[answeredCountriesNameSet]);

    

    const answer = () => {
        if (selectedCountryName === null) {
            alert("国を選択してください。");
            return;
        }
        if (checkAnswer(userInput, selectedCountryName)) {
            const newSet = new Set([...answeredCountriesNameSet, selectedCountryName]);
            setAnsweredCountriesNameSet(newSet);
            setUserInput("");
            alert("正解です！");
            save(newSet);
            selectRandomUnansweredCountry();
        }
        else {
            alert("不正解です。");
            setUserInput("");
        }
    };
    const ref = useRef<HTMLInputElement>(null);

    const checkAnswer = (inputStr: string, answerCountryName: string) => {
        const translatedAnswer = translateCountryName(answerCountryName);
        const isMatch = isJapaneseMatch(inputStr, translatedAnswer);
        return isMatch;
    };

    const selectRandomUnansweredCountry = () => {
        const unansweredCountries = geographyData.objects.world.geometries.filter((geo) => !answeredCountriesNameSet.has(geo.properties.name));
        if (unansweredCountries.length === 0) {
            alert("すべての国を答えました！");
            return;
        }
        const randomIndex = Math.floor(Math.random() * unansweredCountries.length);
        const randomCountryName = unansweredCountries[randomIndex].properties.name;
        setSelectedCountryName(randomCountryName);
    };

    const save = (countriesNameSet:Set<string>) =>{
        const answeredCountriesNameSetString = JSON.stringify(Array.from(countriesNameSet));
        localStorage.setItem("answeredCountriesNameSet", answeredCountriesNameSetString);
    }
    const load = () => {
        const answeredCountriesNameSetString = localStorage.getItem("answeredCountriesNameSet");
        if (answeredCountriesNameSetString) {
            const answeredCountriesNameSetArray = JSON.parse(answeredCountriesNameSetString);
            const answeredCountriesNameSet = new Set(answeredCountriesNameSetArray);
            setAnsweredCountriesNameSet(answeredCountriesNameSet as Set<string>);
        }
    }
    const clearSaveData = () => {
        localStorage.removeItem("answeredCountriesNameSet");
        setAnsweredCountriesNameSet(new Set());
    }

    useEffect(()=>{
        if(localStorage.getItem("answeredCountriesNameSet")) {
            if(confirm("前回の途中から再開しますか？")) {
                load();
                return;
            }
            clearSaveData();
        }
    },[])

    const showAnswer = () => {
        if (selectedCountryName === null) {
            alert("国を選択してください。");
            return;
        }
        const translatedAnswer = translateCountryName(selectedCountryName);
        alert(`答えは「${translatedAnswer}」です。`);
    }

    const isFinished = useMemo(() => {
        return answeredCountriesNameSet.size === geographyData.objects.world.geometries.length;
    }, [answeredCountriesNameSet]);

    useEffect(() => {
        if (isFinished) {
            alert("すべての国を答えました！\nあなたこそ世界の国マスターです！");
            clearSaveData();
        }
    }, [isFinished]);

    return (
        <div className={`overflow-hidden w-screen h-[calc(100vh-${DrawerHeight}px)]`}>
            <ComposableMap>
                <ZoomableGroup center={[0, 0]} zoom={1}>
                    <Geographies geography={geographyData} className="relative">
                        {({ geographies }) =>
                            geographies.map((geo) => (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    stroke="#FFF"
                                    strokeWidth={0.3}
                                    onClick={(event) => {
                                        handleCountryClick(geo);
                                    }}
                                    style={{
                                        default: { fill: getDefaultBgColor(geo.properties.name)},
                                        hover: { fill: getHoverBgColor(geo.properties.name) },
                                        pressed: { fill: getPressedBgColor(geo.properties.name) },
                                    }}
                                    className="focus:outline-none"
                                />
                            ))                                
                            }
                    </Geographies>
                </ZoomableGroup>
            </ComposableMap>
            <div className="fixed bottom-0 left-0 w-full rounded bg-amber-100 p-4" style={{height:DrawerHeight}}>
                <p className="text-xl font-bold">現在の回答状況：{answeredCountriesNameSet.size}/{geographyData.objects.world.geometries.length}カ国</p>
                <form className="mt-4 flex items-center gap-x-2" onSubmit={(e)=>{
                    e.preventDefault();
                    answer();
                }}>
                    <input
                        type="text"
                        placeholder="国名を入力"
                        className="border p-2 rounded w-full"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        ref={ref}
                    />
                    <button
                        type="submit"
                        className=" bg-blue-500 text-white p-2 rounded w-36 cursor-pointer disabled:bg-gray-300"        
                        disabled={userInput === "" || selectedCountryName === null}                
                    >
                        回答
                    </button>
                    <button
                        type="button"
                        className=" bg-red-400 text-white p-2 rounded w-36 cursor-pointer disabled:bg-gray-300"
                        onClick={showAnswer}
                        disabled={selectedCountryName === null}
                    >
                        カンニング
                    </button>
                </form>
            </div>
            
        </div>
    );
}