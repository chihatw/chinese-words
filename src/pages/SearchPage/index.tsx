import { Container, TextField, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WordRow from '../../components/WordRow';
import { useHandleIndexes } from '../../services/useIndexes';
import { useHandleWords, Word } from '../../services/useWords';

const SearchPage = () => {
  const navigate = useNavigate();
  const [formsInput, setFormsInput] = useState('');
  const [pinyinsInput, setPinyinsInput] = useState('');
  const [wordIds, setWordIds] = useState<string[]>([]);
  const [words, setWords] = useState<Word[]>([]);
  const { getWord } = useHandleWords();
  const { getWordIdsByIndexes } = useHandleIndexes();

  useEffect(() => {
    if (!!wordIds.length) {
      const fetchData = async () => {
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
      };
      fetchData();
    } else {
      setWords([]);
    }
  }, [wordIds]);

  const handleChangeFormsInput = async (value: string) => {
    setFormsInput(value);
    setPinyinsInput('');
    if (!!value) {
      const wordIds = await getWordIdsByIndexes({
        max: 10,
        type: 'form',
        value,
      });
      setWordIds(wordIds);
    } else {
      setWordIds([]);
    }
  };
  const handleChangePinyinsInput = async (value: string) => {
    setPinyinsInput(value);
    setFormsInput('');
    if (!!value) {
      let wordIds: string[] = [];
      const lastChar = value.slice(-1);
      if (['1', '2', '3', '4'].includes(lastChar)) {
        wordIds = await getWordIdsByIndexes({ value, max: 10, type: 'pinyin' });
      } else {
        wordIds = await getWordIdsByIndexes({
          max: 10,
          type: 'pinyinNoTone',
          value,
        });
      }
      setWordIds(wordIds);
    } else {
      setWordIds([]);
    }
  };
  return (
    <Container maxWidth='sm' sx={{ marginTop: 5 }}>
      <div style={{ display: 'grid', rowGap: 16 }}>
        <div>
          <h1>Search Words</h1>
          <Button onClick={() => navigate('/')}>戻る</Button>
        </div>
        <TextField
          size='small'
          value={formsInput}
          onChange={(e) => handleChangeFormsInput(e.target.value)}
          label='文字'
        />
        <TextField
          size='small'
          label='拼音'
          value={pinyinsInput}
          onChange={(e) => {
            handleChangePinyinsInput(e.target.value);
          }}
        />
        {words.map((word, index) => (
          <WordRow key={index} index={index} word={word} />
        ))}
      </div>
    </Container>
  );
};

export default SearchPage;
