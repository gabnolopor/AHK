const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const multer = require("multer");
const { logger, createModuleLogger } = require('./utils/logger');
const contentRoutes = require('./routes/contentRoutes');

require("dotenv").config();

const appLogger = createModuleLogger('app');
const conexion = require("./database");

const app = express();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.env.UPLOAD_PATH);
    },
    filename: function (req, file, cb) {
        const filename = Date.now() + '-' + file.originalname;
        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = process.env.ALLOWED_FILE_TYPES.split(',');
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
};

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE)
    },
    fileFilter: fileFilter
});

const corsOptions = {
    origin: (origin, callback) => {
        appLogger.info({
            type: 'cors_request',
            origin: origin
        });

        if (!origin || origin === 'http://localhost:5173') {
            callback(null, true);
        } else {
            appLogger.warn({
                type: 'cors_blocked',
                origin: origin
            });
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(helmet());
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
}));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    const startTime = Date.now();
    
    appLogger.info({
        type: 'request',
        method: req.method,
        url: req.url,
        origin: req.headers.origin,
        ip: req.ip,
        userAgent: req.headers['user-agent']
    });

    res.on('finish', () => {
        appLogger.info({
            type: 'response',
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${Date.now() - startTime}ms`
        });
    });

    next();
});

app.use((err, req, res, next) => {
    appLogger.error({
        type: 'error',
        error: err.message,
        stack: err.stack,
        method: req.method,
        url: req.url,
        body: req.body,
        timestamp: new Date().toISOString()
    });
    
    res.status(500).json({ error: 'Internal Server Error' });
});

app.get('/health', (req, res) => {
    conexion.query('SELECT 1', (err, results) => {
        if (err) {
            appLogger.error({
                type: 'health_check_failed',
                error: err.message,
                stack: err.stack
            });
            return res.status(500).send('Internal Server Error');
        }
        appLogger.info({
            type: 'health_check_success',
            timestamp: new Date().toISOString()
        });
        return res.status(200).send('OK');
    });
});

// Add routes
app.use('/api', contentRoutes);

const puerto = process.env.PORT || 3000;

app.listen(puerto, () => {
    appLogger.info({
        type: 'server_start',
        port: puerto,
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

process.on('SIGTERM', () => {
    appLogger.info({
        type: 'server_shutdown',
        timestamp: new Date().toISOString()
    });
    process.exit(0);
});