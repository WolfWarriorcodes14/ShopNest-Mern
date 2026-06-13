import React, { useEffect, useState } from 'react';
import '../styles/splash.css';

const SplashScreen = ({ onComplete }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onComplete, 600);
    }, 3200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`splash-container ${isExiting ? 'exit' : ''}`}>
      {/* Ambient background particles */}
      <div className="particles-bg">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}></div>
        ))}
      </div>

      {/* Text with dramatic reveal */}
      <div className="splash-text">
        <div className="text-wrapper">
          <h1 className="title-main">Wolf-Shopping Basket</h1>
          <div className="title-underline"></div>
        </div>
        <p className="tagline">UNLEASH THE HUNT</p>
      </div>
    </div>
  );
};

export default SplashScreen;
