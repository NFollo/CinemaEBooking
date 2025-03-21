import "./SignupPage.css";
import { Link } from 'react-router-dom';
import LoginSignupCard from './LoginSignupCard';
import SignupForm from "./SignupForm";

function SignupPage() {
  return (
    <div className="SignupPage">
      <Link to={'/'}>
        <button className="SignupPageHome">Home</button>
      </Link>  
      <LoginSignupCard form={<SignupForm />} /> 
      <div className="SignupPageSpacer"></div>
    </div>
  );
}

export default SignupPage;