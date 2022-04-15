import { Container, TextField } from '@mui/material';
import React, { useState } from 'react';
import WordRow from '../../components/WordRow';
import { useHandleIndexes } from '../../services/useIndexes';
import { useHandleWords, Word } from '../../services/useWords';

const SearchPage = () => {
  const [input, setInput] = useState('');
  const [words, setWords] = useState<Word[]>([]);
  const { getWord } = useHandleWords();
  const { getWordIdsByForms } = useHandleIndexes();
  const handleChangeInput = async (value: string) => {
    setInput(value);
    if (!!value) {
      const wordIds = await getWordIdsByForms({ value, max: 10 });
      const words: Word[] = [];
      await Promise.all(
        wordIds.map(async (wordId) => {
          const word = await getWord(wordId);
          if (!!word.id) {
            words.push(word);
          }
        })
      );
      setWords(words);
    } else {
      setWords([]);
    }
  };
  return (
    <Container maxWidth='sm' sx={{ marginTop: 5 }}>
      <div style={{ display: 'grid', rowGap: 16 }}>
        <h1>Search Words</h1>
        <TextField
          value={input}
          onChange={(e) => handleChangeInput(e.target.value)}
        />
        {words.map((word, index) => (
          <WordRow key={index} index={index} word={word} />
        ))}
      </div>
    </Container>
  );
};

export default SearchPage;
