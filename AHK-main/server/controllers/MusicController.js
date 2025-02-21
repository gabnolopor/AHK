const Music = require('../models/Music');
const { createModuleLogger } = require('../utils/logger');

const musicLogger = createModuleLogger('music-controller');

const musicController = {
    getAllMusic: async (req, res) => {
        try {
            console.log('Attempting to fetch music...');
            const music = await Music.find({});
            console.log('Fetched music:', music);
            musicLogger.info({
                type: 'fetch_all_music',
                count: music.length,
                music: music
            });
            res.json(music);
        } catch (error) {
            console.error('Error details:', error);
            musicLogger.error({
                type: 'fetch_all_music_error',
                error: error.message,
                stack: error.stack
            });
            res.status(500).json({ error: 'Error fetching music' });
        }
    },

    getMusicById: async (req, res) => {
        try {
            const { id } = req.params;
            const music = await Music.findById(id);
            if (!music) {
                return res.status(404).json({ error: 'Music not found' });
            }
            musicLogger.info({
                type: 'fetch_single_music',
                musicId: id
            });
            res.json(music);
        } catch (error) {
            musicLogger.error({
                type: 'fetch_single_music_error',
                error: error.message
            });
            res.status(500).json({ error: 'Error fetching music' });
        }
    },

    addMusic: async (req, res) => {
        try {
            const { name, cover } = req.body;
            const filename = req.file ? req.file.filename : null;

            if (!filename) {
                return res.status(400).json({ error: 'File is required' });
            }

            const newMusic = new Music({
                name,
                cover,
                filename
            });

            await newMusic.save();
            musicLogger.info({
                type: 'music_added',
                musicId: newMusic._id
            });
            res.status(201).json(newMusic);
        } catch (error) {
            musicLogger.error({
                type: 'add_music_error',
                error: error.message
            });
            res.status(500).json({ error: 'Error adding music' });
        }
    },

    updateMusic: async (req, res) => {
        try {
            const { id } = req.params;
            const updates = {
                name: req.body.name,
                cover: req.body.cover
            };            
            if (req.file) {
                updates.filename = req.file.filename;
            }

            const music = await Music.findByIdAndUpdate(id, updates, { new: true });
            if (!music) {
                return res.status(404).json({ error: 'Music not found' });
            }

            musicLogger.info({
                type: 'music_updated',
                musicId: id
            });
            res.json(music);
        } catch (error) {
            musicLogger.error({
                type: 'update_music_error',
                error: error.message
            });
            res.status(500).json({ error: 'Error updating music' });
        }
    },

    deleteMusic: async (req, res) => {
        try {
            const { id } = req.params;
            const music = await Music.findByIdAndDelete(id);
            if (!music) {
                return res.status(404).json({ error: 'Music not found' });
            }

            musicLogger.info({
                type: 'music_deleted',
                musicId: id
            });
            res.json({ message: 'Music deleted successfully' });
        } catch (error) {
            musicLogger.error({
                type: 'delete_music_error',
                error: error.message
            });
            res.status(500).json({ error: 'Error deleting music' });
        }
    }
};

module.exports = musicController;