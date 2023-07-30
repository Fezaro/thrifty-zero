import { initializeApp } from "firebase/app";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  where,
  query,
  updateDoc, serverTimestamp,
  DocumentSnapshot, DocumentReference, FirestoreDataConverter, DocumentData
} from "firebase/firestore";
import { db, auth } from "./firebaseApp";
import { onAuthStateChanged } from "firebase/auth";
import { NextResponse } from "next/server";


// Define types for the data
export interface User {
  name: string;
  email: string;
  isSeller: boolean;
  createdAt: any;
  updatedAt: any;
  userID: string;
  isActive: boolean;
  phoneNumber: string;
}

interface Seller {
  userID: string; // Reference to Users collection
  shopName: string;
  shopProfileImageURL: string;
  location: string;
  bio: string;
  createdAt: Date;
  instagramURL: string;
  instagramUsername: string;
  instagramImported: boolean;
  isActive: boolean;
}

interface Listing {
  title: string;
  description: string;
  price: number;
  category: string;
  imageURLs: string[];
  sellerID: string; // Reference to Sellers collection
  createdAt: Date;
  isAvailable: boolean;
  listingURL: string;
  contactPhoneNumber: string;
  reasonForSelling: string;
  durationUsed: string;
  pickUpLocation: string;
}

interface Category {
  name: string;
  isActive: boolean;
}

// Add a new user to the Users collection
// Add a new user to the Users collection
export const addUser = async (
  isSeller: boolean,
  name: string,
  phoneNumber: string,
  userID: string,
  email: string,
) => {
  // Check if a user is logged in
  // const currentUser = auth.currentUser;

  // if (!currentUser) {
  //   console.error("User is not logged in.");
  //   return;
  // }

  // Create a new User object with the data from the form and the logged-in User object
  const newUser: User = {
    userID: userID,
    name,
    email: email || "",
    isSeller, // Use the provided isSeller value
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    isActive: true,
    phoneNumber,
  };

  // Add the user to the Users collection
  try {
    const userRef = doc(collection(db, "Users"), userID);

    await setDoc(userRef, newUser);
    console.log("User added to Firestore");
    console.log(newUser);


  } catch (error) {
    console.log("Error adding user to Firestore: ", error);

  }
};



// Add a new seller to the Sellers collection
export const addSeller = async (seller: Seller) => {
  const sellerRef = doc(collection(db, "Sellers"), seller.userID); // Use the userID as the document ID
  await setDoc(sellerRef, seller);
};


// Add a new listing to the Listings collection
export const addListing = async (listingID: string, listing: Listing) => {
  const listingRef = doc(collection(db, "Listings"), listingID);
  await setDoc(listingRef, listing);
};

// Add a new category to the Categories collection
export const addCategory = async (categoryID: string, category: Category) => {
  const categoryRef = doc(collection(db, "Categories"), categoryID);
  await setDoc(categoryRef, category);
};

// deactivate a user fom the Users collection
export const deactivateUser = async (userID: string) => {
  const userRef = doc(collection(db, "Users"), userID);
  await setDoc(userRef, { isActive: false }, { merge: true });
}

// deactivate a seller fom the Sellers collection
export const deactivateSeller = async (sellerID: string) => {
  const sellerRef = doc(collection(db, "Sellers"), sellerID);
  await setDoc(sellerRef, { isActive: false }, { merge: true });
}

// deactivate a listing fom the Listings collection
export const deactivateListing = async (listingID: string) => {
  const listingRef = doc(collection(db, "Listings"), listingID);
  await setDoc(listingRef, { isAvailable: false }, { merge: true });
}

//deaactivate a category from the Categories collection
export const deactivateCategory = async (categoryID: string) => {
  const categoryRef = doc(collection(db, "Categories"), categoryID);
  await setDoc(categoryRef, { isActive: false }, { merge: true });
}

// Get all listings from the Listings collection
export const getListings = async () => {
  try {
    const listingsSnapshot = await getDocs(collection(db, "Listings"));
    const listings = listingsSnapshot.docs.map((doc) => doc.data());
    return listings;
  } catch (error) {
    console.error("Error fetching listings:", error);
    return [];
  }
}

