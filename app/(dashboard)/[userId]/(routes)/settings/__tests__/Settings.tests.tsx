import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { getUserByID } from "@/firebase/db";
import SettingsPage from "../page";

// mock firebase setup
jest.mock("../../../../../../firebase/firebaseApp.ts", () => ({
    auth: jest.fn(() => ({
        currentUser: {
        uid: "1",
        displayName: 'John',
        },
    })),
    }));


jest.mock("../../../../../api/users/[userId]/route.ts", () => ({
  getUserByID: jest.fn(() => Promise.resolve({ id: "1", name: "John" })),
}));

describe("SettingsPage", () => {
  it("renders the error message when not authenticated", async () => {
    render(<SettingsPage params={{ userId: "1" }} />);

    //assert

    await waitFor(() => {
      expect(screen.getByText("could not find user with ID:", { exact: false })).toBeInTheDocument();
    });
  });

//   it("shows an error message if the user is not found", async () => {
//     jest.spyOn(console, "error").mockImplementation(() => {});
//     jest.spyOn(console, "log").mockImplementation(() => {});

//     (getUserByID as jest.Mock).mockImplementation(() => Promise.reject());

//     render(<SettingsPage params={{ userId: "2" }} />);

//     await waitFor(() => {
//       expect(screen.getByText("Could not find user with ID: 2")).toBeInTheDocument();
//     });

//     expect(console.error).toHaveBeenCalled();
//     expect(console.log).toHaveBeenCalled();
//   });

//   it("shows a loading message while fetching the user's data", async () => {
//     render(<SettingsPage params={{ userId: "1" }} />);

//     expect(screen.getByText("Loading...")).toBeInTheDocument();

//     await waitFor(() => {
//       expect(screen.getByText("Name: John")).toBeInTheDocument();
//     });
//   });

//   it("opens the seller modal when the 'Become a Seller' button is clicked", async () => {
//     render(<SettingsPage params={{ userId: "1" }} />);

//     const button = screen.getByRole("button", { name: "Become a Seller" });

//     userEvent.click(button);

//     await waitFor(() => {
//       expect(screen.getByRole("dialog")).toBeInTheDocument();
//     });
//   });

//   it("submits the seller form when the 'Save' button is clicked", async () => {
//     render(<SettingsPage params={{ userId: "1" }} />);

//     const button = screen.getByRole("button", { name: "Become a Seller" });

//     userEvent.click(button);

//     const nameInput = screen.getByLabelText("Name");
//     const emailInput = screen.getByLabelText("Email");
//     const phoneInput = screen.getByLabelText("Phone");

//     userEvent.type(nameInput, "John");
//     userEvent.type(emailInput, "john@example.com");
//     userEvent.type(phoneInput, "1234567890");

//     const saveButton = screen.getByRole("button", { name: "Save" });

//     userEvent.click(saveButton);

//     await waitFor(() => {
//       expect(screen.getByText("Seller information saved successfully!")).toBeInTheDocument();
//     });
//   });
});