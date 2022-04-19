import React, { useEffect, useState } from 'react';
import { INITIAL_PINYIN, Word } from '../../../hooks/useWords';
import WordsByIndexRow from './WordsByIndexRow';

const WordListPageSidePane = ({
  word,
  startLine,
}: {
  word: Word;
  startLine: number;
}) => {
  const [indexForm, setIndexForm] = useState('');
  const [indexPinyin, setIndexPinyin] = useState('');
  const [indexVowelTone, setIndexVowelTone] = useState('');
  // 入力位置からインデックス作成
  useEffect(() => {
    let indexForm = '';
    let indexPinyin = '';
    let indexVowelTone = '';
    switch (startLine) {
      case 0:
        const lastForm = getLastForm(word);
        !!lastForm && (indexForm = lastForm);
        break;
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
    setIndexForm(indexForm);
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

const getLastForm = (word: Word) => {
  const forms = word.characters
    .map((character) => character.form)
    .filter((i) => i);
  return forms.slice(-1)[0] || '';
};

const getLastPinyin = (word: Word) => {
  const pinyins = word.characters
    .map((character) => character.pinyin)
    .filter(({ consonant, vowel, tone }) => consonant + vowel + tone);
  return pinyins.slice(-1)[0] || INITIAL_PINYIN;
};
