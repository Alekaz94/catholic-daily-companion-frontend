import AsyncStorage from '@react-native-async-storage/async-storage';
import { cacheSaints, getCachedSaints, clearCachedSaints } from '../../src/services/CacheService';
import { Saint } from '../../src/models/Saint';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const mockSaints: Saint[] = [
  {
    id: "1",
    name: "Saint Peter",
    birthYear: 1,
    deathYear: 64,
    feastDay: "2023-06-29",
    biography: "Test biography",
    patronage: "Fishermen",
    canonizationYear: 100,
    imageUrl: null,
    imageAuthor: null,
    imageSource: null,
    imageLicence: null
  },
  {
    id: "2",
    name: "Saint Paul",
    birthYear: 5,
    deathYear: 67,
    feastDay: "2023-06-29",
    biography: "Test biography",
    patronage: "Missionaries",
    canonizationYear: 100,
    imageUrl: null,
    imageAuthor: null,
    imageSource: null,
    imageLicence: null
  }
];

describe("SaintCacheService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("cacheSaints", () => {
    it("stores saints array in AsyncStorage", async () => {
      await cacheSaints(mockSaints);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "cached_saints",
        JSON.stringify(mockSaints)
      );
    });

    it("logs error if AsyncStorage.setItem fails", async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error("Failed"));
      await cacheSaints(mockSaints);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  describe("getCachedSaints", () => {
    it("returns saints array if present", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockSaints));
      const saints = await getCachedSaints();
      expect(saints).toEqual(mockSaints);
    });

    it("returns null if no data found", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      const saints = await getCachedSaints();
      expect(saints).toBeNull();
    });

    it("handles JSON parse errors gracefully", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue("invalid json");
      const saints = await getCachedSaints();
      expect(saints).toBeNull();
    });

    it("logs error if AsyncStorage.getItem throws", async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error("Failed"));
      const saints = await getCachedSaints();
      expect(saints).toBeNull();
    });
  });

  describe("clearCachedSaints", () => {
    it("removes saints cache", async () => {
      await clearCachedSaints();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith("cached_saints");
    });

    it("logs error if AsyncStorage.removeItem fails", async () => {
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValue(new Error("Failed"));
      await clearCachedSaints();
      expect(AsyncStorage.removeItem).toHaveBeenCalled();
    });
  });
});
