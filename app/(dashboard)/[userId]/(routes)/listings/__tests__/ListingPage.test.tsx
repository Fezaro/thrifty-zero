
import { act, render, screen, waitFor } from "@testing-library/react";

import { getAllListingsIdsBySellerID } from "@/firebase/db";
import ListingsPage from "../page";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal, PromiseLikeOfReactNode } from "react";

// Mock firebase setup
jest.mock("", () => ({
  auth: jest.fn(() => ({
    currentUser: {
      uid: "1",
      displayName: "John",
    },
  })),
}));

// Mock Listings data
const mockListingsData = [
  { id: "1", name: "Listing 1", isActive: true },
  { id: "2", name: "Listing 2", isActive: true },
  { id: "3", name: "Listing 3", isActive: true },
];

// Mock getAllListingsIdsBySellerID function
jest.mock("../../../../../../firebase/db.ts", () => ({
  getAllListingsIdsBySellerID: jest.fn(() => Promise.resolve(mockListingsData)),
}));

// Mock ListingClient component with mock data
jest.mock("../components/client.tsx", () => ({
  ListingClient: jest.fn(({ sellListdata }) => (
    <div>
      Listings Client
      {sellListdata.map((listing: { id: Key | null | undefined; name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; }) => (
        <div key={listing.id}>{listing.name}</div>
      ))}
    </div>
  )),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe("Listings Page functionality", () => {
  // Check if page loading state is displayed
  it("displays loading state", () => {
    render(<ListingsPage params={{ userId: "1" }} />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  // Check if ListingClient component loads data
  it("loads ListingClient component", async () => {
    // Mock the data to be returned by getAllListingsIdsBySellerID
    (getAllListingsIdsBySellerID as jest.Mock).mockResolvedValueOnce(mockListingsData);

    render(<ListingsPage params={{ userId: "1" }} />);

    // Wait for the component to update its state
    await waitFor(() => {
      expect(screen.getByText("Listings Client")).toBeInTheDocument();
      // Check for specific listing names
      expect(screen.getByText("Listing 1")).toBeInTheDocument();
      expect(screen.getByText("Listing 2")).toBeInTheDocument();
      expect(screen.getByText("Listing 3")).toBeInTheDocument();
    });
  });
});
