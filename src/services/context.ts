import { createContext } from 'react';
import { INITIAL_WORD_LIST, WordList } from '../hooks/useWordList';
import { INITIAL_WORD, Word } from '../hooks/useWords';

export const AppContext = createContext<{
  setWordListId: (value: string) => void;
  wordList: WordList;
  wordLists: WordList[];
  words: Word[];
  getWord_m: (docId: string) => Promise<Word>;
  getWordIdsByIndexes_m: ({
    max,
    type,
    indexes: _indexes,
  }: {
    max?: number | undefined;
    type: 'form' | 'pinyin';
    indexes: string[];
  }) => Promise<string[]>;
}>({
  setWordListId: () => {},
  wordList: INITIAL_WORD_LIST,
  wordLists: [],
  words: [],
  getWordIdsByIndexes_m: async () => [],
  getWord_m: async () => INITIAL_WORD,
});
