import { Button, TextField } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WordRow from '../../../components/WordRow';
import WordRowContainer from '../../../components/WordRowContainer';
import { Index, useHandleIndexes, word2Index } from '../../../hooks/useIndexes';

import {
  INITIAL_WORD,
  string2Word,
  useHandleWords,
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
  setStartLine,
  setIndexForm,
}: {
  word: Word;
  words: Word[];
  setWord: (value: Word) => void;
  setWords: (value: Word[]) => void;
  setStartLine: (value: number) => void;
  setIndexForm: (value: string) => void;
}) => {
  const navigate = useNavigate();
  const { addWord, batchAddWords, batchDeleteWords } = useHandleWords();
  const { setIndex, batchDeleteIndexes, batchSetIndexes } = useHandleIndexes();
  const inputRef = useRef<HTMLInputElement>();

  const { words: superWords, wordList } = useContext(AppContext);

  const [input, setInput] = useState('');
  const [batchInput, setBatchInput] = useState('');

  const getStartLineByKeyup = () => {
    const inputElement = inputRef.current;
    if (!inputElement) return;
    const start = inputElement.selectionStart || 0;
    const value = inputElement.value;
    const startLine = getStartLine(inputElement);
    switch (startLine) {
      case 0:
      case 2:
        // カーソルの直前の一文字を取得 indexForm
        let indexForm = value.split('')[start - 1] || '';
        // ピンインの削除
        indexForm = indexForm.replace(/[0-9A-Za-z]/, '');
        // 改行文字の削除
        indexForm = indexForm.replace(/(\n)/, '');
        setIndexForm(indexForm);
        break;
      case 1:
        // カーソルが該当するピンインを取得
        setIndexForm('');
        break;
      default:
        setIndexForm('');
    }
  };

  useEffect(() => {
    const inputElement = inputRef.current;
    if (!inputElement) return;
    inputElement.addEventListener('keyup', getStartLineByKeyup);
  }, []);

  useEffect(() => {
    if (!!superWords.length) {
      const batchInput = stringifyWords(superWords);
      setBatchInput(batchInput);
      const words = parseWords({ value: batchInput, words: superWords });
      setWords(words);
      const word: Word = { ...INITIAL_WORD, index: superWords.length };
      setWord(word);
      const input = word2String(word);
      setInput(input);
    }
  }, [superWords]);

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

  const handleChangeInput = (input: string) => {
    setInput(input);
    const word = string2Word({ value: input, index: words.length });

    setWord(word);
    const inputElem = inputRef.current;
    if (!!inputElem) {
      const startLine = getStartLine(inputElem);
      setStartLine(startLine);
    }
  };

  const handleChangeBatchInput = (batchInput: string) => {
    setBatchInput(batchInput);

    const newWords = parseWords({ value: batchInput, words });
    setWords(newWords);
  };
  const date = new Date(wordList.uploadedAt);
  return (
    <AppLayout>
      <h1>{`WordList - ${date.getFullYear()}/${
        date.getMonth() + 1
      }/${date.getDate()}`}</h1>
      <div>
        <Button onClick={() => navigate('/lists')}>戻る</Button>
        <Button onClick={() => navigate('/search')}>Search</Button>
      </div>
      <WordRow word={word} index={word.index} />
      <TextField
        inputRef={inputRef}
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

const getStartLine = (inputElement: HTMLInputElement) => {
  // カーソル位置
  const start = inputElement.selectionStart || 0;
  const value = inputElement.value;
  const lines = value.split('\n');

  let totalIndexes = 0;
  for (let i = 0; i < lines.length; i++) {
    const stringLengthWithLF = (lines[i]?.length || 0) + 1;
    const arrayFrom0 = Object.keys([...Array(stringLengthWithLF)]).map((x) =>
      Number(x)
    );
    const lineIndexes = arrayFrom0.map((x) => x + totalIndexes);

    if (lineIndexes.includes(start)) {
      return i;
    }
    totalIndexes += lineIndexes.length;
  }
  return 0;
};
