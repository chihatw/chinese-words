import { Button, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import WordRow from '../../../components/WordRow';
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

const EditWordPane = ({
  word: superWord,
  callback,
}: {
  word: Word;
  callback: () => void;
}) => {
  const [formStr, setFormStr] = useState('');
  const [pinyinStr, setPinyinStr] = useState('');
  const [sentence, setSentence] = useState('');
  const [japanese, setJapanese] = useState('');
  const [word, setWord] = useState(INITIAL_WORD);
  const [pinyins, setPinyins] = useState<Pinyin[]>([]);
  const [forms, setForms] = useState<string[]>([]);

  const { updateWord } = useHandleWords();
  const { updateIndex } = useHandleIndexes();

  useEffect(() => {
    setWord(superWord);
    setForms(superWord.characters.map(({ form }) => form));
    setPinyins(superWord.characters.map(({ pinyin }) => pinyin));
    setFormStr(
      superWord.characters.map((character) => character.form).join('')
    );
    setPinyinStr(
      superWord.characters
        .map((character) => pinyin2String(character.pinyin))
        .join(' ')
    );
    setJapanese(superWord.japanese);
    setSentence(superWord.sentence);
  }, [superWord]);

  useEffect(() => {
    const characters: { form: string; pinyin: Pinyin }[] = [];
    forms.forEach((form, index) => {
      characters.push({ form, pinyin: pinyins[index] || INITIAL_PINYIN });
    });
    const word: Word = {
      ...superWord,
      characters,
      sentence,
      japanese,
    };
    setWord(word);
  }, [forms, pinyins, japanese, sentence, superWord]);

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
    const result = await updateWord(word);
    if (!!result) {
      const index = word2Index({ word });
      const result = await updateIndex(index);
      if (!!result) {
        callback();
      }
    }
  };

  return (
    <div style={{ display: 'grid', rowGap: 8 }}>
      <TextField
        label='formStr'
        value={formStr}
        size='small'
        onChange={(e) => handleChangeFormStr(e.target.value)}
      />
      <TextField
        label='pinyinStr'
        value={pinyinStr}
        size='small'
        onChange={(e) => handleChangePinyinStr(e.target.value)}
      />
      <TextField
        label='sentence'
        value={sentence}
        size='small'
        onChange={(e) => setSentence(e.target.value)}
      />
      <TextField
        label='japanese'
        value={japanese}
        size='small'
        onChange={(e) => setJapanese(e.target.value)}
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
