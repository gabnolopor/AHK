import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const palabras = [
        'Works',    // English
        'Obras',    // Spanish
        'Œuvres',   // French
        '作品',     // Chinese
        '작품',     // Korean
        'أعمال',    // Arabic
        'कार्य'     // Hindi
    ];

    // Array of all dark colors
    const colors = [
        'var(--dark-blue)',
        'var(--dark-red)',
        'var(--dark-wine)',
        'var(--dark-maroon)',
        'var(--full-wine)',
        'var(--full-maroon)',
        'var(--full-orange)'
    ];
    
    const [indice, setIndice] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [currentColor, setCurrentColor] = useState(colors[0]);
    
    // Function to get random color
    const getRandomColor = () => {
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    };
    
    useEffect(() => {
        const changeWord = () => {
            const nextIndex = (indice + 1) % palabras.length;
            const nextWord = palabras[nextIndex];
            let currentText = '';
            let charIndex = 0;

            // Set a new random color when starting a new word
            setCurrentColor(getRandomColor());

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
            <div className="encabezado__contenedor">                
                <h1 className="encabezado__titulo">
                    <span 
                        className="encabezado__texto"
                        onClick={handleClick}
                        style={{ 
                            cursor: 'pointer',
                            color: currentColor // Use the random color
                        }}
                    >
                        {displayedText}
                    </span>
                </h1>
            </div>
        </div>
    );
};

export default Header;