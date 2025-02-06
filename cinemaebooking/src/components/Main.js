import './Main.css';
import NavBar from './NavBar';
import TitleBody from './TitleBody';
import MainFeatured from './MainFeatured';
import ComingSoon from './ComingSoon';

function Main() {
  return (
    <div className="Main">
      <NavBar />
      <TitleBody />
      <MainFeatured />
      <ComingSoon />
    </div>
  );
}

export default Main;
