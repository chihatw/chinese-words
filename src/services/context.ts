import { createContext } from 'react';
import { INITIAL_WORD_LIST, WordList } from '../hooks/useWordList';
import { Word } from '../hooks/useWords';

export const AppContext = createContext<{
  setWordListId: (value: string) => void;
  wordList: WordList;
  wordLists: WordList[];
  words: Word[];
}>({
  setWordListId: () => {},
  wordList: INITIAL_WORD_LIST,
  wordLists: [],
  words: [],
});
