import './MainFeatured.css';
//import Carousel from './Carousel';
import Carousel from 'react-bootstrap/Carousel';

function MainFeatured() {
  return (
    <div className="MainFeatured">
      <div className="MainFeaturedText">
        Featured
      </div>
      <Carousel className="MainFeaturedCarousel">
        <Carousel.Item>
          <div className="MainFeaturedCarouselItem">
            <div className="MainFeaturedCarouselVideoContainer">
              <iframe src="https://www.youtube.com/embed/qSu6i2iFMO0" title="sonic3">              
              </iframe>
            </div>
            <div className="MainFeaturedCarouselTitle">
              Sonic 3
            </div>
            <div className="MainFeaturedCarouselBody">
              Sonic and Tails must now fight their enemy, Shadow
            </div>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className="MainFeaturedCarouselItem">
            <div className="MainFeaturedCarouselVideoContainer">
              <iframe src="https://www.youtube.com/embed/G5kzUpWAusI" title="sonic3">              
              </iframe>
            </div>
            <div className="MainFeaturedCarouselTitle">
              Sonic 2
            </div>
            <div className="MainFeaturedCarouselBody">
              Sonic returns with his sidekick, Tails
            </div>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className="MainFeaturedCarouselItem">
            <div className="MainFeaturedCarouselVideoContainer">
              <iframe src="https://www.youtube.com/embed/DHR3aHwMe2g" title="sonic3">              
              </iframe>
            </div>
            <div className="MainFeaturedCarouselTitle">
              Sonic
            </div>
            <div className="MainFeaturedCarouselBody">
              Sonic the Hedgehog must fight Dr. Robotnik
            </div>
          </div>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}

export default MainFeatured;
