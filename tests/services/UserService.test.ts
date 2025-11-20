import {
  changePassword,
  updateName,
  getAllUsers,
  searchUser,
  createUser,
  deleteUser
} from "../../src/services/UserService";
import API from "../../src/services/api";
import { User, NewUser } from "../../src/models/User";
import { Page } from "../../src/models/Page";

jest.mock("../../src/services/api");

describe("UserService", () => {
  const mockUser: User = {
    id: "1",
    email: "test@example.com",
    password: "hashed",
    firstName: "Test",
    lastName: "User",
    role: "user",
    createdAt: "",
    updatedAt: ""
  };

  const mockNewUser: NewUser = {
    email: "new@example.com",
    password: "newpass",
    firstName: "New",
    lastName: "User"
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("changePassword", () => {
    it("calls API.put with correct URL and body", async () => {
      (API.put as jest.Mock).mockResolvedValue(mockUser);

      const passwords = { currentPassword: "oldpass", newPassword: "newpass" };
      const result = await changePassword("1", passwords);

      expect(API.put).toHaveBeenCalledWith("/api/v1/user/1", passwords);
      expect(result).toEqual(mockUser);
    });

    it("handles API errors", async () => {
      (API.put as jest.Mock).mockRejectedValue(new Error("Failed"));

      await expect(changePassword("1", { currentPassword: "", newPassword: "" })).rejects.toThrow("Failed");
    });
  });

  describe("updateName", () => {
    it("updates first and last name", async () => {
      const updated = { ...mockUser, firstName: "Updated" };
      (API.put as jest.Mock).mockResolvedValue({ data: updated });

      const result = await updateName("1", { firstName: "Updated" });
      expect(API.put).toHaveBeenCalledWith("/api/v1/user/update-name/1", { firstName: "Updated" });
      expect(result).toEqual(updated);
    });

    it("handles API errors", async () => {
      (API.put as jest.Mock).mockRejectedValue(new Error("Failed update"));
      await expect(updateName("1", { firstName: "Fail" })).rejects.toThrow("Failed update");
    });
  });

  describe("getAllUsers", () => {
    it("fetches paginated users", async () => {
      (API.get as jest.Mock).mockResolvedValue({ data: [mockUser] });
      const result = await getAllUsers(0, 10);

      expect(API.get).toHaveBeenCalledWith("/api/v1/user?page=0&size=10");
      expect(result).toEqual([mockUser]);
    });

    it("handles empty results", async () => {
      (API.get as jest.Mock).mockResolvedValue({ data: [] });
      const result = await getAllUsers(0, 10);
      expect(result).toEqual([]);
    });
  });

  describe("searchUser", () => {
    it("searches users by query", async () => {
      const mockPage: Page<User> = {
        content: [mockUser],
        totalPages: 1,
        totalElements: 1,
        size: 10,
        number: 0,
        last: false,
        first: false,
        numberOfElements: 0,
        empty: false
      };
      (API.get as jest.Mock).mockResolvedValue({ data: mockPage });
  
      const result = await searchUser("Test", 0, 10);
      expect(API.get).toHaveBeenCalledWith("/api/v1/user", { params: { query: "Test", page: 0, size: 10 } });
      expect(result).toEqual(mockPage);
    });

    it("returns empty page if no users match", async () => {
      const emptyPage: Page<User> = {
        content: [], totalPages: 0, totalElements: 0, size: 10, number: 0,
        last: false,
        first: false,
        numberOfElements: 0,
        empty: false
      };
      (API.get as jest.Mock).mockResolvedValue({ data: emptyPage });

      const result = await searchUser("NonExistent", 0, 10);
      expect(result.content).toHaveLength(0);
    });
  });

  describe("createUser", () => {
    it("creates a new user", async () => {
      (API.post as jest.Mock).mockResolvedValue({ data: mockUser });
      const result = await createUser(mockNewUser);

      expect(API.post).toHaveBeenCalledWith("/api/v1/user", mockNewUser);
      expect(result).toEqual(mockUser);
    });

    it("handles API errors", async () => {
      (API.post as jest.Mock).mockRejectedValue(new Error("Create failed"));
      await expect(createUser(mockNewUser)).rejects.toThrow("Create failed");
    });
  });

  describe("deleteUser", () => {
    it("deletes a user", async () => {
      (API.delete as jest.Mock).mockResolvedValue(undefined);
      await deleteUser("1");

      expect(API.delete).toHaveBeenCalledWith("/api/v1/user/1");
    });

    it("handles API errors", async () => {
      (API.delete as jest.Mock).mockRejectedValue(new Error("Delete failed"));
      await expect(deleteUser("1")).rejects.toThrow("Delete failed");
    });
  });
});
