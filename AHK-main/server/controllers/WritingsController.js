const Writings = require('../models/Writings');
const { createModuleLogger } = require('../utils/logger');

const writingsLogger = createModuleLogger('writings-controller');

const writingsController = {
    getAllWritings: async (req, res) => {
        try {
            console.log('Attempting to fetch writings...');
            const writings = await Writings.find({});
            console.log('Fetched writings:', writings);
            writingsLogger.info({
                type: 'fetch_all_writings',
                count: writings.length,
                writings: writings
            });
            res.json(writings);
        } catch (error) {
            console.error('Error details:', error);
            writingsLogger.error({
                type: 'fetch_all_writings_error',
                error: error.message,
                stack: error.stack
            });
            res.status(500).json({ error: 'Error fetching writings' });
        }
    },

    getWritingById: async (req, res) => {
        try {
            const { id } = req.params;
            const writing = await Writings.findById(id);
            if (!writing) {
                return res.status(404).json({ error: 'Writing not found' });
            }
            writingsLogger.info({
                type: 'fetch_single_writing',
                writingId: id
            });
            res.json(writing);
        } catch (error) {
            writingsLogger.error({
                type: 'fetch_single_writing_error',
                error: error.message
            });
            res.status(500).json({ error: 'Error fetching writing' });
        }
    },

    addWriting: async (req, res) => {
        try {
            const { name } = req.body;
            const filename = req.file ? req.file.filename : null;

            if (!filename) {
                return res.status(400).json({ error: 'File is required' });
            }

            const newWriting = new Writings({
                name,
                filename,
                cover: req.body.cover
            });

            await newWriting.save();
            writingsLogger.info({
                type: 'writing_added',
                writingId: newWriting._id
            });
            res.status(201).json(newWriting);
        } catch (error) {
            writingsLogger.error({
                type: 'add_writing_error',
                error: error.message
            });
            res.status(500).json({ error: 'Error adding writing' });
        }
    },

    updateWriting: async (req, res) => {
        try {
            const { id } = req.params;
            const updates = {
                name: req.body.name,
                cover: req.body.cover
            };
            
            if (req.file) {
                updates.filename = req.file.filename;
            }

            const writing = await Writings.findByIdAndUpdate(id, updates, { new: true });
            if (!writing) {
                return res.status(404).json({ error: 'Writing not found' });
            }

            writingsLogger.info({
                type: 'writing_updated',
                writingId: id
            });
            res.json(writing);
        } catch (error) {
            writingsLogger.error({
                type: 'update_writing_error',
                error: error.message
            });
            res.status(500).json({ error: 'Error updating writing' });
        }
    },

    deleteWriting: async (req, res) => {
        try {
            const { id } = req.params;
            const writing = await Writings.findByIdAndDelete(id);
            if (!writing) {
                return res.status(404).json({ error: 'Writing not found' });
            }

            writingsLogger.info({
                type: 'writing_deleted',
                writingId: id
            });
            res.json({ message: 'Writing deleted successfully' });
        } catch (error) {
            writingsLogger.error({
                type: 'delete_writing_error',
                error: error.message
            });
            res.status(500).json({ error: 'Error deleting writing' });
        }
    }
};

module.exports = writingsController;