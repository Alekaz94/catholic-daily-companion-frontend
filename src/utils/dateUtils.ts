export const formatSubmittedAt = (submittedAt?: string): string => {
    if(!submittedAt) {
        return "";
    }

    const date = new Date(submittedAt);

    return date.toLocaleString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    });
}