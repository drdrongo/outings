import React, { useState } from 'react';
import { User, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';

const Login = () => {
  const email = 'hayatoclarke@gmail.com';
  const password = 'ericajulie';
  const [user, setUser] = useState<User>();

  const handleLogin = async (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        // Signed in
        const user = userCredential.user;
        setUser(user);
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  return (
    <div>
      <h1>Login</h1>

      <p>{JSON.stringify(user)}</p>

      <button onClick={() => handleLogin(email, password)}>Login with Google</button>
    </div>
  );
};

export default Login;
