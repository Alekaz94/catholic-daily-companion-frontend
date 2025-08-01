import {
    getAllDailyReadings,
    getReadingById,
    getTodaysReading,
    createDailyReading,
  } from "../../services/dailyReadingService"; // adjust path as needed
  import API from "../../services/api";
  import { DailyReading, NewDailyReading } from "../../models/DailyReading";
  
  jest.mock("../../services/api");
  
  const mockReading: DailyReading = {
    id: "1",
    date: "2025-08-01",
    title: "Daily Bread",
    content: "This is today's reading.",
  };
  
  const mockNewReading: NewDailyReading = {
    date: "2025-08-02",
    title: "Tomorrow's Word",
    content: "A fresh start for the day.",
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