import { JournalPrompts } from "../data/prompts";

export const getDailyPrompt = () => {
    const date = new Date();
    const index = date.getDate() % JournalPrompts.length;
    return JournalPrompts[index];
}