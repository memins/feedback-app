import React, { useState, useEffect, useContext, createContext } from 'react';
import Router from 'next/router';

import firebase from './firebase';

const authContext = createContext();

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleUser = async (rawUser) => {
    if (rawUser) {
      const user = await formatUser(rawUser);
      const { token, ...userWithoutToken } = user;

      setUser(user);

      setLoading(false);
      return user;
    } else {
      setUser(false);

      setLoading(false);
      return false;
    }
  };

  const signinWithEmail = (email, password) => {
    setLoading(true);
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        handleUser(response.user);
        Router.push('/sites');
      });
  };

  const signinWithGitHub = (redirect) => {
    setLoading(true);
    return firebase
      .auth()
      .signInWithPopup(new firebase.auth.GithubAuthProvider())
      .then((response) => {
        handleUser(response.user);

        if (redirect) {
          Router.push(redirect);
        }
      });
  };

  const signinWithGoogle = (redirect) => {
    setLoading(true);
    return firebase
      .auth()
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((response) => {
        handleUser(response.user);

        if (redirect) {
          Router.push(redirect);
        }
      });
  };

  const signout = () => {
    Router.push('/');

    return firebase
      .auth()
      .signOut()
      .then(() => handleUser(false));
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onIdTokenChanged(handleUser);

    return () => unsubscribe();
  }, []);

  return {
    user,
    loading,
    signinWithEmail,
    signinWithGitHub,
    signinWithGoogle,
    signout
  };
}

const getStripeRole = async () => {
  await firebase.auth().currentUser.getIdToken(true);
  const decodedToken = await firebase.auth().currentUser.getIdTokenResult();

  return decodedToken.claims.stripeRole || 'free';
};

const formatUser = async (user) => {
  const token = await user.getIdToken();
  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    provider: user.providerData[0].providerId,
    photoUrl: user.photoURL,
    stripeRole: await getStripeRole(),
    token
  };
};
