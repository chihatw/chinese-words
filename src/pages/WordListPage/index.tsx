import { Grid } from '@mui/material';
import React, { useState } from 'react';

import { Word, INITIAL_WORD } from '../../hooks/useWords';
import WordListPageMainComponent from './components/WordListPageMainComponent';
import WordListPageSidePane from './components/WordListPageSidePane';

const WordListPage = () => {
  const [indexForm, setIndexForm] = useState('');
  const [indexPinyin, setIndexPinyin] = useState('');
  const [indexVowelTone, setIndexVowelTone] = useState('');

  return (
    <Grid container>
      <Grid item sm={12} md={8}>
        <WordListPageMainComponent
          setIndexForm={setIndexForm}
          setIndexPinyin={setIndexPinyin}
          setIndexVowelTone={setIndexVowelTone}
        />
      </Grid>
      <Grid item sm={0} md={4}>
        <WordListPageSidePane
          indexForm={indexForm}
          indexPinyin={indexPinyin}
          indexVowelTone={indexVowelTone}
        />
      </Grid>
    </Grid>
  );
};

export default WordListPage;
