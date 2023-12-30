import { addCategory, addListing, addSeller, addUser, getListings } from './db';
import { doc, collection, setDoc, serverTimestamp, where, getDocs } from 'firebase/firestore';
import { auth } from './firebaseApp';

//mock auth
jest.mock("../firebase/firebaseApp.ts", () => ({
  auth: jest.fn(() => ({
      currentUser: {
      uid: "17",
      displayName: 'Lintin',
      },
  })),
  }));

// mock firebase db call
jest.mock("../firebase/firebaseApp.ts", () => ({
  //return a firestore instance
  db: jest.fn(() => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        set: jest.fn(() => Promise.resolve("Mock user added"))
      }))
    }))
  }))

}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  collection: jest.fn(),
  setDoc: jest.fn(),
  serverTimestamp: jest.fn(),
}));

afterEach(() => {
  jest.clearAllMocks();
}
);

describe('Database functionality - addUser', () => {
  it('adds a user to the Users collection', async () => {
    const mockUser = {
      userID: '1',
      name: 'Test User',
      email: 'test@example.com',
      isSeller: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      phoneNumber: '1234567890',
    };

    (doc as jest.Mock).mockReturnValue('userRef');
    (collection as jest.Mock).mockReturnValue('Users');
    (setDoc as jest.Mock).mockResolvedValue(undefined);
    (serverTimestamp as jest.Mock).mockReturnValue(new Date());

    await addUser(
      mockUser.isSeller,
      mockUser.name,
      mockUser.phoneNumber,
      mockUser.userID,
      mockUser.email,
    );

    expect(collection).toHaveBeenCalledWith(expect.anything(), 'Users');
    expect(doc).toHaveBeenCalledWith('Users', mockUser.userID);
    expect(setDoc).toHaveBeenCalledWith('userRef', expect.objectContaining(mockUser));
  });
});

describe('Database functionality - addSeller', () => {
  it('adds a seller to the Sellers collection', async () => {
    const mockSeller = {
      userID: '1',
      bio: 'Test Bio',
      location: 'Test Location',
      instagramURL: 'https://www.instadoesit.com',
      instagramUsername: 'testing',
      instagramImported: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      shopName: 'Test Shop',
      shopProfileImageURL: 'https://www.google.com',
    };

    (doc as jest.Mock).mockReturnValue('sellerRef');
    (collection as jest.Mock).mockReturnValue('Sellers');
    (setDoc as jest.Mock).mockResolvedValue(undefined);
    (serverTimestamp as jest.Mock).mockReturnValue(new Date());
    // (auth as unknown as jest.Mock).mockReturnValue({
    //   currentUser: {
    //     uid: "17",
    //     displayName: 'Lintin',
    //   },
    // });

    await addSeller(
      mockSeller.userID,
      mockSeller
    );

    expect(collection).toHaveBeenCalledWith(expect.anything(), 'Sellers');
    expect(doc).toHaveBeenCalledWith('Sellers', mockSeller.userID);
    expect(setDoc).toHaveBeenCalledWith('sellerRef', expect.objectContaining(mockSeller));
    
  }
  )}
  );


  // 

  

// });import { getListings } from './db';
// import { collection, getDocs } from 'firebase/firestore';
// ------------------------------------
