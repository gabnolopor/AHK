import React, { useState, useEffect } from 'react';
import './Header.jsx';

const Header = () => {
    const palabras = [
        'Works',    // Inglés
        'Œuvres',   // Francés
        '作品',     // Japonés
        'Werke',    // Alemán
        'Obras',    // Español
        'Lavori',   // Italiano
        'Verk'      // Sueco
    ];
    
    const [palabraActual, setPalabraActual] = useState('');
    const [indice, setIndice] = useState(0);
    const [animando, setAnimando] = useState(false);
    
    useEffect(() => {
        const intervalo = setInterval(() => {
            setAnimando(true);
            
            setTimeout(() => {
                setIndice((indiceActual) => (indiceActual + 1) % palabras.length);
                setAnimando(false);
            }, 400);
            
        }, 2500);
        
        return () => clearInterval(intervalo);
    }, []);

    useEffect(() => {
        setPalabraActual(palabras[indice]);
    }, [indice]);

    return (
        <div className="encabezado">
            <div className="encabezado__contenedor">
                <h1 className="encabezado__titulo">
                    <span 
                        className={`encabezado__texto ${
                            animando 
                                ? 'encabezado__texto--salida' 
                                : 'encabezado__texto--entrada'
                        }`}
                    >
                        {palabraActual}
                    </span>
                </h1>
            </div>
        </div>
    );
};

export default Header;