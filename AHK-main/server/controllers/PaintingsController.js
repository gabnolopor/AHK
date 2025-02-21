const Paintings = require('../models/Paintings');
const { createModuleLogger } = require('../utils/logger');

const paintingsLogger = createModuleLogger('paintings-controller');

const paintingsController = {
    getAllPaintings: async (req, res) => {
        try {
            console.log('Attempting to fetch paintings...');
            const paintings = await Paintings.find({});
            console.log('Fetched paintings:', paintings);
            paintingsLogger.info({
                type: 'fetch_all_paintings',
                count: paintings.length,
                paintings: paintings
            });
            res.json(paintings);
        } catch (error) {
            console.error('Error details:', error);
            paintingsLogger.error({
                type: 'fetch_all_paintings_error',
                error: error.message,
                stack: error.stack
            });
            res.status(500).json({ error: 'Error fetching paintings' });
        }
    },

    getPaintingById: async (req, res) => {
        try {
            const { id } = req.params;
            const painting = await Paintings.findById(id);
            if (!painting) {
                return res.status(404).json({ error: 'Painting not found' });
            }
            paintingsLogger.info({
                type: 'fetch_single_painting',
                paintingId: id
            });
            res.json(painting);
        } catch (error) {
            paintingsLogger.error({
                type: 'fetch_single_painting_error',
                error: error.message
            });
            res.status(500).json({ error: 'Error fetching painting' });
        }
    },

    addPainting: async (req, res) => {
        try {
            const { name, description } = req.body;
            const filename = req.file ? req.file.filename : null;

            if (!filename) {
                return res.status(400).json({ error: 'File is required' });
            }

            const newPainting = new Paintings({
                name,
                description,
                filename
            });

            await newPainting.save();
            paintingsLogger.info({
                type: 'painting_added',
                paintingId: newPainting._id
            });
            res.status(201).json(newPainting);
        } catch (error) {
            paintingsLogger.error({
                type: 'add_painting_error',
                error: error.message
            });
            res.status(500).json({ error: 'Error adding painting' });
        }
    },

    updatePainting: async (req, res) => {
        try {
            const { id } = req.params;
            const updates = {
                name: req.body.name,
                description: req.body.description
            };            
            if (req.file) {
                updates.filename = req.file.filename;
            }

            const painting = await Paintings.findByIdAndUpdate(id, updates, { new: true });
            if (!painting) {
                return res.status(404).json({ error: 'Painting not found' });
            }

            paintingsLogger.info({
                type: 'painting_updated',
                paintingId: id
            });
            res.json(painting);
        } catch (error) {
            paintingsLogger.error({
                type: 'update_painting_error',
                error: error.message
            });
            res.status(500).json({ error: 'Error updating painting' });
        }
    },

    deletePainting: async (req, res) => {
        try {
            const { id } = req.params;
            const painting = await Paintings.findByIdAndDelete(id);
            if (!painting) {
                return res.status(404).json({ error: 'Painting not found' });
            }

            paintingsLogger.info({
                type: 'painting_deleted',
                paintingId: id
            });
            res.json({ message: 'Painting deleted successfully' });
        } catch (error) {
            paintingsLogger.error({
                type: 'delete_painting_error',
                error: error.message
            });
            res.status(500).json({ error: 'Error deleting painting' });
        }
    }
};

module.exports = paintingsController;