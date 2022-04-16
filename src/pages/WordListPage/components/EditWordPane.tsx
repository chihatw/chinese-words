import { Button, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import WordRow from '../../../components/WordRow';
import { useHandleIndexes, word2Index } from '../../../services/useIndexes';
import {
  INITIAL_WORD,
  string2Word,
  useHandleWords,
  Word,
  word2String,
} from '../../../services/useWords';

const EditWordPane = ({
  word: superWord,
  callback,
}: {
  word: Word;
  callback: () => void;
}) => {
  const [input, setInput] = useState('');
  const [word, setWord] = useState(INITIAL_WORD);

  const { updateWord } = useHandleWords();
  const { updateIndexByWordId } = useHandleIndexes();

  useEffect(() => {
    const input = word2String(superWord);
    setInput(input);
    const word = string2Word({ value: input, word: superWord });
    setWord(word);
  }, [superWord]);

  const handleChangeInput = (input: string) => {
    setInput(input);
    const newWord = string2Word({ value: input, word });
    setWord(newWord);
  };

  const handleSubmit = async () => {
    const result = await updateWord(word);
    if (!!result) {
      const index = word2Index(word);
      const result = await updateIndexByWordId({
        value: index,
        wordId: word.id,
      });
      if (!!result) {
        callback();
      }
    }
  };

  return (
    <div style={{ display: 'grid', rowGap: 8 }}>
      <TextField
        value={input}
        size='small'
        fullWidth
        multiline
        onChange={(e) => handleChangeInput(e.target.value)}
      />
      <div style={{ padding: 8, background: '#eee' }}>
        <WordRow word={word} index={word.index} />
      </div>
      <Button sx={{ justifyContent: 'flex-end' }} onClick={handleSubmit}>
        update
      </Button>
    </div>
  );
};

export default EditWordPane;
