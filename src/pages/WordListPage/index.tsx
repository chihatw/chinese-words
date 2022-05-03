import { Grid } from '@mui/material';
import React, { useState } from 'react';

import { Word, INITIAL_WORD } from '../../hooks/useWords';
import WordListPageMainComponent from './components/WordListPageMainComponent';
import WordListPageSidePane from './components/WordListPageSidePane';

const WordListPage = () => {
  const [word, setWord] = useState(INITIAL_WORD);
  const [words, setWords] = useState<Word[]>([]);
  const [startLine, setStartLine] = useState(0);
  const [indexForm, setIndexForm] = useState('');

  return (
    <Grid container>
      <Grid item sm={12} md={8}>
        <WordListPageMainComponent
          word={word}
          words={words}
          setWord={setWord}
          setWords={setWords}
          setStartLine={setStartLine}
          setIndexForm={setIndexForm}
        />
      </Grid>
      <Grid item sm={0} md={4}>
        <WordListPageSidePane
          word={word}
          startLine={startLine}
          indexForm={indexForm}
        />
      </Grid>
    </Grid>
  );
};

export default WordListPage;