// Get all categories from the Categories collection
export const getCategories = async () => {
  try {
    const categoriesSnapshot = await getDocs(collection(db, "Categories"));
    const categories = categoriesSnapshot.docs.map((doc) => doc.data());
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// get the category id by name
export const getCategoryIDByName = async (categoryName: string) => {
  try {
    const categoryQuery = query(collection(db, "Categories"), where("name", "==", categoryName));
    const categorySnapshot = await getDocs(categoryQuery);
    if (!categorySnapshot.empty) {
      // Assuming there is only one category with the given name, so we get the first document
      const categoryDoc = categorySnapshot.docs[0];
      return categoryDoc.id;
    } else {
      return null; // Category with the given name not found
    }
  } catch (error) {
    console.error("Error fetching category by name:", error);
    return null;
  }
};

// get the user data by user id
// export const getUserByID = async (userID: string) => {
//   try {
//     const userRef: DocumentReference<User> = doc(db, "Users", userID);
//     const userSnapshot: DocumentSnapshot<User> = await getDoc(userRef);
//     if (userSnapshot.exists()) {
//       return userSnapshot.data();
//     } else {
//       console.error("User not found.");
//       return null;
//     }
//   } catch (error) {
//     console.error("Error fetching user data:", error);
//     return null;
//   }
// }
const userConverter: FirestoreDataConverter<User> = {
  toFirestore: (user: User) => ({ ...user }), // Convert User object to Firestore data
  fromFirestore: (snapshot: DocumentSnapshot<DocumentData>): User => snapshot.data() as User,
} // Type assertion to convert Firestore data to User object;

export const getUserByID = async (userID: string): Promise<User | null> => {
  try {
    const userRef: DocumentReference<User> = doc(db, "Users", userID).withConverter(userConverter); // Provide the converter
    const userSnapshot: DocumentSnapshot<User> = await getDoc(userRef); // Explicitly provide the generic type argument
    if (userSnapshot.exists()) {
      return userSnapshot.data();
    } else {
      console.error("User not found.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

// search for listings by title, category, or description
export const searchListings = async (keyword: string) => {
  try {
    const listingsRef = collection(db, "Listings");
    const q = query(
      listingsRef,
      where("title", "array-contains", keyword),
      where("description", "array-contains", keyword),
      where("category", "==", keyword)
    );

    const querySnapshot = await getDocs(q);
    const listings = querySnapshot.docs.map((doc) => doc.data());
    return listings;
  } catch (error) {
    console.error("Error searching listings:", error);
    return [];
  }
}

// update a listing in the Listings collection
export const updateListing = async (listingID: string, updatedListing: Partial<Listing>) => {
  try {
    // Filter out any fields that should not be updated (e.g., listingID)
    const filteredData = {
      title: updatedListing.title,
      description: updatedListing.description,
      price: updatedListing.price,
      category: updatedListing.category,
      imageURLs: updatedListing.imageURLs,
      createdAt: updatedListing.createdAt,
      isAvailable: updatedListing.isAvailable,
      contactPhoneNumber: updatedListing.contactPhoneNumber,
      reasonForSelling: updatedListing.reasonForSelling,
      durationUsed: updatedListing.durationUsed,
      pickUpLocation: updatedListing.pickUpLocation,
    };

    const listingRef = doc(db, "Listings", listingID);
    await updateDoc(listingRef, filteredData);

  }
  catch (error) {
    console.error("Error updating listing:", error);
  }
}

// update a category in the Categories collection
export const updateCategory = async (categoryID: string, category: Category) => {
  try {
    const filterData = {
      name: category.name
    };
    const categoryRef = doc(db, "Categories", categoryID);
    await updateDoc(categoryRef, filterData);
  }
  catch (error) {
    console.error("Error updating category:", error);
  }
}

// update a user role in the Users collection
export const updateUserRole = async (userID: string, newRole: string) => {
  try {
    const userRef = doc(db, "Users", userID);
    // filter out fields that should not be updated (e.g., userID)
    const filteredData = {
      role: newRole,
    };
    await updateDoc(userRef, filteredData);
  } catch (error) {
    console.error("Error updating user role:", error);
  }
}

// update a user phone number in the Users collection
export const updateUserPhoneNumber = async (userID: string, newPhoneNumber: string) => {
  try {
    const userRef = doc(db, "Users", userID);
    // filter out fields that should not be updated (e.g., userID)
    const filteredData = {
      phoneNumber: newPhoneNumber,
    };
    await updateDoc(userRef, filteredData);
  } catch (error) {
    console.error("Error updating user phone number:", error);
  }
}

// update a seller in the Sellers collection
export const updateSeller = async (sellerID: string, dataToUpdate: Partial<Seller>) => {
  try {
    const sellerRef = doc(db, "Sellers", sellerID);

    // Filter out any fields that should not be updated (e.g., sellerID)
    const filteredData = {
      shopName: dataToUpdate.shopName,
      shopProfileImageURL: dataToUpdate.shopProfileImageURL,
      location: dataToUpdate.location,
      bio: dataToUpdate.bio,
      createdAt: dataToUpdate.createdAt,
      instagramURL: dataToUpdate.instagramURL,
      instagramUsername: dataToUpdate.instagramUsername,
      instagramImported: dataToUpdate.instagramImported,
      isActive: dataToUpdate.isActive,
    };

    await updateDoc(sellerRef, filteredData);
  } catch (error) {
    console.error("Error updating seller:", error);
  }
}