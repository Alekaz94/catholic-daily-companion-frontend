import { useNavigation, useRoute } from "@react-navigation/native"
import Navbar from "../../components/Navbar";
import { act, fireEvent, render } from "@testing-library/react-native";

type MockNavButtonProps = {
    title: string;
    screen: string;
}

jest.mock("@react-navigation/native", () => ({
    useNavigation: jest.fn(),
    useRoute: jest.fn(),
}));

jest.mock("../../components/NavButton", () => {
    return ({ title, screen }: MockNavButtonProps) => {
        const React = require("react");
      const { Text, TouchableOpacity } = require("react-native");
      return (
        <TouchableOpacity testID={`navbutton-${screen}`}>
          <Text>{title}</Text>
        </TouchableOpacity>
      );
    };
});

jest.mock("@expo/vector-icons", () => {
    const React = require("react");
    return {
      Ionicons: (props: any) => {
        const { Text, TouchableOpacity } = require("react-native");
        return (
          <TouchableOpacity testID="profile-icon" onPress={props.onPress}>
            <Text>MockIcon</Text>
          </TouchableOpacity>
        );
      },
    };
  });

describe("Navbar", () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate});
    });

    it("renders correct buttons and background for Home route", () => {
        (useRoute as jest.Mock).mockReturnValue({ name: "Home" });
        const { getByText, getByTestId } = render(<Navbar />);
        const container = getByTestId("navbar-container");

        expect(container.props.style).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ backgroundColor: "#FAF3E0"}),
            ]),
        );
        expect(getByText("Home")).toBeTruthy();
        expect(getByText("Saints")).toBeTruthy();
        expect(getByText("Mass readings")).toBeTruthy();
        expect(getByText("My journal")).toBeTruthy();
    })

    it("navigates to Profile when Ionicons pressed", async () => {
        (useRoute as jest.Mock).mockReturnValue({ name: "Home" });
        const { getByTestId } = render(<Navbar />);
        const profileIcon = getByTestId("profile-icon");

        await act(async () => {
            fireEvent.press(profileIcon);
        });

        expect(mockNavigate).toHaveBeenCalledWith("Profile");
    })

    it("renders buttons for other routes (e.g. Journal) with correct background", () => {
        (useRoute as jest.Mock).mockReturnValue({ name: "Journal" });
        const { getByText, getByTestId } = render(<Navbar />);
        const container = getByTestId("navbar-container");

        expect(container.props.style).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ backgroundColor: "#B794F4" })
            ])
        );
        expect(getByText("Home")).toBeTruthy();
        expect(getByText("Saints")).toBeTruthy();
        expect(getByText("Mass readings")).toBeTruthy();
        expect(getByText("My journal")).toBeTruthy();
    })
})