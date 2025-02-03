import './Main.css';
import NavBar from './NavBar';
import TitleBody from './TitleBody';
import MainFeatured from './MainFeatured';

function Main() {
  return (
    <div className="Main">
      <NavBar />
      <TitleBody />
      <MainFeatured />
    </div>
  );
}

export default Main;
