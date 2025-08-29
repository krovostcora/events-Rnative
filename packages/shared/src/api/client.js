// packages/shared/src/api/client.js

const BASE_URL = "https://events-server-eu5z.onrender.com/api/events";

const apiClient = {
    // all events
    getEvents: async () => {
        const response = await fetch(BASE_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    },

    // certain event by id
    getEvent: async (id) => {
        const response = await fetch(`${BASE_URL}/${id}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    }
};

export default apiClient;
