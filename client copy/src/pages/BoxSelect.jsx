import React, { useState, useEffect } from "react";
import Music from "../components/Music";
import Photo from "../components/Photo";
import Paintwork from "../components/Paintwork";
import WrittenWorks from "../components/WrittenWorks";

function BoxSelect() {
  const [isPaintworkOpen, setIsPaintworkOpen] = useState(false);

  useEffect(() => {
    if (isPaintworkOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isPaintworkOpen]);

  return (
    <div className="box__contenedor">
      <div className="box__sector">
        <div className="sector__content">
          <Music />
        </div>
        <div className="hover-modal">Music</div>
      </div>

      <div className="box__sector">
        <div className="sector__content">
          <Photo />
        </div>
        <div className="hover-modal">Photo</div>
      </div>

      <div className="box__sector">
        <div className="sector__content" onClick={() => setIsPaintworkOpen(true)}>
          Paintwork
        </div>
        <div className="hover-modal">Paintwork</div>
      </div>

      <div className="box__sector">
        <div className="sector__content">
          <WrittenWorks />
        </div>
        <div className="hover-modal">Written Works</div>
      </div>

      <Paintwork 
        isOpen={isPaintworkOpen} 
        onClose={() => setIsPaintworkOpen(false)} 
      />
    </div>
  );
}

export default BoxSelect;