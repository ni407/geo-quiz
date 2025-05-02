export const  isJapaneseMatch = (inputStr:string, answer:string) => {
    // ひらがなをカタカナに変換する関数
    const toKatakana = (str:string) => {
      return str.replace(/[\u3041-\u3096]/g, (c) => {
        const code = c.charCodeAt(0) + 0x60;
        return String.fromCharCode(code);
      });
    }
  
    // カタカナをひらがなに変換する関数 (今回は使用しないが参考として掲載)
    const toHiragana = (str:string) => {
        return str.replace(/[\u30A1-\u30F6]/g, (c) => {
          const code = c.charCodeAt(0) - 0x60;
          return String.fromCharCode(code);
        });
    }
  
    // 入力文字列と答えをカタカナに変換して比較
    const inputKatakana = toKatakana(inputStr);
    const answerKatakana = toKatakana(answer);
  
    return inputKatakana === answerKatakana;
  }