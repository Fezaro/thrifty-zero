'use client'
import { auth } from '@/firebase/firebaseApp';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getUserByID } from '@/firebase/db';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStoreUserDataFetched } from '@/hooks/use-store-modal';



const SetupLayout = ({ children }: { children: React.ReactNode }) => {
  // const [userDataFetched, setUserDataFetched] = useState(false);
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const userDataFetched = useStoreUserDataFetched((state) => state.userDataFetched);
  const setUserDataFetched = useStoreUserDataFetched((state) => state.setUserDataFetched);

  useEffect(() => {
    if (user && !userDataFetched) {
      const fetchData = async () => {
        const data = await getUserData();
        if (data?.userID === user.uid) {
          router.push(`/${data.userID}`);
        } else {
          setUserDataFetched(true);
          // console.log("User data fetched(Setup): ", setUserDataFetched);
        }
      };

      fetchData();
    }
  }, [user, userDataFetched]);

  const getUserData = async () => {
    try {
      const data = await getUserByID(user!.uid);
      return data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  if (loading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    // return null;
  }

  console.log("User set data fetched: ", setUserDataFetched);
  

  console.log(".....returning frm sgnup layout....")

  return userDataFetched ? <>{children}</> : null;
};

export default SetupLayout;
