import axios from "axios";

const API_BASE_URL = "https://rtut-app-admin-server-c2d4ae9d37ae.herokuapp.com"; // Your Express server URL

export const chatWithAI = async (question) => {
    try {
        console.log(`${API_BASE_URL}/chat`);
        console.log(question);
        const response = await axios.post(`${API_BASE_URL}/chat`, { query: question });
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching chat response:", error);
        return { error: "Failed to get response. Please try again." };
    }
};

export const searchPolicy = async (query) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/search`, { query });
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching search results:", error);
        return { error: "Failed to search policy." };
    }
};
