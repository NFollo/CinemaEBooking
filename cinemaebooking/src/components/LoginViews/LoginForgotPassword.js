import "./LoginPage.css";
import { Link } from 'react-router-dom';
import LoginSignupCard from './LoginSignupCard';
import LoginForgotPasswordForm from "./LoginForgotPasswordForm";

function LoginForgotPassword() {
  return (
    <div className="LoginPage">
      <Link to={'/'}>
        <button className="LoginPageHome">Home</button>
      </Link>  
      <LoginSignupCard form={<LoginForgotPasswordForm />} /> 
    </div>
  );
}

export default LoginForgotPassword;