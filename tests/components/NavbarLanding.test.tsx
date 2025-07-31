import { useNavigation, useRoute } from "@react-navigation/native"
import NavbarLanding from "../../components/NavbarLanding";
import { act, fireEvent, render } from "@testing-library/react-native";

type MockNavButtonProps = {
    title: string;
    screen: string;
}

jest.mock("@react-navigation/native", () => ({
    useNavigation: jest.fn(),
    useRoute: jest.fn(),
}));

describe("NavbarLanding", () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });
    })

    it("renders correctly with Login and Sign up buttons", () => {
        const { getByText, getByTestId } = render(<NavbarLanding />);

        expect(getByText("Login")).toBeTruthy();
        expect(getByText("Sign up")).toBeTruthy();

        const loginButton = getByTestId("navbutton-Login");
        expect(loginButton.props.style).toEqual(
            expect.objectContaining({ backgroundColor: "#FAF3E0" }),
        );
    });

    it("includes both nav buttons with correct testIDs", () => {
        const { getByTestId } = render(<NavbarLanding />);
        expect(getByTestId("navbutton-Login")).toBeTruthy();
        expect(getByTestId("navbutton-Signup")).toBeTruthy();
    });

    it("navigates to Login and Signup when buttons are pressed", async () => {
        const { getByTestId } = render(<NavbarLanding />);
        
        await act(async () => {
            fireEvent.press(getByTestId("navbutton-Login"));
        });
        expect(mockNavigate).toHaveBeenCalledWith("Login");

        await act(async () => {
            fireEvent.press(getByTestId("navbutton-Signup"));
        });
        expect(mockNavigate).toHaveBeenCalledWith("Signup");
        expect(mockNavigate).toHaveBeenCalledTimes(2);
    });

    it("matches the snapshot", () => {
        const { toJSON } = render(<NavbarLanding />);
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders buttons with correct text", () => {
        const { getByText } = render(<NavbarLanding />);
        expect(getByText("Login").props.children).toBe("Login");
        expect(getByText("Sign up").props.children).toBe("Sign up");
    })
})