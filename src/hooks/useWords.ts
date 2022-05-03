import {
  orderBy,
  Unsubscribe,
  DocumentData,
  QueryConstraint,
  where,
} from '@firebase/firestore';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { db } from '../repositories/firebase';
import {
  snapshotCollection,
  updateDocument,
  batchDeleteDocuments,
  batchAddDocuments,
  getDocument,
  getDocumentsByQuery,
  addDocument,
  deleteDocument,
} from '../repositories/firebase/utils';
import { getConsonant, getVowel } from '../services/pinyins';

const COLLECTION = 'words';

export type Pinyin = {
  vowel: string;
  consonant: string;
  tone: string;
};
export const INITIAL_PINYIN: Pinyin = {
  vowel: '',
  consonant: '',
  tone: '',
};

export type Word = {
  id: string;
  createdAt: number;
  wordListId: string;
  index: number;
  characters: {
    form: string;
    pinyin: Pinyin;
  }[];
  sentence: string;
  japanese: string;
};

export type OmittedWord = Omit<Word, 'id' | 'createdAt' | 'wordListId'>;

export const INITIAL_WORD: Word = {
  id: '',
  createdAt: 0,
  wordListId: '',
  index: 0,
  characters: [],
  sentence: '',
  japanese: '',
};

export const useWords = (wordListId: string) => {
  const [words, setWords] = useState<Word[]>([]);
  const wordMemoRef = useRef<{ [key: string]: Word }>({});

  const _snapshotCollection = useMemo(
    () =>
      function <T>({
        queries,
        setValues,
        buildValue,
      }: {
        queries?: QueryConstraint[];
        setValues: (value: T[]) => void;
        buildValue: (value: DocumentData) => T;
      }): Unsubscribe {
        return snapshotCollection({
          db,
          colId: COLLECTION,
          queries,
          setValues,
          buildValue,
        });
      },
    []
  );

  const _getDocument = useMemo(
    () =>
      async function <T>({
        docId,
        initialValue,
        buildValue,
      }: {
        docId: string;
        initialValue: T;
        buildValue: (value: DocumentData) => T;
      }): Promise<T> {
        return await getDocument({
          db,
          colId: COLLECTION,
          docId,
          initialValue,
          buildValue,
        });
      },
    []
  );

  useEffect(() => {
    if (!wordListId) {
      setWords([]);
      return;
    }
    const unsub = _snapshotCollection({
      queries: [where('wordListId', '==', wordListId), orderBy('index')],
      setValues: setWords,
      buildValue: buildWord,
    });
    return () => {
      unsub();
    };
  }, [wordListId]);

  const getWord_m = async (docId: string) => {
    const memoKey = docId;
    const memorized = wordMemoRef.current[memoKey];
    if (!!memorized) return memorized;

    const word = await _getDocument({
      docId,
      initialValue: INITIAL_WORD,
      buildValue: buildWord,
    });
    wordMemoRef.current = {
      ...wordMemoRef.current,
      [memoKey]: word,
    };
    return word;
  };

  return { words, getWord_m };
};
export const useHandleWords = () => {
  const _getDocumentsByQuery = async <T>({
    queries,
    buildValue,
  }: {
    queries?: QueryConstraint[];
    buildValue: (value: DocumentData) => T;
  }): Promise<T[]> => {
    return await getDocumentsByQuery({
      db,
      colId: COLLECTION,
      queries,
      buildValue,
    });
  };
  const _addDocument = useMemo(
    () =>
      async function <T extends { id: string }>(value: Omit<T, 'id'>) {
        return await addDocument({
          db,
          colId: COLLECTION,
          value,
        });
      },
    []
  );
  const _updateDocument = useMemo(
    () =>
      async function <T extends { id: string }>(value: T): Promise<T | null> {
        return await updateDocument({
          db,
          colId: COLLECTION,
          value,
        });
      },
    []
  );
  const _deleteDocument = useMemo(
    () =>
      async function (id: string): Promise<boolean> {
        return await deleteDocument({
          id,
          db,
          colId: COLLECTION,
        });
      },
    []
  );
  const _batchAddDocuments = useMemo(
    () =>
      async function <T extends { id: string }>(
        values: Omit<T, 'id'>[]
      ): Promise<string[]> {
        return await batchAddDocuments({ db, colId: COLLECTION, values });
      },
    []
  );
  const _batchDeleteDocuments = useCallback(async (ids: string[]) => {
    return await batchDeleteDocuments({ db, colId: COLLECTION, ids });
  }, []);

  const addWord = async (word: Omit<Word, 'id'>) => {
    return await _addDocument(word);
  };

  const deleteWord = async (id: string) => {
    return await _deleteDocument(id);
  };

  const getWordsByWordListId = async (wordListId: string) => {
    return await _getDocumentsByQuery({
      queries: [where('wordListId', '==', wordListId)],
      buildValue: buildWord,
    });
  };

  const updateWord = async (word: Word) => {
    return await _updateDocument(word);
  };

  const batchAddWords = async (words: Omit<Word, 'id'>[]) => {
    return await _batchAddDocuments(words);
  };

  const batchDeleteWords = async (ids: string[]) => {
    return await _batchDeleteDocuments(ids);
  };

  return {
    addWord,
    updateWord,
    deleteWord,
    batchAddWords,
    batchDeleteWords,
    getWordsByWordListId,
  };
};

const buildWord = (doc: DocumentData) => {
  const word: Word = {
    id: doc.id,
    createdAt: doc.data().createdAt,
    wordListId: doc.data().wordListId,
    index: doc.data().index,
    characters: doc.data().characters,
    sentence: doc.data().sentence,
    japanese: doc.data().japanese,
  };
  return word;
};

export const buildCharacters = ({
  forms,
  pinyins,
}: {
  forms: string[];
  pinyins: string[];
}) => {
  const characters: { form: string; pinyin: Pinyin }[] = [];
  forms.forEach((form, index) => {
    const pinyin = string2Pinyin(pinyins[index] || '');
    const character = {
      form,
      pinyin,
    };
    characters.push(character);
  });

  return characters;
};

export const pinyin2String = (pinyin: Pinyin): string => {
  const { consonant, vowel, tone } = pinyin;
  return consonant + vowel + tone;
};

export const string2Pinyin = (value: string): Pinyin => {
  const tail = value.slice(-1);
  let tone = '';
  if (['0', '1', '2', '3', '4'].includes(tail)) {
    tone = tail;
  }

  const valueNoTone = value.slice(0, value.length - tone.length);
  const consonant = getConsonant(valueNoTone);
  const remainder = valueNoTone.slice(consonant.length);
  const vowel = getVowel(remainder);

  const pinyin: Pinyin = {
    consonant,
    vowel,
    tone: !!vowel ? tone : '', // 四声 は 母音が必要
  };

  return pinyin;
};
