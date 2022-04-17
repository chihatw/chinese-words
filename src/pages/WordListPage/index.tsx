import { Button, TextField } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WordRow from '../../components/WordRow';
import AppLayout from '../../layout/AppLayout';
import { AppContext } from '../../services/context';
import { Index, word2Index, useHandleIndexes } from '../../hooks/useIndexes';
import {
  Word,
  word2String,
  string2Word,
  useHandleWords,
  INITIAL_WORD,
} from '../../hooks/useWords';
import WordRowContainer from '../../components/WordRowContainer';

const WordListPage = () => {
  const navigate = useNavigate();
  const { words: superWords, wordList } = useContext(AppContext);
  const { addWord, batchAddWords, batchDeleteWords } = useHandleWords();
  const { setIndex, batchDeleteIndexes, batchSetIndexes } = useHandleIndexes();

  const [input, setInput] = useState('');
  const [batchInput, setBatchInput] = useState('');
  const [words, setWords] = useState<Word[]>([]);
  const [word, setWord] = useState(INITIAL_WORD);

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

  const handleChangeBatchInput = (batchInput: string) => {
    setBatchInput(batchInput);

    const newWords = parseWords({ value: batchInput, words });
    setWords(newWords);
  };

  const handleChangeInput = (input: string) => {
    setInput(input);
    const word = string2Word({ value: input, index: words.length });
    setWord(word);
  };

  const handleSubmit = async () => {
    const newWord: Omit<Word, 'id'> = {
      ...word,
      createdAt: Date.now(),
      wordListId: wordList.id,
    };
    const result = await addWord(newWord);
    if (!!result) {
      console.log({ result });
      const _word: Word = {
        ...newWord,
        id: result.id,
      };
      const index = word2Index(_word);
      console.log({ index });
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
      const index = word2Index(word);
      newIndexes.push(index);
    }
    batchSetIndexes(newIndexes);
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

export default WordListPage;

const stringifyWords = (words: Word[]) => {
  let lines: string[] = [];
  for (const word of words) {
    const _lines = word2String(word);
    lines = lines.concat(_lines);
  }
  return lines.join('\n');
};

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
