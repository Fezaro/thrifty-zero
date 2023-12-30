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

  describe('Database functionality - addListing', () => {
      it('adds a listing to the Listings collection', async () => {
        const mockListing = {
          listingId: '1',
          sellerID: '1',
          title: 'Test Title',
          description: 'Test Description',
          price: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true,
          imageURLs: ['https://www.google.com'],
          pickUpLocation:'Nairoby',
          contactPhoneNumber: '1234567890',
          reasonForSelling: 'decluttering',
          durationUsed: '3 months',
          category: 'electronics',
          listingURL: 'hhtps://thriftyG.com',
          
        };
    
        (doc as jest.Mock).mockReturnValue('listingRef');
        (collection as jest.Mock).mockReturnValue('Listings');
        (setDoc as jest.Mock).mockResolvedValue(undefined);
        (serverTimestamp as jest.Mock).mockReturnValue(new Date());
        // (auth as unknown as jest.Mock).mockReturnValue({
        //   currentUser: {
        //     uid: "17",
        //     displayName: 'Lintin',
        //   },
        // });
  
        // set listingId 
        const listingId = mockListing.listingId;
  
        // mock Function to create a new seller listing relationship document
    
        await addListing(
          mockListing,
          mockListing.sellerID,
        );
    
        expect(collection).toHaveBeenCalledWith(expect.anything(), 'Listings');
        expect(doc).toHaveBeenCalledWith('Listings', mockListing.listingId);
        expect(setDoc).toHaveBeenCalledWith('listingRef', expect.objectContaining(mockListing));
        
      }
      )}
    );
  