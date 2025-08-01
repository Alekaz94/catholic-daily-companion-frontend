import { act, fireEvent, render } from "@testing-library/react-native";
import EntryDetailModal from "../../components/EntryDetailModal"

const mockJournalEntry = {
    id: "1sad23",
    date: "2025-08-25",
    updatedAt: "2025-08-30",
    title: "Test entry",
    content: "This is the content of the test entry"
}

describe("EntryDetailModal", () => {
    it("does not render if entry is null", () => {
        const { toJSON } = render(
            <EntryDetailModal visible={true} entry={null} onClose={jest.fn()} />
        );
        expect(toJSON()).toBeNull();
    })

    it("does not render content if visible is false", () => {
        const { queryByText } = render(
            <EntryDetailModal visible={false} entry={mockJournalEntry} onClose={jest.fn()} />
        );
    
        expect(queryByText("Test entry")).toBeNull();
    });

    it("renders entry data correctly", () => {
        const { getByText } = render(
            <EntryDetailModal visible={true} entry={mockJournalEntry} onClose={jest.fn()} />
        )
        expect(getByText("Test entry")).toBeTruthy();
        expect(getByText("2025-08-30")).toBeTruthy();
        expect(getByText("This is the content of the test entry")).toBeTruthy();
    })

    it("calls onClose when Close button is pressed", async () => {
        const onCloseMock = jest.fn();
        const { getByText} = render(
            <EntryDetailModal visible={true} entry={mockJournalEntry} onClose={onCloseMock} />
        );

        await act(async () => {
            fireEvent.press(getByText("Close"));
        });
        expect(onCloseMock).toHaveBeenCalled();
    });

    it("can handle multiple close button presses", async () => {
        const onCloseMock = jest.fn();
        const { getByText } = render(
            <EntryDetailModal visible={true} entry={mockJournalEntry} onClose={onCloseMock} />
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
            <EntryDetailModal visible={true} entry={mockJournalEntry} onClose={jest.fn()} />
        );
        expect(toJSON()).toMatchSnapshot();
    });
})