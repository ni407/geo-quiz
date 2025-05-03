import { useLayoutEffect, useState } from 'react';

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
