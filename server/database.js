const mongoose = require('mongoose');
const { createModuleLogger } = require('./utils/logger');

const dbLogger = createModuleLogger('database');

const conexion = {
    query: async (query) => {
        try {
            if (query === 'SELECT 1') {
                if (mongoose.connection.readyState === 1) {
                    return [{ result: 1 }];
                }
                throw new Error('Database not connected');
            }
            
        } catch (error) {
            throw error;
        }
    },

    connect: async () => {
        try {
            const connectionString = `mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`;
            
            await mongoose.connect(connectionString);

            dbLogger.info({
                type: 'database_connection',
                status: 'success',
                host: process.env.DB_HOST,
                database: process.env.DB_NAME
            });
        } catch (error) {
            dbLogger.error({
                type: 'database_connection',
                status: 'error',
                error: error.message,
                stack: error.stack
            });
            process.exit(1);
        }
    }
};

conexion.connect();

module.exports = conexion;