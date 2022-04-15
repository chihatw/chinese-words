import {
  limit,
  orderBy,
  Unsubscribe,
  DocumentData,
  QueryConstraint,
} from '@firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { db } from '../repositories/firebase';
import {
  addDocument,
  deleteDocument,
  snapshotCollection,
  updateDocument,
} from '../repositories/firebase/utils';

const COLLECTION = 'wordLists';

export type WordList = {
  id: string;
  createdAt: number;
  title: string;
  url: string;
  uploadedAt: number;
};

export const INITIAL_WORD_LIST: WordList = {
  id: '',
  title: '',
  url: '',
  createdAt: 0,
  uploadedAt: 0,
};

export const useWordList = (wordlistId: string) => {
  const [wordList, setWordList] = useState(INITIAL_WORD_LIST);
  const [wordLists, setWordLists] = useState<WordList[]>([]);

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

  useEffect(() => {
    if (!wordlistId) {
      setWordList(INITIAL_WORD_LIST);
    } else {
      const wordList =
        wordLists.filter((wordList) => wordList.id === wordlistId)[0] ??
        INITIAL_WORD_LIST;
      setWordList(wordList);
    }
  }, [wordlistId, wordLists]);

  useEffect(() => {
    const unsub = _snapshotCollection({
      queries: [orderBy('createdAt', 'desc'), limit(6)],
      setValues: setWordLists,
      buildValue: buildWordList,
    });
    return () => {
      unsub();
    };
  }, []);
  return { wordList, wordLists };
};

export const useHandleWordLists = () => {
  const _addDocument = useMemo(
    () =>
      async function <T extends { id: string }>(
        value: Omit<T, 'id'>
      ): Promise<T | null> {
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

  const _deleteDocument = useCallback(async (id: string) => {
    return await deleteDocument({ db, colId: COLLECTION, id });
  }, []);

  const addWordList = async (wordList: Omit<WordList, 'id'>) => {
    return await _addDocument(wordList);
  };

  const updateWordList = async (wordList: WordList) => {
    return await _updateDocument(wordList);
  };

  const deleteWordList = async (id: string) => {
    return await _deleteDocument(id);
  };

  return { addWordList, updateWordList, deleteWordList };
};

const buildWordList = (doc: DocumentData) => {
  const wordList: WordList = {
    id: doc.id,
    createdAt: doc.data().createdAt,
    title: doc.data().title,
    url: doc.data().url,
    uploadedAt: doc.data().uploadedAt,
  };
  return wordList;
};
