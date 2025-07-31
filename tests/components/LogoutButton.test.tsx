import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import LogoutButton from "../../components/LogoutButton";
import { useAuth } from "../../context/AuthContext";

jest.mock("../../context/AuthContext", () => ({
    useAuth: jest.fn(),
}));

globalThis.alert = jest.fn();

const mockLogout = jest.fn();

beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
        logout: mockLogout,
    })
});

describe("LogoutButton", () => {
    

    it('shows confirmation modal when Logout is pressed', async () => {
        const { getByText, queryByText} = render(<LogoutButton />);

        expect(queryByText("Are you sure you want to logout?")).toBeNull();
        await act(async () => {
            fireEvent.press(getByText("Logout"))
        })
        expect(getByText("Are you sure you want to logout?")).toBeTruthy();
    });

    it("hides module when Cancel is pressed", async () => {
        const {getByText, queryByText } = render(<LogoutButton />);

        await act(async () => {
            fireEvent.press(getByText("Logout"));
        })
        await act(async () => {
            fireEvent.press(getByText("Cancel"))
        })
        expect(queryByText("Are you sure you want to logout?")).toBeNull();
    });

    it("calls logout and shows alert when Yes is pressed", async () => {
        const { getByText, queryByText } = render(<LogoutButton />);

        await act(async () => {
            fireEvent.press(getByText("Logout"));
        })
        await act(async () => {
            fireEvent.press(getByText("Yes"));
        })
        await waitFor(() => {
            expect(mockLogout).toHaveBeenCalledTimes(1);
            expect(queryByText("Are you sure you want to logout?")).toBeNull();
            expect(globalThis.alert).toHaveBeenCalledWith("Logout successfull!");
        });
    });
})