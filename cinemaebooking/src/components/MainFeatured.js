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
            <div class="MainFeaturedCarouselVideoContainer">
              <iframe src="https://www.youtube.com/embed/qSu6i2iFMO0" title="sonic3">              
              </iframe>
            </div>
            <div className="MainFeaturedCarouselTitle">
              Sonic 3
            </div>
            <div className="MainFeaturedCarouselBody">
              A breif description of the movie goes here
            </div>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className="MainFeaturedCarouselItem">
            <div class="MainFeaturedCarouselVideoContainer">
              <iframe src="https://www.youtube.com/embed/G5kzUpWAusI" title="sonic3">              
              </iframe>
            </div>
            <div className="MainFeaturedCarouselTitle">
              Sonic 2
            </div>
            <div className="MainFeaturedCarouselBody">
              A breif description of the movie goes here
            </div>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className="MainFeaturedCarouselItem">
            <div class="MainFeaturedCarouselVideoContainer">
              <iframe src="https://www.youtube.com/embed/DHR3aHwMe2g" title="sonic3">              
              </iframe>
            </div>
            <div className="MainFeaturedCarouselTitle">
              Sonic 
            </div>
            <div className="MainFeaturedCarouselBody">
              A breif description of the movie goes here
            </div>
          </div>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}

export default MainFeatured;
