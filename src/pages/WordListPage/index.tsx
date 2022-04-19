import { Grid } from '@mui/material';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppContext } from '../../services/context';
import { Index, word2Index, useHandleIndexes } from '../../hooks/useIndexes';
import { Word, useHandleWords, INITIAL_WORD } from '../../hooks/useWords';
import WordListPageMainComponent from './components/WordListPageMainComponent';
import WordListPageSidePane from './components/WordListPageSidePane';

const WordListPage = () => {
  const navigate = useNavigate();
  const { words: superWords, wordList } = useContext(AppContext);
  const { addWord, batchAddWords, batchDeleteWords } = useHandleWords();
  const { setIndex, batchDeleteIndexes, batchSetIndexes } = useHandleIndexes();

  const [word, setWord] = useState(INITIAL_WORD);
  const [words, setWords] = useState<Word[]>([]);
  const [startLine, setStartLine] = useState(0);

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
          setStartLine={setStartLine}
        />
      </Grid>
      <Grid item sm={0} md={4}>
        <WordListPageSidePane word={word} startLine={startLine} />
      </Grid>
    </Grid>
  );
};

export default WordListPage;
