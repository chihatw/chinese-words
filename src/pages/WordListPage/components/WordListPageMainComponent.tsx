import { Button, TextField } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WordRow from '../../../components/WordRow';
import WordRowContainer from '../../../components/WordRowContainer';
import { useHandleCharacters } from '../../../hooks/useCharacters';
import { useHandleIndexes, word2Index } from '../../../hooks/useIndexes';

import {
  INITIAL_PINYIN,
  INITIAL_WORD,
  Pinyin,
  pinyin2String,
  string2Pinyin,
  useHandleWords,
  Word,
} from '../../../hooks/useWords';
import AppLayout from '../../../layout/AppLayout';
import { AppContext } from '../../../services/context';

const WordListPageMainComponent = ({
  setIndexForm,
  setIndexPinyin,
  setIndexVowelTone,
}: {
  setIndexForm: (value: string) => void;
  setIndexPinyin: (value: string) => void;
  setIndexVowelTone: (value: string) => void;
}) => {
  const navigate = useNavigate();
  const { getPinyinFromForm_m } = useContext(AppContext);
  const { addWord } = useHandleWords();
  const { setIndex } = useHandleIndexes();
  const { addCharacter } = useHandleCharacters();
  const formStrInputRef = useRef<HTMLInputElement>();
  const pinyinStrInputRef = useRef<HTMLInputElement>();

  const { words, wordList } = useContext(AppContext); // superWords って何？
  const [word, setWord] = useState(INITIAL_WORD);
  const [formStr, setFormStr] = useState('');
  const [pinyinStr, setPinyinStr] = useState('');
  const [sentence, setSentence] = useState('');
  const [japanese, setJapanese] = useState('');
  const [pinyins, setPinyins] = useState<Pinyin[]>([]);
  const [forms, setForms] = useState<string[]>([]);

  const formStrKeyupCallback = () => {
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

  const pinyinStrKeyupCallback = () => {
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
    inputElement.addEventListener('keyup', formStrKeyupCallback);
  }, []);

  useEffect(() => {
    const inputElement = pinyinStrInputRef.current;
    if (!inputElement) return;
    inputElement.addEventListener('keyup', pinyinStrKeyupCallback);
  }, []);

  useEffect(() => {
    const characters = forms.map((form, index) => ({
      form,
      pinyin: pinyins[index] || INITIAL_PINYIN,
    }));
    const word: Word = {
      ...INITIAL_WORD,
      characters,
      sentence,
      japanese,
      index: words.length,
    };
    setWord(word);
  }, [forms, pinyins, japanese, sentence]);

  const handleChangeFormStr = async (formStr: string) => {
    setFormStr(formStr);
    const noPinyin = formStr.replace(/[0-9A-Za-z]/g, '').replace(/\s/g, '');
    const forms = noPinyin.split('');
    setForms(forms);
    const pinyins: Pinyin[] = [];
    for (const form of forms) {
      const pinyin = await getPinyinFromForm_m(form);
      pinyins.push(pinyin);
    }
    setPinyinStr(pinyins.map((pinyin) => pinyin2String(pinyin)).join(' '));
    setPinyins(pinyins);
  };

  const handleChangePinyinStr = (pinyinStr: string) => {
    // 連続する半角スペースは1つにまとめる
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
      // add + update
      addCharacter(character);
    }
    const { id, ...newWord }: Word = {
      ...word,
      createdAt: Date.now(),
      wordListId: wordList.id,
    };
    const result = await addWord(newWord);
    if (!!result) {
      const word: Word = {
        ...newWord,
        id: result.id,
      };
      const index = word2Index({ word });
      setIndex(index);
      setFormStr('');
      setPinyinStr('');
      setSentence('');
      setJapanese('');
      setForms([]);
      setPinyins([]);
      setIndexForm('');
      setIndexPinyin('');
      setIndexVowelTone('');
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
      <WordRow word={word} index={words.length} />
      <TextField
        autoComplete='off'
        inputRef={formStrInputRef}
        label='formStr'
        size='small'
        value={formStr}
        onChange={(e) => handleChangeFormStr(e.target.value)}
      />
      <TextField
        inputRef={pinyinStrInputRef}
        label='pinyinStr'
        autoComplete='off'
        size='small'
        value={pinyinStr}
        onChange={(e) => handleChangePinyinStr(e.target.value)}
      />
      <TextField
        label='sentence'
        autoComplete='off'
        size='small'
        value={sentence}
        onChange={(e) => setSentence(e.target.value)}
      />
      <TextField
        label='japanese'
        autoComplete='off'
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
