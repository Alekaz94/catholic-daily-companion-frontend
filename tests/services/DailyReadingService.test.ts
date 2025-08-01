import {
  getAllDailyReadings,
  getReadingById,
  getTodaysReading,
  createDailyReading,
} from "../../services/DailyReadingService";
import API from "../../services/api";
import { DailyReading, NewDailyReading } from "../../models/DailyReading";
  
jest.mock("../../services/api");
  
const mockReading: DailyReading = {
  id: "1",
  createdAt: "2025-08-01",
  firstReading: "Genesis 1:1-10",
  secondReading: "Romans 8:1-11",
  psalm: "Psalm 23",
  gospel: "John 1:1-18",
};
  
const mockNewReading: NewDailyReading = {
  firstReading: "Exodus 2:1-10",
  secondReading: "Hebrews 11:1-3",
  psalm: "Psalm 91",
  gospel: "Matthew 5:1-12",
};

  describe("getAllDailyReadings", () => {
    it("returns a list of daily readings", async () => {
        (API.get as jest.Mock).mockResolvedValue({ data: [mockReading] });

        const result = await getAllDailyReadings();
        expect(API.get).toHaveBeenCalledWith("/api/v1/daily-reading");
        expect(result).toEqual([mockReading]);
    })

    it("throws an error if the request fails", async () => {
        (API.get as jest.Mock).mockRejectedValue(new Error("Network error"));

        await expect(getAllDailyReadings()).rejects.toThrow("Network error");
    })
  });

  describe("getReadingById", () => {
    it("returns a single daily reading by ID", async () => {
        (API.get as jest.Mock).mockResolvedValue({ data: mockReading });

        const result = await getReadingById("1");
        expect(API.get).toHaveBeenCalledWith("/api/v1/daily-reading/1");
        expect(result).toEqual(mockReading);
    });

    it("returns today's reading", async () => {
        (API.get as jest.Mock).mockResolvedValue({ data: mockReading });

        const result = await getTodaysReading();
        expect(API.get).toHaveBeenCalledWith("/api/v1/daily-reading/today");
        expect(result).toEqual(mockReading);
    });
  });

  describe("createDailyReading", () => {
    it("creates a new daily reading", async () => {
        (API.post as jest.Mock).mockResolvedValue({ data: mockReading });

        const result = await createDailyReading(mockNewReading);
        expect(API.post).toHaveBeenCalledWith("/api/v1/daily-reading", mockNewReading);
        expect(result).toEqual(mockReading)
    })
  })