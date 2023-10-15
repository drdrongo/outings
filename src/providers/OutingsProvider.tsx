import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import {
  DocumentReference,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import { db } from '@/firebase';
import { uuid } from '@/utils/uuid';
import { useAlertContext } from './AlertProvider';
import { useAuthContext } from './AuthProvider';

type OutingProps = {
  name: string;
  description: string;
  deleted: boolean;
  completed: boolean;
  mapUrl: string;
  tags: string[];
};

export type Outing = Omit<OutingProps, 'tags'> & {
  id: string;
  tags: DocumentReference[];
};

interface OutingsContextType {
  allTags: string[];
  outings: Outing[];
  loading: boolean;
  getOuting: (id: string) => Promise<Outing | null>;
  getOutings: () => Promise<Outing[]>;
  addOuting: (outingData: OutingProps) => Promise<Outing | null>;
  updateOuting: (id: string, outingData: OutingProps) => Promise<Outing | null>;
  deleteOuting: (id: string) => Promise<boolean>;
}

// Get the alert message parameters
const getAlertMsg = (succ: boolean, method: 'add' | 'upd' | 'del') => {
  const severity = succ ? 'success' : 'error';
  const methodWord = method === 'add' ? 'create' : method === 'upd' ? 'update' : 'delete';
  const label = succ ? `Outing ${methodWord}d` : `Failed to ${methodWord} outing`;
  return { severity, label };
};

// Default values for contacts context
export const OutingsContext = createContext<OutingsContextType>({
  outings: [],
  allTags: [],
  loading: false,
  getOuting: async () => null,
  getOutings: async () => [],
  addOuting: async () => null,
  updateOuting: async () => null,
  deleteOuting: async () => false,
});

export const OutingsProvider = ({ children }: { children: ReactNode }) => {
  const [outings, setOutings] = useState<Outing[]>([]);
  const [loading, setLoading] = useState(false);
  const [allTags, setAllTags] = useState<string[]>([]);
  const { addAlert } = useAlertContext();

  const { currentUser } = useAuthContext();

  // const getOuting = (id: string) => outings.find((row) => row.id === id);
  async function getOuting(id: string) {
    if (!currentUser) return null;

    const outingRef = doc(db, 'outings', id); // Replace "outings" with the name of your collection

    try {
      const outingSnapshot = await getDoc(outingRef);
      if (outingSnapshot.exists()) {
        const outingData = outingSnapshot.data();
        const foundOuting: Outing = {
          id: outingSnapshot.id,
          name: outingData.name,
          description: outingData.description,
          deleted: outingData.deleted,
          completed: outingData.completed,
          mapUrl: outingData.mapUrl,
          tags: outingData.tags,
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
    if (!currentUser) return [];

    const outingsCollection = collection(db, 'outings');

    try {
      const outingsSnapshot = await getDocs(outingsCollection);
      const outingsData: Outing[] = outingsSnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as Outing;
      });
      return outingsData as Outing[];
    } catch (error) {
      console.error('Error fetching outings:', error);
      return [];
    }
  }

  const saveOuting = async (id: string, outingData: OutingProps) => {
    if (!currentUser) return null;

    const tagsCollection = collection(db, 'tags');
    const tagQuery = getDocs(tagsCollection);
    try {
      const tagSnapshot = await tagQuery;
      const tagRefs = await Promise.all(
        outingData.tags.map(async (tagId) => {
          const tagRef = doc(db, `/tags/${tagId}`);
          const tagExists = tagSnapshot.docs.some((doc) => doc.id === tagId);
          if (!tagExists) {
            // Use setDoc to specify the tag id
            await setDoc(tagRef, { name: tagId });
          }
          return tagRef;
        })
      );
      const outingRef = doc(db, `/outings/${id}`);
      await setDoc(outingRef, { ...outingData, id, tags: tagRefs });

      const updatedOutingSnapshot = await getDoc(outingRef);
      if (!updatedOutingSnapshot.exists()) {
        throw new Error('Missing updatedOutingSnapshot');
      }

      const updatedOutingData = updatedOutingSnapshot.data() as Outing;
      return updatedOutingData;
    } catch (error) {
      console.error('Error checking document existence:', error);
      return null;
    }
  };

  const addOuting = async (outingData: OutingProps) => {
    if (!currentUser) return null;

    setLoading(true);
    const id = uuid();
    const savedOuting = await saveOuting(id, outingData);
    if (savedOuting) {
      setOutings((prev) => [...prev, savedOuting]);
    }
    addAlert(getAlertMsg(!!savedOuting, 'add'));
    setLoading(false);
    return savedOuting;
  };

  const updateOuting = async (id: string, outingData: OutingProps) => {
    if (!currentUser) return null;

    setLoading(true);
    const savedOuting = await saveOuting(id, outingData);
    if (savedOuting) {
      setOutings((prev) => prev.map((o) => (o.id === id ? savedOuting : o)));
    }
    addAlert(getAlertMsg(!!savedOuting, 'upd'));
    setLoading(false);
    return savedOuting;
  };

  const deleteOuting = async (id: string) => {
    if (!currentUser) return false;

    setLoading(true);
    const outingToDelete = outings.find((outing) => outing.id === id);

    if (!outingToDelete) {
      addAlert(getAlertMsg(false, 'del'));
      setLoading(false);
      return false;
    }

    const savedOuting = await saveOuting(id, {
      ...{
        ...outingToDelete,
        tags: outingToDelete.tags.map((tag) => tag.id),
      },
      deleted: true,
    });
    if (savedOuting) {
      setOutings((prev) => prev.map((o) => (o.id === id ? savedOuting : o)));
    }
    addAlert(getAlertMsg(!!savedOuting, 'del'));
    setLoading(false);
    return !!savedOuting;
  };

  // Function to get all outings
  async function getAllTags() {
    if (!currentUser) return [];

    const tagsCollection = collection(db, 'tags');
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
    if (!currentUser) return;

    getOutings().then((allOutings) => setOutings(allOutings));
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    getAllTags().then((allTags) => setAllTags(allTags));
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
        loading,
        allTags,
      }}
    >
      {children}
    </OutingsContext.Provider>
  );
};

export const useOutingsContext = () => useContext(OutingsContext);
