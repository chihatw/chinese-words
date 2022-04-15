import {
  limit,
  orderBy,
  Unsubscribe,
  DocumentData,
  QueryConstraint,
  getDoc,
  doc,
} from '@firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { db } from '../repositories/firebase';
import { snapshotCollection } from '../repositories/firebase/utils';

const COLLECTION = 'wordLists';

export const useWordList = () => {
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
    getDoc(doc(db, COLLECTION, 'test'))
      .then((snapshot) => {
        console.log(snapshot.exists());
      })
      .catch((e) => {
        console.warn(e);
      });
  }, []);
};
