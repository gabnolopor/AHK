require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

const createInitialAdmin = async () => {
    try {
        // Connect to MongoDB with the specific database name
        await mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'AHKDEV'  // Add this to match your database.js
        });
        console.log('Connected to MongoDB AHKDEV database');

        // Drop the existing admin collection completely (note the lowercase)
        await mongoose.connection.collection('admin').drop().catch(err => {
            if (err.code !== 26) { // 26 is collection doesn't exist error
                console.log('Error dropping collection:', err);
            } else {
                console.log('Collection did not exist, creating new');
            }
        });
        console.log('Cleaned up admin collection');

        // Create new admin with lowercase username
        const admin = new Admin({
            username: 'admin', // Changed to lowercase
            password: 'Andrew'  // Plain text - will be hashed by the model middleware
        });

        const savedAdmin = await admin.save();
        console.log('Admin user created successfully:', savedAdmin);

        // Verify the admin was created
        const verifyAdmin = await Admin.findOne({ username: 'admin' });
        console.log('Verified admin in database:', verifyAdmin);

    } catch (error) {
        console.error('Error creating admin:', error);
        console.error('Full error details:', error.message);
        if (error.code) {
            console.error('Error code:', error.code);
        }
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

// Log the DB_URI (but mask sensitive info)
const dbUri = process.env.DB_URI || 'Not found';
console.log('Using DB URI:', dbUri.replace(/:\/\/[^@]+@/, '://****:****@'));

createInitialAdmin();