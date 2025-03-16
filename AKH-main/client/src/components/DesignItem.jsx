import React from 'react';

const DesignItem = ({ design }) => {
    if (!design) {
        return <div>No hay información del diseño disponible</div>;
    }

    return (
        <div className="design-item">
            <h2 className="design-title">{design.title}</h2>
            
            <div className="design-image-container">
                <img 
                    src={design.imageUrl} 
                    alt={design.title}
                    className="design-image"
                />
            </div>

            <div className="design-description">
                <p>{design.description}</p>
            </div>
        </div>
    );
};

export default DesignItem;