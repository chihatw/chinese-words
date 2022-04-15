import React from 'react';
import { Character, Word } from '../services/useWords';

const WordRow = ({
  word,
  index,
  isPractice,
}: {
  word: Omit<Word, 'id' | 'createdAt' | 'wordListId'>;
  index: number;
  isPractice?: boolean;
}) => {
  const { sentence, japanese, characters } = word;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: isPractice ? 'center' : 'flex-start',
      }}
    >
      <div
        style={{
          marginRight: isPractice ? 4 : 16,
          fontSize: 12,
          color: '#aaa',
          marginTop: isPractice ? 20 : 0,
        }}
      >
        {index + 1}
      </div>
      <div style={{ display: 'grid', rowGap: 4 }}>
        <div style={{ display: 'flex' }}>
          {characters.map((character, index) => (
            <CharacterUnit key={index} character={character} />
          ))}
        </div>
        {!isPractice && (
          <div style={{ display: 'grid', rowGap: 4 }}>
            <div style={{ fontSize: 12, color: '#52a2aa' }}>{sentence}</div>
            <div style={{ fontSize: 12, color: '#aaa' }}>{japanese}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordRow;

const CharacterUnit = ({ character }: { character: Character }) => {
  const { form, pinyin } = character;
  let mark = '　';
  const last = pinyin.slice(-1);
  switch (last) {
    case '1':
      mark = '‾';
      break;
    case '2':
      mark = 'ˊ';
      break;
    case '3':
      mark = 'ˇ';
      break;
    case '4':
      mark = 'ˋ';
      break;
    case '0':
      mark = '˙';
      break;
    default:
  }
  return (
    <div style={{ display: 'grid', marginRight: 4 }}>
      <div style={{ textAlign: 'center', fontSize: 8, color: '#aaa' }}>
        {pinyin}
      </div>
      <div
        style={{
          textAlign: 'center',
          fontSize: 32,
          marginBottom: -28,
          color: 'red',
        }}
      >
        {mark}
      </div>
      <div style={{ textAlign: 'center' }}>{form}</div>
    </div>
  );
};
