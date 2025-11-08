import API from "./api";

const endpoint = "/api/v1/user";

export const downloadUserDataJson = async (userId: string): Promise<ArrayBuffer> => {
    const res = await API.get(`${endpoint}/export-data/${userId}`, {
        responseType: "arraybuffer",
    });
    return res.data;
}

export const downloadUserDataZip = async (userId: string): Promise<ArrayBuffer> => {
    const res = await API.get(`${endpoint}/export-data-zip/${userId}`, {
        responseType: "arraybuffer",
    });
    return res.data;
}