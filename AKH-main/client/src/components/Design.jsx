import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DesignService from '../services/designService';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/design.css';

const Design = () => {
    const [designs, setDesigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        const loadDesigns = async () => {
            try {
                const data = await DesignService.getAllDesigns();
                setDesigns(data);
            } catch (err) {
                setError('Error al cargar los diseños');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        loadDesigns();
    }, []);

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset, velocity) => {
        return Math.abs(offset) * velocity;
    };

    const paginate = (newDirection) => {
        setDirection(newDirection);
        setCurrentIndex((prevIndex) => (prevIndex + newDirection + designs.length) % designs.length);
    };

    if (loading) return <div className="loading">Cargando...</div>;
    if (error) return <div className="error">{error}</div>;
    if (designs.length === 0) return null;

    const currentDesign = designs[currentIndex];

    return (
        <div className="design-container">
            <Link to="/boxselect" className="logo-link">
                <img src="/black-logo.png" alt="Logo" className="logo" />
            </Link>

            <div className="carousel">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = swipePower(offset.x, velocity.x);

                            if (swipe < -swipeConfidenceThreshold) {
                                paginate(1);
                            } else if (swipe > swipeConfidenceThreshold) {
                                paginate(-1);
                            }
                        }}
                        className="carousel-slide"
                    >
                        <div className="design-card">
                            <img 
                                src={currentDesign.imageUrl} 
                                alt={currentDesign.title}
                                className="design-image"
                            />
                            <div className="design-info">
                                <h2>{currentDesign.title}</h2>
                                <p>{currentDesign.description}</p>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                <button className="nav-button prev" onClick={() => paginate(-1)}>
                    &#8249;
                </button>
                <button className="nav-button next" onClick={() => paginate(1)}>
                    &#8250;
                </button>

                <div className="dots-container">
                    {designs.map((_, index) => (
                        <button
                            key={index}
                            className={`dot ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => {
                                setDirection(index > currentIndex ? 1 : -1);
                                setCurrentIndex(index);
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Design;