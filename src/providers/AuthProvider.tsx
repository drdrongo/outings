import { ReactNode, createContext, useContext, useState } from 'react';
import {
  User,
  browserSessionPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '@/firebase';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<any>;
}

// Default values for context
export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  onAuthStateChanged(auth, (user) => {
    if (currentUser === user) return;

    setCurrentUser(user);
  });

  const login = async (email: string, password: string) =>
    setPersistence(auth, browserSessionPersistence)
      .then(() => signInWithEmailAndPassword(auth, email, password))
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error({ errorCode, errorMessage });
        return error;
      });

  const logout = () =>
    signOut(auth).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error({ errorCode, errorMessage });
      return error;
    });

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
