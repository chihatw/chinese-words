import {
  limit,
  DocumentData,
  QueryConstraint,
  where,
} from '@firebase/firestore';
import { useCallback, useMemo, useRef } from 'react';
import { db } from '../repositories/firebase';
import {
  updateDocument,
  batchSetDocuments,
  getDocumentsByQuery,
  batchDeleteDocuments,
  deleteDocument,
  setDocument,
} from '../repositories/firebase/utils';
import { Word } from './useWords';

const COLLECTION = 'indexes';

export type Index = {
  id: string;
  wordFormIndexes: { [key: string]: boolean };
  wordPinyinIndexes: { [key: string]: boolean };
};

export const INITIAL_INDEX: Index = {
  id: '',
  wordFormIndexes: {},
  wordPinyinIndexes: {},
};

export const useIndexes = () => {
  const wordIdsByIndexesMemoRef = useRef<{ [key: string]: string[] }>({});
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
  const getWordIdsByIndexes_m = async ({
    max,
    type,
    indexes: _indexes,
  }: {
    max?: number;
    type: 'form' | 'pinyin';
    indexes: string[];
  }): Promise<string[]> => {
    const queries = [];
    const memoKey = type + _indexes.join(',');
    const memorized = wordIdsByIndexesMemoRef.current[memoKey];
    if (!!memorized) return memorized;
    // メモ化されていない場合
    switch (type) {
      case 'form':
        for (const index of _indexes) {
          queries.push(where(`wordFormIndexes.${index}`, '==', true));
        }
        break;
      case 'pinyin':
        for (const index of _indexes) {
          queries.push(where(`wordPinyinIndexes.${index}`, '==', true));
        }
        break;
      default:
    }

    if (!!max) {
      queries.push(limit(max));
    }

    const indexes = await _getDocumentsByQuery({
      queries,
      buildValue: buildIndex,
    });
    const wordIds = indexes.map((index) => index.id);

    wordIdsByIndexesMemoRef.current = {
      ...wordIdsByIndexesMemoRef.current,
      [memoKey]: wordIds,
    };
    return wordIds;
  };
  return { getWordIdsByIndexes_m };
};

export const useHandleIndexes = () => {
  const _setDocument = useMemo(
    () =>
      async function <T extends { id: string }>(value: T) {
        return await setDocument({
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
  const _batchSetDocuments = useMemo(
    () =>
      async function <T extends { id: string }>(values: T[]): Promise<boolean> {
        return await batchSetDocuments({ db, colId: COLLECTION, values });
      },
    []
  );
  const _batchDeleteDocuments = useCallback(async (ids: string[]) => {
    return await batchDeleteDocuments({ db, colId: COLLECTION, ids });
  }, []);

  const setIndex = async (value: Index) => {
    return await _setDocument(value);
  };

  const updateIndex = async (value: Index) => {
    return await _updateDocument(value);
  };
  const deleteIndex = async (id: string) => {
    return await _deleteDocument(id);
  };
  const batchSetIndexes = async (values: Index[]) => {
    return await _batchSetDocuments(values);
  };

  const batchDeleteIndexes = async (ids: string[]) => {
    return await _batchDeleteDocuments(ids);
  };

  return {
    setIndex,
    updateIndex,
    deleteIndex,
    batchSetIndexes,
    batchDeleteIndexes,
  };
};

const buildIndex = (doc: DocumentData) => {
  const index: Index = {
    id: doc.id || '',
    wordFormIndexes: doc.data().wordFormIndexes || {},
    wordPinyinIndexes: doc.data().wordPinyinIndexes || {},
  };
  return index;
};

export const word2Index = ({
  word,
}: {
  word: Pick<Word, 'characters' | 'id'>;
}) => {
  const { id, characters } = word;
  const index: Index = {
    id,
    wordFormIndexes: {},
    wordPinyinIndexes: {},
  };
  for (const { form, pinyin } of characters) {
    let value = '';
    const { consonant, vowel, tone } = pinyin;

    value = form;
    !!value && (index.wordFormIndexes[value] = true);

    value = consonant + vowel + tone;
    !!value && (index.wordPinyinIndexes[value] = true);

    value = consonant + vowel;
    !!value && (index.wordPinyinIndexes[value] = true);

    value = vowel + tone;
    !!value && (index.wordPinyinIndexes[value] = true);

    value = vowel;
    !!value && (index.wordPinyinIndexes[value] = true);

    value = consonant;
    !!value && (index.wordPinyinIndexes[value] = true);
  }
  return index;
};
