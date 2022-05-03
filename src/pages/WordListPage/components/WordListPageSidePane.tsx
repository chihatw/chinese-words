import React from 'react';
import WordsByIndexRow from './WordsByIndexRow';

const WordListPageSidePane = ({
  indexForm,
  indexPinyin,
  indexVowelTone,
}: {
  indexForm: string;
  indexPinyin: string;
  indexVowelTone: string;
}) => {
  return (
    <div style={{ padding: '240px 0 0 16px' }}>
      <div style={{ display: 'grid', rowGap: 16 }}>
        {!!indexForm && (
          <WordsByIndexRow type='form' label='字' index={indexForm} />
        )}
        {!!indexPinyin && (
          <WordsByIndexRow label='拼音' index={indexPinyin} type='pinyin' />
        )}
        {!!indexVowelTone && (
          <WordsByIndexRow label='母音' type='pinyin' index={indexVowelTone} />
        )}
      </div>
    </div>
  );
};

export default WordListPageSidePane;
