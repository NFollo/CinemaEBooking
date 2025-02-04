import './CarouselItem.css';
import React from 'react';

function CarouselItem({item}) {
  return (
    <div className="CarouselItem">
        <div className="CarouselItemTitle">
            {item.title}
        </div>
        <img className="CarouselItemImage" src={item.icon} alt="alt"/>
        <div className="CarouselItemDesc">
            {item.description}
        </div>        
    </div>
  );
}

export default CarouselItem;
