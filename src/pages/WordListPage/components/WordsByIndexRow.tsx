import { useTheme } from '@mui/system';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import CharacterUnit from '../../../components/CharacterUnit';
import { Word } from '../../../hooks/useWords';
import { AppContext } from '../../../services/context';

const WordsByIndexRow = ({
  type,
  label,
  index,
}: {
  type: 'form' | 'pinyin';
  index: string;
  label: string;
}) => {
  const theme = useTheme();
  const { getWordIdsByIndexes_m, getWord_m } = useContext(AppContext);

  const [words, setWords] = useState<Word[]>([]);

  const [wordIds, setWordIds] = useState<string[]>([]);

  useEffect(() => {
    if (!!index) {
      const fetchData = async () => {
        const wordIds = await getWordIdsByIndexes_m({
          max: 10,
          type,
          indexes: [index],
        });
        setWordIds(wordIds);
      };
      fetchData();
    } else {
      setWordIds([]);
    }
  }, [index]);

  useEffect(() => {
    const fetchData = async () => {
      const words = await Promise.all(
        wordIds.map(async (wordId) => await getWord_m(wordId))
      );
      setWords(words);
    };
    fetchData();
  }, [index, wordIds]);

  return (
    <div style={{ display: 'grid', rowGap: 16 }}>
      <div
        style={{
          ...(theme.typography as any).notoSerifTC900,
        }}
      >{`${label}: ${index}`}</div>
      {words.map((word, index) => (
        <div key={index} style={{ display: 'flex' }}>
          {word.characters.map(({ form, pinyin }, index) => (
            <CharacterUnit key={index} form={form} pinyin={pinyin} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default WordsByIndexRow;
