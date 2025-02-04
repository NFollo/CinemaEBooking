import './MainFeatured.css';
import Carousel from './Carousel';

function MainFeatured() {
  return (
    <div className="MainFeatured">
      <div className="MainFeaturedText">
        Featured
      </div>
      <Carousel className="MainFeaturedCarousel" />
    </div>
  );
}

export default MainFeatured;
