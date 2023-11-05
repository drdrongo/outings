import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import {
  DocumentReference,
  collection,
  doc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '@/firebase';
import { useAlertContext } from './AlertProvider';
import { useAuthContext } from './AuthProvider';

type Couple = {
  id: string;
  user1: DocumentReference;
  user2: DocumentReference;
};

interface CoupleContextType {
  coupleId: string | null;
  getCoupleId: () => Promise<string | null>;
}

// Default values for contacts context
export const CoupleContext = createContext<CoupleContextType>({
  coupleId: null,
  getCoupleId: async () => null,
});

export const CoupleProvider = ({ children }: { children: ReactNode }) => {
  const [couple, setCouple] = useState<Couple | null>(null);

  const [coupleId, setCoupleId] = useState<string | null>(null);

  const { addAlert } = useAlertContext();

  const { currentUser } = useAuthContext();

  async function getCoupleId() {
    if (!currentUser) return null;

    try {
      const userReference = doc(db, 'users', currentUser.uid);
      const couplesCollection = collection(db, 'couples');
      let queryRef = query(couplesCollection, where('user1', '==', userReference));
      let querySnapshot = await getDocs(queryRef);
      if (querySnapshot.empty) {
        // No documents found in the first query, try the second query
        queryRef = query(couplesCollection, where('user2', '==', userReference));
        querySnapshot = await getDocs(queryRef);
      }

      if (querySnapshot.empty) {
        console.error('No matching document found.');
        return null;
      }

      const coupleDoc = querySnapshot.docs[0];
      return coupleDoc.id;
    } catch (error) {
      console.error('Error fetching outings:', error);
      return null;
    }
  }

  useEffect(() => {
    (async () => {
      const coupleId = await getCoupleId();
      setCoupleId(coupleId);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  return (
    <CoupleContext.Provider value={{ coupleId, getCoupleId }}>
      {children}
    </CoupleContext.Provider>
  );
};

export const useCoupleContext = () => useContext(CoupleContext);
