const Photography = require('../models/Photography');
const { createModuleLogger } = require('../utils/logger');

const photographyLogger = createModuleLogger('photography-controller');

const photographyController = {
    getAllPhotography: async (req, res) => {
        try {
            console.log('Attempting to fetch photography...');
            const photography = await Photography.find({});
            console.log('Fetched photography:', photography);
            photographyLogger.info({
                type: 'fetch_all_photography',
                count: photography.length,
                photography: photography
            });
            res.json(photography);
        } catch (error) {
            console.error('Error details:', error);
            photographyLogger.error({
                type: 'fetch_all_photography_error',
                error: error.message,
                stack: error.stack
            });
            res.status(500).json({ error: 'Error fetching photography' });
        }
    },

    getPhotographyById: async (req, res) => {
        try {
            const { id } = req.params;
            const photography = await Photography.findById(id);
            if (!photography) {
                return res.status(404).json({ error: 'Photography not found' });
            }
            photographyLogger.info({
                type: 'fetch_single_photography',
                photographyId: id
            });
            res.json(photography);
        } catch (error) {
            photographyLogger.error({
                type: 'fetch_single_photography_error',
                error: error.message
            });
            res.status(500).json({ error: 'Error fetching photography' });
        }
    },

    addPhotography: async (req, res) => {
        try {
            const { name, description } = req.body;
            const filename = req.file ? req.file.filename : null;

            if (!filename) {
                return res.status(400).json({ error: 'File is required' });
            }

            const newPhotography = new Photography({
                name,
                description,
                filename
            });

            await newPhotography.save();
            photographyLogger.info({
                type: 'photography_added',
                photographyId: newPhotography._id
            });
            res.status(201).json(newPhotography);
        } catch (error) {
            photographyLogger.error({
                type: 'add_photography_error',
                error: error.message
            });
            res.status(500).json({ error: 'Error adding photography' });
        }
    },

    updatePhotography: async (req, res) => {
        try {
            const { id } = req.params;
            const updates = {
                name: req.body.name,
                description: req.body.description
            };            
            if (req.file) {
                updates.filename = req.file.filename;
            }

            const photography = await Photography.findByIdAndUpdate(id, updates, { new: true });
            if (!photography) {
                return res.status(404).json({ error: 'Photography not found' });
            }

            photographyLogger.info({
                type: 'photography_updated',
                photographyId: id
            });
            res.json(photography);
        } catch (error) {
            photographyLogger.error({
                type: 'update_photography_error',
                error: error.message
            });
            res.status(500).json({ error: 'Error updating photography' });
        }
    },

    deletePhotography: async (req, res) => {
        try {
            const { id } = req.params;
            const photography = await Photography.findByIdAndDelete(id);
            if (!photography) {
                return res.status(404).json({ error: 'Photography not found' });
            }

            photographyLogger.info({
                type: 'photography_deleted',
                photographyId: id
            });
            res.json({ message: 'Photography deleted successfully' });
        } catch (error) {
            photographyLogger.error({
                type: 'delete_photography_error',
                error: error.message
            });
            res.status(500).json({ error: 'Error deleting photography' });
        }
    }
};

module.exports = photographyController;