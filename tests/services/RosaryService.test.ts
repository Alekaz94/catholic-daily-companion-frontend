import * as RosaryService from '../../src/services/RosaryService';
import API from '../../src/services/api';

jest.mock('../../src/services/api');

const mockRosary = { userId: "user1", date: "2025-11-20", completed: true };

describe("RosaryService", () => {
    beforeEach(() => jest.clearAllMocks());

    it("marks rosary completed today", async () => {
        (API.post as jest.Mock).mockResolvedValue({ data: mockRosary });

        const result = await RosaryService.completeToday("user1");
        expect(result).toEqual(mockRosary);
    });

    it("returns completed today status as boolean", async () => {
        (API.post as jest.Mock).mockResolvedValue({ data: true });

        const status = await RosaryService.isCompletedToday("user1");
        expect(status).toBe(true);
    });

    it("returns empty history if none exists", async () => {
        (API.get as jest.Mock).mockResolvedValue({ data: [] });

        const history = await RosaryService.getHistory("user1");
        expect(history).toEqual([]);
    });

    it("throws on API error", async () => {
        (API.get as jest.Mock).mockRejectedValue(new Error("Network error"));

        await expect(RosaryService.getHistory("user1")).rejects.toThrow("Network error");
    });
});
