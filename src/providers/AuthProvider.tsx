import { ReactNode, createContext, useContext, useState } from 'react';
import {
  User,
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '@/firebase';
import { useRouter } from 'next/router';

interface AuthContextType {
  user?: User;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<any>;
}

// Default values for context
export const AuthContext = createContext<AuthContextType>({
  user: undefined,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>();
  const router = useRouter();

  const login = async (email: string, password: string) =>
    setPersistence(auth, browserSessionPersistence)
      .then(() => signInWithEmailAndPassword(auth, email, password))
      .then(userCredential => {
        // Signed in
        const user = userCredential.user;
        setUser(user);
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error({ errorCode, errorMessage });
        return error;
      });

  const logout = () =>
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        router.push('/logout-successful');
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error({ errorCode, errorMessage });
        return error;
      });

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
