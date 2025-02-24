//Configuración de dependencias
const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const multer = require("multer");
require('dotenv').config();
const { logger, createModuleLogger } = require("./utils/logger");
const { testConnection } = require('./utils/cloudinary');

//rutas de contenido
const writingsRoutes = require("./routes/WritingsRoutes");
const paintingsRoutes = require("./routes/PaintingsRoutes");
const photographyRoutes = require("./routes/PhotographyRoutes");
const musicRoutes = require("./routes/MusicRoutes");

//configuración
const mongoose = require("mongoose");
require("dotenv").config();

const appLogger = createModuleLogger("app");
const conexion = require("./database");

const app = express();

//configuración de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.env.UPLOAD_PATH);
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + "-" + file.originalname;
    cb(null, filename);
  },
});

//filtro de archivos
const fileFilter = (req, file, cb) => {
  const allowedTypes = process.env.ALLOWED_FILE_TYPES.split(",");
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE),
  },
  fileFilter: fileFilter,
});

//configuración de cors
const corsOptions = {
  origin: (origin, callback) => {
    appLogger.info({
      type: "cors_request",
      origin: origin,
    });

    if (!origin || origin === "http://localhost:5173") {
      callback(null, true);
    } else {
      appLogger.warn({
        type: "cors_blocked",
        origin: origin,
      });
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};

//configuración de helmet
app.use(helmet());

//configuración de rate limit
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

//configuración de express
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  const startTime = Date.now();

  appLogger.info({
    type: "request",
    method: req.method,
    url: req.url,
    origin: req.headers.origin,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  res.on("finish", () => {
    appLogger.info({
      type: "response",
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${Date.now() - startTime}ms`,
    });
  });

  next();
});

app.use((err, req, res, next) => {
  appLogger.error({
    type: "error",
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    body: req.body,
    timestamp: new Date().toISOString(),
  });

  res.status(500).json({ error: "Internal Server Error" });
});

//health check
app.get("/health", (req, res) => {
  conexion.query("SELECT 1", (err, results) => {
    if (err) {
      appLogger.error({
        type: "health_check_failed",
        error: err.message,
        stack: err.stack,
      });
      return res.status(500).send("Internal Server Error");
    }
    appLogger.info({
      type: "health_check_success",
      timestamp: new Date().toISOString(),
    });
    return res.status(200).send("OK");
  });
});

// Add routes
app.use("/api", writingsRoutes);
app.use("/api", paintingsRoutes);
app.use("/api", photographyRoutes);
app.use("/api", musicRoutes);

//testing
app.get("/test", (req, res) => {
  res.json({ message: "Test route working" });
});

//debug
app.get("/api/debug", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ error: "Database not connected" });
    }

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    //debug de colecciones
    const writingsCollection = collections.find((c) => c.name === "Writings");
    const writingsData = writingsCollection
      ? await db.collection("Writings").find({}).toArray()
      : [];

    const paintingsCollection = collections.find((c) => c.name === "Paintings");
    const paintingsData = paintingsCollection
      ? await db.collection("Paintings").find({}).toArray()
      : [];
    
    const musicCollection = collections.find((c) => c.name === "Music");
    const musicData = musicCollection
      ? await db.collection("Music").find({}).toArray()
      : [];

    const photographyCollection = collections.find((c) => c.name === "Photography");
    const photographyData = photographyCollection
      ? await db.collection("Photography").find({}).toArray()
      : [];

    res.json({
      availableCollections: collections.map((c) => c.name),
      writings: {
        collectionExists: !!writingsCollection,
        collectionName: writingsCollection?.name,
        documentCount: writingsData.length,
        documents: writingsData,
      },
      paintings: {
        collectionExists: !!paintingsCollection,
        collectionName: paintingsCollection?.name,
        documentCount: paintingsData.length,
        documents: paintingsData,
      },
      music: {
        collectionExists: !!musicCollection,
        collectionName: musicCollection?.name,
        documentCount: musicData.length,
        documents: musicData,
      },
      photography: {
        collectionExists: !!photographyCollection,
        collectionName: photographyCollection?.name,
        documentCount: photographyData.length,
        documents: photographyData,
      },
    });
  } catch (error) {
    console.error("Debug route error:", error);
    res.json({ error: error.message, stack: error.stack });
  }
});

//inicio del servidor
const puerto = process.env.PORT || 3000;

app.listen(puerto, async () => {
  appLogger.info({
    type: "server_start",
    port: puerto,
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });

  // Test Cloudinary connection
  await testConnection();
});

//cierre del servidor
process.on("SIGTERM", () => {
  appLogger.info({
    type: "server_shutdown",
    timestamp: new Date().toISOString(),
  });
  process.exit(0);
});
