import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  where,
  query,
  updateDoc, serverTimestamp,
  DocumentSnapshot, DocumentReference,
  FirestoreDataConverter, DocumentData,
  QueryDocumentSnapshot,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "./firebaseApp";




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

export interface Seller {
  userID: string; // Reference to Users collection
  shopName: string;
  shopProfileImageURL: string | null;
  location: string;
  bio: string;
  createdAt: any;
  updatedAt: any;
  instagramURL: string;
  instagramUsername: string;
  instagramImported: boolean;
  isActive: boolean;
}

export interface Listing {
  title: string;
  description: string;
  price: number;
  category: string;
  imageURLs: { }[];
  sellerID: string; // Reference to Sellers collection
  createdAt: any;
  updatedAt: any;
  isActive: boolean;
  listingURL: string;
  contactPhoneNumber: string;
  reasonForSelling: string;
  durationUsed: string;
  pickUpLocation: string;
  listingId: string;
}

export interface Category {
  categoryId:string;
  name: string;
  isActive: boolean;
}

export interface SellerListing {
  sellerId: string;
  listingId: string;
}

// Add a new user to the Users collection
export const addUser = async (
  isSeller: boolean,
  name: string,
  phoneNumber: string,
  userID: string,
  email: string,
) => {
 

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
export const addSeller = async (
  userID: string,
  sellerData: Partial<Seller>
) => {
  // Check if a user is logged in
  const currentUser = auth.currentUser;

  if (!currentUser) {
    console.error("User is not logged in.");
    return;
  }
  if (!sellerData) {
    console.error("No seller data provided.");
    return;
  }

  // Create a new Seller object with the data from the form and the logged-in User object
  const newSeller: Seller = {
    userID: userID,
    shopName: sellerData.shopName || "",
    shopProfileImageURL: sellerData.shopProfileImageURL || null,
    location: sellerData.location || "",
    bio: sellerData.bio || "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    instagramURL: sellerData.instagramURL || "",
    instagramUsername: sellerData.instagramUsername || "",
    instagramImported: false,
    isActive: true,
  };

  // Add the seller to the Sellers collection
  try {
    const sellerRef = doc(collection(db, "Sellers"), userID);

    await setDoc(sellerRef, newSeller);
    console.log("Seller added to Firestore");
    return newSeller;
  } catch (error) {
    console.log("Error adding seller to Firestore: ", error);
  }
};


// Add a new listing to the Listings collection
export const addListing = async (
  listingData: Partial<Listing>,
  sellerID: string
) => {

  if (!listingData) {
    console.error("No listing data provided.");
    return;
  }

  // Create a new Listing object with the data from the form and the logged-in User object
  const newListing: Listing = {
    title: listingData.title || "",
    description: listingData.description || "",
    price: listingData.price || 0,
    category: listingData.category || "",
    imageURLs: listingData.imageURLs || [],
    sellerID: sellerID,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    isActive: true,
    listingURL: listingData.listingURL || "",
    contactPhoneNumber: listingData.contactPhoneNumber || "",
    reasonForSelling: listingData.reasonForSelling || "",
    durationUsed: listingData.durationUsed || "",
    pickUpLocation: listingData.pickUpLocation || "",
    listingId: listingData.listingId || "",
  };

  // Add the listing to the Listings collection
  try {
    const listingRef = doc(collection(db, "Listings"));

    //get the listing id
    const listingId = listingRef.id;
    console.log("Listing ID: ", listingId);
    
    // Update the listingURL using the listingId
    // Update the listingURL by replacing "new" with the listingId
    const updatedListingURL = newListing.listingURL.replace("new", listingId);
    // Update the listing with the correct listingURL
    const updatedListing: Listing = {
      ...newListing,
      listingURL: updatedListingURL,
      listingId: listingId,
    };
    
    await setDoc(listingRef, updatedListing);
    //create a seller listing relationship
    await createSellerListingRelationship(sellerID, listingId);

    console.log("Listing added to Firestore");
    return newListing;
  } catch (error) {
    console.log("Error adding listing to Firestore: ", error);
  }
};


// Function to create a new seller listing relationship document
const createSellerListingRelationship = async (sellerId:string, listingId:string) => {
  try {
    const docRef = await addDoc(collection(db, 'SellerListings'), {
      sellerId: sellerId,
      listingId: listingId,
    });
    

    console.log('Seller Listing Relationship Document added with ID: ', docRef.id);
  } catch (error) {
    console.error('Error adding Seller Listing Relationship Document: ', error);
  }
};


// Add a new category to the Categories collection with a unique categoryId
// Function to add a new category to the Categories collection
export const addCategory = async (
  categoryData: Partial<Category>,
  // sellerId: string,
) => {
  // Check if a user is logged in
  // const currentUser = auth.currentUser;
  // if (!currentUser) {
  //   console.error("User is not logged in.");
  //   return;
  // }
  if (!categoryData) {
    console.error("No category data provided.");
    return;
  }

  const categoryName = categoryData.name?.toLowerCase();;
  // Check if a category with the same lowercase name already exists
  const existingCategoryQuery = query(collection(db, "Categories"), where("nameLower", "==", categoryName));
  const existingCategories = await getDocs(existingCategoryQuery);
  if (!existingCategories.empty) {
    console.error("Category with the same name already exists.");
    return;
  }

  // Create a new Category object with the data from the form and the logged-in User object
  const newCategory: Partial<Category> = {
    name: categoryName || "",
    isActive: categoryData.isActive || false,
  };

  // Add the category to the Categories collection
  try{
    // generate a new unique ID for the category
    const categoryRef = doc(collection(db, "Categories"));
    const categoryId = categoryRef.id;
    console.log("Category ID generated: ", categoryId);
    // add the category Id to the category object
    newCategory.categoryId = categoryId;

    // add the category to the Categories collection
    await setDoc(categoryRef, newCategory);

    console.log("Category added to Firestore");
    return newCategory; 
  }
  catch (error) {
    console.log("Error adding category to Firestore: ", error);
  }
};

// update a category in the Categories collection

      
// TODO: cLEAN UP THIS CODE
// // deactivate a user fom the Users collection
// export const deactivateUser = async (userID: string) => {
//   const userRef = doc(collection(db, "Users"), userID);
//   await setDoc(userRef, { isActive: false }, { merge: true });
// }

// // deactivate a seller fom the Sellers collection
// export const deactivateSeller = async (sellerID: string) => {
//   const sellerRef = doc(collection(db, "Sellers"), sellerID);
//   await setDoc(sellerRef, { isActive: false }, { merge: true });
// }

// // deactivate a listing fom the Listings collection
// export const deactivateListing = async (listingID: string) => {
//   const listingRef = doc(collection(db, "Listings"), listingID);
//   await setDoc(listingRef, { isAvailable: false }, { merge: true });
// }

// //deaactivate a category from the Categories collection
// export const deactivateCategory = async (categoryID: string) => {
//   const categoryRef = doc(collection(db, "Categories"), categoryID);
//   await setDoc(categoryRef, { isActive: false }, { merge: true });
// }

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


// Implement the Firestore DataConverter for User
export const userConverter: FirestoreDataConverter<User> = {
  toFirestore(user: User): DocumentData {
    // Convert the User object to Firestore data
    return {
      name: user.name,
      email: user.email,
      isSeller: user.isSeller,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      userID: user.userID,
      isActive: user.isActive,
      phoneNumber: user.phoneNumber,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): User {
    // Convert Firestore data to the User object
    const data = snapshot.data();
    return {
      name: data.name,
      email: data.email,
      isSeller: data.isSeller,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      userID: data.userID,
      isActive: data.isActive,
      phoneNumber: data.phoneNumber,
    };
  },
};

// get User data by user id

// Helper function to convert serverTimestamp to date format
function convertServerTimestampToDate(data: any): any {
  if (!data || typeof data !== 'object') return data;

  if (data.hasOwnProperty('serverTimestamp')) {
    return new Date(data.serverTimestamp.seconds * 1000); // Convert serverTimestamp to Date format
  }

  // Handle nested objects or arrays
  if (Array.isArray(data)) {
    return data.map((item) => convertServerTimestampToDate(item));
  } else {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, convertServerTimestampToDate(value)])
    );
  }
}

