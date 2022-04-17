import { TextField, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WordRow from '../../components/WordRow';
import AppLayout from '../../layout/AppLayout';
import { useHandleIndexes } from '../../hooks/useIndexes';
import {
  Pinyin,
  useHandleWords,
  Word,
  pinyin2String,
  string2Pinyin,
} from '../../hooks/useWords';

const SearchPage = () => {
  const navigate = useNavigate();
  const [formsInput, setFormsInput] = useState('');
  const [pinyinsInput, setPinyinsInput] = useState('');
  const [pinyins, setPinyins] = useState<Pinyin[]>([]);
  const [forms, setForms] = useState<string[]>([]);
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
        if (forms.length || pinyins.length) {
          setWords(words);
        } else {
          setWords([]);
        }
      };
      fetchData();
    } else {
      setWords([]);
    }
  }, [wordIds, forms, pinyins]);

  // 文字で検索
  const handleChangeFormsInput = async (value: string) => {
    setFormsInput(value);
    const forms = value.split('');
    setForms(forms);
    setPinyins([]);
    setPinyinsInput('');
    if (!!forms.length) {
      const wordIds = await getWordIdsByIndexes({
        max: 10,
        type: 'form',
        indexes: forms,
      });
      setWordIds(wordIds);
    } else {
      setWordIds([]);
    }
  };

  // 拼音で検索
  const handleChangePinyinsInput = async (value: string) => {
    setPinyinsInput(value);
    setFormsInput('');
    setForms([]);
    const pinyins = value
      .split(' ')
      .map((str) => string2Pinyin(str))
      .filter((pinyin) => !!pinyin2String(pinyin));
    setPinyins(pinyins);

    if (!!pinyins.length) {
      const wordIds: string[] = await getWordIdsByIndexes({
        indexes: pinyins.map((pinyin) => pinyin2String(pinyin)),
        max: 10,
        type: 'pinyin',
      });

      setWordIds(wordIds);
    } else {
      setWordIds([]);
    }
  };

  return (
    <AppLayout>
      <div>
        <h1>Search</h1>
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
      <div
        style={{
          display: 'flex',
          padding: '0 16px',
          color: 'darkgreen',
          alignItems: 'center',
        }}
      >
        <div style={{ color: '#aaa', marginRight: 8 }}>検索Index: </div>
        {pinyins.map(({ consonant, vowel, tone }, index) => (
          <div
            key={index}
            style={{ marginRight: 4 }}
          >{`${consonant}${vowel}${tone}${
            pinyins[index + 1] ? ', ' : ''
          }`}</div>
        ))}
        {forms.map((form, index) => (
          <div key={index} style={{ marginRight: 4 }}>{`${form}${
            forms[index + 1] ? ',' : ''
          }`}</div>
        ))}
      </div>
      {words.map((word, index) => (
        <WordRow key={index} index={index} word={word} />
      ))}
    </AppLayout>
  );
};

export default SearchPage;
