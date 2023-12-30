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
    getDocs: jest.fn(),
    serverTimestamp: jest.fn(),
  }));

  describe('Database functionality - getListings', () => {
    it('fetches listings from the Listings collection', async () => {
      const mockListings = [
        { id: '1', title: 'Listing 1' },
        { id: '2', title: 'Listing 2' },
      ];
  
      (collection as jest.Mock).mockReturnValue('Listings');
      (getDocs as jest.Mock).mockResolvedValue({
        docs: mockListings.map((listing) => ({ data: () => listing })),
      });
  
      const result = await getListings();
  
      expect(collection).toHaveBeenCalledWith(expect.anything(), 'Listings');
      expect(getDocs).toHaveBeenCalledWith('Listings');
      expect(result).toEqual(mockListings);
    });
  
    it('handles errors when fetching listings', async () => {
      const mockError = new Error('Mock error');
  
      (collection as jest.Mock).mockReturnValue('Listings');
      (getDocs as jest.Mock).mockRejectedValue(mockError);
  
      const result = await getListings();
  
      expect(collection).toHaveBeenCalledWith(expect.anything(), 'Listings');
      expect(getDocs).toHaveBeenCalledWith('Listings');
    //   expect(console.error).toHaveBeenCalledWith('Error fetching listings:', mockError);
      expect(result).toEqual([]);
    });
  });