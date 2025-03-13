import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import '../styles/music.css';
import { Link } from 'react-router-dom';

const Music = () => {
    const [genres, setGenres] = useState([]);
    const [currentGenreIndex, setCurrentGenreIndex] = useState(0);

    const genreColors = {
        'Electro': '#8B4513',          // Marrón
        'pop-rock': '#B8860B',         // Dorado
        'tv-film': '#8B4513',          // Marrón
        'experimental': '#B8860B',      // Dorado
    };

    const getCurrentColor = () => {
        const currentGenre = genres[currentGenreIndex];
        return genreColors[currentGenre] || '#ff0000';  // Rojo por defecto
    };

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/genres');
                setGenres(response.data);
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchGenres();
    }, []);

    const nextGenre = () => {
        setCurrentGenreIndex((prev) => 
            prev === genres.length - 1 ? 0 : prev + 1
        );
    };

    const prevGenre = () => {
        setCurrentGenreIndex((prev) => 
            prev === 0 ? genres.length - 1 : prev - 1
        );
    };

    return (
        <div className="music">
            <img 
                src="/newjukebox.png" 
                alt="Jukebox" 
                className="music__jukebox"
            />
            <div className="music__grid">
                <div className="music__nav-container">
                    <button 
                        onClick={prevGenre} 
                        className="music__nav-button"
                        style={{ borderColor: getCurrentColor(), color: getCurrentColor() }}
                        disabled={genres.length <= 1}
                    >
                        <IoIosArrowBack size={24} />
                    </button>
                    
                    <h2 className="music__genre" style={{ color: '#FFFFFF' }}>
                        {genres[currentGenreIndex]}
                    </h2>
                    
                    <button 
                        onClick={nextGenre} 
                        className="music__nav-button"
                        style={{ borderColor: getCurrentColor(), color: getCurrentColor() }}
                        disabled={genres.length <= 1}
                    >
                        <IoIosArrowForward size={24} />
                    </button>
                </div>

                {[...Array(6)].map((_, index) => (
                    <div 
                        key={index} 
                        className="music__strip"
                    >
                        <div className="music__line-box">
                            <div className="music__line" style={{ backgroundColor: getCurrentColor() }}>
                                <div className="music__white-space" style={{ borderColor: getCurrentColor() }}></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Link to="/boxselect"><img src="/black-logo.png" className="logo" alt="logo" /></Link>
        </div>
    );
};

export default Music;