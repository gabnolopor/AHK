import React, { useState, useEffect } from 'react';
import '../styles/music.css';

const Music = () => {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await fetch('/api/songs');
                const data = await response.json();
                setSongs(data);
            } catch (error) {
                console.error('Error fetching songs:', error);
                setSongs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSongs();
    }, []);

    const displaySongs = loading ? Array(18).fill({}) : 
        [...songs, ...Array(18).fill({})].slice(0, 18);

    return (
        <div className="music">
            <img 
                src="/jukebox.png" 
                alt="Jukebox" 
                className="music__jukebox"
            />
            <div className="music__grid">
                {displaySongs.map((song, index) => (
                    <div key={index} className="music__strip">
                        <div className="music__line-box">
                            <div className="music__line">
                                <div className="music__white-space">
                                    {song?.title || ""}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Music;