export const getUserByID = async (userID: string): Promise<User | null> => {
  try {
    const userRef: DocumentReference<User> = doc(db, 'Users', userID).withConverter(userConverter); // Provide the converter
    const userSnapshot: DocumentSnapshot<User> = await getDoc(userRef); // Explicitly provide the generic type argument
    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      return convertServerTimestampToDate(userData); // Convert serverTimestamps in the user data
    } else {
      console.error('User not found.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

// Implement the Firestore DataConverter for seller
export const sellerConverter: FirestoreDataConverter<Seller> = {
  toFirestore(seller: Seller): DocumentData {
    // Convert the seller object to Firestore data
    return {
      userID: seller.userID,
      shopName: seller.shopName,
      shopProfileImageURL: seller.shopProfileImageURL,
      location: seller.location,
      bio: seller.bio,
      createdAt: seller.createdAt,
      updatedAt: seller.updatedAt,
      instagramURL: seller.instagramURL,
      instagramUsername: seller.instagramUsername,
      instagramImported: seller.instagramImported,
      isActive: seller.isActive,
    }},
    fromFirestore(snapshot: QueryDocumentSnapshot): Seller {
      // Convert Firestore data to the seller object
      const data = snapshot.data();
      return {
        userID: data.userID,
        shopName: data.shopName,
        shopProfileImageURL: data.shopProfileImageURL,
        location: data.location,
        bio: data.bio,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        instagramURL: data.instagramURL,
        instagramUsername: data.instagramUsername,
        instagramImported: data.instagramImported,
        isActive: data.isActive,
      };
    },
  };

    // get seller data by seller id
    export const getSellerByID = async (sellerID: string) => {
      try {
        const sellerRef: DocumentReference<Seller> = doc(db, "Sellers", sellerID).withConverter(sellerConverter);
        const sellerSnapshot: DocumentSnapshot<Seller> = await getDoc(sellerRef);
        if (sellerSnapshot.exists()) {
          const sellerData = sellerSnapshot.data();
          return convertServerTimestampToDate(sellerData); // Convert serverTimestamps in the seller data
          
        } else {
          console.error("Seller not found.");
          return null;
        }
      } catch (error) {
        console.error("Error fetching seller data:", error);
        return null;
      }
    };

    // Implement the Firestore DataConverter for Listing
    export const listingConverter: FirestoreDataConverter<Listing> = {
      toFirestore(listing: Listing): DocumentData {
        // Convert the Listing object to Firestore data
        return {
          title: listing.title,
          description: listing.description,
          price: listing.price,
          category: listing.category,
          sellerID: listing.sellerID,
          createdAt: listing.createdAt,
          updatedAt: listing.updatedAt,
          imageURLs: listing.imageURLs,
          isActive: listing.isActive,
          listingURL: listing.listingURL,
          contactPhoneNumber: listing.contactPhoneNumber,
          reasonForSelling: listing.reasonForSelling,
          durationUsed: listing.durationUsed,
          pickUpLocation: listing.pickUpLocation,
        };
      },
      fromFirestore(snapshot: QueryDocumentSnapshot): Listing {
        // Convert Firestore data to the Listing object
        const data = snapshot.data();
        return {
          title: data.title,
          description: data.description,
          price: data.price,
          category: data.category,
          sellerID: data.sellerID,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          imageURLs: data.imageURLs,
          isActive: data.isActive,
          listingURL: data.listingURL,
          contactPhoneNumber: data.contactPhoneNumber,
          reasonForSelling: data.reasonForSelling,
          durationUsed: data.durationUsed,
          pickUpLocation: data.pickUpLocation,
          listingId: data.listingId,
        };
      },
      
    };

    // get listing data by seller id
    export const getListingByID = async (listingID: string) => {
      try {
        const listingRef: DocumentReference<Listing> = doc(db, "Listings", listingID).withConverter(listingConverter);
        const listingSnapshot: DocumentSnapshot<Listing> = await getDoc(listingRef);
        if (listingSnapshot.exists()) {
          const listingData = listingSnapshot.data();
          return convertServerTimestampToDate(listingData); // Convert serverTimestamps in the listing data
        } else {
          console.error("Listing not found.");
          return null;
        }
      } catch (error) {
        console.error("Error fetching listing data:", error);
        return null;
      }
    };
    
    // get all listings by seller id
    export const getAllListingsBySellerID = async (sellerID: string) => {
      try {
        const listingsRef = collection(db, "Listings").withConverter(listingConverter);
        const q = query(listingsRef, where("sellerID", "==", sellerID));
        const querySnapshot = await getDocs(q);
        const listings = querySnapshot.docs.map((doc) => doc.data());
        return convertServerTimestampToDate(listings); // Convert serverTimestamps in the listing data
      } catch (error) {
        console.error("Error fetching listings:", error);
        return [];
      }
    };

    // implement the Firestore DataConverter for sellerListing
    export const sellerListingConverter: FirestoreDataConverter<SellerListing> = {
      toFirestore(sellerListing: SellerListing): DocumentData {
        // Convert the sellerListing object to Firestore data
        return {
          sellerId: sellerListing.sellerId,
          listingId: sellerListing.listingId,
          
        };
      },
      fromFirestore(snapshot: QueryDocumentSnapshot): SellerListing {
        // Convert Firestore data to the sellerListing object
        const data = snapshot.data();
        return {
          sellerId: data.sellerId,
          listingId: data.listingId,
          
        };
      },
    };

    //Function to get listing data by listing id(doc ref)
    export const getListingByListingID = async (listingID: string) => {
      try {
        const listingRef: DocumentReference<Listing> = doc(db, "Listings", listingID).withConverter(listingConverter);
        const listingSnapshot: DocumentSnapshot<Listing> = await getDoc(listingRef);
        if (listingSnapshot.exists()) {
          const listingData = listingSnapshot.data();
          return convertServerTimestampToDate(listingData); // Convert serverTimestamps in the listing data
        } else {
          console.error("Listing not found.");
          return null;
        }
      } catch (error) {
        console.error("Error fetching listing data:", error);
        return null;
      }
    };

    //  implement the Firestore DataConverter for category
    export const categoryConverter: FirestoreDataConverter<Category> = {
      toFirestore(category: Category): DocumentData {
        // Convert the category object to Firestore data
        return {
          categoryId: category.categoryId,
          name: category.name,
          isActive: category.isActive,
        };
      },
      fromFirestore(snapshot: QueryDocumentSnapshot): Category {
        // Convert Firestore data to the category object
        const data = snapshot.data();
        return {
          categoryId: data.categoryId,
          name: data.name,
          isActive: data.isActive,
        };
      },
    };

    // get all categories
    export const getAllCategories = async () => {
      try {
        const categoriesRef = collection(db, "Categories").withConverter(categoryConverter);
        const querySnapshot = await getDocs(categoriesRef);
        const categories = querySnapshot.docs.map((doc) => doc.data());
        return categories;
      } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
      }
    };

    //function to get category data by category id

    export const getCategoryByID = async (categoryID: string) => {
      try{
        const categoryRef: DocumentReference<Category> = doc(db, "Categories", categoryID).withConverter(categoryConverter);
        const categorySnapshot: DocumentSnapshot<Category> = await getDoc(categoryRef);
        if (categorySnapshot.exists()) {
          const categoryData = categorySnapshot.data();
          return convertServerTimestampToDate(categoryData); // Convert serverTimestamps in the category data
        } else {
          console.error("Category not found.");
          return null;
        }
      } catch (error) {
        console.error("Error fetching category data:", error);
        return null;
      }
    };

    // TODO: cLEAN UP THIS CODE

    // Function to check if listingId exists in SellerListings collection
// async function getListingBySellerIdAndListingId(sellerId: string, listingId: string) {
  
//   try {
//     // Get the SellerListings document for the given sellerId
//     const sellerListingsRef = doc(db, 'SellerListings', sellerId).withConverter(sellerListingConverter);
//     const sellerListingsDoc = await getDoc(sellerListingsRef);

//     if (sellerListingsDoc.exists()) {
//       // If the document exists, check if listingId is in the document data
//       const sellerListingsData = sellerListingsDoc.data()!;
//       if (sellerListingsData.listingId.includes(listingId)) {
//         // Retrieve the listing from the Listings collection
//         const listingRef = doc(db, 'Listings', listingId);
//         const listingDoc = await getDoc(listingRef);

//         if (listingDoc.exists()) {
//           const listingData = listingDoc.data() as Listing;
//           return listingData;
//         }
//       }
//     }
//     return null; // listingId is not valid
//   } catch (error) {
//     console.error('Error retrieving listing data:', error);
//     return null;
//   }
// }

    
    //get listings by seller id from sellerlistings collection
    export const getAllListingsIdsBySellerID = async (sellerID: string) => {
      try {
        const sellerListingRef = collection(db, "SellerListings").withConverter(sellerListingConverter);
        const q = query(sellerListingRef, where("sellerId", "==", sellerID));
        const querySnapshot = await getDocs(q);
        const sellerListings = querySnapshot.docs.map((doc) => doc.data());
        return sellerListings;
      } catch (error) {
        console.error("Error fetching listings:", error);
        return [];
      }
    };
    
    // Function to get a list of listing IDs for a given seller ID
// Function to get a list of listing IDs for a given seller ID
export const getListingIdsBySellerId = async (sellerId: string) => {
  const listingIds: string[] = [];

  try {
    const q = query(collection(db, "SellerListings"), where("sellerId", "==", sellerId));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      // const docRef = doc.ref;
      // const docId = docRef.id;
      // listingIds.push(docId);
      const data = doc.data();
      listingIds.push(data.listingId);
    });

    return listingIds;
  } catch (error) {
    console.error("Error getting listing IDs:", error);
    return [];
  }
};

