const API_URL = 'http://localhost:3000/api';

const handleApiError = (error) => {
    console.error('API Error:', error);
    if (error.response) {
        throw new Error(error.response.data.message || 'Server error');
    }
    throw new Error(error.message || 'Network error');
};

// Map frontend types to backend endpoints
const endpointMap = {
    photo: 'photography',
    artwork: 'paintings',
    music: 'music',
    writing: 'writings'
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
        try {
            const response = await fetch(`${API_URL}/photography`);
            if (!response.ok) throw new Error('Failed to fetch photography');
            return response.json();
        } catch (error) {
            handleApiError(error);
        }
    },
    getPhotographyById: async (id) => {
        const response = await fetch(`${API_URL}/photography/${id}`);
        return response.json();
    },

    // Music
    getAllMusic: async () => {
        try {
            const response = await fetch(`${API_URL}/music`);
            if (!response.ok) throw new Error('Failed to fetch music');
            return response.json();
        } catch (error) {
            handleApiError(error);
        }
    },
    getMusicById: async (id) => {
        const response = await fetch(`${API_URL}/music/${id}`);
        return response.json();
    },

    // Generic POST method with file upload
    uploadContent: async (type, formData) => {
        // Map frontend type to backend endpoint
        const endpoint = endpointMap[type] || type;
        
        const response = await fetch(`${API_URL}/${endpoint}`, {
            method: 'POST',
            body: formData // FormData handles the content-type header automatically
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Upload failed');
        }
        return response.json();
    },

    // Generic DELETE method
    deleteContent: async (type, id) => {
        const endpoint = endpointMap[type] || type;
        
        const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Delete failed');
        }
        return response.json();
    },

    // Generic UPDATE method
    updateContent: async (type, id, formData) => {
        const endpoint = endpointMap[type] || type;
        
        const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
            method: 'PUT',
            body: formData
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Update failed');
        }
        return response.json();
    },

    loginAdmin: async (credentials) => {
        try {
            const response = await fetch(`${API_URL}/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Login failed');
            }

            const data = await response.json();
            // Store the token in localStorage
            localStorage.setItem('adminToken', data.token);
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    verifyAdminToken: async () => {
        const token = localStorage.getItem('adminToken');
        if (!token) return false;

        try {
            const response = await fetch(`${API_URL}/admin/verify-token`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    }
};