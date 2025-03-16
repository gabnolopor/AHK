const express = require("express");
const router = express.Router();
const Design = require("../models/Design");
const { cloudinary } = require("../utils/cloudinary");
const { createModuleLogger } = require("../utils/logger");

const designLogger = createModuleLogger("design");

// Ruta temporal para crear diseños de prueba
router.get("/designs/test", async (req, res) => {
    try {
        const testDesigns = [
            {
                title: "Interior Design",
                description: "Interior with spiral staircase and vintage decoration",
                imageUrl: "https://res.cloudinary.com/andrewking/image/upload/v1741712352/designs/firtsexample-design.jpg",
                publicId: "designs/firtsexample-design",
                pageNumber: 1
            },
            {
                title: "Interior Design",
                description: "Interior with spiral staircase and vintage decoration",
                imageUrl: "https://res.cloudinary.com/andrewking/image/upload/v1741712351/designs/secondexample-designs.avif",
                publicId: "designs/secondexample-designs",
                pageNumber: 2       
            },
            {
                title: "Interior Design",
                description: "Interior with spiral staircase and vintage decoration",
                imageUrl: "https://res.cloudinary.com/andrewking/image/upload/v1741712351/designs/thirdexample-designs.avif",
                publicId: "designs/thirdexample-designs",
                pageNumber: 3
            }
        ];

        const designs = await Design.insertMany(testDesigns);
        res.status(201).json(designs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obtener todos los diseños
router.get("/designs", async (req, res) => {
    try {
        const designs = await Design.find().sort({ pageNumber: 1 });
        designLogger.info({
            type: "get_designs_success",
            count: designs.length
        });
        res.json(designs);
    } catch (error) {
        designLogger.error({
            type: "get_designs_error",
            error: error.message
        });
        res.status(500).json({ message: error.message });
    }
});

// Obtener un diseño específico por ID
router.get("/designs/:id", async (req, res) => {
    try {
        const design = await Design.findById(req.params.id);
        if (!design) {
            return res.status(404).json({ message: "Diseño no encontrado" });
        }
        res.json(design);
    } catch (error) {
        designLogger.error({
            type: "get_design_error",
            error: error.message,
            designId: req.params.id
        });
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;