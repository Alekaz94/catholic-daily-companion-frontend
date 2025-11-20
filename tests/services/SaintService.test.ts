import {
  getAllSaints,
  searchSaints,
  getSpecificSaint,
  getSaintOfTheDay,
  createSaint,
  updateSaint,
  deleteSaint,
  getSaintByFeastDay,
  getSaintsByMonth,
  getFeastDayToSaintMap
} from "../../src/services/SaintService";
import API from "../../src/services/api";
import { Saint, NewSaint, UpdatedSaint } from "../../src/models/Saint";

jest.mock("../../src/services/api");

const mockSaint: Saint = {
  id: "1",
  name: "Saint Augustine",
  birthYear: 354,
  deathYear: 430,
  feastDay: "08-28",
  biography: "Bishop and Doctor of the Church.",
  patronage: "Theologians, printers",
  canonizationYear: 1298,
  imageUrl: "https://example.com/augustine.jpg",
  imageAuthor: null,
  imageLicence: null,
  imageSource: null
};

describe("SaintService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllSaints", () => {
    it("fetches paginated saints", async () => {
      (API.get as jest.Mock).mockResolvedValue({ data: [mockSaint] });
      const result = await getAllSaints(0, 10);
      expect(API.get).toHaveBeenCalledWith("/api/v1/saint?page=0&size=10");
      expect(result).toEqual([mockSaint]);
    });

    it("returns empty array if no saints", async () => {
      (API.get as jest.Mock).mockResolvedValue({ data: [] });
      const result = await getAllSaints(0, 10);
      expect(result).toEqual([]);
    });

    it("throws if API fails", async () => {
      (API.get as jest.Mock).mockRejectedValue(new Error("Network error"));
      await expect(getAllSaints(0, 10)).rejects.toThrow("Network error");
    });
  });

  describe("searchSaints", () => {
    it("returns paginated search results", async () => {
      (API.get as jest.Mock).mockResolvedValue({
        data: { content: [mockSaint], totalPages: 1, totalElements: 1, size: 10, number: 0 }
      });
      const result = await searchSaints("augustine", 0, 10);
      expect(API.get).toHaveBeenCalledWith("/api/v1/saint", { params: { query: "augustine", page: 0, size: 10 } });
      expect(result.content[0]).toEqual(mockSaint);
    });

    it("returns empty content if nothing found", async () => {
      (API.get as jest.Mock).mockResolvedValue({ data: { content: [], totalPages: 0, totalElements: 0, size: 10, number: 0 } });
      const result = await searchSaints("unknown", 0, 10);
      expect(result.content).toEqual([]);
    });

    it("throws if API fails", async () => {
      (API.get as jest.Mock).mockRejectedValue(new Error("Search failed"));
      await expect(searchSaints("augustine", 0, 10)).rejects.toThrow("Search failed");
    });
  });

  describe("getSpecificSaint", () => {
    it("fetches a saint by ID", async () => {
      (API.get as jest.Mock).mockResolvedValue({ data: mockSaint });
      const result = await getSpecificSaint("1");
      expect(API.get).toHaveBeenCalledWith("/api/v1/saint/1");
      expect(result).toEqual(mockSaint);
    });

    it("throws if ID not found", async () => {
      (API.get as jest.Mock).mockRejectedValue(new Error("Not found"));
      await expect(getSpecificSaint("invalid")).rejects.toThrow("Not found");
    });
  });

  describe("getSaintOfTheDay", () => {
    it("returns saint of the day", async () => {
      (API.get as jest.Mock).mockResolvedValue({ data: [mockSaint] });
      const result = await getSaintOfTheDay();
      expect(API.get).toHaveBeenCalledWith("/api/v1/saint/today");
      expect(result).toEqual([mockSaint]);
    });

    it("returns empty array if none", async () => {
      (API.get as jest.Mock).mockResolvedValue({ data: [] });
      const result = await getSaintOfTheDay();
      expect(result).toEqual([]);
    });

    it("throws if API fails", async () => {
      (API.get as jest.Mock).mockRejectedValue(new Error("Fetch failed"));
      await expect(getSaintOfTheDay()).rejects.toThrow("Fetch failed");
    });
  });

  describe("createSaint", () => {
    const newSaint: NewSaint = {
      name: "Saint New",
      birthYear: 1200,
      deathYear: 1260,
      feastDay: "01-01",
      biography: "New biography.",
      patronage: "Peace",
      canonizationYear: 1300,
      imageUrl: null
    };

    it("creates a new saint", async () => {
      (API.post as jest.Mock).mockResolvedValue({ data: mockSaint });
      const result = await createSaint(newSaint);
      expect(API.post).toHaveBeenCalledWith("/api/v1/saint", newSaint);
      expect(result).toEqual(mockSaint);
    });

    it("throws if API fails", async () => {
      (API.post as jest.Mock).mockRejectedValue(new Error("Create failed"));
      await expect(createSaint(newSaint)).rejects.toThrow("Create failed");
    });
  });

  describe("updateSaint", () => {
    const updated: UpdatedSaint = { biography: "Updated bio" };

    it("updates a saint", async () => {
      (API.put as jest.Mock).mockResolvedValue({ data: mockSaint });
      const result = await updateSaint("1", updated);
      expect(API.put).toHaveBeenCalledWith("/api/v1/saint/1", updated);
      expect(result).toEqual(mockSaint);
    });

    it("throws if API fails", async () => {
      (API.put as jest.Mock).mockRejectedValue(new Error("Update failed"));
      await expect(updateSaint("1", updated)).rejects.toThrow("Update failed");
    });
  });

  describe("deleteSaint", () => {
    it("deletes a saint", async () => {
      (API.delete as jest.Mock).mockResolvedValue(undefined);
      await deleteSaint("1");
      expect(API.delete).toHaveBeenCalledWith("/api/v1/saint/1");
    });

    it("throws if API fails", async () => {
      (API.delete as jest.Mock).mockRejectedValue(new Error("Delete failed"));
      await expect(deleteSaint("1")).rejects.toThrow("Delete failed");
    });
  });

  describe("getSaintByFeastDay", () => {
    it("fetches saints by feast code", async () => {
      (API.get as jest.Mock).mockResolvedValue({ data: [mockSaint] });
      const result = await getSaintByFeastDay("08-28");
      expect(API.get).toHaveBeenCalledWith("/api/v1/saint/feast/08-28");
      expect(result).toEqual([mockSaint]);
    });

    it("returns empty array if none", async () => {
      (API.get as jest.Mock).mockResolvedValue({ data: [] });
      const result = await getSaintByFeastDay("01-01");
      expect(result).toEqual([]);
    });
  });

  describe("getSaintsByMonth", () => {
    it("returns saints for month", async () => {
      (API.get as jest.Mock).mockResolvedValue({ data: [mockSaint] });
      const result = await getSaintsByMonth("2025", "08");
      expect(result).toEqual([mockSaint]);
    });

    it("returns null if no saints", async () => {
      (API.get as jest.Mock).mockResolvedValue({ data: null });
      const result = await getSaintsByMonth("2025", "08");
      expect(result).toBeNull();
    });
  });

  describe("getFeastDayToSaintMap", () => {
    it("returns feast day map", async () => {
      const map = { "08-28": ["Saint Augustine"] };
      (API.get as jest.Mock).mockResolvedValue({ data: map });
      const result = await getFeastDayToSaintMap();
      expect(result).toEqual(map);
    });

    it("throws if API fails", async () => {
      (API.get as jest.Mock).mockRejectedValue(new Error("Fetch failed"));
      await expect(getFeastDayToSaintMap()).rejects.toThrow("Fetch failed");
    });
  });
});
