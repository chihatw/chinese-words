import { createContext } from 'react';

export const AppContext = createContext<{
  setWordListId: (value: string) => void;
}>({ setWordListId: () => {} });
