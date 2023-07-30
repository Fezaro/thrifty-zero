// AuthProvider.tsx (or a custom hook)
'use client'

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/firebaseApp';
import { createContext, useContext } from 'react';
import { AuthError, User } from 'firebase/auth';

// Define the user context
type UserContextValue = {
  user: User | null | undefined; 
  loading: boolean;
  error: Error | null | undefined;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

// Create the context
export const UserContext = createContext<UserContextValue | undefined>(undefined);

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, loading, error] = useAuthState(auth);

  // Store the user state in the context
  const userContextValue: UserContextValue = {
    user,
    loading,
    error,
  };

  return <UserContext.Provider value={userContextValue}>{children}</UserContext.Provider>;
};

// Custom hook to use the UserContext
export const useAuthProvider = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useAuthProvider must be used within an AuthProvider.');
  }
  return context;
};



// export function useAuthProvider() {
//   const [user, loading, error] = useAuthState(auth);

//   return { user, loading, error };
// }
