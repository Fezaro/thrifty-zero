import { POST } from "./route";
import { NextResponse } from "next/server";

// mock firebase auth
// initialize firebase 
jest.mock('../../../firebase/firebaseApp.ts', () => ({
    auth: jest.fn(() => ({
      currentUser: null,
    })),
  }));


const req = new Request("/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userID: "test", name: "test", isActive: true }),
  });


describe("POST", () => {
  it("returns an error if userID is not provided", async () => {
    // const  req = { json: async () => ({ name: "test", isActive: true }) };
    const response = await POST(req);
    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(401);
    expect(response.body).toBe("Unauthenticated");
  });

  it("returns an error if name is not provided", async () => {
    // const req = { json: async () => ({ userID: "test", isActive: true }) };
    const response = await POST(req);
    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(400);
    expect(response.body).toBe("Entity unknown");
  });

  it("calls addCategory with the correct parameters", async () => {
    // const req = { json: async () => ({ userID: "test", name: "test", isActive: true }) };
    const addCategory = jest.fn();
    const originalAddCategory = jest.requireActual("../../firebase/db").addCategory;
    jest.mock("../../firebase/db", () => ({ addCategory }));
    addCategory.mockReturnValueOnce({ id: "test", ...req.json() });
    const response = await POST(req);
    expect(addCategory).toHaveBeenCalledWith({ name: "test", isActive: true });
    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: "test", ...req.json() });
    jest.mock("../../firebase/db", () => ({ addCategory: originalAddCategory }));
  });

  it("returns an error if addCategory throws an error", async () => {
    // const req = { json: async () => ({ userID: "test", name: "test", isActive: true }) };
    const addCategory = jest.fn();
    const originalAddCategory = jest.requireActual("../../firebase/db").addCategory;
    jest.mock("../../firebase/db", () => ({ addCategory }));
    addCategory.mockImplementationOnce(() => {
      throw new Error("Test error");
    });
    const response = await POST(req);
    expect(addCategory).toHaveBeenCalledWith({ name: "test", isActive: true });
    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(500);
    expect(response.body).toBe("Internal Server Error");
    jest.mock("../../firebase/db", () => ({ addCategory: originalAddCategory }));
  });
});