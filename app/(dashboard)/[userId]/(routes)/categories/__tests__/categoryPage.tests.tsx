import { act, render, screen, waitFor } from "@testing-library/react";
import CategoryPage from "../page";
import { getAllCategories } from "@/firebase/db";
import { CategoriesClient } from "../components/client";



// mock firebase setup
jest.mock("../../../../../../firebase/firebaseApp.ts", () => ({
  auth: jest.fn(() => ({
    currentUser: {
      uid: "1",
      displayName: 'John',
    },
  })),
}));

//mock Category data
const mockCategoriesData = [
  { id: "1", name: "Category 1", isActive: true },
  { id: "2", name: "Category 2", isActive: true },
  { id: "3", name: "Category 3", isActive: true },
];

// mock getAllCategories function

jest.mock("../../../../../../firebase/db.ts", () => ({
  getAllCategories: jest.fn(() => Promise.resolve(mockCategoriesData)),
}));

// Mock categoryClient component with mock data
jest.mock("../components/client", () => ({
  CategoriesClient: jest.fn(({ mockCategoriesData }) => (
    <div>
      Categories Client
      {mockCategoriesData.map((category: { id: string; name: string, isActive: boolean, }) => (
        <div key={category.id}>{category.name}</div>
      ))}
    </div>
  )),
}));


afterEach(() => {
  jest.resetAllMocks();
});
// Mock the useState hook
let useStateMock: jest.Mock<any, any>;

beforeEach(() => {
  useStateMock = jest.fn();
  jest.mock("react", () => ({
    ...jest.requireActual("react"),
    useState: (initial: any) => [initial, useStateMock],
  }));
});



describe("Category Page fuctionality", () => {
  // Existing tests...
  // check if page loading state is displayed
  it("displays components and loading state", () => {
    render(<CategoryPage params={{ userId: "1" }} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });


  // Check if Categories client component loads data
  it("loads categories client component and populates them with categories", async () => {
    // Mock the useState hook for the categoriesData and loading state
    // useStateMock.mockReturnValueOnce([null, jest.fn()]); // Initial state for loading
    (getAllCategories as jest.Mock).mockResolvedValueOnce(mockCategoriesData);
    useStateMock.mockReturnValueOnce([mockCategoriesData, jest.fn()]); // State after data is loaded

    render(<CategoryPage params={{ userId: "1" }} />);

    (CategoriesClient as jest.Mock).mockReturnValueOnce(
      <div>
      <div>Categories Client</div>
      <div>{mockCategoriesData.map(
        (category: { id: string; name: string, isActive: boolean, }) => (
          <div key={category.id}>{category.name}</div>
        )
      )}</div>
      </div>
     
    );
      
    

    await waitFor(() => {
      // check Heading title and description is displayed
      // expect(screen.getByText("Categories (3)")).toBeInTheDocument();

      expect(screen.getByText("Category 1")).toBeInTheDocument();
      expect(screen.getByText("Category 2")).toBeInTheDocument();
      expect(screen.getByText("Category 3")).toBeInTheDocument();


    });
  });
});
