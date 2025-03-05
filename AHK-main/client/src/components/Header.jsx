import React, { useState, useEffect } from 'react';
import '../styles/landPage.css';
import { useNavigate } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';

const Header = () => {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
    const palabras = [
        'Works',    // English
        'Obras',    // Spanish
        'Œuvres',   // French
        '作品',     // Chinese
        '작품',     // Korean
        'أعمال',    // Arabic
        'कार्य'     // Hindi
    ];

    const [indice, setIndice] = useState(0);
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        const changeWord = () => {
            const nextIndex = (indice + 1) % palabras.length;
            const nextWord = palabras[nextIndex];
            let currentText = '';
            let charIndex = 0;

            const letterInterval = setInterval(() => {
                currentText += nextWord[charIndex];
                setDisplayedText(currentText);
                charIndex++;

                if (charIndex === nextWord.length) {
                    clearInterval(letterInterval);
                    setTimeout(() => {
                        setIndice(nextIndex);
                    }, 1000);
                }
            }, 100);
        };

        changeWord();
    }, [indice]);

    const handleClick = () => {
        navigate('/boxselect');
    };

    return (
        <div className="encabezado">
            <div className="imagen-container">
                <img src="/landpage.png" className="encabezado__imagen" alt="background" />
                <h1 className="encabezado__titulo">
                    <span 
                        className="encabezado__texto"
                        onClick={handleClick}
                    >
                        {displayedText}
                    </span>
                </h1>
            </div>
            {isAuthenticated && (
                <button 
                    className="control-panel-button"
                    onClick={() => navigate('/admin')}
                >
                    <FiSettings /> Control Panel
                </button>
            )}
        </div>
    );
};

export default Header;
