import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { getUserByID } from "@/firebase/db";
import SettingsPage from "@/app/(dashboard)/[userId]/(routes)/settings/page";

jest.mock("../../../api/users", () => ({
  getUserByID: jest.fn(() => Promise.resolve({ id: "1", name: "John Doe" })),
}));

describe("SettingsPage", () => {
  it("renders the user's data", async () => {
    render(<SettingsPage params={{ userId: "1" }} />);

    await waitFor(() => {
      expect(screen.getByText("Name: John Doe")).toBeInTheDocument();
    });
  });

  it("shows an error message if the user is not found", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "log").mockImplementation(() => {});

    (getUserByID as jest.Mock).mockImplementation(() => Promise.reject());

    render(<SettingsPage params={{ userId: "2" }} />);

    await waitFor(() => {
      expect(screen.getByText("Could not find user with ID: 2")).toBeInTheDocument();
    });

    expect(console.error).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalled();
  });

  it("shows a loading message while fetching the user's data", async () => {
    render(<SettingsPage params={{ userId: "1" }} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Name: John Doe")).toBeInTheDocument();
    });
  });

  it("opens the seller modal when the 'Become a Seller' button is clicked", async () => {
    render(<SettingsPage params={{ userId: "1" }} />);

    const button = screen.getByRole("button", { name: "Become a Seller" });

    userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  it("submits the seller form when the 'Save' button is clicked", async () => {
    render(<SettingsPage params={{ userId: "1" }} />);

    const button = screen.getByRole("button", { name: "Become a Seller" });

    userEvent.click(button);

    const nameInput = screen.getByLabelText("Name");
    const emailInput = screen.getByLabelText("Email");
    const phoneInput = screen.getByLabelText("Phone");

    userEvent.type(nameInput, "John Doe");
    userEvent.type(emailInput, "john.doe@example.com");
    userEvent.type(phoneInput, "1234567890");

    const saveButton = screen.getByRole("button", { name: "Save" });

    userEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("Seller information saved successfully!")).toBeInTheDocument();
    });
  });
});
