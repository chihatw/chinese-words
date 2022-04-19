import { useTheme } from '@mui/system';
import React, { useEffect, useMemo, useState } from 'react';
import CharacterUnit from '../../../components/CharacterUnit';
import { useHandleIndexes } from '../../../hooks/useIndexes';
import { useHandleWords, Word } from '../../../hooks/useWords';

const WordsByIndexRow = ({
  type,
  label,
  index,
  gotWordsByPinyin,
  setGotWordsByPinyin,
}: {
  type: 'form' | 'pinyin';
  index: string;
  label: string;
  isPinyin?: boolean;
  isVowelTone?: boolean;
  gotWordsByPinyin?: Word[];
  setGotWordsByPinyin?: (value: Word[]) => void;
}) => {
  const theme = useTheme();
  const { getWord } = useHandleWords();
  const { getWordIdsByIndexes } = useHandleIndexes();

  const [words, setWords] = useState<Word[]>([]);
  const [wordIds, setWordIds] = useState<string[]>([]);

  useEffect(() => {
    if (!!index) {
      const fetchData = async () => {
        const wordIds = await getWordIdsByIndexes({
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
    if (!!wordIds.length && !!index) {
      const fetchData = async () => {
        const words = await Promise.all(
          wordIds.map(async (wordId) => await getWord(wordId))
        );
        if (!!index) {
          setWords(words);
        } else {
          setWords([]);
        }
      };
      fetchData();
    } else {
      setWords([]);
    }
  }, [index, wordIds]);

  const _words = useMemo(() => {
    if (!gotWordsByPinyin) {
      return words;
    }
    return words.filter(
      (word) => !gotWordsByPinyin.map((word) => word.id).includes(word.id)
    );
  }, [words, gotWordsByPinyin]);

  useEffect(() => {
    if (!setGotWordsByPinyin) return;
    setGotWordsByPinyin(words);
  }, [words, setGotWordsByPinyin]);

  return (
    <div style={{ display: 'grid', rowGap: 16 }}>
      <div
        style={{
          ...(theme.typography as any).notoSerifTC900,
        }}
      >{`${label}: ${index}`}</div>
      {_words.map((word, index) => (
        <div key={index} style={{ display: 'flex' }}>
          {word.characters.map((character, index) => (
            <CharacterUnit key={index} character={character} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default WordsByIndexRow;
