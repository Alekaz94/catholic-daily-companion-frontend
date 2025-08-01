import { act, fireEvent, render } from "@testing-library/react-native";
import DailyReadingDetailModal from "../../components/DailyReadingDetailModal";
import { DailyReading } from "../../models/DailyReading";

const mockReading: DailyReading = {
    id: "string",
    createdAt: "2025-05-16",
    firstReading: "Exodus",
    secondReading: "Hebrews",
    psalm: "Psalm 123",
    gospel: "John"
};

describe("DailyReadingDetailModal", () => {
    it("does not render if daily reading is null", () => {
        const { toJSON } = render(
            <DailyReadingDetailModal visible={true} reading={null} onClose={jest.fn()} />
        );
        expect(toJSON()).toBeNull();
    })

    it("does not render content if visible is false", () => {
        const { queryByText } = render(
            <DailyReadingDetailModal visible={false} reading={null} onClose={jest.fn()} />
        );
    
        expect(queryByText("Test entry")).toBeNull();
    });

    it("renders daily reading data correctly", () => {
        const { getByText } = render(
            <DailyReadingDetailModal visible={true} reading={mockReading} onClose={jest.fn()} />
        )
        expect(getByText("Today's readings")).toBeTruthy();
        expect(getByText("2025-05-16")).toBeTruthy();
        expect(getByText("First reading")).toBeTruthy();
        expect(getByText("Exodus")).toBeTruthy();
        expect(getByText("Second reading")).toBeTruthy();
        expect(getByText("Hebrews")).toBeTruthy();
        expect(getByText("Psalm")).toBeTruthy();
        expect(getByText("Psalm 123")).toBeTruthy();
        expect(getByText("Gospel reading")).toBeTruthy();
        expect(getByText("John")).toBeTruthy();
    })

    it("calls onClose when Close button is pressed", async () => {
        const onCloseMock = jest.fn();
        const { getByText } = render(
            <DailyReadingDetailModal visible={true} reading={mockReading} onClose={onCloseMock} />
        )
        
        await act(async () => {
            fireEvent.press(getByText("Close"));
        })
        expect(onCloseMock).toHaveBeenCalled();
    })

    it("renders no second reading if second reading is null", () => {
        const reading = {...mockReading, secondReading: null};
        const { queryByText } = render(
            <DailyReadingDetailModal visible={true} reading={reading} onClose={jest.fn()} />
        )
        expect(queryByText("Second reading")).toBeNull();
        expect(queryByText("First reading")).toBeTruthy();
        expect(queryByText("Psalm")).toBeTruthy();
        expect(queryByText("Gospel reading")).toBeTruthy();
    })

    it("can handle multiple close button presses", async () => {
        const onCloseMock = jest.fn();
        const { getByText } = render(
            <DailyReadingDetailModal visible={true} reading={mockReading} onClose={onCloseMock} />
        );
    
        const closeButton = getByText("Close");
    
        await act(async () => {
            fireEvent.press(closeButton);
            fireEvent.press(closeButton);
        });
    
        expect(onCloseMock).toHaveBeenCalledTimes(2);
    });

    it("matches the snapshot", () => {
        const { toJSON } = render(
            <DailyReadingDetailModal visible={true} reading={mockReading} onClose={jest.fn()} />
        );
        expect(toJSON()).toMatchSnapshot();
    });
})