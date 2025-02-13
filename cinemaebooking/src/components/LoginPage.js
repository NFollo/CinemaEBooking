import "./LoginPage.css";
import { Link } from 'react-router-dom';
import LoginSignupCard from './LoginSignupCard';
import LoginForm from "./LoginForm";

function LoginPage() {
  return (
    <div className="LoginPage">
      <Link to={'/'}>
        <button className="loginhome">Home</button>
      </Link>  
      <LoginSignupCard text={<LoginForm />} /> 
    </div>
  );
}
/*this is bugged, it is not passing LoginForm properly*/
export default LoginPage;