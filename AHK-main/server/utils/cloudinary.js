const { v2: cloudinary } = require('cloudinary');


// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET 
});

// Test connection
const testConnection = async () => {
    try {
        const result = await cloudinary.api.ping();
        console.log('Cloudinary connection successful:', result);
        return true;
    } catch (error) {
        console.error('Cloudinary connection failed:', error);
        return false;
    }
};

module.exports = {
    cloudinary,
    testConnection
};