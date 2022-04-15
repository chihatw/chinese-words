import React from 'react';
import { Character, Word } from '../services/useWords';

const WordRow = ({
  word,
  index,
}: {
  word: Omit<Word, 'id' | 'createdAt' | 'wordListId'>;
  index: number;
}) => {
  const { sentence, japanese, characters } = word;
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ marginRight: 16 }}>{index + 1}</div>
      <div style={{ display: 'grid', rowGap: 4 }}>
        <div style={{ display: 'flex' }}>
          {characters.map((character, index) => (
            <CharacterUnit key={index} character={character} />
          ))}
        </div>
        <div style={{ fontSize: 12, color: '#52a2aa' }}>{sentence}</div>
        <div style={{ fontSize: 12, color: '#aaa' }}>{japanese}</div>
      </div>
    </div>
  );
};

export default WordRow;

const CharacterUnit = ({ character }: { character: Character }) => {
  const { form, pinyin } = character;
  return (
    <div style={{ display: 'grid', marginRight: 4 }}>
      <div style={{ textAlign: 'center', fontSize: 8 }}>{pinyin}</div>
      <div style={{ textAlign: 'center' }}>{form}</div>
    </div>
  );
};
