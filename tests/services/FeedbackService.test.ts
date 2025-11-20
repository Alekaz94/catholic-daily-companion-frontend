import * as FeedbackService from '../../src/services/FeedbackService';
import API from '../../src/services/api';
import { Feedback, FeedbackRequest, FeedbackUpdate } from '../../src/models/Feedback';

jest.mock('../../src/services/api');

const mockFeedback: Feedback = {
    id: "1",
    category: "Bug",
    message: "App crashed",
    email: "user@example.com",
    submittedAt: "2025-11-20T12:00:00Z",
    isFixed: false
};

describe("FeedbackService", () => {
    beforeEach(() => jest.clearAllMocks());

    it("sends feedback successfully", async () => {
        const feedbackRequest: FeedbackRequest = {
            category: "Bug",
            message: "App crashed",
            email: "user@example.com"
        };

        (API.post as jest.Mock).mockResolvedValue({ data: mockFeedback });

        const result = await FeedbackService.sendFeedback(feedbackRequest);
        expect(result).toEqual(mockFeedback);
        expect(API.post).toHaveBeenCalledWith("/api/v1/feedback", feedbackRequest);
    });

    it("gets all feedback", async () => {
        (API.get as jest.Mock).mockResolvedValue({ data: [mockFeedback] });

        const result = await FeedbackService.getAllFeedback();
        expect(result).toEqual([mockFeedback]);
    });

    it("gets specific feedback by id", async () => {
        (API.get as jest.Mock).mockResolvedValue({ data: mockFeedback });

        const result = await FeedbackService.getSpecificFeedback("1");
        expect(result).toEqual(mockFeedback);
        expect(API.get).toHaveBeenCalledWith("/api/v1/feedback/1");
    });

    it("updates feedback", async () => {
        const update: FeedbackUpdate = { isFixed: true };
        const updatedFeedback = { ...mockFeedback, isFixed: true };

        (API.put as jest.Mock).mockResolvedValue({ data: updatedFeedback });

        const result = await FeedbackService.updateFeedback("1", update);
        expect(result).toEqual(updatedFeedback);
        expect(API.put).toHaveBeenCalledWith("/api/v1/feedback/1", update);
    });

    it("throws when API fails", async () => {
        (API.get as jest.Mock).mockRejectedValue(new Error("Network error"));
        await expect(FeedbackService.getAllFeedback()).rejects.toThrow("Network error");
    });
});
