import { getFlagImageUrl } from '@/lib/flag';
import { GeographyData, Geometry } from '@/lib/geography';
import { checkAnswer, pickRandomUnAnsweredCountry, useLocalStorage } from '@/lib/util';
import {
    Dispatch,
    FunctionComponent,
    RefObject,
    SetStateAction,
    useContext,
    useState,
} from 'react';
import { MdOutlineTipsAndUpdates, MdShuffle } from 'react-icons/md';
import { PiEyesFill } from 'react-icons/pi';
import { Modal, ToastType } from './common';
import { ToastContext } from './layout';

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
            className=" bg-red-400 text-white test-xs lg:text-sm font-semibold p-2 rounded h-10 w-36 whitespace-nowrap cursor-pointer disabled:bg-gray-300 flex items-center justify-center gap-x-1"
            onClick={showAnswer}
            disabled={selectedCountry === null}
        >
            <PiEyesFill className="size-6" />
            <span className="hidden lg:block">カンニング</span>
        </button>
    );
};

export const ShuffleButton: FunctionComponent<{
    onClick: () => void;
}> = ({ onClick }) => {
    const shuffle = () => {
        if (confirm('シャッフルしても良いですか？')) {
            onClick();
        }
    };

    return (
        <button
            type="button"
            className=" bg-green-500 text-white test-xs lg:text-sm font-semibold p-2 rounded h-10 w-36 whitespace-nowrap cursor-pointer disabled:bg-gray-300 flex items-center justify-center gap-x-1"
            onClick={shuffle}
        >
            <MdShuffle className="size-6" />
            <span className="hidden lg:block">シャッフル</span>
        </button>
    );
};

export const FinishButton: FunctionComponent<{
    onClick: () => void;
}> = ({ onClick }) => {
    const finishAnswering = () => {
        if (confirm('回答を終了しても良いですか？')) {
            onClick();
        }
    };

    return (
        <button
            type="button"
            onClick={finishAnswering}
            className=" bg-blue-500 text-white test-xs md:text-sm p-2 rounded h-10 w-36 whitespace-nowrap cursor-pointer disabled:bg-gray-300"
        >
            回答終了
        </button>
    );
};

