import { changePassword } from "../../services/userService"; // Adjust if filename differs
import API from "../../services/api";
import { User } from "../../models/User";

jest.mock("../../services/api");

describe("userService - changePassword", () => {
  const mockUser: User = {
    id: "1",
    email: "test@example.com",
    password: "hashed",
    firstName: "Test",
    lastName: "User",
    role: "user"
  };

  const mockPasswords = {
    currentPassword: "oldpass123",
    newPassword: "newpass456"
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls API.put with correct URL and body", async () => {
    (API.put as jest.Mock).mockResolvedValue(mockUser);

    const result = await changePassword("1", mockPasswords);

    expect(API.put).toHaveBeenCalledWith("/api/v1/user/1", mockPasswords);
    expect(result).toEqual(mockUser);
  });

  it("handles API errors properly", async () => {
    (API.put as jest.Mock).mockRejectedValue(new Error("Failed to change password"));

    await expect(changePassword("1", mockPasswords)).rejects.toThrow("Failed to change password");
  });
});