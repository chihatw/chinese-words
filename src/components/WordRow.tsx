import React from 'react';
import { Word } from '../services/useWords';
import CharacterUnit from './CharacterUnit';

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
          marginRight: 16,
          fontSize: 12,
          color: '#aaa',
          marginTop: isPractice ? 16 : 0,
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
