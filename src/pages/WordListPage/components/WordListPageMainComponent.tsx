import { Button, TextField } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { NavigateFunction } from 'react-router-dom';
import WordRow from '../../../components/WordRow';
import WordRowContainer from '../../../components/WordRowContainer';
import {
  INITIAL_WORD,
  string2Word,
  Word,
  word2String,
} from '../../../hooks/useWords';
import AppLayout from '../../../layout/AppLayout';
import { AppContext } from '../../../services/context';

const WordListPageMainComponent = ({
  word,
  words,
  setWord,
  setWords,
  navigate,
  handleSubmit,
  handleBatchSubmit,
}: {
  navigate: NavigateFunction;
  word: Word;
  words: Word[];
  setWord: (value: Word) => void;
  setWords: (value: Word[]) => void;
  handleSubmit: () => void;
  handleBatchSubmit: () => void;
}) => {
  const { words: superWords } = useContext(AppContext);

  const [input, setInput] = useState('');
  const [batchInput, setBatchInput] = useState('');

  useEffect(() => {
    const batchInput = stringifyWords(superWords);
    setBatchInput(batchInput);
    const words = parseWords({ value: batchInput, words: superWords });
    setWords(words);
    const word: Word = { ...INITIAL_WORD, index: superWords.length };
    setWord(word);
    const input = word2String(word);
    setInput(input);
  }, [superWords]);

  const handleChangeInput = (input: string) => {
    setInput(input);
    const word = string2Word({ value: input, index: words.length });
    setWord(word);
  };

  const handleChangeBatchInput = (batchInput: string) => {
    setBatchInput(batchInput);

    const newWords = parseWords({ value: batchInput, words });
    setWords(newWords);
  };

  return (
    <AppLayout>
      <h1>WordList</h1>
      <div>
        <Button onClick={() => navigate('/lists')}>戻る</Button>
        <Button onClick={() => navigate('/search')}>Search</Button>
      </div>
      <WordRow word={word} index={word.index} />
      <TextField
        value={input}
        multiline
        label='add Word'
        onChange={(e) => handleChangeInput(e.target.value)}
        rows={4}
      />
      <Button onClick={handleSubmit}>add word</Button>
      {words.map((word, index) => (
        <WordRowContainer word={word} key={index} index={index} />
      ))}
      <TextField
        multiline
        value={batchInput}
        onChange={(e) => handleChangeBatchInput(e.target.value)}
        rows={6}
      />
      <Button onClick={handleBatchSubmit}>submit</Button>
    </AppLayout>
  );
};

export default WordListPageMainComponent;

const parseWords = ({ value, words }: { value: string; words: Word[] }) => {
  const newWords: Word[] = [];
  const lines = value.split('\n');
  let index = 0;
  for (let i = 0; i < lines.length; i += 4) {
    const value = [
      lines[i] || '',
      lines[i + 1] || '',
      lines[i + 2] || '',
      lines[i + 3] || '',
    ].join('\n');
    const newWord = string2Word({ value, word: words[index], index });
    newWords.push(newWord);
    index++;
  }
  return newWords;
};

const stringifyWords = (words: Word[]) => {
  let lines: string[] = [];
  for (const word of words) {
    const _lines = word2String(word);
    lines = lines.concat(_lines);
  }
  return lines.join('\n');
};
