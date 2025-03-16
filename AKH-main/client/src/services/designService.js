import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class DesignService {
    static async getAllDesigns() {
        try {
            const response = await axios.get(`${API_URL}/designs`);
            return response.data;
        } catch (error) {
            console.error('Error fetching designs:', error);
            throw error;
        }
    }

    static async getDesignById(id) {
        try {
            const response = await axios.get(`${API_URL}/designs/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching design ${id}:`, error);
            throw error;
        }
    }

    static async getDesignsByCategory(category) {
        try {
            const response = await axios.get(`${API_URL}/designs/category/${category}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching designs from category ${category}:`, error);
            throw error;
        }
    }

    static async getDesignsByPage(pageNumber) {
        try {
            const response = await axios.get(`${API_URL}/designs/page/${pageNumber}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching designs from page ${pageNumber}:`, error);
            throw error;
        }
    }

    static async getTotalPages() {
        try {
            const response = await axios.get(`${API_URL}/designs/pages/count`);
            return response.data.totalPages;
        } catch (error) {
            console.error('Error fetching total pages:', error);
            throw error;
        }
    }

    static getImageVersions(imageUrl) {
        if (!imageUrl) return null;
        
        return {
            thumbnail: imageUrl.replace('/upload/', '/upload/w_200,h_200,c_fill/'),
            medium: imageUrl.replace('/upload/', '/upload/w_600,h_600,c_fill/'),
            large: imageUrl.replace('/upload/', '/upload/w_1200,h_1200,c_fill/')
        };
    }
}

export default DesignService;