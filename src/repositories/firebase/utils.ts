import {
  doc,
  query,
  addDoc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  Firestore,
  writeBatch,
  onSnapshot,
  collection,
  Unsubscribe,
  DocumentData,
  QueryConstraint,
  getDoc,
} from 'firebase/firestore';

// ドキュメントの value フィールドの値を取得する（フィールド名固定）
export const snapshotDocumentValue = <T>({
  db,
  docId,
  colId,
  initialValue,
  setValue,
}: {
  db: Firestore;
  docId: string;
  colId: string;
  initialValue: T;
  setValue: (value: T) => void;
}): Unsubscribe => {
  return onSnapshot(
    doc(db, colId, docId),
    (snapshot) => {
      console.log(`snapshot ${colId}`);
      if (snapshot.exists()) {
        const value: T = snapshot.data().value;
        if (!!value) {
          setValue(value);
        } else {
          setValue(initialValue);
        }
      } else {
        setValue(initialValue);
      }
    },
    (e) => {
      console.warn(e);
      setValue(initialValue);
    }
  );
};

export const snapshotDocument = <T>({
  db,
  id,
  colId,
  setValue,
  buildValue,
  initialValue,
}: {
  db: Firestore;
  id: string;
  colId: string;
  initialValue: T;
  setValue: (value: T) => void;
  buildValue: (value: DocumentData) => T;
}): Unsubscribe => {
  return onSnapshot(
    doc(db, colId, id),
    (snapshot) => {
      console.log(`snapshot ${colId}`);
      if (snapshot.exists()) {
        const value = buildValue(snapshot);
        setValue(value);
      } else {
        setValue(initialValue);
      }
    },
    (e) => {
      console.warn(e);
      setValue(initialValue);
    }
  );
};

export const snapshotCollection = <T>({
  db,
  colId,
  queries,
  setValues,
  buildValue,
}: {
  db: Firestore;
  colId: string;
  queries?: QueryConstraint[];
  setValues: (values: T[]) => void;
  buildValue: (value: DocumentData) => T;
}): Unsubscribe => {
  let q = query(collection(db, colId));
  if (!!queries) {
    for (let _q of queries) {
      q = query(q, _q);
    }
  }
  return onSnapshot(
    q,
    (snapshot) => {
      console.log(`snapshot ${colId}`);
      const values: T[] = [];
      snapshot.forEach((doc) => {
        const value = buildValue(doc);
        values.push(value);
      });
      setValues(values);
    },
    (e) => {
      console.warn(e);
      setValues([]);
    }
  );
};

export const snapshotDocumentByQuery = <T>({
  db,
  colId,
  queries,
  initialValue,
  setValue,
  buildValue,
}: {
  db: Firestore;
  colId: string;
  queries?: QueryConstraint[];
  initialValue: T;
  setValue: (values: T) => void;
  buildValue: (value: DocumentData) => T;
}): Unsubscribe => {
  let q = query(collection(db, colId));
  if (!!queries) {
    for (let _q of queries) {
      q = query(q, _q);
    }
  }
  return onSnapshot(
    q,
    (snapshot) => {
      console.log(`snapshot ${colId}`);
      if (snapshot.size > 0) {
        const doc = snapshot.docs[0];

        const value = buildValue(doc);
        setValue(value);
      } else {
        setValue(initialValue);
      }
    },
    (e) => {
      console.warn(e);
      setValue(initialValue);
    }
  );
};

export const getDocument = async <T>({
  db,
  colId,
  docId,
  initialValue,
  buildValue,
}: {
  db: Firestore;
  colId: string;
  docId: string;
  initialValue: T;
  buildValue: (value: DocumentData) => T;
}): Promise<T> => {
  console.log(`get doc ${colId}`);
  return await getDoc(doc(db, colId, docId))
    .then((snapshot) => {
      let value = initialValue;
      if (snapshot.exists()) {
        value = buildValue(snapshot);
      }
      return value;
    })
    .catch((e) => {
      console.warn(e);
      return initialValue;
    });
};

export const getDocumentsByQuery = async <T>({
  db,
  colId,
  queries,
  buildValue,
}: {
  db: Firestore;
  colId: string;
  queries?: QueryConstraint[];
  buildValue: (value: DocumentData) => T;
}): Promise<T[]> => {
  let q = query(collection(db, colId));
  if (!!queries) {
    for (let _q of queries) {
      q = query(q, _q);
    }
  }
  console.log(`get docs ${colId}`);
  return await getDocs(q)
    .then((snapshot) => {
      const values: T[] = [];
      snapshot.forEach((doc) => {
        const value = buildValue(doc);
        values.push(value);
      });
      return values;
    })
    .catch((e) => {
      console.warn(e);
      return [];
    });
};

