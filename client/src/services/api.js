const API_URL = 'http://localhost:3000/api';

const handleApiError = (error) => {
    console.error('API Error:', error);
    if (error.response) {
        throw new Error(error.response.data.message || 'Server error');
    }
    throw new Error(error.message || 'Network error');
};

export const apiService = {
    // Writings
    getAllWritings: async () => {
        try {
            const response = await fetch(`${API_URL}/writings`);
            if (!response.ok) throw new Error('Failed to fetch writings');
            return response.json();
        } catch (error) {
            handleApiError(error);
        }
    },
    getWritingById: async (id) => {
        const response = await fetch(`${API_URL}/writings/${id}`);
        return response.json();
    },

    // Paintings
    getAllPaintings: async () => {
        try {
            const response = await fetch(`${API_URL}/paintings`);
            if (!response.ok) throw new Error('Failed to fetch paintings');
            return response.json();
        } catch (error) {
            handleApiError(error);
        }
    },
    getPaintingById: async (id) => {
        const response = await fetch(`${API_URL}/paintings/${id}`);
        return response.json();
    },

    // Photography
    getAllPhotography: async () => {
        const response = await fetch(`${API_URL}/photography`);
        return response.json();
    },
    getPhotographyById: async (id) => {
        const response = await fetch(`${API_URL}/photography/${id}`);
        return response.json();
    },

    // Music
    getAllMusic: async () => {
        const response = await fetch(`${API_URL}/music`);
        return response.json();
    },
    getMusicById: async (id) => {
        const response = await fetch(`${API_URL}/music/${id}`);
        return response.json();
    },

    // Generic POST method with file upload
    uploadContent: async (type, data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (key === 'file') {
                formData.append('file', data.file);
            } else {
                formData.append(key, data[key]);
            }
        });

        const response = await fetch(`${API_URL}/${type}`, {
            method: 'POST',
            body: formData
        });
        return response.json();
    },

    // Generic DELETE method
    deleteContent: async (type, id) => {
        const response = await fetch(`${API_URL}/${type}/${id}`, {
            method: 'DELETE'
        });
        return response.json();
    }
};