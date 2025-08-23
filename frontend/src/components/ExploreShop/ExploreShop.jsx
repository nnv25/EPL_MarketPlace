import "./ExploreShop.css"; // Import styles for ExploreShop component
import { shop_list } from "../../assets/assets_flowers"; // Import list of shops
import React, { useState, useRef, useEffect } from 'react';


const ExploreShop = () => {
  const [active, setActive] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const carouselRef = useRef(null);
  const dragTimeoutRef = useRef(null);
  
  const handleLeftClick = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -carouselRef.current.offsetWidth / 2,
        behavior: 'smooth'
      });
    }
  };

  const handleRightClick = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: carouselRef.current.offsetWidth / 2,
        behavior: 'smooth'
      });
    }
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.touches[0].clientX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Improved mouse handlers
  const handleMouseDown = (e) => {
    setIsMouseDown(true);
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
    
    // Add grabbing cursor to body during drag
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown) return;
    e.preventDefault();
    
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Reduced multiplier for smoother drag
    carouselRef.current.scrollLeft = scrollLeft - walk;

    // Clear previous timeout and set new one
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }
    dragTimeoutRef.current = setTimeout(() => {
      setIsDragging(false);
    }, 150);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setIsDragging(false);
    
    // Reset body styles
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';

    // Add momentum scrolling effect
    if (carouselRef.current) {
      const currentScroll = carouselRef.current.scrollLeft;
      const targetScroll = Math.round(currentScroll / 300) * 300; // Snap to nearest item
      
      carouselRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  const handleMouseLeave = () => {
    if (isMouseDown) {
      handleMouseUp();
    }
  };

  // Prevent click during drag
  const handleClick = (e) => {
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  useEffect(() => {
    // Cleanup function
    return () => {
      if (dragTimeoutRef.current) {
        clearTimeout(dragTimeoutRef.current);
      }
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };
  }, []);

  const displayedShops = [...shop_list,];

  return (
    <div className="explore-shop" id="explore-shop">
      <div className="carousel-container">
        <button className="carousel-button left" onClick={handleLeftClick}>
          &lt;
        </button>
        <div 
          className={`explore-shop-list ${isDragging ? 'dragging' : ''} ${isMouseDown ? 'active-drag' : ''}`}
          ref={carouselRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        >
          {displayedShops.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className={`explore-shop-list-item ${active === item.name ? "active" : ""}`}
              onClick={() => !isDragging && setActive(item.name)}
            >
              <img src={item.image} alt={item.name} className="shop-image" />
              <p>{item.name}</p>
            </div>
          ))}
        </div>
        <button className="carousel-button right" onClick={handleRightClick}>
          &gt;
        </button>
      </div>
      <hr />
    </div>
  );
};

export default ExploreShop;