// ドキュメントの value フィールドの値を更新する（フィールド名固定）
export const updateDocumenValue = async <T>({
  db,
  value,
  colId,
  docId,
}: {
  db: Firestore;
  colId: string;
  value: T;
  docId: string;
}): Promise<T | null> => {
  console.log(`update ${colId}`);
  return await updateDoc(doc(db, colId, docId), { value })
    .then(() => {
      return value;
    })
    .catch((e) => {
      console.warn(e);
      return null;
    });
};

export const updateDocument = async <T extends { id: string }>({
  db,
  colId,
  value,
}: {
  db: Firestore;
  colId: string;
  value: T;
}): Promise<T | null> => {
  const { id, ...omitted } = value;
  console.log(`update ${colId}`);
  return await updateDoc(doc(db, colId, id), { ...omitted })
    .then(() => {
      return value;
    })
    .catch((e) => {
      console.warn(e);
      return null;
    });
};

export const getDocumentsByIds = async <T>({
  db,
  ids,
  colId,
  buildValue,
}: {
  db: Firestore;
  ids: string[];
  colId: string;
  buildValue: (value: DocumentData) => T;
}): Promise<T[]> => {
  const values: T[] = [];
  await Promise.all(
    ids.map(async (id) => {
      console.log(`get doc ${colId}`);
      const result: T | null = await getDoc(doc(db, colId, id))
        .then((snapshot) => {
          if (snapshot.exists()) {
            return buildValue(snapshot);
          } else {
            return null;
          }
        })
        .catch((e) => {
          console.warn(e);
          return null;
        });
      if (!!result) {
        values.push(result);
      }
    })
  );
  return values;
};

export const batchUpdateDocuments = async <T extends { id: string }>({
  db,
  colId,
  values,
}: {
  db: Firestore;
  colId: string;
  values: T[];
}): Promise<boolean> => {
  const batch = writeBatch(db);
  for (const value of values) {
    const { id, ...omitted } = value;
    batch.update(doc(db, colId, id), { ...omitted });
  }
  console.log(`update docs ${colId}`);
  return await batch
    .commit()
    .then(() => {
      return true;
    })
    .catch((e) => {
      console.warn(e);
      return false;
    });
};

export const setDocument = async <T extends { id: string }>({
  db,
  colId,
  value,
}: {
  db: Firestore;
  colId: string;
  value: T;
}): Promise<T | null> => {
  const { id, ...omitted } = value;
  console.log(`set doc ${colId}.${id}`);
  return await setDoc(doc(db, colId, id), { ...omitted })
    .then(() => {
      return value;
    })
    .catch((e) => {
      console.warn(e);
      return null;
    });
};

export const addDocument = async <T extends { id: string }>({
  db,
  colId,
  value,
}: {
  db: Firestore;
  colId: string;
  value: Omit<T, 'id'>;
}): Promise<T | null> => {
  console.log(`add doc ${colId}`);
  return await addDoc(collection(db, colId), value)
    .then((doc) => {
      return { id: doc.id, ...value } as T;
    })
    .catch((e) => {
      console.warn(e);
      return null;
    });
};

export const batchAddDocuments = async <T extends { id: string }>({
  db,
  colId,
  values,
}: {
  db: Firestore;
  colId: string;
  values: Omit<T, 'id'>[];
}): Promise<string[]> => {
  const batch = writeBatch(db);
  const ids: string[] = [];
  for (const value of values) {
    const docRef = doc(collection(db, colId));
    ids.push(docRef.id);
    batch.set(docRef, value);
  }
  console.log(`set docs ${colId}`);
  return await batch
    .commit()
    .then(() => {
      return ids;
    })
    .catch((e) => {
      console.warn(e);
      return [];
    });
};

// ドキュメントの value フィールドの値を設定する（フィールド名固定）
export const setDocumenValue = async <T>({
  db,
  value,
  colId,
  docId,
}: {
  db: Firestore;
  colId: string;
  value: T;
  docId: string;
}): Promise<T | null> => {
  console.log(`set doc ${colId}`);
  return await setDoc(doc(db, colId, docId), { value })
    .then(() => {
      return value;
    })
    .catch((e) => {
      console.warn(e);
      return null;
    });
};

export const deleteDocument = async ({
  id,
  db,
  colId,
}: {
  id: string;
  db: Firestore;
  colId: string;
}): Promise<boolean> => {
  console.log(`delete doc ${colId}`);
  return await deleteDoc(doc(db, colId, id))
    .then(() => {
      return true;
    })
    .catch((e) => {
      console.warn(e);
      return false;
    });
};

export const batchDeleteDocuments = async ({
  db,
  ids,
  colId,
}: {
  db: Firestore;
  ids: string[];
  colId: string;
}): Promise<boolean> => {
  const batch = writeBatch(db);
  for (const id of ids) {
    batch.delete(doc(db, colId, id));
  }
  console.log(`delete docs ${colId}`);
  return await batch
    .commit()
    .then(() => {
      return true;
    })
    .catch((e) => {
      console.warn(e);
      return false;
    });
};
