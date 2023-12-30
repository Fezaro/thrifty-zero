import { act, render, screen, waitFor } from "@testing-library/react";
import { getSellerByID } from "@/firebase/db";
import SellerPage from "@/app/(dashboard)/[userId]/(routes)/seller/page";


// mock firebase setup
jest.mock("../../../../../../firebase/firebaseApp.ts", () => ({
  auth: jest.fn(() => ({
    currentUser: {
      uid: "1",
      displayName: 'John',
    },
  })),
}));

const mockSellerData = { id: "1", name: "John Doe" };

jest.mock("../../../../../../firebase/db.ts", () => ({
  getSellerByID: jest.fn(() => Promise.resolve(mockSellerData)),
}));

//mock sellerdata state initialisation and load it if getSellerByID is called successfully
const setSellerData = jest.fn();
const setLoading = jest.fn();


afterEach(() => {
  jest.resetAllMocks();
});

describe("Seller Page fuctionality", () => {
  // Existing tests...
  // check if page loading state is displayed
  it("displays page components and loading state", () => {
    render(<SellerPage params={{ userId: "1" }} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
describe("Seller Page error fuctionality", () => {
  it("displays error message if seller is not found", async () => {
    // Mock the console functions to prevent logs and errors from appearing in the console
    jest.spyOn(console, "error").mockImplementation(() => { });
    jest.spyOn(console, "log").mockImplementation(() => { });

    // Mock the getSellerByID function to return a rejected promise
    (getSellerByID as jest.Mock).mockImplementation(() => Promise.reject());
    
    // Render the page
    render(<SellerPage params={{ userId: "3" }} />);

    // Wait for the error message to appear in the document
    await waitFor(() => {
      expect(screen.getByText(/Could not find seller with ID: 3/i)).toBeInTheDocument();
    });

    // Assert that the console functions were called
    expect(console.error).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalled();
  });
});