// get all listingsId from SellerListings collection by sellerId and get each corresponding listing from Listings collection
// return an array of listings
export const getAllListingsForSeller = async (sellerID: string) => {
  try {
      const sellerListingsQuery = query(collection(db, "SellerListings"), where("sellerId", "==", sellerID));
      const sellerListingsSnapshot = await getDocs(sellerListingsQuery);

      const listingIDs: string[] = [];

      sellerListingsSnapshot.forEach((doc) => {
          listingIDs.push(doc.data().listingId);
      });

      const listings: any[] = [];

      for (const listingID of listingIDs) {
          const listingDocRef = doc(db, "Listings", listingID);
          const listingDocSnapshot = await getDoc(listingDocRef);
          if (listingDocSnapshot.exists()) {
              const listingData = listingDocSnapshot.data();
              const listingWithId = { ...listingData, listingId: listingID };
              listings.push(listingWithId);
              

          }
      }

      return listings;
  } catch (error) {
      console.error("Error fetching listings for seller:", error);
      return [];
  }
};

// get all listings in listing collection 
export const getAllListings = async () => {
  try {
    const listingsRef = collection(db, "Listings").withConverter(listingConverter);
    const querySnapshot = await getDocs(listingsRef);
    const listings = querySnapshot.docs.map((doc) => doc.data());
    return listings;
  } catch (error) {
    console.error("Error fetching listings:", error);
    return [];
  }
}

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

  

    // update a category in the Categories collection
    export const updateCategory = async (categoryID: string, category: Category) => {
      try {
        const filterData = {
          name: category.name,
          isActive: category.isActive,
        };
        const categoryRef = doc(db, "Categories", categoryID);
        await updateDoc(categoryRef, filterData);
      }
      catch (error) {
        console.error("Error updating category:", error);
      }
    }
  
    // Function to update user data in Firestore
    export const updateUser = async (
      userID: string,
      updatedData: Partial<User>
    ): Promise<User | null> => {
      try {
        const userRef = doc(db, "Users", userID);

        // Fetch the current user data
        const userSnapshot = await getDoc(userRef);
        if (!userSnapshot.exists()) {
          console.error("User not found.");
          return null;
        }

        // Merge the updated data with the current data
        const userData = userSnapshot.data() as User;
        const mergedData = { ...userData, ...updatedData };

        // Update the user data in Firestore
        await updateDoc(userRef, mergedData);

        return mergedData;
      } catch (error) {
        console.error("Error updating user data:", error);
        return null;
      }
    };


    // update a seller in the Sellers collection
    export const updateSeller = async (sellerID: string, dataToUpdate: Partial<Seller>) => {
      try {
        const sellerRef = doc(db, "Sellers", sellerID);
        const sellerSnapshot = await getDoc(sellerRef);
        if (!sellerSnapshot.exists()) {
          console.error("Seller not found.");
          return null;
        }
        const sellerData = sellerSnapshot.data() as Seller;
        const mergedData = { ...sellerData, ...dataToUpdate };
        await updateDoc(sellerRef, mergedData);
        return mergedData;
      } catch (error) {
        console.error("Error updating seller data:", error);
        return null;

      }
    };

    // update a listing in the Listings collection
    export const updateListing = async (listingID: string , dataToUpdate: Partial<Listing>) => {
      try {
        const listingRef = doc(db, "Listings", listingID);
        const listingSnapshot = await getDoc(listingRef);
        if (!listingSnapshot.exists()) {
          console.error("Listing not found.");
          return null;
        }
        const listingData = listingSnapshot.data() as Listing;
        const mergedData = { ...listingData, ...dataToUpdate };
        await updateDoc(listingRef, mergedData);
        return mergedData;
      } catch (error) {
        console.error("Error updating listing data:", error);
        return null;

      }
    };

    //update a category in the Categories collection
    export const updateCategoryByID = async (categoryID: string, dataToUpdate: Partial<Category>) => {
      try {
        const categoryRef = doc(db, "Categories", categoryID);
        const categorySnapshot = await getDoc(categoryRef);
        if (!categorySnapshot.exists()) {
          console.error("Category not found.");
          return null;
        }
        const categoryData = categorySnapshot.data() as Category;
        const mergedData = { ...categoryData, ...dataToUpdate };
        await updateDoc(categoryRef, mergedData);
        return mergedData;
      } catch (error) {
        console.error("Error updating category data:", error);
        return null;

      }
    };

    //find first listing by seller id
    export const findFirstListingForSeller = async (sellerUserID: string) => {
      // Assume "db" is the Firestore instance
      const listingsRef = collection(db, "Listings");
    
      try {
        // Create a query to find the listing(s) with the specified sellerUserID
        const q = query(listingsRef, where("sellerID", "==", sellerUserID));
    
        // Get the documents that match the query
        const querySnapshot = await getDocs(q);
    
        // Check if there are any matching documents
        if (!querySnapshot.empty) {
          // Get the first matching document (since there could be multiple listings for the same seller)
          const firstListing = querySnapshot.docs[0].data() as Listing;
          const listingID = querySnapshot.docs[0].id;
    
          console.log("Found first listing:", firstListing);
          console.log("Listing ID:", listingID);
    
          return { listingID, listingData: firstListing };
        } else {
          
          console.log("No listing found for seller with userID:", sellerUserID);
          return null;
        }
      } catch (error) {
        console.error("Error searching for listing:", error);
        throw error;
      }
    };

    //delete sellerListing relationship by listingId
    export const deleteSellerListingRelationshipByListingId = async (listingID: string) => {
      try {
        const sellerListingsRef = collection(db, "SellerListings");
        const q = query(sellerListingsRef, where("listingId", "==", listingID));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
        return listingID;
      } catch (error) {
        console.error("Error deleting seller listing relationship:", error);
      }
    }; 
    
    // delete listing by listingId
    export const deleteListing = async (listingID: string) => {
      try {
        const listingRef = doc(db, "Listings", listingID);
        await deleteDoc(listingRef);
        console.log(`Listing id: ${listingID} deleted`)
        // delete the seller listing relationship
        const res = await deleteSellerListingRelationshipByListingId(listingID);
        return res;
      } catch (error) {
        console.error("Error deleting listing:", error);
      }
    };
    
    // delete category by categoryId
    export const deleteCategoryByID = async (categoryID: string) => {
      try {
        const categoryRef = doc(db, "Categories", categoryID);
        await deleteDoc(categoryRef);
        console.log(`Category id: ${categoryID} deleted`)
        return categoryID;
      } catch (error) {
        console.error("DB: Error deleting category:", error);
      }
    }

    
    export const getListingsByCategory = async (categoryId: string): Promise<Listing[]> => {
      try {
        const listingsRef = collection(db, "Listings").withConverter(listingConverter);
        const categoriesRef = collection(db, "Categories").withConverter(categoryConverter);

        // get cat name by cat id
        const categoryDoc = await getDoc(doc(categoriesRef, categoryId));
        const categoryName = categoryDoc.data()?.name;
        const q = query(listingsRef, where("category", "==", categoryName));
        const querySnapshot = await getDocs(q);
        const listings = querySnapshot.docs.map((doc) => doc.data());
        return convertServerTimestampToDate(listings); // Convert serverTimestamps in the listing data
      } catch (error) {
        console.error("Error fetching listings by category:", error);
        return [];
      }
    };
    
    