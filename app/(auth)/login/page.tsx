"use client";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import { Button } from "@/components/ui/button";

import { auth } from "@/firebase/firebaseApp";
import StyledFirebaseAuth from "../../../components/StyledFirebaseAuth";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useAuthProvider } from "@/hooks/AuthProvider";

const uiConfig = {
  signInFlow: "popup",
  signInSuccessUrl: "/",
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
};

const SignInScreen = () => {
  const { user, loading, error } = useAuthProvider();

  if (loading) {
    return (
      <div className="flex justify-center items-center  h-screen">
        <Card className="p-10">
          <CardTitle>My App</CardTitle>
          <CardContent>
            <p>Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Card className="p-8 ">
          <CardTitle className="text-center text-2xl font-bold mb-4">Thrifty G Marketplace</CardTitle>
          <p>Error: {error.message}</p>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center  h-screen">
        <Card className="p-10">
          <CardTitle className="text-center text-2xl font-bold mb-4">Thrifty G Marketplace</CardTitle>
          <CardContent>
            <p className="text-center mb-6"> Please Sign In or Sign Up using your Email or Gmail.  </p>
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
          </CardContent>
        </Card>
      </div>
    );
  }

  // TODO: cLEAN UP THIS CODE
  // return (
  //   <div className="flex justify-center items-center h-screen">
  //     <Card className="p-8">
  //       <CardTitle>My App</CardTitle>
  //       <p>Welcome {user?.displayName}! You are now signed-in!</p>
  //       <p>userID: {user?.uid}</p>
  //       <p>email: {user?.email}</p>
  //       <Button onClick={() => auth.signOut()}>Sign-out</Button>
  //     </Card>
  //   </div>
  // );
};

export default SignInScreen;
