import { Grid } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppContext } from '../../services/context';
import { Index, word2Index, useHandleIndexes } from '../../hooks/useIndexes';
import {
  Word,
  useHandleWords,
  INITIAL_WORD,
  Character,
  pinyin2String,
  INITIAL_PINYIN,
} from '../../hooks/useWords';
import WordListPageMainComponent from './components/WordListPageMainComponent';
import WordListPageSideComponent from './components/WordListPageSideComponent';

const WordListPage = () => {
  const navigate = useNavigate();
  const { words: superWords, wordList } = useContext(AppContext);
  const { addWord, batchAddWords, batchDeleteWords, getWord } =
    useHandleWords();
  const { setIndex, batchDeleteIndexes, batchSetIndexes, getWordIdsByIndexes } =
    useHandleIndexes();

  const [word, setWord] = useState(INITIAL_WORD);
  const [words, setWords] = useState<Word[]>([]);
  const [gotWords, setGotWords] = useState<Word[]>([]);
  const [indexForm, setIndexForm] = useState('');
  const [indexPinyin, setIndexPinyin] = useState('');

  useEffect(() => {
    const lastCharacter: Character | null = word.characters.slice(-1)[0];
    const form = lastCharacter?.form || '';
    const pinyin = lastCharacter?.pinyin || INITIAL_PINYIN;
    const pinyinStr = pinyin2String(pinyin);
    setIndexForm(form);
    setIndexPinyin(pinyinStr);

    let wordIds: string[] = [];

    if (!!form) {
      const fetchData = async () => {
        const wordIdsByForm = await getWordIdsByIndexes({
          max: 10,
          type: 'form',
          indexes: [form],
        });
        wordIds = wordIds.concat(wordIdsByForm);

        if (!!pinyinStr) {
          const wordIdsByPinyin = await getWordIdsByIndexes({
            max: 10,
            type: 'pinyin',
            indexes: [pinyinStr],
          });
          wordIds = wordIds.concat(wordIdsByPinyin);
        }

        wordIds = wordIds.filter((wordId, index) => {
          return wordIds.indexOf(wordId) === index;
        });

        if (wordIds.length) {
          const words: Word[] = await Promise.all(
            wordIds.map(async (wordId) => {
              return await getWord(wordId);
            })
          );
          setGotWords(words);
        } else {
          setGotWords([]);
        }
      };
      fetchData();
    } else {
      setGotWords([]);
    }
  }, [word]);

  const handleSubmit = async () => {
    const newWord: Omit<Word, 'id'> = {
      ...word,
      createdAt: Date.now(),
      wordListId: wordList.id,
    };
    const result = await addWord(newWord);
    if (!!result) {
      const _word: Word = {
        ...newWord,
        id: result.id,
      };
      const index = word2Index({ word: _word });
      setIndex(index);
    }
  };

  const handleBatchSubmit = async () => {
    // 既存のwords を削除
    const ids = superWords.map((word) => word.id).filter((i) => i);
    if (ids.length) {
      batchDeleteWords(ids);
      batchDeleteIndexes(ids);
    }
    // 新規に追加
    const newWords: Omit<Word, 'id'>[] = [];
    const createdAt = Date.now();
    for (const word of words) {
      const newWord: Omit<Word, 'id'> = {
        ...word,
        createdAt,
        wordListId: wordList.id,
      };
      newWords.push(newWord);
    }
    const wordIds = await batchAddWords(newWords);
    const _words: Word[] = words.map((word, index) => ({
      ...word,
      createdAt: 0,
      wordListId: '',
      id: wordIds[index],
    }));
    const newIndexes: Index[] = [];
    for (const word of _words) {
      const index = word2Index({ word });
      newIndexes.push(index);
    }
    batchSetIndexes(newIndexes);
  };

  return (
    <Grid container>
      <Grid item sm={12} md={8}>
        <WordListPageMainComponent
          word={word}
          words={words}
          wordList={wordList}
          setWord={setWord}
          setWords={setWords}
          navigate={navigate}
          handleSubmit={handleSubmit}
          handleBatchSubmit={handleBatchSubmit}
        />
      </Grid>
      <Grid item sm={0} md={4}>
        <WordListPageSideComponent
          gotWords={gotWords}
          indexForm={indexForm}
          indexPinyin={indexPinyin}
        />
      </Grid>
    </Grid>
  );
};

export default WordListPage;
