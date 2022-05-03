import { createContext } from 'react';
import { Character, INITIAL_CHARACTER } from '../hooks/useCharacters';
import { INITIAL_WORD_LIST, WordList } from '../hooks/useWordList';
import { INITIAL_PINYIN, INITIAL_WORD, Pinyin, Word } from '../hooks/useWords';

export const AppContext = createContext<{
  setWordListId: (value: string) => void;
  wordList: WordList;
  wordLists: WordList[];
  words: Word[];
  getWord_m: (docId: string) => Promise<Word>;
  getCharacter_m: (form: string) => Promise<Character>;
  getWordIdsByIndexes_m: ({
    max,
    type,
    indexes: _indexes,
  }: {
    max?: number | undefined;
    type: 'form' | 'pinyin';
    indexes: string[];
  }) => Promise<string[]>;
  getPinyinFromForm_m: (form: string) => Promise<Pinyin>;
}>({
  setWordListId: () => {},
  wordList: INITIAL_WORD_LIST,
  wordLists: [],
  words: [],
  getWordIdsByIndexes_m: async () => [],
  getWord_m: async () => INITIAL_WORD,
  getCharacter_m: async () => INITIAL_CHARACTER,
  getPinyinFromForm_m: async () => INITIAL_PINYIN,
});
