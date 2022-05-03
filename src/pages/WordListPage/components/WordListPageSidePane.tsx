import React, { useEffect, useState } from 'react';
import { INITIAL_PINYIN, Word } from '../../../hooks/useWords';
import WordsByIndexRow from './WordsByIndexRow';

const WordListPageSidePane = ({
  word,
  startLine,
  indexForm,
}: {
  word: Word;
  startLine: number;
  indexForm: string;
}) => {
  const [indexPinyin, setIndexPinyin] = useState('');
  const [indexVowelTone, setIndexVowelTone] = useState('');
  // 入力位置からインデックス作成
  useEffect(() => {
    let indexPinyin = '';
    let indexVowelTone = '';
    switch (startLine) {
      case 1:
        const { consonant, vowel, tone } = getLastPinyin(word);
        const vowelTone = vowel + tone;
        if (!!vowelTone) {
          indexVowelTone = vowelTone;
          if (!!consonant) {
            indexPinyin = consonant + vowelTone;
          }
        }
        break;
      default:
    }

    setIndexPinyin(indexPinyin);
    setIndexVowelTone(indexVowelTone);
  }, [word, startLine]);

  const [gotWordsByPinyin, setGotWordsByPinyin] = useState<Word[]>([]);

  return (
    <div style={{ padding: '240px 0 0 16px' }}>
      <div style={{ display: 'grid', rowGap: 16 }}>
        {!!indexForm && (
          <WordsByIndexRow
            // 改行のため
            type='form'
            label='字'
            index={indexForm}
          />
        )}
        {!!indexPinyin && (
          <WordsByIndexRow
            label='拼音'
            index={indexPinyin}
            type='pinyin'
            setGotWordsByPinyin={setGotWordsByPinyin}
          />
        )}
        {!!indexVowelTone && (
          <WordsByIndexRow
            label='母音'
            type='pinyin'
            index={indexVowelTone}
            gotWordsByPinyin={gotWordsByPinyin}
          />
        )}
      </div>
    </div>
  );
};

export default WordListPageSidePane;

const getLastPinyin = (word: Word) => {
  const pinyins = word.characters
    .map((character) => character.pinyin)
    .filter(({ consonant, vowel, tone }) => consonant + vowel + tone);
  return pinyins.slice(-1)[0] || INITIAL_PINYIN;
};
