import { TextField, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WordRow from '../../components/WordRow';
import AppLayout from '../../layout/AppLayout';
import { pinyin2String, string2Pinyin } from '../../services/pinyins';
import { useHandleIndexes } from '../../services/useIndexes';
import { useHandleWords, Word } from '../../services/useWords';

const SearchPage = () => {
  const navigate = useNavigate();
  const [formsInput, setFormsInput] = useState('');
  const [pinyinsInput, setPinyinsInput] = useState('');
  const [consonantInput, setConsonantInput] = useState('');
  const [vowelInput, setVowelInput] = useState('');
  const [vowelToneInput, setVowelToneInput] = useState('');
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

  // 文字で検索
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

  // 拼音で検索
  const handleChangePinyinsInput = async (value: string) => {
    setPinyinsInput(value);
    const pinyins = value.split(' ').map((str) => string2Pinyin(str));
    const pinyinStr = pinyins
      .map((pinyin) => pinyin2String(pinyin))
      .filter((i) => i)
      .join(' ');
    setFormsInput('');
    if (!!pinyinStr) {
      let wordIds: string[] = [];
      const lastPinyin = pinyins.slice(-1)[0];

      // 子音＋母音＋四声
      if (!!lastPinyin.tone) {
        wordIds = await getWordIdsByIndexes({
          value: pinyinStr,
          max: 10,
          type: 'pinyin', // 子音＋母音＋四声
        });
      } else {
        wordIds = await getWordIdsByIndexes({
          max: 10,
          type: 'pinyinNoTone', // 子音＋母音
          value: pinyinStr,
        });
      }
      // TODO string2Pinyin で子音だけでも返せるようにする？
      setWordIds(wordIds);
    } else {
      setWordIds([]);
    }
  };

  const handleChangeVowelInput = async (value: string) => {
    setVowelInput(value);
    const pinyins = value.split(' ').map((str) => string2Pinyin(str));
    const vowelStr = pinyins
      .filter(({ vowel }) => vowel)
      .map(({ vowel }) => vowel)
      .join(' ');
    if (!!vowelStr) {
      const wordIds = await getWordIdsByIndexes({
        value: vowelStr,
        max: 10,
        type: 'vowel',
      });
      setWordIds(wordIds);
    } else {
      setWordIds([]);
    }
  };
  const handleChangeVowelToneInput = async (value: string) => {
    setVowelToneInput(value);
    const pinyins = value.split(' ').map((str) => string2Pinyin(str));
    const vowelToneStr = pinyins
      .filter((pinyin) => pinyin.vowel)
      .map((pinyin) => pinyin.vowel + pinyin.tone)
      .join(' ');
    if (!!vowelToneStr) {
      const wordIds = await getWordIdsByIndexes({
        value: vowelToneStr,
        max: 10,
        type: 'vowelTone',
      });
      setWordIds(wordIds);
    } else {
      setWordIds([]);
    }
  };

  // 子音のみでの検索は、入力した値をそのまま検索にかける　たぶん使わない
  const handleChangeConsonantInput = async (value: string) => {
    setConsonantInput(value);
    if (!!value) {
      const wordIds = await getWordIdsByIndexes({
        value,
        max: 10,
        type: 'consonant',
      });
      setWordIds(wordIds);
    } else {
      setWordIds([]);
    }
  };

  return (
    <AppLayout>
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
      <TextField
        size='small'
        label='母音'
        value={vowelInput}
        onChange={(e) => handleChangeVowelInput(e.target.value)}
      />
      <TextField
        size='small'
        label='母音＋四声'
        value={vowelToneInput}
        onChange={(e) => handleChangeVowelToneInput(e.target.value)}
      />
      <TextField
        size='small'
        label='子音'
        value={consonantInput}
        onChange={(e) => handleChangeConsonantInput(e.target.value)}
      />
      {words.map((word, index) => (
        <WordRow key={index} index={index} word={word} />
      ))}
    </AppLayout>
  );
};

export default SearchPage;
