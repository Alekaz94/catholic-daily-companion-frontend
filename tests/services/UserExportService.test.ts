import API from '../../src/services/api';
import { downloadUserDataJson, downloadUserDataZip } from '../../src/services/UserExportService';

jest.mock('../../src/services/api');

describe("UserService - data downloads", () => {
    beforeEach(() => jest.clearAllMocks());

    const userId = "1";
    const mockData = new ArrayBuffer(8);

    it("downloads JSON data successfully", async () => {
        (API.get as jest.Mock).mockResolvedValue({ data: mockData });

        const result = await downloadUserDataJson(userId);
        expect(result).toBe(mockData);
        expect(API.get).toHaveBeenCalledWith(`/api/v1/user/export-data/${userId}`, { responseType: "arraybuffer" });
    });

    it("downloads ZIP data successfully", async () => {
        (API.get as jest.Mock).mockResolvedValue({ data: mockData });

        const result = await downloadUserDataZip(userId);
        expect(result).toBe(mockData);
        expect(API.get).toHaveBeenCalledWith(`/api/v1/user/export-data-zip/${userId}`, { responseType: "arraybuffer" });
    });

    it("throws error if API call fails", async () => {
        (API.get as jest.Mock).mockRejectedValue(new Error("Network error"));

        await expect(downloadUserDataJson(userId)).rejects.toThrow("Network error");
        await expect(downloadUserDataZip(userId)).rejects.toThrow("Network error");
    });
});
