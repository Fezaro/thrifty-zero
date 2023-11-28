import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { getUserByID } from "@/firebase/db";
// import { getSellerByID } from "../../../../../api/sellers/route"; // Import getSellerByID function

import SettingsPage from "@/app/(dashboard)/[userId]/(routes)/settings/page";

// jest.mock("../../../api/users", () => ({
//   getUserByID: jest.fn(() => Promise.resolve({ id: "1", name: "John Doe" })),
// }));

// jest.mock("../../../api/sellers/[usserId]/route.ts", () => ({
//   getSellerByID: jest.fn(() => Promise.resolve({ id: "1", name: "John Doe" })),
// }));

describe("SettingsPage", () => {
  // Existing tests...
  // check if page loading state is displayed
  it("displays loading state", () => {
    render(<SettingsPage params={{ userId: "1" }} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  // it("fetches seller data and logs it", async () => {
  //   const mockSellerData = { id: "1", name: "John Doe" };
  //   (getSellerByID as jest.Mock).mockResolvedValueOnce(mockSellerData);

  //   render(<SettingsPage params={{ userId: "1" }} />);

  //   await waitFor(() => {
  //     expect(screen.getByText("fetching data in seller page")).toBeInTheDocument();
  //     expect(screen.getByText(JSON.stringify(mockSellerData))).toBeInTheDocument();
  //   });

  //   expect(getSellerByID).toHaveBeenCalledWith("1");
  // });
});