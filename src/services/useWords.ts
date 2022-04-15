import {
  limit,
  orderBy,
  Unsubscribe,
  DocumentData,
  QueryConstraint,
  getDoc,
  where,
  doc,
} from '@firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { db } from '../repositories/firebase';
import {
  addDocument,
  deleteDocument,
  snapshotCollection,
  updateDocument,
  batchDeleteDocuments,
  batchAddDocuments,
  getDocument,
} from '../repositories/firebase/utils';

const COLLECTION = 'words';

export type Character = {
  form: string;
  pinyin: string;
};

export const INITIAL_CHARACTER: Character = {
  form: '',
  pinyin: '',
};

export type Word = {
  id: string;
  createdAt: number;
  wordListId: string;
  index: number;
  characters: Character[];
  sentence: string;
  japanese: string;
};

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
  return { words };
};
export const useHandleWords = () => {
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

  const getWord = async (docId: string) => {
    return await _getDocument({
      docId,
      initialValue: INITIAL_WORD,
      buildValue: buildWord,
    });
  };

  const batchAddWords = async (words: Omit<Word, 'id'>[]) => {
    return await _batchAddDocuments(words);
  };

  const batchDeleteWords = async (ids: string[]) => {
    return await _batchDeleteDocuments(ids);
  };

  return { getWord, batchAddWords, batchDeleteWords };
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
