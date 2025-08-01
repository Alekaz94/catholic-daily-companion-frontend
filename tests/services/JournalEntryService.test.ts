import {
    getAllEntries,
    getSpecificEntry,
    createEntry,
    updateEntry,
    deleteEntry
} from "../../services/JournalEntryService";
import API from "../../services/api";
import { JournalEntry } from "../../models/JournalEntry";
  
jest.mock("../../services/api");
  
const mockEntry: JournalEntry = {
    id: "entry1",
    title: "Prayer Reflection",
    content: "God is love",
    date: "2025-08-01",
    updatedAt: "2025-08-02"
};

describe("journalEntryService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    it("fetches all journal entries", async () => {
        (API.get as jest.Mock).mockResolvedValue({ data: [mockEntry] });
    
        const result = await getAllEntries();
        expect(API.get).toHaveBeenCalledWith("/api/v1/journal-entry");
        expect(result).toEqual([mockEntry]);
    });
    
    it("gets specific entry by ID", async () => {
        (API.get as jest.Mock).mockResolvedValue({ data: mockEntry });
    
        const result = await getSpecificEntry("entry1");
        expect(API.get).toHaveBeenCalledWith("/api/v1/journal-entry/entry1");
        expect(result).toEqual(mockEntry);
    });
    
    it("creates a new journal entry", async () => {
        (API.post as jest.Mock).mockResolvedValue({ data: mockEntry });
    
        const newEntry = { title: "Peace", content: "Found peace today", date: "2025-08-02" };
        const result = await createEntry(newEntry);
        expect(API.post).toHaveBeenCalledWith("/api/v1/journal-entry", newEntry);
        expect(result).toEqual(mockEntry);
    });
    
    it("updates a journal entry", async () => {
        (API.put as jest.Mock).mockResolvedValue({ data: mockEntry });
    
        const updateData = { title: "Updated Title", content: "Updated", date: "2025-08-01" };
        const result = await updateEntry("entry1", updateData);
        expect(API.put).toHaveBeenCalledWith("/api/v1/journal-entry/entry1", updateData);
        expect(result).toEqual(mockEntry);
    });
    
    it("deletes a journal entry", async () => {
        (API.delete as jest.Mock).mockResolvedValue(undefined);
    
        await deleteEntry("entry1");
        expect(API.delete).toHaveBeenCalledWith("/api/v1/journal-entry/entry1");
    });
}) 