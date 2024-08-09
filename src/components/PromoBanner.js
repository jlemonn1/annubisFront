import React from 'react';
import img from './img/inicio.png';
import './PromoBanner.css';

const PromoBanner = () => {
  const handleScroll = () => {
    window.scrollBy({ top: 520, left: 0, behavior: 'smooth' });
  };

  return (
    <div className="promo-banner">
      <div className="promo-video">
        <img src={img} alt="Inicio Promo" />
      </div>
      <button className="shop-now" onClick={handleScroll}>Shop now 🔥</button>
      <p>🔥 Productos de impresión 3D.</p>
      <p>✨ Hecho en España.</p>
      <p>⚡ Impresión personalizada</p>
    </div>
  );
};

export default PromoBanner;
