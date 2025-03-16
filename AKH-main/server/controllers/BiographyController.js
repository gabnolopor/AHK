const Biography = require('../models/Biography');
const mongoose = require('mongoose');

const getBiography = async (req, res) => {
    try {
        console.log('Buscando biografía...');
        
        // Buscar directamente en la colección
        const db = mongoose.connection.db;
        const bioCollection = db.collection('Biography');
        const biography = await bioCollection.findOne();
        
        if (!biography) {
            return res.status(404).json({ message: "No biography found" });
        }
        
        res.status(200).json(biography);
    } catch (error) {
        console.error('Error en getBiography:', error);
        res.status(500).json({ message: error.message });
    }
};

const updateBiography = async (req, res) => {
    try {
        const db = mongoose.connection.db;
        const bioCollection = db.collection('Biography');
        const updatedBiography = await bioCollection.findOneAndUpdate(
            {},
            { $set: req.body },
            { returnDocument: 'after' }
        );
        
        if (!updatedBiography.value) {
            return res.status(404).json({ message: "No biography found" });
        }
        
        res.status(200).json(updatedBiography.value);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getBiography,
    updateBiography
};
