'use client';

import { redirect } from 'next/navigation';
// import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/firebaseApp';
import { signOut } from 'firebase/auth';
import { useAuthProvider } from '@/hooks/AuthProvider';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import { useStoreUserDataFetched } from '@/hooks/use-store-modal';

// **Do not use async func as a main component

export default function DashboardLayout({ children, params }: {
  children: React.ReactNode
  params: { userId: string }

}) {
  try {
    const router = useRouter();
    // const userId = router.query.userId;


    // console.log(params.userId);
    const userDataFetched = useStoreUserDataFetched((state) => state.userDataFetched);

    // console.log("userDataFetched State:", userDataFetched);
    //Get user
    const { user, loading, error } = useAuthProvider();

    // console.log(user);



    if (loading) {
      return (
        <div>
          <p>Initialising User...</p>
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
      console.log('redirecting to login');
      return null

    }

    return (
      <div>
        <Navbar />
         {/* TODO: cLEAN UP THIS CODE */}
        {/* <p>Current user: {user?.email}</p> */}
        {/* <button onClick={logout}>Sign out</button> */}
        {children}
      </div>

    );
  }
  catch (error) {
    console.log(error)
  }

}


// export default DashboardLayout;