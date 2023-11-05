import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import {
  DocumentData,
  DocumentReference,
  FieldValue,
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuthContext } from './AuthProvider';
import { useCoupleContext } from './CoupleProvider';

type OutingProps = {
  id?: string;
  name: string;
  description: string;
  deleted: boolean;
  completed: boolean;
  mapUrl: string;
  tags: string[];
};

export type Outing = Omit<OutingProps, 'tags'> & {
  tags: DocumentReference[];
  createdAt: FieldValue;
  updatedAt: FieldValue;
};

type UpdateProps = {
  id: string;
  name?: string;
  description?: string;
  deleted?: boolean;
  completed?: boolean;
  mapUrl?: string;
  tags?: string[];
};

interface OutingsContextType {
  allTags: string[];
  outings: Outing[];
  getOuting: (id: string) => Promise<Outing | null>;
  getOutings: () => Promise<Outing[]>;
  addOuting: (outingData: OutingProps) => Promise<Outing | null>;
  updateOuting: (outingData: UpdateProps) => Promise<Outing | null>;
  deleteOuting: (id: string) => Promise<boolean>;
  completeOuting: (id: string) => Promise<boolean>;
  deleteTag: (id: string) => Promise<void>;
}

// Default values for contacts context
export const OutingsContext = createContext<OutingsContextType>({
  outings: [],
  allTags: [],
  getOuting: async () => null,
  getOutings: async () => [],
  addOuting: async () => null,
  updateOuting: async () => null,
  deleteOuting: async () => false,
  completeOuting: async () => false,
  deleteTag: async () => {},
});

