import { Button, Container, TextField } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WordRow from '../../components/WordRow';
import AppLayout from '../../layout/AppLayout';
import { AppContext } from '../../services/context';
import {
  Index,
  useHandleIndexes,
  words2Indexes,
} from '../../services/useIndexes';
import { Character, useHandleWords, Word } from '../../services/useWords';

type OmittedWord = Omit<Word, 'id' | 'createdAt' | 'wordListId'>;

const WordListPage = () => {
  const navigate = useNavigate();
  const { words: superWords, wordList } = useContext(AppContext);
  const { batchAddWords, batchDeleteWords } = useHandleWords();
  const { batchDeleteIndexesByWordIds, batchAddIndexes } = useHandleIndexes();

  const [input, setInput] = useState('');
  const [words, setWords] = useState<OmittedWord[]>([]);

  useEffect(() => {
    const input = stringifyWords(superWords);
    setInput(input);
    const words = parseWords(input);
    setWords(words);
  }, [superWords]);

  const handleChangeInput = (input: string) => {
    setInput(input);

    const words: OmittedWord[] = parseWords(input);
    console.log(words);
    setWords(words);
  };

  const handleSubmit = async () => {
    // 既存のwords を削除
    const ids = superWords.map((word) => word.id).filter((i) => i);
    if (ids.length) {
      batchDeleteWords(ids);
      batchDeleteIndexesByWordIds(ids);
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
    const newIndexes: Omit<Index, 'id'>[] = words2Indexes(_words);
    batchAddIndexes(newIndexes);
  };

  return (
    <AppLayout>
      <h1>WordList</h1>
      <div>
        <Button onClick={() => navigate('/lists')}>戻る</Button>
      </div>
      <TextField
        multiline
        value={input}
        onChange={(e) => handleChangeInput(e.target.value)}
        rows={20}
      />
      <Button onClick={handleSubmit}>submit</Button>
      <div>
        {words.map((word, index) => (
          <WordRow key={index} word={word} index={index} />
        ))}
      </div>
    </AppLayout>
  );
};

export default WordListPage;

const stringifyWords = (words: Word[]) => {
  const lines: string[] = [];
  for (const word of words) {
    const { characters, sentence, japanese } = word;
    const chinese = characters.map((character) => character.form).join('');
    const pinyins = characters.map((character) => character.pinyin).join(' ');
    lines.push(chinese);
    lines.push(pinyins);
    lines.push(sentence);
    lines.push(japanese);
  }
  return lines.join('\n');
};

const parseWords = (value: string) => {
  const words: OmittedWord[] = [];
  const lines = value.split('\n');
  let index = 0;
  for (let i = 0; i < lines.length; i += 4) {
    const chinese = lines[i];
    const pinyins = lines[i + 1]?.split(' ') || [];
    const sentence = lines[i + 2] || '';
    const japanese = lines[i + 3] || '';

    const characters = buildCharacters({ chinese, pinyins });

    const word: OmittedWord = {
      index,
      characters,
      sentence,
      japanese,
    };
    words.push(word);
    index++;
  }
  return words;
};

const buildCharacters = ({
  chinese,
  pinyins,
}: {
  chinese: string;
  pinyins: string[];
}) => {
  const characters: Character[] = [];
  const forms = chinese.split('');
  forms.forEach((form, index) => {
    const character: Character = {
      form,
      pinyin: pinyins[index] || '',
    };
    characters.push(character);
  });

  return characters;
};
