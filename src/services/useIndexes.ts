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
  getDocumentsByQuery,
} from '../repositories/firebase/utils';

const COLLECTION = 'indexes';

export type Index = {
  id: string;
  wordId: string;
  wordFormIndexes: { [key: string]: boolean };
};

export const INITIAL_INDEX: Index = {
  id: '',
  wordId: '',
  wordFormIndexes: {},
};

export const useHandleIndexes = () => {
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

  const batchAddIndexes = async (values: Omit<Index, 'id'>[]) => {
    return await _batchAddDocuments(values);
  };

  const batchDeleteIndexesByWordIds = async (wordIds: string[]) => {
    const ids: string[] = [];

    await Promise.all(
      wordIds.map(async (wordId) => {
        console.log({ wordId });
        const result = await _getDocumentsByQuery({
          queries: [where('wordId', '==', wordId)],
          buildValue: buildIndex,
        });
        console.log({ result });
        if (!!result.length) {
          ids.push(result[0].id);
        }
      })
    );
    if (!!ids.length) {
      _batchDeleteDocuments(ids);
    }
  };

  const getWordIdsByForms = async ({
    value,
    max,
  }: {
    value: string;
    max?: number;
  }): Promise<string[]> => {
    const queries = [];

    for (const index of value.split('')) {
      queries.push(where(`wordFormIndexes.${index}`, '==', true));
    }

    if (!!max) {
      queries.push(limit(max));
    }

    const indexes = await _getDocumentsByQuery({
      queries,
      buildValue: buildIndex,
    });
    const wordIds = indexes.map((index) => index.wordId);
    return wordIds;
  };

  return { batchAddIndexes, batchDeleteIndexesByWordIds, getWordIdsByForms };
};

const buildIndex = (doc: DocumentData) => {
  const index: Index = {
    id: doc.id,
    wordId: doc.data().wordId,
    wordFormIndexes: doc.data().wordFormIndexes,
  };
  return index;
};
