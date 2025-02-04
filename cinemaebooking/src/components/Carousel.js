import './Carousel.css';
import React, {useState} from 'react';
import CarouselItem from './CarouselItem';

function Carousel() {

    const [activeIndex, setActiveIndex] = useState(0);

    const items = [
        {
            title: "pika1",
            description: "desc 1",
            icon: "https://img.pokemondb.net/artwork/original/pikachu-gen1.jpg"            
        },
        {
            title: "pika2",
            description: "desc 2",
            icon: "https://img.pokemondb.net/artwork/pikachu.jpg"            
        },
        {
            title: "pika3",
            description: "desc 3",
            icon: "https://img.pokemondb.net/artwork/original/pikachu-gen1-jp.jpg"            
        }
    ]   
    


    return (
        <div className="Carousel">
            <div className="CarouselInner" style={{ transform: `translate:(-${activeIndex *100})` }}>
                {items.map((item)=>{
                    return <CarouselItem item={item}/>;
                })}
            </div>
        </div>
    );
}

export default Carousel;
