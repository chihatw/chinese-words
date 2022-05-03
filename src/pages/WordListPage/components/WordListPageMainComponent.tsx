import { Button, TextField } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WordRow from '../../../components/WordRow';
import WordRowContainer from '../../../components/WordRowContainer';
import { useHandleCharacters } from '../../../hooks/useCharacters';
import { useHandleIndexes, word2Index } from '../../../hooks/useIndexes';

import {
  INITIAL_PINYIN,
  Pinyin,
  string2Pinyin,
  useHandleWords,
  Word,
} from '../../../hooks/useWords';
import AppLayout from '../../../layout/AppLayout';
import { AppContext } from '../../../services/context';

const WordListPageMainComponent = ({
  word,
  words, // これ何？
  setWord,
  setWords,
  setIndexForm,
  setIndexPinyin,
  setIndexVowelTone,
}: {
  word: Word;
  words: Word[];
  setWord: (value: Word) => void;
  setWords: (value: Word[]) => void;
  setIndexForm: (value: string) => void;
  setIndexPinyin: (value: string) => void;
  setIndexVowelTone: (value: string) => void;
}) => {
  const navigate = useNavigate();
  const { addWord } = useHandleWords();
  const { setIndex } = useHandleIndexes();
  const { addCharacter } = useHandleCharacters();
  const formStrInputRef = useRef<HTMLInputElement>();
  const pinyinStrInputRef = useRef<HTMLInputElement>();

  const { words: superWords, wordList } = useContext(AppContext); // superWords って何？
  const [formStr, setFormStr] = useState('');
  const [pinyinStr, setPinyinStr] = useState('');
  const [sentence, setSentence] = useState('');
  const [japanese, setJapanese] = useState('');
  const [pinyins, setPinyins] = useState<Pinyin[]>([]);
  const [forms, setForms] = useState<string[]>([]);

  const getIndexForm = () => {
    const inputElement = formStrInputRef.current;
    if (!inputElement) return;
    const start = inputElement.selectionStart || 0;
    const value = inputElement.value;
    // カーソルの直前の一文字を取得 indexForm
    let indexForm = value.split('')[start - 1] || '';
    // ピンインの削除
    indexForm = indexForm.replace(/[0-9A-Za-z]/, '');
    // 改行文字の削除
    indexForm = indexForm.replace(/(\n)/, '');
    setIndexForm(indexForm);
    setIndexPinyin('');
    setIndexVowelTone('');
  };

  const getIndexPinyin = () => {
    const inputElement = pinyinStrInputRef.current;
    if (!inputElement) return;
    const start = inputElement.selectionStart || 0;
    const value = inputElement.value;

    // カーソルが該当するピンインを取得
    const startAt = value[start - 1] || '';

    if (!['\n', ' '].includes(startAt)) {
      // 後ろにピンインが続くかどうかの確認
      const postPinyinChars: string[] = [];
      let i = start;
      while (value[i] && value[i] !== ' ') {
        postPinyinChars.push(value[i]);
        i++;
      }
      // 前にピンインが続くかどうかの確認
      const prePinyinChars: string[] = [];
      i = start - 1;
      while (value[i] && value[i] !== ' ') {
        prePinyinChars.unshift(value[i]);
        i--;
      }
      const pinyinString = prePinyinChars.concat(postPinyinChars).join('');
      const { consonant, vowel, tone } = string2Pinyin(pinyinString);
      setIndexPinyin(consonant + vowel + tone);
      setIndexVowelTone(vowel + tone);
    } else {
      setIndexPinyin('');
      setIndexVowelTone('');
    }

    setIndexForm('');
  };

  useEffect(() => {
    const inputElement = formStrInputRef.current;
    if (!inputElement) return;
    inputElement.addEventListener('keyup', getIndexForm);
  }, []);

  useEffect(() => {
    const inputElement = pinyinStrInputRef.current;
    if (!inputElement) return;
    inputElement.addEventListener('keyup', getIndexPinyin);
  }, []);

  useEffect(() => {
    if (!!superWords.length) {
      setWords(superWords);
    } else {
      setWords([]);
    }
  }, [superWords]);

  useEffect(() => {
    const characters: { form: string; pinyin: Pinyin }[] = [];
    forms.forEach((form, index) => {
      characters.push({ form, pinyin: pinyins[index] || INITIAL_PINYIN });
    });
    const word: Word = {
      id: '',
      characters,
      createdAt: 0,
      wordListId: '',
      sentence,
      japanese,
      index: words.length,
    };
    setWord(word);
  }, [forms, pinyins, japanese, sentence]);

  const handleChangeFormStr = (formStr: string) => {
    setFormStr(formStr);
    const noPinyin = formStr.replace(/[0-9A-Za-z]/g, '').replace(/\s/g, '');
    const forms = noPinyin.split('');
    setForms(forms);
  };

  const handleChangePinyinStr = (pinyinStr: string) => {
    pinyinStr = pinyinStr.replace(/(\s){1,}/g, ' ');
    setPinyinStr(pinyinStr);
    const pinyins: Pinyin[] = [];
    for (const ps of pinyinStr.split(' ')) {
      const pinyin = string2Pinyin(ps);
      const { vowel } = pinyin;
      if (vowel) {
        pinyins.push(pinyin);
      }
    }
    setPinyins(pinyins);
  };

  const handleSubmit = async () => {
    if (!word.characters.length) return;
    for (const character of word.characters) {
      addCharacter(character);
    }
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
        inputRef={formStrInputRef}
        label='formStr'
        size='small'
        value={formStr}
        onChange={(e) => handleChangeFormStr(e.target.value)}
      />
      <TextField
        inputRef={pinyinStrInputRef}
        label='pinyinStr'
        size='small'
        value={pinyinStr}
        onChange={(e) => handleChangePinyinStr(e.target.value)}
      />
      <TextField
        label='sentence'
        size='small'
        value={sentence}
        onChange={(e) => setSentence(e.target.value)}
      />
      <TextField
        label='japanese'
        size='small'
        value={japanese}
        onChange={(e) => setJapanese(e.target.value)}
      />
      <Button onClick={handleSubmit}>add word</Button>
      {words.map((word, index) => (
        <WordRowContainer word={word} key={index} index={index} />
      ))}
    </AppLayout>
  );
};

export default WordListPageMainComponent;

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