export const OutingsProvider = ({ children }: { children: ReactNode }) => {
  const [outings, setOutings] = useState<Outing[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  const { currentUser } = useAuthContext();

  const { coupleId } = useCoupleContext();

  const coupleTagsId = `tags_${coupleId}`;
  const coupleOutingsId = `outings_${coupleId}`;

  async function getOuting(id: string) {
    if (!currentUser) return null;

    const outingRef = doc(db, coupleOutingsId, id); // Replace "outings" with the name of your collection

    try {
      const outingSnapshot = await getDoc(outingRef);
      if (outingSnapshot.exists()) {
        const {
          name,
          description,
          deleted,
          completed,
          mapUrl,
          tags,
          createdAt,
          updatedAt,
        } = outingSnapshot.data();
        const foundOuting: Outing = {
          id: outingSnapshot.id,
          name,
          description,
          deleted,
          completed,
          mapUrl,
          tags,
          createdAt,
          updatedAt,
        };
        return foundOuting;
      } else {
        console.error('Document does not exist.');
        return null;
      }
    } catch (error) {
      console.error('Error fetching document:', error);
      return null;
    }
  }

  // Function to get all outings
  async function getOutings() {
    if (!currentUser || !coupleId) return [];

    const outingsCollection = collection(db, coupleOutingsId);
    try {
      const queryRef = query(outingsCollection, orderBy('createdAt', 'desc'));
      const outingsSnapshot = await getDocs(queryRef);
      const outingsData: Outing[] = outingsSnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as Outing;
      });
      return outingsData as Outing[];
    } catch (error) {
      console.error('Error fetching outings:', error);
      return [];
    }
  }

  // TODO: Create a 'tag deletion' page
  const deleteTag = async (tagId: string) => {
    // Step 1: Identify the tag to delete
    const tagRef = doc(db, coupleTagsId, tagId);

    // Step 2: Query outings that reference the tag to delete.
    const outingsRef = collection(db, coupleOutingsId);
    const querySnapshot = await getDocs(
      query(outingsRef, where('tags', 'array-contains', tagRef))
    );

    try {
      // Step 3: Remove the tag reference from outings.
      await Promise.all(
        querySnapshot.docs.map((outingDoc) => {
          const updatedTags = outingDoc
            .data()
            .tags.filter(
              (tag: DocumentReference<DocumentData, DocumentData>) => tag.id !== tagRef.id
            );
          return updateDoc(outingDoc.ref, { tags: updatedTags });
        })
      );

      // Step 4: Delete the tag document itself.
      await deleteDoc(tagRef);
    } catch (error) {
      console.error(error);
    }
  };

  // Gets couple's colletion id strings
  //
  const saveOuting = async (outingData: OutingProps) => {
    if (!currentUser || !coupleId) return null;

    const tagsCollection = collection(db, coupleTagsId);
    const tagQuery = getDocs(tagsCollection);
    try {
      const tagSnapshot = await tagQuery;
      const tagRefs = await Promise.all(
        outingData.tags.map(async (tagId) => {
          const tagRef = doc(db, coupleTagsId, tagId);
          // Check if the tags exists. If it doesn't, create it.
          const tagExists = tagSnapshot.docs.some((doc) => doc.id === tagId);
          if (!tagExists) {
            // Use setDoc instead of add to specify the tag id
            await setDoc(tagRef, { name: tagId });
          }
          return tagRef;
        })
      );

      let outingRef: DocumentReference<DocumentData, DocumentData> | undefined;
      // Save the outing data + its tags
      if (!outingData.id) {
        const coupleOutingsCollection = collection(db, coupleOutingsId);
        const savedOuting = await addDoc(coupleOutingsCollection, {
          ...outingData,
          tags: tagRefs,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
        outingRef = doc(db, coupleOutingsId, savedOuting.id);
      } else {
        outingRef = doc(db, coupleOutingsId, outingData.id);
        await setDoc(outingRef, {
          ...outingData,
          tags: tagRefs,
          updatedAt: serverTimestamp(),
        });
      }

      // Re-fetch the outing to be used in local state
      const savedOutingSnapshot = await getDoc(outingRef);
      if (!savedOutingSnapshot.exists()) {
        throw new Error('Missing savedOutingSnapshot');
      }

      const savedOutingData = {
        id: savedOutingSnapshot.id,
        ...savedOutingSnapshot.data(),
      } as Outing;

      return savedOutingData;
    } catch (error) {
      console.error('Error checking document existence:', error);
      return null;
    }
  };

  const addOuting = async (outingData: OutingProps) => {
    if (!currentUser || !coupleOutingsId) return null;

    const savedOuting = await saveOuting(outingData);
    if (savedOuting) {
      setOutings((prev) => [savedOuting, ...prev]);
    }
    return savedOuting;
  };

  const updateOuting = async (outingData: UpdateProps) => {
    if (!currentUser || !coupleOutingsId) return null;

    const outingRef = doc(db, coupleOutingsId, outingData.id);
    const outingSnapshot = await getDoc(outingRef);
    if (!outingSnapshot.exists()) {
      return null;
    }

    const { name, description, mapUrl, tags, deleted, completed } = outingSnapshot.data();
    const savedOuting = await saveOuting({
      ...outingSnapshot.data(),
      id: outingData.id,
      name: outingData.name || name,
      description: outingData.description || description,
      mapUrl: outingData.mapUrl || mapUrl,
      tags: outingData.tags || tags.map(({ id }: { id: string }) => id),
      deleted: outingData.deleted || deleted,
      completed: outingData.completed || completed,
    });
    if (savedOuting) {
      setOutings((prev) => prev.map((o) => (o.id === outingData.id ? savedOuting : o)));
    }
    return savedOuting;
  };

  const deleteOuting = async (id: string) => {
    if (!currentUser) return false;

    const savedOuting = await updateOuting({ id, deleted: true });
    return !!savedOuting;
  };

  const completeOuting = async (id: string) => {
    if (!currentUser) return false;

    const savedOuting = await updateOuting({ id, completed: true });
    return !!savedOuting;
  };

  // Function to get all outings
  async function getAllTags() {
    if (!currentUser) return [];

    const tagsCollection = collection(db, coupleTagsId);
    try {
      const tagsSnapshot = await getDocs(tagsCollection);
      const tagsData: string[] = tagsSnapshot.docs.map((doc) => doc.id).sort();
      return tagsData;
    } catch (error) {
      console.error('Error fetching tags:', error);
      return [];
    }
  }

  useEffect(() => {
    if (!currentUser || !coupleId) return;

    getOutings().then((allOutings) => setOutings(allOutings));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, coupleId]);

  useEffect(() => {
    if (!currentUser) return;

    getAllTags().then((allTags) => setAllTags(allTags));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outings, currentUser]);

  return (
    <OutingsContext.Provider
      value={{
        outings,
        getOutings,
        getOuting,
        addOuting,
        updateOuting,
        deleteOuting,
        completeOuting,
        deleteTag,
        allTags,
      }}
    >
      {children}
    </OutingsContext.Provider>
  );
};

export const useOutingsContext = () => useContext(OutingsContext);
