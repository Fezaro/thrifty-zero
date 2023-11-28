// // import  {initializeTestApp} from '@firebase/rules-unit-testing';
// const firebaseTest = require('@firebase/rules-unit-testing');

// const MY_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
// const myAuth = {
//   uid: '1',
//   email: 'abc@gmail.com'
// }
// // describe('Category Page', () => {
// //   it('should allow read access to logged in user',async() =>{
// //     const db = firebaseTest.initializeTestApp({projectId: MY_PROJECT_ID, auth: myAuth}).firestore();
// //     const testDoc = db.collection('users').doc('user_123');
// //     await firebaseTest.assertSucceeds(testDoc.get());
// //   })
// // });
// beforeAll(async () => {
//   // Initialize the Firebase app before running any tests.
//   await firebaseTest.initializeTestApp({ projectId: MY_PROJECT_ID });
// });

// // Your test suite and cases go here.

// afterAll(async () => {
//   // Teardown or clean up any resources after the tests are done.
//   await firebaseTest.cleanup(); // Use appropriate cleanup function if necessary.
// });
// // write a test to check if there is category data fetched 
// describe('Category Page', () => {
//   it('Can get category data from ', async () => {
//     const myAuth = {
//       uid: "user_ABC",
//       email: "abc@gmail.com"
//     };
//     const db = firebaseTest.initializeTestApp({projectId: MY_PROJECT_ID}).firestore();
//     const testDoc = db.collection('users').doc('user_123');
//     await firebaseTest.assertSucceeds(testDoc.get());
//   })
// })

import { render, screen, waitFor } from "@testing-library/react";
import { getAllCategories } from "@/firebase/db";
import { data } from "autoprefixer";

// mock the api call using jest
// beforeAll(() => {
//   jest.spyOn(window, 'fetch').mockResolvedValue(
//     {
//       json: () => Promise.resolve({data: "test"})
//     }
//   );
//   });

  beforeAll(() => {
    jest.spyOn(window, 'fetch').mockResolvedValue(
      Promise.resolve(new Response(JSON.stringify({data: "test"})))
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });