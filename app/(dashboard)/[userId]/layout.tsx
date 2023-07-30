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


    console.log(params.userId);
    const userDataFetched = useStoreUserDataFetched((state) => state.userDataFetched);

    console.log("userDataFetched State:", userDataFetched);
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





// // 'use client';
// import { useRouter } from 'next/navigation';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { getUserByID } from '@/firebase/db';
// import { useState, useEffect } from 'react';
// import { auth } from '@/firebase/firebaseApp';

// const useUserRedirect = (userId:string) => {
//   const router = useRouter();
//   const [userDataFetched, setUserDataFetched] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const data = await getUserData(userId);
//         if (data?.userID === userId) {
//           router.push(`/${data.userID}`);
//         } else {
//           setUserDataFetched(true);
//         }
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       }
//     };

//     if (userId) {
//       fetchData();
//     }
//   }, [userId, router]);

//   const getUserData = async (userId: string) => {
//     const data = await getUserByID(userId);
//     return data;
//   };

//   return userDataFetched;
// };

// const DashboardLayout = ({ children, params }: {
//   children: React.ReactNode,
//   params: { userId: string }
// }) => {
//   const [user, loading, error] = useAuthState(auth);
//   const userDataFetched = useUserRedirect(params.userId);

//   if (loading) {
//     return (
//       <div>
//         <p>Initialising User...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div>
//         <p>Error: {error.message}</p>
//       </div>
//     );
//   }

//   if (!user) {
//     const router = useRouter();
//     router.push('/login');
//     return null;
//   }

//   // The user is logged in, and user data has been fetched
//   return userDataFetched ? <>{children}</> : null;
// };

// export default DashboardLayout;