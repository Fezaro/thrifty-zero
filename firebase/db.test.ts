import { addUser } from "./db";

describe("addUser", () => {
  it("adds a user to Firestore", async () => {
    const isSeller = true;
    const name = "John Doe";
    const phoneNumber = "123-456-7890";
    const userID = "abc123";
    const email = "johndoe@example.com";

    await addUser(isSeller, name, phoneNumber, userID, email);

    // TODO: Add assertions to check that the user was added correctly
    

    
  });

  it("handles errors when adding a user to Firestore", async () => {
    const isSeller = true;
    const name = "John Doe";
    const phoneNumber = "123-456-7890";
    const userID = "abc123";
    const email = "johndoe@example.com";

    // TODO: Mock the Firestore API to throw an error when adding a user
    // and add assertions to check that the error was handled correctly
  });
});