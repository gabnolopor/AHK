import { useState, useEffect } from 'react';
import React from 'react';
import Music from '../components/Music';
import Photo from '../components/Photo';
import Paintwork from '../components/Paintwork';
import WrittenWorks from '../components/WrittenWorks';
import Credits from '../components/Credits';
import InteriorDesign from '../components/InteriorDesign';

function BoxSelect() {
  const [isPaintworkOpen, setIsPaintworkOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

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

  const handleMouseEnter = () => {
    setIsHovering(true);
    document.querySelector('.video-container').classList.add('blur-active');
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    document.querySelector('.video-container').classList.remove('blur-active');
  };

  return (
    <div className="box__wrapper">
      <div className="video-container">
        <video autoPlay muted loop playsInline className="background-video">
          <source src="/bgPrototype.mp4" type="video/mp4" />
          Tu navegador no soporta el elemento video.
        </video>
      </div>

      <div className="boxes__grid">
        <div 
          className="box__sector"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="hover-modal">Music</div>
        </div>

        <div 
          className="box__sector"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="hover-modal">Photo</div>
        </div>

        <div 
          className="box__sector"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => setIsPaintworkOpen(true)}
        >
          <div className="hover-modal">Paintwork</div>
        </div>

        <div 
          className="box__sector"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="hover-modal">Written Works</div>
        </div>

        <div 
          className="box__sector"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="hover-modal">Credits</div>
        </div>

        <div 
          className="box__sector"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="hover-modal">Interior Design</div>
        </div>

        <div 
          className="box__sector"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="hover-modal">New Section 1</div>
        </div>

        <div 
          className="box__sector"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="hover-modal">New Section 2</div>
        </div>
      </div>

      <Paintwork 
        isOpen={isPaintworkOpen} 
        onClose={() => setIsPaintworkOpen(false)}
      />
    </div>
  );
}

export default BoxSelect;