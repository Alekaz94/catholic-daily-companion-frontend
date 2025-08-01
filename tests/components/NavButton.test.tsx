import { useNavigation } from "@react-navigation/native";
import NavButton from "../../src/components/NavButton";
import { act, fireEvent, render } from "@testing-library/react-native";

jest.mock("@react-navigation/native", () => ({
    useNavigation: jest.fn(),
}))

describe("NavButton", () => {
    it("navigates to the correct screen on press", async () => {
        const mockNavigate = jest.fn();
        (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate});

        const { getByText } = render(<NavButton title="Home" screen="Home" />)

        await act(async () => {
            fireEvent.press(getByText("Home"));
        })
        
        expect(mockNavigate).toHaveBeenCalledWith("Home");
    })
})