import { act, fireEvent, render } from "@testing-library/react-native"
import JournalEntryUpdateModal from "../../components/JournalEntryUpdateModal"

const mockJournalEntry = {
    id: "1sad23",
    date: "2025-08-25",
    updatedAt: "2025-08-30",
    title: "Test entry",
    content: "This is the content of the test entry"
}

const mockUpdatedJournalEntry = {
    title: "Updated Entry Title",
    content: "Updated content to test entry"
}

describe("JournalEntryUpdateModal", () => {
    it("does not render when entry is null", () => {
        const { toJSON } = render(
            <JournalEntryUpdateModal 
                visible={true}
                entry={null}
                onClose={jest.fn()}
                onUpdate={jest.fn()}
            />
        )
        expect(toJSON()).toBeNull();
    });

    it("does not render content if visible is false", () => {
        const { queryByText } = render(
            <JournalEntryUpdateModal 
                visible={false}
                entry={mockJournalEntry}
                onClose={jest.fn()}
                onUpdate={jest.fn()}
            />        
        );
        expect(queryByText("Test entry")).toBeNull();
    });

    it("renders input fields with entry data", () => {
        const { getByDisplayValue } = render(
            <JournalEntryUpdateModal 
                visible={true}
                entry={mockJournalEntry}
                onClose={jest.fn()}
                onUpdate={jest.fn()}
            />
        );
        expect(getByDisplayValue("Test entry")).toBeTruthy();
        expect(getByDisplayValue("This is the content of the test entry")).toBeTruthy();
    })

    it("calls onClose when Close button is pressed", async () => {
        const onCloseMock = jest.fn();
        const { getByText } = render(
            <JournalEntryUpdateModal 
                visible={true}
                entry={mockJournalEntry}
                onClose={onCloseMock}
                onUpdate={jest.fn()}
            />
        )
        
        await act(async () => {
            fireEvent.press(getByText("Cancel"));
        })
        expect(onCloseMock).toHaveBeenCalled();
    })

    it("calls onUpdate and onClose with trimmed, changed values", async () => {
        globalThis.alert = jest.fn();
        const onCloseMock = jest.fn();
        const onUpdateMock = jest.fn();
        const { getByText, getByPlaceholderText } = render(
            <JournalEntryUpdateModal 
                visible={true}
                entry={mockJournalEntry}
                onClose={onCloseMock}
                onUpdate={onUpdateMock}
            />
        )

        await act( async () => {
            fireEvent.changeText(getByPlaceholderText("Enter title..."), "Updated Entry Title");
            fireEvent.changeText(getByPlaceholderText("Write your journal entry..."), "Updated content to test entry");
        })
        expect(getByPlaceholderText("Enter title...").props.value).toBe("Updated Entry Title");
        expect(getByPlaceholderText("Write your journal entry...").props.value).toBe("Updated content to test entry");

        await act(async () => {
            fireEvent.press(getByText("Save changes"));
        })
        expect(globalThis.alert).toHaveBeenCalledWith("Update successful!");
        expect(onUpdateMock).toHaveBeenCalledWith(mockJournalEntry.id, mockUpdatedJournalEntry);
        expect(onCloseMock).toHaveBeenCalled();
    })

    it("shows alert and does not call onUpdate if no changes are made", async () => {
        globalThis.alert = jest.fn();

        const { getByText } = render(
            <JournalEntryUpdateModal 
                visible={true}
                entry={mockJournalEntry}
                onClose={jest.fn()}
                onUpdate={jest.fn()}
            />
        )

        await act(async () => {
            fireEvent.press(getByText("Save changes"));
        })
        expect(globalThis.alert).toHaveBeenCalledWith("No changes detected.")
    })

    it("shows alert if both title and content fields are empty", async () => {
        globalThis.alert = jest.fn();

        const { getByText, getByPlaceholderText } = render(
            <JournalEntryUpdateModal 
                visible={true}
                entry={mockJournalEntry}
                onClose={jest.fn()}
                onUpdate={jest.fn()}
            />
        )
        const titleInput = getByPlaceholderText("Enter title...");
        const contentInput = getByPlaceholderText("Write your journal entry...");

        await act(async () => {
            fireEvent.changeText(titleInput, "");
        })

        await act(async () => {
            fireEvent.changeText(contentInput, "");
        })
        await act(async () => {
            fireEvent.press(getByText("Save changes"));
        })
        expect(globalThis.alert).toHaveBeenCalledWith("Both title and content are empty. No changes saved.")
    })

    it("matches the snapshot", () => {
        const { toJSON } = render(
            <JournalEntryUpdateModal 
                visible={true}
                entry={mockJournalEntry}
                onClose={jest.fn()}
                onUpdate={jest.fn()}
            />        
        );
        expect(toJSON()).toMatchSnapshot();
    });
})