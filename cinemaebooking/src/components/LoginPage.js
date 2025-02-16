import "./LoginPage.css";
import { Link } from 'react-router-dom';
import LoginSignupCard from './LoginSignupCard';
import LoginForm from "./LoginForm";

function LoginPage() {
  return (
    <div className="LoginPage">
      <Link to={'/'}>
        <button className="LoginPageHome">Home</button>
      </Link>  
      <LoginSignupCard form={<LoginForm />} /> 
    </div>
  );
}

export default LoginPage;