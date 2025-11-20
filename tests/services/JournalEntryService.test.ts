import {
    getAllEntries,
    getSpecificEntry,
    createEntry,
    updateEntry,
    deleteEntry,
    getJournalDates,
    getJournalEntriesByDate
  } from "../../src/services/JournalEntryService";
  import API from "../../src/services/api";
  import { JournalEntry } from "../../src/models/JournalEntry";
  
  jest.mock("../../src/services/api");
  
const mockEntry: JournalEntry = {
    id: "entry1",
    title: "Prayer Reflection",
    content: "God is love",
    date: "2025-08-01",
    updatedAt: "2025-08-02"
};

describe("JournalEntryService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    describe("getAllEntries", () => {
        it("fetches all journal entries", async () => {
            (API.get as jest.Mock).mockResolvedValue({ data: [mockEntry] });
      
            const result = await getAllEntries(1, 10, "date,desc");
            expect(API.get).toHaveBeenCalledWith("/api/v1/journal-entry?page=1&size=10&sort=date,desc");
            expect(result).toEqual([mockEntry]);
        });

        it("returns empty array if no entries", async () => {
            (API.get as jest.Mock).mockResolvedValue({ data: [] });
            const result = await getAllEntries(1, 10, "date,desc");
            expect(result).toEqual([]);
        })

        it("throws if API call fails", async () => {
            (API.get as jest.Mock).mockRejectedValue(new Error("Network error"));
            await expect(getAllEntries(1, 10, "date,desc")).rejects.toThrow("Network error");
        })
    });

    describe("getSpecificEntry", () => {
        it("gets specific entry by ID", async () => {
            (API.get as jest.Mock).mockResolvedValue({ data: mockEntry });

            const result = await getSpecificEntry("entry1");
            expect(API.get).toHaveBeenCalledWith("/api/v1/journal-entry/entry1");
            expect(result).toEqual(mockEntry);
        });

        it("throws if API returns error", async () => {
            (API.get as jest.Mock).mockRejectedValue(new Error("Network error"));
            await expect(getSpecificEntry("invalid-id")).rejects.toThrow("Network error");
        });
    });

    describe("createEntry", () => {
        it("creates a new journal entry", async () => {
            const newEntry = { title: "Peace", content: "Found peace today", date: "2025-10-18" };

            (API.post as jest.Mock).mockResolvedValue({ data: mockEntry });

            const result = await createEntry(newEntry);

            expect(API.post).toHaveBeenCalledWith("/api/v1/journal-entry", newEntry);
            expect(result).toEqual(mockEntry);
        });

        it("throws if API call fails", async () => {
            (API.post as jest.Mock).mockRejectedValue(new Error("Failed to create"));
            const newEntry = { title: "Peace", content: "Found peace today", date: "2025-08-02" };
            await expect(createEntry(newEntry)).rejects.toThrow("Failed to create");
        });
    })

    describe("updateEntry", () => {
        it("updates a journal entry", async () => {
            const updateData = { title: "Updated title", content: "Updated content", date: "2025-10-18"};
            (API.put as jest.Mock).mockResolvedValue({ data: updateData });
            
            const result = await updateEntry("entry1", updateData);
            expect(API.put).toHaveBeenCalledWith("/api/v1/journal-entry/entry1", updateData);
            expect(result).toEqual(updateData);
        });

        it("throws if API call fails", async () => {
            (API.put as jest.Mock).mockRejectedValue(new Error("Update failed"));
            await expect(updateEntry("entry1", {title: "", content: ""})).rejects.toThrow("Update failed");
        });
    });

    describe("deleteEntry", () => {
        it("deletes a journal entry", async () => {
            (API.delete as jest.Mock).mockResolvedValue(undefined);

            await deleteEntry("entry1");
            expect(API.delete).toHaveBeenCalledWith("/api/v1/journal-entry/entry1");
        });

        it("throws if API call fails", async () => {
            (API.delete as jest.Mock).mockRejectedValue(new Error("Delete failed"));
            await expect(deleteEntry("entry1")).rejects.toThrow("Delete failed");
        });
    });

    describe("getJournalDates", () => {
        it("fetches dates", async () => {
            (API.get as jest.Mock).mockResolvedValue({ data: ["2025-10-18"] });

            const dates = await getJournalDates();
            expect(API.get).toHaveBeenCalledWith("/api/v1/journal-entry/dates");
            expect(dates).toEqual(["2025-10-18"]);
        });

        it("returns empty array if no dates", async () => {
            (API.get as jest.Mock).mockResolvedValue({ data: [] });
            const dates = await getJournalDates();
            expect(dates).toEqual([]);
        });
    });

    describe("getJournalEntriesByDate", () => {
        it("fetches entries by date", async () => {
            (API.get as jest.Mock).mockResolvedValue({ data: [mockEntry] });
            const entries = await getJournalEntriesByDate("2025-08-01");
            expect(API.get).toHaveBeenCalledWith("/api/v1/journal-entry/dates/2025-08-01");
            expect(entries).toEqual([mockEntry]);
        });
      
      it("returns null if API returns null", async () => {
        (API.get as jest.Mock).mockResolvedValue({ data: null });
        const entries = await getJournalEntriesByDate("2025-08-01");
        expect(entries).toBeNull();
      });
      
        it("throws if API call fails", async () => {
        (API.get as jest.Mock).mockRejectedValue(new Error("Fetch failed"));
        await expect(getJournalEntriesByDate("2025-08-01")).rejects.toThrow("Fetch failed");
      });
    });
}) 