export const FlagHintButton: FunctionComponent<{
    selectedCountry: Geometry | null;
}> = ({ selectedCountry }) => {
    if (!selectedCountry) return null;
    const [showHint, setShowHint] = useState(false);
    const onClick = () => {
        if (confirm('ヒントを表示しても良いですか？')) {
            setShowHint(true);
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={onClick}
                className="bg-amber-500 text-white test-xs lg:text-sm font-semibold p-2 rounded h-10 w-36 whitespace-nowrap cursor-pointer disabled:bg-gray-300 flex items-center justify-center gap-x-1"
            >
                <MdOutlineTipsAndUpdates className="size-6" />
                <span className="hidden lg:block">ヒント</span>
            </button>
            <Modal
                visible={showHint}
                setVisible={setShowHint}
                onClose={() => setShowHint(false)}
                title="ヒント"
                footer={null}
                closeWhenClickOutside
            >
                <div className="flex flex-col items-center justify-center py-8">
                    <img
                        src={getFlagImageUrl(selectedCountry.id)}
                        alt={selectedCountry.id}
                        width={256}
                        height={192}
                    />
                </div>
            </Modal>
        </>
    );
};

export const RegionHintButton: FunctionComponent<{
    selectedCountry: Geometry | null;
}> = ({ selectedCountry }) => {
    if (!selectedCountry) return null;
    const [showHint, setShowHint] = useState(false);
    const onClick = () => {
        if (confirm('ヒントを表示しても良いですか？')) {
            setShowHint(true);
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={onClick}
                className="bg-amber-500 text-white test-xs lg:text-sm font-semibold p-2 rounded h-10 w-36 whitespace-nowrap cursor-pointer disabled:bg-gray-300 flex items-center justify-center gap-x-1"
            >
                <MdOutlineTipsAndUpdates className="size-6" />
                <span className="hidden lg:block">ヒント</span>
            </button>
            <Modal
                visible={showHint}
                setVisible={setShowHint}
                onClose={() => setShowHint(false)}
                title="ヒント"
                footer={null}
                closeWhenClickOutside
            >
                <div className="flex flex-col items-center justify-center py-8">
                    <p className="text-xl font-bold">{selectedCountry.properties.region}の国です</p>
                </div>
            </Modal>
        </>
    );
};

export const InitialHintButton: FunctionComponent<{
    selectedCountry: Geometry | null;
}> = ({ selectedCountry }) => {
    if (!selectedCountry) return null;
    const [showHint, setShowHint] = useState(false);
    const onClick = () => {
        if (confirm('ヒントを表示しても良いですか？')) {
            setShowHint(true);
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={onClick}
                className="bg-amber-500 text-white test-xs lg:text-sm font-semibold p-2 rounded h-10 w-36 whitespace-nowrap cursor-pointer disabled:bg-gray-300 flex items-center justify-center gap-x-1"
            >
                <MdOutlineTipsAndUpdates className="size-6" />
                <span className="hidden lg:block">ヒント</span>
            </button>
            <Modal
                visible={showHint}
                setVisible={setShowHint}
                onClose={() => setShowHint(false)}
                title="ヒント"
                footer={null}
                closeWhenClickOutside
            >
                <div className="flex flex-col items-center justify-center py-8">
                    <p className="text-xl font-bold">
                        最初の文字は "
                        <span className="mx-1 tracking-widest">
                            {selectedCountry.properties.jpNames[0].substring(0, 1)}(
                            {selectedCountry.properties.name.substring(0, 1)})
                        </span>
                        "です
                    </p>
                </div>
            </Modal>
        </>
    );
};

export const AnswerInput: FunctionComponent<{
    userInput: string;
    setUserInput: Dispatch<SetStateAction<string>>;
    inputRef: RefObject<HTMLInputElement | null>;
}> = ({ userInput, setUserInput, inputRef }) => {
    return (
        <input
            type="text"
            placeholder="国名を入力（Enterで回答）"
            className="border p-2 rounded w-full focus:outline-none focus:ring focus:ring-blue-500"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            ref={inputRef}
        />
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
    setZoomRate?: Dispatch<SetStateAction<number>>;
    defaultZoomRate?: number;
    geometries: Geometry[];
    prioritizeSameRegion?: boolean;
    setFinishModalVisible?: Dispatch<SetStateAction<boolean>>;
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
    prioritizeSameRegion = false,
    setFinishModalVisible,
}) => {
    const { save, clearSaveData } = useLocalStorage(localStorageKey);
    const { setToast } = useContext(ToastContext);

    const answer = () => {
        if (selectedCountry === null) {
            alert('国を選択してください。');
            return;
        }
        if (!checkAnswer(userInput, selectedCountry.properties.jpNames)) {
            setToast({ type: ToastType.Failure, message: '不正解です' });
            setUserInput('');
            inputRef.current?.focus();
            return;
        }

        const newMap = new Map(answeredCountriesMap);
        newMap.set(selectedCountry.id, selectedCountry);
        setAnsweredCountriesMap(newMap);
        setUserInput('');
        setToast({
            type: ToastType.Success,
            message: (
                <div className="flex items-center gap-x-1">
                    正解です！
                    <br />
                    <img
                        src={getFlagImageUrl(selectedCountry.id)}
                        alt={selectedCountry.id}
                        width={24}
                        height={16}
                    />
                </div>
            ),
        });
        save(newMap);

        if (newMap.size === geometries.length) {
            if (setFinishModalVisible) {
                setFinishModalVisible(true);
            } else {
                setToast({
                    type: ToastType.Success,
                    message: 'すべての国に回答しました！',
                });
                clearSaveData();
                setAnsweredCountriesMap(new Map());
                setSelectedCountry(null);
            }
            return;
        }

        const nextCountry = pickRandomUnAnsweredCountry(
            geometries,
            newMap,
            selectedCountry,
            prioritizeSameRegion,
        );
        if (!nextCountry) return;

        setSelectedCountry(nextCountry);
        if (setZoomRate && defaultZoomRate) {
            setZoomRate(defaultZoomRate);
        }
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

export const FinishModal: FunctionComponent<{
    finishModalVisible: boolean;
    setFinishModalVisible: Dispatch<SetStateAction<boolean>>;
    geographyData: GeographyData;
    answeredCountriesMap: Map<string, Geometry>;
    onClose: () => void;
    copyToClipboard: () => void;
}> = ({
    finishModalVisible,
    setFinishModalVisible,
    geographyData,
    answeredCountriesMap,
    onClose,
    copyToClipboard,
}) => {
    return (
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
    );
};
