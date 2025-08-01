import {
    getAllSaints,
    searchSaints,
    getSpecificSaint,
    getSaintOfTheDay,
    createSaint
} from "../../services/saintService";
import API from "../../services/api";
import { Saint } from "../../models/Saint";

jest.mock("../../services/api");

const mockSaint: Saint = {
    id: "1",
    name: "Saint Augustine",
    birthYear: 354,
    deathYear: 430,
    feastDay: "08-28",
    biography: "Bishop and Doctor of the Church.",
    patronage: "Theologians, printers",
    canonizationYear: 1298,
    imageUrl: "https://example.com/augustine.jpg"
};

describe("saintService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    it("fetches paginated saints", async () => {
        (API.get as jest.Mock).mockResolvedValue({ data: [mockSaint] });
    
        const result = await getAllSaints(0, 10);
        expect(API.get).toHaveBeenCalledWith("/api/v1/saint?page=0&size=10");
        expect(result).toEqual([mockSaint]);
      });
    
      it("searches saints", async () => {
        (API.get as jest.Mock).mockResolvedValue({
          data: {
            content: [mockSaint],
            totalPages: 1,
            totalElements: 1,
            size: 10,
            number: 0,
          }
        });
    
        const result = await searchSaints("augustine", 0, 10);
        expect(API.get).toHaveBeenCalledWith("/api/v1/saint", {
          params: { query: "augustine", page: 0, size: 10 },
        });
        expect(result.content[0]).toEqual(mockSaint);
      });
    
      it("gets a specific saint by ID", async () => {
        (API.get as jest.Mock).mockResolvedValue({ data: mockSaint });
    
        const result = await getSpecificSaint("1");
        expect(API.get).toHaveBeenCalledWith("/api/v1/saint/1");
        expect(result).toEqual(mockSaint);
      });
    
      it("gets saint of the day", async () => {
        (API.get as jest.Mock).mockResolvedValue({ data: mockSaint });
    
        const result = await getSaintOfTheDay();
        expect(API.get).toHaveBeenCalledWith("/api/v1/saint/today");
        expect(result).toEqual(mockSaint);
      });
    
      it("creates a new saint", async () => {
        const newSaint: NewSaint = {
          name: "Saint New",
          birthYear: 1200,
          deathYear: 1260,
          feastDay: "01-01",
          biography: "New biography.",
          patronage: "Peace",
          canonizationYear: 1300,
          imageUrl: null,
        };
    
        (API.post as jest.Mock).mockResolvedValue({ data: mockSaint });
    
        const result = await createSaint(newSaint);
        expect(API.post).toHaveBeenCalledWith("/api/v1/saint", newSaint);
        expect(result).toEqual(mockSaint);
      });
})