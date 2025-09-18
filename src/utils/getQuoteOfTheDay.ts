import { dailyQuotes } from "../data/quotes";

export const getQuoteOfTheDay = () => {
    const date = new Date();
    const index = date.getDate() % dailyQuotes.length;
    return dailyQuotes[index];
}