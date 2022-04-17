import { useTheme } from '@mui/system';
import React from 'react';
import CharacterUnit from '../../../components/CharacterUnit';
import { Word } from '../../../hooks/useWords';

const WordListPageSideComponent = ({
  gotWords,
  indexForm,
  indexPinyin,
}: {
  indexForm: string;
  indexPinyin: string;
  gotWords: Word[];
}) => {
  const theme = useTheme();
  return (
    <div style={{ padding: '240px 0 0 16px' }}>
      <div
        style={{
          ...(theme.typography as any).notoSerifTC900,
          display: 'flex',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <div style={{ marginRight: '1em' }}>{indexForm}</div>
        <div>{indexPinyin}</div>
      </div>
      {gotWords.map((word, index) => (
        <div key={index} style={{ display: 'flex' }}>
          {word.characters.map((character, index) => (
            <CharacterUnit key={index} character={character} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default WordListPageSideComponent;
